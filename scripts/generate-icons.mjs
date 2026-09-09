// Erzeugt die PNG-Symbole für Web-Manifest und Startbildschirm aus den
// SVG-Vorlagen in assets-src/.
//
// Läuft nicht bei jedem Build mit, sondern nur auf Zuruf (npm run icons).
// Die Ergebnisse liegen in public/ und gehören ins Projekt - so braucht der
// normale Build weder sharp noch die Vorlagen.

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const wurzel = join(dirname(fileURLToPath(import.meta.url)), '..');
const quelle = join(wurzel, 'assets-src');
const ziel = join(wurzel, 'public');

/** @type {{ vorlage: string, datei: string, groesse: number }[]} */
const aufgaben = [
  { vorlage: 'icon.svg', datei: 'icon-192.png', groesse: 192 },
  { vorlage: 'icon.svg', datei: 'icon-512.png', groesse: 512 },
  // 180 Pixel ist die Größe, die iOS für den Startbildschirm erwartet.
  { vorlage: 'icon.svg', datei: 'apple-touch-icon.png', groesse: 180 },
  { vorlage: 'icon-maskable.svg', datei: 'icon-maskable-512.png', groesse: 512 },
];

await mkdir(ziel, { recursive: true });

for (const { vorlage, datei, groesse } of aufgaben) {
  const svg = await readFile(join(quelle, vorlage));
  const png = await sharp(svg, { density: 384 })
    .resize(groesse, groesse, { fit: 'contain' })
    .png({ compressionLevel: 9 })
    .toBuffer();
  await writeFile(join(ziel, datei), png);
  console.log(`${datei.padEnd(28)} ${groesse}x${groesse}  ${(png.length / 1024).toFixed(1)} kB`);
}

// Das Favicon bleibt SVG: skaliert verlustfrei und ist kleiner als jedes PNG.
await writeFile(join(ziel, 'favicon.svg'), await readFile(join(quelle, 'icon.svg')));
console.log('favicon.svg                  (SVG übernommen)');
