<script lang="ts">
  // Gruppierte Mehrfachauswahl aus dem Quellenkatalog. Zugeklappt zeigt sie
  // nur eine Zusammenfassung - auf einem Telefon wäre die volle Liste sonst
  // der längste Block des Formulars.
  import { quellenNachGruppe } from '../domain/quellen';
  import type { BerufId } from '../domain/types';

  interface Props {
    beruf: BerufId;
    ausgewaehlt: string[];
  }

  let { beruf, ausgewaehlt = $bindable() }: Props = $props();

  let offen = $state(false);

  const gruppen = $derived(quellenNachGruppe(beruf));
  const anzahlVerfuegbar = $derived(
    gruppen.reduce((summe, gruppe) => summe + gruppe.quellen.length, 0),
  );

  function alleAbwaehlen() {
    ausgewaehlt = [];
  }
</script>

<div class="quellen">
  <button
    type="button"
    class="quellen-kopf"
    aria-expanded={offen}
    onclick={() => (offen = !offen)}
  >
    <span class="pfeil" class:offen aria-hidden="true">▸</span>
    <span class="quellen-titel">Bevorzugte Quellen</span>
    <span class="zaehler">{ausgewaehlt.length} von {anzahlVerfuegbar}</span>
  </button>

  {#if offen}
    <div class="quellen-inhalt">
      {#each gruppen as gruppe (gruppe.gruppe)}
        <fieldset>
          <legend>{gruppe.gruppe}</legend>
          <div class="quellen-liste">
            {#each gruppe.quellen as quelle (quelle.id)}
              <label class="quelle" title={quelle.hint ?? quelle.label}>
                <input type="checkbox" bind:group={ausgewaehlt} value={quelle.id} />
                <span class="quelle-text">
                  <span class="quelle-label">{quelle.label}</span>
                  {#if quelle.hint}<span class="quelle-hint">{quelle.hint}</span>{/if}
                </span>
              </label>
            {/each}
          </div>
        </fieldset>
      {/each}

      <div class="quellen-fuss">
        <button type="button" class="link" onclick={alleAbwaehlen} disabled={ausgewaehlt.length === 0}>
          Auswahl leeren
        </button>
        <p class="hinweis">
          Die Auswahl richtet sich nach dem gewählten Ausbildungsberuf. Wechselst du ihn,
          verschwinden Quellen, die dort nicht gelten.
        </p>
      </div>
    </div>
  {/if}
</div>

<style>
  .quellen {
    border: 1px solid var(--rand);
    border-radius: var(--radius);
    background: var(--flaeche);
    overflow: hidden;
  }

  .quellen-kopf {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    width: 100%;
    padding: 0.75rem 0.9rem;
    background: none;
    border: 0;
    font: inherit;
    color: inherit;
    text-align: left;
    cursor: pointer;
  }

  .quellen-kopf:hover {
    background: var(--flaeche-hover);
  }

  .pfeil {
    display: inline-block;
    transition: transform 0.15s ease;
    color: var(--text-schwach);
  }

  .pfeil.offen {
    transform: rotate(90deg);
  }

  .quellen-titel {
    font-weight: 600;
    flex: 1;
  }

  .zaehler {
    font-size: 0.85rem;
    color: var(--text-schwach);
    white-space: nowrap;
  }

  .quellen-inhalt {
    padding: 0 0.9rem 0.9rem;
    border-top: 1px solid var(--rand);
  }

  fieldset {
    border: 0;
    padding: 0;
    margin: 0.9rem 0 0;
  }

  legend {
    padding: 0;
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0.03em;
    text-transform: uppercase;
    color: var(--text-schwach);
  }

  .quellen-liste {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
    gap: 0.15rem 1rem;
    margin-top: 0.4rem;
  }

  .quelle {
    display: flex;
    align-items: flex-start;
    gap: 0.55rem;
    padding: 0.3rem 0;
    cursor: pointer;
    line-height: 1.3;
  }

  .quelle input {
    margin-top: 0.15rem;
    flex: none;
  }

  .quelle-text {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 0.35rem;
  }

  .quelle-hint {
    font-size: 0.8rem;
    color: var(--text-schwach);
  }

  .quellen-fuss {
    margin-top: 1rem;
    padding-top: 0.75rem;
    border-top: 1px solid var(--rand);
  }

  .hinweis {
    margin: 0.5rem 0 0;
    font-size: 0.8rem;
    color: var(--text-schwach);
  }
</style>
