// Vorgabewerte und Normalisierung der gespeicherten Einstellungen.
//
// Die Normalisierung ist bewusst großzügig: Eine von Hand bearbeitete oder
// von einer älteren Version geschriebene Datei darf die Anwendung nicht
// unbrauchbar machen. Unbekannte Werte fallen still auf die Vorgabe zurück.

import { AUFGABEN, BERUFE, FORMATE, NIVEAUS, OPTIONEN } from './catalogs';
import { DEFAULT_QUELLEN, quellenFuerBeruf } from './quellen';
import { DEFAULT_ANZAHL, parseAnzahl } from './text';
import type {
  AufgabeId,
  BerufId,
  FormatId,
  NiveauId,
  OptionId,
  PromptInput,
} from './types';

export const SETTINGS_VERSION = 1;

export interface Settings {
  version: number;
  beruf: BerufId;
  aufgabe: AufgabeId;
  niveau: NiveauId;
  format: FormatId;
  anzahl: number;
  optionen: OptionId[];
  quellen: string[];
  quellenFreitext: string;
}

export function defaultSettings(): Settings {
  return {
    version: SETTINGS_VERSION,
    beruf: 'allgemein',
    aufgabe: 'erklaeren',
    niveau: 'pruefung',
    format: 'stichpunkte',
    anzahl: DEFAULT_ANZAHL,
    optionen: OPTIONEN.filter((option) => option.defaultOn).map((option) => option.id),
    quellen: [...DEFAULT_QUELLEN],
    quellenFreitext: '',
  };
}

function pickId<T extends { id: string }>(list: T[], value: unknown, fallback: string): string {
  return typeof value === 'string' && list.some((entry) => entry.id === value) ? value : fallback;
}

function pickIds<T extends { id: string }>(list: T[], value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const gueltig = new Set(list.map((entry) => entry.id));
  return [...new Set(value.filter((id): id is string => typeof id === 'string' && gueltig.has(id)))];
}

/**
 * Bringt beliebige Eingaben in einen gültigen Zustand. Nimmt bewusst
 * `unknown` entgegen, weil die Daten aus dem Gerätespeicher stammen und dort
 * alles stehen kann.
 */
export function normalizeSettings(raw: unknown): Settings {
  const fallback = defaultSettings();
  if (typeof raw !== 'object' || raw === null) return fallback;
  const data = raw as Record<string, unknown>;

  const beruf = pickId(BERUFE, data.beruf, fallback.beruf) as BerufId;

  // Quellen werden gegen den Katalog des gewählten Berufs geprüft: Nach einem
  // Berufswechsel dürfen keine unpassenden Vorgaben zurückbleiben.
  const erlaubteQuellen = quellenFuerBeruf(beruf);
  const quellen = pickIds(erlaubteQuellen, data.quellen);

  return {
    version: SETTINGS_VERSION,
    beruf,
    aufgabe: pickId(AUFGABEN, data.aufgabe, fallback.aufgabe) as AufgabeId,
    niveau: pickId(NIVEAUS, data.niveau, fallback.niveau) as NiveauId,
    format: pickId(FORMATE, data.format, fallback.format) as FormatId,
    anzahl: parseAnzahl(typeof data.anzahl === 'number' ? data.anzahl : String(data.anzahl ?? '')),
    optionen: pickIds(OPTIONEN, data.optionen) as OptionId[],
    quellen: quellen.length > 0 ? quellen : filterDefaults(beruf),
    quellenFreitext: typeof data.quellenFreitext === 'string' ? data.quellenFreitext : '',
  };
}

/** Die Vorgabequellen, soweit sie zum Beruf passen. */
function filterDefaults(beruf: BerufId): string[] {
  const erlaubt = new Set(quellenFuerBeruf(beruf).map((quelle) => quelle.id));
  return DEFAULT_QUELLEN.filter((id) => erlaubt.has(id));
}

/**
 * Verbindet gespeicherte Einstellungen mit den flüchtigen Eingaben zu einem
 * vollständigen Prompt-Eingabesatz.
 */
export function toPromptInput(
  settings: Settings,
  eingaben: { thema: string; zusatz: string },
): PromptInput {
  return {
    beruf: settings.beruf,
    aufgabe: settings.aufgabe,
    niveau: settings.niveau,
    format: settings.format,
    anzahl: settings.anzahl,
    optionen: settings.optionen,
    quellen: settings.quellen,
    quellenFreitext: settings.quellenFreitext,
    thema: eingaben.thema,
    zusatz: eingaben.zusatz,
  };
}
