# Deployment auf GitHub Pages

## Vorbereitung

1. **Repository auf GitHub erstellen**

   - Erstelle ein neues Repository namens `Cool-APP` (oder passe den Namen in `vite.config.ts` an)

2. **Dependencies installieren**

   ```bash
   npm install
   ```

3. **PWA Icons erstellen**
   - Siehe `ICONS.md` für Anleitung
   - Oder verwende: https://realfavicongenerator.net/
   - Benötigte Icons:
     - `public/pwa-192x192.png`
     - `public/pwa-512x512.png`
     - `public/apple-touch-icon.png` (180x180)

## GitHub Pages Setup

### Option 1: Automatisches Deployment via GitHub Actions (Empfohlen)

1. **GitHub Repository Settings**

   - Gehe zu Settings → Pages
   - Source: "GitHub Actions"

2. **Code pushen**

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/DEIN-USERNAME/Cool-APP.git
   git push -u origin main
   ```

3. **Automatisches Deployment**
   - Bei jedem Push zu `main` wird automatisch deployed
   - Workflow: `.github/workflows/deploy.yml`

### Option 2: Manuelles Deployment

```bash
npm run build
npm run deploy
```

## Wichtige Konfigurationen

- **Base Path**: `/Cool-APP/` (in `vite.config.ts`)
- **Repository Name**: Muss `Cool-APP` heißen (oder Base Path anpassen)
- **GitHub Pages URL**: `https://DEIN-USERNAME.github.io/Cool-APP/`

## PWA Installation

Nach dem Deployment:

1. Öffne die App im Browser
2. Klicke auf "Zum Startbildschirm hinzufügen" (Browser-Menü)
3. Die App wird installiert und funktioniert offline!

## Troubleshooting

- **404 Fehler**: Stelle sicher, dass der Base Path in `vite.config.ts` dem Repository-Namen entspricht
- **Icons fehlen**: Erstelle die PWA Icons (siehe `ICONS.md`)
- **Service Worker funktioniert nicht**: Stelle sicher, dass die App über HTTPS läuft (GitHub Pages macht das automatisch)
