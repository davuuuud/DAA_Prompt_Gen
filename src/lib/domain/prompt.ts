// Aufbau des fertigen Prompts.
//
// Erzeugt "\n" als Zeilenumbruch; die Umwandlung in Windows-Zeilenenden
// geschieht erst bei der Ausgabe (toCRLF). Das Thema steht in einem eigenen
// Abschnitt statt eingebettet im Auftragssatz - mehrzeilige Themen bleiben
// dadurch lesbar.

import { findAufgabe, findBeruf, findFormat, findNiveau, OPTIONEN } from './catalogs';
import { quellenBezeichnungen } from './quellen';
import { collapseBlankLines, parseAnzahl, splitFreitext, truncateWords } from './text';
import type { Fundstelle, OptionId, PromptInput } from './types';

/** Zeichenbudget je Belegstelle, damit der Prompt handhabbar bleibt. */
export const MAX_FUNDSTELLE_ZEICHEN = 1200;

export interface Validierung {
  ok: boolean;
  /** Für Menschen lesbare Meldung; leer, wenn alles stimmt. */
  meldung: string;
  /** Feld, auf das die Oberfläche den Fokus setzen sollte. */
  feld?: 'thema' | 'zusatz';
}

export function validate(input: PromptInput): Validierung {
  if (input.thema.trim() === '') {
    return {
      ok: false,
      meldung: 'Bitte zuerst ein Thema oder eine konkrete Fragestellung eingeben.',
      feld: 'thema',
    };
  }
  if (findAufgabe(input.aufgabe).needsZusatz && input.zusatz.trim() === '') {
    return {
      ok: false,
      meldung:
        'Für das Kontrollieren einer Lösung bitte die eigene Lösung unter ' +
        '"Zusätzliche Angaben" eintragen.',
      feld: 'zusatz',
    };
  }
  return { ok: true, meldung: '' };
}

/** Alle Quellenbezeichnungen: kuratierte Auswahl plus Freitext. */
export function alleQuellen(input: PromptInput): string[] {
  const katalog = quellenBezeichnungen(input.beruf, input.quellen);
  const frei = splitFreitext(input.quellenFreitext);
  const gesehen = new Set<string>();
  return [...katalog, ...frei].filter((eintrag) => {
    const schluessel = eintrag.toLocaleLowerCase('de-DE');
    if (gesehen.has(schluessel)) return false;
    gesehen.add(schluessel);
    return true;
  });
}

function formatFundstelle(fundstelle: Fundstelle, index: number): string {
  const herkunft = fundstelle.stelle
    ? `${fundstelle.dokument}, ${fundstelle.stelle}`
    : fundstelle.dokument;
  const text = truncateWords(collapseBlankLines(fundstelle.text), MAX_FUNDSTELLE_ZEICHEN);
  return `[${index + 1}] ${herkunft}\n"""\n${text}\n"""`;
}

