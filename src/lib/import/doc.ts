// Text aus alten Word-Dateien (.doc, Word 97 bis 2003) lesen.
//
// Die Anwendung braucht aus einer .doc-Datei keine .docx-Datei, sondern den
// Text — für die Stichwortsuche und die Belegstellen im Prompt. Eine
// formatgetreue Umwandlung wäre im Browser kaum zu leisten; den Text zu
// lesen dagegen schon, weil das Format ihn an einer genau beschriebenen
// Stelle ablegt.
//
// Aufbau einer .doc-Datei, soweit er hier gebraucht wird:
//
//   Container (OLE2)  – ein kleines Dateisystem in der Datei; das Auspacken
//                       übernimmt die Bibliothek cfb.
//   "WordDocument"    – beginnt mit dem FIB, einem Inhaltsverzeichnis mit
//                       festen Positionen. Daraus: Textlänge, Lage der
//                       Stückliste, welcher Tabellenstrom gilt.
//   "0Table"/"1Table" – enthält die Stückliste (Clx). Sie sagt, wo welcher
//                       Abschnitt des Textes im WordDocument liegt und ob er
//                       als 8-Bit-Text oder als UTF-16 gespeichert ist.
//
// Maßgeblich ist die Spezifikation [MS-DOC] von Microsoft. Die Stellen, auf
// die sich der Code stützt, sind jeweils mit Abschnittsnummer angegeben.

import * as CFB from 'cfb';

export type DocFehler =
  | 'leer'
  | 'docx'
  | 'rtf'
  | 'kein-word'
  | 'zu-alt'
  | 'verschluesselt'
  | 'beschaedigt';

export type DocErgebnis =
  | { ok: true; text: string }
  | { ok: false; fehler: DocFehler; meldung: string };

const MELDUNGEN: Record<DocFehler, string> = {
  leer: 'Die Datei ist leer.',
  docx:
    'Diese Datei ist bereits im neueren Word-Format (.docx) gespeichert, trägt ' +
    'aber die Endung .doc.',
  rtf:
    'Diese Datei ist im RTF-Format gespeichert, trägt aber die Endung .doc. ' +
    'Bitte in Word öffnen und als .docx speichern.',
  'kein-word':
    'Das ist keine Word-Datei. Möglicherweise wurde eine Excel- oder ' +
    'PowerPoint-Datei umbenannt.',
  'zu-alt':
    'Diese Datei stammt aus Word 95 oder älter und lässt sich nicht lesen. ' +
    'Bitte in Word öffnen und als .docx speichern.',
  verschluesselt:
    'Die Datei ist kennwortgeschützt. Bitte in Word öffnen und ohne Kennwort ' +
    'speichern.',
  beschaedigt: 'Die Datei ist beschädigt oder unvollständig.',
};

function fehler(art: DocFehler): DocErgebnis {
  return { ok: false, fehler: art, meldung: MELDUNGEN[art] };
}

const SIGNATUR_OLE = [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1];
const SIGNATUR_ZIP = [0x50, 0x4b, 0x03, 0x04];
const SIGNATUR_RTF = [0x7b, 0x5c, 0x72, 0x74, 0x66]; // "{\rtf"

function beginntMit(daten: Uint8Array, signatur: number[]): boolean {
  return signatur.every((wert, i) => daten[i] === wert);
}

/** Inhalt eines Stroms als Uint8Array, gleich in welcher Form cfb ihn liefert. */
function alsBytes(inhalt: unknown): Uint8Array | null {
  if (inhalt instanceof Uint8Array) return inhalt;
  if (Array.isArray(inhalt)) return Uint8Array.from(inhalt);
  return null;
}

