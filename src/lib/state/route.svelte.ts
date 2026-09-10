// Seitenumschaltung über den Adressanker (#/impressum).
//
// Bewusst kein Router aus einer Bibliothek: Es gibt drei Seiten, und ein
// Anker kommt ohne Serverkonfiguration aus. Beim Aufruf von
// beispiel.de/#/impressum fordert der Browser weiterhin nur die Startseite
// an — das ist genau das, was GitHub Pages und der Offline-Zwischenspeicher
// ausliefern können.

export type Seite = 'app' | 'impressum' | 'datenschutz';

function lesen(): Seite {
  if (typeof location === 'undefined') return 'app';
  const anker = location.hash.replace(/^#\/?/, '').toLowerCase();
  if (anker === 'impressum') return 'impressum';
  if (anker === 'datenschutz') return 'datenschutz';
  return 'app';
}

class Navigation {
  seite = $state<Seite>(lesen());

  constructor() {
    if (typeof window === 'undefined') return;
    window.addEventListener('hashchange', () => {
      this.seite = lesen();
      // Beim Seitenwechsel nach oben, sonst landet man mitten im Text.
      window.scrollTo({ top: 0 });
    });
  }
}

export const navigation = new Navigation();

export const ANKER: Record<Seite, string> = {
  app: '#/',
  impressum: '#/impressum',
  datenschutz: '#/datenschutz',
};
