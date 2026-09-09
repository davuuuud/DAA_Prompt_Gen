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

## Inhaltliche Überarbeitung

**Kommt vor Etappe 3.** Nicht weil es dringender wäre, sondern weil es billig
ist und alles Weitere darauf aufbaut: Wer erst Dokumente durchsuchbar macht
und danach die Kataloge umstellt, baut die Oberfläche zweimal.

Das meiste hier ist keine Programmierarbeit, sondern fachliche Entscheidung.
Bei jedem Punkt steht deshalb, wer ihn entscheiden kann.

### Welche Quellen sind bei welchem Beruf relevant?

> **Der wichtigste offene Punkt des ganzen Projekts.**

Der Quellenkatalog ordnet rund 45 Einträge den Ausbildungsberufen zu — ein
Immobilienkaufmann sieht WEG, MaBV und BetrKV, ein Bankkaufmann KWG, WpHG und
ZAG. Diese Zuordnung stammt aus allgemeinem Wissen, **nicht aus
Unterrichtserfahrung.**

Genau daran hängt aber die Qualität der erzeugten Prompts: Eine falsch
zugeordnete Quelle lenkt das Sprachmodell in die falsche Richtung, eine
fehlende lässt es ins Allgemeine ausweichen.

Zu erheben ist je Beruf:

- Welche Gesetze und Verordnungen kommen im Unterricht **tatsächlich** vor?
- Welche stehen im Katalog, spielen aber keine Rolle?
- Welche fehlen?
- Welche sollten **voreingestellt** sein, weil sie fast immer passen?

*Entscheiden können das nur Lehrkräfte und Fachleute.* In der Anwendung ist
der Katalog unter „Bevorzugte Quellen" aufklappbar und damit gut als
Gesprächsgrundlage nutzbar.

### Kataloge prüfen

**Ausbildungsberufe** — Welche werden tatsächlich unterrichtet? Welche im
Katalog sind überflüssig, welche fehlen? *Fachliche Entscheidung.*

**Aufgabenarten** — Zwölf Einträge, von „Thema erklären" bis „Fallstudie".
Sind sie zu fein aufgeteilt, sodass die Auswahl unübersichtlich wird? Werden
manche nie benutzt? Fehlen Arbeitsformen, die im Unterricht vorkommen?
*Vorschlag von der Entwicklung, Entscheidung fachlich.*

**Niveau und Ausgabeform** — Stimmen die vier Niveaustufen und die sechs
Ausgabeformen? Sind die Abstände sinnvoll, oder liegen zwei Stufen so dicht
beieinander, dass niemand sie unterscheiden kann? *Vorschlag von der
Entwicklung, Entscheidung fachlich.*

### Reihenfolge und Nummerierung

Die Reihenfolge der Einträge innerhalb der vier Auswahlfelder ist bisher nicht
begründet, sondern gewachsen.

Beim **Niveau** ist die Reihenfolge in Wahrheit eine Rangfolge: von „Sehr
einfach" bis „Vertieft". Eine sichtbare Nummerierung (1 bis 4) würde das
deutlich machen, statt es dem Zufall der Anordnung zu überlassen.

Zu klären:

- Nummerierung nur beim Niveau, oder auch bei den anderen drei Feldern?
- Wonach sollen Berufe, Aufgaben und Ausgabeformen sortiert sein — nach
  Häufigkeit der Nutzung, alphabetisch oder nach inhaltlicher Nähe?

### Optionen und Voreinstellungen

Derzeit fünf Optionen, vier davon voreingestellt an.

Zu prüfen ist beides: **Welche werden wirklich gebraucht**, und **welche
Voreinstellung ist richtig?** Eine Option, die niemand je abwählt, kann
genauso gut eine feste Regel im Prompt sein — eine, die niemand je anwählt,
kann verschwinden. Beides macht die Oberfläche ruhiger.

### Name der Anwendung

„IHK-Lernassistent" ist ein Arbeitstitel. Der Name erscheint in der
Fensterleiste, unter dem Symbol auf dem Startbildschirm und in der Anwendung
selbst — ein Wechsel ist später zwar möglich, aber jeder, der die Anwendung
schon installiert hat, behält den alten Namen unter dem Symbol.

*Also besser früh entscheiden.* Zu beachten: „IHK" ist eine geschützte
Bezeichnung; eine Anwendung, die nicht von einer Industrie- und
Handelskammer stammt, sollte nicht den Eindruck erwecken, es handle sich um
ein offizielles Angebot.