export function buildPrompt(input: PromptInput): string {
  const teile: string[] = [];
  const abschnitt = (titel: string, inhalt: string[]) => {
    if (inhalt.length === 0) return;
    teile.push(`${titel}\n${inhalt.join('\n')}`);
  };
  const punkte = (zeilen: string[]) => zeilen.map((zeile) => `- ${zeile}`);

  const beruf = findBeruf(input.beruf);
  const aufgabe = findAufgabe(input.aufgabe);
  const anzahl = parseAnzahl(input.anzahl);
  const aktiv = (id: OptionId) => input.optionen.includes(id);
  const fundstellen = input.fundstellen ?? [];

  // --- ROLLE ---------------------------------------------------------------
  // Die Prüfungsstelle wird benannt statt pauschal "IHK": Steuerfachangestellte
  // prüft die Steuerberaterkammer, und nicht alle Berufe im Katalog sind
  // kaufmännisch.
  const pruefstelle = beruf.pruefstelle ?? 'IHK';
  abschnitt('ROLLE', [
    'Du bist eine erfahrene Lehrkraft für die berufliche Aus- und Weiterbildung in ' +
      `Deutschland und kennst die Prüfungsanforderungen der ${pruefstelle}.`,
    beruf.id === 'allgemein'
      ? 'Ich mache eine Umschulung und lerne für die Abschlussprüfung.'
      : `Ich mache eine Umschulung zum/zur ${beruf.label} und lerne für die Abschlussprüfung ` +
        `vor der ${pruefstelle}.`,
  ]);

  // --- AUFGABE -------------------------------------------------------------
  abschnitt('AUFGABE', [aufgabe.instruction({ anzahl })]);

  // --- THEMA ---------------------------------------------------------------
  abschnitt('THEMA', [collapseBlankLines(input.thema.trim())]);

  // --- ZUSÄTZLICHE ANGABEN -------------------------------------------------
  const zusatz = collapseBlankLines(input.zusatz.trim());
  if (zusatz) abschnitt('ZUSÄTZLICHE ANGABEN', [zusatz]);

  // --- BELEGSTELLEN --------------------------------------------------------
  // Ausschnitte aus den eigenen Unterlagen. Sie stehen vor den Anforderungen,
  // damit die Regel "vorrangig hierauf stützen" sich auf bereits Gelesenes
  // bezieht.
  if (fundstellen.length > 0) {
    abschnitt('BELEGSTELLEN AUS MEINEN UNTERLAGEN', [
      'Die folgenden Ausschnitte stammen aus meinem eigenen Lernmaterial.',
      '',
      ...fundstellen.map(formatFundstelle),
    ]);
  }

  // --- ANFORDERUNGEN -------------------------------------------------------
  const anforderungen = [
    `Niveau: ${findNiveau(input.niveau).label}.`,
    `Ausgabeform: ${findFormat(input.format).label}.`,
    ...OPTIONEN.filter((option) => option.rule && aktiv(option.id)).map((option) => option.rule),
  ];
  abschnitt('ANFORDERUNGEN', punkte(anforderungen));

  // --- QUELLEN -------------------------------------------------------------
  const quellen = alleQuellen(input);
  const quellenRegeln: string[] = [];
  if (fundstellen.length > 0) {
    quellenRegeln.push(
      'Stütze dich vorrangig auf die oben angeführten Belegstellen und verweise mit deren ' +
        'Nummer, wenn du sie verwendest.',
      'Wenn die Belegstellen eine Frage nicht abdecken, sage das ausdrücklich, bevor du auf ' +
        'allgemeines Wissen zurückgreifst.',
    );
  }
  if (quellen.length > 0) {
    quellenRegeln.push(
      `Belege rechtliche oder fachlich strittige Aussagen bevorzugt aus diesen Quellen: ${quellen.join('; ')}.`,
      'Nenne Paragraphen nur, wenn sie tatsächlich einschlägig sind, und weise auf einen ' +
        'möglicherweise veralteten Rechtsstand hin.',
    );
  }
  abschnitt('QUELLEN', punkte(quellenRegeln));

  // --- QUALITÄTSREGELN -----------------------------------------------------
  abschnitt(
    'QUALITÄTSREGELN',
    punkte([
      'Erfinde keine Quellen, Paragraphen, Urteile, Fundstellen, Zahlen oder Statistiken. ' +
        'Lieber weniger sagen als etwas Unzutreffendes.',
      'Kennzeichne ausdrücklich, was gesichertes Prüfungswissen ist und was Einschätzung, ' +
        'Vereinfachung oder Lernhilfe.',
      'Benenne Unsicherheiten offen, statt sie sprachlich zu überspielen.',
      'Rechne Zahlenbeispiele vollständig vor, nenne die Einheiten und prüfe das Ergebnis auf ' +
        'Plausibilität.',
      'Strukturiere logisch, vermeide Wiederholungen, Füllsätze und Werbesprache.',
    ]),
  );

  // --- AUSGABE -------------------------------------------------------------
  abschnitt(
    'AUSGABE',
    punkte([
      'Antworte auf Deutsch.',
      'Beginne unmittelbar mit dem Ergebnis, ohne Vorrede über dich selbst oder die Aufgabenstellung.',
      'Trenne Lösungen, Musterlösungen und Erwartungshorizonte immer sichtbar vom Aufgabenteil, ' +
        'damit ich zuerst selbst überlegen kann.',
      aktiv('rueckfragen')
        ? 'Wenn dir wichtige Angaben fehlen, stelle zuerst höchstens drei gezielte Rückfragen und ' +
          'warte meine Antwort ab.'
        : 'Stelle keine Rückfragen. Triff bei fehlenden Angaben plausible Annahmen und mache diese ' +
          'am Anfang transparent.',
    ]),
  );

  return teile.join('\n\n') + '\n';
}
