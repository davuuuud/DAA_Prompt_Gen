// Kuratierter Quellenkatalog.
//
// Ersetzt das frühere Freitextfeld "Bevorzugte Quellen". Einträge ohne
// berufe-Angabe gelten für alle; die übrigen erscheinen nur beim passenden
// Ausbildungsberuf. Das hält die Auswahl kurz und fachlich treffend: Ein
// Bankkaufmann bekommt KWG und WpHG zu sehen, ein Immobilienkaufmann WEG
// und MaBV.

import type { BerufId, Quelle, QuellenGruppe } from './types';

export const QUELLEN_GRUPPEN: { id: QuellenGruppe; label: string }[] = [
  { id: 'gesetz', label: 'Gesetze und Verordnungen' },
  { id: 'ihk', label: 'Prüfungs- und Ausbildungsvorgaben' },
  { id: 'fachverlag', label: 'Fachliteratur und Nachschlagewerke' },
  { id: 'statistik', label: 'Amtliche Daten' },
];

export const QUELLEN: Quelle[] = [
  // --- Für alle Berufe -----------------------------------------------------
  { id: 'bgb', label: 'BGB', group: 'gesetz', hint: 'Bürgerliches Gesetzbuch' },
  { id: 'hgb', label: 'HGB', group: 'gesetz', hint: 'Handelsgesetzbuch' },
  { id: 'gewo', label: 'GewO', group: 'gesetz', hint: 'Gewerbeordnung' },
  { id: 'bbig', label: 'BBiG', group: 'gesetz', hint: 'Berufsbildungsgesetz' },
  { id: 'dsgvo', label: 'DSGVO und BDSG', group: 'gesetz', hint: 'Datenschutz' },
  { id: 'ustg', label: 'UStG', group: 'gesetz', hint: 'Umsatzsteuergesetz' },
  { id: 'arbzg', label: 'ArbZG', group: 'gesetz', hint: 'Arbeitszeitgesetz' },
  { id: 'betrvg', label: 'BetrVG', group: 'gesetz', hint: 'Betriebsverfassungsgesetz' },
  { id: 'kschg', label: 'KSchG', group: 'gesetz', hint: 'Kündigungsschutzgesetz' },

  { id: 'ausbildungsordnung', label: 'Ausbildungsordnung des Berufs', group: 'ihk' },
  { id: 'rahmenlehrplan', label: 'Rahmenlehrplan der KMK', group: 'ihk' },
  { id: 'ihk-veroeffentlichungen', label: 'IHK-Veröffentlichungen', group: 'ihk' },
  { id: 'aka', label: 'AkA-Prüfungskataloge', group: 'ihk', hint: 'Aufgabenstelle für kaufmännische Abschlussprüfungen' },
  { id: 'dihk', label: 'DIHK-Materialien', group: 'ihk' },

  { id: 'haufe', label: 'Haufe', group: 'fachverlag' },
  { id: 'gabler', label: 'Springer Gabler Wirtschaftslexikon', group: 'fachverlag' },
  { id: 'nwb', label: 'NWB', group: 'fachverlag', hint: 'Steuern und Rechnungswesen' },
  { id: 'lehrbuch', label: 'Lehrbuch des Bildungsträgers', group: 'fachverlag' },

  { id: 'destatis', label: 'Statistisches Bundesamt', group: 'statistik' },
  { id: 'bundesbank', label: 'Deutsche Bundesbank', group: 'statistik' },

  // --- Immobilien ----------------------------------------------------------
  { id: 'weg', label: 'WEG', group: 'gesetz', hint: 'Wohnungseigentumsgesetz', berufe: ['immobilien'] },
  { id: 'mabv', label: 'MaBV', group: 'gesetz', hint: 'Makler- und Bauträgerverordnung', berufe: ['immobilien'] },
  { id: 'baugb', label: 'BauGB', group: 'gesetz', hint: 'Baugesetzbuch', berufe: ['immobilien'] },
  { id: 'geg', label: 'GEG', group: 'gesetz', hint: 'Gebäudeenergiegesetz', berufe: ['immobilien'] },
  { id: 'betrkv', label: 'BetrKV', group: 'gesetz', hint: 'Betriebskostenverordnung', berufe: ['immobilien'] },

  // --- Gesundheitswesen ----------------------------------------------------
  // Startbestand, noch nicht fachlich geprüft - siehe Issue #1.
  { id: 'sgb5', label: 'SGB V', group: 'gesetz', hint: 'Gesetzliche Krankenversicherung', berufe: ['gesundheit'] },
  { id: 'sgb11', label: 'SGB XI', group: 'gesetz', hint: 'Soziale Pflegeversicherung', berufe: ['gesundheit'] },

  // --- Schutz und Sicherheit -----------------------------------------------
  { id: 'bewachv', label: 'BewachV', group: 'gesetz', hint: 'Bewachungsverordnung', berufe: ['schutzsicherheit'] },
  { id: 'stgb', label: 'StGB', group: 'gesetz', hint: 'Strafgesetzbuch, u. a. Notwehr', berufe: ['schutzsicherheit'] },
  { id: 'stpo', label: 'StPO', group: 'gesetz', hint: 'Strafprozessordnung, u. a. vorläufige Festnahme', berufe: ['schutzsicherheit'] },

  // --- Systemintegration ---------------------------------------------------
  { id: 'bsi', label: 'BSI IT-Grundschutz', group: 'fachverlag', berufe: ['fachinformatik'] },
  { id: 'urhg', label: 'UrhG', group: 'gesetz', hint: 'Urheberrecht, u. a. Softwarelizenzen', berufe: ['fachinformatik'] },

  // --- Handel und Logistik -------------------------------------------------
  { id: 'arbschg', label: 'ArbSchG', group: 'gesetz', hint: 'Arbeitsschutzgesetz', berufe: ['lagerlogistik', 'schutzsicherheit'] },
  { id: 'gefahrgut', label: 'GGVSEB', group: 'gesetz', hint: 'Gefahrgutverordnung Straße, Eisenbahn, Binnenschiff', berufe: ['lagerlogistik', 'spedition'] },
  { id: 'pangv', label: 'PAngV', group: 'gesetz', hint: 'Preisangabenverordnung', berufe: ['einzelhandel', 'ecommerce', 'grosshandel'] },
  { id: 'incoterms', label: 'Incoterms', group: 'fachverlag', hint: 'ICC-Lieferklauseln', berufe: ['grosshandel', 'spedition'] },
  { id: 'awv', label: 'AWV und AWG', group: 'gesetz', hint: 'Außenwirtschaft', berufe: ['grosshandel'] },
  { id: 'cmr', label: 'CMR', group: 'gesetz', hint: 'Übereinkommen über den Beförderungsvertrag', berufe: ['spedition'] },
  { id: 'adsp', label: 'ADSp', group: 'fachverlag', hint: 'Allgemeine Deutsche Spediteurbedingungen', berufe: ['spedition'] },
  { id: 'guekg', label: 'GüKG', group: 'gesetz', hint: 'Güterkraftverkehrsgesetz', berufe: ['spedition'] },
  { id: 'ddg', label: 'DDG', group: 'gesetz', hint: 'Digitale-Dienste-Gesetz', berufe: ['ecommerce'] },

  // --- Steuern und Personal ------------------------------------------------
  { id: 'ao', label: 'AO', group: 'gesetz', hint: 'Abgabenordnung', berufe: ['steuerfach'] },
  { id: 'estg', label: 'EStG', group: 'gesetz', hint: 'Einkommensteuergesetz', berufe: ['steuerfach', 'industrie'] },
  { id: 'kstg', label: 'KStG', group: 'gesetz', hint: 'Körperschaftsteuergesetz', berufe: ['steuerfach'] },
  { id: 'gewstg', label: 'GewStG', group: 'gesetz', hint: 'Gewerbesteuergesetz', berufe: ['steuerfach'] },
  { id: 'auegg', label: 'AÜG', group: 'gesetz', hint: 'Arbeitnehmerüberlassungsgesetz', berufe: ['personaldienstleistung'] },
  { id: 'tvg', label: 'TVG', group: 'gesetz', hint: 'Tarifvertragsgesetz', berufe: ['personaldienstleistung', 'bueromanagement'] },
];

