import { describe, expect, it } from 'vitest';
import {
  AUFGABEN,
  BERUFE,
  berufBeschriftung,
  FORMATE,
  niveauBeschriftung,
  NIVEAUS,
  OPTIONEN,
} from './catalogs';
import {
  alleQuellen,
  buildPrompt,
  MAX_FUNDSTELLE_ZEICHEN,
  validate,
  zweispracheRegeln,
} from './prompt';
import {
  auswahlVon,
  defaultSettings,
  normalizeSettings,
  standardAuswahl,
  toPromptInput,
  weichtVomStandardAb,
} from './settings';
import {
  BASISSPRACHE,
  findSprache,
  hatRtlSprachen,
  KERNSPRACHEN,
  spracheBeschriftung,
  SPRACHEN,
  zweitsprachen,
} from './sprachen';
import type { PromptInput } from './types';

function basis(overrides: Partial<PromptInput> = {}): PromptInput {
  return {
    ...toPromptInput(defaultSettings(), { thema: 'Kaufvertrag', zusatz: '' }),
    beruf: 'immobilien',
    ...overrides,
  };
}

/** Prüft, ob ein Abschnitt als eigene Überschrift im Prompt steht. */
function hatAbschnitt(prompt: string, titel: string): boolean {
  return prompt.startsWith(`${titel}\n`) || prompt.includes(`\n\n${titel}\n`);
}

describe('Kataloge', () => {
  it('enthaelt genau die vom Bildungstraeger vorgegebenen Berufe', () => {
    // Kaufmaennische Grundqualifikation voran, alle uebrigen nach Kuerzel.
    expect(BERUFE.map((b) => b.id)).toEqual([
      'kgq', // KGQ
      'einzelhandel', // EHK
      'fachinformatik', // FISI
      'lagerlogistik', // FKL
      'schutzsicherheit', // FKS
      'grosshandel', // GAM
      'industrie', // IK
      'immobilien', // IMK
      'bueromanagement', // KBM
      'ecommerce', // KEC
      'gesundheit', // KIG
      'personaldienstleistung', // PDK
      'steuerfach', // SFA
      'spedition', // SL
    ]);
  });

  it('ist ab dem zweiten Eintrag alphabetisch nach Kuerzel sortiert', () => {
    const ohneGrundqualifikation = BERUFE.slice(1).map((b) => b.kuerzel);
    // Ohne Beachtung der Gross- und Kleinschreibung: Ein Kuerzel mit
    // Kleinbuchstaben (frueher "KiG") stuende sonst hinter allen anderen.
    const sortiert = [...ohneGrundqualifikation].sort((a, b) =>
      a.localeCompare(b, 'de', { sensitivity: 'base' }),
    );
    expect(ohneGrundqualifikation).toEqual(sortiert);
  });

  it('fuehrt zu jedem Beruf ein eindeutiges Kuerzel', () => {
    const kuerzel = BERUFE.map((b) => b.kuerzel);
    expect(new Set(kuerzel).size).toBe(kuerzel.length);
    for (const b of BERUFE) {
      expect(b.kuerzel.trim(), `${b.id} ohne Kuerzel`).not.toBe('');
    }
    // Vorgabe des Bildungstraegers.
    expect(kuerzel).toEqual([
      'KGQ', 'EHK', 'FISI', 'FKL', 'FKS', 'GAM', 'IK',
      'IMK', 'KBM', 'KEC', 'KIG', 'PDK', 'SFA', 'SL',
    ]);
  });

  it('stellt in der Auswahlliste das Kuerzel voran', () => {
    const immo = BERUFE.find((b) => b.id === 'immobilien')!;
    expect(berufBeschriftung(immo)).toBe('IMK — Immobilienkaufleute');
  });

  it('haelt das Kuerzel aus dem Prompt heraus', () => {
    // Fuer ein Sprachmodell waere "IMK" nur ein Raetsel.
    const prompt = buildPrompt(basis({ beruf: 'immobilien' }));
    expect(prompt).not.toContain('IMK');
    expect(prompt).toContain('Immobilienkaufmann/-frau');
  });

  it('fuehrt zu jedem Beruf ausser der Grundqualifikation eine Einzahlform', () => {
    for (const beruf of BERUFE.filter((b) => b.id !== 'kgq')) {
      expect(beruf.singular, `${beruf.id} hat keine Einzahlform`).toBeTruthy();
      // Der Plural taugt nicht fuer "Umschulung zum/zur ...".
      expect(beruf.singular).not.toBe(beruf.label);
    }
  });

  it('haben durchgehend Beschriftungen und eindeutige Bezeichner', () => {
    for (const liste of [BERUFE, AUFGABEN, NIVEAUS, FORMATE, OPTIONEN]) {
      expect(liste.length).toBeGreaterThan(0);
      const ids = liste.map((e) => e.id);
      expect(new Set(ids).size).toBe(ids.length);
      for (const eintrag of liste) {
        expect(eintrag.label.trim()).not.toBe('');
      }
    }
  });

  it('liefern für jede Aufgabe einen Auftragstext ohne Formatierungsreste', () => {
    for (const aufgabe of AUFGABEN) {
      const text = aufgabe.instruction({ anzahl: 5 });
      expect(text.trim()).not.toBe('');
      expect(text).not.toContain('undefined');
      expect(text).not.toContain('NaN');
    }
  });

  it('werten die Anzahl nur bei den dafür vorgesehenen Aufgaben aus', () => {
    const mitAnzahl = AUFGABEN.filter((a) => a.needsCount);
    expect(mitAnzahl.length).toBeGreaterThan(0);
    for (const aufgabe of mitAnzahl) {
      expect(aufgabe.instruction({ anzahl: 12 })).toContain('12');
    }
    for (const aufgabe of AUFGABEN.filter((a) => !a.needsCount)) {
      expect(aufgabe.instruction({ anzahl: 12 })).not.toContain('12');
    }
  });

  it('bilden Einzahl und Mehrzahl korrekt', () => {
    const mc = AUFGABEN.find((a) => a.id === 'multiple-choice')!;
    expect(mc.instruction({ anzahl: 1 })).toContain('1 Multiple-Choice-Frage ');
    expect(mc.instruction({ anzahl: 4 })).toContain('4 Multiple-Choice-Fragen');
  });
});

