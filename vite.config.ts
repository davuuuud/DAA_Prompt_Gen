import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import { readFileSync } from 'node:fs';

// package.json wird gelesen statt importiert: Ein benannter JSON-Import ist
// unter der Modulauflösung NodeNext nicht zulässig.
const { version } = JSON.parse(readFileSync('./package.json', 'utf8')) as { version: string };

// Name und Träger stehen hier an einer Stelle und werden von dort sowohl in
// das Web-Manifest als auch in den Programmcode eingesetzt. Einzige Stelle,
// die zusätzlich gepflegt werden muss: der <title> in index.html.
const APP_NAME = 'Fragenschmiede';
const APP_ORG = 'DAA Mitte-West';
const APP_BESCHREIBUNG =
  'Wer eine KI einfach so fragt, bekommt eine allgemeine Antwort. Die Fragenschmiede ' +
  'baut daraus eine Frage, die Ausbildungsberuf, Niveau und die Anforderungen der ' +
  'Abschlussprüfung berücksichtigt. Läuft lokal auf dem Gerät, ohne Konto.';

// Der Basispfad lässt sich beim Bauen setzen, weil GitHub Pages die Seite
// unter /projektname/ ausliefert und nicht im Wurzelverzeichnis:
//   npm run build -- --base=/ihk-lernassistent/
// Ohne Angabe wird ins Wurzelverzeichnis gebaut.

export default defineConfig({
  // Die Versionsnummer aus package.json wird beim Bauen fest eingesetzt,
  // damit Rückmeldungen einer Fassung zugeordnet werden können.
  define: {
    __APP_VERSION__: JSON.stringify(version),
    __APP_NAME__: JSON.stringify(APP_NAME),
    __APP_ORG__: JSON.stringify(APP_ORG),
  },

  plugins: [
    svelte(),
    VitePWA({
      // Eine neue Fassung wird im Hintergrund geladen und beim nächsten
      // Start übernommen - für ein Werkzeug ohne Sitzungszustand der
      // unauffälligste Weg.
      registerType: 'autoUpdate',
      injectRegister: 'auto',

      // Damit die Anwendung auch beim Entwickeln als installierbar gilt und
      // sich das Offline-Verhalten prüfen lässt.
      devOptions: { enabled: false },

      workbox: {
        // Alles, was der Build erzeugt, wird vorab abgelegt. Die App hat
        // keine Serveraufrufe, daher genügt reines Vorab-Zwischenspeichern.
        globPatterns: ['**/*.{js,css,html,svg,png,ico,webmanifest}'],
        // Jeder unbekannte Pfad liefert die Startseite - sonst zeigt ein
        // Neuladen im Offline-Betrieb einen Fehler.
        navigateFallback: 'index.html',
        cleanupOutdatedCaches: true,
      },

      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],

      manifest: {
        name: `${APP_NAME} – ${APP_ORG}`,
        // Kurzform für den Startbildschirm: Android kürzt ab etwa 12 Zeichen,
        // der Trägerhinweis hätte dort ohnehin keinen Platz.
        short_name: APP_NAME,
        description: APP_BESCHREIBUNG,
        lang: 'de',
        dir: 'ltr',
        start_url: '.',
        scope: '.',
        display: 'standalone',
        orientation: 'portrait-primary',
        background_color: '#f6f7f9',
        theme_color: '#2f5fd0',
        categories: ['education', 'productivity'],
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          {
            src: 'icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
});
