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

export const BERUFE: Beruf[] = [
  { id: 'allgemein', label: 'Allgemein kaufmännisch' },
  { id: 'immobilien', label: 'Immobilienkaufmann/-frau' },
  { id: 'bueromanagement', label: 'Kaufmann/-frau für Büromanagement' },
  { id: 'industrie', label: 'Industriekaufmann/-frau' },
  { id: 'grosshandel', label: 'Kaufmann/-frau für Groß- und Außenhandelsmanagement' },
  { id: 'einzelhandel', label: 'Kaufmann/-frau im Einzelhandel' },
  { id: 'spedition', label: 'Kaufmann/-frau für Spedition und Logistikdienstleistung' },
  { id: 'ecommerce', label: 'Kaufmann/-frau im E-Commerce' },
  { id: 'bank', label: 'Bankkaufmann/-frau' },
  { id: 'versicherung', label: 'Kaufmann/-frau für Versicherungen und Finanzanlagen' },
  { id: 'steuerfach', label: 'Steuerfachangestellte/-r' },
  { id: 'personaldienstleistung', label: 'Personaldienstleistungskaufmann/-frau' },
];

export const AUFGABEN: Aufgabe[] = [
  {
    id: 'erklaeren',
    label: 'Thema erklären',
    instruction: () =>
      'Erkläre das unten genannte Thema fachlich korrekt und nachvollziehbar. ' +
      'Ordne es in den betrieblichen Gesamtzusammenhang ein und grenze es von verwandten Begriffen ab.',
  },
  {
    id: 'zusammenfassen',
    label: 'Zusammenfassung erstellen',
    instruction: () =>
      'Fasse das unten genannte Thema lernorientiert zusammen. Stelle die prüfungsrelevanten ' +
      'Kernaussagen voran und schließe mit einer kurzen Merkhilfe ab.',
  },
  {
    id: 'pruefungsaufgabe',
    label: 'IHK-Prüfungsaufgabe erstellen',
    needsCount: true,
    instruction: ({ anzahl }) =>
      `Erstelle ${anzahl} realistische, IHK-orientierte ` +
      `${plural(anzahl, 'Prüfungsaufgabe', 'Prüfungsaufgaben')} zum unten genannten Thema, ` +
      'jeweils mit Ausgangssituation, Arbeitsauftrag, Punktevorschlag und Bearbeitungszeit. ' +
      'Gib die Musterlösung erst nach allen Aufgaben in einem klar getrennten Abschnitt aus.',
  },
  {
    id: 'loesung-pruefen',
    label: 'Eigene Lösung kontrollieren',
    needsZusatz: true,
    instruction: () =>
      'Kontrolliere meine Lösung zum unten genannten Thema. Sie steht im Abschnitt ' +
      '"ZUSÄTZLICHE ANGABEN". Nenne zuerst, was fachlich richtig ist, danach die Fehler mit ' +
      'Begründung, dann die fehlenden Punkte und zuletzt eine vollständige Musterlösung. ' +
      'Schätze abschließend, wie viele Punkte die Lösung in einer IHK-Prüfung bekäme.',
  },
  {
    id: 'karteikarten',
    label: 'Karteikarten erstellen',
    needsCount: true,
    instruction: ({ anzahl }) =>
      `Erstelle ${anzahl} kompakte Lernkarteikarten zum unten genannten Thema im Format ` +
      '"Frage → Antwort". Jede Antwort umfasst höchstens drei Sätze. Nummeriere die Karten fortlaufend.',
  },
  {
    id: 'lernzettel',
    label: 'Lernzettel erstellen',
    instruction: () =>
      'Erstelle einen strukturierten Lernzettel zum unten genannten Thema: Definition, Kernpunkte, ' +
      'typische Prüfungsfragen, häufige Fehler und eine kurze Zusammenfassung am Ende.',
  },
  {
    id: 'fachbegriff',
    label: 'Fachbegriff erklären',
    instruction: () =>
      'Erkläre den unten genannten Fachbegriff kurz, präzise und prüfungstauglich: Definition in ' +
      'einem Satz, anschließend Erläuterung, ein Praxisbeispiel sowie die Abgrenzung zu ähnlichen Begriffen.',
  },
  {
    id: 'simulation',
    label: 'Mündliche Prüfung simulieren',
    needsCount: true,
    instruction: ({ anzahl }) =>
      `Simuliere eine mündliche IHK-Prüfung zum unten genannten Thema. Stelle mir ${anzahl} ` +
      `${plural(anzahl, 'Frage', 'Fragen')} nacheinander und warte nach jeder Frage auf meine Antwort. ` +
      'Gib den Erwartungshorizont erst am Ende in einem eigenen Abschnitt aus.',
  },
  {
    id: 'multiple-choice',
    label: 'Multiple-Choice-Fragen',
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
    instruction: () =>
      'Erkläre die Berechnung zum unten genannten Thema Schritt für Schritt: Formel, Bedeutung der ' +
      'Größen, Einheiten, vollständiger Rechenweg mit Zwischenergebnissen und Endergebnis. Erläutere ' +
      'abschließend die betriebswirtschaftliche Aussage des Ergebnisses und nenne typische Fehlerquellen.',
  },
  {
    id: 'geschaeftstext',
    label: 'Geschäftstext formulieren',
    instruction: () =>
      'Formuliere einen professionellen kaufmännischen Geschäftstext zum unten genannten Thema. ' +
      'Berücksichtige die Angaben im Abschnitt "ZUSÄTZLICHE ANGABEN". Halte die übliche Form ' +
      '(Betreff, Anrede, Hauptteil, Schluss, Grußformel) ein und erläutere danach kurz die ' +
      'wichtigsten sprachlichen Entscheidungen.',
  },
  {
    id: 'fallstudie',
    label: 'Fallstudie / Praxisfall',
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
    defaultOn: true,
    rule:
      'Erkläre in verständlicher Sprache, ohne fachliche Genauigkeit zu verlieren. ' +
      'Löse lange Schachtelsätze auf.',
  },
  {
    id: 'fachbegriffe',
    label: 'Fachbegriffe erklären',
    defaultOn: true,
    rule:
      'Verwende die korrekten kaufmännischen Fachbegriffe und erkläre jeden neuen Begriff beim ' +
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
    label: 'IHK-Prüfungsbezug',
    defaultOn: true,
    rule:
      'Richte Inhalt, Begriffswahl und Schwerpunkte an den typischen IHK-Prüfungsanforderungen aus ' +
      'und benenne, worauf es in der Prüfung besonders ankommt.',
  },
  {
    id: 'rueckfragen',
    label: 'Rückfragen erlaubt',
    defaultOn: false,
    rule: '', // Wird im Abschnitt AUSGABE gesondert behandelt.
  },
];

export const NIVEAUS: Niveau[] = [
  { id: 'einstieg', label: 'Sehr einfach / Einstieg' },
  { id: 'azubi', label: 'Azubi- und Umschüler-Niveau' },
  { id: 'pruefung', label: 'IHK-Prüfungsniveau' },
  { id: 'vertieft', label: 'Vertieft / fachlich detailliert' },
];

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
