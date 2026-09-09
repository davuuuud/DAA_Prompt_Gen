// Einstellungen, die beim Bauen feststehen.

// Wird von Vite beim Bauen aus package.json eingesetzt.
declare const __APP_VERSION__: string;

export const APP_VERSION: string = __APP_VERSION__;

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
  email: 'mitte-west-ki-genies@tinytux.de',
  url: 'https://github.com/davuuuud/DAA_Prompt_Gen/issues',
} as const;
