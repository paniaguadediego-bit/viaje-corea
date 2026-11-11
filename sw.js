// Sube CACHE en cada sesión (y VERSION en app.js) para que el móvil coja la versión nueva.
const CACHE = 'corea-v206';
// Fotos de Wikipedia: caché aparte que no se borra al actualizar la app.
const FOTOS = 'corea-fotos';
// Calles del mapa (OpenStreetMap): solo las zonas que se han visto; tampoco se borra al actualizar.
const MAPA = 'corea-mapa';
const FILES = [
  './', './index.html', './styles.css', './app.js', './contenido.js', './diccionario.js', './historia.js', './cultura.js', './hangul.js', './exportar.js', './sociedad.js', './ciudades.js', './manifest.json',
  './example.trip.json', './data/comer.json', './data/coords.json', './data/metro.json', './icons/icon.svg', './icons/icon-192.png',
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
    .then(keys => Promise.all(keys.filter(k => k !== CACHE && k !== FOTOS && k !== MAPA).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

// Con conexión: primero la red (así llegan siempre las versiones nuevas) y se guarda copia.
// Sin conexión o si la red tarda más de 3 s: la copia guardada.
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const host = new URL(req.url).hostname;
  // Fotos y resúmenes de Wikipedia: primero lo guardado; si no, red y se guarda.
  if (/(^|\.)(wikipedia|wikimedia)\.org$/.test(host)) {
    // Se piden con CORS para que el Word y el PDF del resumen puedan leer la foto; las guardadas antes "opacas" se renuevan con conexión.
    e.respondWith(caches.open(FOTOS).then(async c => {
      const g = await c.match(req.url); if (g && g.type !== 'opaque') return g;
      try { const r = await fetch(req.url, { mode: 'cors', credentials: 'omit' }); if (r.ok) { c.put(req.url, r.clone()); return r; } } catch {}
      if (g && req.mode !== 'cors') return g;
      const r = await fetch(req); if (r.ok || r.type === 'opaque') c.put(req.url, r.clone()); return r;
    }));
    return;
  }
  if (host === 'tile.openstreetmap.org') {
    e.respondWith(caches.open(MAPA).then(async c => {
      const g = await c.match(req.url); if (g) return g;
      // Se pide con CORS (ocupa menos en el móvil); si no, como venga.
      let r; try { r = await fetch(req.url, { mode: 'cors', credentials: 'omit' }); } catch { r = await fetch(req); }
      if (r.ok || r.type === 'opaque') c.put(req.url, r.clone()); return r;
    }));
    return;
  }
  if (new URL(req.url).origin !== location.origin) return;
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
