const CACHE_NAME = "cool-task-manager-v1";
const basePath = self.location.pathname.includes("/Cool-APP/")
  ? "/Cool-APP"
  : ".";
const urlsToCache = [
  basePath + "/",
  basePath + "/index.html",
  basePath + "/styles.css",
  basePath + "/app.js",
  basePath + "/manifest.json",
  basePath + "/sw.js",
  basePath + "/pwa-192x192.png",
  basePath + "/pwa-512x512.png",
  basePath + "/apple-touch-icon.png",
  basePath + "/favicon.ico",
];

// Install Event - Cache Resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Opened cache");
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error("Cache install failed:", error);
      })
  );
  self.skipWaiting();
});

// Activate Event - Clean Old Caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch Event - Serve from Cache, Fallback to Network
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache hit - return response
      if (response) {
        return response;
      }

      // Clone the request
      const fetchRequest = event.request.clone();

      return fetch(fetchRequest)
        .then((response) => {
          // Check if valid response
          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        })
        .catch(() => {
          // If fetch fails, try to serve offline page
          if (event.request.destination === "document") {
            return caches.match(basePath + "/index.html");
          }
        });
    })
  );
});

// Background Sync (optional - for offline actions)
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-data") {
    event.waitUntil(syncData());
  }
});

function syncData() {
  // Sync data when back online
  return Promise.resolve();
}
