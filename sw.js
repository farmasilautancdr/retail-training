const CACHE_NAME = 'retail-training-v2.1.0';
const ASSETS = [
  './',
  './index.html',
  'https://cdn.tailwindcss.com'
];

// Install Event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

// Fetch Event (Network First, then Cache)
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});