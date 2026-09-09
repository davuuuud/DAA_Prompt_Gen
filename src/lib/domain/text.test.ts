import { describe, expect, it } from 'vitest';
import {
  clampNumber,
  collapseBlankLines,
  DEFAULT_ANZAHL,
  MAX_ANZAHL,
  MIN_ANZAHL,
  normalizeLF,
  parseAnzahl,
  plural,
  splitFreitext,
  toCRLF,
  truncateWords,
} from './text';

describe('Zeilenenden', () => {
  it('normalisiert alle Varianten auf \\n', () => {
    expect(normalizeLF('a\r\nb\rc\nd')).toBe('a\nb\nc\nd');
  });

  it('wandelt nach CRLF um, ohne zu verdoppeln', () => {
    expect(toCRLF('a\nb')).toBe('a\r\nb');
    expect(toCRLF('a\r\nb')).toBe('a\r\nb');
    expect(toCRLF('a\rb')).toBe('a\r\nb');
  });
});

describe('collapseBlankLines', () => {
  it.each([
    ['', ''],
    ['   ', ''],
    ['a\r\n\r\n\r\nb', 'a\n\nb'],
    ['\n\na\nb\n\n', 'a\nb'],
    ['a   \r\n   \r\n   b   ', 'a\n\n   b'],
  ])('%j wird zu %j', (eingabe, erwartet) => {
    expect(collapseBlankLines(eingabe)).toBe(erwartet);
  });

  it('behält führende Einrückung, weil sie Bedeutung tragen kann', () => {
    expect(collapseBlankLines('Rechenweg:\n    100 EUR\n    ./. 3 % Skonto')).toBe(
      'Rechenweg:\n    100 EUR\n    ./. 3 % Skonto',
    );
  });
});

describe('parseAnzahl', () => {
  it.each([
    ['', DEFAULT_ANZAHL],
    ['abc', DEFAULT_ANZAHL],
    [' 12 ', 12],
    ['0', MIN_ANZAHL],
    ['-5', MIN_ANZAHL],
    ['999999', MAX_ANZAHL],
    [7, 7],
  ])('%j ergibt %i', (eingabe, erwartet) => {
    expect(parseAnzahl(eingabe as string | number)).toBe(erwartet);
  });
});

describe('clampNumber', () => {
  it('fängt ungültige Werte ab', () => {
    expect(clampNumber(Number.NaN, 1, 10, 5)).toBe(5);
    expect(clampNumber(Number.POSITIVE_INFINITY, 1, 10, 5)).toBe(5);
    expect(clampNumber(-3, 1, 10, 5)).toBe(1);
    expect(clampNumber(99, 1, 10, 5)).toBe(10);
    expect(clampNumber(4.4, 1, 10, 5)).toBe(4);
  });
});

describe('plural', () => {
  it('unterscheidet Einzahl und Mehrzahl', () => {
    expect(plural(1, 'Frage', 'Fragen')).toBe('Frage');
    expect(plural(0, 'Frage', 'Fragen')).toBe('Fragen');
    expect(plural(5, 'Frage', 'Fragen')).toBe('Fragen');
  });
});

describe('splitFreitext', () => {
  it('trennt an Zeilenumbruch und Semikolon', () => {
    expect(splitFreitext('Gabler; NWB\nBeck-online')).toEqual(['Gabler', 'NWB', 'Beck-online']);
  });

  it('zerlegt Fachbuchzitate mit Komma nicht', () => {
    expect(splitFreitext('Schmidt/Futterer, Mietrecht')).toEqual([
      'Schmidt/Futterer, Mietrecht',
    ]);
    expect(splitFreitext('Wöhe, Einführung in die BWL\nHaufe')).toEqual([
      'Wöhe, Einführung in die BWL',
      'Haufe',
    ]);
  });

  it('verwirft leere Bestandteile', () => {
    expect(splitFreitext(' ;;\n  \n Haufe ')).toEqual(['Haufe']);
  });
});

describe('truncateWords', () => {
  it('lässt kurze Texte unverändert', () => {
    expect(truncateWords('kurzer Text', 100)).toBe('kurzer Text');
  });

  it('kürzt an der Wortgrenze und markiert die Auslassung', () => {
    const lang = 'Wort '.repeat(50).trim();
    const gekuerzt = truncateWords(lang, 40);
    expect(gekuerzt.length).toBeLessThanOrEqual(46);
    expect(gekuerzt.endsWith('[…]')).toBe(true);
    expect(gekuerzt).not.toContain('Wor[');
  });
});