describe('Validierung', () => {
  it('verlangt ein Thema', () => {
    const ergebnis = validate(basis({ thema: '   ' }));
    expect(ergebnis.ok).toBe(false);
    expect(ergebnis.feld).toBe('thema');
  });

  it('verlangt bei der Lösungskontrolle die eigene Lösung', () => {
    const ohne = validate(basis({ aufgabe: 'loesung-pruefen' }));
    expect(ohne.ok).toBe(false);
    expect(ohne.feld).toBe('zusatz');

    const mit = validate(basis({ aufgabe: 'loesung-pruefen', zusatz: 'Meine Antwort ...' }));
    expect(mit.ok).toBe(true);
    expect(mit.meldung).toBe('');
  });
});

describe('Prompt-Aufbau', () => {
  it('enthält alle Pflichtabschnitte', () => {
    const prompt = buildPrompt(basis({ zusatz: 'Ich bin im zweiten Lernjahr.' }));
    for (const titel of [
      'ROLLE',
      'AUFGABE',
      'THEMA',
      'ZUSÄTZLICHE ANGABEN',
      'ANFORDERUNGEN',
      'QUELLEN',
      'QUALITÄTSREGELN',
      'AUSGABE',
    ]) {
      expect(hatAbschnitt(prompt, titel), `Abschnitt ${titel} fehlt`).toBe(true);
    }
  });

  it('lässt leere Abschnitte weg', () => {
    const prompt = buildPrompt(basis({ zusatz: '   ' }));
    expect(hatAbschnitt(prompt, 'ZUSÄTZLICHE ANGABEN')).toBe(false);
    expect(hatAbschnitt(prompt, 'BELEGSTELLEN AUS MEINEN UNTERLAGEN')).toBe(false);
  });

  it('erzeugt keine Wagenrückläufe', () => {
    expect(buildPrompt(basis())).not.toContain('\r');
  });

  it('setzt die Einzahlform in den Satz, nicht den angezeigten Plural', () => {
    const prompt = buildPrompt(basis());
    expect(prompt).toContain('Umschulung zum/zur Immobilienkaufmann/-frau');
    // "Umschulung zum/zur Immobilienkaufleute" waere falsches Deutsch.
    expect(prompt).not.toContain('zum/zur Immobilienkaufleute');
  });

  it('formuliert die Grundqualifikation als eigenen Fall', () => {
    const kgq = buildPrompt(basis({ beruf: 'kgq' }));
    expect(kgq).not.toContain('zum/zur');
    expect(kgq).toContain('kaufmännischen Grundqualifikation');
  });

  it('nennt die zustaendige Pruefungsstelle', () => {
    // Der Regelfall ist die IHK.
    expect(buildPrompt(basis({ beruf: 'industrie' }))).toContain('vor der IHK');

    // Steuerfachangestellte pruefft die Steuerberaterkammer.
    const sfa = buildPrompt(basis({ beruf: 'steuerfach' }));
    expect(sfa).toContain('Steuerberaterkammer');
    expect(sfa).not.toContain('der IHK');
  });

  it('spricht nicht pauschal von kaufmaennischer Ausbildung', () => {
    // Fachinformatik, Schutz und Sicherheit sowie Lagerlogistik sind keine
    // kaufmaennischen Berufe.
    for (const beruf of ['fachinformatik', 'schutzsicherheit', 'lagerlogistik'] as const) {
      const prompt = buildPrompt(basis({ beruf, aufgabe: 'erklaeren' }));
      expect(prompt, beruf).not.toContain('kaufmännische');
    }
  });

  it('hält mehrzeilige Themen lesbar', () => {
    const prompt = buildPrompt(
      basis({ thema: 'Zeile eins\r\n\r\n\r\nZeile zwei   \r\n' }),
    );
    expect(prompt).toContain('Zeile eins\n\nZeile zwei');
    expect(prompt).not.toContain('\\n');
  });

  it('gibt die Qualitätsregeln unabhängig von den Optionen aus', () => {
    const prompt = buildPrompt(basis({ optionen: [] }));
    expect(prompt).toContain('Erfinde keine Quellen');
    expect(prompt).toContain('Stelle keine Rückfragen');
  });

  it('berücksichtigt aktivierte und ignoriert abgewählte Optionen', () => {
    const beispiel = OPTIONEN.find((o) => o.id === 'praxisbeispiel')!;
    const einfach = OPTIONEN.find((o) => o.id === 'einfache-sprache')!;
    const prompt = buildPrompt(basis({ optionen: ['praxisbeispiel'] }));
    expect(prompt).toContain(beispiel.rule);
    expect(prompt).not.toContain(einfach.rule);
  });

  it('kehrt die Rückfragen-Regel bei aktivierter Option um', () => {
    const prompt = buildPrompt(basis({ optionen: ['rueckfragen'] }));
    expect(prompt).toContain('höchstens drei gezielte Rückfragen');
    expect(prompt).not.toContain('Stelle keine Rückfragen');
  });
});

