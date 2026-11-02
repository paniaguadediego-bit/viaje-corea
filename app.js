'use strict';

// Versión visible arriba. Súbela a la vez que CACHE en sw.js.
const VERSION = 'v64';

// ---------- utilidades ----------
const $ = s => document.querySelector(s);
const esc = v => String(v ?? '').replace(/[&<>"']/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const arr = v => (Array.isArray(v) ? v : []);
// Clave estable para marcar algo como verificado en este móvil.
const vKey = o => 'v:' + String((o && (o.id || o.tramo || o.ko || o.es || o.nombre || (o.de && o.a ? o.de + '>' + o.a : '') || o.producto)) || '');
const verificado = k => !!(user && user.verif && user.verif[k]);
const ver = o => (o && o.verificar ? (verificado(vKey(o)) ? '<span class="badge ok">✓ verificado</span>' : '<span class="ver">VERIFICAR</span>') : '');

const K_TRIP = 'corea.trip', K_USER = 'corea.user', K_THEME = 'corea.theme';
const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));

let trip = load(K_TRIP, null);
let user = load(K_USER, { gastos: [], checklist: {}, notas: '' });
let tab = 'hoy';
// Historial de pestañas para el botón atrás (el de la app y el de Android).
const pila = [];
function ir(t) {
  if (t === tab) return;
  pila.push(tab); tab = t; history.pushState({ t }, ''); window.scrollTo(0, 0);
}
function cerrarFull() {
  const cp = document.getElementById('conv-pop'); if (cp) { cp.remove(); return true; }
  const f = document.getElementById('full'); if (!f) return false;
  f._lock?.release().catch(() => {}); f.remove(); return true;
}
window.addEventListener('popstate', () => {
  if (cerrarFull()) return;
  if (pila.length) { tab = pila.pop(); render(); window.scrollTo(0, 0); }
});
let dayIdx = null;

const TABS = [
  ['hoy', 'Hoy', '📅'], ['ruta', 'Ruta', '🗺️'], ['ciudades', 'Ciudades', '🏯'], ['corea', 'Corea', '🇰🇷'],
  ['comer', 'Comer', '🍜'], ['planes', 'Planes', '⭐'], ['mas', 'Más', '☰']
];
// Secciones agrupadas dentro de "Más" (la barra no cabe con 9 pestañas).
const EN_MAS = [['checklist', 'Checklist', '✅'], ['seguro', 'Seguro', '🛡️'], ['verificar', 'Verificar', '🔎']];

function todayISO() {
  const d = new Date();
  return new Date(d - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
}
function fmtDate(iso) {
  if (!iso) return '';
  const d = new Date(iso + 'T12:00:00');
  return isNaN(d) ? esc(iso) : d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
}
const fmtCorto = iso => { const d = new Date(String(iso) + 'T12:00:00'); return isNaN(d) ? esc(iso || '') : d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }); };
// Pone en negrita lo importante de un texto: horas, trenes, buses, estaciones, mayúsculas y precios.
function resaltar(t) {
  let h = esc(t);
  h = h.replace(/\b(\d{1,2}[:.]\d{2}(?:\s*[-–→]\s*\d{1,2}[:.]\d{2})?)\b/g, '<b>$1</b>')
    .replace(/\b(KTX(?:-Eum)?|AREX(?: Express)?|SRT|ITX)\b/g, '<b>$1</b>')
    .replace(/\b((?:bus|Bus|metro|línea)\s+\d{1,4}(?:-\d)?)\b/g, '<b>$1</b>')
    .replace(/((?:[\d.]+(?:-[\d.]+)?\s?₩)|(?:₩\s?[\d.]+))/g, '<b>$1</b>')
    .replace(/\b([A-ZÁÉÍÓÚÑ]{4,}(?:\s+[A-ZÁÉÍÓÚÑ]{2,})*)\b/g, '<b class="mayus">$1</b>')
    .replace(/((?:[A-Z][\w-]+\s)?(?:Station|Terminal))/g, '<b>$1</b>')
    .replace(/(estación de [A-ZÁÉÍÓÚ][\w-]+)/g, '<b>$1</b>');
  return h;
}
const isPend = t => /pendiente/i.test(t.estado || '');
const isOk = t => /comprad/i.test(t.estado || '') || (t.tren && t.tren.comprado === true);
function estadoBadge(t) {
  if (isPend(t)) return `<span class="badge pend">${esc(t.estado)}</span>`;
  if (isOk(t)) return `<span class="badge ok">${esc(t.estado || 'COMPRADO')}</span>`;
  return t.estado ? `<span class="badge otro">${esc(t.estado)}</span>` : '';
}

// Hora en Corea y en España.
const horaEn = tz => new Date().toLocaleTimeString('es-ES', { timeZone: tz, hour: '2-digit', minute: '2-digit' });
// Bandera de Canarias (no existe como emoji): blanco, azul y amarillo.
const CANARIAS = '<svg class="bandera" viewBox="0 0 3 2" aria-label="Canarias"><rect width="1" height="2" fill="#fff"/><rect x="1" width="1" height="2" fill="#0768a9"/><rect x="2" width="1" height="2" fill="#fc0"/><rect width="3" height="2" fill="none" stroke="#999" stroke-width=".08"/></svg>';
const relojes = () => `🇰🇷 ${horaEn('Asia/Seoul')} · ${CANARIAS} ${horaEn('Atlantic/Canary')}`;
setInterval(() => { const e = document.getElementById('reloj'); if (e) e.innerHTML = relojes(); }, 30000);

function sumaDia(iso, n) {
  const d = new Date(iso + 'T12:00:00Z'); if (isNaN(d)) return '';
  d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10);
}

// Botón para abrir un sitio en Naver Map (necesita conexión).
function naver(l) {
  const q = (l && (l.direccion_ko || l.ko || l.direccion_en || l.es || l.nombre)) || '';
  return q ? `<a class="btn sec mini" href="https://map.naver.com/p/search/${encodeURIComponent(q)}" target="_blank" rel="noopener">🗺️ Naver</a>` : '';
}

// ---------- distancias al hotel (línea recta, sin conexión) ----------
let COORDS_LUGARES = {};
fetch('data/coords.json').then(r => r.json()).then(d => { COORDS_LUGARES = d || {}; if (['ciudades', 'comer', 'corea', 'mas'].includes(tab)) renderLuego(); }).catch(() => {});
const coordsLugar = l => {
  if (!l) return null;
  if (l.lat != null && l.lon != null) return [Number(l.lat), Number(l.lon)];
  return COORDS_LUGARES[l.id] || COORDS_LUGARES[l.ko] || COORDS_LUGARES[l.es] || null;
};
function km([a, b], [c, d]) {
  const r = Math.PI / 180, x = Math.sin((c - a) * r / 2) ** 2 + Math.cos(a * r) * Math.cos(c * r) * Math.sin((d - b) * r / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(x));
}
// Hotel de una ciudad con coordenadas (de trip.json, privado).
const hotelDe = k => { const h = arr(trip && trip.alojamientos).find(a => a && ck(a.ciudad) === k && a.lat != null && a.lon != null); return h ? [Number(h.lat), Number(h.lon)] : null; };
const fmtDist = d => d < 0.95 ? Math.max(100, Math.round(d * 10) * 100) + ' m' : d.toLocaleString('es-ES', { maximumFractionDigits: d < 10 ? 1 : 0 }) + ' km';
function distHotel(l, k) {
  const h = hotelDe(k), p = coordsLugar(l); if (!h || !p) return '';
  return ` <span class="dist">📍 ${l.aprox ? '≈ ' : ''}${fmtDist(km(h, p))} del hotel</span>`;
}

// ---------- personalidad: color, icono y lema por ciudad; iconos por tipo de sitio ----------
const TEMA = {
  seul: { ic: '🏙️', c1: '#0047a0', c2: '#cd2e3a', lema: 'Palacios, hanoks y barrios que no duermen' },
  andong: { ic: '🎭', c1: '#7a4a1e', c2: '#c98b4a', lema: 'Máscaras, aldeas y academias confucianas' },
  gyeongju: { ic: '👑', c1: '#8a6a00', c2: '#d9a93a', lema: 'La antigua capital Silla: túmulos y templos' },
  busan: { ic: '🌊', c1: '#0b6e78', c2: '#36a9b8', lema: 'Mar, mercados y templos junto a la costa' },
  jeonju: { ic: '🍚', c1: '#2c6e45', c2: '#79b363', lema: 'Hanok, bibimbap y papel hanji' },
  incheon: { ic: '✈️', c1: '#3b4a63', c2: '#7d8ca6', lema: '' }
};
const tema = k => TEMA[k] || { ic: '📍', c1: '#475569', c2: '#94a3b8', lema: '' };
const varsTema = k => { const t = tema(k); return `--c1:${t.c1};--c2:${t.c2}`; };
function icSitio(t) {
  t = norm(t);
  if (/palacio|fortaleza|ruinas|puerta/.test(t)) return '🏯';
  if (/templo|santuario|gruta|pagoda|buda|iglesia|catedral/.test(t)) return '🛕';
  if (/museo|historic|academia|escuela|arquitectura|teatro/.test(t)) return '🏛️';
  if (/aldea|barrio|calle|zona/.test(t)) return '🏘️';
  if (/parque|monta|paseo|mirador|lago|playa|teleferico|barco/.test(t)) return '🌳';
  if (/mercado/.test(t)) return '🧺';
  if (/tumba|tumulo/.test(t)) return '⛰️';
  if (/sauna/.test(t)) return '♨️';
  return '📍';
}
const IC_COMER = { restaurante: '🍲', 'café': '☕', mercado: '🧺', plato: '🥢', bar: '🍶' };
const tipoClase = t => 'tipo-' + norm(t || 'otro');

// ---------- ¿Está en nuestro itinerario? (y qué día) ----------
const STOP = new Set('palacio templo mercado aldea barrio calle parque museo nacional gruta observatorio tumulos playa estanque santuario catedral cafe restaurante hanok village puerta mirador academia escuela torre puente plaza estacion aeropuerto cultural tradicional folclorica comida callejera puestos desayuno platos probar seul seoul andong gyeongju busan jeonju incheon corea hotel seowon square market para con los las del una tumbas reales hall center centro comercial historia moderna arte murales teleferico tour city turistico bus cafes wonjo halmae gukbap milmyeon jjimdak bibimbap samgyeopsal bakery calle viejo rocas yongsan'.split(' '));
let _plan = null, _planTrip = null;
function planIdx() {
  if (_plan && _planTrip === trip) return _plan;
  _planTrip = trip;
  _plan = arr(trip && trip.dias).slice().filter(d => d && d.fecha).sort((a, b) => String(a.fecha).localeCompare(String(b.fecha)))
    .map((d, i) => ({ n: i + 1, fecha: d.fecha, k: ck(d.ciudad), txt: ' ' + [d.titulo, ...arr(d.items).map(x => x && x.texto)].join(' ').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/-/g, '').replace(/[^a-z0-9]+/g, ' ') + ' ' }));
  return _plan;
}
function tokensDe(l) {
  if (!l || typeof l !== 'object') return typeof l === 'string' ? tokensDe({ es: l }) : [];
  const al = (typeof ALIAS !== 'undefined' && l.ko && ALIAS[l.ko]) || [];
  const words = [l.es, l.nombre, l.romanizacion].filter(Boolean).join(' ').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/\(.*?\)/g, ' ').replace(/-/g, '').split(/[^a-z0-9]+/).filter(w => w.length >= 4 && !STOP.has(w));
  return [...al.map(a => ' ' + a + ' '), ...words.map(w => ' ' + w + ' ')];
}
// Solo cuenta si aparece en un día de la misma ciudad (k), con palabras completas.
function enPlan(l, k) {
  // Comer del itinerario: la nota trae la fecha ("Almuerzo del 08/11").
  const m = l && l.fuente === 'itinerario' && String(l.nota || '').match(/(\d{1,2})\/(\d{1,2})/);
  if (m) { const f = `2026-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`, d = planIdx().find(x => x.fecha === f); if (d) return d; }
  const tk = tokensDe(l); if (!tk.length) return null;
  k = k || (l && l.ciudad) || '';
  return planIdx().find(d => (!k || d.k === k) && tk.some(t => d.txt.includes(t))) || null;
}
const planBadge = (l, k) => { const p = enPlan(l, k); return p ? ` <span class="plan">📅 Día ${p.n} · ${fmtCorto(p.fecha)}</span>` : ''; };
// Ordena: primero lo que está en el plan (por día), luego el resto en su orden.
const porPlan = (ls, k) => ls.map((l, i) => [l, i, (enPlan(l, k) || {}).n || 999]).sort((a, b) => a[2] - b[2] || a[1] - b[1]).map(x => x[0]);

// Foto de Wikipedia para un sitio (si se conoce el artículo).
const wikiDe = l => l && typeof l === 'object' ? (l.wiki || (l.ko && ((typeof WIKI !== 'undefined' && WIKI[l.ko]) || (Object.values(typeof IMPRES !== 'undefined' ? IMPRES : {}).flat().find(m => m.ko === l.ko) || {}).wiki)) || '') : '';
const miniFoto = l => { const w = wikiDe(l); return w ? `<div class="foto mini" data-wiki="${esc(w)}"><span>📷</span></div>` : ''; };

// ---------- tema ----------
const TEMAS = { auto: ['🌓', 'Auto'], light: ['☀️', 'Claro'], dark: ['🌙', 'Oscuro'] };
function applyTheme() {
  const tb = document.getElementById('tema'); if (tb) { const t0 = TEMAS[load(K_THEME, 'auto')] || TEMAS.auto; tb.textContent = t0[0]; tb.title = 'Tema: ' + t0[1]; }
  const t = load(K_THEME, 'auto');
  if (t === 'auto') document.documentElement.removeAttribute('data-theme');
  else document.documentElement.setAttribute('data-theme', t);
}

// ---------- fotos de documentos (IndexedDB, solo en este móvil) ----------
let fotos = [];
function db() {
  return new Promise((ok, ko) => {
    const r = indexedDB.open('corea', 1);
    r.onupgradeneeded = () => r.result.createObjectStore('fotos', { keyPath: 'id' });
    r.onsuccess = () => ok(r.result); r.onerror = () => ko(r.error);
  });
}
async function dbOp(modo, fn) {
  const d = await db();
  return new Promise((ok, ko) => {
    const tx = d.transaction('fotos', modo), st = tx.objectStore('fotos'), r = fn(st);
    tx.oncomplete = () => ok(r && r.result); tx.onerror = () => ko(tx.error);
  });
}
const cargarFotos = () => dbOp('readonly', st => st.getAll()).then(f => { fotos = arr(f).sort((a, b) => a.id.localeCompare(b.id)); }).catch(() => {});
const guardarFoto = f => dbOp('readwrite', st => st.put(f));
const borrarFoto = id => dbOp('readwrite', st => st.delete(id));

// Reduce la foto (máx. 1600 px, JPEG) para que ocupe poco.
function comprimir(file) {
  return new Promise((ok, ko) => {
    const img = new Image(), url = URL.createObjectURL(file);
    img.onload = () => {
      const k = Math.min(1, 1600 / Math.max(img.width, img.height));
      const c = document.createElement('canvas');
      c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url); ok(c.toDataURL('image/jpeg', 0.8));
    };
    img.onerror = () => { URL.revokeObjectURL(url); ko(); };
    img.src = url;
  });
}
async function anadirFotos(files) {
  for (const f of files) {
    try {
      const esPdf = /pdf$/i.test(f.type) || /\.pdf$/i.test(f.name);
      const data = esPdf ? await new Promise((ok, ko) => { const r = new FileReader(); r.onload = () => ok(r.result); r.onerror = ko; r.readAsDataURL(f); }) : await comprimir(f);
      const nombre = (prompt('Nombre del documento:', f.name.replace(/\.[^.]+$/, '')) || 'Documento').trim();
      await guardarFoto({ id: Date.now().toString(36) + Math.random().toString(36).slice(2, 5), nombre, data, fecha: todayISO() });
    } catch { alert('No se pudo leer el archivo: ' + f.name); }
  }
  await cargarFotos(); render();
}
function viewFotos() {
  return `<h2>Documentos y billetes</h2>
    <p class="muted">Billetes, pasaporte, reservas, póliza… Fotos o PDF. Se guardan solo en este móvil y se abren sin conexión.</p>
    <div class="fotos">${fotos.map(f => `<figure class="card" data-foto="${esc(f.id)}">${esPdfData(f.data) ? '<div class="pdf-ic">📄<small>PDF</small></div>' : `<img src="${f.data}" alt="">`}
      <figcaption>${esc(f.nombre)}</figcaption></figure>`).join('')}</div>
    <button class="sec" data-act="foto">📎 Añadir foto o PDF</button>`;
}
const esPdfData = d => /^data:application\/pdf/.test(String(d || ''));
// Abre un PDF guardado con el visor del móvil (funciona sin conexión).
function abrirPdf(f) {
  const b64 = f.data.split(',')[1], bin = atob(b64), u8 = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
  const url = URL.createObjectURL(new Blob([u8], { type: 'application/pdf' }));
  const a = document.createElement('a'); a.href = url; a.target = '_blank'; a.rel = 'noopener';
  a.download = (f.nombre || 'documento').replace(/[^\w\-. ]+/g, '_') + '.pdf';
  document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 60000);
}
function showFoto(id) {
  const f = fotos.find(x => x.id === id); if (!f) return;
  if (esPdfData(f.data)) {
    return full(`<div class="pdf-ic grande">📄</div><div class="big">${esc(f.nombre)}</div>
      <button class="mini" data-pdf="${esc(f.id)}">Abrir PDF</button>
      <div class="es">Se abre con el visor de PDF del móvil, también sin conexión.</div>
      <button class="danger mini" data-delfoto="${esc(f.id)}">Borrar</button>`);
  }
  full(`<img class="fotofull" src="${f.data}" alt=""><div class="es">${esc(f.nombre)}</div>
    <button class="danger mini" data-delfoto="${esc(f.id)}">Borrar foto</button>`);
}

