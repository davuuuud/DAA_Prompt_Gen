// Die Auswahlkataloge. Beschriftung und Verhalten stehen bewusst an einer
// Stelle beieinander - in der Vorgängerfassung lagen Label und Auftragstext
// in zwei getrennten Strukturen, die auseinanderlaufen konnten.

import type {
  Aufgabe,
  Ausgabeformat,
  Beruf,
  Niveau,
  Option,
} from './types';
import { plural } from './text';

// Auswahl, Schreibweise und Kürzel stammen vom Bildungsträger. Die
// kaufmännische Grundqualifikation steht voran, alle übrigen alphabetisch
// nach dem Kürzel — danach wird in der Auswahlliste gesucht.
//
// Angezeigt wird der geschlechtsneutrale Plural. Für den Satz im Prompt
// („Umschulung zum/zur …") wird die Einzahlform gebraucht, weil der Plural sich
// dort nicht einsetzen ließe.
export const BERUFE: Beruf[] = [
  { id: 'kgq', kuerzel: 'KGQ', label: 'Kaufmännische Grundqualifikation' },
  {
    id: 'einzelhandel',
    kuerzel: 'EHK',
    label: 'Kaufleute im Einzelhandel',
    singular: 'Kaufmann/-frau im Einzelhandel',
  },
  {
    id: 'fachinformatik',
    kuerzel: 'FISI',
    label: 'Fachinformatiker – Systemintegration',
    singular: 'Fachinformatiker/-in für Systemintegration',
  },
  {
    id: 'lagerlogistik',
    kuerzel: 'FKL',
    label: 'Fachkräfte für Lagerlogistik',
    singular: 'Fachkraft für Lagerlogistik',
  },
  {
    id: 'schutzsicherheit',
    kuerzel: 'FKS',
    label: 'Fachkräfte für Schutz und Sicherheit',
    singular: 'Fachkraft für Schutz und Sicherheit',
  },
  {
    id: 'grosshandel',
    kuerzel: 'GAM',
    label: 'Kaufleute im Groß- und Außenhandelsmanagement',
    singular: 'Kaufmann/-frau für Groß- und Außenhandelsmanagement',
  },
  {
    id: 'industrie',
    kuerzel: 'IK',
    label: 'Industriekaufleute',
    singular: 'Industriekaufmann/-frau',
  },
  {
    id: 'immobilien',
    kuerzel: 'IMK',
    label: 'Immobilienkaufleute',
    singular: 'Immobilienkaufmann/-frau',
  },
  {
    id: 'bueromanagement',
    kuerzel: 'KBM',
    label: 'Kaufleute für Büromanagement',
    singular: 'Kaufmann/-frau für Büromanagement',
  },
  {
    id: 'ecommerce',
    kuerzel: 'KEC',
    label: 'Kaufleute im E-Commerce',
    singular: 'Kaufmann/-frau im E-Commerce',
  },
  {
    id: 'gesundheit',
    kuerzel: 'KIG',
    label: 'Kaufleute im Gesundheitswesen',
    singular: 'Kaufmann/-frau im Gesundheitswesen',
  },
  {
    id: 'personaldienstleistung',
    kuerzel: 'PDK',
    label: 'Personaldienstleistungskaufleute',
    singular: 'Personaldienstleistungskaufmann/-frau',
  },
  {
    id: 'steuerfach',
    kuerzel: 'SFA',
    label: 'Steuerfachangestellte',
    singular: 'Steuerfachangestellte/-r',
    pruefstelle: 'Steuerberaterkammer',
  },
  {
    id: 'spedition',
    kuerzel: 'SL',
    label: 'Kaufleute für Spedition und Logistikdienstleistungen',
    singular: 'Kaufmann/-frau für Spedition und Logistikdienstleistung',
  },
];

/** Anzeige in der Auswahlliste: „IMK — Immobilienkaufleute". */
export function berufBeschriftung(beruf: Beruf): string {
  return `${beruf.kuerzel} — ${beruf.label}`;
}

