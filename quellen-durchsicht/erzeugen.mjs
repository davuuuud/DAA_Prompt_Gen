// Erzeugt aus daten.mjs je einen Durchsichtsbogen pro Beruf.
//
//   node quellen-durchsicht/erzeugen.mjs
//
// Ergebnis: quellen-durchsicht/blaetter/<kuerzel>.html
//
// Die Bögen sind eigenständige HTML-Dateien ohne Verweise nach außen: Sie
// lassen sich als Anhang verschicken, im Browser öffnen und ausdrucken. Wer
// sie am Bildschirm ausfüllt, kann die Kästchen anklicken und über "Drucken →
// Als PDF speichern" zurückschicken.

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ALLGEMEIN, BERUFE, STAND } from './daten.mjs';

const HIER = dirname(fileURLToPath(import.meta.url));
const ZIEL = join(HIER, 'blaetter');

// Ab wann ein Eintrag der allgemeinen Liste als Grenzfall markiert wird.
// Bewusst nicht bei 13 von 14: Eine Markierung, die fast überall steht,
// lenkt den Blick nicht mehr, sondern ermüdet ihn.
const GRENZFALL_AB = 12;

const ART_TITEL = {
  gesetz: 'Gesetze, Verordnungen und EU-Recht',
  norm: 'Normen, technische Regeln und Branchenstandards',
  vorgabe: 'Prüfungs- und Ausbildungsvorgaben',
  nachschlagewerk: 'Nachschlagewerke und Fachliteratur',
  rechtsprechung: 'Rechtsprechung',
  daten: 'Amtliche Daten und Verbandsstatistik',
};

// Reihenfolge der Abschnitte auf dem Bogen.
const ART_REIHENFOLGE = [
  'vorgabe',
  'gesetz',
  'norm',
  'nachschlagewerk',
  'rechtsprechung',
  'daten',
];