// ---------- importar / exportar ----------
function importFile(file) {
  const r = new FileReader();
  r.onload = () => {
    try {
      const obj = JSON.parse(r.result);
      if (!obj || typeof obj !== 'object' || Array.isArray(obj)) throw new Error();
      if (obj.trip && obj.user) { // copia exportada por esta app
        trip = obj.trip; user = obj.user; save(K_USER, user);
        if (Array.isArray(obj.fotos)) {
          dbOp('readwrite', st => { st.clear(); obj.fotos.forEach(f => f && f.id && st.put(f)); }).then(cargarFotos).then(render).catch(() => {});
        }
      } else {
        trip = obj;
      }
      save(K_TRIP, trip);
      dayIdx = null; tab = 'hoy'; pila.length = 0;
      render();
      alert('Viaje importado y guardado en el móvil.');
    } catch {
      alert('El archivo no es un JSON válido.');
    }
  };
  r.readAsText(file);
}
async function exportCopy() {
  await cargarFotos();
  const data = { exportado: new Date().toISOString(), trip, user, fotos };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `corea-copia-${todayISO()}.json`;
  document.body.appendChild(a); a.click(); a.remove();
  localStorage.setItem('corea.ultimaCopia', todayISO());
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}
async function loadExample() {
  try {
    const r = await fetch('example.trip.json');
    trip = await r.json(); save(K_TRIP, trip); dayIdx = null; render();
  } catch { alert('No se pudo cargar el ejemplo.'); }
}

// ---------- vistas ----------
function viewWelcome() {
  return `<div class="welcome">
    <img src="icons/icon.svg" alt="">
    <h2>Bienvenido</h2>
    <p>Aún no hay viaje cargado. Importa tu archivo <b>trip.json</b>.
    Se guarda solo en este móvil y funciona sin conexión.</p>
    <button data-act="import">📂 Importar viaje</button>
    <button class="sec" data-act="example">Probar con datos de ejemplo</button>
  </div>`;
}

// "Hanok Hanji Ggulkam (Jeonju)" -> "Jeonju"
const ciudadCorta = t => { const m = String(t || '').match(/\(([^)]+)\)/); return m ? m[1] : String(t || ''); };
function pendingAlert() {
  const p = arr(trip.traslados).filter(isPend);
  if (!p.length) return '';
  return `<div class="alert compacta" data-go="ruta">⚠️ Por comprar: ${p.map(t => `${esc(fmtCorto(t.fecha))} ${esc(ciudadCorta(t.de))} → ${esc(ciudadCorta(t.a))}`).join(' · ')} <span class="muted">›</span></div>`;
}

// Alojamiento de la noche de una fecha ("2026-11-04 a 2026-11-08": noches del 4 al 7) y el que se deja ese día.
function alojDe(f) {
  const r = arr(trip.alojamientos).map(a => { const [ini, fin] = String(a.fechas || '').split(' a ').map(x => x.trim()); return { a, ini, fin: fin || (ini ? sumaDia(ini, Number(a.noches) || 1) : '') }; });
  return { noche: (r.find(x => x.ini && x.ini <= f && f < x.fin) || {}).a, sale: (r.find(x => x.fin === f) || {}).a };
}
const alojCard = (a, sale) => `<div class="card aloj">
    <div class="big">🛏️ ${esc(a.nombre)} ${ver(a)}</div>${sale ? '<div class="badge pend">Hoy dejáis este alojamiento</div>' : ''}
    ${a.ko ? `<div class="ko">${esc(a.ko)}</div>` : ''}
    ${a.direccion_ko ? `<div>${esc(a.direccion_ko)}</div>` : ''}
    ${a.direccion_en ? `<div class="muted">${esc(a.direccion_en)}</div>` : ''}
    ${a.nota ? `<div class="muted">${esc(a.nota)}</div>` : ''}
    <div class="acciones">${naver(a)}</div></div>`;
let hoySub = null;
function viewHoy() {
  const dias = arr(trip.dias).slice().sort((a, b) => String(a.fecha).localeCompare(String(b.fecha)));
  let html = `<div class="muted reloj" id="reloj">${relojes()}</div>` + ahora() + pendingAlert();
  const avisos = arr(trip.avisos);
  if (avisos.length) html += `<details class="card avisos" data-key="avisos" ${abierto("avisos", false) ? "open" : ""}><summary><b>⚠️ Avisos (${avisos.length})</b></summary><ul>${avisos.map(a => `<li>${esc(a)}</li>`).join('')}</ul></details>`;
  if (!dias.length) return html + '<p class="muted">El viaje no tiene días (clave "dias").</p>';

  if (dayIdx === null) {
    const t = todayISO();
    dayIdx = dias.findIndex(d => d.fecha === t);
    if (dayIdx < 0) dayIdx = t < dias[0].fecha ? 0 : Math.max(0, dias.findIndex(d => d.fecha > t));
    if (t > dias[dias.length - 1].fecha) dayIdx = dias.length - 1;
  }
  dayIdx = Math.min(Math.max(dayIdx, 0), dias.length - 1);
  const d = dias[dayIdx], hoy = todayISO();

  // Tira de días: se desliza y se toca el día.
  html += `<div class="dias-tira" id="tira">${dias.map((x, i) => { const f = new Date(x.fecha + 'T12:00:00');
    return `<button class="dchip ${i === dayIdx ? 'on' : ''} ${x.fecha === hoy ? 'hoy' : ''}" data-dsel="${i}" style="${varsTema(ck(x.ciudad))}"><small>${f.toLocaleDateString('es-ES', { weekday: 'short' })}</small><b>${f.getDate()}</b><span>${tema(ck(x.ciudad)).ic}</span></button>`; }).join('')}</div>
  <div class="card dia" style="${varsTema(ck(d.ciudad))}">
    <div class="muted">Día ${dayIdx + 1} de ${dias.length} · ${fmtDate(d.fecha)} · ${esc(d.ciudad)}${d.fecha === hoy ? ' · <b>HOY</b>' : ''}</div>
    <div class="big">${esc(d.titulo)}</div>
    ${lineaTiempo(d)}
    <ul class="items">${arr(d.items).map(i =>
      `<li>${i.hora ? `<span class="hora">${esc(i.hora)}</span>` : ''}${resaltar(i.texto)}</li>`).join('')}</ul>
  </div>`;

  // Apartados del día como botones (como en Corea); solo los que tienen algo.
  const tr = arr(trip.traslados).filter(t => t.fecha === d.fecha), al = alojDe(d.fecha);
  const secs = [
    ['sitios', '📖 Sitios', sitiosDia(d)],
    ['traslado', '🚆 Traslado', tr.map(trasladoCard).join('')],
    ['hotel', '🛏️ Hotel', (al.sale && al.sale !== al.noche ? alojCard(al.sale, true) : '') + (al.noche ? alojCard(al.noche, false) : '')],
    ['ciudad', '⭐ Ciudad', destacados(d.ciudad)],
    ['manana', '⏭️ Mañana', manana(d, dias)]
  ].filter(s => s[2]);
  if (!secs.length) return html;
  const sel = secs.find(s => s[0] === hoySub) || (tr.length ? secs.find(s => s[0] === 'traslado') : null) || secs[0];
  return html + `<div class="row daynav hoysubs">${secs.map(([k, t]) => `<button class="${k === sel[0] ? '' : 'sec'}" data-hs="${k}">${t}</button>`).join('')}</div>${sel[2]}`;
}

// "Ahora": lo próximo que toca hoy (o la cuenta atrás antes del viaje).
const aMin = h => { const m = String(h || '').match(/(\d{1,2})[:.](\d{2})/); return m ? +m[1] * 60 + +m[2] : null; };
const enTiempo = min => min <= 0 ? 'ahora mismo' : min < 60 ? `en ${min} min` : `en ${Math.floor(min / 60)} h${min % 60 ? ' ' + (min % 60) + ' min' : ''}`;
function eventosDe(fecha) {
  const d = arr(trip.dias).find(x => x.fecha === fecha), ev = [];
  arr(d && d.items).forEach(i => { const m = aMin(i.hora); if (m != null) ev.push({ m, hora: i.hora, txt: i.texto }); });
  arr(trip.traslados).filter(t => t.fecha === fecha).forEach(t => {
    const m = aMin(t.tren && t.tren.salida);
    if (m != null && !ev.some(e => e.m === m)) ev.push({ m, hora: t.tren.salida, txt: `🚆 ${t.de} → ${t.a}` });
  });
  return [d, ev.sort((a, b) => a.m - b.m)];
}
function ahora() {
  const dias = arr(trip.dias).map(d => d.fecha).filter(Boolean).sort(); if (!dias.length) return '';
  const hoy = todayISO(), n = new Date(), nowM = n.getHours() * 60 + n.getMinutes();
  if (hoy < dias[0]) {
    const falta = Math.round((new Date(dias[0] + 'T12:00') - new Date(hoy + 'T12:00')) / 864e5);
    return `<div class="card ahora"><b>✈️ ${falta === 1 ? 'Falta' : 'Faltan'} ${falta} ${falta === 1 ? 'día' : 'días'} para el viaje</b><div class="muted">Sale el ${fmtDate(dias[0])}. Revisa Más → Maleta y documentos.</div></div>`;
  }
  if (hoy > dias[dias.length - 1]) return '';
  const [d, ev] = eventosDe(hoy);
  const prox = ev.find(e => e.m >= nowM);
  const lineas = [];
  if (prox) lineas.push(`<div class="big">${esc(prox.hora)} · ${esc(prox.txt)}</div><div class="muted">${enTiempo(prox.m - nowM)}</div>`);
  const sig = arr(trip.dias).find(x => x.fecha === sumaDia(hoy, 1));
  if (d && sig && d.ciudad && sig.ciudad && ck(d.ciudad) !== ck(sig.ciudad) && nowM >= 17 * 60) lineas.push('<div>🧳 Mañana cambias de ciudad: deja la maleta preparada.</div>');
  if (!prox) {
    const [, evM] = eventosDe(sumaDia(hoy, 1));
    lineas.push(evM.length ? `<div>Mañana: <b>${esc(evM[0].hora)}</b> · ${esc(evM[0].txt)}</div>` : sig ? `<div>Mañana: ${esc(sig.titulo || '')}</div>` : '<div>Nada más con hora hoy.</div>');
  }
  return `<div class="card ahora"><div class="muted">⏱️ AHORA</div>${lineas.join('')}</div>`;
}

// Lo imprescindible de la ciudad del día: qué ver (★ Lonely y sitios conocidos) y dónde comer.
function destacados(ciudad) {
  const k = ck(ciudad); if (!k) return '';
  const lp = (LP[k] || []);
  const ver_ = [...lp.filter(l => l.top), ...(CATALOGO[k] || []).filter(l => !/^(Estación|Aeropuerto)/.test(l.es)), ...lp.filter(l => !l.top)]
    .filter((l, i, a) => a.findIndex(x => x.es === l.es) === i).slice(0, 5);
  const enCiudad = lugaresComer().filter(l => l.ciudad === k && !['descartado', 'cerrado'].includes(estadoDe(String(l.id)).estado));
  const comer_ = [...enCiudad.filter(l => estadoDe(String(l.id)).estado === 'quiero'), ...enCiudad.filter(l => l.fuente === 'itinerario'), ...enCiudad.filter(l => /★/.test(l.nota || ''))]
    .filter((l, i, a) => l.nombre && a.findIndex(x => x.nombre === l.nombre) === i).slice(0, 4);
  if (!ver_.length && !comer_.length) return '';
  const tira = ver_.filter(l => wikiDe(l)).slice(0, 3);
  return `<div class="card destacados"><b>⭐ Destacados en ${esc(ciudad)}</b>
    ${tira.length ? `<div class="tira">${tira.map(l => `<figure><div class="foto" data-wiki="${esc(wikiDe(l))}"><span>📷</span></div><figcaption>${esc(l.es)}</figcaption></figure>`).join('')}</div>` : ''}
    ${ver_.length ? `<div>👀 ${ver_.map(l => hecho(l, k) ? `<s class="tachado">${esc(l.es)}</s> ✅` : esc(l.es)).join(' · ')}</div>` : ''}
    ${comer_.length ? `<div>🍜 ${comer_.map(l => hecho(l, k) ? `<s class="tachado">${esc(l.nombre)}</s> ✅` : esc(l.nombre)).join(' · ')}</div>` : ''}
    <div class="acciones"><button class="sec mini" data-tab="ciudades">Ver la ciudad</button></div></div>`;
}

// Planes (LoL / cosmética) a menos de 1 km de algún sitio del día.
function planesCerca(ls) {
  const P = typeof PLANES !== 'undefined' ? PLANES : [], cs = ls.map(coordsLugar).filter(Boolean);
  const cerca = P.map(p => { const c = coordsLugar(p); if (!c || !cs.length) return null; const d = Math.min(...cs.map(x => km(x, c))); return d <= 1 ? [p, d] : null; }).filter(Boolean).sort((a, b) => a[1] - b[1]);
  return cerca.length ? `<div class="planes-cerca" data-tab="planes">⭐ Cerca: ${cerca.map(([p, d]) => `${icPlan(p)} ${esc(p.es)} <span class="muted">(${fmtDist(d)})</span>`).join(' · ')}</div>` : '';
}
// Sitios cuyo nombre comparte palabra con un barrio: exigen otra palabra en el plan.
const EXIGE = { '명동성당': 'catedral' };
// Sitios que aparecen en el plan del día, con lo que cuenta la Lonely (DIA_LP) o la descripción corta.
// ---------- Agenda: qué ver cada día (itinerario + lo que apuntáis en Ciudades), con orden propio ----------
// user.agenda[fecha] = { add: [claves], del: [claves], orden: [claves] | null }. Clave = hKey del sitio.
const agendaDe = f => { const U = u(); U.agenda = U.agenda || {}; return U.agenda[f] || (U.agenda[f] = { add: [], del: [], orden: null }); };
const agendaVer = f => ((u().agenda || {})[f]) || { add: [], del: [], orden: null };
function sitiosCiudadObj(k) {
  const vistos = new Set();
  return [...((typeof IMPRES !== 'undefined' && IMPRES[k]) || []), ...(LP[k] || []), ...(CATALOGO[k] || [])]
    .filter(l => { const h = hKey(l); if (vistos.has(h) || /^(Estación|Aeropuerto)/.test(l.es)) return false; vistos.add(h); return true; });
}
// Sitios que el itinerario de ese día menciona, en el orden en que aparecen en el texto.
function autoDia(d) {
  const k = ck(d.ciudad), p = planIdx().find(x => x.fecha === d.fecha); if (!p) return [];
  // El orden sale de las actividades (no del título, que resume el día).
  const it = ' ' + arr(d.items).map(x => x && x.texto).join(' ').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/-/g, '').replace(/[^a-z0-9]+/g, ' ') + ' ';
  return sitiosCiudadObj(k).map(l => {
    const tk = l.buscar ? l.buscar.map(x => ' ' + x + ' ') : tokensDe(l), pos = Math.min(...tk.map(t => { const i = it.indexOf(t); return i < 0 ? (p.txt.includes(t) ? 1e8 : 1e9) : i; }));
    return pos < 1e9 && !(EXIGE[l.ko] && !p.txt.includes(EXIGE[l.ko])) ? [l, pos] : null;
  }).filter(Boolean).sort((a, b) => a[1] - b[1]).map(x => x[0]);
}
function listaDia(d) {
  const k = ck(d.ciudad), A = agendaVer(d.fecha), todos = sitiosCiudadObj(k);
  const auto = autoDia(d).filter(l => !A.del.includes(hKey(l)));
  const extra = A.add.map(h => todos.find(l => hKey(l) === h)).filter(l => l && !auto.includes(l));
  return [...auto, ...extra];
}
// Días en que un sitio está en la agenda (itinerario sin quitar + añadidos).
function diasDeSitio(l, k) {
  const h = hKey(l);
  return arr(trip && trip.dias).filter(d => d.fecha && ck(d.ciudad) === k).filter(d => listaDia(d).some(x => hKey(x) === h)).map(d => d.fecha);
}
let agendaAbre = null;
function agendaBtn(l, k, ctx = '') {
  if (!l || typeof l !== 'object' || !trip) return '';
  const h = hKey(l), fs = diasDeSitio(l, k), dias = arr(trip.dias).filter(d => d.fecha && ck(d.ciudad) === k);
  if (!dias.length) return '';
  const auto = f => autoDia(dias.find(d => d.fecha === f)).some(x => hKey(x) === h);
  return `<div class="agenda"><button class="agbtn ${fs.length ? 'on' : ''}" data-agpick="${esc(ctx + '|' + h)}">📅 ${fs.length ? fs.map(fmtCorto).join(', ') : 'Añadir a un día'}</button>
    ${agendaAbre === ctx + '|' + h ? `<div class="agdias">${dias.map(d => `<button class="chip ${fs.includes(d.fecha) ? 'on' : ''}" data-agtog="${esc(h)}|${d.fecha}">${fmtCorto(d.fecha)}${auto(d.fecha) ? ' ·itin.' : ''}</button>`).join('')}</div>` : ''}</div>`;
}
function agendaToggle(h, f) {
  const d = arr(trip.dias).find(x => x.fecha === f); if (!d) return;
  const A = agendaDe(f), esAuto = autoDia(d).some(x => hKey(x) === h);
  const quita = (ls, x) => { const i = ls.indexOf(x); if (i >= 0) ls.splice(i, 1); };
  if (esAuto) { if (A.del.includes(h)) quita(A.del, h); else A.del.push(h); }
  else { if (A.add.includes(h)) quita(A.add, h); else A.add.push(h); }
  saveUser();
}

