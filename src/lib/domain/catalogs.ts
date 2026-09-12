// Die Auswahlkataloge. Beschriftung und Verhalten stehen bewusst an einer
// Stelle beieinander - in der Vorgängerfassung lagen Label und Auftragstext
// in zwei getrennten Strukturen, die auseinanderlaufen konnten.

import type {
  Aufgabe,
  AufgabeId,
  Ausgabeformat,
  Beruf,
  Fachsprache,
  Niveau,
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
    beispiel:
      'Mach die Erklärung an einem Beispiel aus dem Betriebsalltag fest, mit realistischen Zahlen oder Abläufen.',
    instruction: () =>
      'Erkläre das unten genannte Thema fachlich korrekt und nachvollziehbar. ' +
      'Ordne es in den betrieblichen Gesamtzusammenhang ein und grenze es von verwandten Begriffen ab.',
  },
  {
    id: 'zusammenfassen',
    label: 'Zusammenfassung erstellen',
    erlaeuterung:
      'Kernaussagen zuerst, am Ende eine Merkhilfe — setzt voraus, dass du das Thema schon einmal gehört hast.',
    beispiel:
      'Verankere jede Kernaussage, die sonst abstrakt bliebe, mit einem Beispiel in einem Halbsatz.',
    instruction: () =>
      'Fasse das unten genannte Thema lernorientiert zusammen. Stelle die prüfungsrelevanten ' +
      'Kernaussagen voran und schließe mit einer kurzen Merkhilfe ab.',
  },
  {
    id: 'pruefungsaufgabe',
    label: 'Prüfungsaufgabe erstellen',
    erlaeuterung:
      'Aufgaben im Prüfungsformat mit Punktevorschlag und Bearbeitungszeit; die Musterlösung kommt erst am Ende.',
    beispiel:
      'Jede Aufgabe geht von einer betrieblichen Ausgangssituation mit konkreten Zahlen aus, nicht von einer Wissensfrage.',
    formFest: true,
    pruefungsbezugEnthalten: true,
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
    beispiel:
      'Mach jeden Fehler an meiner Lösung konkret fest und rechne in der Musterlösung mit meinen Zahlen, nicht mit erfundenen.',
    formFest: true,
    pruefungsbezugEnthalten: true,
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
    beispiel:
      'Wo ein Beispiel das Verständnis trägt, steht es in einem Halbsatz auf der Rückseite — die Kürze der Karte geht vor.',
    formFest: true,
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
    beispiel:
      'Zu jedem Kernpunkt ein Beispiel in einem Halbsatz.',
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
    beispiel:
      'Kleide die Fragen in betriebliche Situationen, statt Definitionen abzufragen.',
    formFest: true,
    dialog: true,
    pruefungsbezugEnthalten: true,
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
    beispiel:
      'Formuliere die Fragen als kurze betriebliche Fälle mit konkreten Zahlen, nicht als reine Wissensabfrage.',
    formFest: true,
    pruefungsbezugEnthalten: true,
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
    beispiel:
      'Rechne ein vollständiges Beispiel durch; nennt das Thema keine Zahlen, wähle realistische Beträge aus der Praxis.',
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
    beispiel:
      'Nimm einen konkreten Anlass an und fülle fehlende Angaben plausibel aus — Namen, Daten, Beträge, Fristen; Erfundenes kennzeichnest du als Platzhalter.',
    formFest: true,
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
    formFest: true,
    instruction: () =>
      'Entwickle eine praxisnahe Fallstudie zum unten genannten Thema: Ausgangssituation eines ' +
      'Betriebs, konkretes Problem, Datengrundlage und drei aufeinander aufbauende Arbeitsaufträge. ' +
      'Gib den Lösungsvorschlag erst in einem getrennten Abschnitt am Ende aus.',
  },
];

// Der Prüfungsbezug war bis zum 12.09.2026 ein Häkchen. Er ist jetzt feste
// Regel: Die Anwendung ist Prüfungsvorbereitung, und bei den prüfungsnahen
// Aufgaben stand er ohnehin schon im Auftragstext.
export const PRUEFUNGSBEZUG =
  'Richte Inhalt, Begriffswahl und Schwerpunkte an den typischen Anforderungen der ' +
  'Abschlussprüfung aus und benenne, worauf es in der Prüfung besonders ankommt.';


// Der Umgang mit Fachbegriffen ist eine Steigerung: erst der nackte Begriff,
// dann die Erklärung, dann die einfache Erklärung. "Einfach" meint dabei
// fachlich zugänglich, nicht sprachlich vereinfacht für Deutschlernende —
// dafür gibt es die zweite Sprache in der Antwort.
export const FACHSPRACHEN: Fachsprache[] = [
  {
    id: 'ohne',
    label: 'Ohne Erklärung – wie in der Prüfung',
    rule:
      'Verwende durchgehend die Fachbegriffe deines Berufsfelds ohne zusätzliche Erklärung, ' +
      'so wie sie in der Prüfung stehen.',
  },
  {
    id: 'erklaert',
    label: 'Beim ersten Auftreten erklären',
    rule:
      'Verwende die korrekten Fachbegriffe deines Berufsfelds und erkläre jeden neuen Begriff beim ' +
      'ersten Auftreten in einem Halbsatz.',
  },
  {
    id: 'einfach',
    label: 'Erklären und einfach halten',
    rule:
      'Verwende die korrekten Fachbegriffe deines Berufsfelds, erkläre jeden neuen Begriff beim ' +
      'ersten Auftreten und halte die Erklärungen einfach: kurze Sätze, ein Gedanke je Satz, ' +
      'keine verschachtelten Nebensätze, abstrakte Zusammenhänge in Zwischenschritte zerlegt. ' +
      'Die Fachbegriffe selbst bleiben stehen — sie kommen in der Prüfung so vor.',
  },
];

