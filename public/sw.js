const CACHE_NAME = 'ats-ops-cache-v4';
const OFFLINE_ASSETS = [
  '/',
  '/admin',
  '/chef',
  '/app',
  '/portal-manifest.json',
  '/manifest.json',
  '/favicon.ico',
  '/brand/ats-monogram.png',
  '/brand/allthesmoke-master-crest.png',
  '/icons/portal-icon-192.png',
  '/icons/portal-icon-512.png',
  '/icons/portal-touch-icon.png',
  '/icons/customer-icon-192.png',
  '/icons/customer-icon-512.png',
  '/icons/customer-touch-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(OFFLINE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request).catch(() =>
      caches.match(event.request).then((cached) => cached || caches.match('/'))
    )
  );
});
