// Auswahl und Wortlaut der Quellen.
//
// Die Einträge selbst stehen in quellenkatalog.ts. Hier wird entschieden,
// was davon ein Beruf zu sehen bekommt, was voreingestellt ist und wie eine
// Quelle im Prompt heißt. Einträge ohne Berufsangabe gelten für alle; die
// übrigen erscheinen nur beim passenden Beruf — ein Immobilienkaufmann sieht
// WEG und MaBV, die Systemintegration das BSI-Grundschutzkompendium.

import { KATALOG, type KatalogQuelle, type QuellenArt } from './quellenkatalog';
import type { BerufId } from './types';

export type { KatalogQuelle as Quelle, QuellenArt };

export const QUELLEN_GRUPPEN: { id: QuellenArt; label: string }[] = [
  { id: 'vorgabe', label: 'Prüfungs- und Ausbildungsvorgaben' },
  { id: 'gesetz', label: 'Gesetze und Verordnungen' },
  { id: 'norm', label: 'Normen und Branchenstandards' },
  { id: 'nachschlagewerk', label: 'Nachschlagewerke' },
  { id: 'rechtsprechung', label: 'Rechtsprechung' },
  { id: 'daten', label: 'Amtliche Daten und Statistik' },
];

/** Alles, was in der Anwendung zur Wahl steht. */
export const QUELLEN: KatalogQuelle[] = KATALOG;

/** Alle Quellen, die für den gewählten Beruf infrage kommen. */
export function quellenFuerBeruf(beruf: BerufId): KatalogQuelle[] {
  return QUELLEN.filter((quelle) => !quelle.berufe || quelle.berufe.includes(beruf));
}

/** Nach Gruppen geordnet, für die Darstellung in der Oberfläche. */
export function quellenNachGruppe(
  beruf: BerufId,
): { gruppe: string; quellen: KatalogQuelle[] }[] {
  const verfuegbar = quellenFuerBeruf(beruf);
  return QUELLEN_GRUPPEN.map(({ id, label }) => ({
    gruppe: label,
    quellen: verfuegbar.filter((quelle) => quelle.art === id),
  })).filter((eintrag) => eintrag.quellen.length > 0);
}

/**
 * Die Voreinstellung für einen Beruf: die allgemeinen Standardquellen und
 * die des Berufs selbst — in der Regel seine Ausbildungsordnung und sein
 * Rahmenlehrplan.
 */
export function standardQuellen(beruf: BerufId): string[] {
  return quellenFuerBeruf(beruf)
    .filter((quelle) => quelle.standard)
    .map((quelle) => quelle.id);
}

function gleicheMenge(a: readonly string[], b: readonly string[]): boolean {
  const x = new Set(a);
  const y = new Set(b);
  return x.size === y.size && [...x].every((wert) => y.has(wert));
}

/**
 * Welche Quellen nach einem Berufswechsel ausgewählt sind.
 *
 * Hat jemand die Voreinstellung nicht angefasst, wandert sie mit: Wer von
 * Einzelhandel auf Immobilien wechselt, bekommt die Ausbildungsordnung der
 * Immobilienkaufleute statt keiner. Hat er selbst ausgewählt, bleibt seine
 * Auswahl — nur was beim neuen Beruf nicht gilt, fällt heraus.
 */
export function quellenBeimBerufswechsel(
  auswahl: readonly string[],
  alterBeruf: BerufId,
  neuerBeruf: BerufId,
): string[] {
  if (gleicheMenge(auswahl, standardQuellen(alterBeruf))) return standardQuellen(neuerBeruf);
  const erlaubt = new Set(quellenFuerBeruf(neuerBeruf).map((quelle) => quelle.id));
  return auswahl.filter((id) => erlaubt.has(id));
}

/** So heißt eine Quelle im Prompt. Hinweise an die Dozenten gehören nie dazu. */
export function promptBezeichnung(quelle: KatalogQuelle): string {
  if (quelle.prompt) return quelle.prompt;
  return quelle.titel && quelle.titel !== quelle.kuerzel
    ? `${quelle.kuerzel} (${quelle.titel})`
    : quelle.kuerzel;
}

/**
 * Die ausgewählten Einträge in Auswahlreihenfolge. Quellen, die zum gewählten
 * Beruf nicht mehr passen, fallen dabei still heraus - so kann ein
 * Berufswechsel keine unpassenden Vorgaben im Prompt hinterlassen.
 */
export function ausgewaehlteQuellen(beruf: BerufId, ausgewaehlt: string[]): KatalogQuelle[] {
  const verfuegbar = quellenFuerBeruf(beruf);
  return ausgewaehlt
    .map((id) => verfuegbar.find((quelle) => quelle.id === id))
    .filter((quelle): quelle is KatalogQuelle => quelle !== undefined);
}

/** Die Auswahl als lesbare Bezeichnungen für den Prompt. */
export function quellenBezeichnungen(beruf: BerufId, ausgewaehlt: string[]): string[] {
  return ausgewaehlteQuellen(beruf, ausgewaehlt).map(promptBezeichnung);
}
