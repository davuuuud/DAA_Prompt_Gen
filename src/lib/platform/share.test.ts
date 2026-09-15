import { describe, expect, it } from 'vitest';
import { KI_ANBIETER } from './share';

describe('KI-Anbieter unter dem Prompt', () => {
  it('stehen alphabetisch — die Anwendung empfiehlt keinen', () => {
    const namen = KI_ANBIETER.map((a) => a.name);
    expect(namen).toEqual([...namen].sort((a, b) => a.localeCompare(b, 'de')));
  });

  it('verweisen nur auf die Startseite, ohne den Prompt mitzugeben', () => {
    for (const anbieter of KI_ANBIETER) {
      const adresse = new URL(anbieter.url);
      expect(adresse.protocol, anbieter.name).toBe('https:');
      expect(adresse.pathname, anbieter.name).toBe('/');
      expect(adresse.search, anbieter.name).toBe('');
      expect(adresse.hash, anbieter.name).toBe('');
    }
  });

  it('haben eindeutige Namen', () => {
    const namen = KI_ANBIETER.map((a) => a.name);
    expect(new Set(namen).size).toBe(namen.length);
  });
});
