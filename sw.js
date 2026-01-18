const CACHE_NAME = 'rt-pro-v2';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Install & Cache Core Assets
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

// Fetch Logic
self.addEventListener('fetch', (e) => {
  // BYPASS CACHE FOR GOOGLE SCRIPTS
  if (e.request.url.includes('script.google.com')) {
    e.respondWith(
      fetch(e.request).catch(() => {
        // If totally offline, return nothing so the app knows it's offline
        return null;
      })
    );
    return;
  }

  // DEFAULT CACHE STRATEGY FOR EVERYTHING ELSE
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    })
  );
});
