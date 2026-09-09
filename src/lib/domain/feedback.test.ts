import { describe, expect, it } from 'vitest';
import {
  feedbackAnhang,
  feedbackBetreff,
  feedbackMailto,
  feedbackText,
  kurzeBrowserKennung,
  type FeedbackKontext,
} from './feedback';

const kontext: FeedbackKontext = {
  app: 'Fragenschmiede',
  version: '0.1.0',
  beruf: 'Immobilienkaufmann/-frau',
  aufgabe: 'Multiple-Choice-Fragen',
  niveau: 'IHK-Prüfungsniveau',
  format: 'Strukturiert mit Stichpunkten',
  browser: 'Chrome 141, Windows',
  adresse: 'https://davuuuud.github.io/DAA_Prompt_Gen/',
};

describe('Anhang zur Einordnung', () => {
  it('enthält die Auswahl und die Fassung', () => {
    const anhang = feedbackAnhang(kontext);
    expect(anhang).toContain('0.1.0');
    expect(anhang).toContain('Immobilienkaufmann/-frau');
    expect(anhang).toContain('Multiple-Choice-Fragen');
    expect(anhang).toContain('Chrome 141, Windows');
  });

  it('kündigt an, dass er gelöscht werden darf', () => {
    expect(feedbackAnhang(kontext)).toContain('bei Bedarf löschen');
  });
});

describe('Datensparsamkeit', () => {
  it('überträgt weder Thema noch Zusatzangaben', () => {
    // Der Typ sieht diese Felder gar nicht erst vor. Der Test hält fest,
    // dass das Absicht ist und nicht versehentlich ergänzt werden darf.
    const text = feedbackText(kontext);
    expect(text).not.toContain('Thema');
    expect(text).not.toContain('Zusätzliche Angaben');
    expect(Object.keys(kontext)).not.toContain('thema');
    expect(Object.keys(kontext)).not.toContain('zusatz');
  });

  it('stellt die Fragen an den Anfang, den Anhang ans Ende', () => {
    const text = feedbackText(kontext);
    expect(text.indexOf('Was ist aufgefallen?')).toBeLessThan(text.indexOf('Angaben zur Einordnung'));
  });
});

describe('mailto-Adresse', () => {
  it('kodiert Betreff und Text', () => {
    const url = feedbackMailto('hallo@example.org', kontext);
    expect(url.startsWith('mailto:hallo@example.org?')).toBe(true);
    expect(url).toContain('subject=');
    expect(url).toContain('body=');
    // Umlaute und Zeilenumbrüche dürfen nicht roh in der Adresse stehen.
    expect(url).not.toContain('ü');
    expect(url).not.toContain('\n');
  });

  it('lässt sich vollständig zurücklesen', () => {
    const url = feedbackMailto('hallo@example.org', kontext);
    const betreff = decodeURIComponent(url.split('subject=')[1].split('&body=')[0]);
    const text = decodeURIComponent(url.split('&body=')[1]);
    expect(betreff).toBe(feedbackBetreff('Fragenschmiede', '0.1.0'));
    expect(text).toBe(feedbackText(kontext));
  });

  it('ergibt bei leerem Empfänger einen leeren String', () => {
    expect(feedbackMailto('', kontext)).toBe('');
    expect(feedbackMailto('   ', kontext)).toBe('');
  });
});

describe('Browser-Kennung', () => {
  it.each([
    [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',
      'Chrome 141, Windows',
    ],
    [
      'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36',
      'Chrome 140, Android',
    ],
    [
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1',
      'Safari 17, iOS',
    ],
    [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36 Edg/141.0.0.0',
      'Edge 141, Windows',
    ],
    ['Mozilla/5.0 (X11; Linux x86_64; rv:130.0) Gecko/20100101 Firefox/130.0', 'Firefox 130, Linux'],
  ])('erkennt %#', (userAgent, erwartet) => {
    expect(kurzeBrowserKennung(userAgent)).toBe(erwartet);
  });

  it('kommt mit Unbekanntem zurecht', () => {
    expect(kurzeBrowserKennung('irgendetwas')).toBe('unbekannt');
    expect(kurzeBrowserKennung('')).toBe('unbekannt');
  });
});
