# Durchsicht des Quellenkatalogs

Vorbereitung für [Issue #1](https://github.com/davuuuud/DAA_Prompt_Gen/issues/1)
— den wichtigsten offenen Punkt des Projekts.

## Warum das nötig ist

Die Fragenschmiede schreibt in jeden Prompt hinein, auf welche Quellen sich die
KI stützen soll. Diese Liste steuert damit unmittelbar, wie brauchbar die
Antwort ausfällt: Eine falsch zugeordnete Quelle lenkt das Modell in die
falsche Richtung, eine fehlende lässt es ins Allgemeine ausweichen.

Die bisherige Zuordnung stammt aus allgemeinem Wissen, **nicht aus
Unterrichtserfahrung.** Sie muss von Menschen durchgesehen werden, die die
Berufe tatsächlich unterrichten.

## Was hier liegt

| Datei | Zweck |
|---|---|
| `daten.mjs` | Alle Vorschläge — allgemeine Liste und je Beruf. Die einzige Stelle zum Ändern. |
| `erzeugen.mjs` | Erzeugt daraus die Durchsichtsbögen. |
| `blaetter/<KÜRZEL>.html` | Ein Bogen je Beruf. Das, was verschickt wird. |
| `blaetter/_uebersicht.html` | Nur zur eigenen Vorbereitung, **nicht** verschicken. |

Neu erzeugen nach jeder Änderung an `daten.mjs`:

```bash
node quellen-durchsicht/erzeugen.mjs
```

## Umfang

47 allgemeine Quellen plus 3 bis 19 berufseigene, zusammen **235 Vorschläge**.
Jeder Bogen zeigt die allgemeine Liste und die eigene des Berufs — niemand
bekommt 235 Zeilen vorgelegt.

## Aufbau eines Bogens

1. **Teil 1 — Quellen für alle Berufe.** Erscheint bei jedem Beruf. Wird ein
   Eintrag hier gestrichen, ist das die wertvollste Rückmeldung überhaupt:
   Dann steht er an der falschen Stelle.
2. **Teil 2 — Nur bei diesem Beruf.**
3. **Teil 3 — Was fehlt?** Der wichtigste Teil. Zwölf Leerzeilen.
4. **Teil 4 — Zwei Fragen.** Welche drei Quellen sind die wichtigsten, und wo
   geht die KI erfahrungsgemäß in die Irre?

Je Zeile drei Kästchen: *kommt vor*, *streichen*, *voreinstellen* — dazu eine
Spalte für Anmerkungen.

Die Bögen sind eigenständige HTML-Dateien ohne Verweise nach außen. Sie lassen
sich als Anhang verschicken, im Browser öffnen, ausfüllen und über
*Drucken → Als PDF speichern* zurückschicken — oder schlicht ausdrucken.

## Ablauf

1. Je Beruf einen Ansprechpartner benennen.
2. Bogen und Anschreiben verschicken.
3. Rückläufe sammeln (Tabelle unten).
4. Auswerten (Regeln unten).
5. `src/lib/domain/quellen.ts` anpassen und `DEFAULT_QUELLEN` neu setzen.

## Anschreiben

> **Betreff:** Kurze fachliche Durchsicht — welche Quellen gehören zu *[BERUF]*?
>
> Hallo [NAME],
>
> ich habe ein kleines Werkzeug gebaut, das Umschülerinnen und Umschülern hilft,
> brauchbare Fragen an eine KI zu stellen — statt einer allgemeinen Antwort
> eine, die zum Beruf, zum Niveau und zur Abschlussprüfung passt.
>
> Damit das funktioniert, steht in jeder Frage, auf welche Quellen sich die
> Antwort stützen soll. Genau diese Liste habe ich nach bestem Wissen
> zusammengestellt — aber ich unterrichte den Beruf nicht. Deshalb meine Bitte:
>
> Im Anhang ist ein Bogen mit den Quellen, die derzeit für *[BERUF]*
> hinterlegt sind. Würdest du ankreuzen, was tatsächlich vorkommt, was
> gestrichen gehört — und vor allem ergänzen, was fehlt?
>
> Das dauert etwa 20 bis 30 Minuten. Die Datei lässt sich im Browser öffnen und
> am Bildschirm ausfüllen (Kästchen anklicken, dann *Drucken → Als PDF
> speichern*) oder ausdrucken und von Hand ausfüllen — wie es dir lieber ist.
>
> Wo du unsicher bist, lass die Zeile einfach leer. Auch das ist eine Auskunft.
>
> Rückmeldung bis [DATUM] wäre großartig.
>
> Viele Grüße
> [ABSENDER]
>
> PS: Das Werkzeug ist ein privates Projekt und kein offizielles Angebot der
> DAA. Ansehen kann man es hier: https://davuuuud.github.io/DAA_Prompt_Gen/

## Rückläufe

| Beruf | Ansprechpartner | verschickt | zurück | eingearbeitet |
|---|---|---|---|---|
| KGQ | | | | |
| EHK | | | | |
| FISI | | | | |
| FKL | | | | |
| FKS | | | | |
| GAM | | | | |
| IK | | | | |
| IMK | | | | |
| KBM | | | | |
| KEC | | | | |
| KiG | | | | |
| PDK | | | | |
| SFA | | | | |
| SL | | | | |

## Auswertungsregeln

Vorschläge, damit die Entscheidung nicht bei jeder Zeile neu getroffen werden
muss:

**Allgemeine Liste.** Streichen drei oder mehr Ansprechpartner denselben
Eintrag, wandert er aus der allgemeinen Liste heraus und nur zu den Berufen,
die ihn behalten wollen. Bei ein bis zwei Streichungen bleibt er allgemein —
eine einzelne abweichende Einschätzung ist noch kein Muster.

**Voreinstellung.** Nur was mindestens die Hälfte der Ansprechpartner
voreingestellt haben will, wird voreingestellt. `DEFAULT_QUELLEN` sollte kurz
bleiben: Sechs bis acht Einträge, nicht zwanzig. Ein Prompt, der zwanzig
Quellen nennt, gewichtet keine davon.

**Ergänzungen.** Alles, was in Teil 3 genannt wird, kommt in den Katalog —
auch wenn es nur eine Person nennt. Wer eine Quelle vermisst, hat einen Grund
dafür, und der Preis eines zusätzlichen Eintrags ist eine Zeile.

**Widersprüche.** Wenn zwei Ansprechpartner desselben Berufs sich
widersprechen, entscheidet nicht die Mehrheit, sondern ein Rückruf. Meist
steckt dahinter, dass sie unterschiedliche Prüfungsteile oder Lernfelder im
Blick haben — dann sind beide Antworten richtig und die Quelle gehört hinein.

**Die zwei Fragen aus Teil 4** gehen nicht in den Katalog, sondern in die
Roadmap: Die drei wichtigsten Quellen je Beruf sind die Kandidaten für
`DEFAULT_QUELLEN`. Die Antworten zu „wo geht die KI in die Irre" sind
Kandidaten für zusätzliche Warnregeln im Prompt.

## Grenzen dieser Vorbereitung

Die Liste ist ein **Vorschlag**, kein Katalog. Sie enthält mit Sicherheit
Einträge, die im Unterricht keine Rolle spielen, und es fehlen mit Sicherheit
welche, die dort zentral sind. Das ist kein Mangel der Vorbereitung, sondern
ihr Zweck: Es ist leichter, eine falsche Liste zu korrigieren als eine leere
zu füllen.

Besonders unsicher bin ich bei:

- **KGQ** — kein geregelter Beruf, keine Ausbildungsordnung. Die drei
  vorgeschlagenen Einträge sind eher eine Frage als eine Antwort.
- **KiG** — hängt stark davon ab, welche Einrichtungsart überwiegt:
  Krankenhaus, Krankenkasse, Pflege oder Praxis.
- **Rechtsprechung** — bei den meisten Kammerprüfungen vermutlich entbehrlich.
  Ausnahmen: IMK und SFA.
- **FISI und FKS** — beide nicht kaufmännisch. Dort passt die allgemeine Liste
  am schlechtesten.
