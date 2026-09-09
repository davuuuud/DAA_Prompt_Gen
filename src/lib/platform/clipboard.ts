// Zwischenablage mit Rückfallebene.
//
// navigator.clipboard steht nur in sicheren Kontexten zur Verfügung. Beim
// Öffnen der HTML-Datei per Doppelklick ist das je nach Browser nicht
// gegeben - dann greift der alte Weg über ein unsichtbares Textfeld.

export async function copyText(text: string): Promise<boolean> {
  if (!text) return false;

  try {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* Rückfall unten */
  }

  return legacyCopy(text);
}

function legacyCopy(text: string): boolean {
  try {
    const feld = document.createElement('textarea');
    feld.value = text;
    feld.setAttribute('readonly', '');
    // Außerhalb des Sichtfelds, aber fokussierbar - sonst kopiert Safari nicht.
    feld.style.position = 'fixed';
    feld.style.top = '-1000px';
    feld.style.opacity = '0';
    document.body.appendChild(feld);
    feld.select();
    feld.setSelectionRange(0, text.length);
    const erfolg = document.execCommand('copy');
    document.body.removeChild(feld);
    return erfolg;
  } catch {
    return false;
  }
}
