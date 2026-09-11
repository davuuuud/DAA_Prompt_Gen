<script lang="ts">
  // Ein Formularbereich, der sich auf- und zuklappen lässt. Zugeklappt zeigt
  // er nur Titel und eine kurze Zusammenfassung — auf dem Telefon wären die
  // selten gebrauchten Teile des Formulars sonst der längste Block.
  import type { Snippet } from 'svelte';

  interface Props {
    titel: string;
    /** Kurzangabe rechts im Kopf, etwa „5 von 12". */
    zusammenfassung?: string;
    offen?: boolean;
    children: Snippet;
  }

  let { titel, zusammenfassung, offen = $bindable(false), children }: Props = $props();
</script>

<div class="bereich">
  <button type="button" class="kopf" aria-expanded={offen} onclick={() => (offen = !offen)}>
    <span class="pfeil" class:offen aria-hidden="true">▸</span>
    <span class="titel">{titel}</span>
    {#if zusammenfassung}<span class="zusammenfassung">{zusammenfassung}</span>{/if}
  </button>

  {#if offen}
    <div class="inhalt">
      {@render children()}
    </div>
  {/if}
</div>

<style>
  .bereich {
    border: 1px solid var(--rand);
    border-radius: var(--radius);
    background: var(--flaeche);
    overflow: hidden;
  }

  .kopf {
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

  .kopf:hover {
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

  .titel {
    font-weight: 600;
    flex: 1;
  }

  .zusammenfassung {
    font-size: 0.85rem;
    color: var(--text-schwach);
    white-space: nowrap;
  }

  .inhalt {
    padding: 0 0.9rem 0.9rem;
    border-top: 1px solid var(--rand);
  }
</style>