### Einleitungstext

Die zwei Zeilen unter der Überschrift sind das Erste, was jemand liest, der
die Anwendung nicht kennt. Sie sollen in einem Atemzug beantworten: Was macht
das, für wen ist es, und was passiert mit meinen Eingaben.

Der jetzige Text nennt das Ergebnis („strukturierte Lern-Prompts") und die
Datensparsamkeit, sagt aber nicht, **wofür** man den Prompt anschließend
benutzt. Wer noch nie mit einem Sprachmodell gearbeitet hat, steht davor und
weiß nicht, was zu tun ist.

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

## Offen: Veröffentlichung in den App-Stores

Diese Frage war zunächst verneint und ist wieder offen. Sie betrifft nur die
**Verteilung** — die Anwendung selbst bliebe dieselbe.

Zum Vergleich der heutige Zustand: Die Web-App lässt sich über den Link zum
Startbildschirm hinzufügen und verhält sich danach wie eine installierte
Anwendung. Das kostet nichts, ist sofort verfügbar und aktualisiert sich von
selbst.

| | Google Play | Apple App Store |
|---|---|---|
| Konto | 25 € einmalig | 99 € pro Jahr |
| Technische Voraussetzung | keine besondere | **macOS mit Xcode zwingend** |
| Vor der Freigabe | 20 Tester über 14 Tage (neue Privatkonten) | Prüfung, meist 1–3 Tage |
| Jede Aktualisierung | Prüfung | Prüfung |
| Öffentlich sichtbar | Name und Anschrift bei Privatkonten | Entwicklername |

Drei Punkte, die vor einer Entscheidung feststehen sollten:

**Der Mac ist keine Formalie.** Eine signierte iOS-App lässt sich unter
Windows nicht bauen — entweder ein Mac oder ein kostenpflichtiger Cloud-Dienst.

**Apples Richtlinie 4.2 „Minimum Functionality"** ist ein reales Risiko:
Anwendungen, die im Kern ein Formular sind und deren Ergebnis anderswo
weiterverwendet wird, werden regelmäßig mit der Begründung abgelehnt, das
könne auch eine Website sein. Planbar ist das nicht.

**Der Gewinn ist begrenzt.** Auffindbarkeit über die Suche in den Stores —
das ist der einzige echte Vorteil gegenüber einem Link. Ob das den Aufwand
rechtfertigt, hängt allein daran, ob die Anwendung über den bekannten Kreis
hinaus gefunden werden soll.

*Zwischenweg, falls es doch ein Store sein soll:* Zuerst nur Google Play. Der
Aufwand ist ein Bruchteil, das Risiko einer Ablehnung gering, und man sieht,
ob überhaupt jemand danach sucht.

---

## Vor Etappe 3 zu klären

- **Fehlende Dateiformate.** Bekannt sind PDF, Word, Excel, Scans, Bilder und
  OneNote. Offen: PowerPoint, altes `.doc`, Markdown, einfache Textdateien.
- **OneNote.** Das Format lässt sich im Browser nicht lesen — es gibt keine
  brauchbare Bibliothek dafür. Der Weg führt über den Export nach PDF
  (OneNote: *Datei → Exportieren → Abschnitt → PDF*). Zu klären ist, wie viel
  Material dort liegt.

Die fachlichen Fragen zu Katalogen, Quellen, Namen und Einleitung stehen
weiter oben im Abschnitt [Inhaltliche
Überarbeitung](#inhaltliche-überarbeitung).

---

## Bewusst nicht geplant

Der Vollständigkeit halber, damit niemand danach sucht:

**APK zur direkten Weitergabe.**
Gemeint ist das Verschicken einer Installationsdatei außerhalb der Stores.
Die Web-App lässt sich über den Link zum Startbildschirm hinzufügen und
verhält sich danach wie eine installierte Anwendung; eine APK brächte
zusätzlich nur die abschreckende Warnung „Installation aus unbekannten
Quellen", und auf verwalteten Geräten ist sie ohnehin gesperrt. Für die
Veröffentlichung **in** einem Store siehe den offenen Punkt weiter oben — das
ist eine andere Frage.

**Eigener Server mit geteiltem API-Schlüssel.**
Würde die Hürde für Nutzer senken, brächte aber laufende Kosten,
Missbrauchsschutz, Zugangsverwaltung und die Verantwortung für fremde Daten.

**Benutzerkonten und Abgleich zwischen Geräten.**
Widerspricht der Leitentscheidung, dass alles auf dem Gerät bleibt.
