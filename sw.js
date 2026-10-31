// Sube CACHE en cada sesión para que el móvil coja la versión nueva.
const CACHE = 'corea-v9';
const FILES = [
  './', './index.html', './styles.css', './app.js', './contenido.js', './diccionario.js', './manifest.json',
  './example.trip.json', './icons/icon.svg', './icons/icon-192.png',
  './icons/icon-512.png', './icons/apple-touch-icon.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

// Primero caché (offline); si no está, red.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request, { ignoreSearch: true })
    .then(r => r || fetch(e.request).catch(() => caches.match('./index.html'))));
});
