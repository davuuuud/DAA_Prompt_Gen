import * as CFB from 'cfb';
import { describe, expect, it } from 'vitest';
import { bereinigen, docText } from './doc';

// Die Testdateien werden hier nach [MS-DOC] zusammengesetzt statt aus Word
// übernommen: So ist jeder Sonderfall gezielt herstellbar, und die Tests
// laufen ohne Word. Gegen echte Dateien geprüft wurde der Leser zusätzlich
// am Bestand des Bildungsträgers (siehe Commit-Nachricht).

interface Stueck {
  text: string;
  /** true: 8-Bit Windows-1252, false: UTF-16LE. */
  komprimiert: boolean;
}

interface Bauplan {
  stuecke: Stueck[];
  /** Länge des Haupttextes; ohne Angabe der gesamte Text. */
  ccpText?: number;
  /** Längen der übrigen Textbereiche, die hinter dem Haupttext liegen. */
  bereiche?: Partial<Record<'ftn' | 'hdd' | 'atn' | 'edn' | 'txbx' | 'hdrTxbx', number>>;
  nFib?: number;
  verschluesselt?: boolean;
  /** Tabellenstrom: "1Table" (Regelfall) oder "0Table". */
  tabelle?: '0Table' | '1Table';
  /** Einen Formatierungsblock (Prc) vor die Stückliste setzen. */
  mitPrc?: boolean;
  /** Stückliste absichtlich hinter das Ende des Tabellenstroms zeigen lassen. */
  kaputt?: boolean;
}

// Umkehrtabelle für Windows-1252, aus dem Dekoder abgeleitet, damit Test und
// Leser dieselbe Zuordnung verwenden.
const CP1252: Map<string, number> = (() => {
  const dekoder = new TextDecoder('windows-1252');
  const tabelle = new Map<string, number>();
  for (let b = 0; b < 256; b++) tabelle.set(dekoder.decode(new Uint8Array([b])), b);
  return tabelle;
})();

function kodieren(stueck: Stueck): Uint8Array {
  if (stueck.komprimiert) {
    return Uint8Array.from([...stueck.text].map((zeichen) => {
      const b = CP1252.get(zeichen);
      if (b === undefined) throw new Error(`Nicht in Windows-1252: ${zeichen}`);
      return b;
    }));
  }
  const aus = new Uint8Array(stueck.text.length * 2);
  for (let i = 0; i < stueck.text.length; i++) {
    const code = stueck.text.charCodeAt(i);
    aus[i * 2] = code & 0xff;
    aus[i * 2 + 1] = code >> 8;
  }
  return aus;
}

function bauDoc(plan: Bauplan, eingebettet?: Bauplan): Uint8Array {
  const container = CFB.utils.cfb_new();
  // Ein eingebettetes Word-Objekt kommt zuerst in den Container, damit eine
  // Suche nach dem bloßen Stromnamen es vor dem eigentlichen Dokument fände.
  if (eingebettet) {
    const innen = bauStroeme(eingebettet);
    CFB.utils.cfb_add(container, '/ObjectPool/_1000000001/WordDocument', innen.wd);
    CFB.utils.cfb_add(container, `/ObjectPool/_1000000001/${innen.tabellenName}`, innen.tabelle);
  }
  const aussen = bauStroeme(plan);
  CFB.utils.cfb_add(container, '/WordDocument', aussen.wd);
  CFB.utils.cfb_add(container, `/${aussen.tabellenName}`, aussen.tabelle);
  return new Uint8Array(CFB.write(container, { type: 'buffer' }) as Uint8Array);
}

