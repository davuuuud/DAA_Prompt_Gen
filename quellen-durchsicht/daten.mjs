// Vorschlagsliste für die fachliche Durchsicht des Quellenkatalogs.
//
// ACHTUNG: Diese Liste stammt aus allgemeinem Wissen, NICHT aus
// Unterrichtserfahrung. Genau das ist der Grund, warum sie durchgesehen
// werden muss. Sie ist ein Vorschlag zum Streichen und Ergänzen, keine
// Setzung.
//
// Aufbau:
//   ALLGEMEIN  - Quellen, die bei der Mehrzahl der Berufe vorkommen.
//                Sie stehen in jedem Durchsichtsbogen.
//   BERUFE     - Was zusätzlich nur beim jeweiligen Beruf erscheint.
//
// Feld `art`:
//   gesetz          Gesetz, Verordnung, EU-Recht, Staatsvertrag
//   norm            DIN, ISO, Branchenstandard, technische Regel
//   vorgabe         Ausbildungsordnung, Lehrplan, Prüfungsmaterial
//   nachschlagewerk Lexikon, Kommentar, Fachverlag, Datenbank
//   rechtsprechung  Gerichte und die Bereiche, in denen Urteile zählen
//   daten           amtliche Statistik
//
// Feld `geltung` (nur bei ALLGEMEIN): bei wie vielen der 14 Berufe die
// Quelle nach meiner Einschätzung tatsächlich gebraucht wird. Alles unter
// 14 ist ein Grenzfall und in der Durchsicht besonders zu prüfen.

export const STAND = 'September 2026';

// ---------------------------------------------------------------------------
// Für alle Berufe
// ---------------------------------------------------------------------------

export const ALLGEMEIN = [
  // --- Gesetze und Verordnungen: Vertrag und Handel ------------------------
  {
    kuerzel: 'BGB',
    titel: 'Bürgerliches Gesetzbuch',
    hinweis: 'Vertragsschluss, Kaufvertrag, Leistungsstörungen, Verjährung, AGB',
    art: 'gesetz',
    geltung: 14,
  },
  {
    kuerzel: 'HGB',
    titel: 'Handelsgesetzbuch',
    hinweis: 'Kaufmannseigenschaft, Handelsregister, Handelsgeschäfte, Buchführung',
    art: 'gesetz',
    geltung: 12,
  },
  {
    kuerzel: 'GewO',
    titel: 'Gewerbeordnung',
    hinweis: 'Anzeige und Erlaubnis von Gewerbe, Zeugnisanspruch § 109',
    art: 'gesetz',
    geltung: 12,
  },
  {
    kuerzel: 'UWG',
    titel: 'Gesetz gegen den unlauteren Wettbewerb',
    hinweis: 'irreführende Werbung, unzumutbare Belästigung',
    art: 'gesetz',
    geltung: 10,
  },
  {
    kuerzel: 'ProdHaftG',
    titel: 'Produkthaftungsgesetz',
    hinweis: 'Haftung für fehlerhafte Produkte, Abgrenzung zur Gewährleistung',
    art: 'gesetz',
    geltung: 8,
  },
  {
    kuerzel: 'ZPO',
    titel: 'Zivilprozessordnung',
    hinweis: 'gerichtliches Mahnverfahren, Vollstreckung — Anschluss an das Mahnwesen',
    art: 'gesetz',
    geltung: 10,
  },
  {
    kuerzel: 'InsO',
    titel: 'Insolvenzordnung',
    hinweis: 'Zahlungsunfähigkeit, Insolvenzverfahren, Forderungsausfall',
    art: 'gesetz',
    geltung: 9,
  },
  {
    kuerzel: 'GmbHG / AktG',
    titel: 'GmbH-Gesetz und Aktiengesetz',
    hinweis: 'Rechtsformen, Haftung, Organe',
    art: 'gesetz',
    geltung: 11,
  },

  // --- Gesetze und Verordnungen: Arbeit und Personal -----------------------
  {
    kuerzel: 'BBiG',
    titel: 'Berufsbildungsgesetz',
    hinweis: 'Ausbildungsvertrag, Rechte und Pflichten, Prüfungen',
    art: 'gesetz',
    geltung: 14,
  },
  {
    kuerzel: 'JArbSchG',
    titel: 'Jugendarbeitsschutzgesetz',
    hinweis: 'Arbeitszeit und Schutz für Auszubildende unter 18',
    art: 'gesetz',
    geltung: 13,
  },
  {
    kuerzel: 'ArbZG',
    titel: 'Arbeitszeitgesetz',
    hinweis: 'Höchstarbeitszeit, Ruhepausen, Ruhezeit, Sonntagsarbeit',
    art: 'gesetz',
    geltung: 14,
  },
  {
    kuerzel: 'BUrlG',
    titel: 'Bundesurlaubsgesetz',
    hinweis: 'Urlaubsanspruch, Übertragung, Abgeltung',
    art: 'gesetz',
    geltung: 13,
  },
  {
    kuerzel: 'EntgFG',
    titel: 'Entgeltfortzahlungsgesetz',
    hinweis: 'Lohnfortzahlung im Krankheitsfall und an Feiertagen',
    art: 'gesetz',
    geltung: 13,
  },
  {
    kuerzel: 'KSchG',
    titel: 'Kündigungsschutzgesetz',
    hinweis: 'Kündigungsgründe, Fristen, Sozialauswahl',
    art: 'gesetz',
    geltung: 13,
  },
  {
    kuerzel: 'TzBfG',
    titel: 'Teilzeit- und Befristungsgesetz',
    hinweis: 'Befristung mit und ohne Sachgrund, Teilzeitanspruch',
    art: 'gesetz',
    geltung: 12,
  },
  {
    kuerzel: 'BetrVG',
    titel: 'Betriebsverfassungsgesetz',
    hinweis: 'Betriebsrat, Mitbestimmung, Beteiligungsrechte',
    art: 'gesetz',
    geltung: 13,
  },
  {
    kuerzel: 'TVG',
    titel: 'Tarifvertragsgesetz',
    hinweis: 'Tarifbindung, Günstigkeitsprinzip, Allgemeinverbindlichkeit',
    art: 'gesetz',
    geltung: 12,
  },
  {
    kuerzel: 'MiLoG',
    titel: 'Mindestlohngesetz',
    hinweis: 'gesetzlicher Mindestlohn, Aufzeichnungspflichten',
    art: 'gesetz',
    geltung: 13,
  },
  {
    kuerzel: 'AGG',
    titel: 'Allgemeines Gleichbehandlungsgesetz',
    hinweis: 'Benachteiligungsverbot, Stellenausschreibung, Bewerbungsverfahren',
    art: 'gesetz',
    geltung: 13,
  },
  {
    kuerzel: 'MuSchG / BEEG',
    titel: 'Mutterschutzgesetz, Bundeselterngeld- und Elternzeitgesetz',
    hinweis: 'Beschäftigungsverbote, Elternzeit, Elterngeld',
    art: 'gesetz',
    geltung: 12,
  },
  {
    kuerzel: 'ArbSchG',
    titel: 'Arbeitsschutzgesetz',
    hinweis: 'Gefährdungsbeurteilung, Unterweisung, Pflichten des Arbeitgebers',
    art: 'gesetz',
    geltung: 13,
  },
  {
    kuerzel: 'SGB III–XI',
    titel: 'Sozialgesetzbuch',
    hinweis:
      'III Arbeitsförderung, IV gemeinsame Vorschriften, V Kranken-, VI Renten-, ' +
      'VII Unfall-, XI Pflegeversicherung',
    art: 'gesetz',
    geltung: 13,
  },

  // --- Gesetze und Verordnungen: Steuern und Daten -------------------------
  {
    kuerzel: 'UStG',
    titel: 'Umsatzsteuergesetz',
    hinweis: 'Steuersätze, Vorsteuerabzug, Rechnungsangaben § 14',
    art: 'gesetz',
    geltung: 12,
  },
  {
    kuerzel: 'EStG',
    titel: 'Einkommensteuergesetz',
    hinweis: 'Lohnsteuer, geldwerter Vorteil, Abschreibung § 7',
    art: 'gesetz',
    geltung: 11,
  },
  {
    kuerzel: 'AO',
    titel: 'Abgabenordnung',
    hinweis: 'Steuerpflichten, Fristen, Aufbewahrung, Betriebsprüfung',
    art: 'gesetz',
    geltung: 10,
  },
  {
    kuerzel: 'GoBD',
    titel: 'Grundsätze ordnungsmäßiger Buchführung in elektronischer Form',
    hinweis: 'BMF-Schreiben; Unveränderbarkeit, Verfahrensdokumentation, Aufbewahrung',
    art: 'gesetz',
    geltung: 10,
  },
  {
    kuerzel: 'DSGVO / BDSG',
    titel: 'Datenschutz-Grundverordnung und Bundesdatenschutzgesetz',
    hinweis: 'Rechtsgrundlagen, Betroffenenrechte, Beschäftigtendatenschutz § 26 BDSG',
    art: 'gesetz',
    geltung: 14,
  },

  // --- Prüfungs- und Ausbildungsvorgaben -----------------------------------
  {
    kuerzel: 'Ausbildungsordnung',
    titel: 'Ausbildungsordnung des jeweiligen Berufs',
    hinweis: 'Verordnung über die Berufsausbildung; enthält den Ausbildungsrahmenplan',
    art: 'vorgabe',
    geltung: 13,
  },
  {
    kuerzel: 'Rahmenlehrplan',
    titel: 'Rahmenlehrplan der Kultusministerkonferenz',
    hinweis: 'Lernfelder und deren Reihenfolge',
    art: 'vorgabe',
    geltung: 13,
  },
  {
    kuerzel: 'Prüfungsordnung',
    titel: 'Prüfungsordnung der zuständigen Kammer',
    hinweis: 'Ablauf, Gewichtung, Bestehensregeln, Wiederholung',
    art: 'vorgabe',
    geltung: 14,
  },
  {
    kuerzel: 'AkA',
    titel: 'AkA-Prüfungskataloge',
    hinweis: 'Aufgabenstelle für kaufmännische Abschluss- und Zwischenprüfungen, Nürnberg',
    art: 'vorgabe',
    geltung: 11,
  },
  {
    kuerzel: 'IHK-Merkblätter',
    titel: 'Merkblätter und Veröffentlichungen der zuständigen IHK',
    hinweis: 'für Duisburg: IHK Duisburg-Wesel-Kleve zu Niederrhein',
    art: 'vorgabe',
    geltung: 13,
  },
  {
    kuerzel: 'DIHK',
    titel: 'DIHK-Materialien und Umsetzungshilfen',
    art: 'vorgabe',
    geltung: 12,
  },

  // --- Nachschlagewerke ----------------------------------------------------
  {
    kuerzel: 'gesetze-im-internet.de',
    titel: 'Amtliche Gesetzesfassungen des Bundes',
    hinweis: 'kostenlos, immer aktuell — der zuverlässigste Beleg für Paragraphen',
    art: 'nachschlagewerk',
    geltung: 14,
  },
  {
    kuerzel: 'recht.nrw.de',
    titel: 'Landesrecht Nordrhein-Westfalen',
    hinweis: 'für alles Landesrechtliche, etwa Ladenöffnung oder Bauordnung',
    art: 'nachschlagewerk',
    geltung: 9,
  },
  {
    kuerzel: 'EUR-Lex',
    titel: 'Amtliches Portal des EU-Rechts',
    hinweis: 'Verordnungen und Richtlinien im Volltext',
    art: 'nachschlagewerk',
    geltung: 10,
  },
  {
    kuerzel: 'Gabler',
    titel: 'Springer Gabler Wirtschaftslexikon',
    hinweis: 'frei zugänglich, fachlich belastbar — der Standardnachschlagepunkt',
    art: 'nachschlagewerk',
    geltung: 14,
  },
  {
    kuerzel: 'Haufe',
    titel: 'Haufe Fachdatenbank',
    hinweis: 'teilweise kostenpflichtig',
    art: 'nachschlagewerk',
    geltung: 12,
  },
  {
    kuerzel: 'NWB',
    titel: 'NWB Verlag',
    hinweis: 'Steuern, Rechnungswesen, Wirtschaftsrecht',
    art: 'nachschlagewerk',
    geltung: 9,
  },
  {
    kuerzel: 'Lehrwerk',
    titel: 'Lehrbuch und Skript des Bildungsträgers',
    hinweis: 'das im Unterricht tatsächlich eingesetzte Material',
    art: 'nachschlagewerk',
    geltung: 14,
  },
  {
    kuerzel: 'Prüfungsliteratur',
    titel: 'Prüfungsvorbereitung, etwa u-form oder Kiehl',
    hinweis: 'Aufgabensammlungen früherer Prüfungen',
    art: 'nachschlagewerk',
    geltung: 13,
  },

  // --- Amtliche Daten ------------------------------------------------------
  {
    kuerzel: 'Destatis',
    titel: 'Statistisches Bundesamt',
    art: 'daten',
    geltung: 11,
  },
  {
    kuerzel: 'IT.NRW',
    titel: 'Statistisches Landesamt Nordrhein-Westfalen',
    art: 'daten',
    geltung: 7,
  },
  {
    kuerzel: 'Bundesbank',
    titel: 'Deutsche Bundesbank',
    hinweis: 'Zinsen, Zahlungsverkehr, Konjunktur',
    art: 'daten',
    geltung: 8,
  },

  // --- Rechtsprechung ------------------------------------------------------
  {
    kuerzel: 'BAG',
    titel: 'Bundesarbeitsgericht',
    hinweis: 'Arbeitsrecht — Kündigung, Befristung, Arbeitszeit',
    art: 'rechtsprechung',
    geltung: 12,
  },
  {
    kuerzel: 'BGH',
    titel: 'Bundesgerichtshof',
    hinweis: 'Zivil- und Handelsrecht — Vertrag, Gewährleistung, AGB',
    art: 'rechtsprechung',
    geltung: 11,
  },
  {
    kuerzel: 'EuGH',
    titel: 'Gerichtshof der Europäischen Union',
    hinweis: 'Auslegung von EU-Recht, etwa Datenschutz und Verbraucherschutz',
    art: 'rechtsprechung',
    geltung: 9,
  },
];