/** Sichere Leser: Außerhalb der Daten gibt es null statt einer Ausnahme. */
function leser(daten: Uint8Array) {
  const sicht = new DataView(daten.buffer, daten.byteOffset, daten.byteLength);
  const passt = (pos: number, laenge: number) => pos >= 0 && pos + laenge <= daten.length;
  return {
    u8: (pos: number) => (passt(pos, 1) ? sicht.getUint8(pos) : null),
    u16: (pos: number) => (passt(pos, 2) ? sicht.getUint16(pos, true) : null),
    i16: (pos: number) => (passt(pos, 2) ? sicht.getInt16(pos, true) : null),
    u32: (pos: number) => (passt(pos, 4) ? sicht.getUint32(pos, true) : null),
  };
}

// Zeichensätze der beiden Speicherformen [MS-DOC] 2.9.73 FcCompressed.
// "windows-1252" nach WHATWG deckt sich für 0x80–0x9F mit der Tabelle, die
// die Spezifikation für komprimierten Text vorschreibt.
const DEKODER_8BIT = new TextDecoder('windows-1252');
const DEKODER_UTF16 = new TextDecoder('utf-16le');

export function docText(daten: Uint8Array): DocErgebnis {
  if (daten.length === 0) return fehler('leer');

  // Häufiger als man denkt: Dateien, die nur .doc heißen. Eine eigene
  // Meldung ist hier mehr wert als "beschädigt".
  if (beginntMit(daten, SIGNATUR_ZIP)) return fehler('docx');
  if (beginntMit(daten, SIGNATUR_RTF)) return fehler('rtf');
  if (!beginntMit(daten, SIGNATUR_OLE)) return fehler('kein-word');

  let container: CFB.CFB$Container;
  try {
    container = CFB.read(daten, { type: 'array' });
  } catch {
    return fehler('beschaedigt');
  }

  // Ströme IMMER über den Pfad ab der Wurzel suchen, nie über den bloßen
  // Namen: Eingebettete Word-Objekte liegen unter ObjectPool/… und tragen
  // dieselben Stromnamen. Die Suche nach "1Table" fand im echten Bestand
  // zuerst das eingebettete Objekt — je nach Reihenfolge wäre sonst still
  // der Text des falschen Dokuments gelesen worden.
  const strom = (name: string) => alsBytes(CFB.find(container, `/${name}`)?.content);

  // Ein OLE-Container ohne WordDocument-Strom ist eine andere Office-Datei.
  const wortStrom = strom('WordDocument');
  if (!wortStrom) return fehler('kein-word');
  const wd = leser(wortStrom);

  // --- FIB, [MS-DOC] 2.5.1 ------------------------------------------------
  if (wd.u16(0x00) !== 0xa5ec) return fehler('kein-word'); // wIdent
  const nFib = wd.u16(0x02);
  // Word 97 und später tragen hier 0x00C1; Word 6 und 95 deutlich weniger.
  // 0x00C0 wird geduldet, weil manche Fremdprogramme es so schreiben.
  if (nFib === null || nFib < 0x00c0) return fehler('zu-alt');

  const flags = wd.u16(0x0a);
  if (flags === null) return fehler('beschaedigt');
  const fEncrypted = (flags & 0x0100) !== 0;
  const fWhichTblStm = (flags & 0x0200) !== 0;
  if (fEncrypted) return fehler('verschluesselt');

  // Der FIB hat Teile variabler Länge. Statt fester Positionen zu glauben,
  // werden die Längenangaben gelesen und die Positionen berechnet.
  let pos = 0x20;
  const csw = wd.u16(pos); // Anzahl 16-Bit-Werte in fibRgW
  if (csw === null) return fehler('beschaedigt');
  pos += 2 + csw * 2;
  const cslw = wd.u16(pos); // Anzahl 32-Bit-Werte in fibRgLw
  if (cslw === null) return fehler('beschaedigt');
  const fibRgLw = pos + 2;
  pos = fibRgLw + cslw * 4;
  const cbRgFcLcb = wd.u16(pos); // Anzahl Paare in fibRgFcLcb
  if (cbRgFcLcb === null || cbRgFcLcb < 34) return fehler('beschaedigt');
  const fibRgFcLcb = pos + 2;

  // Längen der Textbereiche in Zeichen, FibRgLw97 ab dem 4. Wert,
  // [MS-DOC] 2.5.4. Sie liegen in dieser Reihenfolge hintereinander im
  // Zeichenstrom des Dokuments.
  if (cslw < 11) return fehler('beschaedigt');
  const laengen = BEREICHE.map((_, k) => wd.u32(fibRgLw + (3 + k) * 4));
  if (laengen.some((l) => l === null)) return fehler('beschaedigt');
  const bereichLaenge = laengen as number[];

  // fcClx/lcbClx: 34. Paar in FibRgFcLcb97, [MS-DOC] 2.5.6.
  const fcClx = wd.u32(fibRgFcLcb + 33 * 8);
  const lcbClx = wd.u32(fibRgFcLcb + 33 * 8 + 4);
  if (fcClx === null || lcbClx === null || lcbClx === 0) return fehler('beschaedigt');

  // Gelesen wird bis zum Ende des letzten Bereichs, der gebraucht wird.
  const letzterGebrauchter = Math.max(...BEREICHE.flatMap((b, k) => (b.lesen ? [k] : [])));
  const benoetigt = bereichLaenge.slice(0, letzterGebrauchter + 1).reduce((s, l) => s + l, 0);

  // --- Clx, [MS-DOC] 2.9.38 -------------------------------------------------
  const tabellenStrom = strom(fWhichTblStm ? '1Table' : '0Table');
  if (!tabellenStrom || fcClx + lcbClx > tabellenStrom.length) return fehler('beschaedigt');
  const clx = tabellenStrom.subarray(fcClx, fcClx + lcbClx);
  const cl = leser(clx);

  // Vorangestellte Formatierungsblöcke (Prc, clxt = 0x01) überspringen.
  let i = 0;
  while (cl.u8(i) === 0x01) {
    const cbGrpprl = cl.i16(i + 1);
    if (cbGrpprl === null || cbGrpprl < 0) return fehler('beschaedigt');
    i += 3 + cbGrpprl;
  }
  if (cl.u8(i) !== 0x02) return fehler('beschaedigt'); // Pcdt
  const lcbPlc = cl.u32(i + 1);
  if (lcbPlc === null || (lcbPlc - 4) % 12 !== 0) return fehler('beschaedigt');
  const plcStart = i + 5;
  const anzahlStuecke = (lcbPlc - 4) / 12;

  // --- Stücke einsammeln, [MS-DOC] 2.9.177 PlcPcd, 2.9.178 Pcd --------------
  const teile: string[] = [];
  let gelesen = 0;
  for (let k = 0; k < anzahlStuecke && gelesen < benoetigt; k++) {
    const cpAnfang = cl.u32(plcStart + k * 4);
    const cpEnde = cl.u32(plcStart + (k + 1) * 4);
    const fcRoh = cl.u32(plcStart + (anzahlStuecke + 1) * 4 + k * 8 + 2);
    if (cpAnfang === null || cpEnde === null || fcRoh === null || cpEnde < cpAnfang) {
      return fehler('beschaedigt');
    }
    const anzahl = cpEnde - cpAnfang;
    const komprimiert = (fcRoh & 0x40000000) !== 0;
    const fc = fcRoh & 0x3fffffff;

    let text: string;
    if (komprimiert) {
      const start = fc / 2;
      if (start + anzahl > wortStrom.length) return fehler('beschaedigt');
      text = DEKODER_8BIT.decode(wortStrom.subarray(start, start + anzahl));
    } else {
      if (fc + anzahl * 2 > wortStrom.length) return fehler('beschaedigt');
      text = DEKODER_UTF16.decode(wortStrom.subarray(fc, fc + anzahl * 2));
    }
    teile.push(text);
    gelesen += anzahl;
  }

  // Den Zeichenstrom in seine Bereiche zerlegen und nur die gebrauchten
  // behalten. Jeder Bereich wird für sich bereinigt, damit ein offenes Feld
  // am Ende eines Bereichs nicht in den nächsten hinüberreicht.
  const alles = teile.join('');
  const ausgewaehlt: string[] = [];
  let anfang = 0;
  BEREICHE.forEach((bereich, k) => {
    const ende = anfang + bereichLaenge[k];
    if (bereich.lesen) {
      const text = bereinigen(alles.slice(anfang, ende));
      if (text) ausgewaehlt.push(text);
    }
    anfang = ende;
  });

  return { ok: true, text: ausgewaehlt.join('\n\n') };
}