function bauStroeme(plan: Bauplan) {
  const FIB_GROESSE = 0x200;
  const kodiert = plan.stuecke.map(kodieren);
  const textBytes = kodiert.reduce((s, b) => s + b.length, 0);

  // --- WordDocument: FIB, danach die Textstücke -----------------------------
  const wd = new Uint8Array(FIB_GROESSE + textBytes);
  const w = new DataView(wd.buffer);
  const gesamtZeichen = plan.stuecke.reduce((s, st) => s + st.text.length, 0);

  w.setUint16(0x00, 0xa5ec, true); // wIdent
  w.setUint16(0x02, plan.nFib ?? 0x00c1, true);
  let flags = 0;
  if ((plan.tabelle ?? '1Table') === '1Table') flags |= 0x0200;
  if (plan.verschluesselt) flags |= 0x0100;
  w.setUint16(0x0a, flags, true);
  w.setUint16(0x20, 14, true); // csw
  w.setUint16(0x3e, 22, true); // cslw
  w.setUint32(0x4c, plan.ccpText ?? gesamtZeichen, true); // ccpText
  // Die übrigen Bereiche folgen in FibRgLw97 unmittelbar auf ccpText.
  const b = plan.bereiche ?? {};
  w.setUint32(0x50, b.ftn ?? 0, true); // ccpFtn
  w.setUint32(0x54, b.hdd ?? 0, true); // ccpHdd
  w.setUint32(0x5c, b.atn ?? 0, true); // ccpAtn
  w.setUint32(0x60, b.edn ?? 0, true); // ccpEdn
  w.setUint32(0x64, b.txbx ?? 0, true); // ccpTxbx
  w.setUint32(0x68, b.hdrTxbx ?? 0, true); // ccpHdrTxbx
  w.setUint16(0x98, 0x5d, true); // cbRgFcLcb

  const fcs: number[] = [];
  let versatz = FIB_GROESSE;
  kodiert.forEach((bytes, k) => {
    wd.set(bytes, versatz);
    // [MS-DOC] 2.9.73: komprimierte Stücke tragen die doppelte Position
    // und Bit 30.
    fcs.push(plan.stuecke[k].komprimiert ? (versatz * 2) | 0x40000000 : versatz);
    versatz += bytes.length;
  });

  // --- Tabellenstrom: Clx ---------------------------------------------------
  const n = plan.stuecke.length;
  const lcbPlc = (n + 1) * 4 + n * 8;
  const prc = plan.mitPrc ? [0x01, 0x03, 0x00, 0xaa, 0xbb, 0xcc] : [];
  const clx = new Uint8Array(prc.length + 5 + lcbPlc);
  const c = new DataView(clx.buffer);
  clx.set(prc, 0);
  let p = prc.length;
  clx[p] = 0x02;
  c.setUint32(p + 1, lcbPlc, true);
  p += 5;
  let cp = 0;
  for (let k = 0; k <= n; k++) {
    c.setUint32(p + k * 4, cp, true);
    if (k < n) cp += plan.stuecke[k].text.length;
  }
  for (let k = 0; k < n; k++) {
    c.setUint32(p + (n + 1) * 4 + k * 8 + 2, fcs[k], true);
  }

  // Stückliste hinter einen kleinen Vorspann legen, damit fcClx nicht 0 ist.
  const VORSPANN = 16;
  const tabelle = new Uint8Array(VORSPANN + clx.length);
  tabelle.set(clx, VORSPANN);
  w.setUint32(0x1a2, plan.kaputt ? VORSPANN + 1000 : VORSPANN, true); // fcClx
  w.setUint32(0x1a6, clx.length, true); // lcbClx

  return { wd, tabelle, tabellenName: plan.tabelle ?? '1Table' };
}

function textAus(daten: Uint8Array): string {
  const ergebnis = docText(daten);
  if (!ergebnis.ok) throw new Error(`Erwartet Text, erhalten: ${ergebnis.fehler}`);
  return ergebnis.text;
}

