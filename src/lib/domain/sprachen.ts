// Sprachkatalog für zweisprachige Antworten.
//
// Die Oberfläche bleibt deutsch — bewusst und auf absehbare Zeit. Erstens
// müsste sonst jede Textänderung dauerhaft in jeder Sprache nachgezogen
// werden, zweitens findet die Abschlussprüfung auf Deutsch statt. Dieser
// Katalog steuert deshalb nur, in welcher Sprache die KI ihre Erläuterung
// ergänzt.
//
// Eine Zielsprache kostet genau eine Zeile hier: Den Text erzeugt das
// Sprachmodell, nicht diese Anwendung. Auch Arabisch und Farsi kosten heute
// nichts an Layout, weil die Antwort in der KI erscheint und nicht bei uns.
//
// Aufgenommen sind nur Sprachen, in denen die gängigen Sprachmodelle
// kaufmännische Fachtexte verlässlich beherrschen. Sprachen mit schwacher
// Modellqualität fehlen absichtlich: Eine schlechte Erläuterung ist hier
// schlimmer als keine, weil Lernende sie nicht überprüfen können.

import type { Sprache, SpracheId } from './types';

/**
 * Deutsch steht voran, danach die sechs Sprachen mit dem größten erwarteten
 * Bedarf, danach die übrigen alphabetisch nach der deutschen Bezeichnung.
 *
 * Die Auswahl folgt den Zuwanderungszahlen, aber nicht blind: Türkisch steht
 * in der Statistik weit oben, wird aber vor allem von der zweiten und dritten
 * Generation gesprochen, die Deutsch besser liest. Russisch steht in der
 * Statistik niedriger, ist aber Verkehrssprache weit über Russland hinaus.
 * Englisch taucht in keiner Zuwanderungsstatistik auf und fängt trotzdem am
 * meisten ab — alles, was sonst durch die Liste fiele.
 */
export const SPRACHEN: Sprache[] = [
  { id: 'de', label: 'Deutsch', eigenname: 'Deutsch', dir: 'ltr' },

  // Kernsprachen
  { id: 'en', label: 'Englisch', eigenname: 'English', dir: 'ltr' },
  { id: 'ar', label: 'Arabisch', eigenname: 'العربية', dir: 'rtl' },
  { id: 'uk', label: 'Ukrainisch', eigenname: 'Українська', dir: 'ltr' },
  { id: 'ru', label: 'Russisch', eigenname: 'Русский', dir: 'ltr' },
  { id: 'tr', label: 'Türkisch', eigenname: 'Türkçe', dir: 'ltr' },
  { id: 'fa', label: 'Farsi', eigenname: 'فارسی', dir: 'rtl' },

  // Übrige, alphabetisch
  { id: 'bg', label: 'Bulgarisch', eigenname: 'Български', dir: 'ltr' },
  { id: 'fr', label: 'Französisch', eigenname: 'Français', dir: 'ltr' },
  { id: 'pl', label: 'Polnisch', eigenname: 'Polski', dir: 'ltr' },
  { id: 'ro', label: 'Rumänisch', eigenname: 'Română', dir: 'ltr' },
  // 'bks' ist eine eigene Kennung, kein Sprachcode: Für das Bündel gibt es
  // keinen gültigen, und die drei einzeln zu führen hieße, eine Trennung zu
  // behaupten, die für diesen Zweck keine ist.
  {
    id: 'bks',
    label: 'Serbisch/Kroatisch/Bosnisch',
    eigenname: 'Srpski / Hrvatski / Bosanski',
    dir: 'ltr',
  },
  { id: 'es', label: 'Spanisch', eigenname: 'Español', dir: 'ltr' },
  { id: 'vi', label: 'Vietnamesisch', eigenname: 'Tiếng Việt', dir: 'ltr' },
];

/** Anzahl der Kernsprachen, die hinter Deutsch stehen. */
export const KERNSPRACHEN = 6;

/** Die Sprache, in der die Anwendung geschrieben ist und geantwortet wird. */
export const BASISSPRACHE: SpracheId = 'de';

export function findSprache(id: string): Sprache {
  return SPRACHEN.find((sprache) => sprache.id === id) ?? SPRACHEN[0];
}

/**
 * Anzeige in der Auswahlliste: Eigenname zuerst, deutsche Bezeichnung
 * dahinter — außer bei Deutsch, wo beides gleich wäre. Wer die App auf
 * Deutsch bedient, soll den Eintrag finden; wer die Sprache spricht, soll
 * ihn wiedererkennen.
 */
export function spracheBeschriftung(sprache: Sprache): string {
  return sprache.eigenname === sprache.label
    ? sprache.label
    : `${sprache.eigenname} (${sprache.label})`;
}

/**
 * Sprachen, die als Zielsprache für zweisprachige Antworten in Frage kommen —
 * also alle außer der, in der ohnehin geantwortet wird.
 */
export function zweitsprachen(): Sprache[] {
  return SPRACHEN.filter((sprache) => sprache.id !== BASISSPRACHE);
}

/** Gibt es mindestens eine Sprache mit Schreibrichtung von rechts nach links? */
export function hatRtlSprachen(): boolean {
  return SPRACHEN.some((sprache) => sprache.dir === 'rtl');
}