/**
 * Die Textbereiche eines Word-Dokuments in der Reihenfolge, in der sie im
 * Zeichenstrom liegen, [MS-DOC] 2.5.4 FibRgLw97.
 *
 * Welche gelesen werden, ist am Bestand des Bildungsträgers entschieden
 * (778 Dateien, September 2026): Textfelder stehen in fast jeder fünften
 * Datei und tragen auf Arbeitsblättern oft die Begriffe, auf die es
 * ankommt. Kopf- und Fußzeilen stehen zwar in drei von vier Dateien, aber
 * mit rund 85 Zeichen je Datei — Seitenzahlen, Schulname, „Name: ____".
 * Für die Suche ist das Rauschen, und dort stehen am ehesten Namen von
 * Dozenten oder Teilnehmenden.
 */
const BEREICHE: { name: string; lesen: boolean }[] = [
  { name: 'Haupttext', lesen: true }, // ccpText
  { name: 'Fußnoten', lesen: true }, // ccpFtn
  { name: 'Kopf- und Fußzeilen', lesen: false }, // ccpHdd
  { name: '(unbenutzt)', lesen: false }, // ccpMcr
  { name: 'Kommentare', lesen: false }, // ccpAtn
  { name: 'Endnoten', lesen: true }, // ccpEdn
  { name: 'Textfelder', lesen: true }, // ccpTxbx
  { name: 'Textfelder in Kopfzeilen', lesen: false }, // ccpHdrTxbx
];