describe('docText – Text lesen', () => {
  it('liest 8-Bit-Text mit Umlauten, Paragraph und Eurozeichen', () => {
    // Das Eurozeichen liegt in Windows-1252 auf 0x80 - genau dem Bereich,
    // für den die Spezifikation eine eigene Zuordnung vorschreibt.
    const daten = bauDoc({
      stuecke: [
        {
          text: 'Kaufvertrag nach § 433 BGB\rDer Käufer zahlt 1.250 €.\rGröße, Straße, Öl.\r',
          komprimiert: true,
        },
      ],
    });
    expect(textAus(daten)).toBe(
      'Kaufvertrag nach § 433 BGB\nDer Käufer zahlt 1.250 €.\nGröße, Straße, Öl.',
    );
  });

  it('liest UTF-16-Text mit Zeichen außerhalb von Windows-1252', () => {
    const daten = bauDoc({
      stuecke: [{ text: 'Zweitsprache: Українська, Łódź, Ελληνικά.\r', komprimiert: false }],
    });
    expect(textAus(daten)).toBe('Zweitsprache: Українська, Łódź, Ελληνικά.');
  });

  it('setzt gemischte Stücke in der richtigen Reihenfolge zusammen', () => {
    const daten = bauDoc({
      stuecke: [
        { text: 'Vorher gewöhnlich, ', komprimiert: true },
        { text: 'dann Łódź, ', komprimiert: false },
        { text: 'danach wieder gewöhnlich.\r', komprimiert: true },
      ],
    });
    expect(textAus(daten)).toBe('Vorher gewöhnlich, dann Łódź, danach wieder gewöhnlich.');
  });

  it('ignoriert Zeichen jenseits aller angegebenen Bereiche', () => {
    const haupt = 'Haupttext.\r';
    const daten = bauDoc({
      stuecke: [{ text: haupt + 'Übrig.\r', komprimiert: true }],
      ccpText: haupt.length,
    });
    expect(textAus(daten)).toBe('Haupttext.');
  });

  it('liest auch den Tabellenstrom "0Table"', () => {
    const daten = bauDoc({ stuecke: [{ text: 'Ältere Datei.\r', komprimiert: true }], tabelle: '0Table' });
    expect(textAus(daten)).toBe('Ältere Datei.');
  });

  it('liest das Dokument selbst, nicht ein darin eingebettetes Word-Objekt', () => {
    // Im echten Bestand gefunden: Vier Dateien mit eingebettetem Word-Objekt
    // wurden als beschädigt gemeldet, weil die Suche nach dem Stromnamen
    // "1Table" zuerst das eingebettete Objekt traf. Bei anderer Reihenfolge
    // wäre still der falsche Text geliefert worden.
    const daten = bauDoc(
      { stuecke: [{ text: 'Das eigentliche Dokument.\r', komprimiert: true }] },
      { stuecke: [{ text: 'Nur ein eingebettetes Objekt.\r', komprimiert: true }] },
    );

    // Vorbedingung: Die Falle muss im Test auch zuschnappen können — die
    // Suche nach dem bloßen Namen muss bei mindestens einem der beiden
    // Ströme das eingebettete Objekt treffen. Welcher es ist, hängt von der
    // Reihenfolge im Container ab: im echten Bestand war es 1Table, in
    // diesem Testcontainer ist es WordDocument.
    const container = CFB.read(daten, { type: 'array' });
    const gleicheBytes = (a: ArrayLike<number>, b: ArrayLike<number>) =>
      a.length === b.length && Array.from(a).every((wert, i) => wert === b[i]);
    const trifftFalschen = (name: string) => {
      const perName = CFB.find(container, name)?.content;
      const perPfad = CFB.find(container, `/${name}`)?.content;
      expect(perName, `${name} per Name`).toBeDefined();
      expect(perPfad, `${name} per Pfad`).toBeDefined();
      return !gleicheBytes(perName!, perPfad!);
    };
    expect(trifftFalschen('WordDocument') || trifftFalschen('1Table')).toBe(true);

    expect(textAus(daten)).toBe('Das eigentliche Dokument.');
  });

  it('überspringt Formatierungsblöcke vor der Stückliste', () => {
    const daten = bauDoc({ stuecke: [{ text: 'Mit Vorspann.\r', komprimiert: true }], mitPrc: true });
    expect(textAus(daten)).toBe('Mit Vorspann.');
  });
});