function schuetzen(text) {
  return String(text ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function zeile(quelle) {
  const hinweis = quelle.hinweis
    ? `<span class="hinweis">${schuetzen(quelle.hinweis)}</span>`
    : '';
  const geltung =
    quelle.geltung !== undefined && quelle.geltung < GRENZFALL_AB
      ? `<span class="grenzfall" title="Nach meiner Einschätzung nicht bei allen Berufen nötig">` +
        `Grenzfall: ${quelle.geltung} von 14</span>`
      : '';
  return `        <tr>
          <td class="quelle">
            <strong>${schuetzen(quelle.kuerzel)}</strong>
            <span class="titel">${schuetzen(quelle.titel)}</span>
            ${hinweis}
            ${geltung}
          </td>
          <td class="kasten"><input type="checkbox" /></td>
          <td class="kasten"><input type="checkbox" /></td>
          <td class="kasten"><input type="checkbox" /></td>
          <td class="anmerkung"></td>
        </tr>`;
}

function tabelle(quellen) {
  return `      <table>
        <thead>
          <tr>
            <th class="quelle">Quelle</th>
            <th class="kasten">kommt<br />vor</th>
            <th class="kasten">strei&shy;chen</th>
            <th class="kasten">vorein&shy;stellen</th>
            <th class="anmerkung">Anmerkung</th>
          </tr>
        </thead>
        <tbody>
${quellen.map(zeile).join('\n')}
        </tbody>
      </table>`;
}

function abschnitte(quellen, ueberschriftStufe = 'h3') {
  return ART_REIHENFOLGE.map((art) => {
    const passend = quellen.filter((quelle) => quelle.art === art);
    if (passend.length === 0) return '';
    return `      <${ueberschriftStufe}>${ART_TITEL[art]}</${ueberschriftStufe}>
${tabelle(passend)}`;
  })
    .filter(Boolean)
    .join('\n\n');
}

function leerzeilen(anzahl) {
  return Array.from(
    { length: anzahl },
    () => `        <tr>
          <td class="quelle leer"></td>
          <td class="kasten"></td>
          <td class="kasten"></td>
          <td class="kasten"></td>
          <td class="anmerkung"></td>
        </tr>`,
  ).join('\n');
}

const STIL = `
  :root {
    --rand: #d4d8de;
    --grau: #5b6472;
    --akzent: #1d4ed8;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    padding: 2rem 1.5rem 4rem;
    max-width: 60rem;
    margin-inline: auto;
    font-family: "Segoe UI", system-ui, sans-serif;
    font-size: 10.5pt;
    line-height: 1.45;
    color: #16191f;
    background: #fff;
  }
  h1 { font-size: 1.5rem; margin: 0 0 .2rem; }
  h2 {
    font-size: 1.1rem;
    margin: 2.2rem 0 .4rem;
    padding-bottom: .25rem;
    border-bottom: 2px solid var(--akzent);
  }
  h3 { font-size: .95rem; margin: 1.3rem 0 .35rem; color: var(--grau); }
  p { margin: 0 0 .6rem; }
  .kopf { margin-bottom: .4rem; color: var(--grau); }
  .beruf { font-size: 1.05rem; font-weight: 600; color: var(--akzent); }

  .hinweiskasten {
    border: 1px solid var(--rand);
    border-left: 4px solid var(--akzent);
    padding: .8rem 1rem;
    margin: 1.2rem 0;
    background: #f7f9fc;
  }
  .hinweiskasten p:last-child { margin-bottom: 0; }
  .warnung { border-left-color: #b45309; background: #fffbf2; }

  .felder {
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
    margin: 1rem 0 1.4rem;
  }
  .felder div { flex: 1 1 12rem; }
  .felder span { display: block; font-size: .75rem; color: var(--grau); }
  .linie { border-bottom: 1px solid #9aa2ad; height: 1.5rem; }

  table { width: 100%; border-collapse: collapse; margin-bottom: .8rem; }
  th, td {
    border: 1px solid var(--rand);
    padding: .35rem .45rem;
    vertical-align: top;
    text-align: left;
  }
  th {
    background: #eef2f7;
    font-size: .72rem;
    font-weight: 600;
    line-height: 1.2;
  }
  th.kasten, td.kasten { width: 3.2rem; text-align: center; }
  th.anmerkung, td.anmerkung { width: 30%; }
  td.anmerkung { background: #fcfcfd; }
  td.quelle strong { display: inline; }
  td.quelle .titel { display: block; }
  td.quelle .hinweis { display: block; font-size: .78rem; color: var(--grau); }
  td.quelle.leer { height: 2.1rem; }
  .grenzfall {
    display: inline-block;
    margin-top: .2rem;
    padding: .05rem .35rem;
    font-size: .68rem;
    color: #92400e;
    background: #fef3c7;
    border-radius: 3px;
  }
  input[type="checkbox"] { width: 1rem; height: 1rem; }

  .legende { font-size: .8rem; color: var(--grau); }
  .legende dt { font-weight: 600; color: #16191f; float: left; clear: left; margin-right: .4rem; }
  .legende dd { margin: 0 0 .25rem; }

  footer {
    margin-top: 2.5rem;
    padding-top: .8rem;
    border-top: 1px solid var(--rand);
    font-size: .78rem;
    color: var(--grau);
  }

  @media print {
    body { padding: 0; font-size: 9.5pt; }
    h2 { break-after: avoid; }
    h3 { break-after: avoid; }
    table { break-inside: auto; }
    tr { break-inside: avoid; }
    thead { display: table-header-group; }
    .hinweiskasten { break-inside: avoid; }
  }
`;

function bogen(beruf) {
  const pruefstelle = beruf.pruefstelle
    ? `Prüfungsstelle: ${beruf.pruefstelle}`
    : 'Keine Kammerprüfung';

  const bemerkung = beruf.bemerkung
    ? `  <div class="hinweiskasten warnung">
    <p><strong>Besonderheit dieses Berufs.</strong> ${schuetzen(beruf.bemerkung)}</p>
  </div>`
    : '';

  return `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Quellen-Durchsicht ${schuetzen(beruf.kuerzel)} – Fragenschmiede</title>
<style>${STIL}</style>
</head>
<body>

<p class="kopf">Fragenschmiede · Durchsicht des Quellenkatalogs · Stand ${STAND}</p>
<h1>Welche Quellen gehören zu diesem Beruf?</h1>
<p class="beruf">${schuetzen(beruf.kuerzel)} — ${schuetzen(beruf.name)} · ${pruefstelle}</p>

<div class="felder">
  <div><span>Ausgefüllt von</span><div class="linie"></div></div>
  <div><span>Datum</span><div class="linie"></div></div>
  <div><span>Rückmeldung an</span><div class="linie"></div></div>
</div>

<div class="hinweiskasten">
  <p><strong>Worum es geht.</strong> Die Fragenschmiede baut aus Ihren Angaben
  eine Frage an eine KI. Darin steht unter anderem, auf welche Quellen sich die
  Antwort stützen soll. Diese Liste steuert also unmittelbar, wie gut oder wie
  beliebig die Antwort ausfällt.</p>

  <p><strong>Warum Sie gefragt werden.</strong> Die Liste stammt aus allgemeinem
  Wissen, <strong>nicht aus Unterrichtserfahrung.</strong> Sie ist ein Vorschlag,
  keine Setzung. Eine falsch zugeordnete Quelle lenkt die KI in die falsche
  Richtung; eine fehlende lässt sie ins Allgemeine ausweichen.</p>

  <p><strong>Wie lange es dauert.</strong> Etwa 20 bis 30 Minuten. Wo Sie unsicher
  sind, lassen Sie die Zeile einfach leer — auch das ist eine Auskunft.</p>
</div>

<dl class="legende">
  <dt>kommt vor</dt><dd>Die Quelle wird im Unterricht oder in der Prüfung tatsächlich gebraucht.</dd>
  <dt>streichen</dt><dd>Spielt bei diesem Beruf keine Rolle und soll aus der Auswahl verschwinden.</dd>
  <dt>voreinstellen</dt><dd>So grundlegend, dass sie beim Öffnen der Anwendung bereits angehakt sein soll. Bitte sparsam: Alles anzuhaken hilft der KI nicht.</dd>
  <dt>Anmerkung</dt><dd>Etwa: nur ein bestimmter Abschnitt, veraltete Fassung, anderer Name im Unterricht.</dd>
</dl>

${bemerkung}

<h2>Teil 1 — Quellen für alle Berufe</h2>
<p>Diese Liste erscheint bei jedem Beruf. Wenn ein Eintrag hier bei
<em>Ihrem</em> Beruf keine Rolle spielt, ist das eine besonders wichtige
Rückmeldung: Dann steht er womöglich an der falschen Stelle. Gelb markierte
Einträge halte ich selbst für Grenzfälle.</p>

${abschnitte(ALLGEMEIN)}

<h2>Teil 2 — Nur bei ${schuetzen(beruf.kuerzel)}</h2>
<p>Diese Einträge erscheinen ausschließlich bei diesem Beruf.</p>

${abschnitte(beruf.quellen)}

<h2>Teil 3 — Was fehlt?</h2>
<p>Der wichtigste Teil. Welche Gesetze, Verordnungen, Normen, Nachschlagewerke
oder Gerichtsentscheidungen brauchen Ihre Teilnehmenden, die oben nicht stehen?
Auch das im Unterricht eingesetzte Lehrwerk mit Titel und Auflage ist hier
willkommen.</p>

<table>
  <thead>
    <tr>
      <th class="quelle">Fehlende Quelle</th>
      <th class="kasten">für alle Berufe</th>
      <th class="kasten">nur hier</th>
      <th class="kasten">vorein&shy;stellen</th>
      <th class="anmerkung">Wozu wird sie gebraucht?</th>
    </tr>
  </thead>
  <tbody>
${leerzeilen(12)}
  </tbody>
</table>

<h2>Teil 4 — Zwei Fragen zum Schluss</h2>

<p><strong>1. Welche drei Quellen sind die wichtigsten?</strong> Wenn nur drei
in der Anwendung stünden — welche?</p>
<div class="linie"></div>
<div class="linie"></div>

<p style="margin-top:1rem"><strong>2. Wo geht die KI erfahrungsgemäß in die
Irre?</strong> Gibt es Themen, bei denen KI-Antworten regelmäßig falsch oder
irreführend sind? Dann kann die Anwendung dort besonders warnen.</p>
<div class="linie"></div>
<div class="linie"></div>
<div class="linie"></div>

<footer>
  <p>Fragenschmiede — ein privates Projekt, kein Angebot der DAA.
  Rückmeldung an mitte-west-ki-genies@tinytux.de.
  Dieser Bogen enthält keine personenbezogenen Daten und darf frei
  weitergegeben werden.</p>
</footer>

</body>
</html>
`;
}

function uebersicht() {
  const grenzfaelle = ALLGEMEIN.filter(
    (quelle) => quelle.geltung !== undefined && quelle.geltung < GRENZFALL_AB,
  ).sort((a, b) => a.geltung - b.geltung);

  const zeilen = BERUFE.map(
    (beruf) => `      <tr>
        <td><strong>${schuetzen(beruf.kuerzel)}</strong> — ${schuetzen(beruf.name)}</td>
        <td class="kasten">${beruf.quellen.length}</td>
        <td>${schuetzen(beruf.pruefstelle ?? '— keine Kammerprüfung —')}</td>
      </tr>`,
  ).join('\n');

  return `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Quellen-Durchsicht – Übersicht</title>
<style>${STIL}</style>
</head>
<body>

<p class="kopf">Fragenschmiede · Durchsicht des Quellenkatalogs · Stand ${STAND}</p>
<h1>Übersicht für die Vorbereitung</h1>
<p>Diese Seite ist <strong>nicht</strong> für die Ansprechpartner gedacht,
sondern für die eigene Vorbereitung. Jeder Ansprechpartner bekommt nur den
Bogen seines Berufs.</p>

<h2>Die Bögen</h2>
<table>
  <thead>
    <tr>
      <th>Beruf</th>
      <th class="kasten">eigene Quellen</th>
      <th>Prüfungsstelle</th>
    </tr>
  </thead>
  <tbody>
${zeilen}
  </tbody>
</table>
<p class="legende">Dazu kommen bei jedem Bogen ${ALLGEMEIN.length} allgemeine
Quellen. Insgesamt sind das ${ALLGEMEIN.length + BERUFE.reduce((summe, beruf) => summe + beruf.quellen.length, 0)}
Vorschläge.</p>

<h2>Grenzfälle der allgemeinen Liste</h2>
<p>Diese Einträge stehen in der allgemeinen Liste, obwohl ich sie nur bei einem
Teil der Berufe für nötig halte. Sie sind die wahrscheinlichsten Kandidaten
dafür, aus der allgemeinen Liste heraus- und in einzelne Berufe hineinzuwandern.
Kommen mehrere Rückmeldungen "streichen", ist das der Auslöser.</p>

<table>
  <thead>
    <tr>
      <th>Quelle</th>
      <th class="kasten">Berufe</th>
      <th>Vermutung</th>
    </tr>
  </thead>
  <tbody>
${grenzfaelle
  .map(
    (quelle) => `      <tr>
        <td><strong>${schuetzen(quelle.kuerzel)}</strong> — ${schuetzen(quelle.titel)}</td>
        <td class="kasten">${quelle.geltung}/14</td>
        <td>${schuetzen(quelle.hinweis ?? '')}</td>
      </tr>`,
  )
  .join('\n')}
  </tbody>
</table>

<h2>Worauf beim Auswerten zu achten ist</h2>
<div class="hinweiskasten">
  <p><strong>FISI und FKS sind die Ausreißer.</strong> Beide sind nicht
  kaufmännisch. Wenn dort die halbe allgemeine Liste gestrichen wird, ist das
  kein Fehler der Rückmeldung, sondern ein Hinweis darauf, dass "allgemein"
  in Wahrheit "allgemein kaufmännisch" heißt.</p>

  <p><strong>KGQ ist ein Sonderfall.</strong> Keine Kammerprüfung, keine
  Ausbildungsordnung. Hier ist eine kurze Liste vermutlich besser als eine
  vollständige.</p>

  <p><strong>SFA gehört nicht zur IHK.</strong> Prüfungsordnung und
  Aufgabenmaterial kommen von der Steuerberaterkammer.</p>

  <p><strong>Rechtsprechung ist die schwächste Kategorie.</strong> Die meisten
  Kammerprüfungen fragen Regeln ab, nicht Urteile. Ausnahmen sind IMK
  (Mietrecht) und SFA (BFH). Wenn dort niemand Urteile nennt, kann die
  Kategorie ganz entfallen.</p>
</div>

<footer>
  <p>Erzeugt aus <code>quellen-durchsicht/daten.mjs</code>.
  Änderungen dort und erneut <code>node quellen-durchsicht/erzeugen.mjs</code>
  ausführen.</p>
</footer>

</body>
</html>
`;
}

mkdirSync(ZIEL, { recursive: true });

for (const beruf of BERUFE) {
  const datei = join(ZIEL, `${beruf.kuerzel}.html`);
  writeFileSync(datei, bogen(beruf), 'utf8');
  console.log(
    `${beruf.kuerzel.padEnd(5)} ${String(beruf.quellen.length).padStart(2)} eigene ` +
      `+ ${ALLGEMEIN.length} allgemeine → blaetter/${beruf.kuerzel}.html`,
  );
}

writeFileSync(join(ZIEL, '_uebersicht.html'), uebersicht(), 'utf8');
console.log(`\n${BERUFE.length} Bögen und eine Übersicht in ${ZIEL}`);