describe('Quellen im Prompt', () => {
  it('führt die ausgewählten Katalogquellen mit Erläuterung auf', () => {
    const prompt = buildPrompt(basis({ quellen: ['bgb', 'weg'], quellenFreitext: '' }));
    expect(prompt).toContain('BGB (Bürgerliches Gesetzbuch)');
    expect(prompt).toContain('WEG (Wohnungseigentumsgesetz)');
  });

  it('gliedert die Quellen nach Art, eigene Angaben zuletzt', () => {
    // Bei dreißig und mehr Quellen wäre eine einzige Zeile unlesbar.
    const prompt = buildPrompt(
      basis({
        beruf: 'immobilien',
        quellen: ['gabler', 'weg', 'ao-immobilienkaufleute', 'bgb'],
        quellenFreitext: 'Beck-online',
      }),
    );
    const zeilen = prompt.split('\n').filter((zeile) => zeile.startsWith('  - '));
    expect(zeilen.map((zeile) => zeile.split(':')[0])).toEqual([
      '  - Prüfungs- und Ausbildungsvorgaben',
      '  - Gesetze und Verordnungen',
      '  - Nachschlagewerke',
      '  - Weitere Quellen',
    ]);
    // Innerhalb einer Art gilt die Reihenfolge der Auswahl.
    expect(zeilen[1]).toBe(
      '  - Gesetze und Verordnungen: WEG (Wohnungseigentumsgesetz); BGB (Bürgerliches Gesetzbuch).',
    );
    expect(zeilen[3]).toBe('  - Weitere Quellen: Beck-online.');
    expect(prompt).toContain('Ziehe nur die Quellen heran, die zur Frage passen.');
  });

  it('ergänzt Freitextquellen und entfernt Dubletten', () => {
    const quellen = alleQuellen(
      basis({ quellen: ['haufe'], quellenFreitext: 'Beck-online; haufe' }),
    );
    expect(quellen).toContain('Haufe (Haufe Fachdatenbank)');
    expect(quellen).toContain('Beck-online');
    // Das getippte "haufe" meint dieselbe Quelle wie das angekreuzte Kürzel.
    expect(quellen.filter((q) => q.toLowerCase().startsWith('haufe'))).toHaveLength(1);
  });

  it('übernimmt Fachbuchzitate mit Komma als eine Quelle', () => {
    const prompt = buildPrompt(
      basis({ quellen: [], quellenFreitext: 'Schmidt/Futterer, Mietrecht' }),
    );
    expect(prompt).toContain('Schmidt/Futterer, Mietrecht.');
    expect(prompt).not.toContain('Schmidt/Futterer; Mietrecht');
  });

  it('lässt den Quellenabschnitt weg, wenn nichts ausgewählt ist', () => {
    const prompt = buildPrompt(basis({ quellen: [], quellenFreitext: '' }));
    expect(hatAbschnitt(prompt, 'QUELLEN')).toBe(false);
  });

  it('verwirft Quellen, die zum gewählten Beruf nicht passen', () => {
    // WEG gilt nur für Immobilienkaufleute, UrhG nur in der Systemintegration.
    const prompt = buildPrompt(basis({ beruf: 'fachinformatik', quellen: ['weg', 'urhg'] }));
    expect(prompt).not.toContain('Wohnungseigentumsgesetz');
    expect(prompt).toContain('UrhG (Urheberrechtsgesetz)');
  });
});

