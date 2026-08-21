// Keep Alive — Alquemis — Service Worker
// Cache mínimo para permitir instalación PWA y carga instantánea del shell.
// Las llamadas a Supabase (*.supabase.co) NUNCA se cachean: siempre deben ir a la red.

const CACHE_NAME = 'keep-alive-shell-v1';
const SHELL_FILES = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon-32.png',
  './icons/favicon-16.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_FILES)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  // Nunca interceptar llamadas a Supabase (deben ser siempre en vivo).
  if (url.includes('.supabase.co')) return;

  // Solo manejar GET del propio origen (shell de la app).
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            try { cache.put(event.request, copy); } catch (e) {}
          });
          return response;
        })
        .catch(() => cached);
    })
  );
});
