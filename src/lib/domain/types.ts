// Gemeinsame Typen der Fachlogik.
//
// Namenskonvention: Fachbegriffe bleiben deutsch (Beruf, Aufgabe, Quelle),
// weil jede Übersetzung ungenau würde. Technische Felder sind englisch
// (id, label, group). Alle Bezeichner sind stabile Zeichenketten und keine
// Array-Indizes: Gespeicherte Einstellungen überleben damit jede spätere
// Erweiterung der Kataloge.

// Die kaufmännische Grundqualifikation steht voran, alle übrigen alphabetisch.
export type BerufId =
  | 'kgq'
  | 'fachinformatik'
  | 'lagerlogistik'
  | 'schutzsicherheit'
  | 'immobilien'
  | 'industrie'
  | 'bueromanagement'
  | 'spedition'
  | 'ecommerce'
  | 'einzelhandel'
  | 'gesundheit'
  | 'grosshandel'
  | 'personaldienstleistung'
  | 'steuerfach';

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
  /**
   * Kürzel des Bildungsträgers. Steht in der Auswahlliste voran, damit sich
   * ein Eintrag schnell finden lässt — im Prompt taucht es nicht auf, dort
   * wäre es für ein Sprachmodell nur ein Rätsel.
   */
  kuerzel: string;
  /** Anzeige in der Auswahlliste, in der Schreibweise des Bildungsträgers. */
  label: string;
  /**
   * Einzahlform für den Satz im Prompt („Umschulung zum/zur …"). Die Anzeige
   * verwendet den geschlechtsneutralen Plural, der sich in diesen Satz nicht
   * einsetzen ließe. Fehlt die Angabe, wird `label` verwendet.
   */
  singular?: string;
  /**
   * Zuständige Prüfungsstelle. Fehlt die Angabe, ist es die IHK — das trifft
   * auf die meisten zu. Steuerfachangestellte prüft dagegen die
   * Steuerberaterkammer.
   */
  pruefstelle?: string;
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
  /**
   * Rangzahl 1 bis 4. Die vier Niveaus sind keine gleichrangige Auswahl wie
   * die Ausgabeformen, sondern eine Steigerung. Die Zahl macht das in der
   * Liste sichtbar; im Prompt taucht sie nicht auf — für ein Sprachmodell
   * wäre "3" ohne die Skala dahinter nichtssagend.
   */
  stufe: number;
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
  /**
   * Zielsprache für zweisprachige Antworten. Fehlt die Angabe oder steht sie
   * auf 'keine', bleibt die Antwort einsprachig deutsch.
   */
  zweitsprache?: ZweitspracheId;
}

// ---------------------------------------------------------------------------
// Sprachen
// ---------------------------------------------------------------------------

// Reihenfolge wie im Katalog: Deutsch als Grundsprache, dann die sechs
// Sprachen mit dem größten erwarteten Bedarf, dann die übrigen alphabetisch.
export type SpracheId =
  | 'de'
  | 'en'
  | 'ar'
  | 'uk'
  | 'ru'
  | 'tr'
  | 'fa'
  | 'bg'
  | 'fr'
  | 'pl'
  | 'ro'
  | 'bks'
  | 'es'
  | 'vi';

/** 'keine' bedeutet: einsprachige Antwort auf Deutsch. */
export type ZweitspracheId = SpracheId | 'keine';

export interface Sprache {
  id: SpracheId;
  /** Deutsche Bezeichnung. */
  label: string;
  /** Name in der Sprache selbst. */
  eigenname: string;
  /**
   * Schreibrichtung. Heute ohne Wirkung, weil die zweisprachige Antwort in
   * der KI erscheint und nicht in dieser Anwendung. Sie wird gebraucht,
   * sobald Antworten in der Anwendung selbst dargestellt werden (Etappe 4):
   * Arabisch und Farsi verlangen dann eine zweite Layoutrichtung.
   */
  dir: 'ltr' | 'rtl';
}