describe('Belegstellen aus eigenen Unterlagen', () => {
  const fundstellen = [
    { dokument: 'Skript Rechnungswesen.pdf', stelle: 'Seite 12', text: 'Der Deckungsbeitrag ist ...' },
    { dokument: 'Mitschrift.md', text: 'Skonto wird gewährt, wenn ...' },
  ];

  it('fügt einen eigenen Abschnitt mit nummerierten Ausschnitten ein', () => {
    const prompt = buildPrompt(basis({ fundstellen }));
    expect(hatAbschnitt(prompt, 'BELEGSTELLEN AUS MEINEN UNTERLAGEN')).toBe(true);
    expect(prompt).toContain('[1] Skript Rechnungswesen.pdf, Seite 12');
    expect(prompt).toContain('[2] Mitschrift.md');
    expect(prompt).toContain('Der Deckungsbeitrag ist ...');
  });

  it('weist die KI an, sich vorrangig darauf zu stützen', () => {
    const prompt = buildPrompt(basis({ fundstellen }));
    expect(prompt).toContain('Stütze dich vorrangig auf die oben angeführten Belegstellen');
    expect(prompt).toContain('sage das ausdrücklich');
  });

  it('begrenzt überlange Ausschnitte', () => {
    const prompt = buildPrompt(
      basis({
        fundstellen: [{ dokument: 'Riesig.pdf', text: 'Wort '.repeat(2000) }],
      }),
    );
    expect(prompt).toContain('[…]');
    expect(prompt.length).toBeLessThan(MAX_FUNDSTELLE_ZEICHEN + 4000);
  });
});

