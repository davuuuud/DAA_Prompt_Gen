<script lang="ts">
  import type { Snippet } from 'svelte';
  import { ANKER } from '../state/route.svelte';

  interface Props {
    titel: string;
    /** Datum der letzten inhaltlichen Aenderung, nicht die Programmfassung. */
    stand: string;
    children: Snippet;
  }

  let { titel, stand, children }: Props = $props();
</script>

<article>
  <a class="zurueck" href={ANKER.app}>&larr; Zurück zur Anwendung</a>
  <h1>{titel}</h1>
  <p class="stand">Stand: {stand}</p>
  {@render children()}
</article>

<style>
  article {
    /* Schmaler als das Formular: Fliesstext liest sich in kurzen Zeilen
       leichter, und diese Seiten bestehen fast nur aus Fliesstext. */
    max-width: 42rem;
    margin: 0 auto 2rem;
    line-height: 1.6;
  }

  .zurueck {
    display: inline-block;
    margin-bottom: 1.25rem;
    font-size: 0.9rem;
    color: var(--akzent);
    text-decoration: none;
  }

  .zurueck:hover {
    text-decoration: underline;
  }

  h1 {
    margin: 0;
    font-size: 1.8rem;
    line-height: 1.2;
  }

  .stand {
    margin: 0.35rem 0 1.5rem;
    font-size: 0.85rem;
    color: var(--text-schwach);
  }

  /* Die Abschnitte kommen aus den einzelnen Seiten und sind daher nicht
     lokal, sondern global zu formatieren. */
  :global(.rechtstext h2) {
    margin: 1.75rem 0 0.5rem;
    font-size: 1.1rem;
    line-height: 1.3;
  }

  :global(.rechtstext h3) {
    margin: 1.25rem 0 0.35rem;
    font-size: 0.95rem;
  }

  :global(.rechtstext p),
  :global(.rechtstext ul) {
    margin: 0 0 0.75rem;
  }

  :global(.rechtstext ul) {
    padding-left: 1.25rem;
  }

  :global(.rechtstext li) {
    margin-bottom: 0.3rem;
  }

  :global(.rechtstext address) {
    font-style: normal;
    margin-bottom: 0.75rem;
  }

  :global(.rechtstext .kasten) {
    padding: 0.85rem 1rem;
    margin: 1rem 0 1.25rem;
    background: var(--code-flaeche);
    border: 1px solid var(--rand);
    border-radius: var(--radius);
  }

  :global(.rechtstext .kasten p:last-child) {
    margin-bottom: 0;
  }
</style>