/**
 * Word legt Absätze, Tabellen und Felder als Steuerzeichen im Text ab,
 * [MS-DOC] 2.8.25 ff. Übrig bleiben soll lesbarer Text mit Zeilenumbrüchen.
 */
export function bereinigen(roh: string): string {
  // Felder: 0x13 Beginn, 0x14 Trenner, 0x15 Ende. Zwischen Beginn und Trenner
  // steht der Feldcode (etwa HYPERLINK "https://…"), dahinter das sichtbare
  // Ergebnis. Nur das Ergebnis gehört in den Text. Felder können
  // verschachtelt sein, daher ein Stapel.
  const stapel: ('code' | 'ergebnis')[] = [];
  let ohneFelder = '';
  for (const zeichen of roh) {
    if (zeichen === '\x13') {
      stapel.push('code');
    } else if (zeichen === '\x14') {
      if (stapel.length) stapel[stapel.length - 1] = 'ergebnis';
    } else if (zeichen === '\x15') {
      stapel.pop();
    } else if (!stapel.includes('code')) {
      ohneFelder += zeichen;
    }
  }

  return (
    ohneFelder
      // Tabellen: 0x07 beendet jede Zelle; auf die letzte Zelle einer Zeile
      // folgt ein weiteres 0x07 als Zeilenende.
      .replace(/\x07\x07/g, '\n')
      .replace(/\x07/g, '\t')
      // Absatz, manueller Zeilenumbruch, Seiten- und Abschnittswechsel.
      .replace(/[\r\x0B\x0C]/g, '\n')
      // Geschützter Trennstrich und geschütztes Leerzeichen.
      .replace(/\x1E/g, '-')
      .replace(/\u00A0/g, ' ')
      // Übrige Steuerzeichen: Platzhalter für Bilder, Fußnotenzeichen,
      // weiche Trennstriche und Ähnliches.
      .replace(/[\x00-\x08\x0E-\x1F]/g, '')
      .split('\n')
      .map((zeile) => zeile.replace(/[ \t]+$/, ''))
      .join('\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim()
  );
}
