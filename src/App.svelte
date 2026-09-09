<script lang="ts">
  import QuellenWahl from './lib/components/QuellenWahl.svelte';
  import { AUFGABEN, BERUFE, FORMATE, findAufgabe, NIVEAUS, OPTIONEN } from './lib/domain/catalogs';
  import { buildPrompt, validate } from './lib/domain/prompt';
  import { quellenFuerBeruf } from './lib/domain/quellen';
  import { toPromptInput } from './lib/domain/settings';
  import { MAX_ANZAHL, MIN_ANZAHL, toCRLF } from './lib/domain/text';
  import { copyText } from './lib/platform/clipboard';
  import { canShare, openChatGPT, shareText } from './lib/platform/share';
  import { draft, resetAll, saveDraft, saveSettings, settings } from './lib/state/store.svelte';

  const input = $derived(toPromptInput(settings, { thema: draft.thema, zusatz: draft.zusatz }));
  const pruefung = $derived(validate(input));
  const prompt = $derived(pruefung.ok ? buildPrompt(input) : '');
  const aufgabe = $derived(findAufgabe(settings.aufgabe));

  const zeichen = $derived(prompt.length);
  const woerter = $derived(prompt.trim() ? prompt.trim().split(/\s+/).length : 0);

  const teilenMoeglich = canShare();

  let status = $state('');
  let statusTimer: ReturnType<typeof setTimeout> | undefined;

  // Ein Feld gilt erst als "berührt", wenn es einmal verlassen wurde. Ohne
  // das säße beim ersten Start ein roter Rahmen um ein Feld, in das noch
  // niemand etwas eingeben konnte.
  let beruehrt = $state<Record<string, boolean>>({});
  const zeigeFehler = $derived(
    !pruefung.ok && pruefung.feld !== undefined && beruehrt[pruefung.feld] === true,
  );

  // Beide Effekte lesen beim Speichern den gesamten Zustand (JSON.stringify)
  // und laufen dadurch bei jeder Änderung erneut.
  $effect(() => saveSettings());
  $effect(() => saveDraft());

  function melde(text: string) {
    status = text;
    clearTimeout(statusTimer);
    statusTimer = setTimeout(() => (status = ''), 4000);
  }

  /** Nach einem Berufswechsel dürfen keine berufsfremden Quellen zurückbleiben. */
  function berufGewechselt() {
    const erlaubt = new Set(quellenFuerBeruf(settings.beruf).map((quelle) => quelle.id));
    settings.quellen = settings.quellen.filter((id) => erlaubt.has(id));
  }

  async function kopieren() {
    if (!prompt) return;
    const erfolg = await copyText(toCRLF(prompt));
    melde(
      erfolg
        ? 'In die Zwischenablage kopiert.'
        : 'Kopieren nicht möglich – bitte den Text von Hand markieren.',
    );
  }

  async function teilen() {
    if (!prompt) return;
    const ergebnis = await shareText('IHK-Lernprompt', prompt);
    if (ergebnis === 'geteilt') melde('Geteilt.');
    if (ergebnis === 'nicht-verfuegbar') melde('Teilen wird von diesem Browser nicht unterstützt.');
  }

  function zuruecksetzen() {
    if (confirm('Alle Eingaben und Einstellungen auf die Vorgabewerte zurücksetzen?')) {
      resetAll();
      melde('Zurückgesetzt.');
    }
  }
</script>

