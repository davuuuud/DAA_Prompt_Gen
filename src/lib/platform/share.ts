// Teilen und externe Ziele.
//
// Auf Android ist der Teilen-Dialog der wichtigste Weg: Er schiebt den
// fertigen Prompt in einem Schritt in die ChatGPT-App. Am Schreibtisch
// kennen die meisten Browser navigator.share nicht - dort blendet die
// Oberfläche die Schaltfläche aus, statt eine tote Taste anzubieten.

export const CHATGPT_URL = 'https://chatgpt.com/';

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

export function openChatGPT(): void {
  window.open(CHATGPT_URL, '_blank', 'noopener,noreferrer');
}
