// Aufbau der Rückmeldung.
//
// Die Anwendung verschickt nichts von sich aus. Sie stellt lediglich eine
// vorbereitete E-Mail zusammen und übergibt sie dem Mailprogramm — dort
// sieht man den vollständigen Text und entscheidet selbst, ob er abgeschickt
// wird.
//
// Bewusst NICHT enthalten: Thema und zusätzliche Angaben. Dort können
// personenbezogene Daten oder eigene Prüfungsleistungen stehen; die gehören
// nicht ungefragt in eine Nachricht.

export interface FeedbackKontext {
  /** Name der Anwendung, für die Betreffzeile. */
  app: string;
  version: string;
  beruf: string;
  aufgabe: string;
  niveau: string;
  format: string;
  /** Kennung des Browsers, für die Einordnung von Darstellungsfehlern. */
  browser: string;
  /** Adresse der laufenden Anwendung. */
  adresse: string;
}

const VORLAGE = [
  'Was ist aufgefallen?',
  '',
  '',
  'Was hattest du erwartet?',
  '',
  '',
].join('\n');

/** Der technische Anhang, den die Empfängerin oder der Empfänger braucht. */
export function feedbackAnhang(kontext: FeedbackKontext): string {
  return [
    '--- Angaben zur Einordnung (bei Bedarf löschen) ---',
    `Fassung:     ${kontext.version}`,
    `Adresse:     ${kontext.adresse}`,
    `Beruf:       ${kontext.beruf}`,
    `Aufgabe:     ${kontext.aufgabe}`,
    `Niveau:      ${kontext.niveau}`,
    `Ausgabeform: ${kontext.format}`,
    `Browser:     ${kontext.browser}`,
  ].join('\n');
}

export function feedbackBetreff(app: string, version: string): string {
  return `Rückmeldung zur ${app} (Fassung ${version})`;
}

export function feedbackText(kontext: FeedbackKontext): string {
  return `${VORLAGE}\n${feedbackAnhang(kontext)}\n`;
}

/**
 * Baut die mailto-Adresse. Ein leerer Empfänger ergibt einen leeren String —
 * die Oberfläche blendet den Verweis dann aus, statt eine tote Schaltfläche
 * anzubieten.
 */
export function feedbackMailto(empfaenger: string, kontext: FeedbackKontext): string {
  const ziel = empfaenger.trim();
  if (ziel === '') return '';
  const betreff = encodeURIComponent(feedbackBetreff(kontext.app, kontext.version));
  const text = encodeURIComponent(feedbackText(kontext));
  return `mailto:${ziel}?subject=${betreff}&body=${text}`;
}

/**
 * Kürzt die Browser-Kennung auf das Wesentliche. Die vollständige Zeichenkette
 * ist lang und für Menschen unlesbar.
 */
export function kurzeBrowserKennung(userAgent: string): string {
  const gefunden: string[] = [];

  for (const [name, muster] of [
    ['Edge', /Edg\/([\d.]+)/],
    ['Chrome', /Chrome\/([\d.]+)/],
    ['Firefox', /Firefox\/([\d.]+)/],
    ['Safari', /Version\/([\d.]+).*Safari/],
  ] as const) {
    const treffer = muster.exec(userAgent);
    if (treffer) {
      // Nur die Hauptversion: Die vollen vier Stellen helfen niemandem.
      gefunden.push(`${name} ${treffer[1].split('.')[0]}`);
      break;
    }
  }

  for (const [name, muster] of [
    ['Android', /Android[ /]([\d.]+)/],
    ['iOS', /OS (\d+[_\d]*) like Mac OS X/],
    ['Windows', /Windows NT ([\d.]+)/],
    ['macOS', /Mac OS X ([\d_.]+)/],
    ['Linux', /Linux/],
  ] as const) {
    if (muster.test(userAgent)) {
      gefunden.push(name);
      break;
    }
  }

  return gefunden.length > 0 ? gefunden.join(', ') : 'unbekannt';
}