// Cómo ir de un punto a otro: distancia en línea recta, tiempo aproximado y ruta en la app de Naver Map.
function tramo(o, dst, nO, nD) {
  if (!o || !dst) return '';
  const k = km(o, dst), pie = k <= 1.6, min = pie ? Math.max(2, Math.round(k * 1.3 / 4.5 * 60)) : Math.round(k * 1.3 / 22 * 60 + 8);
  const modo = pie ? 'walk' : 'public';
  const url = `nmap://route/${modo}?slat=${o[0]}&slng=${o[1]}&sname=${encodeURIComponent(nO)}&dlat=${dst[0]}&dlng=${dst[1]}&dname=${encodeURIComponent(nD)}&appname=viajecorea`;
  return `<div class="tramo-ir"><span>${pie ? '🚶' : '🚇🚕'} ${fmtDist(k)} · ${pie ? `~${min} min a pie` : `metro o taxi, ~${min} min`}</span><a class="btn sec mini" href="${url}">🧭 Ruta</a></div>`;
}
// Sitios recomendados que no están en ningún día del plan y quedan a ≤900 m de la ruta de ese día.
function sugerenciasCerca(d, ruta) {
  const k = ck(d.ciudad), cs = ruta.map(coordsLugar).filter(Boolean); if (!cs.length) return '';
  const enAlgun = new Set(); arr(trip.dias).forEach(x => listaDia(x).forEach(l => enAlgun.add(hKey(l))));
  const imp = new Set(((typeof IMPRES !== 'undefined' && IMPRES[k]) || []).map(hKey));
  const s = sitiosCiudadObj(k).filter(l => !enAlgun.has(hKey(l)) && coordsLugar(l)).map(l => {
    const ds = ruta.filter(x => coordsLugar(x)).map(x => [x, km(coordsLugar(x), coordsLugar(l))]).sort((a, b) => a[1] - b[1]);
    return ds.length && ds[0][1] <= 0.9 ? { l, dm: ds[0][1], junto: ds[0][0], peso: (imp.has(hKey(l)) ? 2 : 0) + (l.top ? 1 : 0) } : null;
  }).filter(Boolean).sort((a, b) => b.peso - a.peso || a.dm - b.dm).slice(0, 4);
  if (!s.length) return '';
  const D = typeof DIA_LP !== 'undefined' ? DIA_LP : {};
  return `<div class="sugerencias"><b>💡 Cerca y no lo tenéis</b>${s.map(({ l, dm, junto }) => { const h = hKey(l), txt = D[h.slice(2)] || D[h] || l.desc || l.nota || '';
    return `<div class="sug">${miniFoto(l)}<div class="sd-cuerpo"><div class="sd-tit"><b>${icSitio((l.tipo || '') + ' ' + l.es)} ${esc(l.es)}</b>${lpPill(l)}</div>
      <div class="muted">📍 ${fmtDist(dm)} de ${esc(junto.es)}${txt ? ` · ${esc(txt.length > 140 ? txt.slice(0, 137) + '…' : txt)}` : ''}</div></div>
      <button class="mini sug-add" data-agtog="${esc(h)}|${d.fecha}" aria-label="Añadir a este día">+</button></div>`; }).join('')}</div>`;
}
function sitiosDia(d) {
  const k = ck(d.ciudad), A = agendaVer(d.fecha), todos = listaDia(d);
  if (!todos.length) return '';
  const auto = autoDia(d).filter(l => !A.del.includes(hKey(l)));
  const D = typeof DIA_LP !== 'undefined' ? DIA_LP : {}; const G = typeof DIA_INFO !== 'undefined' ? DIA_INFO : {};
  const al = alojDe(d.fecha), hot = al.noche && al.noche.lat != null && ck(al.noche.ciudad) === k ? al.noche : (al.sale && al.sale.lat != null && ck(al.sale.ciudad) === k ? al.sale : null);
  let prev = hot ? [Number(hot.lat), Number(hot.lon)] : null, prevN = hot ? hot.nombre : '';
  const fila = (l, extra) => {
    const h = hKey(l), mas = D[h.slice(2)] || D[h], txt = mas || l.desc || l.nota || G[h.slice(2)] || '', c = coordsLugar(l);
    const t = c && prev ? tramo(prev, c, prevN, l.ko || l.es) : '';
    if (c) { prev = c; prevN = l.ko || l.es; }
    return `${t}<div class="sd ${hecho(l, k) ? 'hecho-card' : ''}">${miniFoto(l)}<div class="sd-cuerpo"><div class="sd-tit">${btnHecho(l, k)}<b>${icSitio(l.es)} ${esc(l.es)}</b>${lpPill(l)} <span class="ko-s">${esc(l.ko || '')}</span>${extra ? `<button class="sd-x" data-agdel="${esc(h)}" aria-label="Quitar de este día">✕</button>` : ''}</div>
      ${txt ? `<div class="muted">${esc(txt).replace(/VERIFICAR/g, '<span class="ver">VERIFICAR</span>')}</div>` : ''}</div></div>`;
  };
  const extras = todos.filter(l => !auto.includes(l));
  return `<div class="card sitios-dia" data-fecha="${d.fecha}"><b>📖 Ruta del día</b>
    <div class="muted mini-nota">En el orden del itinerario${hot ? ', saliendo del hotel' : ''}. Distancias en línea recta y tiempos aproximados; "🧭 Ruta" abre Naver Map (con conexión).</div>
    ${hot ? `<div class="sd-hotel">🛏️ ${esc(hot.nombre)}</div>` : ''}
    ${auto.map(l => fila(l, false)).join('')}
    ${extras.length ? `<div class="sd-anadidos">➕ Añadidos desde Ciudades</div>${extras.map(l => fila(l, true)).join('')}` : ''}
    ${A.del.length ? `<button class="sec mini sd-reset" data-agreset="${d.fecha}">↺ Volver al itinerario</button>` : ''}
    ${sugerenciasCerca(d, todos)}
    ${planesCerca(todos)}<div class="muted mini-nota">LP = Lonely Planet 2016: horarios y precios pueden haber cambiado.</div></div>`;
}

// Resumen del día siguiente al que se está viendo.
function manana(d, dias) {
  const f = sumaDia(d.fecha, 1); if (!f) return '';
  const sig = dias.find(x => x.fecha === f);
  const tr = arr(trip.traslados).filter(t => t.fecha === f);
  const lineas = [];
  if (sig && sig.ciudad && d.ciudad && ck(sig.ciudad) !== ck(d.ciudad))
    lineas.push(`🧳 Cambias de ciudad: ${esc(d.ciudad)} → ${esc(sig.ciudad)}. Deja el alojamiento y revisa la hora de salida.`);
  tr.forEach(t => {
    const sal = t.tren && t.tren.salida ? ` · sale ${esc(t.tren.salida)}` : '';
    lineas.push(`${isPend(t) ? '⚠️' : '🚆'} ${esc(t.de)} → ${esc(t.a)}${sal} ${estadoBadge(t)}`);
  });
  if (sig) {
    if (sig.titulo) lineas.push(`📌 ${esc(sig.titulo)}`);
    arr(sig.items).filter(i => i.hora).slice(0, 3).forEach(i => lineas.push(`<span class="hora">${esc(i.hora)}</span>${esc(i.texto)}`));
  }
  if (!lineas.length) return '';
  return `<h2>Mañana · ${fmtDate(f)}</h2><div class="card manana"><ul class="items">${lineas.map(l => `<li>${l}</li>`).join('')}</ul></div>`;
}

// Medio de transporte principal de un traslado (para el icono).
function medio(t) {
  const x = [t.de, t.a, ...arr(t.pasos)].join(' ').toLowerCase();
  if (t.tren && (t.tren.salida || t.tren.comprado != null) || /ktx|tren|korail/.test(x)) return ['🚆', 'Tren'];
  if (t.bus || /\bbus\b|autob|kobus/.test(x)) return ['🚌', 'Bus'];
  if (/aeropuerto|vuelo/.test(x)) return ['✈️', 'Aeropuerto'];
  return ['🚕', 'Taxi'];
}
// Qué "Paso a paso" están abiertos (lo controla la app, no el navegador).
const pasosAb = {};
function trasladoCard(t) {
  const tren = t.tren || {}, [ic, nom] = medio(t), pend = isPend(t);
  const d = new Date(String(t.fecha) + 'T12:00:00');
  const dia = isNaN(d) ? esc(t.fecha || '') : `<b>${d.getDate()}</b><small>${d.toLocaleDateString('es-ES', { month: 'short' })}</small><small>${d.toLocaleDateString('es-ES', { weekday: 'short' })}</small>`;
  return `<div class="tl ${pend ? 'pend' : isOk(t) ? 'ok' : ''}">
    <div class="tl-fecha">${dia}</div>
    <div class="tl-card card">
      <div class="tl-top"><span class="tl-ic" title="${nom}">${ic}</span><div class="tl-ruta"><b>${esc(t.de)}</b><span class="tl-flecha">↓</span><b>${esc(t.a)}</b></div></div>
      <div class="tl-meta">${estadoBadge(t)} ${ver(t)}</div>
      ${tren.salida || tren.llegada ? `<div class="tl-horas"><span>${esc(tren.salida || '?')}</span><i>→</i><span>${esc(tren.llegada || '?')}</span>${tren.comprado === false ? '<em class="badge pend">billete sin comprar</em>' : ''}</div>` : ''}
      ${tren.numero || tren.asientos ? `<div class="tl-billete"><b class="nvuelo">${esc(tren.numero || '')}</b>${tren.clase ? ` <span class="muted">${esc(tren.clase)}</span>` : ''}${tren.precio ? ` <span class="muted">· ${esc(tren.precio)}</span>` : ''}
        ${Object.keys(tren.asientos || {}).length ? `<div>💺 ${tren.coche ? `Coche <b>${esc(tren.coche)}</b> · ` : ''}${Object.entries(tren.asientos).map(([n, a]) => `${esc(n)} <b>${esc(a)}</b>`).join(' · ')}</div>` : ''}${tren.nota ? `<div class="muted">${esc(tren.nota)}</div>` : ''}</div>` : ''}
      ${arr(t.pasos).length ? (() => { const k = 'p:' + (t.id || t.fecha + t.de), ab = k in pasosAb ? pasosAb[k] : pend;
        return `<div class="tl-pasos"><button class="tl-pasos-btn" data-pasos="${esc(k)}" data-v="${ab ? 0 : 1}">${ab ? '▾' : '▸'} Paso a paso (${arr(t.pasos).length})</button>
        ${ab ? `<ol>${arr(t.pasos).map(p => `<li>${resaltar(p)}</li>`).join('')}</ol>` : ''}</div>`; })() : ''}
      ${t.frase_ko ? `<div class="ko">${esc(t.frase_ko)}</div>` : ''}
      ${t.romanizacion ? `<div class="muted">${esc(t.romanizacion)}</div>` : ''}
    </div>
  </div>`;
}

// Vuelo con horarios (campos salida_* / llegada_* del viaje).
// Vuelo con tramos (número, horas, terminales, asientos y escalas), del billete.
function vueloTramos(v, tipo) {
  const hm = x => { const m = String(x || '').match(/(\d{4}-\d{2}-\d{2})?\s*(\d{1,2}:\d{2})/); return m ? m[2] : ''; };
  const dd = x => { const m = String(x || '').match(/(\d{4}-\d{2}-\d{2})/); return m ? fmtCorto(m[1]) : ''; };
  const pasado = String(v.fecha || '') < todayISO() && String(v.fecha || '') && !arr(v.tramos).some(t => String(t.llegada || '').slice(0, 10) >= todayISO());
  return `<div class="card vuelo ${tipo} ${pasado ? 'pasado' : ''}">
    <div class="vuelo-tipo">${tipo === 'ida' ? '🛫 Ida' : '🛬 Vuelta'} · ${esc(v.aerolinea || '')}${pasado ? ' · ✓ hecho' : ''}</div>
    ${arr(v.tramos).map(t => t.escala ? `<div class="escala">⏳ ${esc(t.escala)}</div>` : `<div class="tramo">
      <div class="tramo-cab"><b class="nvuelo">${esc(t.vuelo || '')}</b><span class="muted">${dd(t.salida)}${t.duracion ? ' · ' + esc(t.duracion) : ''}${t.avion ? ' · ' + esc(t.avion) : ''}</span></div>
      <div class="tramo-fila">
        <div class="pto"><b>${esc(t.de || '')}</b><span class="hh">${hm(t.salida)}</span><small>${esc(t.de_nombre || '')}${t.de_terminal ? ' · <b>' + esc(t.de_terminal) + '</b>' : ''}</small></div>
        <div class="linea">✈</div>
        <div class="pto"><b>${esc(t.a || '')}</b><span class="hh">${hm(t.llegada)}${dd(t.llegada) && dd(t.llegada) !== dd(t.salida) ? ' <sup>+1</sup>' : ''}</span><small>${esc(t.a_nombre || '')}${t.a_terminal ? ' · <b>' + esc(t.a_terminal) + '</b>' : ''}</small></div>
      </div>
      ${t.asientos ? `<div class="asientos">💺 ${Object.entries(t.asientos).map(([q, a]) => `${esc(q)} <b>${esc(a)}</b>`).join(' · ')}</div>` : ''}
    </div>`).join('')}
    <div class="muted vuelo-pie">${v.localizador ? `Localizador <b>${esc(v.localizador)}</b>` : ''}${v.equipaje ? ' · 🧳 ' + esc(v.equipaje) : ''} ${estadoBadge(v)}</div>
    ${v.nota ? `<div class="vuelo-nota">⚠️ ${resaltar(v.nota)}</div>` : ''}
  </div>`;
}
function vueloCard(v, tipo) {
  if (arr(v.tramos).length) return vueloTramos(v, tipo);
  const hora = x => { const m = String(x || '').match(/(\d{4}-\d{2}-\d{2})?\s*(\d{1,2}:\d{2})/); return m ? (m[1] ? fmtCorto(m[1]) + ' · ' : '') + m[2] : esc(x || ''); };
  const sal = Object.keys(v).filter(k => /^salida/.test(k) && v[k]).map(k => [k.replace(/^salida_?/, '').toUpperCase() || '', hora(v[k])]);
  const lle = Object.keys(v).filter(k => /^llegada/.test(k) && v[k]).map(k => [k.replace(/^llegada_?/, '').toUpperCase() || '', hora(v[k])]);
  const paradas = String(v.tramo || '').split(/\s*→\s*/).filter(Boolean);
  const falta = [v.numero_vuelo === null && 'nº de vuelo', v.terminal_icn === null && 'terminal'].filter(Boolean);
  return `<div class="card vuelo ${tipo}">
    <div class="vuelo-tipo">${tipo === 'ida' ? '🛫 Vuelo de ida' : '🛬 Vuelo de vuelta'} ${ver(v)}</div>
    <div class="vuelo-ruta">${paradas.map((p, i) => `<span class="aer">${esc(p)}</span>${i < paradas.length - 1 ? '<span class="avion">✈</span>' : ''}`).join('')}</div>
    <div class="vuelo-horas">
      ${sal.map(([k, h]) => `<div><small>Sale${k ? ' de ' + esc(k) : ''}</small><b>${h}</b></div>`).join('')}
      ${lle.map(([k, h]) => `<div><small>Llega${k ? ' a ' + esc(k) : ''}</small><b>${h}</b></div>`).join('')}
    </div>
    <div class="muted">${(() => { const m = String(v.fecha || '').match(/^(\d{4}-\d{2}-(\d{2}))(?:\/(\d{2}))?$/); return m ? (m[3] ? `${+m[2]}-${+m[3]} ${new Date(m[1] + 'T12:00').toLocaleDateString('es-ES', { month: 'short' })}` : fmtCorto(m[1])) : esc(v.fecha || ''); })()} · ${esc(v.aerolinea || '')}${v.numero_vuelo ? ' · ' + esc(v.numero_vuelo) : ''}${v.terminal_icn ? ' · Terminal ' + esc(v.terminal_icn) : ''} ${estadoBadge(v)}</div>
    ${falta.length ? `<div class="muted">Falta: ${falta.join(' y ')} <span class="ver">VERIFICAR</span></div>` : ''}
  </div>`;
}

const sitiosCiudad = k => {
  const base = CATALOGO[k] || [], ko = new Set(base.map(l => l.ko));
  return [...base, ...(LP[k] || []).filter(l => !l.ko || !ko.has(l.ko))];
};
// Distintivo de recomendación de Lonely Planet (★ = elección del autor).
const esLP = l => l && typeof l === 'object' && (l.lp || l.fuente === 'lonely');
const lpPill = l => esLP(l) ? ` <span class="lp-pill" title="Recomendado por Lonely Planet 2016">LP${l.top || /★/.test(l.nota || '') ? ' ★' : ''}</span>` : '';
const lpTag = lpPill;
const interesDe = c => arr(c.interes).length ? arr(c.interes) : (CATALOGO[ck(c.nombre)] || []).filter(l => !/^(Estación|Aeropuerto)/.test(l.es)).map(l => l.es);

// Estancia en una ciudad (Ruta): fechas, noches, hotel y días del plan.
function estanciaCard(c) {
  const k = ck(c.nombre), noches = c.hasta ? Math.round((new Date(c.hasta) - new Date(c.desde)) / 864e5) : null;
  const h = arr(trip.alojamientos).find(a => ck(a.ciudad) === k && String(a.fechas || '').startsWith(c.desde)) || arr(trip.alojamientos).find(a => ck(a.ciudad) === k);
  const ds = planIdx().filter(d => d.fecha >= c.desde && (!c.hasta || d.fecha < c.hasta)), ns = ds.map(d => d.n);
  const dias = arr(trip.dias).filter(d => d && d.fecha).sort((a, b) => String(a.fecha).localeCompare(String(b.fecha)));
  return `<div class="tl"><div class="tl-fecha tl-pin" style="${varsTema(k)}">${tema(k).ic}</div><div class="card estancia" style="${varsTema(k)}"><div class="big">${esc(c.nombre)}</div>
    <div class="muted">${fmtCorto(c.desde)}${c.hasta ? ' → ' + fmtCorto(c.hasta) : ''}${noches ? ` · ${noches} noche${noches > 1 ? 's' : ''}` : ''}${ns.length ? ` · Día ${ns[0]}${ns.length > 1 ? '-' + ns[ns.length - 1] : ''}` : ''}</div>
    ${h ? `<div class="muted">🛏️ ${esc(h.nombre)}</div>` : ''}
    ${ds.map(d => `<button class="dad-dia ${d.fecha === todayISO() ? 'on' : ''}" data-dia="${d.n - 1}"><span class="hora">${fmtCorto(d.fecha)}</span><span>${esc((dias[d.n - 1] || {}).titulo || '')}</span>${miniTiempo(k, d.fecha)}</button>`).join('')}</div></div>`;
}

