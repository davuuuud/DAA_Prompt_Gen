<script lang="ts">
  // Was die Auswahlfelder bewirken — die Übersicht, die ins Formular nicht
  // hineinpasst.
  //
  // Alles hier kommt aus den Katalogen, nichts ist abgeschrieben. Wird eine
  // Aufgabe ergänzt oder eine Beschreibung geändert, ändert sich diese Seite
  // mit; eine abgetippte Tabelle wäre nach der ersten Änderung falsch.
  import {
    aufgabenNachGruppe,
    FACHSPRACHEN,
    FORMATE,
    NIVEAUS,
    niveauBeschriftung,
  } from '../domain/catalogs';
  import Rechtsseite from './Rechtsseite.svelte';

  const gruppen = aufgabenNachGruppe();

  /** Was eine Aufgabe zusätzlich verlangt oder festlegt. */
  function merkmale(aufgabe: (typeof gruppen)[number]['aufgaben'][number]): string[] {
    const liste: string[] = [];
    if (aufgabe.needsCount) liste.push('braucht eine Anzahl');
    if (aufgabe.needsZusatz) liste.push('verlangt deine eigene Lösung');
    if (aufgabe.formFest) liste.push('gibt die Ausgabeform selbst vor');
    if (aufgabe.dialog) liste.push('Wechselgespräch im Chat');
    return liste;
  }
</script>

<Rechtsseite titel="Was die Felder bewirken" stand="September 2026">
  <div class="rechtstext">
    <p>
      Die Fragenschmiede baut aus deinen Angaben eine Frage an eine KI. Diese Seite sagt, was
      jedes Feld daran ändert. Sie lässt sich ausdrucken.
    </p>

    <h2>Aufgabe</h2>
    <p>
      Die Aufgabe bestimmt die <em>Form</em> der Antwort — was für ein Text am Ende dasteht. Sie
      wirkt stärker als alle übrigen Felder.
    </p>

    {#each gruppen as gruppe (gruppe.gruppe)}
      <h3>{gruppe.gruppe}</h3>
      <table>
        <thead>
          <tr><th scope="col">Aufgabe</th><th scope="col">Was herauskommt</th></tr>
        </thead>
        <tbody>
          {#each gruppe.aufgaben as aufgabe (aufgabe.id)}
            <tr>
              <th scope="row">{aufgabe.label}</th>
              <td>
                {aufgabe.erlaeuterung}
                {#if merkmale(aufgabe).length > 0}
                  <span class="merkmal">{merkmale(aufgabe).join(' · ')}</span>
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/each}

    <h2>Niveau</h2>
    <p>Das Niveau bestimmt den <em>Anspruch</em>, nicht die Form und nicht die Sprache.</p>
    <table>
      <thead>
        <tr><th scope="col">Stufe</th><th scope="col">Was das heißt</th></tr>
      </thead>
      <tbody>
        {#each NIVEAUS as niveau (niveau.id)}
          <tr>
            <th scope="row">{niveauBeschriftung(niveau)}</th>
            <td>{niveau.rule.replace(/^Anspruch: /, '')}</td>
          </tr>
        {/each}
      </tbody>
    </table>

    <h2>Ausgabeform</h2>
    <p>
      Die Ausgabeform bestimmt die <em>Darstellung</em>. Sie erscheint nur bei den Aufgaben, die
      die Form offen lassen — bei Karteikarten oder einem Geschäftsbrief steht sie schon fest.
    </p>
    <table>
      <thead>
        <tr><th scope="col">Form</th><th scope="col">Was das heißt</th></tr>
      </thead>
      <tbody>
        {#each FORMATE as format (format.id)}
          <tr>
            <th scope="row">{format.label}</th>
            <td>{format.rule.replace(/^Form: /, '')}</td>
          </tr>
        {/each}
      </tbody>
    </table>

    <h2>Fachbegriffe</h2>
    <p>
      Diese Wahl betrifft die <em>Sprache</em>, nicht den Anspruch: Auch die einfachste Stufe
      lässt die Fachbegriffe stehen, weil sie in der Prüfung so vorkommen.
    </p>
    <table>
      <thead>
        <tr><th scope="col">Wahl</th><th scope="col">Was das heißt</th></tr>
      </thead>
      <tbody>
        {#each FACHSPRACHEN as stufe (stufe.id)}
          <tr><th scope="row">{stufe.label}</th><td>{stufe.rule}</td></tr>
        {/each}
      </tbody>
    </table>

    <h2>Die übrigen Felder</h2>
    <ul>
      <li>
        <strong>Ausbildungsberuf</strong> — bestimmt, welche Quellen zur Wahl stehen und welche
        Prüfungsstelle im Prompt genannt wird.
      </li>
      <li>
        <strong>Zweite Sprache in der Antwort</strong> — für Lernende mit geringen
        Deutschkenntnissen. Die deutsche Antwort bleibt vollständig und steht voran, die zweite
        Sprache erklärt sie zusätzlich. Fachbegriffe bleiben auch dort deutsch, weil die Prüfung
        auf Deutsch stattfindet.
      </li>
      <li>
        <strong>Bevorzugte Quellen</strong> — Gesetze, Normen und Nachschlagewerke, auf die sich
        die Antwort stützen soll. Vorab angehakt ist, was für den Beruf wichtig ist oder
        normalerweise vorkommt.
      </li>
      <li>
        <strong>Weitere Quellen</strong> und <strong>Zusätzliche Angaben</strong> unter „Sonstige
        Optionen" — eigenes Lehrbuch, Vorgaben der Prüfungsstelle, der Stand im Unterricht.
      </li>
    </ul>

    <h2>Was immer gilt</h2>
    <p>
      Unabhängig von der Auswahl steht in jedem Prompt: keine erfundenen Quellen, Paragraphen
      oder Zahlen; Unsicherheiten benennen statt überspielen; Zahlenbeispiele vollständig
      vorrechnen; und die Antwort an den Anforderungen der Abschlussprüfung ausrichten.
    </p>
  </div>
</Rechtsseite>

<style>
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 0.5rem 0 1.25rem;
    font-size: 0.9rem;
  }

  th,
  td {
    border-bottom: 1px solid var(--rand);
    padding: 0.5rem 0.6rem 0.5rem 0;
    text-align: left;
    vertical-align: top;
  }

  thead th {
    font-size: 0.8rem;
    letter-spacing: 0.03em;
    text-transform: uppercase;
    color: var(--text-schwach);
  }

  tbody th {
    width: 14rem;
    font-weight: 600;
    padding-right: 1rem;
  }

  .merkmal {
    display: block;
    margin-top: 0.2rem;
    font-size: 0.8rem;
    color: var(--text-schwach);
  }

  /* Auf dem Telefon steht die Beschriftung über der Erklärung, sonst bleibt
     für den Text eine Spalte von drei Wörtern Breite. */
  @media (max-width: 32rem) {
    thead {
      display: none;
    }

    tbody th,
    tbody td {
      display: block;
      width: auto;
      border: 0;
      padding: 0;
    }

    tbody td {
      padding-bottom: 0.75rem;
      border-bottom: 1px solid var(--rand);
    }

    tbody th {
      padding-top: 0.75rem;
    }
  }

  /* Ausgedruckt als Aushang: keine Seitenumbrüche mitten in einer Zeile. */
  @media print {
    tr {
      break-inside: avoid;
    }
  }
</style>