describe('docText – Textbereiche', () => {
  // Reihenfolge im Zeichenstrom: Haupttext, Fußnoten, Kopf-/Fußzeilen,
  // Kommentare, Endnoten, Textfelder, Textfelder in Kopfzeilen.
  const haupt = 'Buchungssatz: Bank an Forderungen.\r';
  const fussnote = 'Siehe § 238 HGB.\r';
  const kopf = 'Seite 1 von 3 — Name: Muster\r';
  const kommentar = 'Bitte prüfen.\r';
  const endnote = 'Stand 2004.\r';
  const textfeld = 'Merke: Soll links, Haben rechts.\r';
  const kopfTextfeld = 'DAA Logo\r';

  const daten = bauDoc({
    stuecke: [
      {
        text: haupt + fussnote + kopf + kommentar + endnote + textfeld + kopfTextfeld,
        komprimiert: true,
      },
    ],
    ccpText: haupt.length,
    bereiche: {
      ftn: fussnote.length,
      hdd: kopf.length,
      atn: kommentar.length,
      edn: endnote.length,
      txbx: textfeld.length,
      hdrTxbx: kopfTextfeld.length,
    },
  });
  const text = textAus(daten);

  it('liest Haupttext, Fußnoten, Endnoten und Textfelder', () => {
    expect(text).toBe(
      'Buchungssatz: Bank an Forderungen.\n\n' +
        'Siehe § 238 HGB.\n\n' +
        'Stand 2004.\n\n' +
        'Merke: Soll links, Haben rechts.',
    );
  });

  it('lässt Kopf- und Fußzeilen weg — dort stehen am ehesten Namen', () => {
    expect(text).not.toContain('Seite 1');
    expect(text).not.toContain('Muster');
    expect(text).not.toContain('DAA Logo');
  });

  it('lässt Kommentare weg', () => {
    expect(text).not.toContain('Bitte prüfen');
  });

  it('liest Textfelder auch bei fast leerem Haupttext', () => {
    // Im Bestand trug bei einer Datei das Textfeld mehr Text als der
    // Haupttext selbst.
    const nurTextfeld = bauDoc({
      stuecke: [{ text: '\r' + 'Aufgabe 1: Bilde den Buchungssatz.\r', komprimiert: true }],
      ccpText: 1,
      bereiche: { txbx: 'Aufgabe 1: Bilde den Buchungssatz.\r'.length },
    });
    expect(textAus(nurTextfeld)).toBe('Aufgabe 1: Bilde den Buchungssatz.');
  });

  it('lässt ein offenes Feld nicht in den nächsten Bereich hinüberreichen', () => {
    // Ein Feld, dessen Ende fehlt, darf den folgenden Bereich nicht
    // verschlucken - jeder Bereich wird für sich bereinigt.
    const kaputtesFeld = 'Text \x13 PAGE \r';
    const folgendes = 'Textfeld bleibt.\r';
    const d = bauDoc({
      stuecke: [{ text: kaputtesFeld + folgendes, komprimiert: true }],
      ccpText: kaputtesFeld.length,
      bereiche: { txbx: folgendes.length },
    });
    expect(textAus(d)).toContain('Textfeld bleibt.');
  });

});

describe('docText – Felder und Tabellen', () => {
  it('behält vom Hyperlink den sichtbaren Text, nicht die Adresse', () => {
    const daten = bauDoc({
      stuecke: [
        {
          text:
            'Siehe \x13 HYPERLINK "https://www.gesetze-im-internet.de" ' +
            '\x14gesetze-im-internet.de\x15 für den Wortlaut.\r',
          komprimiert: true,
        },
      ],
    });
    const text = textAus(daten);
    expect(text).toBe('Siehe gesetze-im-internet.de für den Wortlaut.');
    expect(text).not.toContain('HYPERLINK');
  });

  it('legt Tabellen zeilenweise mit Tabulatoren ab', () => {
    const daten = bauDoc({
      stuecke: [
        {
          text:
            'Buchungssatz:\r' +
            'Konto\x07Soll\x07Haben\x07\x07' +
            'Forderungen\x071.190 €\x070 €\x07\x07' +
            'Ende der Tabelle.\r',
          komprimiert: true,
        },
      ],
    });
    expect(textAus(daten)).toBe(
      'Buchungssatz:\nKonto\tSoll\tHaben\nForderungen\t1.190 €\t0 €\nEnde der Tabelle.',
    );
  });
});

