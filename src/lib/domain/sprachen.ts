// Sprachkatalog.
//
// Dient heute zwei Zwecken und später einem dritten:
//
//   1. Zielsprache für zweisprachige Antworten (in Betrieb)
//   2. Schreibrichtung, damit ein Wechsel auf Arabisch oder Farsi später
//      keine Überraschung wird (vorbereitet)
//   3. Sprache der Oberfläche (noch nicht umgesetzt)
//
// Welche Sprachen tatsächlich angeboten werden, ist noch nicht entschieden.
// Die folgende Auswahl ist ein Vorschlag und leicht zu ändern - Einträge
// streichen oder ergänzen genügt, der Rest der Anwendung zieht mit.

import type { Sprache, SpracheId } from './types';

/**
 * Deutsch steht voran, die übrigen alphabetisch nach der deutschen
 * Bezeichnung. Angezeigt wird beides: der Name in der Sprache selbst und
 * die deutsche Bezeichnung - wer die App auf Deutsch bedient, soll den
 * Eintrag finden, und wer sie nicht spricht, soll ihn wiedererkennen.
 */
export const SPRACHEN: Sprache[] = [
  { id: 'de', label: 'Deutsch', eigenname: 'Deutsch', dir: 'ltr' },
  { id: 'ar', label: 'Arabisch', eigenname: 'العربية', dir: 'rtl' },
  { id: 'en', label: 'Englisch', eigenname: 'English', dir: 'ltr' },
  { id: 'fa', label: 'Farsi', eigenname: 'فارسی', dir: 'rtl' },
  { id: 'fr', label: 'Französisch', eigenname: 'Français', dir: 'ltr' },
  { id: 'pl', label: 'Polnisch', eigenname: 'Polski', dir: 'ltr' },
  { id: 'ro', label: 'Rumänisch', eigenname: 'Română', dir: 'ltr' },
  { id: 'ru', label: 'Russisch', eigenname: 'Русский', dir: 'ltr' },
  { id: 'es', label: 'Spanisch', eigenname: 'Español', dir: 'ltr' },
  { id: 'tr', label: 'Türkisch', eigenname: 'Türkçe', dir: 'ltr' },
  { id: 'uk', label: 'Ukrainisch', eigenname: 'Українська', dir: 'ltr' },
];

/** Die Sprache, in der die Anwendung geschrieben ist. */
export const BASISSPRACHE: SpracheId = 'de';

export function findSprache(id: string): Sprache {
  return SPRACHEN.find((sprache) => sprache.id === id) ?? SPRACHEN[0];
}

/**
 * Anzeige in der Auswahlliste: Eigenname zuerst, deutsche Bezeichnung
 * dahinter - außer bei Deutsch, wo beides gleich wäre.
 */
export function spracheBeschriftung(sprache: Sprache): string {
  return sprache.eigenname === sprache.label
    ? sprache.label
    : `${sprache.eigenname} (${sprache.label})`;
}

/**
 * Sprachen, die als Zielsprache für zweisprachige Antworten in Frage kommen -
 * also alle außer der Sprache, in der ohnehin geantwortet wird.
 */
export function zweitsprachen(): Sprache[] {
  return SPRACHEN.filter((sprache) => sprache.id !== BASISSPRACHE);
}

/** Gibt es mindestens eine Sprache mit Schreibrichtung von rechts nach links? */
export function hatRtlSprachen(): boolean {
  return SPRACHEN.some((sprache) => sprache.dir === 'rtl');
}