// ---------------------------------------------------------------------------
// Zusätzlich je Beruf
// ---------------------------------------------------------------------------

export const BERUFE = [
  {
    id: 'kgq',
    kuerzel: 'KGQ',
    name: 'Kaufmännische Grundqualifikation',
    pruefstelle: null,
    bemerkung:
      'Kein einzelner Beruf, sondern die Grundlage, die alle Umschülerinnen und ' +
      'Umschüler beherrschen sollen: Wirtschafts- und Sozialkunde. Dieselben Inhalte ' +
      'bilden in jedem kaufmännischen Beruf den Prüfungsbereich WiSo — was hier ' +
      'gebraucht wird, wird also überall gebraucht. Die untenstehende allgemeine Liste ' +
      'ist deshalb bei KGQ nicht Beiwerk, sondern der eigentliche Stoff. Die Einträge ' +
      'in Teil 2 ergänzen sie um das, was sonst nirgends steht: den politisch-sozialen ' +
      'Teil und die Frage der eigenen Existenzsicherung.',
    quellen: [
      {
        kuerzel: 'KMK-Qualifikationsprofil WiSo',
        titel: 'Kompetenzorientiertes Qualifikationsprofil Wirtschafts- und Sozialkunde',
        hinweis:
          'KMK-Beschluss vom 17.06.2021; drei Handlungsfelder — Junge Menschen in ' +
          'Ausbildung und Beruf, Nachhaltige Existenzsicherung, Unternehmen in ' +
          'Wirtschaft und global vernetzter Welt. Die maßgebliche Gliederung.',
        art: 'vorgabe',
      },
      {
        kuerzel: 'AkA-Katalog WiSo',
        titel: 'Prüfungskatalog Wirtschafts- und Sozialkunde',
        hinweis: 'seit der Anpassung an das KMK-Profil die konkrete Prüfungsgrundlage',
        art: 'vorgabe',
      },
      {
        kuerzel: 'GG',
        titel: 'Grundgesetz',
        hinweis:
          'Sozialstaatsgebot, Berufsfreiheit Art. 12, Koalitionsfreiheit Art. 9 Abs. 3 — ' +
          'der sozialkundliche Teil, der in keinem Fachgesetz steht',
        art: 'gesetz',
      },
      {
        kuerzel: 'BGB Rechtsgeschäfte',
        titel: 'Willenserklärung, Geschäftsfähigkeit, Kaufvertrag, Verbraucherschutz',
        hinweis: 'Handlungsfeld 3 — die Grundlagen ohne die Feinheiten des Schuldrechts',
        art: 'gesetz',
      },
      {
        kuerzel: 'Entgeltabrechnung',
        titel: 'Lohnsteuer und Sozialversicherungsbeiträge',
        hinweis:
          'Handlungsfeld 2; Brutto, Netto, Beitragsbemessungsgrenzen — welches ' +
          'Lehrwerk oder welche Tabelle wird dafür benutzt?',
        art: 'nachschlagewerk',
      },
      {
        kuerzel: 'DRV / GKV',
        titel: 'Deutsche Rentenversicherung und Krankenkassen',
        hinweis: 'Renteninformation, Versicherungsprinzip, private Vorsorge',
        art: 'nachschlagewerk',
      },
      {
        kuerzel: 'VVG',
        titel: 'Versicherungsvertragsgesetz',
        hinweis: 'private Absicherung — Handlungsfeld 2',
        art: 'gesetz',
      },
      {
        kuerzel: 'Verbraucherzentrale NRW',
        titel: 'Verbraucherinformation und Musterschreiben',
        hinweis: 'praxisnah für Verbraucherschutz und Vertragsfallen',
        art: 'nachschlagewerk',
      },
      {
        kuerzel: 'bpb',
        titel: 'Bundeszentrale für politische Bildung',
        hinweis: 'soziale Marktwirtschaft, Sozialstaat, Globalisierung — kostenfrei',
        art: 'nachschlagewerk',
      },
      {
        kuerzel: 'europa.eu',
        titel: 'Institutionen der Europäischen Union',
        hinweis:
          'Handlungsfeld 1 nennt ausdrücklich die Bedeutung der EU für die ' +
          'Berufstätigkeit — Freizügigkeit, Binnenmarkt',
        art: 'nachschlagewerk',
      },
      {
        kuerzel: 'Existenzgründung',
        titel: 'Gründungsinformationen der IHK und des BMWK',
        hinweis: 'Handlungsfeld 2 nennt Existenzgründung ausdrücklich',
        art: 'nachschlagewerk',
      },
      {
        kuerzel: 'BERUFENET',
        titel: 'Berufsinformationen der Bundesagentur für Arbeit',
        hinweis: 'Berufsbilder und Aufstiegswege — Orientierung vor der Entscheidung',
        art: 'daten',
      },
    ],
  },

  {
    id: 'einzelhandel',
    kuerzel: 'EHK',
    name: 'Kaufleute im Einzelhandel',
    pruefstelle: 'IHK',
    quellen: [
      {
        kuerzel: 'AO Einzelhandel',
        titel: 'Verordnung über die Berufsausbildung im Einzelhandel',
        hinweis: 'Neufassung 2022, mit Wahlqualifikationen',
        art: 'vorgabe',
      },
      {
        kuerzel: 'Rahmenlehrplan EHK',
        titel: 'Vierzehn Lernfelder, 880 Stunden',
        hinweis:
          'LF 1–5 Repräsentation, Verkauf, Kasse, Warenpräsentation, Werbung; ' +
          'LF 6–10 Beschaffung, Lager, Geschäftsprozesse, Preispolitik, besondere ' +
          'Verkaufssituationen; LF 11–14 Steuerung, Marketing, Personal, ' +
          'Unternehmensführung',
        art: 'vorgabe',
      },
      {
        kuerzel: 'KassenSichV / § 146a AO',
        titel: 'Ordnungsmäßigkeit der Kassenführung',
        hinweis:
          'LF 3 betreut den Servicebereich Kasse: zertifizierte technische ' +
          'Sicherheitseinrichtung, Belegausgabepflicht, Kassennachschau. Fehlte bisher.',
        art: 'gesetz',
      },
      {
        kuerzel: 'HGB §§ 240 f.',
        titel: 'Inventur und Inventar',
        hinweis: 'LF 8 Geschäftsprozesse erfassen und kontrollieren — Inventurverfahren',
        art: 'gesetz',
      },
      {
        kuerzel: 'Handelskalkulation',
        titel: 'Kalkulationsschema des Einzelhandels',
        hinweis:
          'LF 9 und LF 11: Bezugskalkulation, Handelsspanne, Kalkulationszuschlag, ' +
          'Umsatz- und Lagerkennzahlen. Nach welchem Lehrwerk?',
        art: 'nachschlagewerk',
      },
      {
        kuerzel: 'LÖG NRW',
        titel: 'Ladenöffnungsgesetz Nordrhein-Westfalen',
        hinweis: 'Landesrecht — Öffnungszeiten, verkaufsoffene Sonntage',
        art: 'gesetz',
      },
      {
        kuerzel: 'PAngV',
        titel: 'Preisangabenverordnung',
        hinweis: 'Grundpreis, Auszeichnung, Rabattwerbung',
        art: 'gesetz',
      },
      {
        kuerzel: 'JuSchG',
        titel: 'Jugendschutzgesetz',
        hinweis: 'Abgabeverbote für Alkohol und Tabak — Prüfungsklassiker',
        art: 'gesetz',
      },
      {
        kuerzel: 'LFGB',
        titel: 'Lebensmittel- und Futtermittelgesetzbuch',
        art: 'gesetz',
      },
      {
        kuerzel: 'LMIV',
        titel: 'EU-Lebensmittelinformationsverordnung 1169/2011',
        hinweis: 'Kennzeichnung, Allergene, Nährwerte',
        art: 'gesetz',
      },
      {
        kuerzel: 'MessEG / MessEV',
        titel: 'Mess- und Eichgesetz mit Verordnung',
        hinweis: 'Waagen, Fertigpackungen, Nennfüllmenge',
        art: 'gesetz',
      },
      {
        kuerzel: 'VerpackG',
        titel: 'Verpackungsgesetz',
        hinweis: 'Rücknahme, Pfand, Systembeteiligung',
        art: 'gesetz',
      },
      {
        kuerzel: 'GPSR',
        titel: 'EU-Produktsicherheitsverordnung 2023/988',
        hinweis: 'löst das ProdSG in weiten Teilen ab',
        art: 'gesetz',
      },
      {
        kuerzel: 'BGB Fernabsatz',
        titel: 'Fernabsatz und Widerruf, §§ 312 ff., § 355 BGB',
        hinweis: 'sobald der Betrieb auch online verkauft',
        art: 'gesetz',
      },
      {
        kuerzel: 'HDE',
        titel: 'Handelsverband Deutschland',
        hinweis: 'Branchenzahlen, Positionspapiere',
        art: 'daten',
      },
      {
        kuerzel: 'EHI',
        titel: 'EHI Retail Institute',
        hinweis: 'Handelsforschung, Zahlungsverhalten, Ladenbau',
        art: 'daten',
      },
      {
        kuerzel: 'Warenkunde',
        titel: 'Warenkunde des jeweiligen Sortiments',
        hinweis: 'je nach Ausbildungsbetrieb sehr unterschiedlich',
        art: 'nachschlagewerk',
      },
    ],
  },

  {
    id: 'fachinformatik',
    kuerzel: 'FISI',
    name: 'Fachinformatiker – Systemintegration',
    pruefstelle: 'IHK',
    bemerkung:
      'Technischer Beruf, aber nicht ohne kaufmännischen Anteil: Der Rahmenlehrplan ' +
      'von 2020 beginnt mit LF 1 "Das Unternehmen und die eigene Rolle im Betrieb ' +
      'beschreiben" und endet mit LF 12b "Kundenspezifische Systemintegration ' +
      'durchführen" — also mit Angebot, Kalkulation und Abnahme eines Kundenauftrags. ' +
      'Die allgemeine Liste ist hier deshalb nicht gegenstandslos, aber ihr ' +
      'Rechnungswesenteil vermutlich schon. Bitte gezielt auf Streichungen achten.',
    quellen: [
      {
        kuerzel: 'AO IT-Berufe',
        titel: 'Verordnung über die Berufsausbildung in den IT-Berufen',
        hinweis: 'Neufassung 2020',
        art: 'vorgabe',
      },
      {
        kuerzel: 'Rahmenlehrplan IT 2020',
        titel: 'Zwölf Lernfelder, davon 1 bis 9 gemeinsam',
        hinweis:
          'Systemintegration ab dem dritten Jahr mit LF 10b Serverdienste, ' +
          'LF 11b Betrieb und Sicherheit vernetzter Systeme, LF 12b Kundenauftrag',
        art: 'vorgabe',
      },
      {
        kuerzel: 'BGB §§ 611, 631',
        titel: 'Dienstvertrag und Werkvertrag',
        hinweis:
          'LF 6 Serviceanfragen und LF 12b Kundenauftrag: Service-Level, Abnahme, ' +
          'Mängelhaftung — der rechtliche Unterbau des IT-Geschäfts',
        art: 'gesetz',
      },
      {
        kuerzel: 'BFSG / BITV 2.0',
        titel: 'Barrierefreiheitsstärkungsgesetz und Barrierefreie-IT-Verordnung',
        hinweis: 'seit Juni 2025 verpflichtend; LF 2 Arbeitsplätze ausstatten',
        art: 'gesetz',
      },
      {
        kuerzel: 'ArbStättV Anhang 6',
        titel: 'Bildschirmarbeitsplätze',
        hinweis: 'LF 2 — Ergonomie ist Teil der Arbeitsplatzausstattung',
        art: 'gesetz',
      },
      {
        kuerzel: 'UrhG',
        titel: 'Urheberrechtsgesetz',
        hinweis: 'Softwarelizenzen §§ 69a ff., Open-Source-Lizenzmodelle',
        art: 'gesetz',
      },
      {
        kuerzel: 'StGB §§ 202a ff.',
        titel: 'Computerstrafrecht',
        hinweis: 'Ausspähen von Daten, Datenveränderung, Computersabotage',
        art: 'gesetz',
      },
      {
        kuerzel: 'BSIG / NIS2',
        titel: 'BSI-Gesetz und NIS-2-Umsetzung',
        hinweis: 'Meldepflichten, Betreiber kritischer Anlagen',
        art: 'gesetz',
      },
      {
        kuerzel: 'TKG',
        titel: 'Telekommunikationsgesetz',
        art: 'gesetz',
      },
      {
        kuerzel: 'TDDDG',
        titel: 'Telekommunikation-Digitale-Dienste-Datenschutz-Gesetz',
        hinweis: 'ehemals TTDSG; § 25 zu Cookies und Endgerätezugriff',
        art: 'gesetz',
      },
      {
        kuerzel: 'KI-VO',
        titel: 'EU-Verordnung über künstliche Intelligenz 2024/1689',
        hinweis: 'neu; ob sie schon im Unterricht vorkommt, ist offen',
        art: 'gesetz',
      },
      {
        kuerzel: 'IT-Grundschutz',
        titel: 'BSI IT-Grundschutz-Kompendium',
        hinweis: 'Bausteine, Schutzbedarfsfeststellung — prüfungsnah',
        art: 'norm',
      },
      {
        kuerzel: 'ISO/IEC 27001',
        titel: 'Informationssicherheits-Managementsysteme',
        art: 'norm',
      },
      {
        kuerzel: 'ITIL',
        titel: 'IT-Service-Management nach ITIL',
        hinweis: 'Incident, Problem, Change — Begriffe tauchen in Prüfungen auf',
        art: 'norm',
      },
      {
        kuerzel: 'IEEE 802',
        titel: 'Netzwerkstandards',
        hinweis: '802.3 Ethernet, 802.11 WLAN, 802.1Q VLAN',
        art: 'norm',
      },
      {
        kuerzel: 'RFC',
        titel: 'Requests for Comments der IETF',
        hinweis: 'TCP/IP, DNS, HTTP, DHCP im Original',
        art: 'norm',
      },
      {
        kuerzel: 'DIN EN ISO 9241',
        titel: 'Ergonomie der Mensch-System-Interaktion',
        art: 'norm',
      },
      {
        kuerzel: 'Herstellerdoku',
        titel: 'Microsoft Learn, Cisco, Linux-Handbücher',
        hinweis: 'die eigentliche Arbeitsgrundlage im Betrieb',
        art: 'nachschlagewerk',
      },
      {
        kuerzel: "c't / iX",
        titel: 'Heise-Fachpresse',
        art: 'nachschlagewerk',
      },
    ],
  },

  {
    id: 'lagerlogistik',
    kuerzel: 'FKL',
    name: 'Fachkräfte für Lagerlogistik',
    pruefstelle: 'IHK',
    quellen: [
      {
        kuerzel: 'AO Lagerlogistik',
        titel: 'Verordnung über die Berufsausbildung zur Fachkraft für Lagerlogistik',
        art: 'vorgabe',
      },
      {
        kuerzel: 'Rahmenlehrplan FKL',
        titel: 'Zwölf Lernfelder, 840 Stunden',
        hinweis:
          'Güter annehmen, lagern, bearbeiten, transportieren, kommissionieren, ' +
          'verpacken; Touren planen; Güter verladen und versenden; Prozesse ' +
          'optimieren; Güter beschaffen; Kennzahlen ermitteln',
        art: 'vorgabe',
      },
      {
        kuerzel: 'VO (EG) 561/2006',
        titel: 'Lenk- und Ruhezeiten',
        hinweis:
          'LF 7 Touren planen — zusammen mit FPersG und FPersV. Fehlte bisher, ' +
          'obwohl ohne Lenkzeiten keine Tour planbar ist.',
        art: 'gesetz',
      },
      {
        kuerzel: 'HGB §§ 407 ff. / CMR',
        titel: 'Frachtrecht und Frachtpapiere',
        hinweis: 'LF 9 Güter versenden — Frachtbrief, Haftung, Ablieferung',
        art: 'gesetz',
      },
      {
        kuerzel: 'Lagerkennzahlen',
        titel: 'Umschlagshäufigkeit, Lagerdauer, Lagerzinssatz',
        hinweis: 'LF 12 Kennzahlen ermitteln und auswerten — 80 Stunden',
        art: 'nachschlagewerk',
      },
      {
        kuerzel: 'Verkehrsgeografie',
        titel: 'Verkehrswege, Knotenpunkte, Entfernungstabellen',
        hinweis: 'LF 7 Touren planen',
        art: 'nachschlagewerk',
      },
      {
        kuerzel: 'DGUV Vorschrift 68',
        titel: 'Flurförderzeuge',
        hinweis: 'Gabelstapler — Voraussetzung für den Fahrausweis',
        art: 'norm',
      },
      {
        kuerzel: 'DGUV Grundsatz 308-001',
        titel: 'Ausbildung von Fahrpersonal für Flurförderzeuge',
        art: 'norm',
      },
      {
        kuerzel: 'BetrSichV',
        titel: 'Betriebssicherheitsverordnung',
        hinweis: 'Prüfung von Arbeitsmitteln, Regale, Hebezeuge',
        art: 'gesetz',
      },
      {
        kuerzel: 'ArbStättV',
        titel: 'Arbeitsstättenverordnung',
        hinweis: 'Verkehrswege, Beleuchtung, Fluchtwege',
        art: 'gesetz',
      },
      {
        kuerzel: 'LasthandhabV',
        titel: 'Lastenhandhabungsverordnung',
        hinweis: 'Heben und Tragen',
        art: 'gesetz',
      },
      {
        kuerzel: 'GefStoffV',
        titel: 'Gefahrstoffverordnung',
        hinweis: 'Lagerung, Kennzeichnung, Sicherheitsdatenblatt',
        art: 'gesetz',
      },
      {
        kuerzel: 'TRGS 510',
        titel: 'Lagerung von Gefahrstoffen in ortsbeweglichen Behältern',
        art: 'norm',
      },
      {
        kuerzel: 'GGVSEB / ADR',
        titel: 'Gefahrgutverordnung Straße, Eisenbahn, Binnenschiff',
        hinweis: 'Klassen, Kennzeichnung, Zusammenladeverbote',
        art: 'gesetz',
      },
      {
        kuerzel: 'StVO § 22',
        titel: 'Ladung und Ladungssicherung',
        art: 'gesetz',
      },
      {
        kuerzel: 'VDI 2700',
        titel: 'Ladungssicherung auf Straßenfahrzeugen',
        hinweis: 'die maßgebliche technische Regel',
        art: 'norm',
      },
      {
        kuerzel: 'HGB §§ 467 ff.',
        titel: 'Lagergeschäft',
        hinweis: 'Lagerschein, Pflichten des Lagerhalters, Haftung',
        art: 'gesetz',
      },
      {
        kuerzel: 'EPAL / DIN EN 13698',
        titel: 'Europalette und Palettentausch',
        art: 'norm',
      },
      {
        kuerzel: 'VerpackG',
        titel: 'Verpackungsgesetz',
        art: 'gesetz',
      },
      {
        kuerzel: 'LMHV',
        titel: 'Lebensmittelhygiene-Verordnung',
        hinweis: 'nur bei Lebensmittellagern; HACCP, Kühlkette',
        art: 'gesetz',
      },
    ],
  },

  {
    id: 'schutzsicherheit',
    kuerzel: 'FKS',
    name: 'Fachkräfte für Schutz und Sicherheit',
    pruefstelle: 'IHK',
    bemerkung:
      'Der Schwerpunkt liegt auf Eingriffsrecht und Arbeitsschutz — aber das dritte ' +
      'Ausbildungsjahr ist kaufmännisch: LF 10 steuert Geschäftsprozesse der Branche, ' +
      'LF 11 entwickelt ein Dienstleistungsangebot, LF 12 erstellt Risikoanalysen. ' +
      'Kalkulation, Vertragsgestaltung und Buchführung gehören also dazu. Die ' +
      'allgemeine Liste ist damit relevanter, als es der Beruf zunächst vermuten lässt.',
    quellen: [
      {
        kuerzel: 'AO Schutz und Sicherheit',
        titel: 'Verordnung über die Berufsausbildung zur Fachkraft für Schutz und Sicherheit',
        art: 'vorgabe',
      },
      {
        kuerzel: 'Rahmenlehrplan FKS',
        titel: 'Zwölf Lernfelder, KMK-Beschluss vom 10.04.2008',
        hinweis:
          'LF 1 bis 8 gemeinsam mit der Servicekraft; LF 9 Dokumentation von ' +
          'Sicherheitsverstößen, LF 10 Geschäftsprozesse, LF 11 Dienstleistungsangebot, ' +
          'LF 12 Risikoanalyse',
        art: 'vorgabe',
      },
      {
        kuerzel: 'OWiG',
        titel: 'Gesetz über Ordnungswidrigkeiten',
        hinweis:
          'LF 5 verlangt, Rechtsverstöße zu erkennen und zu bewerten — die ' +
          'Abgrenzung Straftat zu Ordnungswidrigkeit gehört dazu',
        art: 'gesetz',
      },
      {
        kuerzel: 'DGUV Vorschrift 1',
        titel: 'Grundsätze der Prävention',
        hinweis: 'LF 4 — Unterweisung, Erste Hilfe, Brandschutzhelfer',
        art: 'norm',
      },
      {
        kuerzel: 'Kalkulation von Sicherheitsdienstleistungen',
        titel: 'Angebot, Stundenverrechnungssatz, Ausschreibung',
        hinweis:
          'LF 11 entwickelt ein Dienstleistungsangebot. Nach welchem Lehrwerk wird ' +
          'das gerechnet?',
        art: 'nachschlagewerk',
      },
      {
        kuerzel: 'GewO § 34a',
        titel: 'Bewachungsgewerbe',
        hinweis: 'Erlaubnis, Zuverlässigkeit, Sachkundeprüfung',
        art: 'gesetz',
      },
      {
        kuerzel: 'BewachV',
        titel: 'Bewachungsverordnung',
        hinweis: 'Unterrichtung, Dienstausweis, Bewacherregister',
        art: 'gesetz',
      },
      {
        kuerzel: 'StGB',
        titel: 'Strafgesetzbuch',
        hinweis: 'Notwehr § 32, Notstand § 34, Körperverletzung, Hausfriedensbruch § 123',
        art: 'gesetz',
      },
      {
        kuerzel: 'StPO § 127',
        titel: 'Vorläufige Festnahme (Jedermannsrecht)',
        art: 'gesetz',
      },
      {
        kuerzel: 'BGB §§ 227 ff.',
        titel: 'Notwehr, Selbsthilfe, Besitzwehr § 859',
        hinweis: 'die zivilrechtliche Seite derselben Lage',
        art: 'gesetz',
      },
      {
        kuerzel: 'BGB §§ 903, 1004',
        titel: 'Eigentum und Hausrecht',
        hinweis: 'Grundlage des Hausverbots',
        art: 'gesetz',
      },
      {
        kuerzel: 'WaffG',
        titel: 'Waffengesetz',
        hinweis: 'auch für Reizstoffsprühgeräte und Abwehrmittel',
        art: 'gesetz',
      },
      {
        kuerzel: 'BDSG § 4',
        titel: 'Videoüberwachung öffentlich zugänglicher Räume',
        hinweis: 'zusammen mit Art. 6 DSGVO — Prüfungsthema',
        art: 'gesetz',
      },
      {
        kuerzel: 'DGUV Vorschrift 23',
        titel: 'Wach- und Sicherungsdienste',
        art: 'norm',
      },
      {
        kuerzel: 'DIN 77200',
        titel: 'Anforderungen an Sicherungsdienstleistungen',
        art: 'norm',
      },
      {
        kuerzel: 'DIN 14096',
        titel: 'Brandschutzordnung Teil A, B, C',
        art: 'norm',
      },
      {
        kuerzel: 'BHKG NRW',
        titel: 'Gesetz über den Brandschutz, die Hilfeleistung und den Katastrophenschutz',
        hinweis: 'Landesrecht NRW',
        art: 'gesetz',
      },
      {
        kuerzel: 'VdS-Richtlinien',
        titel: 'VdS Schadenverhütung',
        hinweis: 'Einbruchmelde- und Brandmeldeanlagen',
        art: 'norm',
      },
      {
        kuerzel: 'LuftSiG',
        titel: 'Luftsicherheitsgesetz',
        hinweis: 'nur bei Einsatz an Flughäfen',
        art: 'gesetz',
      },
    ],
  },

  {
    id: 'grosshandel',
    kuerzel: 'GAM',
    name: 'Kaufleute im Groß- und Außenhandelsmanagement',
    pruefstelle: 'IHK',
    quellen: [
      {
        kuerzel: 'AO Groß- und Außenhandel',
        titel: 'Verordnung über die Berufsausbildung im Groß- und Außenhandelsmanagement',
        hinweis: 'Neufassung 2020, Fachrichtungen Großhandel und Außenhandel',
        art: 'vorgabe',
      },
      {
        kuerzel: 'Rahmenlehrplan GAM 2020',
        titel: 'Dreizehn Lernfelder, ab dem dritten Jahr nach Fachrichtung getrennt',
        hinweis:
          'Großhandel: LF 11 Waren lagern, LF 12 Warentransporte abwickeln. ' +
          'Außenhandel: LF 11 internationale Transporte, LF 12 Außenhandelsgeschäfte ' +
          'abwickeln und finanzieren. Welche Fachrichtung wird unterrichtet?',
        art: 'vorgabe',
      },
      {
        kuerzel: 'HGB §§ 407 ff. / CMR',
        titel: 'Frachtrecht',
        hinweis: 'LF 12 GH Warentransporte abwickeln — fehlte bisher',
        art: 'gesetz',
      },
      {
        kuerzel: 'Kurssicherung',
        titel: 'Devisenkurse, Termingeschäft, Währungsrisiko',
        hinweis: 'LF 12 AH Außenhandelsgeschäfte finanzieren',
        art: 'nachschlagewerk',
      },
      {
        kuerzel: 'ERP-Systeme',
        titel: 'Digitale Unterstützung der Geschäftsprozesse',
        hinweis:
          'LF 9 verlangt ausdrücklich digitale Werkzeuge. Welches System wird ' +
          'im Unterricht benutzt?',
        art: 'nachschlagewerk',
      },
      {
        kuerzel: 'HGB §§ 373 ff.',
        titel: 'Handelskauf',
        hinweis: 'Untersuchungs- und Rügepflicht § 377 — Prüfungsklassiker',
        art: 'gesetz',
      },
      {
        kuerzel: 'CISG',
        titel: 'UN-Kaufrecht',
        hinweis: 'Wiener Übereinkommen über den internationalen Warenkauf',
        art: 'gesetz',
      },
      {
        kuerzel: 'Incoterms 2020',
        titel: 'Lieferklauseln der Internationalen Handelskammer',
        hinweis: 'Gefahrübergang, Kostenteilung — kein Gesetz, sondern Klauselwerk',
        art: 'norm',
      },
      {
        kuerzel: 'UZK',
        titel: 'Unionszollkodex, VO (EU) 952/2013',
        hinweis: 'Zollverfahren, Zollwert, Warenursprung',
        art: 'gesetz',
      },
      {
        kuerzel: 'AWG / AWV',
        titel: 'Außenwirtschaftsgesetz und -verordnung',
        hinweis: 'Ausfuhrkontrolle, Embargos, Genehmigungspflichten',
        art: 'gesetz',
      },
      {
        kuerzel: 'UStG § 4 Nr. 1',
        titel: 'Innergemeinschaftliche Lieferung und Ausfuhrlieferung',
        hinweis: 'Umsatzsteuer im grenzüberschreitenden Handel',
        art: 'gesetz',
      },
      {
        kuerzel: 'ERA 600',
        titel: 'Einheitliche Richtlinien für Dokumenten-Akkreditive',
        hinweis: 'ICC-Regelwerk zur Zahlungssicherung',
        art: 'norm',
      },
      {
        kuerzel: 'ATLAS',
        titel: 'Elektronisches Zollverfahren des Zolls',
        art: 'nachschlagewerk',
      },
      {
        kuerzel: 'Zoll.de',
        titel: 'Portal der Zollverwaltung',
        hinweis: 'Warentarifnummern, Sanktionslisten, Merkblätter',
        art: 'nachschlagewerk',
      },
      {
        kuerzel: 'LkSG',
        titel: 'Lieferkettensorgfaltspflichtengesetz',
        hinweis: 'ob im Unterricht behandelt, ist offen',
        art: 'gesetz',
      },
    ],
  },

  {
    id: 'industrie',
    kuerzel: 'IK',
    name: 'Industriekaufleute',
    pruefstelle: 'IHK',
    quellen: [
      {
        kuerzel: 'AO Industriekaufleute 2024',
        titel: 'Neu geordnet zum 1. August 2024',
        hinweis:
          'Erste grundlegende Überarbeitung seit 2002; Rahmenlehrplan mit ' +
          'angepassten Lernfeldern, neues Prüfungsinstrument Dokumentation. ' +
          'WICHTIG: Laufende Umschulungen können noch nach alter Ordnung geprüft ' +
          'werden — welche gilt für Ihre Gruppe?',
        art: 'vorgabe',
      },
      {
        kuerzel: 'Projektmanagement',
        titel: 'Projektplanung, -steuerung und -bewertung',
        hinweis: 'eigenes Lernfeld im Rahmenlehrplan — fehlte bisher',
        art: 'nachschlagewerk',
      },
      {
        kuerzel: 'Marketing und Marktforschung',
        titel: 'Absatzwege, Marketing-Mix, Kundenbindung',
        hinweis: 'eigenes Lernfeld — fehlte bisher',
        art: 'nachschlagewerk',
      },
      {
        kuerzel: 'Logistik und Lagerkennzahlen',
        titel: 'Lagerhaltung, Bestandsgrößen, Kennzahlen',
        hinweis: 'eigenes Lernfeld — fehlte bisher',
        art: 'nachschlagewerk',
      },
      {
        kuerzel: 'GWB',
        titel: 'Gesetz gegen Wettbewerbsbeschränkungen',
        hinweis:
          'Unternehmenskooperationen und Marktmechanismen sind Lernfeldinhalt — ' +
          'Kartellverbot, Fusionskontrolle',
        art: 'gesetz',
      },
      {
        kuerzel: 'HGB §§ 238–342e',
        titel: 'Handelsbilanzrecht',
        hinweis: 'Buchführungspflicht, Ansatz, Bewertung, Jahresabschluss',
        art: 'gesetz',
      },
      {
        kuerzel: 'KStG',
        titel: 'Körperschaftsteuergesetz',
        art: 'gesetz',
      },
      {
        kuerzel: 'GewStG',
        titel: 'Gewerbesteuergesetz',
        hinweis: 'Hinzurechnungen, Kürzungen, Hebesatz',
        art: 'gesetz',
      },
      {
        kuerzel: 'BetrVG §§ 87 ff.',
        titel: 'Mitbestimmung in sozialen Angelegenheiten',
        hinweis: 'im Industriebetrieb praktisch das wichtigste Kapitel',
        art: 'gesetz',
      },
      {
        kuerzel: 'ProdHaftG',
        titel: 'Produkthaftungsgesetz',
        art: 'gesetz',
      },
      {
        kuerzel: 'KLR',
        titel: 'Kosten- und Leistungsrechnung',
        hinweis:
          'kein Gesetz — Betriebsabrechnungsbogen, Kalkulation, Deckungsbeitrag. ' +
          'Nach welchem Lehrwerk wird gerechnet?',
        art: 'nachschlagewerk',
      },
      {
        kuerzel: 'Investitionsrechnung',
        titel: 'Statische und dynamische Verfahren',
        hinweis: 'Kapitalwert, interner Zinsfuß, Amortisation',
        art: 'nachschlagewerk',
      },
      {
        kuerzel: 'REFA',
        titel: 'REFA-Methodenlehre',
        hinweis: 'Arbeitsstudium, Zeitwirtschaft — falls im Unterricht behandelt',
        art: 'nachschlagewerk',
      },
      {
        kuerzel: 'DIN EN ISO 9001',
        titel: 'Qualitätsmanagementsysteme',
        art: 'norm',
      },
      {
        kuerzel: 'IFRS',
        titel: 'International Financial Reporting Standards',
        hinweis: 'nur bei international ausgerichteten Betrieben',
        art: 'norm',
      },
    ],
  },

  {
    id: 'immobilien',
    kuerzel: 'IMK',
    name: 'Immobilienkaufleute',
    pruefstelle: 'IHK',
    bemerkung:
      'Der Beruf, bei dem Rechtsprechung wirklich zählt: Das Mietrecht lebt von ' +
      'BGH-Entscheidungen, und viele Prüfungsfragen setzen sie voraus. Bitte hier ' +
      'besonders nennen, welche Urteile im Unterricht vorkommen.',
    quellen: [
      {
        kuerzel: 'AO Immobilienkaufleute',
        titel: 'Verordnung über die Berufsausbildung zum Immobilienkaufmann',
        art: 'vorgabe',
      },
      {
        kuerzel: 'Rahmenlehrplan IMK',
        titel: 'Zwölf Lernfelder',
        hinweis:
          'Schwerpunkte nach Zeitrichtwert: LF 5 Wohnräume verwalten (100 Std.) und ' +
          'LF 8 Bauprojekte entwickeln und begleiten (100 Std.), dazu LF 9 ' +
          'Wohnungseigentum, LF 10 Vermittlung, LF 11 Finanzierung',
        art: 'vorgabe',
      },
      {
        kuerzel: 'VOB/B und HOAI',
        titel: 'Bauvertrag und Architektenhonorar',
        hinweis:
          'LF 8 widmet Bauprojekten 100 Stunden. Ohne Bauvertragsrecht fehlt dem ' +
          'Lernfeld die Grundlage — fehlte bisher ganz.',
        art: 'gesetz',
      },
      {
        kuerzel: 'BGB §§ 1113 ff.',
        titel: 'Hypothek und Grundschuld',
        hinweis: 'LF 11 Immobilien finanzieren — Grundpfandrechte, Rangfolge, Löschung',
        art: 'gesetz',
      },
      {
        kuerzel: 'Immobilienfinanzierung',
        titel: 'Annuitätendarlehen, Beleihungswert, Wohnimmobilienkreditrichtlinie',
        hinweis: 'LF 11 — § 491a BGB, Kreditwürdigkeitsprüfung',
        art: 'nachschlagewerk',
      },
      {
        kuerzel: 'Gewerbemietrecht',
        titel: 'Miete über Geschäftsräume',
        hinweis:
          'LF 6 bewirtschaftet gewerbliche Objekte — dort gilt das Mieterschutzrecht ' +
          'der Wohnraummiete gerade nicht',
        art: 'gesetz',
      },
      {
        kuerzel: 'BGB §§ 535–580a',
        titel: 'Mietrecht',
        hinweis: 'Mängel, Mieterhöhung, Kündigung, Schönheitsreparaturen',
        art: 'gesetz',
      },
      {
        kuerzel: 'WEG',
        titel: 'Wohnungseigentumsgesetz',
        hinweis: 'Reform 2020 — Verwalter, Beschlussfassung, bauliche Veränderung',
        art: 'gesetz',
      },
      {
        kuerzel: 'BetrKV',
        titel: 'Betriebskostenverordnung',
        hinweis: 'Umlagefähigkeit — der Dauerbrenner in der Abrechnung',
        art: 'gesetz',
      },
      {
        kuerzel: 'HeizkostenV',
        titel: 'Heizkostenverordnung',
        art: 'gesetz',
      },
      {
        kuerzel: 'MaBV',
        titel: 'Makler- und Bauträgerverordnung',
        art: 'gesetz',
      },
      {
        kuerzel: 'GewO § 34c',
        titel: 'Erlaubnis für Makler, Verwalter und Bauträger',
        hinweis: 'seit 2018 mit Weiterbildungspflicht',
        art: 'gesetz',
      },
      {
        kuerzel: 'WoVermRG',
        titel: 'Wohnungsvermittlungsgesetz',
        hinweis: 'Bestellerprinzip',
        art: 'gesetz',
      },
      {
        kuerzel: 'GBO',
        titel: 'Grundbuchordnung',
        hinweis: 'Abteilungen, Rangfolge, Eintragung',
        art: 'gesetz',
      },
      {
        kuerzel: 'BauGB',
        titel: 'Baugesetzbuch',
        hinweis: 'Bauleitplanung, Erschließung, Vorkaufsrecht',
        art: 'gesetz',
      },
      {
        kuerzel: 'BauO NRW',
        titel: 'Landesbauordnung Nordrhein-Westfalen',
        art: 'gesetz',
      },
      {
        kuerzel: 'GEG',
        titel: 'Gebäudeenergiegesetz',
        hinweis: 'Energieausweis, Anforderungen bei Bestand und Neubau',
        art: 'gesetz',
      },
      {
        kuerzel: 'ImmoWertV',
        titel: 'Immobilienwertermittlungsverordnung',
        hinweis: 'Vergleichs-, Ertrags- und Sachwertverfahren',
        art: 'gesetz',
      },
      {
        kuerzel: 'GrEStG / GrStG',
        titel: 'Grunderwerbsteuer und Grundsteuer',
        hinweis: 'Grundsteuerreform ab 2025 — NRW im Bundesmodell',
        art: 'gesetz',
      },
      {
        kuerzel: 'WoFG / WoBindG',
        titel: 'Wohnraumförderung und Belegungsbindung',
        hinweis: 'öffentlich geförderter Wohnraum',
        art: 'gesetz',
      },
      {
        kuerzel: 'ErbbauRG',
        titel: 'Erbbaurechtsgesetz',
        art: 'gesetz',
      },
      {
        kuerzel: 'Schmidt-Futterer',
        titel: 'Mietrecht, Kommentar',
        hinweis: 'das Standardwerk — kostenpflichtig',
        art: 'nachschlagewerk',
      },
      {
        kuerzel: 'Mietspiegel',
        titel: 'Örtlicher Mietspiegel',
        hinweis: 'für Duisburg und die Nachbarstädte',
        art: 'daten',
      },
      {
        kuerzel: 'BGH VIII ZR / V ZR',
        titel: 'Mietrecht und Wohnungseigentum',
        hinweis:
          'VIII. Senat für Miete, V. Senat für WEG und Grundstücksrecht. ' +
          'Welche Entscheidungen werden im Unterricht behandelt?',
        art: 'rechtsprechung',
      },
    ],
  },

  {
    id: 'bueromanagement',
    kuerzel: 'KBM',
    name: 'Kaufleute für Büromanagement',
    pruefstelle: 'IHK',
    quellen: [
      {
        kuerzel: 'AO Büromanagement',
        titel: 'Verordnung über die Berufsausbildung zum Kaufmann für Büromanagement',
        hinweis: '2013; gestreckte Abschlussprüfung mit zwei Wahlqualifikationen',
        art: 'vorgabe',
      },
      {
        kuerzel: 'Rahmenlehrplan KBM',
        titel: 'Dreizehn Lernfelder, 880 Stunden',
        hinweis:
          'Schwerpunkt LF 4 Sachgüter und Dienstleistungen beschaffen (120 Std.); ' +
          'daneben LF 6 Werteströme, LF 8 Personal, LF 9 Liquidität, LF 10 ' +
          'Wertschöpfung, LF 12 Veranstaltungen und Geschäftsreisen',
        art: 'vorgabe',
      },
      {
        kuerzel: 'Reisekostenrecht',
        titel: 'Verpflegungspauschalen, Fahrtkosten, Übernachtung',
        hinweis:
          'LF 12 organisiert Geschäftsreisen. Lohnsteuerrichtlinien und § 9 EStG — ' +
          'fehlte bisher ganz.',
        art: 'gesetz',
      },
      {
        kuerzel: 'Zahlungsverkehr und Mahnwesen',
        titel: 'SEPA, Lastschrift, Verzug, außergerichtliches Mahnverfahren',
        hinweis: 'LF 9 Liquidität sichern',
        art: 'nachschlagewerk',
      },
      {
        kuerzel: 'Prozessdarstellung',
        titel: 'Ereignisgesteuerte Prozesskette, BPMN, DIN 69901',
        hinweis: 'LF 11 Geschäftsprozesse darstellen und optimieren, LF 13 Projekt',
        art: 'norm',
      },
      {
        kuerzel: 'DIN 5008',
        titel: 'Schreib- und Gestaltungsregeln für die Textverarbeitung',
        hinweis: 'wird in der Prüfung tatsächlich abgefragt',
        art: 'norm',
      },
      {
        kuerzel: 'DIN 676',
        titel: 'Geschäftsbrief — Gestaltung',
        art: 'norm',
      },
      {
        kuerzel: 'UStG § 14',
        titel: 'Pflichtangaben einer Rechnung',
        hinweis: 'einschließlich E-Rechnung ab 2025',
        art: 'gesetz',
      },
      {
        kuerzel: 'GoBD',
        titel: 'Elektronische Buchführung und Belegablage',
        art: 'gesetz',
      },
      {
        kuerzel: 'ArbStättV',
        titel: 'Arbeitsstättenverordnung',
        hinweis: 'Bildschirmarbeitsplatz, Anhang Nr. 6',
        art: 'gesetz',
      },
      {
        kuerzel: 'BDSG § 26',
        titel: 'Beschäftigtendatenschutz',
        hinweis: 'Personalakte, Bewerbungsunterlagen',
        art: 'gesetz',
      },
      {
        kuerzel: 'UVgO / VgV',
        titel: 'Vergaberecht',
        hinweis: 'nur bei öffentlichen oder öffentlich finanzierten Trägern',
        art: 'gesetz',
      },
      {
        kuerzel: 'Projektmanagement',
        titel: 'Grundlagen nach DIN 69901 oder Lehrwerk',
        hinweis: 'Wahlqualifikation "Assistenz und Sekretariat" bzw. Projektorganisation',
        art: 'nachschlagewerk',
      },
      {
        kuerzel: 'Kaufmännische Steuerung',
        titel: 'Buchführung und Kostenrechnung im Lehrwerk',
        hinweis: 'Pflichtbereich der gestreckten Prüfung',
        art: 'nachschlagewerk',
      },
    ],
  },

  {
    id: 'ecommerce',
    kuerzel: 'KEC',
    name: 'Kaufleute im E-Commerce',
    pruefstelle: 'IHK',
    bemerkung:
      'Der Beruf mit dem schnellsten Rechtswandel. Mehrere Punkte hier sind erst ' +
      'wenige Jahre alt — bitte prüfen, was davon im Unterricht schon angekommen ist.',
    quellen: [
      {
        kuerzel: 'AO E-Commerce',
        titel: 'Verordnung über die Berufsausbildung zum Kaufmann im E-Commerce',
        hinweis: '2018, jüngster Beruf im Katalog',
        art: 'vorgabe',
      },
      {
        kuerzel: 'Rahmenlehrplan KEC',
        titel: 'Zwölf Lernfelder',
        hinweis:
          'Die größten Brocken sind LF 3 Verträge im Online-Vertrieb (120 Std.), ' +
          'LF 7 Online-Marketing (120 Std.) und LF 9 Online-Vertriebskanäle ' +
          '(100 Std.) — dort liegt das Gewicht, nicht beim Recht allein',
        art: 'vorgabe',
      },
      {
        kuerzel: 'Buchführung und KLR',
        titel: 'Werteströme erfassen und Wertschöpfung steuern',
        hinweis: 'LF 4 und LF 8 — der kaufmännische Unterbau, fehlte bisher',
        art: 'nachschlagewerk',
      },
      {
        kuerzel: 'Web-Analyse und Kennzahlen',
        titel: 'Conversion Rate, Warenkorbabbrüche, Retourenquote',
        hinweis:
          'LF 10 optimiert den Online-Vertrieb kennzahlengestützt — und stößt dabei ' +
          'unmittelbar auf die Einwilligungspflicht für Tracking',
        art: 'nachschlagewerk',
      },
      {
        kuerzel: 'ZAG und PSD2',
        titel: 'Zahlungsdiensteaufsichtsgesetz, starke Kundenauthentifizierung',
        hinweis: 'LF 3 — Zahlarten im Shop, Zahlungsausfall, Dienstleister',
        art: 'gesetz',
      },
      {
        kuerzel: 'UStG § 18j',
        titel: 'One-Stop-Shop beim Fernverkauf in der EU',
        hinweis: 'Lieferschwelle und Umsatzsteuer im grenzüberschreitenden Versand',
        art: 'gesetz',
      },
      {
        kuerzel: 'BGB §§ 312 ff.',
        titel: 'Verbraucherverträge und Fernabsatz',
        hinweis: 'Informationspflichten, Widerruf § 355, Button-Lösung § 312j',
        art: 'gesetz',
      },
      {
        kuerzel: 'EGBGB Art. 246a',
        titel: 'Informationspflichten bei Fernabsatzverträgen',
        hinweis: 'einschließlich Muster-Widerrufsbelehrung',
        art: 'gesetz',
      },
      {
        kuerzel: 'DDG',
        titel: 'Digitale-Dienste-Gesetz',
        hinweis: 'löste 2024 das TMG ab; § 5 Anbieterkennzeichnung',
        art: 'gesetz',
      },
      {
        kuerzel: 'TDDDG § 25',
        titel: 'Einwilligung für Cookies und Endgerätezugriff',
        art: 'gesetz',
      },
      {
        kuerzel: 'DSA',
        titel: 'EU-Verordnung über digitale Dienste 2022/2065',
        hinweis: 'Pflichten von Online-Marktplätzen',
        art: 'gesetz',
      },
      {
        kuerzel: 'P2B-VO',
        titel: 'EU-Verordnung 2019/1150 für Online-Vermittlungsdienste',
        hinweis: 'Verhältnis Händler zu Plattform',
        art: 'gesetz',
      },
      {
        kuerzel: 'PAngV',
        titel: 'Preisangabenverordnung',
        hinweis: 'Streichpreise und Rabattangaben seit 2022 verschärft',
        art: 'gesetz',
      },
      {
        kuerzel: 'UWG §§ 5, 5b, 7',
        titel: 'Irreführung, Bewertungen, E-Mail-Werbung',
        hinweis: 'Kaufbewertungen und Influencer-Kennzeichnung',
        art: 'gesetz',
      },
      {
        kuerzel: 'UrhG / MarkenG',
        titel: 'Produktbilder, Texte, Marken Dritter',
        art: 'gesetz',
      },
      {
        kuerzel: 'Geoblocking-VO',
        titel: 'EU-Verordnung 2018/302',
        art: 'gesetz',
      },
      {
        kuerzel: 'VerpackG / ElektroG / BattG',
        titel: 'Rücknahme- und Registrierungspflichten',
        hinweis: 'LUCID-Registrierung — praxisrelevant im Versandhandel',
        art: 'gesetz',
      },
      {
        kuerzel: 'VSBG',
        titel: 'Verbraucherstreitbeilegungsgesetz',
        hinweis: 'Hinweispflicht im Shop',
        art: 'gesetz',
      },
      {
        kuerzel: 'EuGH Planet49',
        titel: 'Cookie-Einwilligung, C-673/17',
        hinweis: 'Grundsatzentscheidung: kein vorangekreuztes Kästchen',
        art: 'rechtsprechung',
      },
      {
        kuerzel: 'Bevh',
        titel: 'Bundesverband E-Commerce und Versandhandel',
        hinweis: 'Marktzahlen',
        art: 'daten',
      },
    ],
  },

  {
    id: 'gesundheit',
    kuerzel: 'KIG',
    name: 'Kaufleute im Gesundheitswesen',
    pruefstelle: 'IHK',
    bemerkung:
      'Korrigiert nach dem Rahmenlehrplan: Der Beruf ist deutlich kaufmännischer, als ' +
      'die Sozialgesetzbücher vermuten lassen. Die elf Lernfelder verteilen sich auf ' +
      'drei Fächer — Dienstleistungsprozesse (LF 1, 2, 5, 10), Gesundheitsmanagement ' +
      '(LF 4, 6, 11) und Steuerungs- und Abrechnungsprozesse (LF 3, 7, 8, 9). Darin ' +
      'stecken Buchführung und Kostenrechnung, Beschaffung und Lager, Marketing, ' +
      'Vertragsanbahnung, Personalwirtschaft, Investition und Finanzierung sowie ' +
      'Controlling. Das Sozialrecht ergänzt die kaufmännische Grundlage, es ersetzt ' +
      'sie nicht. Ambulante, stationäre und teilstationäre Einrichtungen kommen ' +
      'ausdrücklich alle vor.',
    quellen: [
      {
        kuerzel: 'AO Gesundheitswesen',
        titel: 'Verordnung über die Berufsausbildung zum Kaufmann im Gesundheitswesen',
        art: 'vorgabe',
      },
      {
        kuerzel: 'Rahmenlehrplan KIG',
        titel: 'Elf Lernfelder in drei Fächern',
        hinweis:
          'Dienstleistungsprozesse, Gesundheitsmanagement, Steuerungs- und ' +
          'Abrechnungsprozesse — die Gliederung, an der sich alles Weitere ausrichtet',
        art: 'vorgabe',
      },
      {
        kuerzel: 'Rechtsformen und Träger',
        titel: 'Einrichtungen und Träger des Gesundheitswesens',
        hinweis:
          'LF 1 verlangt, den eigenen Betrieb in das Netz der sozialen Sicherung ' +
          'einzuordnen: öffentlich, freigemeinnützig, privat — und die zugehörigen ' +
          'Rechtsformen',
        art: 'nachschlagewerk',
      },
      {
        kuerzel: 'Buchführung und KLR',
        titel: 'Rechnungswesen im Dienstleistungsbetrieb',
        hinweis:
          'LF 3 und LF 9: Buchführung, Kostenrechnung, Deckungsbeitrag, Budgetierung. ' +
          'Nach welchem Lehrwerk wird gerechnet?',
        art: 'nachschlagewerk',
      },
      {
        kuerzel: 'Investition und Finanzierung',
        titel: 'Finanzierungsformen im Gesundheitsbetrieb',
        hinweis: 'LF 11 — im Kontext der dualen Krankenhausfinanzierung',
        art: 'nachschlagewerk',
      },
      {
        kuerzel: 'Qualitätsmanagement',
        titel: 'QM-Richtlinie des G-BA, DIN EN ISO 9001, KTQ',
        hinweis: 'LF 9 nennt Qualitätsmanagement ausdrücklich',
        art: 'norm',
      },
      {
        kuerzel: 'SGB V',
        titel: 'Gesetzliche Krankenversicherung',
        hinweis: 'Leistungsansprüche, Zuzahlung, Wirtschaftlichkeitsgebot § 12',
        art: 'gesetz',
      },
      {
        kuerzel: 'SGB XI',
        titel: 'Soziale Pflegeversicherung',
        hinweis: 'Pflegegrade, Leistungen',
        art: 'gesetz',
      },
      {
        kuerzel: 'SGB IX',
        titel: 'Rehabilitation und Teilhabe',
        art: 'gesetz',
      },
      {
        kuerzel: 'SGB VII',
        titel: 'Gesetzliche Unfallversicherung',
        hinweis: 'Arbeitsunfall, Berufskrankheit, Durchgangsarzt',
        art: 'gesetz',
      },
      {
        kuerzel: 'KHG / KHEntgG',
        titel: 'Krankenhausfinanzierung und Entgelte',
        hinweis: 'duale Finanzierung, Budgetverhandlung',
        art: 'gesetz',
      },
      {
        kuerzel: 'DRG-Katalog',
        titel: 'Fallpauschalenkatalog des InEK',
        hinweis: 'Grundlage der Krankenhausabrechnung',
        art: 'norm',
      },
      {
        kuerzel: 'ICD-10-GM / OPS',
        titel: 'Klassifikationen des BfArM',
        hinweis: 'Diagnosen und Prozeduren — Voraussetzung jeder Kodierung',
        art: 'norm',
      },
      {
        kuerzel: 'EBM / GOÄ',
        titel: 'Vergütung ambulanter Leistungen',
        hinweis: 'EBM für gesetzlich, GOÄ für privat Versicherte',
        art: 'norm',
      },
      {
        kuerzel: 'BGB §§ 630a ff.',
        titel: 'Behandlungsvertrag',
        hinweis: 'Patientenrechtegesetz — Aufklärung, Dokumentation, Einsichtsrecht',
        art: 'gesetz',
      },
      {
        kuerzel: 'StGB § 203',
        titel: 'Verletzung von Privatgeheimnissen',
        hinweis: 'ärztliche Schweigepflicht',
        art: 'gesetz',
      },
      {
        kuerzel: 'DSGVO Art. 9',
        titel: 'Gesundheitsdaten als besondere Kategorie',
        art: 'gesetz',
      },
      {
        kuerzel: 'IfSG',
        titel: 'Infektionsschutzgesetz',
        hinweis:
          'Melde- und Belehrungspflichten; LF 5 nennt Hygiene- und Umweltvorschriften ' +
          'im Beschaffungs- und Lagerbereich ausdrücklich',
        art: 'gesetz',
      },
      {
        kuerzel: 'MedHygVO NRW',
        titel: 'Verordnung über die Hygiene in medizinischen Einrichtungen',
        hinweis: 'Landesrecht NRW — LF 5',
        art: 'gesetz',
      },
      {
        kuerzel: 'HWG',
        titel: 'Heilmittelwerbegesetz',
        art: 'gesetz',
      },
      {
        kuerzel: 'AMG / MPDG / ApoG',
        titel: 'Arzneimittel, Medizinprodukte, Apotheken',
        hinweis: 'je nach Einrichtungsart unterschiedlich wichtig',
        art: 'gesetz',
      },
      {
        kuerzel: 'G-BA',
        titel: 'Richtlinien des Gemeinsamen Bundesausschusses',
        hinweis: 'bestimmen, was die GKV bezahlt',
        art: 'nachschlagewerk',
      },
      {
        kuerzel: 'GKV-Spitzenverband',
        titel: 'Kennzahlen und Vereinbarungen',
        art: 'daten',
      },
      {
        kuerzel: 'BSG',
        titel: 'Bundessozialgericht',
        hinweis: 'Leistungs- und Abrechnungsstreitigkeiten',
        art: 'rechtsprechung',
      },
    ],
  },

  {
    id: 'personaldienstleistung',
    kuerzel: 'PDK',
    name: 'Personaldienstleistungskaufleute',
    pruefstelle: 'IHK',
    quellen: [
      {
        kuerzel: 'AO Personaldienstleistung',
        titel: 'Verordnung über die Berufsausbildung zum Personaldienstleistungskaufmann',
        art: 'vorgabe',
      },
      {
        kuerzel: 'Rahmenlehrplan PDK',
        titel: 'Zwölf Lernfelder, 880 Stunden',
        hinweis:
          'Drei Lernfelder zu je 100 Stunden tragen den Beruf: LF 3 ' +
          'Personalsachbearbeitung, LF 4 Personal gewinnen, LF 9 Aufträge ' +
          'akquirieren und bearbeiten',
        art: 'vorgabe',
      },
      {
        kuerzel: 'Entgeltabrechnung',
        titel: 'Lohnsteuer, Sozialversicherung, DEÜV-Meldeverfahren, Lohnpfändung',
        hinweis:
          'LF 3 Personalsachbearbeitung ist mit 100 Stunden das größte Lernfeld — ' +
          'und stand bisher gar nicht in der Liste',
        art: 'nachschlagewerk',
      },
      {
        kuerzel: 'Abgrenzung der Vertragsarten',
        titel: 'Arbeitnehmerüberlassung, Werkvertrag, Dienstvertrag, Scheinselbstständigkeit',
        hinweis:
          'LF 9 akquiriert Aufträge; § 7a SGB IV Statusfeststellung. Die Abgrenzung ' +
          'ist die Kernfrage des Geschäftsmodells.',
        art: 'gesetz',
      },
      {
        kuerzel: 'Kalkulation von Überlassungssätzen',
        titel: 'Stundenverrechnungssatz, Deckungsbeitrag, Auslastung',
        hinweis: 'LF 8 und LF 9 — der kaufmännische Teil, fehlte bisher',
        art: 'nachschlagewerk',
      },
      {
        kuerzel: 'AÜG',
        titel: 'Arbeitnehmerüberlassungsgesetz',
        hinweis: 'Erlaubnis, Überlassungshöchstdauer, Equal Pay, Kennzeichnungspflicht',
        art: 'gesetz',
      },
      {
        kuerzel: 'Tarifwerk Zeitarbeit',
        titel: 'BAP/iGZ-DGB-Tarifverträge',
        hinweis: 'Entgeltgruppen, Branchenzuschläge — die praktische Arbeitsgrundlage',
        art: 'norm',
      },
      {
        kuerzel: 'AEntG',
        titel: 'Arbeitnehmer-Entsendegesetz',
        hinweis: 'Lohnuntergrenze in der Arbeitnehmerüberlassung',
        art: 'gesetz',
      },
      {
        kuerzel: 'TzBfG',
        titel: 'Teilzeit- und Befristungsgesetz',
        hinweis: 'im Kerngeschäft wichtiger als bei den übrigen Berufen',
        art: 'gesetz',
      },
      {
        kuerzel: 'SGB III',
        titel: 'Arbeitsförderung',
        hinweis: 'Vermittlung, Eingliederungszuschuss, Arbeitslosengeld',
        art: 'gesetz',
      },
      {
        kuerzel: 'SGB IV',
        titel: 'Gemeinsame Vorschriften der Sozialversicherung',
        hinweis: 'Meldeverfahren, geringfügige Beschäftigung, Statusfeststellung',
        art: 'gesetz',
      },
      {
        kuerzel: 'SchwarzArbG',
        titel: 'Schwarzarbeitsbekämpfungsgesetz',
        hinweis: 'Mitführungspflichten, Prüfungen des Zolls',
        art: 'gesetz',
      },
      {
        kuerzel: 'BDSG § 26',
        titel: 'Beschäftigtendatenschutz im Bewerbungsverfahren',
        hinweis: 'zulässige Fragen, Aufbewahrung von Bewerbungsunterlagen',
        art: 'gesetz',
      },
      {
        kuerzel: 'BetrVG § 14',
        titel: 'Wahlrecht überlassener Arbeitnehmer',
        hinweis: 'Zuordnung zu Verleiher und Entleiher',
        art: 'gesetz',
      },
      {
        kuerzel: 'BAG zur Zeitarbeit',
        titel: 'Equal Pay und Überlassungshöchstdauer',
        hinweis:
          'die Rechtsprechung entwickelt sich hier laufend weiter. Welche ' +
          'Entscheidungen sind im Unterricht Thema?',
        art: 'rechtsprechung',
      },
      {
        kuerzel: 'BA-Statistik',
        titel: 'Bundesagentur für Arbeit',
        hinweis: 'Arbeitsmarkt- und Zeitarbeitszahlen',
        art: 'daten',
      },
    ],
  },

  {
    id: 'steuerfach',
    kuerzel: 'SFA',
    name: 'Steuerfachangestellte',
    pruefstelle: 'Steuerberaterkammer',
    bemerkung:
      'Prüft NICHT die IHK, sondern die Steuerberaterkammer. Prüfungsordnung, ' +
      'Aufgabenstil und Termine unterscheiden sich. Außerdem der einzige Beruf, ' +
      'bei dem Rechtsprechung und Verwaltungsanweisungen zum täglichen ' +
      'Handwerkszeug gehören.',
    quellen: [
      {
        kuerzel: 'AO Steuerfachangestellte',
        titel: 'Verordnung über die Berufsausbildung zum Steuerfachangestellten',
        art: 'vorgabe',
      },
      {
        kuerzel: 'Rahmenlehrplan SFA 2022',
        titel: 'Zwölf Lernfelder, KMK-Beschluss vom 10.06.2022',
        hinweis:
          'Neu gefasst — LF 2 Buchführung, LF 3 Umsatzsteuer, LF 5 ' +
          'Arbeitnehmerentgelte, LF 6 grenzüberschreitende Umsatzsteuer, LF 7 ' +
          'Anlagevermögen, LF 8 Gewinn- und Überschusseinkünfte, LF 9 KSt und ' +
          'GewSt, LF 10 Jahresabschlüsse, LF 11 Verwaltungsakte und Rechtsbehelfe, ' +
          'LF 12 Mandantenberatung',
        art: 'vorgabe',
      },
      {
        kuerzel: 'Lohn- und Gehaltsabrechnung',
        titel: 'Lohnsteuerrichtlinien, Sozialversicherung, DEÜV',
        hinweis:
          'LF 5 berechnet und erfasst Arbeitnehmerentgelte — in der Kanzleipraxis ' +
          'ein eigenes Arbeitsgebiet. Fehlte bisher.',
        art: 'nachschlagewerk',
      },
      {
        kuerzel: 'AO',
        titel: 'Abgabenordnung',
        hinweis: 'Fristen, Einspruch, Festsetzungsverjährung — Kernstoff',
        art: 'gesetz',
      },
      {
        kuerzel: 'EStG mit EStDV, EStR, EStH',
        titel: 'Einkommensteuer samt Durchführungsverordnung und Richtlinien',
        hinweis: 'die Richtlinien werden in der Prüfung tatsächlich benutzt',
        art: 'gesetz',
      },
      {
        kuerzel: 'UStG mit UStDV, UStAE',
        titel: 'Umsatzsteuer samt Anwendungserlass',
        art: 'gesetz',
      },
      {
        kuerzel: 'KStG / GewStG',
        titel: 'Körperschaft- und Gewerbesteuer',
        art: 'gesetz',
      },
      {
        kuerzel: 'ErbStG / BewG',
        titel: 'Erbschaftsteuer und Bewertungsgesetz',
        art: 'gesetz',
      },
      {
        kuerzel: 'GrEStG / GrStG',
        titel: 'Grunderwerb- und Grundsteuer',
        art: 'gesetz',
      },
      {
        kuerzel: 'StBerG / BOStB / StBVV',
        titel: 'Berufsrecht der Steuerberater',
        hinweis: 'Befugnisse, Verschwiegenheit, Gebührenverordnung',
        art: 'gesetz',
      },
      {
        kuerzel: 'HGB §§ 238 ff.',
        titel: 'Handelsbilanz als Grundlage der Steuerbilanz',
        hinweis: 'Maßgeblichkeitsgrundsatz § 5 EStG',
        art: 'gesetz',
      },
      {
        kuerzel: 'FGO',
        titel: 'Finanzgerichtsordnung',
        art: 'gesetz',
      },
      {
        kuerzel: 'BMF-Schreiben',
        titel: 'Verwaltungsanweisungen des Bundesfinanzministeriums',
        hinweis: 'binden die Finanzverwaltung — in der Praxis oft entscheidend',
        art: 'nachschlagewerk',
      },
      {
        kuerzel: 'BFH',
        titel: 'Bundesfinanzhof',
        hinweis:
          'ständige Rechtsprechung ist hier Arbeitsmaterial, nicht Beiwerk. ' +
          'Welche Entscheidungen gehören zum Pflichtstoff?',
        art: 'rechtsprechung',
      },
      {
        kuerzel: 'Schmidt, EStG',
        titel: 'Kommentar zum Einkommensteuergesetz',
        hinweis: 'das Standardwerk der Praxis',
        art: 'nachschlagewerk',
      },
      {
        kuerzel: 'DATEV',
        titel: 'Dokumentation und Hilfen zur Kanzleisoftware',
        hinweis: 'in fast jeder Kanzlei die tägliche Umgebung',
        art: 'nachschlagewerk',
      },
      {
        kuerzel: 'DWS / Steuerberaterkammer',
        titel: 'Prüfungsmaterial der Kammer',
        hinweis: 'ersetzt hier die AkA-Kataloge',
        art: 'vorgabe',
      },
    ],
  },

  {
    id: 'spedition',
    kuerzel: 'SL',
    name: 'Kaufleute für Spedition und Logistikdienstleistungen',
    pruefstelle: 'IHK',
    quellen: [
      {
        kuerzel: 'AO Spedition',
        titel: 'Verordnung über die Berufsausbildung zum Kaufmann für Spedition und Logistikdienstleistung',
        art: 'vorgabe',
      },
      {
        kuerzel: 'Rahmenlehrplan SL',
        titel: 'Fünfzehn Lernfelder, 880 Stunden',
        hinweis:
          'Der Beruf mit den meisten Lernfeldern: LF 4 bis 6 nach Verkehrsträgern, ' +
          'LF 9 Lagerleistungen, LF 10 und 11 Export und Import, LF 12 und 13 ' +
          'Beschaffungs- und Distributionslogistik, LF 14 Marketing, LF 15 ' +
          'wirtschaftliche Rahmenbedingungen',
        art: 'vorgabe',
      },
      {
        kuerzel: 'Speditionelle Kalkulation',
        titel: 'Kostenrechnung, Sendungskalkulation, Deckungsbeitrag',
        hinweis: 'LF 7 Geschäftsprozesse erfolgsorientiert steuern — fehlte bisher',
        art: 'nachschlagewerk',
      },
      {
        kuerzel: 'Verkehrsgeografie',
        titel: 'Verkehrswege, Häfen, Flughäfen, Relationen',
        hinweis:
          'klassisches Speditionsfach; LF 4 bis 6 vergleichen die Verkehrsträger. ' +
          'Fehlte bisher.',
        art: 'nachschlagewerk',
      },
      {
        kuerzel: 'BFStrMG',
        titel: 'Bundesfernstraßenmautgesetz',
        hinweis: 'Maut als Kostenfaktor der Frachtkalkulation',
        art: 'gesetz',
      },
      {
        kuerzel: 'Marketing im Logistikbetrieb',
        titel: 'Angebot, Kundenbindung, Ausschreibungen',
        hinweis: 'LF 14 Marketingmaßnahmen entwickeln und durchführen',
        art: 'nachschlagewerk',
      },
      {
        kuerzel: 'HGB §§ 407–475h',
        titel: 'Fracht-, Speditions- und Lagergeschäft',
        hinweis: 'Haftung, Frachtbrief, Ablieferung — das Kernkapitel',
        art: 'gesetz',
      },
      {
        kuerzel: 'ADSp 2017',
        titel: 'Allgemeine Deutsche Spediteurbedingungen',
        hinweis: 'kein Gesetz, sondern AGB — gelten nur bei Einbeziehung',
        art: 'norm',
      },
      {
        kuerzel: 'CMR',
        titel: 'Internationaler Straßengüterverkehr',
        hinweis: 'Haftungshöchstbetrag, Frachtbrief, Reklamationsfristen',
        art: 'gesetz',
      },
      {
        kuerzel: 'CIM / COTIF',
        titel: 'Internationaler Eisenbahnverkehr',
        art: 'gesetz',
      },
      {
        kuerzel: 'Montrealer Übereinkommen',
        titel: 'Luftfrachtbeförderung',
        art: 'gesetz',
      },
      {
        kuerzel: 'Seefracht',
        titel: 'Konnossement, Haager und Hamburger Regeln',
        hinweis: 'in Deutschland über das HGB-Seehandelsrecht umgesetzt',
        art: 'gesetz',
      },
      {
        kuerzel: 'GüKG',
        titel: 'Güterkraftverkehrsgesetz',
        hinweis: 'Erlaubnis, Kabotage, Kontrolle durch das BALM',
        art: 'gesetz',
      },
      {
        kuerzel: 'VO (EG) 561/2006',
        titel: 'Lenk- und Ruhezeiten',
        hinweis: 'mit FPersG und FPersV — Prüfungsstoff',
        art: 'gesetz',
      },
      {
        kuerzel: 'GGVSEB / ADR',
        titel: 'Gefahrgutrecht',
        hinweis: 'Beförderungspapier, Kennzeichnung, Gefahrgutbeauftragter',
        art: 'gesetz',
      },
      {
        kuerzel: 'IMDG / IATA-DGR',
        titel: 'Gefahrgut auf See und in der Luft',
        art: 'norm',
      },
      {
        kuerzel: 'UZK',
        titel: 'Unionszollkodex',
        hinweis: 'Versandverfahren, Zolllager, AEO-Status',
        art: 'gesetz',
      },
      {
        kuerzel: 'Incoterms 2020',
        titel: 'Lieferklauseln der Internationalen Handelskammer',
        art: 'norm',
      },
      {
        kuerzel: 'VVG / Transportversicherung',
        titel: 'Versicherungsvertragsgesetz und DTV-Güterversicherung',
        art: 'gesetz',
      },
      {
        kuerzel: 'StVO § 22 / VDI 2700',
        titel: 'Ladungssicherung',
        art: 'gesetz',
      },
      {
        kuerzel: 'DSLV',
        titel: 'Bundesverband Spedition und Logistik',
        hinweis: 'Merkblätter, Branchenzahlen',
        art: 'daten',
      },
    ],
  },
];