function viewRuta() {
  const vuelos = arr(trip.vuelos).filter(v => v && typeof v === 'object').slice().sort((a, b) => String(a.fecha).localeCompare(String(b.fecha)));
  const conTipo = vuelos.some(v => v.tipo);
  const ida = conTipo ? vuelos.filter(v => v.tipo !== 'vuelta') : vuelos.slice(0, vuelos.length > 1 ? vuelos.length - 1 : 1);
  const vuelta = conTipo ? vuelos.filter(v => v.tipo === 'vuelta') : vuelos.length > 1 ? [vuelos[vuelos.length - 1]] : [];
  let html = ida.map(v => vueloCard(v, 'ida')).join('') + pendingAlert();
  if (arr(trip.ciudades).length) html += '<h2>Mapa</h2>' + viewMapa();
  const tr = arr(trip.traslados).slice().sort((a, b) => String(a.fecha).localeCompare(String(b.fecha)));
  const est = arr(trip.ciudades).filter(c => c && c.desde).map(c => [c.desde, 1, estanciaCard(c)]);
  const ev = [...tr.map(t => [t.fecha || '', 0, trasladoCard(t)]), ...est].sort((a, b) => String(a[0]).localeCompare(String(b[0])) || a[1] - b[1]);
  if (ev.length) html += '<h2>Dónde estamos y traslados</h2><div class="timeline">' + ev.map(e => e[2]).join('') + '</div>';
  html += vuelta.map(v => vueloCard(v, 'vuelta')).join('');
  return html || '<p class="muted">Sin datos de ruta.</p>';
}

// Desplegable con lo que amplía la Lonely (DIA_LP) o una frase general (DIA_INFO).
function masLP(l, ctx) {
  if (!l || typeof l !== 'object') return '';
  const h = hKey(l), D = typeof DIA_LP !== 'undefined' ? DIA_LP : {}, G = typeof DIA_INFO !== 'undefined' ? DIA_INFO : {};
  const lp = D[h.slice(2)] || D[h], txt = lp || G[h.slice(2)];
  if (!txt || txt === l.desc) return '';
  return `<details class="mas-lp" data-key="mx:${ctx}:${esc(h)}" ${abierto('mx:' + ctx + ':' + h, false) ? 'open' : ''}><summary>📖 ${lp ? 'Más de la Lonely' : 'Más info'}</summary>
    <p>${esc(txt).replace(/VERIFICAR/g, '<span class="ver">VERIFICAR</span>')}${lp ? ' <span class="badge otro">LP 2016</span>' : ''}</p></details>`;
}
// Imprescindibles de una ciudad: foto (Wikipedia, se guarda para offline), descripción y ✓ hecho.
function imprescindibles(k) {
  const ls = (typeof IMPRES !== 'undefined' && IMPRES[k]) || []; if (!ls.length) return '';
  return `<div class="impres">${porPlan(ls, k).map(l => `<div class="imp ${hecho(l, k) ? 'hecho-card' : ''}">
    <div class="foto" data-wiki="${esc(l.wiki)}"><span>📷</span></div>
    <div class="imp-txt"><div class="imp-tit">${btnHecho(l, k)}<b>${icSitio(l.es)} ${esc(l.es)}</b>${lpPill(l)}</div>
      <div class="ko-s">${esc(l.ko)}${distHotel(l, k)}</div>${agendaBtn(l, k, 'imp')}
      ${masLP(l, 'imp')}
      <div class="muted">${esc(l.desc)}</div>
      <div class="credito" data-cred="${esc(l.wiki)}"></div></div></div>`).join('')}</div>`;
}
// Foto principal del artículo de Wikipedia (necesita conexión la primera vez; el service worker la guarda).
const FOTOS = load('corea.fotos', {});
async function fotoWiki(t) {
  if (FOTOS[t] !== undefined) return FOTOS[t];
  try {
    const d = await (await fetch('https://en.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(t))).json();
    const f = d && (d.thumbnail || d.originalimage) ? { src: (d.thumbnail || d.originalimage).source, url: d.content_urls && d.content_urls.mobile && d.content_urls.mobile.page } : null;
    FOTOS[t] = f; try { save('corea.fotos', FOTOS); } catch {}
    return f;
  } catch { return undefined; } // sin conexión: se reintenta más tarde
}
function pintarFotos() {
  document.querySelectorAll('.foto[data-wiki]:not(.ok)').forEach(async el => {
    const f = await fotoWiki(el.dataset.wiki);
    if (!f) { if (f === null) el.classList.add('sinfoto'); return; }
    const img = new Image(); img.alt = '';
    img.onload = () => { el.innerHTML = ''; el.appendChild(img); el.classList.add('ok'); };
    img.onerror = () => el.classList.add('sinfoto');
    img.src = f.src;
    const c = el.classList.contains('mini') || el.classList.contains('banda') ? null : document.querySelector(`.credito[data-cred="${CSS.escape(el.dataset.wiki)}"]`);
    if (c && f.url) c.innerHTML = `Foto: <a href="${esc(f.url)}" target="_blank" rel="noopener">Wikipedia</a>`;
  });
}
async function descargarFotos() {
  if (!navigator.onLine) return alert('Conéctate a internet para descargar las fotos.');
  const ts = [...new Set([...Object.values(typeof IMPRES !== 'undefined' ? IMPRES : {}).flat().map(l => l.wiki), ...Object.values(typeof WIKI !== 'undefined' ? WIKI : {}), ...(typeof PLANES !== 'undefined' ? PLANES : []).map(p => p.wiki), ...Object.values(LP).flat().map(l => l.wiki)].filter(Boolean))]; let n = 0;
  for (const t of ts) {
    delete FOTOS[t]; const f = await fotoWiki(t);
    if (f && f.src) { try { await fetch(f.src, { mode: 'no-cors' }); n++; } catch {} }
  }
  alert(`Fotos guardadas para usar sin conexión: ${n} de ${ts.length}.`); render();
}

// Sección de la Lonely Planet: cabecera propia y una tarjeta por recomendación.
let lpAbierta = true, lpTodos = false;
function seccionLP(k) {
  const ls = LP[k] || []; if (!ls.length) return '';
  const tops = ls.filter(l => l.top).length;
  return `<div class="lp">
    <button class="lp-cab" data-act="lp">
      <span class="lp-logo">LP</span>
      <span class="lp-tit"><b>Recomendado por Lonely Planet</b><small>${ls.length} sitios${tops ? ` · ${tops} ★ elección del autor` : ''} · edición 2016</small></span>
      <span class="lp-flecha">${lpAbierta ? '▾' : '▸'}</span>
    </button>
    ${lpAbierta ? `<div class="lp-lista">${(() => {
      // primero lo del plan, luego las ★ del autor, luego el resto
      const ord = porPlan(ls, k).map((l, i) => [l, i]).sort((a, b) => (enPlan(a[0], k) ? 0 : a[0].top ? 1 : 2) - (enPlan(b[0], k) ? 0 : b[0].top ? 1 : 2) || a[1] - b[1]).map(x => x[0]);
      return lpTodos ? ord : ord.slice(0, 8);
    })().map(l => `<div class="lp-item ${hecho(l, k) ? 'hecho-card' : ''} ${l.top ? 'top' : ''}">
      ${wikiDe(l) ? `<div class="foto lpf" data-wiki="${esc(wikiDe(l))}"><span>${icSitio(l.tipo + ' ' + l.es)}</span></div>` : `<div class="foto lpf vacia"><span>${icSitio(l.tipo + ' ' + l.es)}</span></div>`}
      <div class="lp-txt">
        <div class="lp-nom">${btnHecho(l, k)}<b>${esc(l.es)}</b>${lpPill(l)}</div>
        <div class="lp-meta"><span class="lp-tipo">${esc(l.tipo)}</span>${l.top ? '<span class="lp-top">★ Elección del autor</span>' : ''}${ver(l)}</div>
        <div class="lp-nota">${esc(l.nota)}</div>
        <div class="lp-pie">${l.ko ? `<span class="ko-s">${esc(l.ko)}</span>` : ''}${distHotel(l, k)}</div>${agendaBtn(l, k, 'lp')}
        ${masLP(l, 'lp')}
      </div></div>`).join('')}
      ${ls.length > 8 ? `<button class="sec lp-mas" data-act="lptodos">${lpTodos ? 'Ver menos' : `Ver los ${ls.length - 8} restantes`}</button>` : ''}</div>` : ''}
  </div>`;
}

// Ciudades: 5 botones; al tocar uno se despliega su ficha debajo. Por defecto, la ciudad del día.
let ciudadSel = null, historiaAbierta = false;
function viewCiudades() {
  const uniq = ciudadesUnicas();
  if (!uniq.length) return '<p class="muted">No hay ciudades (clave "ciudades").</p>';
  const botones = botonesCiudad();
  const i = uniq.findIndex(c => ck(c.nombre) === ciudadSel), c = uniq[i], k = ciudadSel, t = tema(k);
  const fechas = arr(trip.ciudades).filter(o => ck(o.nombre) === k).map(o => `${fmtCorto(o.desde)} → ${fmtCorto(o.hasta)}`).join(' · ');
  const h = typeof HISTORIA !== 'undefined' && HISTORIA[k];
  return botones + `<div class="card ciudad" id="c-${esc(c.id)}" style="${varsTema(k)}">
    <div class="ciudad-hero">
      <div class="ciudad-ko">${esc(c.ko || '')}</div>
      <div class="ciudad-top"><span class="ciudad-ic">${t.ic}</span>${h ? `<button class="hist-btn ${historiaAbierta ? 'on' : ''}" data-act="historia">📜 Historia</button>` : ''}</div>
      <div class="ciudad-num">${i + 1}</div>
      <div class="ciudad-nom">${esc(nombreCiudad(k))}</div>
      ${t.lema ? `<div class="ciudad-lema">${esc(t.lema)}</div>` : ''}
      <div class="ciudad-fechas">${fechas}</div>
    </div>
    ${typeof INTRO_LP !== 'undefined' && INTRO_LP[k] ? `<div class="intro-lp"><span class="lp-logo mini">LP</span><div><p>${esc(INTRO_LP[k].txt)}</p>
      ${INTRO_LP[k].plan ? `<details data-key="lp:${k}" ${abierto("lp:" + k, false) ? "open" : ""}><summary>La Lonely propone</summary><ul>${INTRO_LP[k].plan.map(x => `<li>${resaltar(x)}</li>`).join('')}</ul></details>` : ''}</div></div>` : ''}
    ${h && historiaAbierta ? `<div class="historia"><b>📜 Historia de ${esc(nombreCiudad(k))}</b>${h.txt.map(p => `<p>${esc(p).replace(/\(LP\)/g, '<span class="badge otro">LP</span>')}</p>`).join('')}<div class="muted">Resumen de la Lonely Planet 2016 (LP) y datos generales.</div></div>` : ''}
    ${imprescindibles(k)}
    ${interesDe(c).length ? `<ul class="hlist">${porPlan(interesDe(c).map(x => (CATALOGO[ck(c.nombre)] || []).find(l => l.es === x) || x), ck(c.nombre)).map(o => typeof o === 'string' ? o : o.es).filter(x => { const o = (CATALOGO[ck(c.nombre)] || []).find(l => l.es === x) || x; return !((typeof IMPRES !== 'undefined' && IMPRES[ck(c.nombre)]) || []).some(m => hKey(m) === hKey(o)); }).map(x => { const o = (CATALOGO[ck(c.nombre)] || []).find(l => l.es === x) || x; return `<li class="${hecho(o, ck(c.nombre)) ? 'tachado' : ''}">${btnHecho(o, ck(c.nombre))}${miniFoto(o)}<span><span class="ics">${icSitio(x)}</span> ${esc(x)}${agendaBtn(o, ck(c.nombre), 'cat')}${masLP(o, 'cat')}</span></li>`; }).join('')}</ul>` : ''}
    ${seccionLP(k)}</div>`;
}


// ---------- mapa esquemático (SVG propio, sin internet) ----------
// Coordenadas aproximadas de reserva si el JSON no trae lat/lon.
const COORDS = {
  seul: [37.57, 126.98], incheon: [37.46, 126.44], andong: [36.57, 128.73],
  gyeongju: [35.86, 129.22], busan: [35.18, 129.08], jeonju: [35.82, 127.15]
};
// Contorno simplificado de Corea del Sur [lon, lat].
// Contorno aproximado de Corea del Sur [lon, lat] (de oeste a este por la DMZ y vuelta por la costa).
const DMZ = [[126.68,37.78],[126.82,37.86],[126.95,37.95],[127.15,38.08],[127.30,38.18],[127.45,38.26],[127.70,38.30],
  [127.90,38.31],[128.08,38.30],[128.22,38.38],[128.30,38.48],[128.36,38.62]];
const COSTA = [...DMZ,
  [128.42,38.50],[128.50,38.36],[128.58,38.20],[128.66,38.06],[128.76,37.92],[128.90,37.78],[129.02,37.66],[129.12,37.52],
  [129.20,37.40],[129.27,37.27],[129.33,37.10],[129.40,36.95],[129.43,36.78],[129.42,36.62],[129.40,36.45],[129.38,36.30],
  [129.40,36.12],[129.48,36.05],[129.58,36.08],[129.56,35.97],[129.50,35.82],[129.47,35.68],[129.45,35.55],[129.37,35.43],
  [129.30,35.32],[129.24,35.22],[129.17,35.16],[129.10,35.10],[129.07,35.05],[128.98,35.07],[128.88,35.07],[128.78,35.03],
  [128.70,35.00],[128.62,34.90],[128.48,34.84],[128.40,34.86],[128.30,34.92],[128.15,34.91],[128.02,34.88],[127.90,34.93],
  [127.78,34.85],[127.70,34.72],[127.58,34.78],[127.48,34.84],[127.40,34.70],[127.32,34.58],[127.22,34.66],[127.10,34.62],
  [126.98,34.55],[126.85,34.45],[126.72,34.36],[126.60,34.30],[126.52,34.32],[126.44,34.42],[126.38,34.55],[126.33,34.70],
  [126.40,34.85],[126.44,35.00],[126.36,35.14],[126.42,35.30],[126.46,35.45],[126.55,35.60],[126.52,35.72],[126.48,35.82],
  [126.62,35.95],[126.68,36.00],[126.58,36.12],[126.52,36.28],[126.50,36.42],[126.38,36.52],[126.28,36.62],[126.14,36.73],
  [126.22,36.85],[126.35,36.93],[126.50,36.98],[126.62,37.00],[126.78,36.92],[126.86,37.00],[126.80,37.08],[126.70,37.18],
  [126.64,37.30],[126.60,37.45],[126.58,37.58],[126.62,37.70]];
const JEJU = [126.55, 33.38, 0.36, 0.17]; // centro lon, lat y radios aproximados
const norm = t => String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z]/g, '');
const ck = t => norm(String(t || '').replace(/\(.*?\)/g, ''));
// Ciudad mencionada en un texto ("Starria Hostel (Seúl)" -> "seul"; aeropuerto -> "incheon").
function ciudadEnTexto(t) {
  const n = norm(t);
  if (/incheon|aeropuerto|icn/.test(n)) return 'incheon';
  const c = ciudadesUnicas().find(c => ck(c.nombre) && n.includes(ck(c.nombre)));
  return c ? ck(c.nombre) : ck(t);
}
const XY = ([lat, lon]) => [((lon - 125.9) * 81 + 10).toFixed(1), ((38.75 - lat) * 100 + 10).toFixed(1)];
function coordsDe(nombre) {
  const k = ck(nombre);
  const c = arr(trip.ciudades).find(c => ck(c.nombre) === k && c.lat != null && c.lon != null);
  return c ? [c.lat, c.lon] : COORDS[k];
}