/** Alle Quellen, die für den gewählten Beruf infrage kommen. */
export function quellenFuerBeruf(beruf: BerufId): Quelle[] {
  return QUELLEN.filter((quelle) => !quelle.berufe || quelle.berufe.includes(beruf));
}

/** Nach Gruppen geordnet, für die Darstellung in der Oberfläche. */
export function quellenNachGruppe(beruf: BerufId): { gruppe: string; quellen: Quelle[] }[] {
  const verfuegbar = quellenFuerBeruf(beruf);
  return QUELLEN_GRUPPEN.map(({ id, label }) => ({
    gruppe: label,
    quellen: verfuegbar.filter((quelle) => quelle.group === id),
  })).filter((eintrag) => eintrag.quellen.length > 0);
}

/** Voreinstellung: die allgemeingültigen Vorgaben, die fast immer passen. */
export const DEFAULT_QUELLEN: string[] = [
  'ihk-veroeffentlichungen',
  'ausbildungsordnung',
  'bgb',
  'hgb',
  'haufe',
  'gabler',
];

/**
 * Setzt die Auswahl in lesbare Bezeichnungen um. Quellen, die zum gewählten
 * Beruf nicht mehr passen, fallen dabei still heraus - so kann ein
 * Berufswechsel keine unpassenden Vorgaben im Prompt hinterlassen.
 */
export function quellenBezeichnungen(beruf: BerufId, ausgewaehlt: string[]): string[] {
  const verfuegbar = quellenFuerBeruf(beruf);
  return ausgewaehlt
    .map((id) => verfuegbar.find((quelle) => quelle.id === id))
    .filter((quelle): quelle is Quelle => quelle !== undefined)
    .map((quelle) => (quelle.hint ? `${quelle.label} (${quelle.hint})` : quelle.label));
}
