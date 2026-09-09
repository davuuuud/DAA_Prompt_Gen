// Textwerkzeuge ohne Abhängigkeit zu Oberfläche oder Plattform.

export const MIN_ANZAHL = 1;
export const MAX_ANZAHL = 50;
export const DEFAULT_ANZAHL = 8;

/** Wählt zwischen Einzahl und Mehrzahl. */
export function plural(n: number, singular: string, mehrzahl: string): string {
  return n === 1 ? singular : mehrzahl;
}

/**
 * Vereinheitlicht Zeilenenden auf "\n". Texte aus Eingabefeldern kommen je
 * nach Plattform mit "\r\n" an; ohne diese Normalisierung entstünden beim
 * späteren Umwandeln doppelte Wagenrückläufe.
 */
export function normalizeLF(value: string): string {
  return value.includes('\r') ? value.replace(/\r\n?/g, '\n') : value;
}

/** Erzeugt Windows-Zeilenenden für Zwischenablage und Dateiexport. */
export function toCRLF(value: string): string {
  return normalizeLF(value).replace(/\n/g, '\r\n');
}

/**
 * Entfernt überflüssige Leerzeilen und Zeilenendabstände aus Benutzer-
 * eingaben. Führende Einrückung bleibt erhalten, weil sie in Listen und
 * Rechenwegen Bedeutung tragen kann.
 */
export function collapseBlankLines(value: string): string {
  const lines = normalizeLF(value).split('\n');
  const out: string[] = [];
  let lastWasBlank = false;

  for (const raw of lines) {
    const line = raw.replace(/[ \t]+$/, '');
    if (line.trim() === '') {
      if (lastWasBlank || out.length === 0) continue;
      lastWasBlank = true;
      out.push('');
      continue;
    }
    lastWasBlank = false;
    out.push(line);
  }

  while (out.length > 0 && out[out.length - 1] === '') out.pop();
  return out.join('\n');
}

/** Hält einen Zahlenwert in einem Bereich; ungültige Eingaben fallen zurück. */
export function clampNumber(value: number, min: number, max: number, fallback: number): number {
  if (!Number.isFinite(value)) return fallback;
  const rounded = Math.round(value);
  if (rounded < min) return min;
  if (rounded > max) return max;
  return rounded;
}

/** Liest das Anzahl-Feld und begrenzt es auf einen sinnvollen Bereich. */
export function parseAnzahl(value: string | number): number {
  const parsed = typeof value === 'number' ? value : Number.parseInt(String(value).trim(), 10);
  if (!Number.isFinite(parsed)) return DEFAULT_ANZAHL;
  return clampNumber(parsed, MIN_ANZAHL, MAX_ANZAHL, DEFAULT_ANZAHL);
}

/**
 * Zerlegt frei eingetragene Quellen an Zeilenumbruch und Semikolon.
 *
 * Das Komma ist bewusst KEIN Trenner: Fachbuchzitate wie
 * "Schmidt/Futterer, Mietrecht" enthalten regelmäßig eines und würden sonst
 * in zwei Quellen zerfallen - eine davon frei erfunden. Eine nicht
 * aufgetrennte Aufzählung liest sich im Prompt dagegen völlig unauffällig.
 */
export function splitFreitext(value: string): string[] {
  return normalizeLF(value)
    .split(/[\n;]/)
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
}

/** Kürzt einen Text an einer Wortgrenze und hängt eine Auslassung an. */
export function truncateWords(value: string, maxChars: number): string {
  const text = value.trim();
  if (text.length <= maxChars) return text;
  const cut = text.slice(0, maxChars);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > maxChars * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd() + ' […]';
}