function viewMapa() {
  const ciudades = arr(trip.ciudades);
  const pts = []; // ciudades únicas con coordenadas
  ciudades.forEach((c, i) => {
    const k = coordsDe(c.nombre); if (!k) return;
    const p = pts.find(p => String(p.k) === String(k));
    if (p) p.n.push(i + 1); else pts.push({ k, nombre: c.nombre, n: [i + 1], id: c.id });
  });
  if (!pts.length) return '';
  let tramos = arr(trip.traslados).map(t => ({ a: coordsDe(ciudadEnTexto(t.de)), b: coordsDe(ciudadEnTexto(t.a)), pend: isPend(t) }));
  const conTraslado = new Set(arr(trip.traslados).map(t => ciudadEnTexto(t.de) + '>' + ciudadEnTexto(t.a)));
  ciudades.forEach((c, i) => { // completa tramos sin traslado definido
    const d = ciudades[i + 1]; if (!d || conTraslado.has(ck(c.nombre) + '>' + ck(d.nombre))) return;
    tramos.push({ a: coordsDe(c.nombre), b: coordsDe(d.nombre), pend: false });
  });
  tramos = tramos.filter(t => t.a && t.b && String(t.a) !== String(t.b));
  const costa = COSTA.map(([lon, lat]) => XY([lat, lon]).join(',')).join(' ');
  const norte = [...DMZ.map(([lon, lat]) => XY([lat, lon]).join(',')), XY([38.75, 128.22]).join(','), XY([38.75, 125.9]).join(','), XY([37.78, 125.9]).join(',')].join(' ');
  const dmz = DMZ.map(([lon, lat]) => XY([lat, lon]).join(',')).join(' ');
  const [jx, jy] = XY([JEJU[1], JEJU[0]]);
  return `<svg class="mapa" viewBox="0 0 335 590" role="img" aria-label="Mapa de la ruta">
    <polygon class="norte" points="${norte}"/>
    <text class="mar" x="95" y="34" text-anchor="middle">COREA DEL NORTE</text>
    <polygon class="tierra" points="${costa}"/>
    <polyline class="dmz" points="${dmz}"/>
    <text class="mar" x="150" y="76" transform="rotate(-14 150 76)">DMZ</text>
    <ellipse class="tierra" cx="${jx}" cy="${jy}" rx="${(JEJU[2] * 81).toFixed(1)}" ry="${(JEJU[3] * 100).toFixed(1)}"/>
    <text class="mar" x="${jx}" y="${(+jy + 4).toFixed(1)}" text-anchor="middle">Jeju</text>
    <text class="mar" x="22" y="300" transform="rotate(-90 22 300)" text-anchor="middle">MAR AMARILLO</text>
    <text class="mar" x="322" y="220" transform="rotate(90 322 220)" text-anchor="middle">MAR DEL ESTE</text>
    <text class="mar" x="235" y="520" text-anchor="middle">ESTRECHO DE COREA</text>
    ${tramos.map(t => { const [x1, y1] = XY(t.a), [x2, y2] = XY(t.b);
      return `<line class="${t.pend ? 'pend' : 'ok'}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`; }).join('')}
    ${pts.map(p => { const [x, y] = XY(p.k); const izq = x > 230;
      return `<circle r="8" cx="${x}" cy="${y}" data-ciudad="${esc(p.id)}"/>
      <text x="${izq ? x - 12 : +x + 12}" y="${+y + 5}" text-anchor="${izq ? 'end' : 'start'}">${p.n.join('·')}. ${esc(p.nombre)}</text>`; }).join('')}
  </svg>
  <div class="leyenda muted">Mapa esquemático · <b style="color:var(--blue)">━</b> comprado ·
    <b style="color:var(--red)">┅</b> pendiente · toca una ciudad</div>`;
}

// ---------- Enseñar ----------
// 로 si termina en vocal o en ㄹ; 으로 en otra consonante.
function particula(ko) {
  const c = String(ko).trim().slice(-1).charCodeAt(0);
  if (c < 0xAC00 || c > 0xD7A3) return null; // no termina en hangul: no se puede saber
  const jong = (c - 0xAC00) % 28;
  return jong === 0 || jong === 8 ? '로' : '으로';
}
function fraseTaxi(ko) {
  const p = particula(ko);
  return p ? `${ko}${p} 가 주세요` : `${ko}(으)로 가 주세요`;
}

function lugarFila(l, key, k) {
  return `<div class="card lugar ${hecho(l, k) ? 'hecho-card' : ''}">
    <div><div class="big">${esc(l.es)}${lpTag(l)}${tick(l, k)} ${ver(l)}</div>${planBadge(l, k)}${k ? distHotel(l, k) : ''}
    ${l.ko ? `<div class="ko">${esc(l.ko)}</div>` : '<div class="falta">falta hangul: copiar de Naver Map</div>'}</div>
    <div class="acciones col">${naver(l)}<button class="mini" data-full="${key}">Enseñar</button></div></div>`;
}
// Ciudades del viaje (en orden, sin repetir) y después el resto del catálogo.
function ciudadesCatalogo() {
  const ids = [...new Set(arr(trip.ciudades).map(c => ck(c.nombre)))].filter(k => CATALOGO[k] || LP[k]);
  return [...ids, ...Object.keys(CATALOGO).filter(k => !ids.includes(k))];
}
const nombreCiudad = k => ((arr(trip.ciudades).find(c => ck(c.nombre) === k) || {}).nombre || k).replace(/\s*\(.*?\)/g, '');

// Ciudad de un lugar propio: campo "ciudad" si lo trae; si no, se busca el nombre de la ciudad en sus textos.
function ciudadDeLugar(l) {
  if (l.ciudad) return ck(l.ciudad);
  const txt = norm([l.es, l.direccion_en, l.nota].join(' ')), ko = [l.ko, l.direccion_ko].join(' ');
  const c = ciudadesUnicas().find(c => (ck(c.nombre) && txt.includes(ck(c.nombre))) || (c.ko && ko.includes(c.ko)))
    || ciudadesUnicas().find(c => { const h = hotelDe(ck(c.nombre)), p = coordsLugar(l); return h && p && km(h, p) < 25; });
  return c ? ck(c.nombre) : '';
}
// Botones de ciudad (los mismos de Ciudades). La ciudad elegida se comparte entre pestañas.
function botonesCiudad() {
  const uniq = ciudadesUnicas(); if (!uniq.length) return '';
  if (!ciudadSel || !uniq.some(c => ck(c.nombre) === ciudadSel)) {
    const a = ck(ciudadActual()); ciudadSel = uniq.some(c => ck(c.nombre) === a) ? a : ck(uniq[0].nombre);
  }
  return `<div class="ciudad-btns">${uniq.map(c => { const k = ck(c.nombre); return `<button class="cbtn ${k === ciudadSel ? 'on' : ''}" style="${varsTema(k)}" data-csel="${esc(k)}"><span>${tema(k).ic}</span>${esc(nombreCiudad(k))}</button>`; }).join('')}</div>`;
}
function viewEnsenar() {
  const botones = botonesCiudad(), k = ciudadSel || '';
  const mios = arr(trip.lugares).map((l, i) => [l, i]).filter(([l]) => l && typeof l === 'object');
  const deCiudad = mios.filter(([l]) => ciudadDeLugar(l) === k), otros = mios.filter(([l]) => !ciudadDeLugar(l));
  const sitios = sitiosCiudad(k).map((l, i) => [l, i]).sort((a, b) => ((enPlan(a[0], k) || {}).n || 999) - ((enPlan(b[0], k) || {}).n || 999) || a[1] - b[1]);
  return botones + `<div class="ens-ciudad" style="${varsTema(k)}">
    <p class="muted">Toca "Enseñar" para mostrarlo a pantalla completa al taxista o en recepción.</p>
    ${deCiudad.length ? `<h2>📌 Mis lugares en ${esc(nombreCiudad(k))}</h2>${deCiudad.map(([l, i]) => lugarFila(l, 'j:' + i, k)).join('')}` : ''}
    ${sitios.length ? `<h2>🗺️ Sitios conocidos</h2>${sitios.map(([l, i]) => lugarFila(l, `c:${k}:${i}`, k)).join('')}` : ''}
    ${otros.length ? `<details data-key="mis:otros" ${abierto('mis:otros', false) ? 'open' : ''}><summary class="card big">Otros lugares <span class="muted">${otros.length}</span></summary>${otros.map(([l, i]) => lugarFila(l, 'j:' + i, '')).join('')}</details>` : ''}
  </div>`;
}

// Reduce la letra hasta que cada línea quepa en la pantalla (los nombres coreanos largos no se parten).
function ajustarTexto(div) {
  div.querySelectorAll('.enorme, .dir').forEach(el => {
    let fs = parseFloat(getComputedStyle(el).fontSize);
    while (el.scrollWidth > el.clientWidth + 1 && fs > 14) { fs -= 2; el.style.fontSize = fs + 'px'; }
  });
}
function full(html) {
  const div = document.createElement('div');
  div.id = 'full';
  div.innerHTML = '<button class="sec cerrar" data-close>✕ Cerrar</button>' + html;
  document.body.appendChild(div);
  ajustarTexto(div);
  history.pushState({ full: 1 }, '');
  // Mantiene la pantalla encendida mientras se enseña la tarjeta.
  if (navigator.wakeLock) navigator.wakeLock.request('screen').then(l => { div._lock = l; }).catch(() => {});
}
function showFull(key) {
  const [t, a, b] = key.split(':');
  if (t === 'p') {
    const p = ((PLATOS[a] || [])[1] || [])[b]; if (!p) return;
    return full(`<div class="enorme">${esc(p[1])}</div><div class="es">${esc(p[0])} · ${esc(p[2])}</div><div class="es">Glosario Lonely Planet 2016</div>`);
  }
  if (t === 'f' || t === 'd') {
    const f = t === 'f' ? FRASES[a] : ((DICC[a] || [])[1] || [])[b]; if (!f) return;
    return full(`<div class="enorme">${esc(f[1])}</div><div class="es">${esc(f[0])} · ${esc(f[2])}</div>`);
  }
  if (t === 'pl') {
    const l = (typeof PLANES !== 'undefined' ? PLANES : [])[a]; if (!l) return;
    return full(`<div class="enorme">${esc(fraseTaxi(l.ko))}</div>${l.direccion_ko ? `<div class="dir">${esc(l.direccion_ko)}</div>` : ''}
      <div class="es">${esc(l.es)}${l.direccion_en ? '<br>' + esc(l.direccion_en) : ''}</div>`);
  }
  if (t === 'k') {
    const c = lugaresComer().find(x => String(x.id) === key.slice(2)); if (!c) return;
    return full(`${c.ko ? `<div class="enorme">${esc(c.ko)}</div>` : '<div class="falta">falta hangul: copiar de Naver Map</div>'}
      <div class="es">${esc(c.nombre || '')}${c.plato ? ' · ' + esc(c.plato) : ''}${c.direccion ? '<br>' + esc(c.direccion) : ''}</div>`);
  }
  const l = t === 'j' ? arr(trip.lugares)[a] : sitiosCiudad(a)[b];
  if (!l) return;
  full(`${l.ko ? `<div class="enorme">${esc(fraseTaxi(l.ko))}</div>
      ${particula(l.ko) ? '' : '<div class="es">VERIFICAR partícula (으)로</div>'}`
      : '<div class="falta">falta hangul: copiar de Naver Map</div>'}
    ${l.direccion_ko ? `<div class="dir">${esc(l.direccion_ko)}</div>` : ''}
    <div class="es">${esc(l.es)}${l.romanizacion ? ' · ' + esc(l.romanizacion) : ''}
      ${l.direccion_en ? '<br>' + esc(l.direccion_en) : ''}${l.nota ? '<br>' + esc(l.nota) : ''}
      ${l.verificar ? '<br>' + ver(l) : ''}</div>`);
}

// ---------- Corea (frases, diccionario, guía) ----------
let coreaSub = 'guia', guiaSel = null, fraseSit = 'Básicas';
const sinTildes = t => String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const dFila = (e, key) => `<div class="card lugar" data-full="${key}"><div><div>${esc(e[0])}${e[3] ? ' <span class="ver">VERIFICAR</span>' : ''}</div>
  <div class="ko">${esc(e[1])}</div><div class="muted">${esc(e[2])}</div></div></div>`;

function dResultados(q) {
  q = sinTildes(q).trim();
  if (!q) return DICC.map(([cat, es], ci) => `<details data-key="dc:${ci}" ${abierto('dc:' + ci, false) ? 'open' : ''}><summary class="card big">${esc(cat)} <span class="muted">${es.length}</span></summary>
    ${es.map((e, i) => dFila(e, `d:${ci}:${i}`)).join('')}</details>`).join('');
  const res = [];
  DICC.forEach(([, es], ci) => es.forEach((e, i) => {
    if (sinTildes(e[0]).includes(q) || sinTildes(e[2]).includes(q) || e[1].includes(q)) res.push(dFila(e, `d:${ci}:${i}`));
  }));
  return res.length ? res.slice(0, 80).join('') : '<p class="muted">Sin resultados. Prueba con otra palabra.</p>';
}

const icGuia = t => [[/t-money|transporte/i, '🚇'], [/taxi/i, '🚕'], [/propina/i, '💸'], [/zapato/i, '👟'], [/enchufe/i, '🔌'], [/^apps/i, '📱'], [/pago/i, '💳'],
  [/hangul/i, '🔤'], [/metro y ktx/i, '🚄'], [/clima/i, '🍂'], [/24 h/i, '🏪'], [/baños/i, '🚻'], [/internet/i, '📶'], [/tax free/i, '🛍️'], [/farmacia/i, '💊'], [/beber/i, '🍶'], [/^templos/i, '🛕'], [/fechas/i, '📅'], [/^comida/i, '🍜'], [/^etiqueta/i, '🙇'], [/seguridad|emergencia/i, '🚨'], [/entrada/i, '🛂'], [/básico/i, '🇰🇷'], [/consejos/i, '💡'], [/llevar/i, '🎒'], [/mesa/i, '🥢'], [/saber estar/i, '🤝']]
  .find(([r]) => r.test(t))?.[1] || '📌';
// Historia de Corea para leer en el avión: índice, capítulo, anterior/siguiente y marca de leído (en el móvil).
let histCap = null;
const minLect = c => Math.max(1, Math.round(c.p.join(' ').split(/\s+/).length / 220));
function viewHistoria() {
  const H = typeof HISTORIA_COREA !== 'undefined' ? HISTORIA_COREA : []; if (!H.length) return '';
  const U = u(); U.leidos = U.leidos || {};
  const tot = H.reduce((a, c) => a + minLect(c), 0), leidos = H.filter((c, i) => U.leidos[i]).length;
  if (histCap === null || !H[histCap]) {
    const sig = H.findIndex((c, i) => !U.leidos[i]);
    return `<div class="card hist-cab"><b>📜 Historia y cultura de Corea</b><div class="muted">${H.length} capítulos · unos ${tot} minutos de lectura · ${leidos} leídos</div>
      ${sig >= 0 ? `<button data-hc="${sig}">${leidos ? '▶ Seguir leyendo' : '▶ Empezar'}: ${esc(H[sig].t)}</button>` : '<div>✅ ¡Todo leído!</div>'}</div>
      <div class="hist-ind">${H.map((c, i) => `<button class="sec hist-it ${U.leidos[i] ? 'leido' : ''}" data-hc="${i}"><span>${c.ic}</span><span class="hist-t">${i + 1}. ${esc(c.t)}</span><small>${U.leidos[i] ? '✓' : minLect(c) + ' min'}</small></button>`).join('')}</div>`;
  }
  const c = H[histCap], i = histCap;
  return `<div class="card hist-cap"><div class="muted centro">Capítulo ${i + 1} de ${H.length} · ${minLect(c)} min</div>
    <h3 class="hist-h">${c.ic} ${esc(c.t)}</h3>${c.p.map(x => `<p>${esc(x)}</p>`).join('')}</div>
    <div class="row hist-nav"><button class="sec" data-hc="${i - 1}" ${i === 0 ? 'disabled' : ''}>◀</button><button class="sec" data-hc="ind">Índice</button>
      <button data-hc="${i + 1 < H.length ? i + 1 : 'ind'}" data-leido="${i}">${i + 1 < H.length ? 'Leído ▶' : 'Leído ✓'}</button></div>`;
}
function viewCorea() {
  const seg = [['guia', '🧭 Guía'], ['historia', '📜 Historia'], ['ensenar', '🪧 Enseñar'], ['frases', '💬 Frases'], ['dicc', '📖 Dicc.']].map(([k, t]) =>
    `<button class="${coreaSub === k ? '' : 'sec'}" data-sub="${k}">${t}</button>`).join('');
  let html = `<div class="row daynav seg5">${seg}</div>`;
  if (coreaSub === 'ensenar') html += viewEnsenar();
  else if (coreaSub === 'historia') html += viewHistoria();
  else if (coreaSub === 'frases') {
    let off = 0; const grupos = FRASES_SIT.map(([t, fs]) => { const g = [t, fs, off]; off += fs.length; return g; });
    const g = grupos.find(x => x[0] === fraseSit) || grupos[0];
    html += `<div class="chips sit">${grupos.map(([t]) => `<button class="chip ${t === g[0] ? 'on' : ''}" data-sit="${esc(t)}">${esc(t)}</button>`).join('')}</div>
      <p class="muted">Toca una frase para verla a pantalla completa.</p>` + g[1].map((f, i) => dFila(f, 'f:' + (g[2] + i))).join('');
  }
  else if (coreaSub === 'dicc') html += `<input id="q" type="search" placeholder="Buscar (español, coreano o romanización)" autocomplete="off">
    <div id="dres">${dResultados('')}</div>`;
  else {
    const g = GUIA.find(([t]) => t === guiaSel);
    html += `<div class="guia-rej">${GUIA.map(([t]) => `<button class="guia-t ${t === guiaSel ? 'on' : ''}" data-guia="${esc(t)}"><span>${icGuia(t)}</span>${esc(t.replace(/ \(Lonely Planet\)/, ''))}${/Lonely/.test(t) ? '<small>LP</small>' : ''}</button>`).join('')}</div>
      ${g ? `<div class="card guia-txt"><b>${icGuia(g[0])} ${esc(g[0])}</b><ul>${g[1].map(x => `<li>${esc(x).replace('VERIFICAR', '<span class="ver">VERIFICAR</span>')}</li>`).join('')}</ul></div>` : '<p class="muted centro">Toca un tema para verlo.</p>'}
      <p class="muted centro">La Lonely Planet (2016) solo vale para cultura: precios y apps, verificarlos.</p>`;
  }
  return html;
}


// ---------- Planes: League of Legends y cosmética ----------
let planesCiudad = null, planesCat = 'lol';
const PCATS = [['lol', '🎮 LoL'], ['cosme', '💄 Cosmética'], ['servicio', '🧺 Lavandería']];
// Calendario del Mundial de LoL con la ciudad donde estaréis cada día.
function worldsCard() {
  if (typeof WORLDS === 'undefined') return '';
  const hoy = todayISO(), dias = arr(trip && trip.dias);
  return `<details class="card worlds" data-key="worlds" ${abierto('worlds', false) ? 'open' : ''}><summary><b>🏆 Mundial de LoL 2026 · hora de Corea</b></summary>
    ${WORLDS.partidos.map(m => { const pas = m.f < hoy;
      // De madrugada seguís en la ciudad de la noche anterior.
      const d = dias.find(x => x.fecha === (parseInt(m.h) < 10 ? sumaDia(m.f, -1) : m.f));
      const tr = arr(trip && trip.traslados).find(t => t.fecha === m.f), sal = tr && tr.tren && tr.tren.salida;
      const donde = !d ? '' : ck(d.ciudad) === 'espana' ? 'en el avión' : `en ${esc(d.ciudad.replace(/ \(.*\)/, ''))}`;
      const extra = donde === 'en el avión' ? donde : sal && sal <= m.h ? `en el tren a ${esc(String(tr.a).replace(/.*\((.*)\)/, '$1'))} (sale ${esc(sal)})` : donde + (tr ? ' · día de traslado' : '');
      return `<div class="w-fila ${pas ? 'pasado' : ''} ${m.f === hoy ? 'hoy' : ''} ${m.t1 || m.final ? 'top' : ''}"><span class="hora">${fmtCorto(m.f)} ${esc(m.h)}</span><span><b>${esc(m.fase)}</b> · ${esc(m.p)}${extra ? `<small class="muted"> · ${extra}</small>` : ''}</span></div>`; }).join('')}
    <div class="muted">${esc(WORLDS.nota)} <span class="ver">VERIFICAR</span></div>
    <div class="muted">Dónde verlo en grupo: T1 Base Camp (Hongdae, Gangnam y Busan, 24 h) y LoL Park en Seúl. Final: el T1 Base Camp de Busan está a unos 300 m del hotel.</div></details>`;
}
const icPlan = p => ({ lol: '🎮', cosme: '💄', servicio: '🧺' })[p.cat] || '⭐';
function viewPlanes() {
  const P = typeof PLANES !== 'undefined' ? PLANES : [];
  const cs = CIUDADES_COMER.filter(([k]) => P.some(p => p.ciudad === k));
  if (!planesCiudad) { const a = ck(ciudadActual()); planesCiudad = cs.some(([k]) => k === a) ? a : (cs[0] || [])[0]; }
  const k = planesCiudad;
  // Sitios del catálogo e itinerario con coordenadas, para "cerca de".
  const sitios = [...((typeof IMPRES !== 'undefined' && IMPRES[k]) || []), ...(LP[k] || []), ...(CATALOGO[k] || [])]
    .filter((l, i, a) => coordsLugar(l) && !/^(Estación|Aeropuerto)/.test(l.es) && a.findIndex(x => hKey(x) === hKey(l)) === i);
  const card = p => {
    const c = coordsLugar(p), i = P.indexOf(p);
    const otros = c ? P.filter(o => o !== p && o.ciudad === k && coordsLugar(o)).map(o => [o, km(c, coordsLugar(o))]).filter(([, d]) => d <= 1.5).sort((a, b) => a[1] - b[1]) : [];
    const plan = c ? sitios.map(l => [l, km(c, coordsLugar(l)), enPlan(l, k)]).filter(([, d, e]) => d <= 1 && e).sort((a, b) => a[2].n - b[2].n || a[1] - b[1]).slice(0, 4) : [];
    return `<div class="card plan-card ${p.cat} ${hecho(p, k) ? 'hecho-card' : ''}">
      ${wikiDe(p) ? `<div class="foto banda" data-wiki="${esc(wikiDe(p))}"><span>${icPlan(p)}</span></div>` : ''}
      <div class="sd-tit">${btnHecho(p, k)}<b>${icPlan(p)} ${esc(p.es)}</b></div>
      <div class="ko-s">${esc(p.ko)}${distHotel(p, k)}</div>
      <div class="muted">${esc(p.desc)}</div>
      ${p.direccion_en ? `<div class="muted">📌 ${esc(p.direccion_en)}</div>` : ''}
      ${p.nota ? `<div class="muted">🕒 ${esc(p.nota).replace(/VERIFICAR/g, '<span class="ver">VERIFICAR</span>')}</div>` : ''}
      ${otros.length ? `<div class="cerca">Cerca: ${otros.map(([o, d]) => `${icPlan(o)} ${esc(o.es)} <span class="muted">${fmtDist(d)}</span>`).join(' · ')}</div>` : ''}
      ${plan.length ? `<div class="cerca">📅 Cerca de vuestro plan: ${plan.map(([l, d, e]) => `${esc(l.es)} <span class="muted">(día ${e.n}, ${fmtDist(d)})</span>`).join(' · ')}</div>` : ''}
      <div class="acciones">${naver(p)}<button class="mini" data-full="pl:${i}">Enseñar</button></div></div>`;
  };
  const grupo = (cat, t) => { const ls = P.filter(p => p.ciudad === k && p.cat === cat).sort((a, b) => (km(hotelDe(k) || [0, 0], coordsLugar(a) || [0, 0]) - km(hotelDe(k) || [0, 0], coordsLugar(b) || [0, 0])));
    return ls.length ? (t ? `<h2>${t}</h2>` : '') + ls.map(card).join('') : ''; };
  return `<div class="chips centro">${cs.map(([c, n]) => `<button class="chip ${c === k ? 'on' : ''}" data-pc="${c}">${tema(c).ic} ${n}</button>`).join('')}</div>
    <p class="muted">Ordenados por distancia al hotel. Horarios de webs (nov 2026): compruébalos antes de ir.</p>
    ${worldsCard()}${(() => { const cats = PCATS.filter(([c]) => P.some(p => p.ciudad === k && p.cat === c)); if (!cats.some(([c]) => c === planesCat)) planesCat = (cats[0] || [])[0];
      return `<div class="row daynav pcats">${cats.map(([c, t]) => `<button class="${c === planesCat ? '' : 'sec'}" data-pcat="${c}">${t}</button>`).join('')}</div>` + grupo(planesCat, ''); })()}`;
}

// ---------- Seguro ----------
function viewSeguro() {
  const s = trip.seguro;
  if (!s) return '<p class="muted">No hay datos del seguro (clave "seguro").</p>';
  const as = s.asistencia || {};
  const lista = (t, a, tag = 'ul') => arr(a).length ? `<h2>${t}</h2><div class="card"><${tag}>${arr(a).map(x => `<li>${esc(x)}</li>`).join('')}</${tag}></div>` : '';
  const air = s.airhelp_plus === true ? 'Sí' : s.airhelp_plus === false ? 'No' : esc(s.airhelp_plus ?? '');
  return `<div class="card">
      <div class="big">${esc(s.producto || 'Seguro')} ${ver(s)}</div>
      ${s.poliza ? `<div>Póliza: <b>${esc(s.poliza)}</b></div>` : ''}
      ${s.vigencia ? `<div>Vigencia: ${esc(s.vigencia)}</div>` : ''}
      ${arr(s.viajeros_asegurados).length ? `<div class="muted">Asegurados: ${arr(s.viajeros_asegurados).map(esc).join(', ')}</div>` : ''}
    </div>
    <h2>Asistencia</h2><div class="card">
      ${as.telefono ? `<div class="ko">${esc(as.telefono)}</div>
        <div class="row"><a class="btn" href="tel:${esc(String(as.telefono).replace(/[^\d+]/g, ''))}">📞 Llamar</a>
        <button class="sec" data-copy="${esc(as.telefono)}">📋 Copiar</button></div>` : '<div class="muted">Sin teléfono</div>'}
      ${as.app ? `<div>App: ${esc(as.app)}</div>` : ''}
      ${as.nota ? `<div class="muted">${esc(as.nota)}</div>` : ''}
    </div>
    ${lista('Coberturas clave', s.coberturas_clave)}
    ${s.airhelp_plus != null ? `<div class="card">AirHelp+: <b>${air}</b></div>` : ''}
    ${lista('Cómo reclamar', s.como_reclamar, 'ol')}`;
}
function copiar(t) {
  const ok = () => alert('Copiado: ' + t);
  if (navigator.clipboard) navigator.clipboard.writeText(t).then(ok, () => prompt('Copia el texto:', t));
  else prompt('Copia el texto:', t);
}

function viewPronto(nombre, ses) {
  return `<div class="card"><div class="big">${nombre}</div><p class="muted">Llega en la sesión ${ses}.</p></div>`;
}

// ---------- datos del usuario (gastos, checks, notas) ----------
function u() { // asegura la forma de "user" aunque venga de una copia antigua
  user.gastos = arr(user.gastos);
  if (!user.checklist || typeof user.checklist !== 'object') user.checklist = {};
  if (!user.extra || typeof user.extra !== 'object') user.extra = {};
  if (typeof user.notas !== 'string') user.notas = '';
  if (!user.verif || typeof user.verif !== 'object') user.verif = {};
  if (!user.hecho || typeof user.hecho !== 'object') user.hecho = {};
  return user;
}
const saveUser = () => save(K_USER, user);

// Lista de casillas: base (del JSON o catálogo) + elementos propios. scope separa cada lista.
function checks(scope, base) {
  const U = u(), propios = arr(U.extra[scope]);
  const items = [...base.map(b => ({ ...b, propio: false })), ...propios.map((t, i) => ({ id: 'p' + i, texto: t, propio: true, i }))];
  const hechos = items.filter(it => U.checklist[scope + '|' + it.id]).length;
  return `${items.length ? `<div class="muted">${hechos} de ${items.length} hechos</div>` : ''}
    ${items.length ? '<div class="card lista-check">' : ''}${items.map(it => { const k = scope + '|' + it.id; return `<label class="check">
      <input type="checkbox" data-check="${esc(k)}" ${U.checklist[k] ? 'checked' : ''}>
      <span>${esc(it.texto)}${it.url ? ` · <a href="${esc(it.url)}" target="_blank" rel="noopener">enlace</a>` : ''}</span>
      ${it.propio ? `<button class="sec mini" data-delitem="${esc(scope)}" data-i="${it.i}">✕</button>` : ''}</label>`; }).join('')}${items.length ? '</div>' : ''}
    <form class="row" data-additem="${esc(scope)}"><input name="t" placeholder="Añadir…" autocomplete="off"><button class="mini">＋</button></form>`;
}

function ciudadesUnicas() {
  const vistas = new Set();
  return arr(trip.ciudades).filter(c => { const k = ck(c.nombre); if (vistas.has(k)) return false; vistas.add(k); return true; });
}
function ciudadActual() {
  const d = arr(trip.dias).find(d => d.fecha === todayISO());
  if (d && d.ciudad) return d.ciudad;
  const t = todayISO(), c = arr(trip.ciudades).find(c => c.desde <= t && t < c.hasta);
  return c ? c.nombre : (arr(trip.ciudades)[0] || {}).nombre || '';
}

// Recuerda qué desplegables están abiertos entre redibujados.
const abiertos = {};
const abierto = (k, def) => (k in abiertos ? abiertos[k] : def);
document.addEventListener('toggle', e => { const k = e.target.dataset && e.target.dataset.key; if (k) abiertos[k] = e.target.open; }, true);

// ---------- "Hecho / visitado": una sola marca por sitio para toda la app ----------
// Clave por hangul (si lo hay) o por nombre: así el mismo sitio en Ciudades, Enseñar, Comer y Checklist comparte marca.
const hKey = l => 'p:' + (typeof l === 'string' ? norm(l) : (l && l.ko ? String(l.ko).replace(/\s+/g, '') : norm(l && (l.es || l.nombre))));
function hecho(l, k) {
  const U = u(), key = hKey(l);
  if (U.hecho[key]) return true;
  if (l && typeof l === 'object' && l.id != null && estadoDe(String(l.id)).estado === 'visitado') return true;
  if (k) { // marcas antiguas del checklist
    const n = norm(typeof l === 'string' ? l : (l.es || l.nombre));
    if (U.checklist['c:' + k + '|' + n] || U.checklist['c:' + k + '|' + n + 'lp']) return true;
  }
  return false;
}
function marcarHecho(key, v) {
  const U = u();
  if (v) U.hecho[key] = todayISO(); else delete U.hecho[key];
  // Comer: el mismo sitio pasa a "Visitado" (o lo deja de estar)
  lugaresComer().filter(l => hKey(l) === key).forEach(l => {
    U.comer = U.comer || {}; const e = U.comer[l.id] = U.comer[l.id] || {};
    if (v) e.estado = 'visitado'; else if (e.estado === 'visitado') e.estado = '';
  });
  // quita marcas antiguas equivalentes al desmarcar
  if (!v) Object.keys(U.checklist).forEach(k2 => { if (k2.startsWith('c:') && 'p:' + k2.split('|')[1]?.replace(/lp$/, '') === key) delete U.checklist[k2]; });
  saveUser();
}
const tick = (l, k) => hecho(l, k) ? ' <span class="badge ok">✅</span>' : '';
const btnHecho = (l, k) => `<button class="hk ${hecho(l, k) ? 'on' : ''}" data-hk="${esc(hKey(l))}" data-v="${hecho(l, k) ? 0 : 1}" aria-label="Hecho">✓</button>`;

// ---------- Checklist por ciudad ----------
function viewChecklist() {
  const cs = ciudadesUnicas();
  if (!cs.length) return '<p class="muted">No hay ciudades (clave "ciudades").</p>';
  const act = ck(ciudadActual());
  const fila = (l, k, txt) => `<label class="check"><input type="checkbox" data-hk="${esc(hKey(l))}" ${hecho(l, k) ? 'checked' : ''}><span>${txt}</span></label>`;
  return '<p class="muted">Lo que taches aquí sale tachado en toda la app (Ciudades, Enseñar, Hoy y Comer como "Visitado").</p>' + cs.map(c => {
    const k = ck(c.nombre);
    const sitios = [...(arr(c.interes).length ? arr(c.interes) : []), ...sitiosCiudad(k).filter(l => !/^(Estación|Aeropuerto|Terminal)/.test(l.es))]
      .filter((l, i, a) => a.findIndex(x => hKey(x) === hKey(l)) === i);
    const comer = lugaresComer().filter(l => l.ciudad === k && (['quiero', 'visitado'].includes(estadoDe(String(l.id)).estado) || l.fuente === 'itinerario'))
      .filter(l => !sitios.some(x => hKey(x) === hKey(l)));
    const hechos = [...sitios, ...comer].filter(l => hecho(l, k)).length;
    const sitiosO = porPlan(sitios, k), comerO = porPlan(comer, k);
    return `<details data-key="ck:${esc(k)}" ${abierto('ck:' + k, k === act) ? 'open' : ''}><summary class="card big">${esc(c.nombre)} <span class="muted">${hechos}/${sitios.length + comer.length}</span></summary>
      <div class="card lista-check">${sitiosO.map(l => fila(l, k, (typeof l === 'string' ? esc(l) : esc(l.es) + lpPill(l)) + planBadge(l, k))).join('')}</div>
      ${comer.length ? '<div class="muted sub">🍜 Para comer</div><div class="card lista-check">' + comerO.map(l => fila(l, k, esc(l.nombre) + (estadoDe(String(l.id)).estado === 'quiero' ? ' <span class="muted">⭐</span>' : '') + planBadge(l, k))).join('') + '</div>' : ''}
      <div class="muted sub">Mis cosas</div>${checks('c:' + k, [])}</details>`;
  }).join('');
}

// ---------- Comer (data/comer.json + lugares propios) ----------
let DATOS_COMER = [];
fetch('data/comer.json').then(r => r.json()).then(d => { DATOS_COMER = arr(d); if (['comer', 'hoy', 'verificar', 'mas'].includes(tab)) renderLuego(); }).catch(() => {});
const CIUDADES_COMER = [['seul', 'Seúl'], ['andong', 'Andong'], ['gyeongju', 'Gyeongju'], ['busan', 'Busan'], ['jeonju', 'Jeonju']];
const TIPOS = ['todos', 'restaurante', 'café', 'mercado', 'plato', 'bar'];
const ESTADOS = [['quiero', 'Quiero'], ['visitado', 'Visitado'], ['descartado', 'Descartado'], ['cerrado', 'Cerrado']];
const FUENTES = { itinerario: 'Itinerario', guia: 'Guía web (no verificado)', lonely: 'Lonely Planet 2016', propio: 'Propio' };
let verPlatos = false, platoGrupo = 0;
let comerCiudad = null, comerTipo = 'todos', comerForm = false, comerEstado = 'todos', comerOrden = 'rec';
const lugaresComer = () => [...DATOS_COMER, ...arr(u().comerPropios)].filter(l => l && typeof l === 'object');
const estadoDe = id => (u().comer && user.comer[id]) || {};

function viewComer() {
  if (comerCiudad === null) {
    const k = ck(ciudadActual());
    comerCiudad = CIUDADES_COMER.some(c => c[0] === k) ? k : 'todas';
  }
  const base = lugaresComer().filter(l => (comerCiudad === 'todas' || l.ciudad === comerCiudad) && (comerTipo === 'todos' || l.tipo === comerTipo));
  const est = l => estadoDe(String(l.id)).estado || '';
  const n = v => base.filter(l => est(l) === v).length;
  let lista = base.filter(l => comerEstado === 'todos' ? true : comerEstado === 'pendiente' ? !est(l) : est(l) === comerEstado);
  lista = ordenarComer(lista);
  const chip = (attr, v, t, on) => `<button class="chip ${on ? 'on' : ''}" ${attr}="${esc(v)}">${esc(t)}</button>`;
  const opt = (v, t, on) => `<option value="${esc(v)}" ${on ? 'selected' : ''}>${esc(t)}</option>`;
  const glosario = typeof PLATOS === 'undefined' ? '' : `<div class="glosario">
      <button class="sec glos-btn" data-act="platos">📖 Glosario de platos (Lonely Planet) ${verPlatos ? '▾' : '▸'}</button>
      ${verPlatos ? `<div class="chips">${PLATOS.map(([t], gi) => `<button class="chip ${gi === platoGrupo ? 'on' : ''}" data-pg="${gi}">${esc(t)}</button>`).join('')}</div>
        <div class="muted">Toca un plato para enseñárselo al camarero.</div>
        ${(PLATOS[platoGrupo] || PLATOS[0])[1].map((p, i) => `<div class="card plato" data-full="p:${platoGrupo}:${i}"><div><b>${esc(p[0])}</b><div class="muted">${esc(p[2])}</div></div><div class="ko">${esc(p[1])}</div></div>`).join('')}` : ''}
    </div>`;
  return glosario + `<div class="par filtros">
      <select data-sc aria-label="Ciudad">${opt('todas', '🗺️ Todas las ciudades', comerCiudad === 'todas')}${CIUDADES_COMER.map(([k, t]) => opt(k, `${tema(k).ic} ${t}${k === ck(ciudadActual()) ? ' (hoy)' : ''}`, comerCiudad === k)).join('')}</select>
      <select data-st aria-label="Tipo">${TIPOS.map(t => { const nt = lugaresComer().filter(l => (comerCiudad === 'todas' || l.ciudad === comerCiudad) && (t === 'todos' || l.tipo === t)).length;
        return t !== 'todos' && !nt && comerTipo !== t ? '' : opt(t, (t === 'todos' ? '🍽️ Todo tipo' : `${IC_COMER[t] || ''} ${t[0].toUpperCase() + t.slice(1)}`) + ` (${nt})`, comerTipo === t); }).join('')}</select>
    </div>
    <div class="chips">${chip('data-ce', 'todos', 'Todos', comerEstado === 'todos')}${chip('data-ce', 'quiero', `⭐ Quiero (${n('quiero')})`, comerEstado === 'quiero')}${chip('data-ce', 'visitado', `✅ Visitados (${n('visitado')})`, comerEstado === 'visitado')}${chip('data-ce', 'pendiente', 'Sin marcar', comerEstado === 'pendiente')}</div>
    <div class="orden"><span class="muted">${lista.length} lugares · Ordenar:</span>
      ${[['rec', 'Recomendado'], ['dist', 'Distancia'], ['val', 'Mi valoración']].map(([k, t]) => chip('data-co', k, t, comerOrden === k)).join('')}</div>
    ${lista.map(cardComer).join('') || '<p class="muted">No hay lugares con este filtro.</p>'}
    ${comerForm ? formComer() : '<button class="sec" data-act="comer-nuevo">＋ Añadir lugar</button>'}`;
}

// Orden: recomendado (Quiero, itinerario, ★ Lonely, guía…), distancia al hotel o mi valoración.
function puntos(l) {
  const e = estadoDe(String(l.id));
  if (['descartado', 'cerrado'].includes(e.estado)) return -100;
  return (e.estado === 'quiero' ? 100 : 0) + (l.fuente === 'itinerario' ? 50 : 0) + (/★/.test(l.nota || '') ? 30 : 0)
    + (l.fuente === 'guia' ? 20 : l.fuente === 'lonely' ? 10 : 0) + (Number(e.val) || 0) * 5 - (e.estado === 'visitado' ? 40 : 0);
}
function distKm(l) { const h = hotelDe(l.ciudad), p = coordsLugar(l); return h && p ? km(h, p) : Infinity; }
function ordenarComer(ls) {
  const r = ls.map((l, i) => [l, i]);
  const f = comerOrden === 'dist' ? ([a], [b]) => distKm(a) - distKm(b)
    : comerOrden === 'val' ? ([a], [b]) => (Number(estadoDe(String(b.id)).val) || 0) - (Number(estadoDe(String(a.id)).val) || 0) || puntos(b) - puntos(a)
    : ([a], [b]) => ((enPlan(a) || {}).n || 999) - ((enPlan(b) || {}).n || 999) || puntos(b) - puntos(a);
  return r.sort((x, y) => f(x, y) || x[1] - y[1]).map(x => x[0]);
}

function cardComer(l) {
  const id = String(l.id ?? ''), e = estadoDe(id), q = l.ko || l.nombre || '';
  const ciudad = (CIUDADES_COMER.find(c => c[0] === l.ciudad) || [])[1] || l.ciudad || '';
  const cinta = { quiero: '⭐ QUIERO IR', visitado: '✅ VISITADO', descartado: 'DESCARTADO', cerrado: '🚫 CERRADO' }[e.estado];
  return `<div class="card comer ${tipoClase(l.tipo)} est-${esc(e.estado || '')}">
    ${cinta ? `<div class="cinta">${cinta}</div>` : ''}
    <div class="big"><span class="ic-tipo">${IC_COMER[l.tipo] || '🍽️'}</span> ${esc(l.nombre || 'Sin nombre')}${lpPill(l)}</div>${planBadge(l)}
    ${wikiDe(l) ? `<div class="foto banda" data-wiki="${esc(wikiDe(l))}"><span>📷</span></div>` : ''}
    ${l.ko ? `<div class="ko">${esc(l.ko)}</div>` : ''}
    <div class="muted">${[l.tipo, l.plato].filter(Boolean).map(esc).join(' · ')}${ciudad && comerCiudad === 'todas' ? ' · ' + esc(ciudad) : ''}${distHotel(l, l.ciudad)}</div>
    ${l.precio ? `<div>💰 ${esc(l.precio)}${precioEur(l.precio)}</div>` : ''}${l.horario ? `<div>🕒 ${esc(l.horario)}</div>` : ''}
    ${l.direccion ? `<div class="muted">📍 ${esc(l.direccion)}</div>` : ''}
    ${l.nota ? `<div class="muted">${esc(l.nota)}</div>` : ''}
    <div class="muted">Fuente: ${esc(FUENTES[l.fuente] || l.fuente || '—')}${l.url ? ` · <a href="${esc(l.url)}" target="_blank" rel="noopener">enlace</a>` : ''}</div>
    ${l.comprobado ? `<div class="comprobado c-${esc(String(l.comprobado.estado || '').replace(/\s+/g, '-'))}">🔎 ${esc({ activo: 'Abierto según fuentes recientes', existe: 'Aparece en listados actuales', dudoso: 'Dudoso', 'no encontrado': 'No encontrado' }[l.comprobado.estado] || l.comprobado.estado)} (revisado ${esc(l.comprobado.fecha || '')})${l.comprobado.nota ? ': ' + esc(l.comprobado.nota) : ''}${l.comprobado.fuente ? ` · <a href="${esc(l.comprobado.fuente)}" target="_blank" rel="noopener">fuente</a>` : ''}</div>` : ''}
    <div>${verificado('k:' + id) ? '<span class="badge ok">✓ verificado</span>' : '<span class="ver">VERIFICAR que sigue abierto</span>'}
      <button class="sec mini verif" data-verif="k:${esc(id)}">${verificado('k:' + id) ? 'Deshacer' : '✓ Verificado'}</button></div>
    <div class="acciones">
      ${l.ko ? `<button class="sec mini" data-copy="${esc(l.ko)}">📋 Copiar coreano</button>` : ''}
      <button class="mini" data-full="k:${esc(id)}">Enseñar</button>
      ${q ? `<a class="btn sec mini" href="https://map.naver.com/p/search/${encodeURIComponent(q)}" target="_blank" rel="noopener">🗺️ Naver</a>` : ''}
      ${l.fuente === 'propio' ? `<button class="sec mini" data-delcomer="${esc(id)}">✕</button>` : ''}
    </div>
    <div class="chips estados">${ESTADOS.map(([k, t]) => `<button class="chip ${e.estado === k ? 'on' : ''} e-${k}" data-est="${esc(id)}" data-v="${k}">${k === 'quiero' ? '⭐ ' : ''}${t}</button>`).join('')}</div>
    <div class="estrellas">Mi valoración: ${[1, 2, 3, 4, 5].map(v => `<button class="star ${(Number(e.val) || 0) >= v ? 'on' : ''}" data-val="${esc(id)}" data-n="${v}" aria-label="${v} estrellas">★</button>`).join('')}</div>
    <textarea data-cnota="${esc(id)}" rows="1" placeholder="Nota propia…">${esc(e.nota || '')}</textarea>
  </div>`;
}

function formComer() {
  const def = comerCiudad === 'todas' ? 'seul' : comerCiudad;
  return `<form class="card" data-comerform>
    <div class="muted">Nuevo lugar (se guarda en este móvil)</div>
    <input name="nombre" placeholder="Nombre" required autocomplete="off">
    <div class="par"><select name="ciudad">${CIUDADES_COMER.map(([k, t]) => `<option value="${k}" ${k === def ? 'selected' : ''}>${t}</option>`).join('')}</select>
      <select name="tipo">${TIPOS.slice(1).map(t => `<option>${t}</option>`).join('')}</select></div>
    <input name="url" type="url" placeholder="Enlace (opcional, p. ej. hilo de Reddit)" autocomplete="off">
    <input name="nota" placeholder="Nota (opcional)" autocomplete="off">
    <div class="par"><button>Guardar</button><button type="button" class="sec" data-act="comer-cancelar">Cancelar</button></div>
  </form>`;
}

// ---------- Conversor ₩/€ (cambio automático del BCE con conexión; manual opcional) ----------
const cambio = () => Number(u().cambio) || Number(trip && trip.meta && trip.meta.cambio_won_por_euro) || 0;
const eur = n => n.toLocaleString('es-ES', { maximumFractionDigits: 2 }) + ' €';
const won = n => '₩' + Math.round(n).toLocaleString('es-ES');
// "20.000-30.000 KRW" -> " (≈ 13-20 €)"
function precioEur(p) {
  const c = cambio(); if (!c || !/KRW|₩|won/i.test(p)) return '';
  const ns = (String(p).match(/\d[\d.,]*/g) || []).map(x => Number(x.replace(/[.,]/g, ''))).filter(n => n >= 100);
  return ns.length ? ` <span class="muted">(≈ ${ns.map(n => Math.round(n / c)).join('-')} €)</span>` : '';
}
// ---------- Tiempo (Open-Meteo, sin clave; solo con conexión, se guarda para offline) ----------
const K_TIEMPO = 'corea.tiempo';
let TIEMPO = load(K_TIEMPO, null);
const icTiempo = c => c == null ? '' : c === 0 ? '☀️' : c <= 2 ? '🌤️' : c === 3 ? '☁️' : c <= 48 ? '🌫️' : c <= 57 ? '🌦️' : c <= 67 ? '🌧️' : c <= 77 ? '🌨️' : c <= 82 ? '🌦️' : c <= 86 ? '🌨️' : '⛈️';
const descTiempo = c => c == null ? '' : c === 0 ? 'Despejado' : c <= 2 ? 'Poco nuboso' : c === 3 ? 'Nublado' : c <= 48 ? 'Niebla' : c <= 57 ? 'Llovizna' : c <= 67 ? 'Lluvia' : c <= 77 ? 'Nieve' : c <= 82 ? 'Chubascos' : c <= 86 ? 'Chubascos de nieve' : 'Tormenta';
function coordsCiudad(k) {
  const h = hotelDe(k); if (h) return h;
  const c = arr(trip && trip.ciudades).find(c => ck(c.nombre) === k && c.lat != null && c.lon != null);
  return c ? [Number(c.lat), Number(c.lon)] : COORDS[k] || null;
}
async function actualizarTiempo() {
  if (!trip || !navigator.onLine) return;
  if (TIEMPO && TIEMPO.ts && Date.now() - TIEMPO.ts < 3 * 3600e3) return;
  const ks = [...new Set(arr(trip.dias).map(d => ck(d.ciudad)))].filter(k => coordsCiudad(k));
  const nuevo = { ts: Date.now(), c: {} };
  await Promise.all(ks.map(async k => {
    const [la, lo] = coordsCiudad(k);
    try {
      const d = await (await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${la.toFixed(3)}&longitude=${lo.toFixed(3)}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Asia%2FSeoul&forecast_days=16`, { cache: 'no-store' })).json();
      const t = d && d.daily; if (!t || !t.time) return;
      nuevo.c[k] = {}; t.time.forEach((f, i) => { nuevo.c[k][f] = [t.weather_code[i], t.temperature_2m_max[i], t.temperature_2m_min[i], t.precipitation_probability_max[i]]; });
    } catch { /* sin conexión o servicio caído */ }
  }));
  if (!Object.keys(nuevo.c).length) return;
  TIEMPO = { ts: nuevo.ts, c: { ...((TIEMPO && TIEMPO.c) || {}), ...nuevo.c } };
  try { save(K_TIEMPO, TIEMPO); } catch {}
  if (tab === 'hoy' || tab === 'ruta') renderLuego();
}
const tiempoDe = (k, f) => (TIEMPO && TIEMPO.c && TIEMPO.c[k] && TIEMPO.c[k][f]) || null;
const haceTiempo = () => { if (!TIEMPO || !TIEMPO.ts) return ''; const m = Math.round((Date.now() - TIEMPO.ts) / 60000); return m < 60 ? `hace ${Math.max(1, m)} min` : m < 48 * 60 ? `hace ${Math.round(m / 60)} h` : `hace ${Math.round(m / 1440)} días`; };
function lineaTiempo(d) {
  const t = tiempoDe(ck(d.ciudad), d.fecha); if (!t) return '';
  const [c, mx, mn, p] = t, viejo = Date.now() - TIEMPO.ts > 24 * 3600e3;
  return `<div class="tiempo">${icTiempo(c)} <b>${Math.round(mn)}° / ${Math.round(mx)}°</b> · ${descTiempo(c)}${p != null ? ` · 💧 ${p} %` : ''} <span class="muted ${viejo ? 'viejo' : ''}">(${haceTiempo()})</span></div>`;
}
const miniTiempo = (k, f) => { const t = tiempoDe(k, f); return t ? `<span class="t-mini">${icTiempo(t[0])} ${Math.round(t[1])}°/${Math.round(t[2])}°</span>` : ''; };

