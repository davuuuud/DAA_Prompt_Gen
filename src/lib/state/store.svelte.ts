// Der veränderliche Zustand der Anwendung und seine Ablage auf dem Gerät.
//
// Zwei getrennte Töpfe: die dauerhaften Einstellungen (Beruf, Aufgabe,
// Quellen ...) und der flüchtige Entwurf (Thema, zusätzliche Angaben). Der
// Entwurf wird bewusst ebenfalls gesichert - auf dem Telefon wird eine App
// jederzeit in den Hintergrund geschoben, und dann wäre ein halb getippter
// Text sonst verloren.

import {
  auswahlVon,
  normalizeSettings,
  standardAuswahl,
  type Auswahl,
  type Settings,
} from '../domain/settings';

const SETTINGS_KEY = 'ihk-lernassistent.einstellungen';
const DRAFT_KEY = 'ihk-lernassistent.entwurf';

export interface Draft {
  thema: string;
  zusatz: string;
}

/** Liest JSON aus dem Gerätespeicher. Jeder Fehler ergibt null. */
function readJSON(key: string): unknown {
  if (typeof localStorage === 'undefined') return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Schreibt JSON in den Gerätespeicher. Fehler werden geschluckt: Im privaten
 * Modus oder bei vollem Speicher wirft der Zugriff, und das darf die
 * Anwendung nicht anhalten.
 */
function writeJSON(key: string, value: unknown): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* bewusst ignoriert */
  }
}

function readDraft(): Draft {
  const raw = readJSON(DRAFT_KEY);
  if (typeof raw !== 'object' || raw === null) return { thema: '', zusatz: '' };
  const data = raw as Record<string, unknown>;
  return {
    thema: typeof data.thema === 'string' ? data.thema : '',
    zusatz: typeof data.zusatz === 'string' ? data.zusatz : '',
  };
}

export const settings = $state<Settings>(normalizeSettings(readJSON(SETTINGS_KEY)));
export const draft = $state<Draft>(readDraft());

export function saveSettings(): void {
  writeJSON(SETTINGS_KEY, settings);
}

export function saveDraft(): void {
  writeJSON(DRAFT_KEY, draft);
}

/**
 * Setzt die Auswahl auf den Standard und gibt die bisherige zurück, damit
 * sich der Schritt rückgängig machen lässt. Geschriebener Text bleibt.
 */
export function auswahlZuruecksetzen(): Auswahl {
  const vorher = auswahlVon(settings);
  Object.assign(settings, standardAuswahl());
  return vorher;
}

export function auswahlWiederherstellen(auswahl: Auswahl): void {
  Object.assign(settings, auswahlVon(auswahl));
}
