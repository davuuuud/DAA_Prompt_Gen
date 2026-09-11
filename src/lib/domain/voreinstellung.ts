// Welche Quellen je Beruf voreingestellt sind.
//
// Die Voreinstellung ist das, was im Prompt steht, solange niemand die
// Auswahl anfasst — für die meisten Nutzer also die einzige Auswahl. Sie
// folgt vier Regeln:
//
// 1. Der Prüfungsrahmen zuerst: Ausbildungsordnung und Rahmenlehrplan des
//    Berufs. Sie legen fest, was geprüft wird.
// 2. Dann die zwei bis vier Rechtsquellen, die den Kern des Berufs tragen —
//    beim Immobilienkaufmann Mietrecht, WEG und Betriebskosten, bei der
//    Schutz- und Sicherheitskraft die Jedermannsrechte.
// 3. Nur was eine KI tatsächlich belegen kann: frei zugängliche oder breit
//    dokumentierte Texte. Die AkA-Prüfungskataloge und das Prüfungsmaterial
//    der Kammern sind nicht öffentlich — stünden sie hier, würde das Modell
//    daraus "zitieren", ohne sie zu kennen. Sie bleiben wählbar, aber nicht
//    voreingestellt.
// 4. Kurz: höchstens sieben Einträge. Ein Prompt, der zwanzig Quellen nennt,
//    gewichtet keine davon.
//
// gesetze-im-internet.de steht fast überall dabei, weil es die Paragraphen
// in amtlicher Fassung liefert; das Gabler Wirtschaftslexikon dort, wo
// kaufmännische Begriffe den Kern bilden. Die Reihenfolge ist die im Prompt.
//
// Vorläufig, wie der ganze Katalog (Issue #1): Rückmeldungen aus dem
// Unterricht gehen vor.

import type { BerufId } from './types';

export const VOREINSTELLUNG: Record<BerufId, string[]> = {
  // Kein Beruf, sondern der WiSo-Kern. Die drei Handlungsfelder des
  // KMK-Profils: Ausbildung (BBiG), Existenzsicherung (Sozialversicherung),
  // Unternehmen (BGB, HGB).
  kgq: [
    'kmk-qualifikationsprofil-wiso',
    'bbig',
    'bgb',
    'hgb',
    'sgb-iii-xi',
    'gesetze-im-internet-de',
    'gabler',
  ],
  // Kaufvertrag und Gewährleistung am Verkaufstresen, Preisauszeichnung.
  einzelhandel: [
    'ao-einzelhandel',
    'rahmenlehrplan-ehk',
    'bgb',
    'pangv',
    'gesetze-im-internet-de',
    'gabler',
  ],
  // Technik vor Recht: IT-Grundschutz und Herstellerdokumentation tragen
  // mehr als ein Wirtschaftslexikon.
  fachinformatik: [
    'ao-it-berufe',
    'rahmenlehrplan-it-2020',
    'bsi',
    'dsgvo',
    'herstellerdoku',
    'gesetze-im-internet-de',
  ],
  // Gefahrgut, Ladungssicherung und Flurförderzeuge — die sicherheits-
  // relevanten Prüfungsthemen.
  lagerlogistik: [
    'ao-lagerlogistik',
    'rahmenlehrplan-fkl',
    'gefahrgut',
    'vdi-2700',
    'dguv-vorschrift-68',
    'gesetze-im-internet-de',
    'gabler',
  ],
  // Erlaubnis nach § 34a GewO und die Jedermannsrechte, die sich über drei
  // Gesetze verteilen: Notwehr (BGB, StGB) und Festnahme (StPO).
  schutzsicherheit: [
    'ao-schutz-und-sicherheit',
    'rahmenlehrplan-fks',
    'gewo-par-34a',
    'bgb-par-227-ff',
    'stgb',
    'stpo',
    'gesetze-im-internet-de',
  ],
  // Kaufvertrag, Handelskauf mit Rügepflicht (§ 377 HGB), Außenhandel.
  grosshandel: [
    'ao-gross-und-aussenhandel',
    'rahmenlehrplan-gam-2020',
    'bgb',
    'hgb-par-373-ff',
    'incoterms',
    'gesetze-im-internet-de',
    'gabler',
  ],
  // Breit kaufmännisch: Vertragsrecht, Buchführung und Jahresabschluss.
  industrie: [
    'ao-industriekaufleute-2024',
    'rahmenlehrplan-industrie',
    'bgb',
    'hgb',
    'gesetze-im-internet-de',
    'gabler',
  ],
  // Miet- und WEG-Verwaltung; BGB allgemein für Makler- und Kaufvertrag.
  immobilien: [
    'ao-immobilienkaufleute',
    'rahmenlehrplan-imk',
    'bgb-par-535-580a',
    'weg',
    'betrkv',
    'bgb',
    'gesetze-im-internet-de',
  ],
  // DIN 5008 wird in der Prüfung tatsächlich abgefragt.
  bueromanagement: [
    'ao-bueromanagement',
    'rahmenlehrplan-kbm',
    'din-5008',
    'bgb',
    'gesetze-im-internet-de',
    'gabler',
  ],
  // Fernabsatz und Widerruf, Werbung und Bewertungen, Datenschutz.
  ecommerce: [
    'ao-e-commerce',
    'rahmenlehrplan-kec',
    'bgb-fernabsatz',
    'uwg-par-5-5b-7',
    'dsgvo',
    'gesetze-im-internet-de',
    'gabler',
  ],
  // Kaufmännisch mit Sozialrecht — Kranken- und Pflegeversicherung gelten
  // für alle Einrichtungsarten.
  gesundheit: [
    'ao-gesundheitswesen',
    'rahmenlehrplan-kig',
    'sgb5',
    'sgb11',
    'gesetze-im-internet-de',
    'gabler',
  ],
  // Arbeitnehmerüberlassung und das Tarifwerk, nach dem abgerechnet wird.
  personaldienstleistung: [
    'ao-personaldienstleistung',
    'rahmenlehrplan-pdk',
    'auegg',
    'tarifwerk-zeitarbeit',
    'gesetze-im-internet-de',
    'gabler',
  ],
  // Die Steuergesetze samt Richtlinien, dazu die Handelsbilanz. Kein
  // Gabler: Hier zählt der Gesetzeswortlaut, nicht die Begriffserklärung.
  steuerfach: [
    'ao-steuerfachangestellte',
    'rahmenlehrplan-sfa-2022',
    'ao',
    'estg-mit-estdv-estr-esth',
    'ustg-mit-ustdv-ustae',
    'hgb-par-238-ff',
    'gesetze-im-internet-de',
  ],
  // Fracht- und Speditionsrecht, ADSp, grenzüberschreitend CMR.
  spedition: [
    'ao-spedition',
    'rahmenlehrplan-sl',
    'hgb-par-407-475h',
    'adsp',
    'cmr',
    'gesetze-im-internet-de',
    'gabler',
  ],
};

