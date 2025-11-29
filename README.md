# Cool Task Manager - PWA

Eine umfassende Progressive Web App (PWA) für Projekt- und Task-Management, gebaut mit reinem HTML, CSS und JavaScript - **OHNE Build Tools!**

## 🚀 Features

- ✅ **Progressive Web App** - Installierbar auf allen Geräten
- 📱 **Offline-Funktionalität** - Service Worker für Offline-Nutzung
- 🎨 **Dark Mode** - Automatisches Theme-Switching
- 📊 **Mehrere Ansichten** - Dashboard, Kanban, Liste, Kalender
- 🔔 **Benachrichtigungen** - Echtzeit-Updates
- 💾 **Lokale Speicherung** - Alle Daten werden lokal gespeichert
- 📤 **Export-Funktion** - JSON Export
- 🎯 **Drag & Drop** - Aufgaben im Kanban Board verschieben

## 📁 Projektstruktur

```
Cool-APP/
├── index.html              # Haupt-HTML-Datei
├── styles.css              # Alle Styles
├── app.js                  # Alle JavaScript-Logik
├── sw.js                   # Service Worker (MANUELL!)
├── manifest.json           # PWA Manifest
├── create-icons.html       # Icon Generator Tool
└── [Icons]                 # PWA Icons (siehe ICONS.md)
```

## 🎨 Icons erstellen (WICHTIG!)

**Bevor du die App verwendest, musst du die PWA-Icons erstellen:**

1. Öffne `create-icons.html` im Browser
2. Klicke auf "Alle Icons herunterladen"
3. Speichere die Icons im Hauptverzeichnis

Siehe `ICONS.md` für Details.

## 🛠️ Entwicklung

**Keine Installation nötig!** Öffne einfach `index.html` im Browser oder nutze einen lokalen Server:

```bash
# Mit Python
python -m http.server 8000

# Mit Node.js (http-server)
npx http-server

# Mit PHP
php -S localhost:8000
```

Dann öffne: `http://localhost:8000/Cool-APP/`

## 📦 Deployment auf GitHub Pages

### Automatisches Deployment (GitHub Actions)

1. Repository auf GitHub erstellen (Name: `Cool-APP`)
2. Code pushen zu `main` Branch
3. GitHub Actions deployed automatisch
4. App verfügbar unter: `https://DEIN-USERNAME.github.io/Cool-APP/`

### Manuelles Deployment

```bash
npm install
npm run deploy
```

## 📱 PWA Installation

Nach dem Deployment:

1. Öffne die App im Browser
2. Klicke auf "Zum Startbildschirm hinzufügen" (Browser-Menü)
3. Die App wird installiert und funktioniert offline!

## 🎨 Tech Stack

- **HTML5** - Semantisches Markup
- **CSS3** - Modernes Styling mit CSS Variables
- **Vanilla JavaScript** - Keine Frameworks!
- **Service Worker** - Manuell implementiert
- **LocalStorage** - Datenpersistenz

## 📄 Lizenz

MIT
