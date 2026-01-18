const CACHE_NAME = 'rt-pro-v3'; // Incremented version to force update
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Install & Cache Core Assets
self.addEventListener('install', (e) => {
  // Force the waiting service worker to become the active service worker immediately
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

// Activate Event: Clean up old caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    })
  );
});

// Fetch Logic
self.addEventListener('fetch', (e) => {
  // 1. FIX: Ignore POST requests entirely. 
  // This ensures quiz submissions (doPost) go straight to the network.
  if (e.request.method === 'POST') {
    return; 
  }

  // 2. BYPASS CACHE FOR GOOGLE SCRIPTS (doGet)
  if (e.request.url.includes('script.google.com')) {
    e.respondWith(
      fetch(e.request).catch(() => {
        // If totally offline, return null
        return null;
      })
    );
    return;
  }

  // 3. DEFAULT CACHE STRATEGY (Network-first or Cache-fallback)
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    })
  );
});