// Anders als bei Aufgaben und Ausgabeformen ist die Reihenfolge hier eine
// Rangfolge. Die Stufenzahl steht deshalb in der Auswahlliste voran.
export const NIVEAUS: Niveau[] = [
  {
    id: 'einstieg',
    stufe: 1,
    label: 'Sehr einfach / Einstieg',
    rule:
      'Anspruch: erste Begegnung mit dem Thema. Setze kein Vorwissen voraus, bleib beim Grundgedanken und lass Sonderfälle weg.',
  },
  {
    id: 'azubi',
    stufe: 2,
    label: 'Azubi- und Umschüler-Niveau',
    rule:
      'Anspruch: laufende Ausbildung oder Umschulung. Der Stoff des Lehrjahres, die üblichen Fälle und die wichtigsten Ausnahmen — noch nicht die Feinheiten.',
  },
  {
    id: 'pruefung',
    stufe: 3,
    label: 'Niveau der Abschlussprüfung',
    rule:
      'Anspruch: schriftliche Abschlussprüfung. Fachbegriffe ohne Vereinfachung, typische Prüfungsfälle samt ihrer Fallstricke, Anwenden statt Aufsagen.',
  },
  {
    id: 'vertieft',
    stufe: 4,
    label: 'Vertieft / fachlich detailliert',
    rule:
      'Anspruch: über die Prüfung hinaus. Sonderfälle, Streitfragen und Verweise auf die einschlägigen Vorschriften; kennzeichne Vereinfachungen ausdrücklich als solche.',
  },
];

/** Anzeige in der Auswahlliste: „3 — Niveau der Abschlussprüfung". */
export function niveauBeschriftung(niveau: Niveau): string {
  return `${niveau.stufe} — ${niveau.label}`;
}

export const FORMATE: Ausgabeformat[] = [
  {
    id: 'kompakt',
    label: 'Kurz und kompakt',
    rule:
      'Form: höchstens rund 250 Wörter. Kernaussage zuerst, keine Wiederholung der Frage, keine Zusammenfassung am Ende.',
  },
  {
    id: 'stichpunkte',
    label: 'Strukturiert mit Stichpunkten',
    rule:
      'Form: gegliederte Stichpunkte mit Zwischenüberschriften, je Punkt ein Gedanke. Ganze Sätze nur, wo es ohne sie unklar würde.',
  },
  {
    id: 'schritt-fuer-schritt',
    label: 'Schritt für Schritt',
    rule:
      'Form: nummerierte Schritte in der Reihenfolge des Vorgehens. Je Schritt eine Handlung und das Ergebnis, das danach vorliegt.',
  },
  {
    id: 'tabelle',
    label: 'Tabelle, wenn sinnvoll',
    rule:
      'Form: was sich gegenüberstellen oder vergleichen lässt, gehört in eine Tabelle; der übrige Text bleibt Fließtext. Erzwinge keine Tabelle, wo es nichts zu vergleichen gibt.',
  },
  {
    id: 'ausfuehrlich',
    label: 'Ausführlich mit Begründungen',
    rule:
      'Form: ausführlich. Zu jeder Aussage die Begründung, dazu Herleitungen und Abgrenzungen; die Länge richtet sich nach dem Stoff.',
  },
  {
    id: 'ganze-saetze',
    label: 'Prüfungsantwort in ganzen Sätzen',
    rule:
      'Form: wie eine schriftliche Prüfungsantwort — vollständige Sätze, keine Stichpunkte, keine Aufzählungszeichen, sachlicher Ton.',
  },
];

/** Nachschlagen mit sicherem Rückfall auf den ersten Eintrag. */
function lookup<T extends { id: string }>(list: T[], id: string): T {
  return list.find((entry) => entry.id === id) ?? list[0];
}

export const findBeruf = (id: string) => lookup(BERUFE, id);
export const findAufgabe = (id: string) => lookup(AUFGABEN, id);
export const findNiveau = (id: string) => lookup(NIVEAUS, id);
export const findFormat = (id: string) => lookup(FORMATE, id);
// Rückfall ist die mittlere Stufe, nicht die erste: Sie ist die Vorgabe.
export const findFachsprache = (id: string) =>
  FACHSPRACHEN.find((eintrag) => eintrag.id === id) ?? FACHSPRACHEN[1];

/** Gibt die Aufgabe die Form selbst vor, ist die Ausgabeform gegenstandslos. */
export function ausgabeformWirksam(aufgabe: AufgabeId): boolean {
  return findAufgabe(aufgabe).formFest !== true;
}
