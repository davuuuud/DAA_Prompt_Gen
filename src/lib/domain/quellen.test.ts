import { describe, expect, it } from 'vitest';
import { BERUFE as BERUF_DURCHSICHT } from '../../../quellen-durchsicht/berufe.mjs';
import {
  GELTUNG,
  HINWEISE,
  NUR_IM_BOGEN,
} from '../../../quellen-durchsicht/durchsicht.mjs';
import { BERUFE } from './catalogs';
import { buildPrompt } from './prompt';
import {
  promptBezeichnung,
  QUELLEN,
  QUELLEN_GRUPPEN,
  quellenBeimBerufswechsel,
  quellenBezeichnungen,
  quellenFuerBeruf,
  quellenNachGruppe,
  standardQuellen,
} from './quellen';
import { KATALOG } from './quellenkatalog';
import { defaultSettings, normalizeSettings, toPromptInput } from './settings';
import { fruehereVoreinstellungen, MAX_VOREINSTELLUNG, VOREINSTELLUNG } from './voreinstellung';

describe('Quellenkatalog', () => {
  it('hat eindeutige Bezeichner und gültige Arten', () => {
    const ids = KATALOG.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
    const arten = new Set(QUELLEN_GRUPPEN.map((g) => g.id));
    for (const quelle of KATALOG) {
      expect(quelle.kuerzel.trim(), quelle.id).not.toBe('');
      expect(quelle.titel.trim(), quelle.id).not.toBe('');
      expect(arten.has(quelle.art), `${quelle.id}: Art ${quelle.art}`).toBe(true);
    }
  });

  it('verweist nur auf existierende Berufe', () => {
    const bekannt = new Set(BERUFE.map((b) => b.id));
    for (const quelle of KATALOG) {
      for (const beruf of quelle.berufe ?? []) {
        expect(bekannt.has(beruf), `${quelle.id} nennt unbekannten Beruf ${beruf}`).toBe(true);
      }
    }
  });

  it('behält die Bezeichner des früheren Katalogs', () => {
    // Wer vor der Übernahme Quellen ausgewählt hat, behält sie.
    const ids = new Set(QUELLEN.map((q) => q.id));
    for (const alt of ['bgb', 'hgb', 'gabler', 'haufe', 'weg', 'mabv', 'urhg', 'cmr', 'ao', 'auegg']) {
      expect(ids.has(alt), `${alt} fehlt`).toBe(true);
    }
  });

  it('zeigt jedem Beruf die allgemeinen Quellen', () => {
    const allgemeine = QUELLEN.filter((q) => !q.berufe).map((q) => q.id);
    for (const beruf of BERUFE) {
      const verfuegbar = quellenFuerBeruf(beruf.id).map((q) => q.id);
      for (const id of allgemeine) expect(verfuegbar).toContain(id);
    }
  });

  it('blendet berufsfremde Quellen aus', () => {
    const systemintegration = quellenFuerBeruf('fachinformatik').map((q) => q.id);
    expect(systemintegration).toContain('urhg');
    expect(systemintegration).not.toContain('weg');
    expect(systemintegration).not.toContain('cmr');

    const immo = quellenFuerBeruf('immobilien').map((q) => q.id);
    expect(immo).toContain('weg');
    expect(immo).toContain('mabv');
    expect(immo).not.toContain('urhg');
  });

  it('führt eine Quelle mehrerer Berufe als einen Eintrag', () => {
    // Die Preisangabenverordnung gilt im Einzelhandel und im E-Commerce.
    const pangv = QUELLEN.filter((q) => q.kuerzel === 'PAngV');
    expect(pangv).toHaveLength(1);
    expect(pangv[0].berufe).toEqual(expect.arrayContaining(['einzelhandel', 'ecommerce']));
  });

  it('gruppiert ohne leere Gruppen', () => {
    for (const beruf of BERUFE) {
      for (const eintrag of quellenNachGruppe(beruf.id)) {
        expect(eintrag.quellen.length).toBeGreaterThan(0);
        expect(eintrag.gruppe.trim()).not.toBe('');
      }
    }
  });
});

