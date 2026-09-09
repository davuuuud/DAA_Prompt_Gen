// Gemeinsame Typen der Fachlogik.
//
// Namenskonvention: Fachbegriffe bleiben deutsch (Beruf, Aufgabe, Quelle),
// weil jede Übersetzung ungenau würde. Technische Felder sind englisch
// (id, label, group). Alle Bezeichner sind stabile Zeichenketten und keine
// Array-Indizes: Gespeicherte Einstellungen überleben damit jede spätere
// Erweiterung der Kataloge.

export type BerufId =
  | 'allgemein'
  | 'immobilien'
  | 'bueromanagement'
  | 'industrie'
  | 'grosshandel'
  | 'einzelhandel'
  | 'spedition'
  | 'ecommerce'
  | 'bank'
  | 'versicherung'
  | 'steuerfach'
  | 'personaldienstleistung';

export type AufgabeId =
  | 'erklaeren'
  | 'zusammenfassen'
  | 'pruefungsaufgabe'
  | 'loesung-pruefen'
  | 'karteikarten'
  | 'lernzettel'
  | 'fachbegriff'
  | 'simulation'
  | 'multiple-choice'
  | 'berechnung'
  | 'geschaeftstext'
  | 'fallstudie';

export type OptionId =
  | 'einfache-sprache'
  | 'fachbegriffe'
  | 'praxisbeispiel'
  | 'ihk-bezug'
  | 'rueckfragen';

export type NiveauId = 'einstieg' | 'azubi' | 'pruefung' | 'vertieft';

export type FormatId =
  | 'kompakt'
  | 'stichpunkte'
  | 'schritt-fuer-schritt'
  | 'tabelle'
  | 'ausfuehrlich'
  | 'ganze-saetze';

export type QuellenGruppe = 'gesetz' | 'ihk' | 'fachverlag' | 'statistik';

export interface Beruf {
  id: BerufId;
  label: string;
}

export interface Aufgabe {
  id: AufgabeId;
  label: string;
  /** Wertet das Feld "Anzahl" aus. */
  needsCount?: boolean;
  /** Ohne die zusätzlichen Angaben wäre die Aufgabe sinnlos. */
  needsZusatz?: boolean;
  /** Der Auftragstext. Das Thema wird bewusst nicht eingebettet, sondern
   *  steht im Prompt in einem eigenen Abschnitt. */
  instruction(context: { anzahl: number }): string;
}

export interface Option {
  id: OptionId;
  label: string;
  /** Anforderungssatz, der bei aktivierter Option in den Prompt wandert. */
  rule: string;
  /** Voreinstellung beim ersten Start und beim Zurücksetzen. */
  defaultOn: boolean;
}

export interface Niveau {
  id: NiveauId;
  label: string;
}

export interface Ausgabeformat {
  id: FormatId;
  label: string;
}

export interface Quelle {
  id: string;
  label: string;
  group: QuellenGruppe;
  /** Kurzer Zusatz, der im Prompt hinter der Bezeichnung erscheint. */
  hint?: string;
  /** Fehlt die Angabe, gilt die Quelle für alle Berufe. */
  berufe?: BerufId[];
}

/**
 * Eine Fundstelle aus den eigenen Unterlagen (Etappe 3). Der Prompt-Aufbau
 * kennt den Typ bereits, damit die Dokumentensuche später nur noch befüllen
 * muss, ohne die Prompt-Struktur zu verändern.
 */
export interface Fundstelle {
  /** Dateiname oder frei vergebener Titel des Dokuments. */
  dokument: string;
  /** Fundort innerhalb des Dokuments, z. B. "Seite 12" oder "Abschnitt 3.2". */
  stelle?: string;
  /** Der zitierte Textausschnitt. */
  text: string;
}

export interface PromptInput {
  beruf: BerufId;
  aufgabe: AufgabeId;
  niveau: NiveauId;
  format: FormatId;
  thema: string;
  zusatz: string;
  anzahl: number;
  optionen: OptionId[];
  /** Ausgewählte Einträge aus dem Quellenkatalog. */
  quellen: string[];
  /** Frei ergänzte Quellen, eine je Zeile oder durch Komma getrennt. */
  quellenFreitext: string;
  /** Belegstellen aus eigenen Unterlagen; leer, solange Etappe 3 fehlt. */
  fundstellen?: Fundstelle[];
}