async function actualizarCambio(forzar) {
  const U = u();
  if (!navigator.onLine || (U.cambioManual && !forzar)) return;
  if (!forzar && U.cambioTs && Date.now() - U.cambioTs < 6 * 3600e3) return;
  const urls = ['https://api.frankfurter.dev/v1/latest?base=EUR&symbols=KRW', 'https://api.frankfurter.app/latest?from=EUR&to=KRW'];
  for (const url of urls) {
    try {
      const d = await (await fetch(url, { cache: 'no-store' })).json();
      const r = d && d.rates && Number(d.rates.KRW);
      if (r > 0) {
        Object.assign(U, { cambio: Math.round(r * 100) / 100, cambioFecha: d.date || todayISO(), cambioTs: Date.now(), cambioManual: false });
        saveUser(); refrescarConv(); if (tab === 'conv') renderLuego(); return true;
      }
    } catch { /* probar la siguiente */ }
  }
  if (forzar) alert('No se pudo actualizar el cambio (¿sin conexión?).');
}
// Conversor en ventana (botón 💱 de la cabecera).
function abrirConv() {
  if (document.getElementById('conv-pop')) return;
  const d = document.createElement('div'); d.id = 'conv-pop';
  d.innerHTML = `<div class="pop-caja"><div class="pop-cab"><b>💱 Conversor ₩ / €</b><button class="sec mini" data-close>✕</button></div><div class="pop-cuerpo">${viewConv()}</div></div>`;
  document.body.appendChild(d); history.pushState({ full: 1 }, '');
  actualizarCambio(false);
}
const refrescarConv = () => { const b = document.querySelector('#conv-pop .pop-cuerpo'); if (b) b.innerHTML = viewConv(); };
function viewConv() {
  const U = u(), c = cambio();
  const info = U.cambioManual ? 'Cambio manual' : U.cambioFecha ? `Cambio oficial del ${esc(U.cambioFecha)} (BCE)` : 'Sin cambio automático todavía';
  return `<div class="card conv">
      <div class="par"><input data-conv="KRW" type="number" inputmode="decimal" placeholder="₩ wones">
        <span>⇄</span><input data-conv="EUR" type="number" inputmode="decimal" placeholder="€ euros"></div>
      <div class="muted">${c ? `1 € = ${won(c)} · ${info}` : 'Falta el cambio: conéctate o escríbelo abajo.'}</div>
    </div>
    ${c ? `<div class="card tabla">${[1000, 5000, 10000, 20000, 50000, 100000].map(n => `<div class="lugar"><span>${won(n)}</span><b>${eur(n / c)}</b></div>`).join('')}</div>` : ''}
    <div class="card">
      <label class="cambio muted">Cambio manual: 1 € = <input data-cambio type="number" inputmode="decimal" step="any" value="${c || ''}" placeholder="1500"> ₩</label>
      <button class="sec" data-act="cambio-auto">🔄 Usar cambio automático (actualizar ahora)</button>
      <p class="muted">Con conexión se actualiza solo cada pocas horas y se guarda para usarlo sin conexión. Si escribes uno a mano, se usa el tuyo hasta que pulses el botón.</p>
    </div>`;
}

