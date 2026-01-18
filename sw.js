const CACHE_NAME = 'rt-pro-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Install Service Worker
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});

// Fetch Strategy
self.addEventListener('fetch', (e) => {
  // IMPORTANT: Let Google Script requests go through without caching
  if (e.request.url.includes('script.google.com')) {
    return fetch(e.request);
  }
  
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});