<div class="huelle">
  <header>
    <h1>IHK-Lernassistent</h1>
    <p class="untertitel">
      Baut strukturierte Lern-Prompts für die kaufmännische Umschulung – auf diesem Gerät,
      ohne Konto und ohne Datenübertragung.
    </p>
  </header>

  <main>
    <section class="karte">
      <div class="raster">
        <div class="feld">
          <label for="beruf">Ausbildungsberuf</label>
          <select id="beruf" bind:value={settings.beruf} onchange={berufGewechselt}>
            {#each BERUFE as beruf (beruf.id)}
              <option value={beruf.id}>{beruf.label}</option>
            {/each}
          </select>
        </div>

        <div class="feld">
          <label for="aufgabe">Aufgabe</label>
          <select id="aufgabe" bind:value={settings.aufgabe}>
            {#each AUFGABEN as eintrag (eintrag.id)}
              <option value={eintrag.id}>{eintrag.label}</option>
            {/each}
          </select>
        </div>

        <div class="feld">
          <label for="niveau">Niveau</label>
          <select id="niveau" bind:value={settings.niveau}>
            {#each NIVEAUS as niveau (niveau.id)}
              <option value={niveau.id}>{niveau.label}</option>
            {/each}
          </select>
        </div>

        <div class="feld">
          <label for="format">Ausgabeform</label>
          <select id="format" bind:value={settings.format}>
            {#each FORMATE as format (format.id)}
              <option value={format.id}>{format.label}</option>
            {/each}
          </select>
        </div>

        {#if aufgabe.needsCount}
          <div class="feld feld-schmal">
            <label for="anzahl">Anzahl</label>
            <input
              id="anzahl"
              type="number"
              min={MIN_ANZAHL}
              max={MAX_ANZAHL}
              bind:value={settings.anzahl}
            />
          </div>
        {/if}
      </div>
    </section>

    <section class="karte">
      <div class="feld">
        <label for="thema">Thema oder konkrete Fragestellung</label>
        <textarea
          id="thema"
          rows="3"
          placeholder="z. B. Betriebskostenabrechnung: Umlagefähigkeit und Fristen"
          bind:value={draft.thema}
          onblur={() => (beruehrt.thema = true)}
          aria-invalid={zeigeFehler && pruefung.feld === 'thema'}
        ></textarea>
        {#if zeigeFehler && pruefung.feld === 'thema'}
          <p class="fehler">{pruefung.meldung}</p>
        {/if}
      </div>

      <div class="feld">
        <span class="beschriftung">Optionen</span>
        <div class="optionen">
          {#each OPTIONEN as option (option.id)}
            <label class="option">
              <input type="checkbox" bind:group={settings.optionen} value={option.id} />
              <span>{option.label}</span>
            </label>
          {/each}
        </div>
      </div>

      <QuellenWahl beruf={settings.beruf} bind:ausgewaehlt={settings.quellen} />

      <div class="feld">
        <label for="quellen-frei">Weitere Quellen (optional)</label>
        <textarea
          id="quellen-frei"
          rows="2"
          placeholder="Eine Quelle je Zeile, z. B. Schmidt/Futterer, Mietrecht"
          bind:value={settings.quellenFreitext}
        ></textarea>
        <p class="hinweis">
          Getrennt wird an Zeilenumbruch und Semikolon – Kommas bleiben erhalten.
        </p>
      </div>

      <div class="feld">
        <label for="zusatz">Zusätzliche Angaben, eigene Lösung oder besondere Vorgaben</label>
        <textarea
          id="zusatz"
          rows="3"
          bind:value={draft.zusatz}
          onblur={() => (beruehrt.zusatz = true)}
          aria-invalid={zeigeFehler && pruefung.feld === 'zusatz'}
        ></textarea>
        {#if zeigeFehler && pruefung.feld === 'zusatz'}
          <p class="fehler">{pruefung.meldung}</p>
        {/if}
      </div>
    </section>

    <section class="karte">
      <div class="ausgabe-kopf">
        <h2>Fertiger Prompt</h2>
        {#if prompt}
          <span class="statistik">{zeichen} Zeichen · {woerter} Wörter</span>
        {/if}
      </div>

      {#if prompt}
        <pre class="prompt">{prompt}</pre>
      {:else}
        <p class="leer">{pruefung.meldung}</p>
      {/if}

      <div class="aktionen">
        <button type="button" class="haupt" onclick={kopieren} disabled={!prompt}>Kopieren</button>
        {#if teilenMoeglich}
          <button type="button" onclick={teilen} disabled={!prompt}>Teilen</button>
        {/if}
        <button type="button" onclick={openChatGPT}>ChatGPT öffnen</button>
        <button type="button" class="still" onclick={zuruecksetzen}>Zurücksetzen</button>
      </div>

      <p class="status" role="status" aria-live="polite">{status}</p>
    </section>
  </main>

  <footer>
    Der Prompt entsteht laufend beim Tippen. Eingaben und Einstellungen bleiben nur auf diesem
    Gerät gespeichert.
  </footer>
</div>

<style>
  .huelle {
    max-width: 52rem;
    margin: 0 auto;
    padding: 1.25rem 1rem 3rem;
  }

  header {
    margin-bottom: 1.25rem;
  }

  h1 {
    margin: 0;
    font-size: 1.6rem;
    line-height: 1.2;
  }

  .untertitel {
    margin: 0.4rem 0 0;
    color: var(--text-schwach);
    font-size: 0.9rem;
    max-width: 40rem;
  }

  main {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .karte {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    background: var(--flaeche);
    border: 1px solid var(--rand);
    border-radius: var(--radius);
  }

  .raster {
    display: grid;
    /* 17rem statt enger: Bei drei Spalten wurde "Strukturiert mit
       Stichpunkten" abgeschnitten. Zwei Spalten sind hier ohnehin die
       ruhigere Aufteilung für vier Felder. */
    grid-template-columns: repeat(auto-fit, minmax(17rem, 1fr));
    gap: 0.9rem;
  }

  .feld {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    min-width: 0;
  }

  .feld-schmal {
    max-width: 8rem;
  }

  label,
  .beschriftung {
    font-size: 0.85rem;
    font-weight: 600;
  }

  .optionen {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem 1.1rem;
  }

  .option {
    display: flex;
    align-items: center;
    gap: 0.45rem;
    font-weight: 400;
    cursor: pointer;
  }

  .hinweis {
    margin: 0;
    font-size: 0.8rem;
    color: var(--text-schwach);
  }

  .fehler {
    margin: 0;
    font-size: 0.85rem;
    color: var(--warnung);
  }

  .ausgabe-kopf {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 1rem;
  }

  h2 {
    margin: 0;
    font-size: 1rem;
  }

  .statistik {
    font-size: 0.8rem;
    color: var(--text-schwach);
    white-space: nowrap;
  }

  .prompt {
    margin: 0;
    padding: 0.85rem;
    max-height: 24rem;
    overflow: auto;
    background: var(--code-flaeche);
    border: 1px solid var(--rand);
    border-radius: var(--radius);
    font-family: ui-monospace, 'Cascadia Mono', 'Segoe UI Mono', Consolas, monospace;
    font-size: 0.82rem;
    line-height: 1.5;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }

  .leer {
    margin: 0;
    padding: 1.5rem 0.85rem;
    text-align: center;
    color: var(--text-schwach);
    background: var(--code-flaeche);
    border: 1px dashed var(--rand);
    border-radius: var(--radius);
  }

  .aktionen {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .status {
    margin: 0;
    min-height: 1.2rem;
    font-size: 0.85rem;
    color: var(--erfolg);
  }

  footer {
    margin-top: 1.5rem;
    font-size: 0.8rem;
    color: var(--text-schwach);
    text-align: center;
  }

  @media (max-width: 30rem) {
    .aktionen button {
      flex: 1 1 8rem;
    }

    /* Auf dem Telefon ist die Vorschau zweitrangig - der Weg zu "Teilen"
       soll kurz bleiben, statt durch einen langen Kasten zu führen. */
    .prompt {
      max-height: 13rem;
      font-size: 0.75rem;
      padding: 0.7rem;
    }
  }
</style>
