# IHK-Lernassistent

Baut strukturierte Lern-Prompts für die kaufmännische Umschulung. Läuft im
Browser und lässt sich auf dem Telefon zum Startbildschirm hinzufügen. Alles
geschieht auf dem Gerät: kein Konto, keine Anmeldung, keine Datenübertragung.

Nachfolger des Windows-Programms `IHK-Prompt-Assistent-v2` (Go/Win32).

## Was die Anwendung kann

- Auswahl von Ausbildungsberuf, Aufgabenart, Niveau und Ausgabeform
- Kuratierter Quellenkatalog, nach Ausbildungsberuf gefiltert (WEG und MaBV
  beim Immobilienkaufmann, KWG und WpHG beim Bankkaufmann)
- Feste Qualitätsregeln gegen erfundene Quellen, Paragraphen und Zahlen
- Der Prompt entsteht laufend beim Tippen; kopieren oder über den
  System-Dialog teilen
- Einstellungen und Entwurf überleben das Schließen
- Dunkelmodus nach Systemeinstellung
- Offline lauffähig, sobald die Seite einmal geladen wurde

## Entwickeln

```bash
npm install
npm run dev        # Entwicklungsserver auf http://localhost:5173
npm test           # Tests der Fachlogik
npm run check      # Typprüfung (TypeScript und Svelte)
npm run build      # Produktionsbau nach dist/
npm run preview    # dist/ ausliefern, http://localhost:4173
npm run icons      # App-Symbole aus assets-src/ neu erzeugen
```

Der Offline-Betrieb lässt sich nur im Produktionsbau prüfen (`npm run build`
und dann `npm run preview`), nicht im Entwicklungsserver. `localhost` gilt
dabei als sicherer Kontext, der Service Worker läuft dort also echt.

## Veröffentlichen

Die Anwendung ist eine reine Sammlung statischer Dateien. Der Inhalt von
`dist/` kann auf jeden Webspace mit HTTPS. **HTTPS ist Pflicht** – ohne das
gibt es keinen Service Worker und damit weder Offline-Betrieb noch die
Möglichkeit, die Seite zum Startbildschirm hinzuzufügen.

### GitHub Pages

`.github/workflows/pages.yml` liegt fertig bei. Nötig sind:

1. Ein GitHub-Konto und ein Repository mit diesem Projekt
2. Im Repository unter **Settings → Pages → Source** den Eintrag
   **GitHub Actions** wählen
3. Auf `main` pushen

Der Ablauf führt Tests und Typprüfung aus, baut und veröffentlicht. Die
Adresse lautet danach `https://<konto>.github.io/<repository>/`.

### Anderer Webspace

```bash
npm run build -- --base=/unterordner/
```

Den Basispfad nur angeben, wenn die Seite in einem Unterordner liegt. Im
Wurzelverzeichnis genügt `npm run build`.

## Aufbau

```
src/lib/domain/      Fachlogik ohne Oberfläche, vollständig durch Tests gedeckt
  types.ts             gemeinsame Typen, stabile Bezeichner statt Indizes
  catalogs.ts          Berufe, Aufgaben, Optionen, Niveaus, Ausgabeformate
  quellen.ts           Quellenkatalog mit Berufsfilter
  prompt.ts            Aufbau des fertigen Prompts
  settings.ts          Vorgaben und Normalisierung gespeicherter Werte
  text.ts              Textwerkzeuge
src/lib/state/       Zustand und Ablage auf dem Gerät
src/lib/platform/    Zwischenablage und Teilen-Dialog
src/lib/components/  Svelte-Bausteine
assets-src/          SVG-Vorlagen der App-Symbole
scripts/             Erzeugung der PNG-Symbole (nur auf Zuruf)
```

Die Fachlogik kennt die Windows-API ebenso wenig wie den Browser. Sie ist
deshalb ohne Oberfläche testbar – der Grund, warum der Portierungsschritt
vom Go-Programm ohne einen einzigen Compilerfehler durchlief.

## Offene Punkte

- **Quellenkatalog fachlich prüfen.** Er ist aus allgemeinem Wissen
  zusammengestellt und wartet auf Durchsicht durch jemanden, der näher am
  Unterricht ist.
- **Etappe 3:** eigene Dokumente durchsuchbar machen (PDF, Word, Excel,
  Scans mit Texterkennung). OneNote-Dateien lassen sich clientseitig nicht
  lesen und müssen aus OneNote als PDF exportiert werden.
- **Etappe 4:** Anbindung an KI-Anbieter mit eigenem Schlüssel, sodass die
  Antwort direkt in der Anwendung erscheint.