describe('Nur im Durchsichtsbogen', () => {
  it('bietet Themen statt Werken in der Anwendung nicht an', () => {
    // "Handelskalkulation" ist ein Thema, zu dem die Dozenten ihr Lehrwerk
    // nennen sollten — als Quelle im Prompt wäre es sinnlos.
    expect(NUR_IM_BOGEN.length).toBeGreaterThan(0);
    const inDerApp = new Set(QUELLEN.map((q) => q.id));
    for (const eintrag of NUR_IM_BOGEN) expect(inDerApp.has(eintrag.id), eintrag.id).toBe(false);
    expect(QUELLEN.some((q) => q.kuerzel === 'Handelskalkulation')).toBe(false);
  });

  it('verknüpft Hinweise und Geltung nur mit Quellen, die es gibt', () => {
    // Wird eine Quelle gestrichen, darf ihr Hinweis nicht verwaist
    // zurückbleiben.
    const ids = new Set(KATALOG.map((q) => q.id));
    for (const id of Object.keys(HINWEISE)) expect(ids.has(id), `Hinweis zu ${id}`).toBe(true);
    for (const id of Object.keys(GELTUNG)) expect(ids.has(id), `Geltung zu ${id}`).toBe(true);
  });

  it('lässt Hinweise an die Dozenten nie in den Prompt', () => {
    // Die Hinweise enthalten Fragen wie "Nach welchem Lehrwerk wird
    // gerechnet?" oder "WICHTIG: … welche gilt für Ihre Gruppe?".
    for (const beruf of BERUFE) {
      const alle = quellenFuerBeruf(beruf.id).map((q) => q.id);
      const prompt = buildPrompt({
        ...toPromptInput(defaultSettings(), { thema: 'Test', zusatz: '' }),
        beruf: beruf.id,
        quellen: alle,
      });
      for (const quelle of quellenFuerBeruf(beruf.id)) {
        const hinweis = (HINWEISE as Record<string, string>)[quelle.id];
        if (!hinweis) continue;
        expect(prompt, `${beruf.id}/${quelle.id}`).not.toContain(hinweis);
      }
      expect(prompt).not.toMatch(/Lehrwerk\?|fehlte bisher|für Ihre Gruppe/);
    }
  });

  it('nennt im Prompt keine Kürzel des Bildungsträgers', () => {
    // "Rahmenlehrplan EHK" wäre für ein Sprachmodell ein Rätsel.
    const kuerzel = BERUFE.map((b) => b.kuerzel);
    for (const quelle of QUELLEN) {
      const text = promptBezeichnung(quelle);
      for (const k of kuerzel) {
        expect(text, `${quelle.id}: ${text}`).not.toMatch(new RegExp(`\\b${k}\\b`));
      }
    }
  });
});

