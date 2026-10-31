// Sube CACHE en cada sesión (y VERSION en app.js) para que el móvil coja la versión nueva.
const CACHE = 'corea-v23';
const FILES = [
  './', './index.html', './styles.css', './app.js', './contenido.js', './diccionario.js', './manifest.json',
  './example.trip.json', './data/comer.json', './data/coords.json', './icons/icon.svg', './icons/icon-192.png',
  './icons/icon-512.png', './icons/apple-touch-icon.png'
];

self.addEventListener('install', e => {
  // cache: 'reload' evita guardar copias viejas que el navegador tenga en memoria.
  e.waitUntil(caches.open(CACHE)
    .then(c => c.addAll(FILES.map(f => new Request(f, { cache: 'reload' }))))
    .then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

// Con conexión: primero la red (así llegan siempre las versiones nuevas) y se guarda copia.
// Sin conexión o si la red tarda más de 3 s: la copia guardada.
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const red = fetch(req, { cache: 'no-cache' }).then(r => {
      if (r.ok) cache.put(req, r.clone());
      return r;
    });
    const guardada = await cache.match(req, { ignoreSearch: true });
    const tiempo = new Promise(ok => setTimeout(ok, 3000));
    try {
      const r = await (guardada ? Promise.race([red, tiempo]) : red);
      if (r) return r;
    } catch (err) { /* sin conexión */ }
    return guardada || (await cache.match('./index.html')) || Response.error();
  })());
});