describe('docText – erkennbare Fehler', () => {
  it('meldet eine leere Datei', () => {
    expect(docText(new Uint8Array())).toMatchObject({ ok: false, fehler: 'leer' });
  });

  it('erkennt eine .docx, die nur .doc heißt', () => {
    const zip = Uint8Array.from([0x50, 0x4b, 0x03, 0x04, 0x14, 0x00, 0x06, 0x00]);
    expect(docText(zip)).toMatchObject({ ok: false, fehler: 'docx' });
  });

  it('erkennt eine RTF-Datei, die nur .doc heißt', () => {
    const rtf = new TextEncoder().encode('{\\rtf1\\ansi Text}');
    expect(docText(rtf)).toMatchObject({ ok: false, fehler: 'rtf' });
  });

  it('weist beliebige andere Daten zurück', () => {
    const muell = new TextEncoder().encode('Das ist nur eine Textdatei.');
    expect(docText(muell)).toMatchObject({ ok: false, fehler: 'kein-word' });
  });

  it('weist eine andere Office-Datei im selben Container zurück', () => {
    // Excel- und PowerPoint-Dateien alten Formats nutzen denselben Container,
    // haben aber keinen WordDocument-Strom.
    const container = CFB.utils.cfb_new();
    CFB.utils.cfb_add(container, '/Workbook', new Uint8Array(64));
    const xls = new Uint8Array(CFB.write(container, { type: 'buffer' }) as Uint8Array);
    expect(docText(xls)).toMatchObject({ ok: false, fehler: 'kein-word' });
  });

  it('meldet Word 95 und älter', () => {
    const daten = bauDoc({ stuecke: [{ text: 'Alt.\r', komprimiert: true }], nFib: 0x0065 });
    expect(docText(daten)).toMatchObject({ ok: false, fehler: 'zu-alt' });
  });

  it('meldet kennwortgeschützte Dateien, statt Unsinn zu lesen', () => {
    const daten = bauDoc({ stuecke: [{ text: 'Geheim.\r', komprimiert: true }], verschluesselt: true });
    const ergebnis = docText(daten);
    expect(ergebnis).toMatchObject({ ok: false, fehler: 'verschluesselt' });
    if (!ergebnis.ok) expect(ergebnis.meldung).toContain('Kennwort');
  });

  it('meldet eine beschädigte Stückliste, statt abzustürzen', () => {
    const daten = bauDoc({ stuecke: [{ text: 'Kaputt.\r', komprimiert: true }], kaputt: true });
    expect(docText(daten)).toMatchObject({ ok: false, fehler: 'beschaedigt' });
  });

  it('meldet einen abgeschnittenen Container, statt abzustürzen', () => {
    const daten = bauDoc({ stuecke: [{ text: 'Abgeschnitten.\r', komprimiert: true }] });
    const ergebnis = docText(daten.subarray(0, 600));
    expect(ergebnis.ok).toBe(false);
  });

  it('liefert zu jedem Fehler eine lesbare Meldung', () => {
    const faelle = [
      new Uint8Array(),
      Uint8Array.from([0x50, 0x4b, 0x03, 0x04]),
      new TextEncoder().encode('{\\rtf1}'),
      new TextEncoder().encode('xyz'),
    ];
    for (const daten of faelle) {
      const ergebnis = docText(daten);
      expect(ergebnis.ok).toBe(false);
      if (!ergebnis.ok) expect(ergebnis.meldung.length).toBeGreaterThan(10);
    }
  });
});

describe('bereinigen', () => {
  it('lässt verschachtelte Felder nur mit ihrem Ergebnis stehen', () => {
    // Äußeres Feld, in dessen Code ein zweites Feld steckt.
    const roh = 'A\x13 IF \x13 DATE \x142026\x15 = 2026 "ja" \x14ja\x15B';
    expect(bereinigen(roh)).toBe('AjaB');
  });

  it('verwirft Felder ohne sichtbares Ergebnis vollständig', () => {
    expect(bereinigen('Vor\x13 TOC \\o \x15nach')).toBe('Vornach');
  });

  it('wandelt Umbrüche und Sonderzeichen um', () => {
    const roh =
      'Zeile\x0Bumbruch\x0CSeite\r' + // manueller Umbruch, Seitenwechsel
      'Bild\x01weg\r' + // Platzhalter für ein Bild
      'Schutz\x1Estrich\u00A0Leer\r'; // geschützter Trennstrich, geschütztes Leerzeichen
    expect(bereinigen(roh)).toBe('Zeile\numbruch\nSeite\nBildweg\nSchutz-strich Leer');
  });

  it('fasst lange Leerstrecken zusammen und schneidet Ränder ab', () => {
    expect(bereinigen('\r\rA   \r\r\r\r\rB\r\r')).toBe('A\n\nB');
  });
});