describe('Voreinstellung', () => {
  it('nennt nur Quellen, die der Beruf auch zu sehen bekommt', () => {
    // Ein Tippfehler im Bezeichner fiele sonst still heraus.
    for (const beruf of BERUFE) {
      const verfuegbar = new Set(quellenFuerBeruf(beruf.id).map((q) => q.id));
      for (const id of VOREINSTELLUNG[beruf.id]) {
        expect(verfuegbar.has(id), `${beruf.id}: ${id}`).toBe(true);
      }
      expect(standardQuellen(beruf.id)).toEqual(VOREINSTELLUNG[beruf.id]);
      expect(new Set(VOREINSTELLUNG[beruf.id]).size, beruf.id).toBe(VOREINSTELLUNG[beruf.id].length);
    }
  });

  it('beginnt bei jedem Beruf außer KGQ mit Ausbildungsordnung und Rahmenlehrplan', () => {
    for (const beruf of BERUFE.filter((b) => b.id !== 'kgq')) {
      const ersteZwei = standardQuellen(beruf.id)
        .slice(0, 2)
        .map((id) => QUELLEN.find((q) => q.id === id)!);
      expect(ersteZwei.map((q) => q.kuerzel), beruf.id).toEqual([
        'Ausbildungsordnung',
        'Rahmenlehrplan',
      ]);
      for (const q of ersteZwei) expect(q.berufe, `${beruf.id}/${q.id}`).toContain(beruf.id);
    }
  });

  it('beginnt bei KGQ mit dem WiSo-Qualifikationsprofil', () => {
    const erste = QUELLEN.find((q) => q.id === standardQuellen('kgq')[0])!;
    expect(promptBezeichnung(erste)).toContain('Wirtschafts- und Sozialkunde');
  });

  it('enthält über die Vorgaben hinaus mindestens zwei eigene Fachquellen', () => {
    // Sonst wäre die Voreinstellung für alle Berufe dieselbe.
    const allgemein = new Set(['gesetze-im-internet-de', 'gabler']);
    for (const beruf of BERUFE) {
      const fach = standardQuellen(beruf.id).filter((id) => {
        const q = QUELLEN.find((eintrag) => eintrag.id === id)!;
        return q.art !== 'vorgabe' && !allgemein.has(id);
      });
      expect(fach.length, beruf.id).toBeGreaterThanOrEqual(2);
    }
  });

  it('stellt nichts ein, woraus eine KI nicht belegen kann', () => {
    // AkA-Kataloge und Kammermaterial sind nicht öffentlich.
    const nichtOeffentlich = ['aka', 'aka-katalog-wiso', 'dws-steuerberaterkammer', 'haufe'];
    for (const beruf of BERUFE) {
      for (const id of nichtOeffentlich) expect(standardQuellen(beruf.id), beruf.id).not.toContain(id);
    }
  });

  it('bleibt kurz — ein Prompt mit zwanzig Quellen gewichtet keine', () => {
    for (const beruf of BERUFE) {
      expect(standardQuellen(beruf.id).length, beruf.id).toBeLessThanOrEqual(MAX_VOREINSTELLUNG);
    }
  });
});

describe('Berufswechsel', () => {
  it('nimmt eine unberührte Voreinstellung zum neuen Beruf mit', () => {
    const vorher = standardQuellen('einzelhandel');
    const nachher = quellenBeimBerufswechsel(vorher, 'einzelhandel', 'immobilien');
    expect(new Set(nachher)).toEqual(new Set(standardQuellen('immobilien')));
  });

  it('behält eine eigene Auswahl und entfernt nur Berufsfremdes', () => {
    const eigene = ['bgb', 'weg', 'gabler'];
    expect(quellenBeimBerufswechsel(eigene, 'immobilien', 'fachinformatik')).toEqual([
      'bgb',
      'gabler',
    ]);
  });
});

describe('Wortlaut im Prompt', () => {
  it('hängt den Titel an das Kürzel', () => {
    expect(quellenBezeichnungen('immobilien', ['weg'])).toEqual(['WEG (Wohnungseigentumsgesetz)']);
  });

  it('nutzt einen eigenen Wortlaut, wo Kürzel und Titel nicht taugen', () => {
    const rahmen = quellenFuerBeruf('einzelhandel').find(
      (q) => q.kuerzel === 'Rahmenlehrplan' && q.berufe?.includes('einzelhandel'),
    )!;
    expect(promptBezeichnung(rahmen)).toBe('Rahmenlehrplan der KMK für Kaufleute im Einzelhandel');
  });

  it('ignoriert unbekannte und berufsfremde Bezeichner', () => {
    expect(quellenBezeichnungen('fachinformatik', ['gibt-es-nicht', 'weg', 'bgb'])).toEqual([
      'BGB (Bürgerliches Gesetzbuch)',
    ]);
  });
});

