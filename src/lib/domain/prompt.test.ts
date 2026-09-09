import { describe, expect, it } from 'vitest';
import { AUFGABEN, BERUFE, FORMATE, NIVEAUS, OPTIONEN } from './catalogs';
import { alleQuellen, buildPrompt, MAX_FUNDSTELLE_ZEICHEN, validate } from './prompt';
import { defaultSettings, toPromptInput } from './settings';
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
    // Vorgabe des Bildungstraegers, in dieser Reihenfolge. Der Auffangeintrag
    // 'allgemein' steht zusaetzlich voran.
    expect(BERUFE.map((b) => b.id)).toEqual([
      'allgemein',
      'industrie', // IK
      'bueromanagement', // KBM
      'einzelhandel', // EHK
      'gesundheit', // KiG
      'grosshandel', // GAM
      'immobilien', // IMK
      'steuerfach', // SFA
      'lagerlogistik', // FK LaLo
      'schutzsicherheit', // FK SchuSi
      'personaldienstleistung', // PDK
      'ecommerce', // KEC
      'spedition', // SL
      'fachinformatik', // FiSi
    ]);
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

  it('nennt den Beruf, aber nicht beim allgemeinen Fall', () => {
    expect(buildPrompt(basis())).toContain('Immobilienkaufmann/-frau');
    const allgemein = buildPrompt(basis({ beruf: 'allgemein' }));
    expect(allgemein).not.toContain('zum/zur');
    expect(allgemein).toContain('Umschulung');
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

  it('ergänzt Freitextquellen und entfernt Dubletten', () => {
    const quellen = alleQuellen(
      basis({ quellen: ['haufe'], quellenFreitext: 'Beck-online; haufe' }),
    );
    expect(quellen).toContain('Haufe');
    expect(quellen).toContain('Beck-online');
    expect(quellen.filter((q) => q.toLowerCase() === 'haufe')).toHaveLength(1);
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
    expect(prompt).toContain('UrhG (Urheberrecht, u. a. Softwarelizenzen)');
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
