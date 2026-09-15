// Teilen und externe Ziele.
//
// Auf Android ist der Teilen-Dialog der wichtigste Weg: Er schiebt den
// fertigen Prompt in einem Schritt in die App einer KI. Am Schreibtisch
// kennen die meisten Browser navigator.share nicht - dort blendet die
// Oberfläche die Schaltfläche aus, statt eine tote Taste anzubieten.

export interface KiAnbieter {
  name: string;
  url: string;
}

/**
 * Die KI-Dienste, die sich unter dem Prompt öffnen lassen.
 *
 * Aufgenommen ist, wer bekannt ist und sich ohne Anmeldung nutzen lässt
 * (Stand 09/2026). Claude verlangt ein Konto und fehlt deshalb; Perplexity
 * ist eher Suchmaschine und hält sich bei langen, gegliederten Prompts
 * weniger an Form und Ablauf.
 *
 * Alphabetisch, bewusst ohne Rangfolge: Die Anwendung empfiehlt keinen
 * Anbieter. Verwiesen wird nur auf die Startseite — den Prompt über die
 * Adresse mitzugeben (?q=…) hieße, ihn in Adresszeile, Verlauf und
 * Serverprotokolle zu schreiben, und für viele Prompts wäre die Adresse zu
 * lang.
 */
export const KI_ANBIETER: readonly KiAnbieter[] = [
  { name: 'ChatGPT', url: 'https://chatgpt.com/' },
  { name: 'Copilot', url: 'https://copilot.microsoft.com/' },
  { name: 'Gemini', url: 'https://gemini.google.com/' },
  { name: 'Le Chat', url: 'https://chat.mistral.ai/' },
];

export function canShare(): boolean {
  return typeof navigator !== 'undefined' && typeof navigator.share === 'function';
}

export type ShareResult = 'geteilt' | 'abgebrochen' | 'nicht-verfuegbar';

export async function shareText(title: string, text: string): Promise<ShareResult> {
  if (!canShare()) return 'nicht-verfuegbar';
  try {
    await navigator.share({ title, text });
    return 'geteilt';
  } catch (fehler) {
    // AbortError bedeutet: Der Dialog wurde bewusst geschlossen. Das ist
    // kein Fehler und darf keine Meldung auslösen.
    if (fehler instanceof DOMException && fehler.name === 'AbortError') return 'abgebrochen';
    return 'nicht-verfuegbar';
  }
}