describe('Durchsichtsbögen', () => {
  it('führen dieselben Berufe mit denselben Kürzeln wie die Anwendung', () => {
    // Die Bögen haben eine eigene Liste mit Bemerkungen je Beruf. Weichen
    // Kürzel oder Namen ab, laufen App und Bögen auseinander.
    expect(BERUF_DURCHSICHT.map((b) => b.id)).toEqual(BERUFE.map((b) => b.id));
    for (const beruf of BERUFE) {
      const bogen = BERUF_DURCHSICHT.find((b) => b.id === beruf.id)!;
      expect(bogen.kuerzel, beruf.id).toBe(beruf.kuerzel);
      expect(bogen.name, beruf.id).toBe(beruf.label);
    }
  });
});

describe('Einstellungen', () => {
  it('sind in der Vorgabe in sich stimmig', () => {
    const s = defaultSettings();
    expect(normalizeSettings(s)).toEqual(s);
  });

  it('überstehen Unsinn aus dem Gerätespeicher', () => {
    const s = normalizeSettings({
      beruf: 'gibt-es-nicht',
      aufgabe: 42,
      niveau: null,
      format: [],
      anzahl: 'viele',
      optionen: 'keine Liste',
      quellen: ['bgb', 'unfug', 'bgb'],
      quellenFreitext: 17,
    });
    // Geprüft wird der Rückfall auf den Standard, nicht welcher Wert das
    // ist — der steht im Test "Standardwerte" fest.
    const standard = defaultSettings();
    expect(s.beruf).toBe(standard.beruf);
    expect(s.aufgabe).toBe(standard.aufgabe);
    expect(s.niveau).toBe(standard.niveau);
    expect(s.format).toBe(standard.format);
    expect(s.anzahl).toBe(standard.anzahl);
    expect(s.optionen).toEqual([]);
    expect(s.quellen).toEqual(['bgb']);
    expect(s.quellenFreitext).toBe('');
  });

  it('verkraftet null, undefined und falsche Typen', () => {
    for (const unsinn of [null, undefined, 42, 'text', []]) {
      expect(() => normalizeSettings(unsinn)).not.toThrow();
      expect(normalizeSettings(unsinn).beruf).toBe('kgq');
    }
  });

  it('entfernt Quellen, die zum gespeicherten Beruf nicht passen', () => {
    const s = normalizeSettings({ beruf: 'fachinformatik', quellen: ['weg', 'urhg', 'bgb'] });
    expect(s.quellen).toEqual(['urhg', 'bgb']);
  });

  it('fällt auf die Voreinstellung des Berufs zurück, wenn nichts Gültiges übrig bleibt', () => {
    const s = normalizeSettings({ beruf: 'fachinformatik', quellen: ['weg', 'mabv'] });
    expect(new Set(s.quellen)).toEqual(new Set(standardQuellen('fachinformatik')));
  });

  it('ersetzt eine nie angefasste frühere Voreinstellung durch die aktuelle', () => {
    // Sonst erreichte die neue Voreinstellung genau die nicht, die sich auf
    // die alte verlassen haben.
    for (const beruf of BERUFE) {
      for (const frueher of fruehereVoreinstellungen(beruf.id)) {
        const umgestellt = [...frueher].reverse(); // Reihenfolge zählt nicht
        const s = normalizeSettings({ beruf: beruf.id, quellen: umgestellt });
        expect(s.quellen, `${beruf.id}: ${frueher.join(', ')}`).toEqual(standardQuellen(beruf.id));
      }
    }
  });

  it('lässt eine eigene Auswahl stehen, auch wenn sie einer früheren ähnelt', () => {
    // Erste Fassung plus eine eigene Quelle: angefasst, also behalten.
    const eigene = ['ihk-veroeffentlichungen', 'ausbildungsordnung', 'bgb', 'hgb', 'haufe', 'gabler', 'weg'];
    const s = normalizeSettings({ beruf: 'immobilien', quellen: eigene });
    expect(s.quellen).toEqual(['ihk-veroeffentlichungen', 'bgb', 'hgb', 'haufe', 'gabler', 'weg']);
  });
});