// ---------- Verificar: todo lo dudoso en una lista ----------
function pendientesVerificar() {
  const g = [];
  const mi = [];
  [['vuelos', 'Vuelo', v => v.tramo], ['alojamientos', 'Alojamiento', a => a.nombre], ['traslados', 'Traslado', t => `${t.de} → ${t.a}`], ['lugares', 'Lugar', l => l.es]]
    .forEach(([k, t, f]) => arr(trip && trip[k]).forEach(o => { if (o && o.verificar) mi.push({ key: vKey(o), titulo: f(o), sub: t, q: o.direccion_ko || o.ko || f(o) }); }));
  if (trip && trip.seguro && trip.seguro.verificar) mi.push({ key: vKey(trip.seguro), titulo: trip.seguro.producto || 'Seguro', sub: 'Seguro' });
  if (mi.length) g.push(['Mi viaje', mi]);
  const sit = [];
  Object.keys(LP).forEach(k => [...(CATALOGO[k] || []), ...LP[k]].forEach(l => { if (l.verificar) sit.push({ key: vKey(l), titulo: l.es, sub: nombreCiudad(k), q: l.ko || l.es }); }));
  if (sit.length) g.push(['Sitios', sit]);
  CIUDADES_COMER.forEach(([k, t]) => {
    const ls = lugaresComer().filter(l => l.ciudad === k && estadoDe(String(l.id)).estado !== 'cerrado')
      .map(l => ({ key: 'k:' + l.id, titulo: l.nombre, sub: [l.tipo, FUENTES[l.fuente] || l.fuente, l.comprobado && '🔎 ' + l.comprobado.estado].filter(Boolean).join(' · '), q: l.ko || l.nombre }));
    if (ls.length) g.push(['Comer · ' + t, ls]);
  });
  return g;
}
function viewVerificar() {
  const g = pendientesVerificar();
  const total = g.reduce((a, [, ls]) => a + ls.length, 0), hechos = g.reduce((a, [, ls]) => a + ls.filter(x => verificado(x.key)).length, 0);
  return `<div class="card"><b>${hechos} de ${total} verificados</b>
    <div class="muted">Abre cada uno en Naver (con conexión), comprueba que existe y sigue abierto, y pulsa "✓". Si ha cerrado, márcalo como "Cerrado" en Comer.</div></div>
    ${g.map(([t, ls]) => { const p = ls.filter(x => !verificado(x.key)).length; return `<details data-key="vf:${esc(t)}" ${abierto('vf:' + t, false) ? 'open' : ''}><summary class="card big">${esc(t)} <span class="muted">${p ? p + ' pendientes' : '✓ todo'}</span></summary>
      ${ls.map(x => `<div class="card lugar ${verificado(x.key) ? 'hecho' : ''}"><div><div>${esc(x.titulo)}</div><div class="muted">${esc(x.sub || '')}</div></div>
        <div class="acciones">${x.q ? `<a class="btn sec mini" href="https://map.naver.com/p/search/${encodeURIComponent(x.q)}" target="_blank" rel="noopener">🗺️</a>` : ''}
        <button class="mini ${verificado(x.key) ? 'sec' : ''}" data-verif="${esc(x.key)}">${verificado(x.key) ? 'Deshacer' : '✓'}</button></div></div>`).join('')}</details>`; }).join('')}`;
}

