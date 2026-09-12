# Änderungen

Was sich von Fassung zu Fassung geändert hat, in der Sprache der Nutzer und
nicht der Commits. Die Fassungsnummer steht in der Anwendung unten links.

## 0.2.0 — 12.09.2026

Die erste Fassung war ein lauffähiges Gerüst. Diese hier hat einen
Quellenkatalog, der den Namen verdient, und eine Oberfläche, die sich nach
dem Arbeitsablauf richtet statt nach der Reihenfolge, in der sie entstanden
ist.

### Quellen

- **Der Katalog wuchs von 51 auf 254 Einträge**, abgeglichen mit den
  Rahmenlehrplänen aller vierzehn Berufe. Dabei fielen Lücken auf, die vorher
  niemandem aufgefallen wären: Beim Einzelhandel fehlten KassenSichV und
  § 146a AO, bei den Immobilienkaufleuten VOB/B und HOAI, bei der
  Lagerlogistik die Lenk- und Ruhezeiten.
- **Je Beruf stehen jetzt 53 bis 66 Quellen zur Wahl**, vorab angehakt sind
  39 bis 52 davon — alles, was wichtig ist oder normalerweise vorkommt. Nur
  Nebensächliches bleibt frei.
- **Berufswechsel:** Eine unberührte Voreinstellung wandert mit, eine eigene
  Auswahl bleibt; nur Berufsfremdes fällt heraus.
- **Im Prompt** stehen die Quellen nach Art gegliedert und mit
  ausgeschriebenem Titel, dazu der Hinweis, nur die zur Frage passenden
  heranzuziehen.
- **Durchsichtsbögen für die Dozenten** (`quellen-durchsicht/`), erzeugt aus
  demselben Katalog wie die Anwendung. Die fachliche Durchsicht läuft noch;
  die Vorauswahl ist ausdrücklich vorläufig (Issue #1).

### Antworten

- **Zweite Sprache in der Antwort**, dreizehn Sprachen zur Wahl. Die
  Oberfläche bleibt deutsch, und die Antwort ebenfalls: Die zweite Sprache
  erklärt die deutschen Fachbegriffe zusätzlich, sie ersetzt sie nicht — die
  Prüfung findet auf Deutsch statt.
- **Neue Standardwerte:** Kaufmännische Grundqualifikation, Thema erklären,
  Niveau 3, Kurz und kompakt, keine zweite Sprache, Anzahl 5. Angehakt sind
  Fachbegriffe erklären, Praxisbeispiel und Prüfungsbezug.

### Oberfläche

- **Thema und Aufgabe stehen jetzt oben**, die Einstellungen darunter. Das
  Thema ändert sich bei jeder Frage, die Einstellungen kaum.
- Unter dem Thema steht, wofür der Prompt gebaut wird („für
  Immobilienkaufleute · Niveau 3 · ändern").
- **Bevorzugte Quellen, Sonstige Optionen und der fertige Prompt lassen sich
  auf- und zuklappen.** Auf dem Telefon war die Quellenliste sonst der
  längste Block des Formulars.
- **„Auf Standard"** setzt die Einstellungen zurück, ohne zu fragen — dafür
  mit „Rückgängig". Thema, Aufgabe und alles Geschriebene bleiben stehen.
- Bei „Eigene Lösung kontrollieren" steht das Lösungsfeld direkt unter der
  Aufgabe statt in den sonstigen Optionen.
- **Neuer Aufhänger:** GIGO — garbage in, garbage out.
- **Impressum und Datenschutzerklärung** als eigene Seiten, erreichbar über
  die Fußzeile.
- Berufsliste nach Kürzeln sortiert, Niveaustufen nummeriert, neues Logo,
  Trägername auf DAA MWW berichtigt (vorher „Mitte-West").

### Unter der Haube

- **Leser für alte Word-Dateien (`.doc`)**, geprüft am gesamten Bestand des
  Bildungsträgers: 778 Dateien, alle lesbar. Vorarbeit für die Einbindung
  eigener Unterlagen.
- Der Quellenkatalog ist die einzige Stelle, an der Quellen gepflegt werden;
  Anwendung und Durchsichtsbögen können nicht mehr auseinanderlaufen.
- Material, das nur die Bögen brauchen, liegt außerhalb des Programms. Das
  ausgelieferte Paket wurde dadurch um 26 kB kleiner.
- **155 Tests** statt 128.

### Entschieden

- **Etappe 3 (eigene Unterlagen durchsuchbar machen) ist zurückgestellt.**
  Taugt die Anwendung etwas, kommt sie ohne die Unterlagen der Dozenten aus.
  Als Nächstes zählt die Güte der Prompts selbst (Issue #34).

## 0.1.0 — 09.09.2026

Erstfassung als Web-App, Nachfolger des Windows-Programms
`IHK-Prompt-Assistent-v2` (Go/Win32).

- Auswahl von Ausbildungsberuf, Aufgabenart, Niveau und Ausgabeform; der
  Prompt entsteht laufend beim Tippen.
- Feste Qualitätsregeln gegen erfundene Quellen, Paragraphen und Zahlen.
- Kopieren oder über den System-Dialog teilen; Einstellungen und Entwurf
  überleben das Schließen.
- Installierbar auf dem Startbildschirm, offline lauffähig, Dunkelmodus nach
  Systemeinstellung.
- Veröffentlichung über GitHub Pages bei jedem Push auf `main`.