/** Höchstzahl je Beruf; ein Test achtet darauf. */
export const MAX_VOREINSTELLUNG = 7;

/**
 * Frühere Voreinstellungen. Wer eine davon gespeichert und nie angefasst
 * hat, bekommt beim nächsten Start die aktuelle — sonst erreichte eine
 * bessere Voreinstellung genau die Nutzer nicht, die sich auf sie verlassen.
 */
export function fruehereVoreinstellungen(beruf: BerufId): string[][] {
  const eigene: Record<BerufId, string[]> = {
    kgq: ['kmk-qualifikationsprofil-wiso', 'aka-katalog-wiso'],
    einzelhandel: ['ao-einzelhandel', 'rahmenlehrplan-ehk'],
    fachinformatik: ['ao-it-berufe', 'rahmenlehrplan-it-2020'],
    lagerlogistik: ['ao-lagerlogistik', 'rahmenlehrplan-fkl'],
    schutzsicherheit: ['ao-schutz-und-sicherheit', 'rahmenlehrplan-fks'],
    grosshandel: ['ao-gross-und-aussenhandel', 'rahmenlehrplan-gam-2020'],
    industrie: ['ao-industriekaufleute-2024', 'rahmenlehrplan-industrie'],
    immobilien: ['ao-immobilienkaufleute', 'rahmenlehrplan-imk'],
    bueromanagement: ['ao-bueromanagement', 'rahmenlehrplan-kbm'],
    ecommerce: ['ao-e-commerce', 'rahmenlehrplan-kec'],
    gesundheit: ['ao-gesundheitswesen', 'rahmenlehrplan-kig'],
    personaldienstleistung: ['ao-personaldienstleistung', 'rahmenlehrplan-pdk'],
    steuerfach: ['ao-steuerfachangestellte', 'rahmenlehrplan-sfa-2022'],
    spedition: ['ao-spedition', 'rahmenlehrplan-sl'],
  };
  return [
    // Erstfassung: eine Liste für alle Berufe.
    ['ihk-veroeffentlichungen', 'ausbildungsordnung', 'bgb', 'hgb', 'haufe', 'gabler'],
    // Übernahme des Katalogs am 11.09.2026: Gesetze, Gabler, Ausbildungsordnung
    // und Rahmenlehrplan.
    ['gesetze-im-internet-de', 'gabler', ...eigene[beruf]],
  ];
}
