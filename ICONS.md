# PWA Icons erstellen

Die App benötigt PWA-Icons für die Installation. Hier ist die einfachste Methode:

## 🎨 Einfachste Methode: Icon Generator Tool

1. **Öffne `create-icons.html` im Browser**

   - Doppelklick auf die Datei oder öffne sie im Browser

2. **Klicke auf "Alle Icons herunterladen"**

   - Alle benötigten Icons werden automatisch heruntergeladen

3. **Speichere die Icons im Hauptverzeichnis**
   - `pwa-192x192.png`
   - `pwa-512x512.png`
   - `apple-touch-icon.png`
   - `favicon.ico`

## 📋 Benötigte Icons

Die App benötigt folgende Icons:

- ✅ `pwa-192x192.png` (192x192 Pixel) - Für PWA Installation
- ✅ `pwa-512x512.png` (512x512 Pixel) - Für PWA Installation
- ✅ `apple-touch-icon.png` (180x180 Pixel) - Für iOS
- ✅ `favicon.ico` (32x32 Pixel) - Browser Tab Icon

## 🔧 Alternative Methoden

### Option 1: Online-Tool

1. Gehe zu https://realfavicongenerator.net/
2. Lade ein Logo hoch (oder nutze das generierte Icon)
3. Generiere alle Icons
4. Lade sie herunter

### Option 2: Manuell erstellen

Erstelle die PNG-Dateien mit einem Bildbearbeitungsprogramm:

- Hintergrund: #0284c7 (Blau)
- Symbol: Weißes Häkchen (✓)
- Abgerundete Ecken (optional)

## ✅ Nach dem Erstellen

Stelle sicher, dass alle Icons im Hauptverzeichnis liegen:

```
Cool-APP/
├── pwa-192x192.png
├── pwa-512x512.png
├── apple-touch-icon.png
└── favicon.ico
```

Die Icons werden automatisch vom Service Worker gecacht und funktionieren offline!
