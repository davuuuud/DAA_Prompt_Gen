<script lang="ts">
  // Gruppierte Mehrfachauswahl aus dem Quellenkatalog. Zugeklappt zeigt sie
  // nur eine Zusammenfassung - auf einem Telefon wäre die volle Liste sonst
  // der längste Block des Formulars.
  import { quellenNachGruppe } from '../domain/quellen';
  import type { BerufId } from '../domain/types';
  import Aufklappbereich from './Aufklappbereich.svelte';

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

<Aufklappbereich
  titel="Bevorzugte Quellen"
  zusammenfassung="{ausgewaehlt.length} von {anzahlVerfuegbar}"
  bind:offen
>
      {#each gruppen as gruppe (gruppe.gruppe)}
        <fieldset>
          <legend>{gruppe.gruppe}</legend>
          <div class="quellen-liste">
            {#each gruppe.quellen as quelle (quelle.id)}
              <label class="quelle" title={quelle.titel}>
                <input type="checkbox" bind:group={ausgewaehlt} value={quelle.id} />
                <span class="quelle-text">
                  <span class="quelle-label">{quelle.kuerzel}</span>
                  {#if quelle.titel && quelle.titel !== quelle.kuerzel}<span class="quelle-hint">{quelle.titel}</span>{/if}
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
</Aufklappbereich>

<style>
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
