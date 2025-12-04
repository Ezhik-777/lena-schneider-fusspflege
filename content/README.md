# Content Management - Anleitung für den Kunden

## 📁 Ordnerstruktur

Alle bearbeitbaren Inhalte befinden sich im Ordner **`content/`**:

```
content/
├── homepage.md           # Hauptseite (alle Texte)
├── wir-ziehen-um.md     # Temporäre "Wir ziehen um" Seite
├── impressum.md         # Impressum / Rechtliche Hinweise
├── datenschutz.md       # Datenschutzerklärung
└── README.md            # Diese Anleitung
```

---

## ✏️ Wie Sie Inhalte bearbeiten

### 1. Datei öffnen
- Öffnen Sie die gewünschte `.md` Datei mit einem Texteditor
- **Empfohlen:** VS Code, Notepad++, oder einen einfachen Text-Editor
- **NICHT empfohlen:** Microsoft Word (kann Formatierung zerstören)

### 2. Text ändern
- Ändern Sie nur den **Text nach den Überschriften**
- **NICHT ändern:** Markdown-Formatierung (`#`, `**`, `-`, etc.)
- Speichern Sie die Datei nach der Bearbeitung

### 3. Änderungen hochladen
- Laden Sie die geänderte Datei auf den Server hoch
- Oder: Senden Sie sie an Ihren Entwickler

---

## 📝 Markdown Grundlagen

### Überschriften
```markdown
# Große Überschrift (H1)
## Mittlere Überschrift (H2)
### Kleine Überschrift (H3)
```

### Textformatierung
```markdown
**Fettgedruckter Text**
*Kursiver Text*
```

### Listen
```markdown
- Listenpunkt 1
- Listenpunkt 2
- Listenpunkt 3

1. Nummerierter Punkt 1
2. Nummerierter Punkt 2
```

### Links
```markdown
[Linktext](https://example.com)
```

### Emojis
```markdown
🎉 ✨ 💙 ✅ ⚠️
# Kopieren Sie einfach Emojis aus dem Internet
```

---

## 🎯 Häufige Aufgaben

### Homepage Texte ändern

**Datei:** `content/homepage.md`

1. **Hero-Text ändern:**
   - Suchen Sie nach `## Hero Sektion`
   - Ändern Sie den Text unter `### Überschrift`

2. **Preise ändern:**
   - Suchen Sie nach `## Leistungen Sektion`
   - Ändern Sie Preis/Dauer bei der gewünschten Leistung

3. **Öffnungszeiten ändern:**
   - Suchen Sie nach `#### Öffnungszeiten`
   - Ändern Sie die Zeiten

**Beispiel:**
```markdown
#### Öffnungszeiten
**Nur nach Terminvereinbarung**

**Mögliche Zeiten:**
- Mo - Fr: 09:00 - 18:00 Uhr  ← HIER ÄNDERN
- Sa: 09:00 - 14:00 Uhr       ← HIER ÄNDERN
```

### Impressum aktualisieren

**Datei:** `content/impressum.md`

1. **Adresse ändern:**
   - Suchen Sie nach `## Angaben gemäß § 5 TMG`
   - Ändern Sie Name, Adresse, etc.

2. **Kontaktdaten ändern:**
   - Suchen Sie nach `## Kontakt`
   - Ändern Sie Telefon und E-Mail

**⚠️ WICHTIG:** Rechtliche Texte (Haftung, Urheberrecht) **NICHT ändern** ohne Anwalt!

### Datenschutz aktualisieren

**Datei:** `content/datenschutz.md`

1. **Firmeninformationen ändern:**
   - Suchen Sie nach `## 2. Verantwortliche Stelle`
   - Ändern Sie Name, Adresse, Kontakt

2. **Externe Dienste:**
   - Suchen Sie nach `## 6. Externe Dienste und Tools`
   - **Google Analytics NICHT nutzen?** → Abschnitt löschen
   - **Kein Telegram?** → Abschnitt löschen

**⚠️ WICHTIG:** Bei Unsicherheit immer Datenschutzbeauftragten fragen!

