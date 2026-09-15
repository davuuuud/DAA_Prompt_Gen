// Einstellungen, die beim Bauen feststehen.

// Werden von Vite beim Bauen eingesetzt; gepflegt in vite.config.ts.
declare const __APP_VERSION__: string;
declare const __BUILD_DATE__: string;
declare const __APP_NAME__: string;

export const APP_VERSION: string = __APP_VERSION__;

/** Tag der Auslieferung, „13.09." — unterscheidet zwei Bauläufe derselben
 *  Fassung. */
export const BUILD_DATE: string = __BUILD_DATE__;

/** Name der Anwendung, z. B. für Überschrift und Betreffzeilen. */
export const APP_NAME: string = __APP_NAME__;

/**
 * Ziel für Rückmeldungen aus der Anwendung.
 *
 * `email` hat Vorrang. Ist sie leer, verweist die Anwendung stattdessen auf
 * `url`. Sind beide leer, erscheint kein Verweis.
 *
 * Hinweis: Eine hier eingetragene E-Mail-Adresse steht im ausgelieferten
 * Programm und ist damit öffentlich lesbar. Für eine öffentlich verlinkte
 * Anwendung besser eine eigens dafür angelegte Adresse verwenden als eine
 * private.
 */
export const FEEDBACK = {
  email: 'fragenschmiede@tinytux.de',
  url: 'https://github.com/davuuuud/Fragenschmiede/issues',
} as const;