describe('Sprachkatalog', () => {
  it('führt Deutsch als Grundsprache an erster Stelle', () => {
    expect(SPRACHEN[0].id).toBe(BASISSPRACHE);
    expect(BASISSPRACHE).toBe('de');
  });

  it('bietet Deutsch nicht als Zweitsprache an', () => {
    expect(zweitsprachen().some((sprache) => sprache.id === BASISSPRACHE)).toBe(false);
    expect(zweitsprachen()).toHaveLength(SPRACHEN.length - 1);
  });

  it('vergibt jede Kennung nur einmal', () => {
    const ids = SPRACHEN.map((sprache) => sprache.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('sortiert hinter den Kernsprachen alphabetisch nach deutscher Bezeichnung', () => {
    // Erst Deutsch, dann die Kernsprachen in bewusster Reihenfolge - der
    // alphabetische Teil beginnt danach.
    const uebrige = SPRACHEN.slice(1 + KERNSPRACHEN).map((sprache) => sprache.label);
    const sortiert = [...uebrige].sort((a, b) => a.localeCompare(b, 'de'));
    expect(uebrige).toEqual(sortiert);
  });

  it('nennt in der Auswahlliste Eigennamen und deutsche Bezeichnung', () => {
    expect(spracheBeschriftung(findSprache('uk'))).toBe('Українська (Ukrainisch)');
    // Bei Deutsch waere beides gleich - dann genuegt einmal.
    expect(spracheBeschriftung(findSprache('de'))).toBe('Deutsch');
  });

  it('kennzeichnet Arabisch und Farsi als von rechts nach links', () => {
    expect(findSprache('ar').dir).toBe('rtl');
    expect(findSprache('fa').dir).toBe('rtl');
    expect(findSprache('en').dir).toBe('ltr');
    expect(hatRtlSprachen()).toBe(true);
  });
});

describe('Zweisprachige Antwort', () => {
  it('bleibt ohne Auswahl einsprachig', () => {
    expect(zweispracheRegeln(basis())).toEqual([]);
    expect(zweispracheRegeln(basis({ zweitsprache: 'keine' }))).toEqual([]);
    const prompt = buildPrompt(basis());
    expect(prompt).toContain('Antworte auf Deutsch.');
    expect(prompt).not.toContain('Ergänze die deutsche Antwort');
  });

  it('erzeugt keine Regeln, wenn Deutsch als Zweitsprache gewaehlt wird', () => {
    expect(zweispracheRegeln(basis({ zweitsprache: 'de' }))).toEqual([]);
  });

  it('nennt die gewaehlte Sprache mit Bezeichnung und Eigennamen', () => {
    const prompt = buildPrompt(basis({ zweitsprache: 'ar' }));
    expect(prompt).toContain('Erläuterung auf Arabisch (العربية)');
  });

  it('verlangt eine Erlaeuterung statt einer Uebersetzung', () => {
    const prompt = buildPrompt(basis({ zweitsprache: 'uk' }));
    expect(prompt).toContain('Übersetze nicht Satz für Satz');
    expect(prompt).toContain('Verständnisstütze');
  });

  it('haelt die deutsche Fassung vollstaendig und die Fachbegriffe deutsch', () => {
    const prompt = buildPrompt(basis({ zweitsprache: 'tr' }));
    expect(prompt).toContain('Antworte auf Deutsch.');
    expect(prompt).toContain('bleibt dabei vollständig');
    expect(prompt).toContain('Fachbegriffe bleiben auch dort auf Deutsch');
    expect(prompt).toContain('die Prüfung findet auf Deutsch statt');
  });

  it('steht im Abschnitt AUSGABE', () => {
    const prompt = buildPrompt(basis({ zweitsprache: 'fa' }));
    const ausgabe = prompt.slice(prompt.indexOf('\n\nAUSGABE\n'));
    expect(ausgabe).toContain('Erläuterung auf Farsi');
  });
});

describe('Standardwerte', () => {
  // Festgelegt am 11.09.2026. Ändert sich hier etwas, soll das eine bewusste
  // Entscheidung sein und kein Nebeneffekt.
  const standard = defaultSettings();

  it('beginnt mit KGQ, Thema erklären, Niveau 3 und kurzer Ausgabe', () => {
    expect(standard.beruf).toBe('kgq');
    expect(standard.aufgabe).toBe('erklaeren');
    expect(NIVEAUS.find((n) => n.id === standard.niveau)?.stufe).toBe(3);
    expect(standard.format).toBe('kompakt');
    expect(standard.zweitsprache).toBe('keine');
  });

  it('setzt die Anzahl auf 5', () => {
    expect(standard.anzahl).toBe(5);
  });

  it('schaltet genau Fachbegriffe, Praxisbeispiel und Prüfungsbezug ein', () => {
    expect([...standard.optionen].sort()).toEqual(
      ['fachbegriffe', 'ihk-bezug', 'praxisbeispiel'].sort(),
    );
  });
});

describe('Auf Standard', () => {
  const standard = () => defaultSettings();

  it('bietet das Zurücksetzen nicht an, solange alles auf Standard steht', () => {
    expect(weichtVomStandardAb(standard())).toBe(false);
  });

  it('erkennt jede geänderte Auswahl', () => {
    expect(weichtVomStandardAb({ ...standard(), beruf: 'immobilien' })).toBe(true);
    expect(weichtVomStandardAb({ ...standard(), format: 'tabelle' })).toBe(true);
    expect(weichtVomStandardAb({ ...standard(), zweitsprache: 'uk' })).toBe(true);
    expect(weichtVomStandardAb({ ...standard(), optionen: ['fachbegriffe'] })).toBe(true);
    expect(weichtVomStandardAb({ ...standard(), quellen: [] })).toBe(true);
  });

  it('achtet bei Optionen und Quellen nicht auf die Reihenfolge', () => {
    const s = standard();
    expect(
      weichtVomStandardAb({ ...s, optionen: [...s.optionen].reverse(), quellen: [...s.quellen].reverse() }),
    ).toBe(false);
  });

  it('zählt die Anzahl nur, wenn die Aufgabe sie benutzt', () => {
    // Wer noch die frühere Vorgabe 8 gespeichert hat, sieht bei "Thema
    // erklären" kein Anzahlfeld — dann darf "Auf Standard" nicht erscheinen.
    expect(weichtVomStandardAb({ ...standard(), anzahl: 8 })).toBe(false);
    expect(
      weichtVomStandardAb({ ...standard(), aufgabe: 'karteikarten', anzahl: 8 }),
    ).toBe(true);
  });

  // Die vollständigen Einstellungen enthalten auch geschriebenen Text; die
  // Funktionen bekommen im Betrieb genau dieses Objekt übergeben.
  it('erfasst geschriebenen Text nicht als Abweichung', () => {
    const mitText = { ...standard(), quellenFreitext: 'Schmidt/Futterer' };
    expect(weichtVomStandardAb(mitText)).toBe(false);
  });

  it('nimmt keinen geschriebenen Text in die Auswahl auf', () => {
    const mitText = { ...standard(), quellenFreitext: 'Mein Text' };
    const auswahl = auswahlVon(mitText);
    expect(Object.keys(auswahl)).not.toContain('quellenFreitext');
    expect(Object.keys(standardAuswahl())).not.toContain('quellenFreitext');
  });

  it('kopiert Listen, damit "Rückgängig" nicht mitverändert wird', () => {
    const vorher = standard();
    const kopie = auswahlVon(vorher);
    vorher.optionen.push('rueckfragen');
    vorher.quellen.length = 0;
    expect(kopie.optionen).not.toContain('rueckfragen');
    expect(kopie.quellen.length).toBeGreaterThan(0);
  });

  it('stellt nach Zurücksetzen und Rückgängig den alten Stand her', () => {
    // Nachgestellt ohne Oberfläche: dieselben Schritte wie im Store.
    const zustand = {
      ...standard(),
      beruf: 'immobilien' as const,
      format: 'tabelle' as const,
      optionen: ['rueckfragen' as const],
      quellenFreitext: 'bleibt stehen',
    };
    const vorher = auswahlVon(zustand);
    Object.assign(zustand, standardAuswahl());
    expect(weichtVomStandardAb(zustand)).toBe(false);
    expect(zustand.quellenFreitext).toBe('bleibt stehen');

    Object.assign(zustand, auswahlVon(vorher));
    expect(zustand.beruf).toBe('immobilien');
    expect(zustand.format).toBe('tabelle');
    expect(zustand.optionen).toEqual(['rueckfragen']);
    expect(zustand.quellenFreitext).toBe('bleibt stehen');
  });
});

describe('Zweitsprache in den Einstellungen', () => {
  it('ist ohne Vorgabe abgeschaltet', () => {
    expect(defaultSettings().zweitsprache).toBe('keine');
  });

  it('uebernimmt eine gueltige gespeicherte Sprache', () => {
    expect(normalizeSettings({ zweitsprache: 'ro' }).zweitsprache).toBe('ro');
  });

  it('faellt bei unbekannter oder gestrichener Sprache auf "keine" zurueck', () => {
    expect(normalizeSettings({ zweitsprache: 'klingonisch' }).zweitsprache).toBe('keine');
    expect(normalizeSettings({ zweitsprache: 42 }).zweitsprache).toBe('keine');
    // Deutsch waere keine zweite Sprache, sondern die erste.
    expect(normalizeSettings({ zweitsprache: 'de' }).zweitsprache).toBe('keine');
  });

  it('reicht die Auswahl an den Prompt-Eingabesatz weiter', () => {
    const settings = { ...defaultSettings(), zweitsprache: 'vi' as const };
    const input = toPromptInput(settings, { thema: 'Skonto', zusatz: '' });
    expect(input.zweitsprache).toBe('vi');
    expect(buildPrompt(input)).toContain('Vietnamesisch (Tiếng Việt)');
  });
});

describe('Niveaustufen', () => {
  it('sind fortlaufend von 1 bis 4 nummeriert', () => {
    expect(NIVEAUS.map((niveau) => niveau.stufe)).toEqual([1, 2, 3, 4]);
  });

  it('zeigt die Stufe in der Auswahlliste', () => {
    expect(niveauBeschriftung(NIVEAUS[2])).toBe('3 — Niveau der Abschlussprüfung');
  });

  it('schreibt die Stufenzahl NICHT in den Prompt', () => {
    // Eine Zahl ohne die Skala dahinter waere fuer ein Sprachmodell
    // nichtssagend - im Prompt steht deshalb nur die Bezeichnung.
    const prompt = buildPrompt(basis({ niveau: 'pruefung' }));
    expect(prompt).toContain('Niveau: Niveau der Abschlussprüfung.');
    expect(prompt).not.toContain('3 — Niveau der Abschlussprüfung');
  });
});