export const AUFGABEN: Aufgabe[] = [
  {
    id: 'erklaeren',
    label: 'Thema erklären',
    erlaeuterung:
      'Zusammenhängender Erklärtext mit Einordnung in den Betrieb und Abgrenzung zu verwandten Begriffen.',
    instruction: () =>
      'Erkläre das unten genannte Thema fachlich korrekt und nachvollziehbar. ' +
      'Ordne es in den betrieblichen Gesamtzusammenhang ein und grenze es von verwandten Begriffen ab.',
  },
  {
    id: 'zusammenfassen',
    label: 'Zusammenfassung erstellen',
    erlaeuterung:
      'Kernaussagen zuerst, am Ende eine Merkhilfe — setzt voraus, dass du das Thema schon einmal gehört hast.',
    instruction: () =>
      'Fasse das unten genannte Thema lernorientiert zusammen. Stelle die prüfungsrelevanten ' +
      'Kernaussagen voran und schließe mit einer kurzen Merkhilfe ab.',
  },
  {
    id: 'pruefungsaufgabe',
    label: 'Prüfungsaufgabe erstellen',
    erlaeuterung:
      'Aufgaben im Prüfungsformat mit Punktevorschlag und Bearbeitungszeit; die Musterlösung kommt erst am Ende.',
    needsCount: true,
    instruction: ({ anzahl }) =>
      `Erstelle ${anzahl} realistische, prüfungsnahe ` +
      `${plural(anzahl, 'Prüfungsaufgabe', 'Prüfungsaufgaben')} zum unten genannten Thema, ` +
      'jeweils mit Ausgangssituation, Arbeitsauftrag, Punktevorschlag und Bearbeitungszeit. ' +
      'Gib die Musterlösung erst nach allen Aufgaben in einem klar getrennten Abschnitt aus.',
  },
  {
    id: 'loesung-pruefen',
    label: 'Eigene Lösung kontrollieren',
    erlaeuterung:
      'Deine Lösung wird durchgesehen: erst das Richtige, dann Fehler, Fehlendes, Musterlösung und eine Punkteschätzung.',
    needsZusatz: true,
    instruction: () =>
      'Kontrolliere meine Lösung zum unten genannten Thema. Sie steht im Abschnitt ' +
      '"ZUSÄTZLICHE ANGABEN". Nenne zuerst, was fachlich richtig ist, danach die Fehler mit ' +
      'Begründung, dann die fehlenden Punkte und zuletzt eine vollständige Musterlösung. ' +
      'Schätze abschließend, wie viele Punkte die Lösung in der Abschlussprüfung bekäme.',
  },
  {
    id: 'karteikarten',
    label: 'Karteikarten erstellen',
    erlaeuterung:
      'Nummerierte Karten „Frage → Antwort", jede Antwort höchstens drei Sätze.',
    needsCount: true,
    instruction: ({ anzahl }) =>
      `Erstelle ${anzahl} kompakte Lernkarteikarten zum unten genannten Thema im Format ` +
      '"Frage → Antwort". Jede Antwort umfasst höchstens drei Sätze. Nummeriere die Karten fortlaufend.',
  },
  {
    id: 'lernzettel',
    label: 'Lernzettel erstellen',
    erlaeuterung:
      'Feste Gliederung: Definition, Kernpunkte, typische Prüfungsfragen, häufige Fehler, Zusammenfassung.',
    instruction: () =>
      'Erstelle einen strukturierten Lernzettel zum unten genannten Thema: Definition, Kernpunkte, ' +
      'typische Prüfungsfragen, häufige Fehler und eine kurze Zusammenfassung am Ende.',
  },
  {
    id: 'fachbegriff',
    label: 'Fachbegriff erklären',
    erlaeuterung:
      'Für einen einzelnen Begriff: Definition in einem Satz, Erläuterung, Praxisbeispiel, Abgrenzung.',
    instruction: () =>
      'Erkläre den unten genannten Fachbegriff kurz, präzise und prüfungstauglich: Definition in ' +
      'einem Satz, anschließend Erläuterung, ein Praxisbeispiel sowie die Abgrenzung zu ähnlichen Begriffen.',
  },
  {
    id: 'simulation',
    label: 'Mündliche Prüfung simulieren',
    erlaeuterung:
      'Ein Dialog: Die KI fragt einzeln und wartet auf deine Antwort; der Erwartungshorizont kommt zum Schluss.',
    needsCount: true,
    instruction: ({ anzahl }) =>
      `Simuliere eine mündliche Abschlussprüfung zum unten genannten Thema. Stelle mir ${anzahl} ` +
      `${plural(anzahl, 'Frage', 'Fragen')} nacheinander und warte nach jeder Frage auf meine Antwort. ` +
      'Gib den Erwartungshorizont erst am Ende in einem eigenen Abschnitt aus.',
  },
  {
    id: 'multiple-choice',
    label: 'Multiple-Choice-Fragen',
    erlaeuterung:
      'Je vier Antworten, genau eine richtig; der Lösungsschlüssel steht erst am Ende.',
    needsCount: true,
    instruction: ({ anzahl }) =>
      `Erstelle ${anzahl} Multiple-Choice-${plural(anzahl, 'Frage', 'Fragen')} zum unten genannten ` +
      'Thema mit je vier Antwortmöglichkeiten, davon genau eine richtige. Die falschen Optionen ' +
      'müssen fachlich plausibel sein. Gib den Lösungsschlüssel mit kurzer Begründung erst in einem ' +
      'getrennten Abschnitt am Ende aus.',
  },
  {
    id: 'berechnung',
    label: 'Berechnung erklären',
    erlaeuterung:
      'Formel, Einheiten und vollständiger Rechenweg, dazu die Aussage des Ergebnisses und typische Fehlerquellen.',
    instruction: () =>
      'Erkläre die Berechnung zum unten genannten Thema Schritt für Schritt: Formel, Bedeutung der ' +
      'Größen, Einheiten, vollständiger Rechenweg mit Zwischenergebnissen und Endergebnis. Erläutere ' +
      'abschließend die betriebswirtschaftliche Aussage des Ergebnisses und nenne typische Fehlerquellen.',
  },
  {
    id: 'geschaeftstext',
    label: 'Geschäftstext formulieren',
    erlaeuterung:
      'Vollständiger Geschäftsbrief mit Betreff, Anrede und Schluss, danach die sprachlichen Entscheidungen kurz erläutert.',
    instruction: () =>
      'Formuliere einen professionellen kaufmännischen Geschäftstext zum unten genannten Thema. ' +
      'Berücksichtige die Angaben im Abschnitt "ZUSÄTZLICHE ANGABEN". Halte die übliche Form ' +
      '(Betreff, Anrede, Hauptteil, Schluss, Grußformel) ein und erläutere danach kurz die ' +
      'wichtigsten sprachlichen Entscheidungen.',
  },
  {
    id: 'fallstudie',
    label: 'Fallstudie / Praxisfall',
    erlaeuterung:
      'Ein Betrieb, ein Problem, Zahlenmaterial und drei aufbauende Arbeitsaufträge; der Lösungsvorschlag kommt erst am Ende.',
    instruction: () =>
      'Entwickle eine praxisnahe Fallstudie zum unten genannten Thema: Ausgangssituation eines ' +
      'Betriebs, konkretes Problem, Datengrundlage und drei aufeinander aufbauende Arbeitsaufträge. ' +
      'Gib den Lösungsvorschlag erst in einem getrennten Abschnitt am Ende aus.',
  },
];

