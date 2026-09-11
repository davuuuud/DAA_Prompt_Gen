import { describe, expect, it } from 'vitest';
import { BERUFE } from './catalogs';
import {
  DEFAULT_QUELLEN,
  QUELLEN,
  QUELLEN_GRUPPEN,
  quellenBezeichnungen,
  quellenFuerBeruf,
  quellenNachGruppe,
} from './quellen';
import { defaultSettings, normalizeSettings } from './settings';

describe('Quellenkatalog', () => {
  it('hat eindeutige Bezeichner und gültige Gruppen', () => {
    const ids = QUELLEN.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
    const gruppen = new Set(QUELLEN_GRUPPEN.map((g) => g.id));
    for (const quelle of QUELLEN) {
      expect(quelle.label.trim()).not.toBe('');
      expect(gruppen.has(quelle.group)).toBe(true);
    }
  });

  it('verweist nur auf existierende Berufe', () => {
    const bekannt = new Set(BERUFE.map((b) => b.id));
    for (const quelle of QUELLEN) {
      for (const beruf of quelle.berufe ?? []) {
        expect(bekannt.has(beruf), `${quelle.id} nennt unbekannten Beruf ${beruf}`).toBe(true);
      }
    }
  });

  it('zeigt jedem Beruf die allgemeinen Quellen', () => {
    const allgemeine = QUELLEN.filter((q) => !q.berufe).map((q) => q.id);
    for (const beruf of BERUFE) {
      const verfuegbar = quellenFuerBeruf(beruf.id).map((q) => q.id);
      for (const id of allgemeine) {
        expect(verfuegbar).toContain(id);
      }
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

  it('versorgt jeden der vorgegebenen Berufe mit eigenen Quellen', () => {
    // Die Grundqualifikation kommt mit den allgemeinen Quellen aus.
    for (const beruf of BERUFE.filter((b) => b.id !== 'kgq')) {
      const eigene = QUELLEN.filter((q) => q.berufe?.includes(beruf.id));
      expect(eigene.length, `${beruf.id} hat keine berufsspezifische Quelle`).toBeGreaterThan(0);
    }
  });

  it('liefert jedem Beruf eine brauchbare Auswahl', () => {
    for (const beruf of BERUFE) {
      expect(quellenFuerBeruf(beruf.id).length).toBeGreaterThanOrEqual(15);
    }
  });

  it('gruppiert ohne leere Gruppen', () => {
    for (const beruf of BERUFE) {
      for (const eintrag of quellenNachGruppe(beruf.id)) {
        expect(eintrag.quellen.length).toBeGreaterThan(0);
        expect(eintrag.gruppe.trim()).not.toBe('');
      }
    }
  });

  it('hängt die Erläuterung an die Bezeichnung', () => {
    expect(quellenBezeichnungen('immobilien', ['weg'])).toEqual([
      'WEG (Wohnungseigentumsgesetz)',
    ]);
    expect(quellenBezeichnungen('kgq', ['ihk-veroeffentlichungen'])).toEqual([
      'IHK-Veröffentlichungen',
    ]);
  });

  it('ignoriert unbekannte Bezeichner', () => {
    expect(quellenBezeichnungen('kgq', ['gibt-es-nicht', 'bgb'])).toEqual([
      'BGB (Bürgerliches Gesetzbuch)',
    ]);
  });

  it('hat Vorgabequellen, die für jeden Beruf gelten', () => {
    for (const beruf of BERUFE) {
      const verfuegbar = new Set(quellenFuerBeruf(beruf.id).map((q) => q.id));
      for (const id of DEFAULT_QUELLEN) {
        expect(verfuegbar.has(id), `${id} fehlt bei ${beruf.id}`).toBe(true);
      }
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

  it('entfernt Quellen, die nach einem Berufswechsel nicht mehr passen', () => {
    const s = normalizeSettings({ beruf: 'fachinformatik', quellen: ['weg', 'urhg', 'bgb'] });
    expect(s.quellen).toEqual(['urhg', 'bgb']);
  });

  it('fällt auf passende Vorgabequellen zurück, wenn nichts Gültiges übrig bleibt', () => {
    const s = normalizeSettings({ beruf: 'fachinformatik', quellen: ['weg', 'mabv'] });
    expect(s.quellen.length).toBeGreaterThan(0);
    expect(s.quellen).not.toContain('weg');
  });
});
