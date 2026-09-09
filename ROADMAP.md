# Fahrplan

Dieser Plan beschreibt, was als Nächstes entsteht und **warum in dieser
Reihenfolge**. Er wird fortgeschrieben; die Reihenfolge ist eine Empfehlung,
keine Festlegung.

---

## Stand heute

Erreicht sind die ersten beiden Etappen:

| Etappe | Inhalt | Zustand |
|---|---|---|
| 1 | Fachlogik, Auswahlkataloge, Quellenkatalog, Oberfläche | fertig |
| 2 | Installierbare Web-App, Offline-Betrieb, Veröffentlichung | fertig |

Die Anwendung läuft unter
[davuuuud.github.io/DAA_Prompt_Gen](https://davuuuud.github.io/DAA_Prompt_Gen/),
lässt sich auf dem Telefon zum Startbildschirm hinzufügen und funktioniert
ohne Internetverbindung. Die Fachlogik ist durch 58 Tests abgedeckt.

---

## Leitentscheidungen

Diese Festlegungen prägen alles Weitere. Wer eine davon umstößt, ändert den
Zuschnitt mehrerer Etappen.

**Alles bleibt auf dem Gerät.**
Kein Server, keine Konten, keine Anmeldung. Lernmaterial und eigene
Prüfungsleistungen sind heikel genug, dass sie nicht ohne Not das Gerät
verlassen sollten. Nebeneffekt: keine laufenden Kosten, kein Betrieb, keine
Verantwortung für fremde Daten.

**Die Anwendung bleibt ohne API-Schlüssel vollwertig.**
Ohne Schlüssel baut sie den Prompt und übergibt ihn per Teilen-Dialog an die
ChatGPT-App — auf dem Telefon ein Tippen. Wer einen eigenen Schlüssel
hinterlegt, bekommt die Antwort zusätzlich direkt in der Anwendung. Niemand
braucht ein Bezahlkonto, um das Werkzeug zu benutzen.

**Stichwortsuche vor semantischer Suche.**
Prüfungsstoff ist begriffslastig: Wer „Deckungsbeitrag", „Skonto" oder
„§ 433 BGB" sucht, wird von einer Stichwortsuche zuverlässiger bedient als
von einem Bedeutungsmodell. Vor allem aber funktioniert sie ohne Schlüssel
und ohne Modell-Download — sonst wären die eigenen Unterlagen ausgerechnet
für die Nutzer ohne Schlüssel wertlos.

**Fachlogik ohne Oberflächenbezug, unter Test.**
`src/lib/domain/` kennt weder Browser noch Anzeige. Das hat sich bei der
Portierung des Vorgängerprogramms bewährt: Der übertragene Kern lief beim
ersten Versuch fehlerfrei.

**Stabile Bezeichner statt Positionsnummern.**
Kataloge werden über Zeichenketten angesprochen (`multiple-choice`), nicht
über Indizes. Gespeicherte Einstellungen überleben dadurch jede Erweiterung
der Auswahllisten.

---

## Etappe 3 — Eigene Unterlagen durchsuchbar machen

Der eigentliche Sprung: Die Anwendung findet die passenden Stellen im eigenen
Lernmaterial und legt sie als Belegstellen in den Prompt. Die Antwort kommt
dann in der Begrifflichkeit des eigenen Unterrichts, mit den eigenen
Seitenzahlen — und wenn das Material eine Frage nicht hergibt, sagt die KI
das, statt es zu überspielen.

**Das ist das Einzige an diesem Projekt, was ein Sprachmodell allein nicht
leisten kann.**

Der Ausgabeteil steht bereits: Der Abschnitt `BELEGSTELLEN AUS MEINEN
UNTERLAGEN`, die Nummerierung, die Kürzung überlanger Zitate und die vier
Regeln dazu sind gebaut und getestet. Etappe 3 füllt diese Struktur, statt
sie umzubauen.

Die Etappe ist bewusst in drei Scheiben geteilt. Nach der ersten lässt sich
beurteilen, ob die Suche im Alltag wirklich trifft — bevor der volle Aufwand
investiert ist.

### 3a — PDF

| | |
|---|---|
| **Ziel** | Passagen aus PDF-Unterlagen finden und in den Prompt legen |
| **Umfang** | groß (2–3 Arbeitssitzungen) |

Es entstehen: Import per Auswahl oder Hineinziehen, Textextraktion,
Zerlegung in zitierfähige Abschnitte, ein Stichwortindex im Gerätespeicher,
eine Trefferliste zum Ankreuzen sowie eine Verwaltung der abgelegten
Dokumente.

Offen bleibt bis zum Abschluss die Kernfrage: **Findet die Suche im Alltag
die richtigen Stellen?** Genau deshalb steht diese Scheibe zuerst.

### 3b — Word und Excel

| | |
|---|---|
| **Ziel** | Dieselbe Suche über Textdokumente und Tabellen |
| **Umfang** | mittel (etwa eine Arbeitssitzung) |

Tabellen brauchen eine eigene Zerlegung: zeilenweise, mit bei jedem
Ausschnitt mitgeführten Spaltenüberschriften. Sonst steht später „4.500" im
Prompt, ohne dass erkennbar wäre, wovon.

### 3c — Texterkennung für Scans und Bilder

| | |
|---|---|
| **Ziel** | Eingescannte Seiten und Fotos durchsuchbar machen |
| **Umfang** | mittel bis groß (1–2 Arbeitssitzungen) |

Texterkennung mit deutschem Sprachmodell, vollständig auf dem Gerät. Sie
läuft einmal beim Import, das Ergebnis wird gespeichert — so fällt der
Aufwand nur einmal je Dokument an. Auf dem Telefon ist sie spürbar langsam.

---

## Etappe 4 — Anbindung an KI-Anbieter

| | |
|---|---|
| **Ziel** | Antwort direkt in der Anwendung, mit eigenem Schlüssel |
| **Umfang** | mittel (1–2 Arbeitssitzungen) |

Eine einzige Anbieter-Schnittstelle statt einer Integration je Anbieter. Den
Anfang macht die OpenAI-kompatible Schnittstelle: Sie deckt mit einer
Implementierung OpenAI, OpenRouter, Groq sowie lokale Modelle über LM Studio
und Ollama ab. Über OpenRouter erreicht man mit einem Schlüssel faktisch alle
großen Modelle. Anthropic und Google folgen als optionale Direktanbindungen.

Dazu gehören ein sichtbarer Verbrauchszähler, ein Deckel je Anfrage und ein
unmissverständlicher Hinweis darauf, dass ab hier Text das Gerät verlässt.
Ollama bleibt die Möglichkeit, auch das lokal zu halten.

Diese Etappe steht bewusst **hinter** Etappe 3: Für alle ohne Schlüssel
ändert sie nichts, und der Teilen-Dialog ist auf Android ohnehin nur ein
Tippen entfernt.

---

## Etappe 5 — Semantische Suche und Feinschliff

| | |
|---|---|
| **Ziel** | Auch Umschreibungen finden; Verlauf und Bequemlichkeiten |
| **Umfang** | mittel |

Die Stichwortsuche findet Wörter, keine Bedeutungen. Eine zuschaltbare
semantische Suche ergänzt sie — entweder über ein lokales Modell oder über
einen hinterlegten Schlüssel. Sie ersetzt die Stichwortsuche nicht, sondern
läuft daneben.

Dazu: Verlauf erzeugter Prompts, Favoriten, Export.

---

## Offene Punkte

Diese Fragen sind fachlicher Natur und nicht durch Programmieren zu lösen.

- **Quellenkatalog prüfen.** Die rund 45 Einträge sind aus allgemeinem Wissen
  zusammengestellt. Was fehlt, was spielt im Unterricht keine Rolle, stimmen
  die Voreinstellungen? In der Anwendung unter „Bevorzugte Quellen"
  aufklappbar.
- **Fehlende Dateiformate.** Bekannt sind PDF, Word, Excel, Scans, Bilder und
  OneNote. Offen: PowerPoint, altes `.doc`, Markdown, einfache Textdateien.
- **OneNote.** Das Format lässt sich im Browser nicht lesen — es gibt keine
  brauchbare Bibliothek dafür. Der Weg führt über den Export nach PDF
  (OneNote: *Datei → Exportieren → Abschnitt → PDF*). Zu klären ist, wie viel
  Material dort liegt.

---

## Bewusst nicht geplant

Der Vollständigkeit halber, damit niemand danach sucht:

**Android-App als APK.**
Die Web-App lässt sich zum Startbildschirm hinzufügen und verhält sich danach
wie eine installierte Anwendung. Eine APK brächte zusätzlich nur die
abschreckende Warnung „Installation aus unbekannten Quellen" — auf verwalteten
Geräten ist sie ohnehin gesperrt.

**Google Play Store.**
25 € einmalig, für neue Privatkonten dazu 20 Tester über 14 Tage vor der
Freigabe, jede Aktualisierung mit Prüfung. Für ein Werkzeug, das über einen
Link erreichbar ist, kein sinnvoller Aufwand.

**Eigener Server mit geteiltem API-Schlüssel.**
Würde die Hürde für Nutzer senken, brächte aber laufende Kosten,
Missbrauchsschutz, Zugangsverwaltung und die Verantwortung für fremde Daten.

**Benutzerkonten und Abgleich zwischen Geräten.**
Widerspricht der Leitentscheidung, dass alles auf dem Gerät bleibt.
