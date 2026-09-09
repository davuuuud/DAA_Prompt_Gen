// Erzeugt eine einzelne, in sich geschlossene HTML-Datei.
//
// Zweck: Weitergabe an einzelne Personen ohne Webspace. Die Datei lässt sich
// per E-Mail verschicken und mit einem Doppelklick öffnen - kein Server,
// kein Konto, kein HTTPS.
//
// Dafür wird JavaScript, CSS und das Symbol in die HTML-Datei eingebettet
// und alles entfernt, was ohne Server keinen Sinn ergibt: Service Worker
// und Web-Manifest. Damit entfallen in dieser Fassung auch der
// Offline-Zwischenspeicher (unnötig - die Datei liegt ja lokal) und
// "Zum Startbildschirm hinzufügen".
//
// Aufruf: npm run build:datei

import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const wurzel = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(wurzel, 'dist');
const ziel = join(wurzel, 'dist-datei');
const dateiname = 'IHK-Lernassistent.html';

let html = await readFile(join(dist, 'index.html'), 'utf8');

// --- Bausteine einsammeln ---------------------------------------------------
const assets = await readdir(join(dist, 'assets'));
const jsDatei = assets.find((n) => n.endsWith('.js'));
const cssDatei = assets.find((n) => n.endsWith('.css'));
if (!jsDatei || !cssDatei) {
  throw new Error('In dist/assets fehlt JavaScript oder CSS - erst "npm run build" ausführen.');
}
const js = await readFile(join(dist, 'assets', jsDatei), 'utf8');
const css = await readFile(join(dist, 'assets', cssDatei), 'utf8');
const favicon = await readFile(join(dist, 'favicon.svg'), 'utf8');

// --- Ersetzen ---------------------------------------------------------------
// Reihenfolge beachten: erst entfernen, was rausfliegt, dann einbetten.

// Service Worker und Manifest ergeben ohne Server keinen Sinn.
html = html.replace(/<script[^>]*id="vite-plugin-pwa:register-sw"[^>]*>\s*<\/script>/g, '');
html = html.replace(/<link[^>]*rel="manifest"[^>]*>/g, '');
html = html.replace(/<link[^>]*rel="apple-touch-icon"[^>]*>/g, '');

// Symbol als Daten-URI, damit keine Datei danebenliegen muss.
const faviconUri = `data:image/svg+xml;base64,${Buffer.from(favicon, 'utf8').toString('base64')}`;
html = html.replace(/<link[^>]*rel="icon"[^>]*>/g, `<link rel="icon" href="${faviconUri}" />`);

// Stylesheet einbetten.
html = html.replace(
  /<link[^>]*rel="stylesheet"[^>]*>/g,
  `<style>\n${css}\n</style>`,
);

// JavaScript einbetten. Als eingebettetes Modul entfällt der Netzwerkabruf,
// den der Browser bei file:// ohnehin blockieren würde.
html = html.replace(
  /<script[^>]*type="module"[^>]*src="[^"]*"[^>]*>\s*<\/script>/g,
  `<script type="module">\n${js}\n</script>`,
);

// Hinweis für alle, die die Datei später im Editor öffnen.
html = html.replace(
  '<head>',
  '<head>\n    <!-- Eigenständige Fassung: alles in dieser Datei. Erzeugt mit npm run build:datei. -->',
);

// --- Prüfen und schreiben ---------------------------------------------------
for (const verboten of ['/assets/', 'registerSW.js', 'manifest.webmanifest']) {
  if (html.includes(verboten)) {
    throw new Error(`Verweis auf "${verboten}" blieb stehen - die Datei wäre nicht eigenständig.`);
  }
}

await mkdir(ziel, { recursive: true });
await writeFile(join(ziel, dateiname), html, 'utf8');

const kb = (Buffer.byteLength(html, 'utf8') / 1024).toFixed(0);
console.log(`${dateiname}  ${kb} kB  ->  dist-datei/`);