// Más con rejilla de iconos, como la Guía de Corea: se toca un tema y sale debajo.
let masSub = 'maleta';
const MAS_SUB = [['maleta', 'Maleta', '🧳'], ['checklist', 'Checklist', '✅'], ['seguro', 'Seguro', '🛡️'], ['verificar', 'Verificar', '🔎'],
  ['docs', 'Documentos', '📄'], ['notas', 'Notas', '📝'], ['datos', 'Datos y app', '⚙️']];
function viewMas() {
  const pend = trip ? pendientesVerificar().reduce((a, [, ls]) => a + ls.filter(x => !verificado(x.key)).length, 0) : 0;
  const subs = trip ? MAS_SUB : MAS_SUB.filter(([k]) => k === 'datos');
  if (!subs.some(([k]) => k === masSub)) masSub = subs[0][0];
  const rej = `<div class="guia-rej">${subs.map(([k, t, ic]) => `<button class="guia-t ${k === masSub ? 'on' : ''}" data-ms="${k}"><span>${ic}</span>${t}${k === 'verificar' && pend ? `<small>${pend}</small>` : ''}</button>`).join('')}</div>`;
  let c = '';
  if (masSub === 'maleta') { const docs = arr(trip.checklist_documentos).map((d, i) => ({ id: d.id || 'd' + i, texto: d.texto, url: d.url })); c = `<h2>🧳 Maleta y documentos</h2>${checks('docs', docs)}`; }
  else if (masSub === 'checklist') c = viewChecklist();
  else if (masSub === 'seguro') c = viewSeguro();
  else if (masSub === 'verificar') c = viewVerificar();
  else if (masSub === 'docs') c = viewFotos();
  else if (masSub === 'notas') c = `<h2>📝 Notas</h2><textarea data-notas rows="10" placeholder="Escribe aquí… (se guarda solo)">${esc(u().notas)}</textarea>`;
  else c = `<h2>Datos del viaje</h2>
    <button data-act="import">📂 Importar viaje</button>
    <button class="sec" data-act="export">💾 Exportar copia</button>
    <p class="muted">La copia incluye el viaje, checklist, notas, fotos, lo marcado en Comer y lo verificado. Guárdala fuera del móvil.
      Última copia: <b>${esc(localStorage.getItem('corea.ultimaCopia') || 'nunca')}</b></p>
    <h2>App</h2>
    <button class="sec" data-act="fotos">📷 Descargar fotos (para usar sin conexión)</button>
    <button class="sec" data-act="update">🔄 Forzar actualización (no borra tus datos)</button>
    <button class="danger" data-act="wipe">Borrar datos de este móvil</button>
    <p class="muted" id="ver">Versión: ${esc(window.VERSION || '…')}</p>`;
  return rej + c;
}

// Redibujado por tareas en segundo plano (datos, tiempo, fotos): se espera si estás usando un desplegable o escribiendo.
let renderPendiente = false;
function renderLuego() {
  const ae = document.activeElement;
  if (ae && /^(SELECT|INPUT|TEXTAREA)$/.test(ae.tagName) && ae.closest('#view, #conv-pop')) { renderPendiente = true; return; }
  render();
}
document.addEventListener('focusout', () => { if (renderPendiente) { renderPendiente = false; setTimeout(render, 50); } });

// ---------- render ----------
function render() {
  applyTheme();
  $('#title').textContent = (trip && trip.meta && trip.meta.titulo) || 'Viaje a Corea';
  $('#back').hidden = !pila.length;
  $('#tabs').innerHTML = TABS.map(([id, label, ic]) =>
    `<button data-tab="${id}" class="${tab === id || (id === 'mas' && EN_MAS.some(m => m[0] === tab)) ? 'on' : ''}"><span>${ic}</span>${label}</button>`).join('');

  if (['checklist', 'seguro', 'verificar'].includes(tab)) { masSub = tab; tab = 'mas'; }
  let html;
  if (!trip && tab !== 'mas' && tab !== 'conv') html = viewWelcome();
  else switch (tab) {
    case 'hoy': html = viewHoy(); break;
    case 'ruta': html = viewRuta(); break;
    case 'ensenar': coreaSub = 'ensenar'; html = viewCorea(); break;
    case 'seguro': html = viewSeguro(); break;
    case 'corea': html = viewCorea(); break;
    case 'ciudades': html = viewCiudades(); break;
    case 'conv': html = viewConv(); break;
    case 'planes': html = viewPlanes(); break;
    case 'verificar': html = viewVerificar(); break;
    case 'checklist': html = viewChecklist(); break;
    case 'comer': html = viewComer(); break;
    default: html = viewMas();
  }
  $('#view').innerHTML = html;
  if (['ciudades', 'hoy', 'comer', 'planes'].includes(tab)) pintarFotos();
  const ch = tab === 'hoy' && document.querySelector('#tira .dchip.on'); if (ch) ch.parentElement.scrollLeft = ch.offsetLeft - ch.parentElement.clientWidth / 2 + ch.offsetWidth / 2;
}

document.addEventListener('click', e => {
  // Casillas: las marca la app (así no se pierde el toque si la pantalla se redibuja en el móvil).
  const lab = e.target.closest('label.check');
  if (lab && !e.target.closest('a, button')) {
    const inp = lab.querySelector('input[type=checkbox]');
    if (inp) { const v = e.target === inp ? inp.checked : !inp.checked; e.preventDefault();
      if (inp.dataset.hk) marcarHecho(inp.dataset.hk, v);
      else if (inp.dataset.check) { u().checklist[inp.dataset.check] = v; if (!v) delete user.checklist[inp.dataset.check]; saveUser(); }
      render(); return; }
  }
  const del = e.target.closest('[data-delitem]');
  if (del) {
    e.preventDefault();
    arr(u().extra[del.dataset.delitem]).splice(+del.dataset.i, 1);
    saveUser(); render(); return;
  }
  const hk = e.target.closest('button[data-hk]');
  if (hk) { marcarHecho(hk.dataset.hk, hk.dataset.v === '1'); render(); return; }
  const vf = e.target.closest('[data-verif]');
  if (vf) {
    const U = u(), k = vf.dataset.verif;
    if (U.verif[k]) delete U.verif[k]; else U.verif[k] = todayISO();
    saveUser(); render(); return;
  }
  const pdf = e.target.closest('[data-pdf]');
  if (pdf) { const f = fotos.find(x => x.id === pdf.dataset.pdf); if (f) abrirPdf(f); return; }
  const fo = e.target.closest('[data-foto],[data-delfoto]');
  if (fo) {
    if (fo.dataset.foto) showFoto(fo.dataset.foto);
    else if (confirm('¿Borrar esta foto?')) {
      borrarFoto(fo.dataset.delfoto).then(cargarFotos).then(() => { history.back(); render(); });
    }
    return;
  }
  const x = e.target.closest('[data-full],[data-close],[data-copy],[data-ciudad]');
  if (x) {
    if (x.dataset.full) showFull(x.dataset.full);
    else if (x.dataset.copy) copiar(x.dataset.copy);
    else if (x.dataset.ciudad) {
      const c = arr(trip.ciudades).find(o => String(o.id) === x.dataset.ciudad); if (c) { ciudadSel = ck(c.nombre); historiaAbierta = false; }
      ir('ciudades'); render(); window.scrollTo(0, 0);
    }
    else history.back();
    return;
  }
  if (e.target.closest('#back')) { history.back(); return; }
  if (e.target.closest('#convbtn')) { abrirConv(); return; }
  if (e.target.id === 'conv-pop') { history.back(); return; }
  const cm = e.target.closest('[data-cc],[data-ct],[data-ce],[data-co],[data-val],[data-est],[data-delcomer]');
  if (cm) {
    if (cm.dataset.ce) comerEstado = cm.dataset.ce;
    else if (cm.dataset.co) comerOrden = cm.dataset.co;
    else if (cm.dataset.val) {
      const U = u(); U.comer = U.comer || {}; const o = U.comer[cm.dataset.val] = U.comer[cm.dataset.val] || {};
      const v = Number(cm.dataset.n); o.val = Number(o.val) === v ? 0 : v; saveUser();
    }
    else if (cm.dataset.cc) comerCiudad = cm.dataset.cc;
    else if (cm.dataset.ct) comerTipo = cm.dataset.ct;
    else if (cm.dataset.delcomer) {
      if (!confirm('¿Borrar este lugar propio?')) return;
      u().comerPropios = arr(user.comerPropios).filter(l => String(l.id) !== cm.dataset.delcomer); saveUser();
    } else {
      const U = u(); U.comer = U.comer || {}; const id = cm.dataset.est, v = cm.dataset.v;
      const e2 = U.comer[id] = U.comer[id] || {}; e2.estado = e2.estado === v ? '' : v;
      const lc = lugaresComer().find(x => String(x.id) === id);
      if (lc) { if (e2.estado === 'visitado') U.hecho[hKey(lc)] = todayISO(); else if (v === 'visitado') delete U.hecho[hKey(lc)]; }
      saveUser();
    }
    render(); return;
  }
  const ps = e.target.closest('[data-pasos]');
  if (ps) { pasosAb[ps.dataset.pasos] = ps.dataset.v === '1'; render(); return; }
  const pg = e.target.closest('[data-pg]');
  if (pg) { platoGrupo = +pg.dataset.pg; render(); return; }
  const cs = e.target.closest('[data-csel]');
  if (cs) { ciudadSel = cs.dataset.csel; historiaAbierta = false; lpTodos = false; render(); return; }
  const dd = e.target.closest('[data-dia]');
  if (dd) { dayIdx = +dd.dataset.dia; ir('hoy'); render(); return; }
  if (e.target.closest('#tema')) { const o = ['auto', 'light', 'dark'], t0 = load(K_THEME, 'auto'); save(K_THEME, o[(o.indexOf(t0) + 1) % 3]); applyTheme(); return; }
  // Desplegables con data-key: los controla la app (así no se cierran si la pantalla se redibuja).
  const sm = e.target.closest('details[data-key] > summary');
  if (sm) { e.preventDefault(); const dt = sm.parentElement; abiertos[dt.dataset.key] = !dt.open; dt.open = abiertos[dt.dataset.key]; return; }
  const hc = e.target.closest('[data-hc]');
  if (hc) { if (hc.dataset.leido !== undefined) { const U = u(); U.leidos = U.leidos || {}; U.leidos[hc.dataset.leido] = 1; saveUser(); }
    histCap = hc.dataset.hc === 'ind' ? null : +hc.dataset.hc; render(); window.scrollTo(0, 0); return; }
  const ap = e.target.closest('[data-agpick]');
  if (ap) { agendaAbre = agendaAbre === ap.dataset.agpick ? null : ap.dataset.agpick; render(); return; }
  const at = e.target.closest('[data-agtog]');
  if (at) { const [h, f] = at.dataset.agtog.split('|'); agendaToggle(h, f); render(); return; }
  const ax = e.target.closest('[data-agdel]');
  if (ax) { const f = ax.closest('[data-fecha]').dataset.fecha; agendaToggle(ax.dataset.agdel, f); render(); return; }
  const ar = e.target.closest('[data-agreset]');
  if (ar) { const U = u(); if (U.agenda && U.agenda[ar.dataset.agreset]) { U.agenda[ar.dataset.agreset].orden = null; U.agenda[ar.dataset.agreset].del = []; saveUser(); } render(); return; }
  const ds = e.target.closest('[data-dsel]');
  if (ds) { dayIdx = +ds.dataset.dsel; render(); return; }
  const hs = e.target.closest('[data-hs]');
  if (hs) { hoySub = hs.dataset.hs; render(); return; }
  const ms = e.target.closest('[data-ms]');
  if (ms) { masSub = ms.dataset.ms; render(); return; }
  const pk = e.target.closest('[data-pcat]');
  if (pk) { planesCat = pk.dataset.pcat; render(); return; }
  const pc = e.target.closest('[data-pc]');
  if (pc) { planesCiudad = pc.dataset.pc; render(); return; }
  const gs = e.target.closest('[data-guia]');
  if (gs) { guiaSel = guiaSel === gs.dataset.guia ? null : gs.dataset.guia; render(); return; }
  const b = e.target.closest('[data-tab],[data-act],[data-day],[data-theme],[data-go],[data-sub],[data-sit]');
  if (!b) return;
  if (b.dataset.sub) coreaSub = b.dataset.sub;
  else if (b.dataset.sit) fraseSit = b.dataset.sit;
  else if (b.dataset.tab) ir(b.dataset.tab);
  else if (b.dataset.go) ir(b.dataset.go);
  else if (b.dataset.day) { dayIdx += Number(b.dataset.day); }
  else if (b.dataset.theme) { save(K_THEME, b.dataset.theme); }
  else switch (b.dataset.act) {
    case 'import': $('#file').click(); return;
    case 'export': exportCopy(); return;
    case 'update':
      // Quita el service worker y la caché (no toca viaje, gastos, notas ni fotos) y recarga.
      Promise.all([
        navigator.serviceWorker ? navigator.serviceWorker.getRegistrations().then(rs => Promise.all(rs.map(r => r.unregister()))) : 0,
        window.caches ? caches.keys().then(ks => Promise.all(ks.map(k => caches.delete(k)))) : 0
      ]).finally(() => location.reload());
      return;
    case 'foto': $('#fotofile').click(); return;
    case 'comer-nuevo': comerForm = true; break;
    case 'cambio-auto': actualizarCambio(true); return;
    case 'historia': historiaAbierta = !historiaAbierta; break;
    case 'lp': lpAbierta = !lpAbierta; break;
    case 'platos': verPlatos = !verPlatos; break;
    case 'lptodos': lpTodos = !lpTodos; break;
    case 'fotos': descargarFotos(); return;
    case 'comer-cancelar': comerForm = false; break;
    case 'example': loadExample(); return;
    case 'wipe':
      if (!confirm('¿Borrar viaje, checklist, notas, fotos y lo marcado de este móvil? Exporta antes una copia.')) return;
      localStorage.removeItem(K_TRIP); localStorage.removeItem(K_USER);
      dbOp('readwrite', st => st.clear()).catch(() => {}); fotos = [];
      trip = null; user = { gastos: [], checklist: {}, notas: '' }; dayIdx = null; tab = 'hoy'; pila.length = 0;
  }
  render();
});
document.addEventListener('input', e => {
  const t = e.target;
  if (t.id === 'q') $('#dres').innerHTML = dResultados(t.value);
  else if (t.dataset.conv) {
    const otro = document.querySelector(`[data-conv="${t.dataset.conv === 'KRW' ? 'EUR' : 'KRW'}"]`), v = Number(t.value), c = cambio();
    otro.value = !t.value || !c ? '' : t.dataset.conv === 'KRW' ? (v / c).toFixed(2) : Math.round(v * c);
  }
  else if (t.dataset.notas !== undefined) { u().notas = t.value; saveUser(); }
  else if (t.dataset.cnota) { const U = u(); U.comer = U.comer || {}; (U.comer[t.dataset.cnota] = U.comer[t.dataset.cnota] || {}).nota = t.value; saveUser(); }
});
document.addEventListener('change', e => {
  const t = e.target;
  if (t.dataset.sc !== undefined) { comerCiudad = t.value; if (comerTipo !== 'todos' && !lugaresComer().some(l => (comerCiudad === 'todas' || l.ciudad === comerCiudad) && l.tipo === comerTipo)) comerTipo = 'todos'; render(); }
  else if (t.dataset.st !== undefined) { comerTipo = t.value; render(); }
  else if (t.dataset.hk) { marcarHecho(t.dataset.hk, t.checked); render(); }
  else if (t.dataset.check) { u().checklist[t.dataset.check] = t.checked; if (!t.checked) delete user.checklist[t.dataset.check]; saveUser(); render(); }
  else if (t.dataset.cambio !== undefined) { Object.assign(u(), { cambio: Number(t.value) || 0, cambioManual: true }); saveUser(); refrescarConv(); render(); }
});
document.addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target, d = Object.fromEntries(new FormData(f));
  if (f.dataset.comerform !== undefined) {
    const nombre = (d.nombre || '').trim(); if (!nombre) return;
    (u().comerPropios = arr(user.comerPropios)).push({ id: 'p-' + Date.now().toString(36), ciudad: d.ciudad, nombre, ko: null,
      tipo: d.tipo, plato: null, direccion: null, horario: null, precio: null, fuente: 'propio', url: (d.url || '').trim() || null, nota: (d.nota || '').trim() || null });
    comerForm = false; comerCiudad = d.ciudad;
  } else if (f.dataset.additem) {
    const t = (d.t || '').trim(); if (!t) return;
    (u().extra[f.dataset.additem] = arr(user.extra[f.dataset.additem])).push(t);
  } else return;
  saveUser(); render();
});
$('#fotofile').addEventListener('change', e => {
  if (e.target.files.length) anadirFotos([...e.target.files]);
  e.target.value = '';
});
$('#file').addEventListener('change', e => {
  if (e.target.files[0]) importFile(e.target.files[0]);
  e.target.value = '';
});


render();
cargarFotos().then(() => { if (tab === 'mas') renderLuego(); });
actualizarCambio(false); actualizarTiempo();
window.addEventListener('online', () => { actualizarCambio(false); actualizarTiempo(); });

// Pide al navegador que no borre los datos guardados si falta espacio.
if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});

if ('serviceWorker' in navigator) {
  // Si llega una versión nueva, recarga una vez para usarla (sin perder datos).
  const habiaSW = !!navigator.serviceWorker.controller;
  let recargado = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (habiaSW && !recargado) { recargado = true; location.reload(); }
  });
  navigator.serviceWorker.register('./sw.js').then(r => {
    document.addEventListener('visibilitychange', () => { if (!document.hidden) { r.update().catch(() => {}); actualizarCambio(false); } });
  });
}
// Muestra la versión de caché en Más.
if (window.caches) caches.keys().then(k => { const v = k.find(x => x.startsWith('corea-')); window.VERSION = v; const e = $('#ver'); if (e && v) e.textContent = 'Versión: ' + v; });