export const OPTIONEN: Option[] = [
  {
    id: 'einfache-sprache',
    label: 'Einfache Sprache',
    defaultOn: false,
    rule:
      'Erkläre in verständlicher Sprache, ohne fachliche Genauigkeit zu verlieren. ' +
      'Löse lange Schachtelsätze auf.',
  },
  {
    id: 'fachbegriffe',
    label: 'Fachbegriffe erklären',
    defaultOn: true,
    rule:
      'Verwende die korrekten Fachbegriffe deines Berufsfelds und erkläre jeden neuen Begriff beim ' +
      'ersten Auftreten in einem Halbsatz.',
  },
  {
    id: 'praxisbeispiel',
    label: 'Praxisbeispiel',
    defaultOn: true,
    rule:
      'Füge mindestens ein konkretes, praxisnahes Beispiel mit realistischen Zahlen oder Abläufen hinzu.',
  },
  {
    id: 'ihk-bezug',
    label: 'Prüfungsbezug',
    defaultOn: true,
    rule:
      'Richte Inhalt, Begriffswahl und Schwerpunkte an den typischen Anforderungen der ' +
      'Abschlussprüfung aus ' +
      'und benenne, worauf es in der Prüfung besonders ankommt.',
  },
  {
    id: 'rueckfragen',
    label: 'Rückfragen erlaubt',
    defaultOn: false,
    rule: '', // Wird im Abschnitt AUSGABE gesondert behandelt.
  },
];

// Anders als bei Aufgaben und Ausgabeformen ist die Reihenfolge hier eine
// Rangfolge. Die Stufenzahl steht deshalb in der Auswahlliste voran.
export const NIVEAUS: Niveau[] = [
  { id: 'einstieg', stufe: 1, label: 'Sehr einfach / Einstieg' },
  { id: 'azubi', stufe: 2, label: 'Azubi- und Umschüler-Niveau' },
  { id: 'pruefung', stufe: 3, label: 'Niveau der Abschlussprüfung' },
  { id: 'vertieft', stufe: 4, label: 'Vertieft / fachlich detailliert' },
];

/** Anzeige in der Auswahlliste: „3 — Niveau der Abschlussprüfung". */
export function niveauBeschriftung(niveau: Niveau): string {
  return `${niveau.stufe} — ${niveau.label}`;
}

export const FORMATE: Ausgabeformat[] = [
  { id: 'kompakt', label: 'Kurz und kompakt' },
  { id: 'stichpunkte', label: 'Strukturiert mit Stichpunkten' },
  { id: 'schritt-fuer-schritt', label: 'Schritt für Schritt' },
  { id: 'tabelle', label: 'Tabelle, wenn sinnvoll' },
  { id: 'ausfuehrlich', label: 'Ausführlich mit Begründungen' },
  { id: 'ganze-saetze', label: 'Prüfungsantwort in ganzen Sätzen' },
];

/** Nachschlagen mit sicherem Rückfall auf den ersten Eintrag. */
function lookup<T extends { id: string }>(list: T[], id: string): T {
  return list.find((entry) => entry.id === id) ?? list[0];
}

export const findBeruf = (id: string) => lookup(BERUFE, id);
export const findAufgabe = (id: string) => lookup(AUFGABEN, id);
export const findNiveau = (id: string) => lookup(NIVEAUS, id);
export const findFormat = (id: string) => lookup(FORMATE, id);
export const findOption = (id: string) => lookup(OPTIONEN, id);