### "Wir ziehen um" Seite anpassen

**Datei:** `content/wir-ziehen-um.md`

1. **Fertigstellungsdatum eintragen:**
   - Suchen Sie nach `## Geschätzte Fertigstellung`
   - Tragen Sie das Datum ein

2. **Texte anpassen:**
   - Ändern Sie alle Texte nach Belieben
   - Diese Seite wird nur temporär genutzt

---

## ⚠️ Wichtige Hinweise

### DO's ✅
- ✅ Texte und Preise ändern
- ✅ Öffnungszeiten aktualisieren
- ✅ Kontaktdaten anpassen
- ✅ Emojis hinzufügen/entfernen
- ✅ Leistungsbeschreibungen ändern
- ✅ Neue Leistungen hinzufügen (nach Vorlage)

### DON'Ts ❌
- ❌ Markdown-Formatierung zerstören
- ❌ Rechtliche Texte ohne Anwalt ändern
- ❌ Dateien in Word öffnen
- ❌ Dateinamen ändern
- ❌ Ordnerstruktur ändern
- ❌ HTML-Code einfügen

---

## 🆘 Hilfe & Support

### Fehler gemacht?
1. **Sicherungskopie:** Stellen Sie die Original-Datei wieder her
2. **Entwickler kontaktieren:** Ihr Webentwickler kann helfen
3. **Git Historie:** Entwickler kann alte Version wiederherstellen

### Fragen?
- **Markdown Tutorial:** https://www.markdownguide.org/basic-syntax/
- **Emoji Finder:** https://emojipedia.org/
- **VS Code (kostenlos):** https://code.visualstudio.com/

### Entwickler kontaktieren
Bei technischen Fragen oder Problemen wenden Sie sich an Ihren Webentwickler.

---

## 🎨 Beispiele

### Neue Leistung hinzufügen

**In:** `content/homepage.md` → `## Leistungen Sektion`

```markdown
#### 8. Nagellackierung
**Preis:** 15 €
**Dauer:** 15 Min.

**Beschreibung:**
Professionelle Nagellackierung mit hochwertigen Lacken.

**Leistungen:**
- Farbauswahl
- Präzise Lackierung
- Schnelle Trocknung
- Langanhaltend
```

### Rabatt-Aktion hinzufügen

**In:** `content/homepage.md` → `## Hero Sektion`

```markdown
## Aktuelle Aktion
🎉 **WINTER-SPECIAL:** Bis 31.12.2024 - 20% auf alle Massagen!
```

### Social Media Links hinzufügen

**In:** `content/homepage.md` → `## Footer`

```markdown
### Social Media
- Facebook: https://facebook.com/fusspflege.lena.schneider
- Instagram: https://instagram.com/fusspflege.lena.schneider
```

---

## 📊 Checkliste: Vor dem Go-Live

Bevor die Website online geht, prüfen Sie:

- [ ] Alle Kontaktdaten korrekt (Telefon, E-Mail, Adresse)
- [ ] Öffnungszeiten aktuell
- [ ] Alle Preise korrekt
- [ ] Impressum vollständig
- [ ] Datenschutzerklärung korrekt (Dienste aufgeführt)
- [ ] Keine Tippfehler
- [ ] "Wir ziehen um" Seite deaktiviert (nach Go-Live)

---

## 🔄 Änderungen aktivieren

Nach der Bearbeitung:

1. **Speichern Sie die Datei**
2. **Zwei Möglichkeiten:**
   - **A) FTP Upload:** Laden Sie die Datei auf den Server
   - **B) Entwickler:** Senden Sie die Datei an Ihren Entwickler

3. **Cache leeren:**
   - Browser: Strg + F5 (Windows) oder Cmd + Shift + R (Mac)
   - Vercel: Automatisch nach ~30 Sekunden

4. **Prüfen Sie die Änderungen** auf der Website

---

**Viel Erfolg mit Ihrer Website!** 🚀

Bei Fragen stehen wir Ihnen gerne zur Verfügung.

---

**Letzte Aktualisierung:** 2024-12-04
