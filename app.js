'use strict';

// Versión visible arriba. Súbela a la vez que CACHE en sw.js y --css-ver al final de styles.css.
const VERSION = 'v208';
// Si el móvil mezcla el app.js nuevo con la hoja de estilos vieja (red lenta al actualizar), se vuelve a pedir la hoja.
addEventListener('load', () => { try {
  const v = getComputedStyle(document.documentElement).getPropertyValue('--css-ver').replace(/["'\s]/g, '');
  const l = document.querySelector('link[rel="stylesheet"][href^="styles.css"]');
  if (l && v !== VERSION && navigator.onLine) l.href = 'styles.css?v=' + VERSION;
} catch {} });

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
  pila.push({ t: tab, y: window.scrollY }); tab = t; comerCongelado = false; history.pushState({ t }, ''); window.scrollTo(0, 0);
}
function cerrarFull() {
  const bp = document.getElementById('busca-pop'); if (bp) { bp.remove(); return true; }
  const cp = document.getElementById('conv-pop'); if (cp) { cp.remove(); return true; }
  const f = document.getElementById('full'); if (!f) return false;
  f._lock?.release().catch(() => {}); f.remove(); return true;
}
window.addEventListener('popstate', () => {
  if (cerrarFull()) { if (buscaTras) { const f = buscaTras; buscaTras = null; setTimeout(f, 0); } return; }
  if (pila.length) { const a = pila.pop(); tab = a.t || a; render(); const y = a.y || 0; window.scrollTo(0, y); setTimeout(() => window.scrollTo(0, y), 60); }
});
let dayIdx = null;

const TABS = [
  ['hoy', 'Hoy', '📅'], ['ruta', 'Ruta', '✈️'], ['ciudades', 'Planes', '🏯'], ['mapas', 'Mapas', '🗺️'], ['historia', 'Historia', '📜'], ['corea', 'Corea', '🇰🇷'],
  ['idioma', 'Idioma', '🔤'], ['mas', 'Más', '☰']
];
// Secciones agrupadas dentro de "Más" (la barra no cabe con 9 pestañas).
const EN_MAS = [['seguro', 'Seguro', '🛡️'], ['verificar', 'Verificar', '🔎']];

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
function resaltar(t, prosa = false) {
  let h = esc(t);
  h = h.replace(/\b(\d{1,2}[:.]\d{2}(?:\s*[-–→]\s*\d{1,2}[:.]\d{2})?)\b/g, '<b>$1</b>')
    .replace(/\b(KTX(?:-Eum)?|AREX(?: Express)?|SRT|ITX)\b/g, '<b>$1</b>')
    .replace(/\b((?:bus|Bus|metro|línea)\s+\d{1,4}(?:-\d)?)\b/g, '<b>$1</b>')
    .replace(/((?:[\d.]+(?:-[\d.]+)?\s?₩)|(?:₩\s?[\d.]+))/g, '<b>$1</b>')
    .replace(/\b([A-ZÁÉÍÓÚÑ]{4,}(?:\s+[A-ZÁÉÍÓÚÑ]{2,})*)\b/g, '<b class="mayus">$1</b>')
    .replace(/((?:[A-Z][\w-]+\s)?(?:Station|Terminal))/g, '<b>$1</b>')
    .replace(/(estación de [A-ZÁÉÍÓÚ][\w-]+)/g, '<b>$1</b>')
    .replace(/(?<![\w>])(\d+(?:[.,]\d+)?(?:-\d+(?:[.,]\d+)?)?\s?(?:km|m|min|h|€)(?![\wáéíóú]))/g, '<b>$1</b>')
    .replace(/<b class="mayus">VERIFICAR<\/b>|VERIFICAR/g, '<span class="ver">VERIFICAR</span>');
  // Nombres propios: grupos de palabras con mayúscula (fuera de las negritas ya puestas), salvo palabras comunes de inicio de frase.
  return h.split(/(<b[^>]*>.*?<\/b>|<span[^>]*>.*?<\/span>|<[^>]+>)/).map((s, i) => i % 2 ? s : s.replace(/(?:[A-ZÁÉÍÓÚÑ][a-záéíóúñ][a-záéíóúñ'’-]*(?:\s(?=[A-ZÁÉÍÓÚÑ][a-záéíóúñ]))?)+/g, (m, off, all) => {
    const ws = m.trim().split(/\s+/); while (ws.length && NO_PROPIO.has(ws[0])) ws.shift();
    // En texto corrido, una palabra suelta con mayúscula al principio de frase no es nombre propio.
    if (prosa && ws.length === 1 && m.trim() === ws[0] && /(^|[.!?:;«"(]\s*|\n\s*)$/.test(all.slice(0, off))) return m;
    if (!ws.length) return m; const prop = ws.join(' '), i0 = m.indexOf(prop);
    return m.slice(0, i0) + '<b>' + prop + '</b>' + m.slice(i0 + prop.length);
  })).join('');
}
const NO_PROPIO = new Set('Fíjate Consejo Estado Gratis Según Tras Durante Desde Aquí Muy Hoy Cuenta El La Los Las Un Una En Con De Del Y O A Al Para Por Sin Si Se Su Sus Es Ver Ir Bajar Subir Cena Cenar Almuerzo Comer Comida Desayuno Merienda Paseo Pasear Llegada Llegar Salida Vuelo Visitas Visita Metro Bus Taxi Tren Alquiler Mañana Tarde Noche Retomar Atardecer Volver Vuelta Propuesta Ajustar Acostarse Comprobar Consejo Ojo Estar Pendiente Check-in Noche Hora Horario Entrada Gratis Cerrado Abre Plan Opción Objetivo Coger Madrugar Silencio Priorizar Tomar Si Asientos Asiento Cambio Primera Económica Danza Centro Coche Pasa Empezar Alternativa Cafés Café Mercado Playa Aldea Museo Barrio Prisión Historia Escuela Templo Palacio Santuario Acantilado Puente Puerta Mirador Calle Parque Observatorio Túmulos Isla Nacional'.split(' '));
const isPend = t => /pendiente/i.test(t.estado || '');
// Billete del traslado: tren o autobús (mismos campos: salida, llegada, numero, coche, asientos, precio, nota).
const billete = t => (t && (t.tren || t.bus)) || null;
const isOk = t => /comprad/i.test(t.estado || '') || (billete(t) && billete(t).comprado === true);
function estadoBadge(t) {
  if (isPend(t)) return `<span class="badge pend">${esc(t.estado)}</span>`;
  if (isOk(t)) return `<span class="badge ok">${esc(t.estado || 'COMPRADO')}</span>`;
  return t.estado ? `<span class="badge otro">${esc(t.estado)}</span>` : '';
}

// Hora en Corea y en España.
const horaEn = tz => new Date().toLocaleTimeString('es-ES', { timeZone: tz, hour: '2-digit', minute: '2-digit' });
// Bandera de Canarias (no existe como emoji): blanco, azul y amarillo.
const CANARIAS = '<svg class="bandera" viewBox="0 0 3 2" aria-label="Canarias"><rect width="1" height="2" fill="#fff"/><rect x="1" width="1" height="2" fill="#0768a9"/><rect x="2" width="1" height="2" fill="#fc0"/><rect width="3" height="2" fill="none" stroke="#999" stroke-width=".08"/></svg>';
// Hora de Canarias en la cabecera (la de Corea ya la da el móvil).
const relojes = () => `${CANARIAS} ${horaEn('Atlantic/Canary')}`;
const pintarReloj = () => { const e = document.getElementById('reloj'); if (e) e.innerHTML = relojes(); };
pintarReloj(); setInterval(pintarReloj, 30000);

function sumaDia(iso, n) {
  const d = new Date(iso + 'T12:00:00Z'); if (isNaN(d)) return '';
  d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10);
}

// Botones para abrir un sitio en Naver Map y en Google Maps (necesitan conexión).
const googleMaps = (q, t = 'Google') => q ? `<a class="btn sec mini" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}" target="_blank" rel="noopener">📍 ${t}</a>` : '';
function naver(l) {
  const q = (l && (l.direccion_ko || l.ko || l.direccion_en || l.es || l.nombre)) || '';
  return q ? `<a class="btn sec mini" href="https://m.map.naver.com/search2/search.naver?query=${encodeURIComponent(q)}" data-app="naver" data-q="${esc(q)}" target="_blank" rel="noopener">🗺️ Naver</a>${googleMaps(q)}` : '';
}

// ---------- distancias al hotel (línea recta, sin conexión) ----------
let COORDS_LUGARES = {};
// Datos fijos: si la red va lenta o falla, se reintenta, y al llegar se redibuja SIEMPRE (antes, en Hoy no: salía sin mapa, números ni tramos).
function cargaDatos(url, ok, n = 4) { fetch(url).then(r => r.json()).then(d => { ok(d); renderLuego(); }).catch(() => { if (n > 0) setTimeout(() => cargaDatos(url, ok, n - 1), 2500); }); }
cargaDatos('data/coords.json', d => { COORDS_LUGARES = d || {}; });
const coordsLugar = l => {
  if (!l) return null;
  if (l.lat != null && l.lon != null) return [Number(l.lat), Number(l.lon)];
  // Corrección propia con el GPS («📍 Estoy aquí», user.coordsFix[hKey]) manda sobre coords.json.
  const fx = typeof user !== 'undefined' && user && user.coordsFix && (l.es || l.ko || l.nombre) && user.coordsFix[hKey(l)]; if (fx) return fx;
  return COORDS_LUGARES[l.id] || COORDS_LUGARES[l.ko] || COORDS_LUGARES[l.es] || null;
};
function km([a, b], [c, d]) {
  const r = Math.PI / 180, x = Math.sin((c - a) * r / 2) ** 2 + Math.cos(a * r) * Math.cos(c * r) * Math.sin((d - b) * r / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(x));
}
// Hotel de una ciudad con coordenadas (de trip.json, privado).
// Ubicación del hotel: la corregida en el móvil («📌 Estoy en el hotel», user.coordsFix['hotel:<id>']) manda sobre la de trip.json.
const hotelFixKey = a => 'hotel:' + (a.id || a.nombre);
const hotelDe = k => { const U = typeof user !== 'undefined' && user && user.coordsFix || {};
  const hs = arr(trip && trip.alojamientos).filter(a => a && ck(a.ciudad) === k), f = hs.find(a => U[hotelFixKey(a)]); if (f) return U[hotelFixKey(f)];
  const h = hs.find(a => a.lat != null && a.lon != null); return h ? [Number(h.lat), Number(h.lon)] : null; };
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
// --c1t: el color de la ciudad aclarado (55 % blanco), para textos en modo oscuro sin depender de color-mix().
const aclarar = (hex, f = .55) => '#' + [1, 3, 5].map(i => Math.round(parseInt(hex.slice(i, i + 2), 16) * (1 - f) + 255 * f).toString(16).padStart(2, '0')).join('');
const varsTema = k => { const t = tema(k); return `--c1:${t.c1};--c2:${t.c2};--c1t:${aclarar(t.c1)}`; };
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
const STOP = new Set('hahoe sauna palacio templo mercado aldea barrio calle parque museo nacional gruta observatorio tumulos playa estanque santuario catedral cafe restaurante hanok village puerta mirador academia escuela torre puente plaza estacion aeropuerto cultural tradicional folclorica comida callejera puestos desayuno platos probar seul seoul andong gyeongju busan jeonju incheon corea hotel seowon square market para con los las del una tumbas reales hall center centro comercial historia moderna arte murales teleferico tour city turistico bus cafes wonjo halmae gukbap milmyeon jjimdak bibimbap samgyeopsal bakery calle viejo rocas yongsan tumba rey reina bosque escuela confuciana'.split(' '));
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
const miniFoto = l => { const w = wikiDe(l) || (l && l.ko && !l.sinFoto ? 'ko:' + String(l.ko).replace(/\s+/g, '') : ''); return w ? `<div class="foto mini" data-wiki="${esc(w)}"><span>📷</span></div>` : ''; };

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
      if (obj.tipo === 'corea-marcas' && obj.user) { // marcas del otro móvil: se unen a las mías
        const n = fundirMarcas(obj.user); render();
        alert(`Marcas unidas: ${n.hecho} visitados, ${n.favs} favoritas, ${n.diario} días del diario, ${n.comer} sitios de Comer y ${n.regalos} regalos nuevos. No se ha borrado nada.`); return;
      }
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
      // Con el viaje ya cargado se sabe de qué ciudades pedir el tiempo (antes no había datos).
      if (TIEMPO) TIEMPO.ts = 0; actualizarTiempo(); actualizarCambio(false);
      alert('Viaje importado y guardado en el móvil.');
    } catch {
      alert('El archivo no es un JSON válido.');
    }
  };
  r.readAsText(file);
}
// ---------- Compartir marcas entre móviles, regalos y resumen del viaje ----------
// Guarda o comparte un archivo (en el móvil abre el menú de compartir: WhatsApp, correo…).
async function compartirArchivo(nombre, texto, tipo) {
  const blob = new Blob([texto], { type: tipo });
  try { const file = new File([blob], nombre, { type: tipo });
    if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], title: nombre }); return; } }
  catch (e) { if (e && e.name === 'AbortError') return; }
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = nombre; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}
// Marcas: lo que cada uno apunta en su móvil. Se pasan en un archivo y se UNEN (nunca se borra nada).
const MARCAS = ['hecho', 'estrellas', 'avisosOk', 'coordsFix', 'favs', 'diario', 'comer', 'agenda', 'hgLeidas', 'leidos', 'regalos', 'hdIni', 'hdLev', 'checklist'];
function exportMarcas() {
  const U = u(), m = {}; MARCAS.forEach(k => { if (U[k] != null) m[k] = U[k]; });
  compartirArchivo(`corea-marcas-${todayISO()}.json`, JSON.stringify({ tipo: 'corea-marcas', fecha: new Date().toISOString(), user: m }), 'application/json');
}
function fundirMarcas(o) {
  const U = u(), n = { hecho: 0, favs: 0, diario: 0, comer: 0, regalos: 0 };
  const junta = (a, b) => !a ? b : !b || a === b || a.includes(b) ? a : a + '\n— ' + b;
  U.hecho = U.hecho || {}; Object.entries(o.hecho || {}).forEach(([k, v]) => { if (v && !U.hecho[k]) { U.hecho[k] = v; n.hecho++; } });
  U.favs = arr(U.favs); arr(o.favs).forEach(f => { if (f && !U.favs.some(x => x.k === f.k)) { U.favs.push(f); n.favs++; } });
  U.diario = U.diario || {}; Object.entries(o.diario || {}).forEach(([f, d]) => { const m = U.diario[f] = U.diario[f] || {}, antes = JSON.stringify(m);
    if (!m.cara && d.cara) m.cara = d.cara; if (arr(d.tags).length) m.tags = [...new Set([...arr(m.tags), ...arr(d.tags)])]; const nt = junta(m.nota, d.nota); if (nt) m.nota = nt; if (JSON.stringify(m) !== antes) n.diario++; });
  U.comer = U.comer || {}; Object.entries(o.comer || {}).forEach(([id, c]) => { const m = U.comer[id] = U.comer[id] || {}, antes = JSON.stringify(m);
    if (!m.estado && c.estado) m.estado = c.estado; if (Number(c.val) > 0 && !(Number(m.val) > 0)) m.val = c.val;
    const nt = junta(m.nota, c.nota); if (nt) m.nota = nt; if (!m.op && c.op) m.op = c.op; if (JSON.stringify(m) !== antes) n.comer++; });
  U.agenda = U.agenda || {}; Object.entries(o.agenda || {}).forEach(([f, a]) => { const m = U.agenda[f] = U.agenda[f] || { add: [], del: [], orden: null };
    m.add = [...new Set([...arr(m.add), ...arr(a.add)])]; m.del = [...new Set([...arr(m.del), ...arr(a.del)])]; });
  ['hgLeidas', 'leidos', 'hdIni', 'hdLev'].forEach(k => { U[k] = U[k] || {}; Object.entries(o[k] || {}).forEach(([a, b]) => { if (b && !U[k][a]) U[k][a] = b; }); });
  U.regalos = arr(U.regalos); arr(o.regalos).forEach(r => { const x = U.regalos.find(x => x.id === r.id); if (!x) { U.regalos.push(r); n.regalos++; } else x.ok = x.ok || r.ok; });
  U.estrellas = U.estrellas || {}; Object.entries(o.estrellas || {}).forEach(([k, x]) => { if (x && Number(x.v) > 0 && !U.estrellas[k]) { U.estrellas[k] = x; n.estrellas = (n.estrellas || 0) + 1; } });
  U.coordsFix = U.coordsFix || {}; Object.entries(o.coordsFix || {}).forEach(([a, b]) => { if (b && !U.coordsFix[a]) U.coordsFix[a] = b; });
  U.avisosOk = U.avisosOk || {}; Object.entries(o.avisosOk || {}).forEach(([a, b]) => { if (b && !U.avisosOk[a]) U.avisosOk[a] = b; });
  U.checklist = U.checklist || {}; Object.entries(o.checklist || {}).forEach(([a, b]) => { if (b) U.checklist[a] = b; });
  saveUser(); return n;
}
// 🎁 Regalos y souvenirs: para quién, qué y dónde; quién lo apuntó (nombre guardado solo en este móvil); casilla de comprado.
const K_YO = 'corea.yo'; let rgDe = '';
const yoNombre = () => { try { return localStorage.getItem(K_YO) || ''; } catch { return ''; } };
function viewRegalos() {
  const todos = arr(u().regalos), autores = [...new Set(todos.map(r => r.de).filter(Boolean))].sort();
  if (rgDe && !autores.includes(rgDe)) rgDe = '';
  const rs = rgDe ? todos.filter(r => r.de === rgDe) : todos, hechos = rs.filter(r => r.ok).length;
  return `<h2>🎁 Regalos y souvenirs</h2>
    <div class="card rg-form"><label class="rg-yo">✍️ Lo apunta <input id="rg-yo" value="${esc(yoNombre())}" placeholder="tu nombre" autocomplete="off"></label>
      <input id="rg-para" placeholder="Para quién (p. ej. mamá)" autocomplete="off"><input id="rg-que" placeholder="Qué (p. ej. mascarillas)" autocomplete="off">
      <input id="rg-donde" placeholder="Dónde (opcional: Insadong, mercado…)" autocomplete="off"><button data-rgadd>＋ Añadir</button></div>
    ${autores.length > 1 ? `<div class="chips">${['', ...autores].map(a => `<button class="chip ${a === rgDe ? 'on' : ''}" data-rgde="${esc(a)}">${a ? '✍️ ' + esc(a) : 'Todos'}</button>`).join('')}</div>` : ''}
    ${rs.length ? `<p class="muted">${hechos} de ${rs.length} comprados</p>${rs.map(r => `<div class="card rg ${r.ok ? 'ok' : ''}"><button class="hd-ck ${r.ok ? 'on' : ''}" data-rgok="${esc(r.id)}" aria-label="Comprado">${r.ok ? '✓' : ''}</button>
      <div class="rg-t"><b>${esc(r.que)}</b><small>${esc(r.para)}${r.donde ? ' · 📍 ' + esc(r.donde) : ''}${r.de ? ' · ✍️ ' + esc(r.de) : ''}</small></div><button class="sec mini" data-rgdel="${esc(r.id)}" aria-label="Quitar">✕</button></div>`).join('')}`
      : '<p class="muted">Apunta aquí lo que queréis traer y a quién; al comprarlo, marca la casilla.</p>'}`;
}
// 📖 Resumen del viaje: lo que hicisteis, para guardarlo o pasárselo a quien prepare su viaje.
// datosResumen() reúne todo; el texto, el Word y el PDF (exportar.js) se hacen a partir de él.
const CARA_TXT = { '😍': 'genial', '😄': 'muy bien', '🙂': 'bien', '😐': 'normal', '😴': 'cansado', '😩': 'duro' };
const CONSEJOS_RES = ['Apps: Naver Map o Kakao Map (Google Maps no da rutas a pie ni en coche en Corea), Kakao T para taxis y Papago para traducir.',
  'Tarjeta T-money para metro y bus (se recarga en tiendas 24 h y en las máquinas del metro).',
  'Trenes KTX con Korail o Trip.com; autobuses entre ciudades con Kobus o Klook.',
  'Tax Free con el pasaporte en tiendas con el logo (cosmética y ropa).'];
function datosResumen() {
  const U = u(), NS = { ...(U.estrellas || {}) }, una = t => String(t || '').replace(/\n+/g, ' ').trim();
  const usa = k => { const x = NS[k]; return x ? Number(x.v) || 0 : 0; };
  const dias = arr(trip.dias).filter(d => d.fecha).sort((a, b) => a.fecha.localeCompare(b.fecha));
  const D = { titulo: (trip.meta && trip.meta.titulo) || 'Viaje a Corea del Sur', desde: dias[0] && dias[0].fecha, hasta: dias.length ? dias[dias.length - 1].fecha : '', nDias: dias.length };
  D.ruta = arr(trip.ciudades).filter(c => c && c.desde && !/espa/i.test(c.nombre)).map(c => { const k = ck(c.nombre), no = c.hasta ? Math.round((new Date(c.hasta) - new Date(c.desde)) / 864e5) : 0;
    const h = arr(trip.alojamientos).find(a => ck(a.ciudad) === k && String(a.fechas || '').startsWith(c.desde)) || arr(trip.alojamientos).find(a => ck(a.ciudad) === k);
    return { ciudad: c.nombre, ko: c.ko || '', desde: c.desde, hasta: c.hasta || '', noches: no, hotel: h ? h.nombre : '', val: h ? usa('h:' + (h.id || h.nombre)) : 0 }; });
  D.traslados = arr(trip.traslados).filter(t => t && t.fecha).sort((a, b) => a.fecha.localeCompare(b.fecha)).map(t => { const b = billete(t) || {}, [ic, nom] = medio(t);
    return { fecha: t.fecha, de: lugarCorto(t.de), a: lugarCorto(t.a), ic, nom, numero: b.numero || '', horas: b.salida ? `${b.salida}-${b.llegada || '?'}` : '', precio: b.precio || '', val: usa('t:' + (t.id || t.fecha + t.de)) }; });
  D.dias = dias.map((d, i) => { const k = ck(d.ciudad), ls = listaDia(d), vis = ls.filter(l => hecho(l, k)), di = diarioDe(d.fecha), base = vis.length ? vis : ls;
    return { n: i + 1, fecha: d.fecha, ciudad: d.ciudad, titulo: d.titulo || '', cara: di.cara || '', tags: arr(di.tags).map(c => (ETIQ_DIA.find(x => x[0] === c) || [c, ''])).map(([c, t]) => c + ' ' + t), diario: una(di.nota), visto: vis.length > 0,
      sitios: base.map(l => l.es), wiki: (base.map(l => wikiDe(l)).find(Boolean)) || '' }; });
  const lc = lugaresComer(), est = c => estadoDe(String(c.id)), cn = c => (CIUDADES_COMER.find(x => x[0] === c.ciudad) || [])[1] || c.ciudad;
  D.comidos = lc.filter(c => est(c).estado === 'visitado' || Number(est(c).val) > 0 || hecho(c, c.ciudad))
    .sort((a, b) => (Number(est(b).val) || 0) - (Number(est(a).val) || 0))
    .map(c => ({ ciudad: cn(c), nombre: c.nombre, ko: c.ko || '', plato: c.plato || '', val: Number(est(c).val) || 0, nota: una(est(c).nota), wiki: wikiDe(c) }));
  // ✅ Planes realizados por ciudad: los del itinerario en su orden y después el resto (Planes y Miscelánea), con sus estrellas.
  D.planes = ciudadesUnicas().filter(c => !/espa/i.test(c.nombre)).map(c => { const k = ck(c.nombre), vistos = new Set(), items = [];
    const add = l => { const h = hKey(l); if (!l || vistos.has(h) || !hecho(l, k)) return; vistos.add(h); items.push({ es: l.es, v: usa(h), h }); };
    dias.filter(d => ck(d.ciudad) === k).forEach(d => listaDia(d).forEach(add));
    qvLista(k, c).forEach(o => add(o.l)); (typeof PLANES !== 'undefined' ? PLANES : []).filter(p => p.ciudad === k).forEach(add);
    return { ciudad: nombreCiudad(k), items }; }).filter(g => g.items.length);
  // ⭐ Imprescindibles: solo lo de 5 estrellas (sitios y Comer).
  D.top = [...D.planes.flatMap(g => g.items.filter(x => x.v === 5).map(x => ({ nombre: x.es, ciudad: g.ciudad }))), ...D.comidos.filter(c => c.val === 5).map(c => ({ nombre: '🍜 ' + c.nombre, ciudad: c.ciudad }))];
  D.consejos = CONSEJOS_RES;
  return D;
}
function textoResumen() {
  const D = datosResumen(), L = [`🇰🇷 ${D.titulo}`];
  if (D.nDias) L.push(`${fmtCorto(D.desde)} → ${fmtCorto(D.hasta)} · ${D.nDias} días`);
  if (D.ruta.length) { L.push('', '🗺️ RUTA');
    D.ruta.forEach(r => { L.push(`• ${r.ciudad}: ${fmtCorto(r.desde)}${r.hasta ? ' → ' + fmtCorto(r.hasta) : ''}${r.noches ? ` (${r.noches} noche${r.noches > 1 ? 's' : ''})` : ''}${r.hotel ? ' · 🛏️ ' + r.hotel + (r.val ? ' ' + estrTxt(r.val) : '') : ''}`); }); }
  if (D.traslados.length) { L.push('', '🚆 CÓMO NOS MOVIMOS');
    D.traslados.forEach(t => { L.push(`• ${fmtCorto(t.fecha)} ${t.de} → ${t.a}: ${t.ic} ${t.nom}${t.numero ? ' ' + t.numero : ''}${t.horas ? ` (${t.horas})` : ''}${t.precio ? ' · ' + t.precio : ''}${t.val ? ' ' + estrTxt(t.val) : ''}`); }); }
  L.push('', '📅 DÍA A DÍA');
  D.dias.forEach(d => { L.push(`Día ${d.n} · ${fmtCorto(d.fecha)} · ${d.ciudad}${d.titulo ? ' — ' + d.titulo : ''}${d.cara ? ` ${d.cara}${CARA_TXT[d.cara] ? ' (' + CARA_TXT[d.cara] + ')' : ''}` : ''}`);
    if (d.sitios.length) L.push(`   ${d.visto ? '✅' : '📍 Plan:'} ${d.sitios.join(', ')}`);
    if (d.tags.length) L.push(`   🏷️ ${d.tags.join(' · ')}`); if (d.diario) L.push(`   📔 ${d.diario}`); });
  if (D.comidos.length) { L.push('', '🍜 DÓNDE COMIMOS');
    D.comidos.forEach(c => L.push(`• ${c.ciudad} · ${c.nombre}${c.ko ? ` (${c.ko})` : ''}${c.plato ? ' — ' + c.plato : ''}${c.val ? ' ' + '★'.repeat(c.val) : ''}${c.nota ? ' · ' + c.nota : ''}`)); }
  if (D.top.length) { L.push('', '⭐ IMPRESCINDIBLES (5 ESTRELLAS)'); D.top.forEach(c => L.push(`• ${c.nombre} (${c.ciudad})`)); }
  if (D.planes.length) { L.push('', '✅ PLANES REALIZADOS'); D.planes.forEach(g => { L.push(g.ciudad.toUpperCase()); g.items.forEach((x, i) => L.push(`  ${i + 1}. ${x.es}${x.v ? ' ' + estrTxt(x.v) : ''}`)); }); }
  L.push('', '💡 CONSEJOS PRÁCTICOS', ...D.consejos.map(c => '• ' + c));
  return L.join('\n');
}
function viewResumen() {
  const t = textoResumen(), D = datosResumen();
  const lista = D.planes.length ? `<h2>✅ Planes realizados</h2><p class="muted">Toca las estrellas para valorarlos (5 ★ = Imprescindibles).</p>
    ${D.planes.map(g => `<div class="card res-ciudad"><b>${esc(g.ciudad)}</b><ol>${g.items.map(x => `<li><div class="res-fila"><span>${esc(x.es)}</span><span class="estrellas">${[1, 2, 3, 4, 5].map(n => `<button class="star ${x.v >= n ? 'on' : ''}" data-stk="${esc(x.h)}" data-stn="${esc(x.es)}" data-sv="${n}" aria-label="${n} estrellas">★</button>`).join('')}</span></div></li>`).join('')}</ol></div>`).join('')}`
    : '<p class="muted">Cuando marquéis sitios como visitados (☐ Visitado en Planes u Hoy), saldrán aquí por ciudad para ponerles estrellas.</p>';
  return `<h2>📖 Resumen del viaje</h2>
    <p class="muted">Se genera con lo que habéis marcado: visitados y sus ⭐ (Planes realizados por ciudad), hoteles y traslados, caritas y notas del diario y Comer (✅, estrellas y notas). Ideal para pasárselo a quien prepare su viaje.</p>
    <div class="acciones"><button data-resumen="word">📘 Word con fotos</button><button data-resumen="pdf">📕 PDF con fotos</button></div>
    <div class="acciones"><button data-resumen="copiar">📋 Copiar</button><button class="sec" data-resumen="compartir">📤 Compartir</button><button class="sec" data-resumen="txt">⬇️ Descargar .txt</button></div>
    ${lista}<h2>📄 Texto</h2><pre class="resumen">${esc(t)}</pre>`;
}
// ☔ Plan B si llueve: si el pronóstico del día marca lluvia, sitios a cubierto de la ciudad (los del día, primero).
function planLluvia(d) {
  const k = ck(d.ciudad), w = TIEMPO && TIEMPO.c && TIEMPO.c[k] && TIEMPO.c[k][d.fecha]; if (!w) return '';
  const [code, , , prob] = w, lluvia = Number(prob) >= 60 || [51, 53, 55, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99].includes(Number(code));
  if (!lluvia) return '';
  const c = ciudadesUnicas().find(x => ck(x.nombre) === k), cub = /museo|mercado|biblioteca|spa|coex|starfield|prisi|memorial|exposici|centro cultural|teatro|galer|dragon hill|jjimjil/i;
  const hc = hotelDe(k), ls = qvLista(k, c).filter(o => cub.test((o.l.tipo || '') + ' ' + o.l.es) && !hecho(o.l, k))
    .sort((a, b) => (hc && coordsLugar(a.l) && coordsLugar(b.l) ? km(hc, coordsLugar(a.l)) - km(hc, coordsLugar(b.l)) : 0)).slice(0, 5);
  const txt = arr(d.items).filter(i => /llueve|lluvia/i.test(i.texto || '')).map(i => i.texto);
  if (!ls.length && !txt.length) return '';
  const key = 'planb:' + d.fecha;
  return `<details class="card plan-b" data-key="${key}" ${abierto(key, false) ? 'open' : ''}><summary><b>☔ Previsión de lluvia${prob != null ? ` (${prob} %)` : ''}: plan B a cubierto</b></summary>
    ${txt.map(t => `<div class="muted">${resaltar(t, true)}</div>`).join('')}
    <ul class="planb-l">${ls.map(o => `<li><span>${icSitio(o.l.es)} ${esc(o.l.es)}${hc && coordsLugar(o.l) ? ` <span class="muted">${fmtDist(km(hc, coordsLugar(o.l)))}</span>` : ''}</span>${irQV(o.l, k, true)}</li>`).join('')}</ul></details>`;
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
// En traslados: el aeropuerto por su nombre (sin "(T1)"); lo demás, la ciudad entre paréntesis.
const lugarCorto = t => /aeropuerto/i.test(t) ? String(t).replace(/\s*\(.*?\)/g, '') : ciudadCorta(t);
function pendingAlert() {
  const hoy = todayISO(), p = arr(trip.traslados).filter(t => isPend(t) && !(t.fecha && t.fecha < hoy)); // los ya pasados no avisan
  if (!p.length) return '';
  return `<div class="alert compacta" data-go="ruta">⚠️ Por comprar: ${p.map(t => `${esc(fmtCorto(t.fecha))} ${esc(ciudadCorta(t.de))} → ${esc(ciudadCorta(t.a))}`).join(' · ')} <span class="muted">›</span></div>`;
}

// Alojamiento de la noche de una fecha ("2026-11-04 a 2026-11-08": noches del 4 al 7) y el que se deja ese día.
function alojDe(f) {
  const r = arr(trip.alojamientos).map(a => { const [ini, fin] = String(a.fechas || '').split(' a ').map(x => x.trim()); return { a, ini, fin: fin || (ini ? sumaDia(ini, Number(a.noches) || 1) : '') }; });
  return { noche: (r.find(x => x.ini && x.ini <= f && f < x.fin) || {}).a, sale: (r.find(x => x.fin === f) || {}).a };
}
// ⭐ Valoración propia (1-5) en sitios, planes, hoteles y traslados: user.estrellas[clave] = {n: nombre, v}. Sale en el Resumen.
const estrDe = k => Number(((u().estrellas || {})[k] || {}).v) || 0;
const estrTxt = v => v ? '★'.repeat(v) + '☆'.repeat(5 - v) : '';
const estrBox = (k, nombre) => { const v = estrDe(k); return `<div class="estrellas">Nuestra valoración: ${[1, 2, 3, 4, 5].map(n => `<button class="star ${v >= n ? 'on' : ''}" data-stk="${esc(k)}" data-stn="${esc(nombre || '')}" data-sv="${n}" aria-label="${n} estrellas">★</button>`).join('')}</div>`; };
const alojCard = (a, sale, sinTit = false) => `<div class="card aloj">
    ${sinTit ? '' : `<div class="big">🛏️ ${esc(a.nombre)} ${ver(a)}</div>`}${sale ? '<div class="badge pend">Hoy dejáis este alojamiento</div>' : ''}
    ${a.ko ? `<div class="ko">${esc(a.ko)}</div>` : ''}
    ${a.direccion_ko ? `<div>${esc(a.direccion_ko)}</div>` : ''}
    ${a.direccion_en ? `<div class="muted">${esc(a.direccion_en)}</div>` : ''}
    ${a.nota ? `<div class="muted">${esc(a.nota)}</div>` : ''}
    <div class="acciones">${naver(a)}<button class="mini sec" data-gps="${esc(hotelFixKey(a))}" data-gpsn="${esc(a.nombre)}">${user && user.coordsFix && user.coordsFix[hotelFixKey(a)] ? '✅ Ubicación del hotel corregida' : '📌 Estoy en el hotel'}</button></div>${estrBox('h:' + (a.id || a.nombre), '🛏️ ' + a.nombre)}</div>`;
// ---------- Diario: carita y nota de cada día (solo en el móvil; va en "Exportar copia") ----------
const CARAS = [['😍', 'Genial'], ['😄', 'Muy bien'], ['🙂', 'Bien'], ['😐', 'Normal'], ['😴', 'Cansado'], ['😩', 'Duro']];
// Etiquetas del día (varias a la vez, user.diario[f].tags): ayudan a recordarlo y salen en el Resumen.
const ETIQ_DIA = [['❤️', 'Momentazo'], ['📸', 'Fotos top'], ['🍜', 'Buena comida'], ['🏯', 'Mucha cultura'], ['🌳', 'Naturaleza'], ['🛍️', 'Compras'],
  ['🚶', 'Mucho caminar'], ['🌧️', 'Lluvia'], ['🥶', 'Frío'], ['🤯', 'Sorpresa'], ['💸', 'Caro'], ['😤', 'Algo salió mal']];
const diarioDe = f => (u().diario || {})[f] || {};
function diarioCard(d, sinTit = false) {
  const e = diarioDe(d.fecha), fut = d.fecha > todayISO();
  return `<div class="card diario">${sinTit ? '' : '<b>📔 ¿Qué tal el día?</b>'}
    <div class="caras">${CARAS.map(([c, t]) => `<button class="cara ${e.cara === c ? 'on' : ''}" data-cara="${d.fecha}|${c}"><span>${c}</span><small>${t}</small></button>`).join('')}</div>
    <div class="etiq-dia">${ETIQ_DIA.map(([c, t]) => `<button class="chip ${arr(e.tags).includes(c) ? 'on' : ''}" data-etq="${d.fecha}|${c}">${c} ${t}</button>`).join('')}</div>
    <textarea data-diario="${d.fecha}" rows="5" placeholder="${fut ? 'Este día aún no ha llegado; puedes apuntar ideas.' : 'Qué hicisteis, lo mejor, anécdotas… (se guarda solo)'}">${esc(e.nota || '')}</textarea></div>`;
}
function diarioResumen() {
  const D = u().diario || {}, fs = Object.keys(D).filter(f => D[f] && (D[f].cara || D[f].nota)).sort();
  if (!fs.length) return '';
  return `<h2>📔 Diario</h2>${fs.map(f => { const dd = arr(trip.dias).find(x => x.fecha === f) || {};
    return `<div class="card diario-r" data-diaf="${f}"><b>${D[f].cara || '📔'} ${fmtDate(f)}</b>${dd.ciudad ? ` <span class="muted">· ${esc(dd.ciudad)}</span>` : ''}${D[f].nota ? `<div>${esc(D[f].nota).replace(/\n/g, '<br>')}</div>` : ''}</div>`; }).join('')}`;
}
// "Antes de salir": lista para los días en que se deja un hotel y hay traslado (se marca en el móvil; se pueden añadir cosas).
function antesSalir(f, tr, al) {
  if (!al.sale) return '';
  const it = [], add = (id, texto) => it.push({ id, texto });
  // Solo el primer vuelo del día (los siguientes son conexiones).
  arr(trip.vuelos).forEach(v => { const x = arr(v.tramos).find(x => x.vuelo && String(x.salida || '').startsWith(f));
    if (x) add('v' + x.vuelo, `✈️ Vuelo ${x.vuelo} a las ${String(x.salida).slice(11)}: estar en el aeropuerto unas 3 h antes`); });
  tr.forEach(t => {
    const r = billete(t) || {}, icB = t.bus && !t.tren ? '🚌' : '🚆';
    if (isPend(t)) add('pend' + t.id, `⚠️ Billete ${lugarCorto(t.de)} → ${lugarCorto(t.a)} SIN COMPRAR`);
    else if (r.salida) add('tren' + t.id, `${icB} ${r.numero || (t.bus ? 'Autobús' : 'Tren')} a las ${r.salida}${r.coche ? ` · coche ${r.coche}` : ''}${r.asientos ? ` · asientos ${Object.values(r.asientos).join(' y ')}` : ''}: billete (QR) a mano`);
  });
  if (/alojamiento|llegada|allí/i.test(al.sale.pago || '')) add('pago', `🏨 Pagar ${al.sale.nombre}${al.sale.coste_eur ? ` (${al.sale.coste_eur} €)` : ''}`);
  add('pas', '🛂 Pasaportes encima (no en la maleta facturada)');
  add('carg', '🔌 Cargadores, batería externa y adaptador');
  add('rev', '🧺 Revisar armario, baño, enchufes y caja fuerte');
  add('llave', '🔑 Devolver la llave o tarjeta de la habitación');
  const vueloHoy = arr(trip.vuelos).some(v => v.tipo === 'vuelta' && arr(v.tramos).some(x => x.vuelo && String(x.salida || '').startsWith(f)));
  if (vueloHoy) { add('tmref', '💳 Recuperar el saldo de la T-money en una tienda 24 h (hasta 20.000 ₩, 500 ₩ de comisión: VERIFICAR)');
    add('tax', '🧾 Tax Free: tickets y pasaporte a mano para el quiosco de devolución de Incheon'); add('won', '💴 Gastar los wones que sobren (en el aeropuerto el cambio es peor)'); }
  else add('tm', '💳 T-money con saldo');
  if (al.noche && al.noche !== al.sale && !/espana/.test(ck(al.noche.ciudad))) add('sig', `📍 Próximo hotel: ${al.noche.nombre} (dirección en 🆘 Ayuda para el taxi)`);
  const U = u(), sc = 'antes:' + f, tot = it.length + arr(U.extra[sc]).length, hechos = Object.keys(U.checklist).filter(k => k.startsWith(sc + '|') && U.checklist[k]).length;
  return `<details class="card antes" data-key="${sc}" ${abierto(sc, false) ? 'open' : ''}><summary><b>🧳 Antes de salir</b> <span class="muted">(${hechos} de ${tot})</span></summary>${checks(sc, it)}</details>`;
}
let hoySub = null;
// Itinerario del día en esquema (hora, icono y título corto); el texto completo, plegado debajo.
const icItem = t => [[/suneung|examen/i, '📝'], [/si os da tiempo/i, '⏭️'], [/^\s*(atardecer|puesta de sol)/i, '🌅'], [/^\s*(almuerzo|comida|cena|desayuno)/i, '🍜'], [/ktx|tren|srt/i, '🚆'], [/vuelo|aeropuerto/i, '✈️'], [/\bbus\b|autob/i, '🚌'], [/taxi/i, '🚕'],
  [/almuerzo|comida|comer|cena|desayun|jjimdak|gukbap|bibimbap/i, '🍜'], [/danza|espect|función|concierto/i, '🎭'], [/museo/i, '🏛️'], [/palacio/i, '🏯'],
  [/templo|santuario|seowon|academia/i, '🛕'], [/atardecer|puesta de sol|noche/i, '🌅'], [/mercado|compras|tienda/i, '🛍️'], [/playa|mar\b/i, '🏖️'],
  [/aldea|hanok|barrio/i, '🏘️'], [/hotel|check/i, '🛏️']].find(([r]) => r.test(t))?.[1] || '📍';
const cortoItem = t => { let x = String(t || '').replace(/\s*\([^)]*\)/g, '').split(/(?<=[a-záéíóúñ0-9])\. |; /i)[0].trim();
  const c = x.search(/,\s/); if (c > 18) x = x.slice(0, c);
  if (x.length > 48) x = x.slice(0, 46).replace(/\s+\S*$/, '') + '…'; return x.replace(/[.:]$/, ''); };
function esquemaDia(d) {
  const its = arr(d.items); if (!its.length) return '';
  const key = 'itx:' + d.fecha;
  // «Leer más» no abre otra lista: amplía cada línea del esquema con su texto completo, en el mismo sitio.
  const largo = !!abiertos[key], hay = its.some(i => cortoItem(i.texto) !== String(i.texto || '').trim().replace(/[.:]$/, ''));
  // Cada sitio con su horario entre paréntesis justo detrás de su nombre (una sola vez por día);
  // * = por verificar (la leyenda sale con «Leer más»).
  const ls = listaDia(d).filter(l => { const h = horDe(l); return h && h.a && h.c; }); let ast = false;
  const nt = t => String(t || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\(.*?\)/g, ' ').replace(/-/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
  const VAR = { a: 'aáàä', e: 'eéèë', i: 'iíìï', o: 'oóòö', u: 'uúùü', n: 'nñ' };
  const rx = tk => new RegExp('(?<![\\p{L}\\d])' + tk.split(' ').map(w => [...w].map(c => VAR[c] ? '[' + VAR[c] + ']' : c).join('-?')).join('[^\\p{L}\\d]+') + '(?![\\p{L}\\d])', 'iu');
  // Nombre completo + palabras propias (sin alias genéricos como «hahoe», que nombrarían la aldea en cualquier línea).
  const tks = ls.map(l => [l, [nt(l.es), ...tokensDe(l).map(x => x.trim()).filter(x => x && !STOP.has(x))].filter(Boolean).map(rx)]);
  // El nombre de un sitio sigue hasta la puntuación o una palabra de enlace («en», «y», «junto»…); un paréntesis pegado va con él.
  const FIN = /^\s+(en|y|o|u|e|con|junto|desde|al|a|por|para|hasta|tras|lo|la|si|que|del?\s+(?:martes|lunes|la\s+estaci))\b/i;
  const textos = its.map(i => String((largo ? i.texto : cortoItem(i.texto)) || ''));
  const esTransp = t => /^\s*(bus|ktx|tren|srt|taxi|metro|vuelo)\b/i.test(t);
  // Cada sitio va en la línea que más lo nombra (el espectáculo de drones, no la cena «en Gwangalli»); a igualdad, la primera.
  const asig = textos.map(() => []);
  tks.forEach(([l, rs]) => {
    let bi = -1, bn = 0;
    textos.forEach((t, n) => { if (esTransp(t)) return; const c = rs.filter(r => r.test(t)).length + (rs[0].test(t) ? 10 : 0); if (c > bn) { bn = c; bi = n; } });
    if (bi >= 0) asig[bi].push([l, rs]);
  });
  const conHoras = (t, sitios) => {
    const ins = [];
    sitios.forEach(([l, rs]) => {
      let m = null; rs.forEach(r => { const x = r.exec(t); if (x && (!m || x.index < m.index)) m = x; });
      if (!m) return;
      let e = m.index + m[0].length;
      while (e < t.length) {
        const r = t.slice(e);
        // Un paréntesis pegado solo va con el nombre si es parte de él (hangul u otro nombre del sitio).
        if (/^\s*\(/.test(r)) { const c = t.indexOf(')', e), dentro = t.slice(e, c + 1); if (c > 0 && (/[\uac00-\ud7a3]/.test(dentro) || rs.some(x => x.test(dentro)))) e = c + 1; break; }
        if (FIN.test(r) || !/^\s+[\p{L}\d]/u.test(r)) break;
        e += r.match(/^\s+[^\s,.:;()…]+/u)[0].length;
      }
      if (ins.some(x => x.e === e)) return;
      const hh = horDe(l); if (hh.v) ast = true;
      ins.push({ e, s: `(${hh.a}-${hh.c}${hh.v ? '*' : ''})` });
    });
    ins.sort((x, y) => y.e - x.e).forEach((x, n) => { t = t.slice(0, x.e) + '\u0001' + String.fromCharCode(65 + n) + '\u0002' + t.slice(x.e); });
    return resaltar(t).replace(/\u0001([A-Z])\u0002/g, (_, c) => ` <span class="es-hor">${esc(ins[c.charCodeAt(0) - 65].s)}</span>`);
  };
  const lis = its.map((i, n) => `<li><span class="es-h"></span><span class="es-ic">${icItem(i.texto)}</span><span class="es-t">${conHoras(textos[n], asig[n])}</span></li>`).join('');
  return `<ol class="esquema ${largo ? 'largo' : ''}" data-esq="${key}">${lis}</ol>
    ${largo && ast ? '<p class="muted es-ley">* Horario por verificar</p>' : ''}
    ${hay || ast ? `<button class="es-mas" data-esmas="${key}">${largo ? 'Leer menos ▴' : 'Leer más ▾'}</button>` : ''}`;
}
function viewHoy() {
  const dias = arr(trip.dias).slice().sort((a, b) => String(a.fecha).localeCompare(String(b.fecha)));
  let html = `<div class="hoy-top"><button class="sos" data-act="ayuda">🆘 Ayuda</button></div>` + ahora() + pendingAlert();
  const avisos = arr(trip.avisos);
  // Avisos: se tachan con la casilla (user.avisosOk, por texto) y el número solo cuenta los pendientes.
  const avOk = u().avisosOk || {}, pend = avisos.filter(a => !avOk[a]);
  const avisosHTML = () => `<details class="card avisos" data-key="avisos" ${abierto("avisos", false) ? "open" : ""}><summary><b>⚠️ Avisos (${pend.length}${pend.length < avisos.length ? ' de ' + avisos.length : ''})</b></summary><ul>${[...pend, ...avisos.filter(a => avOk[a])].map(a => `<li class="${avOk[a] ? 'tachado' : ''}"><button class="hd-ck ${avOk[a] ? 'on' : ''}" data-avok="${esc(a)}" aria-label="Hecho">${avOk[a] ? '✓' : ''}</button><span>${esc(a)}</span></li>`).join('')}</ul></details>`;
  if (!dias.length) return html + '<p class="muted">El viaje no tiene días (clave "dias").</p>';

  if (dayIdx === null) {
    const t = todayISO();
    dayIdx = dias.findIndex(d => d.fecha === t);
    if (dayIdx < 0) dayIdx = t < dias[0].fecha ? 0 : Math.max(0, dias.findIndex(d => d.fecha > t));
    if (t > dias[dias.length - 1].fecha) dayIdx = dias.length - 1;
  }
  dayIdx = Math.min(Math.max(dayIdx, 0), dias.length - 1);
  const d = dias[dayIdx], hoy = todayISO(), enViaje = hoy >= dias[0].fecha;
  // Ya en el viaje, los avisos (estaciones, buses) solo salen en los días con traslado.
  if (avisos.length && (!enViaje || arr(trip.traslados).some(t => t.fecha === d.fecha))) html += avisosHTML();

  // Tira de días: se desliza y se toca el día.
  html += `<div class="dias-tira" id="tira">${dias.map((x, i) => { const f = new Date(x.fecha + 'T12:00:00');
    return `<button class="dchip ${i === dayIdx ? 'on' : ''} ${x.fecha === hoy ? 'hoy' : ''} ${enViaje && x.fecha < hoy ? 'pasado' : ''}" data-dsel="${i}" style="${varsTema(ck(x.ciudad))}"><small>${f.toLocaleDateString('es-ES', { weekday: 'short' })}</small><b>${f.getDate()}</b><span>${tema(ck(x.ciudad)).ic}</span>${diarioDe(x.fecha).cara ? `<i class="dchip-cara">${diarioDe(x.fecha).cara}</i>` : ''}</button>`; }).join('')}</div>
  ${(() => { const ls = listaDia(d), tc = tema(ck(d.ciudad));
    // Fotos del carrusel: una por sitio del itinerario que tenga artículo (o hangul), con su nombre como título.
    const fs = []; ls.forEach(l => { const w = l.sinFoto ? '' : (wikiDe(l) || (l.ko ? 'ko:' + String(l.ko).replace(/\s+/g, '') : '')); if (w && !fs.some(x => x.w === w)) fs.push({ w, n: `${icSitio((l.tipo || '') + ' ' + l.es)} ${l.es}` }); });
    return `<div class="card dia dia2" style="${varsTema(ck(d.ciudad))}">
    <div class="dia-cab">${(() => { const ko = (arr(trip.ciudades).find(c => ck(c.nombre) === ck(d.ciudad)) || {}).ko; return ko ? `<div class="ciudad-ko">${esc(ko)}</div>` : ''; })()}<div class="dia-sup"><span class="ds-1">${tc.ic} Día ${dayIdx + 1} de ${dias.length}${d.fecha === hoy ? ' · <b>HOY</b>' : ''}</span><span class="ds-2">${fmtDate(d.fecha)} · ${esc(d.ciudad)}</span></div>
      <div class="dia-tit">${esc(d.titulo)}</div>${chipTiempo(d)}${horasTiempo(d)}${linkHist(ck(d.ciudad))}</div>
    ${fs.length ? `<div class="dia-banner"><div class="foto dia-foto" data-wiki="${esc(fs[0].w)}" data-wikis="${esc(fs.map(x => x.w).join('|'))}" data-noms="${esc(fs.map(x => x.n).join('|'))}"><span></span></div>
      <div class="dia-cap">${esc(fs[0].n)}</div>${fs.length > 1 ? `<button class="carr carr-l" data-carr="-1" aria-label="Foto anterior">‹</button><button class="carr carr-r" data-carr="1" aria-label="Foto siguiente">›</button><div class="dia-puntos">${fs.map((x, i) => `<i class="${i ? '' : 'on'}"></i>`).join('')}</div>` : ''}</div>` : ''}`; })()}
    ${esquemaDia(d)}
  </div>`;

  // Apartados del día como botones (como en Corea); solo los que tienen algo.
  const tr = arr(trip.traslados).filter(t => t.fecha === d.fecha), al = alojDe(d.fecha);
  const secs = [
    // El traslado va dentro de Sitios, como primer tramo de la ruta del día.
    ['sitios', '📖 Sitios', (tr.length ? (() => { const hk = 'tras:' + (tr[0].id || d.fecha), ok = !!u().hecho[hk], key = 'trd:' + d.fecha, ab = abierto(key, !ok);
      return `<details class="tras-dia ${ok ? 'hecho-card' : ''}" data-key="${key}" ${ab ? 'open' : ''}><summary class="tras-dia-tit"><button class="hd-ck ${ok ? 'on' : ''}" data-hk="${esc(hk)}" data-v="${ok ? 0 : 1}" aria-label="Hecho">${ok ? '✓' : ''}</button>${medio(tr[0])[0]} Primero, el traslado</summary>${antesSalir(d.fecha, tr, al)}${tr.map(t => trasladoCard(t, false, true)).join('')}</details>`; })() : ''), sitiosDia(d)],
    ['hotel', '🛏️ Hotel', al.sale && al.noche && al.sale !== al.noche ? alojCard(al.sale, true) + alojCard(al.noche, false) : (al.noche || al.sale) ? alojCard(al.noche || al.sale, false, true) : ''],
  ];
  // Sin botones (no se usaban): Sitios siempre a la vista; Hotel y Diario, plegados al final.
  const [tras, sit, hotl] = [secs[0][2], secs[0][3], secs[1][2]], hk = 'hot:' + d.fecha, dk = 'dia:' + d.fecha, cambia = al.sale && al.noche && al.sale !== al.noche;
  const nomH = cambia ? `dejáis ${al.sale.nombre} · dormís en ${al.noche.nombre}` : (al.noche || al.sale || {}).nombre;
  // Orden: traslado, hotel (justo encima del mapa de la Ruta del día), sitios y diario. Sin títulos repetidos dentro.
  const hU = al.noche || al.sale;
  return html + tras + rutasLP24(ck(d.ciudad), d) + (hotl ? `<details class="card plg hotel-pl" data-key="${hk}" ${abierto(hk, false) ? 'open' : ''}><summary>🛏️ <b>${cambia ? 'Hotel' : esc(hU.nombre)}</b>${cambia ? ` · ${esc(nomH)}` : ' ' + ver(hU)}</summary>${hotl}</details>` : '') + sit
    + `<details class="card plg diario-pl" data-key="${dk}" ${abierto(dk, false) ? 'open' : ''}><summary>${diarioDe(d.fecha).cara || '📔'} <b>¿Qué tal el día?</b>${diarioDe(d.fecha).nota ? ' · ✍️' : ''}</summary>${diarioCard(d, true)}</details>`;
}

// "Ahora": lo próximo que toca hoy (o la cuenta atrás antes del viaje).
const aMin = h => { const m = String(h || '').match(/(\d{1,2})[:.](\d{2})/); return m ? +m[1] * 60 + +m[2] : null; };
const enTiempo = min => min <= 0 ? 'ahora mismo' : min < 60 ? `en ${min} min` : `en ${Math.floor(min / 60)} h${min % 60 ? ' ' + (min % 60) + ' min' : ''}`;
function eventosDe(fecha) {
  const d = arr(trip.dias).find(x => x.fecha === fecha), ev = [];
  arr(d && d.items).forEach(i => { const m = aMin(i.hora); if (m != null) ev.push({ m, hora: i.hora, txt: i.texto }); });
  arr(trip.traslados).filter(t => t.fecha === fecha).forEach(t => {
    const b = billete(t), m = aMin(b && b.salida);
    if (m != null && !ev.some(e => e.m === m)) ev.push({ m, hora: b.salida, txt: `${medio(t)[0]} ${t.de} → ${t.a}` });
  });
  return [d, ev.sort((a, b) => a.m - b.m)];
}
function ahora() {
  const dias = arr(trip.dias).map(d => d.fecha).filter(Boolean).sort(); if (!dias.length) return '';
  const hoy = todayISO(), n = new Date(), nowM = n.getHours() * 60 + n.getMinutes();
  if (hoy < dias[0]) {
    const falta = Math.round((new Date(dias[0] + 'T12:00') - new Date(hoy + 'T12:00')) / 864e5);
    return `<div class="card ahora"><b>✈️ ${falta === 1 ? 'Falta' : 'Faltan'} ${falta} ${falta === 1 ? 'día' : 'días'} para el viaje</b><div class="muted">Sale el ${fmtDate(dias[0])}. Revisa Más → Maleta y documentos.</div><button class="mini prep-ir" data-act="preparar-ir">🧳 Preparar para viajar</button></div>`;
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

// ---------- Metro: qué líneas coger (Seúl: datos de OpenStreetMap; Busan: hecho a mano, VERIFICAR) ----------
let METRO = null;
cargaDatos('data/metro.json', d => {
  const est = {}; d.est.forEach(([id, en, ls, la, lo]) => { est[id] = { id, ko: id.replace(/^b:/, ''), en, ls, c: la != null ? [la, lo] : null }; });
  const ady = {}; d.tramos.forEach(([a, b, l]) => { (ady[a + '|' + l] = ady[a + '|' + l] || []).push(b); (ady[b + '|' + l] = ady[b + '|' + l] || []).push(a); });
  Object.values(est).forEach(e => { e.en = e.en.replace(/(\d)\([a-z]+\)/g, '$1'); });
  METRO = { est, ady, lin: d.lineas, conC: Object.values(est).filter(e => e.c) };
});
const MIN_PARADA = 2.2, MIN_CAMBIO = 6, minPie = k => k * 1.3 / 4.5 * 60;
const rutasMetro = {};
// Mejor combinación: estación cercana al origen (≤1,2 km a pie) → líneas y transbordos → estación cercana al destino.
function rutaMetro(o, dst) {
  if (!METRO) return null;
  const key = o.join() + '>' + dst.join(); if (key in rutasMetro) return rutasMetro[key];
  const cerca = c => METRO.conC.map(e => [e, km(c, e.c)]).filter(x => x[1] <= 1.2).sort((a, b) => a[1] - b[1]).slice(0, 6);
  const ini = cerca(o), fin = cerca(dst);
  if (!ini.length || !fin.length) return (rutasMetro[key] = null);
  const dist = {}, prev = {}, pend = new Set(), fuera = new Set();
  ini.forEach(([e, k]) => e.ls.forEach(l => { const s = e.id + '|' + l; dist[s] = minPie(k); prev[s] = null; pend.add(s); }));
  while (pend.size) {
    let s = null; for (const x of pend) if (s === null || dist[x] < dist[s]) s = x;
    pend.delete(s); fuera.add(s); if (dist[s] > 120) break;
    const i = s.lastIndexOf('|'), id = s.slice(0, i), l = s.slice(i + 1);
    const vec = [...(METRO.ady[s] || []).map(n => [n + '|' + l, MIN_PARADA]), ...METRO.est[id].ls.filter(x => x !== l).map(x => [id + '|' + x, MIN_CAMBIO])];
    for (const [n, c] of vec) { if (fuera.has(n)) continue; const t = dist[s] + c; if (dist[n] == null || t < dist[n]) { dist[n] = t; prev[n] = s; pend.add(n); } }
  }
  let mejor = null;
  fin.forEach(([e, k]) => e.ls.forEach(l => { const s = e.id + '|' + l; if (dist[s] != null && (!mejor || dist[s] + minPie(k) < mejor.t)) mejor = { s, t: dist[s] + minPie(k), k }; }));
  if (!mejor) return (rutasMetro[key] = null);
  const camino = []; for (let s = mejor.s; s; s = prev[s]) camino.unshift(s);
  const tramos = []; let actual = null;
  for (let j = 0; j < camino.length; j++) {
    const i = camino[j].lastIndexOf('|'), id = camino[j].slice(0, i), l = camino[j].slice(i + 1);
    if (!actual || actual.l !== l) { actual = { l, de: id, a: id, paradas: 0, sig: null }; tramos.push(actual); }
    else { actual.paradas++; actual.a = id; if (!actual.sig) actual.sig = id; }
  }
  const usados = tramos.filter(t => t.paradas > 0);
  if (!usados.length) return (rutasMetro[key] = null);
  const pie0 = km(o, METRO.est[usados[0].de].c);
  return (rutasMetro[key] = { tramos: usados, min: Math.round(mejor.t), pie0, pie1: mejor.k, busan: usados.some(t => t.de.startsWith('b:')) });
}
const nomEst = id => { const e = METRO.est[id]; return `<b>${esc(e.en)}</b> <span class="ko-s">${esc(e.ko)}</span>`; };
function chipLinea(l) {
  const [n, col] = METRO.lin[l] || [l, '#888'], t = /^\d+$/.test(n) ? n : n.replace(/^Busan /, 'B');
  return `<span class="lin" style="background:${col}">${esc(t)}</span>`;
}
function pasosMetro(r) {
  const ps = [`🚶 ${fmtDist(r.pie0)} a pie hasta ${nomEst(r.tramos[0].de)}`];
  r.tramos.forEach((t, i) => ps.push(`${i ? '🔁 Cambio a ' : ''}${chipLinea(t.l)} ${t.paradas} ${t.paradas === 1 ? 'parada' : 'paradas'}${t.sig ? ` (próxima: ${esc(METRO.est[t.sig].en)})` : ''} → baja en ${nomEst(t.a)}`));
  ps.push(`🚶 ${fmtDist(r.pie1)} a pie hasta el sitio`);
  return `<ol class="metro-pasos">${ps.map(p => `<li>${p}</li>`).join('')}</ol>${r.busan ? '<div class="muted mini-nota">Busan: líneas apuntadas a mano, <span class="ver">VERIFICAR</span> en Naver.</div>' : ''}`;
}

// Cómo ir de un punto a otro (la misma decisión para la Ruta del día y el horario):
// a pie hasta 1,6 km en línea recta; si no, metro si no tarda mucho más que el taxi (≤1,6 veces); si no, taxi.
function comoIr(o, dst) {
  const k = km(o, dst);
  if (k <= 1.6) return { k, modo: 'pie', m: Math.max(2, Math.round(k * 1.3 / 4.5 * 60)) };
  const taxi = Math.round(k * 1.3 / (k > 8 ? 40 : 22) * 60 + 8), r = rutaMetro(o, dst); // fuera de ciudad el taxi va más rápido
  return r && r.min <= taxi * 1.6 ? { k, modo: 'metro', m: r.min, taxi, r } : { k, modo: 'taxi', m: taxi, taxi, r };
}
// Distancia, tiempo y "🧭 Ruta" en la app de Naver Map; pasos de metro abiertos si es la opción buena, plegados si gana el taxi.
function tramo(o, dst, nO, nD, op = {}) {
  if (!o || !dst) return '';
  const c = comoIr(o, dst), r = c.r;
  // Sin punto de salida: Naver Map calcula la ruta desde donde estéis en ese momento.
  const url = `nmap://route/${c.modo === 'pie' ? 'walk' : 'public'}?dlat=${dst[0]}&dlng=${dst[1]}&dname=${encodeURIComponent(nD)}&appname=viajecorea`;
  const txt = c.modo === 'pie' ? `🚶 ${fmtDist(c.k)} · ~${c.m} min a pie`
    : c.modo === 'metro' ? `${fmtDist(c.k)} · 🚇 ~${r.min} min en metro · 🚕 ~${c.taxi} min en taxi`
    : `${fmtDist(c.k)} · 🚕 taxi ~${c.taxi} min${r || (op.aK && typeof SIN_TAXI !== 'undefined' && SIN_TAXI[op.aK.slice(2)]) ? '' : ' (o bus: miradlo en Naver)'}`;
  // Sin taxi: bus o tren a los sitios lejanos (SIN_TAXI en contenido.js), a la vista cuando el tramo sale en taxi.
  const st = c.modo === 'taxi' && op.aK && typeof SIN_TAXI !== 'undefined' && SIN_TAXI[op.aK.slice(2)];
  const sinTaxi = st ? `<div class="sin-taxi">🚌 <b>Sin taxi:</b> ${resaltar(st, true)} <span class="ver">VERIFICAR</span></div>` : '';
  const pasos = !r ? '' : c.modo === 'metro' ? pasosMetro(r) : op.hasta && op.key ? `<div class="alt-metro-t">🚇 En metro (~${r.min} min)</div>${pasosMetro(r)}`
    : `<details class="alt-metro" data-key="am:${o.join()}>${dst.join()}" ${abierto(`am:${o.join()}>${dst.join()}`, false) ? 'open' : ''}><summary>🚇 Alternativa en metro (~${r.min} min)</summary>${pasosMetro(r)}</details>`;
  const fila = `<div class="tramo-ir"><span>${op.prefijo || ''}${txt}</span><a class="btn sec mini" href="${url}">🧭 Ruta</a></div>`;
  if (op.sinPasos) return fila;
  // Franja propia entre sitio y sitio, plegable: se pliega sola cuando el destino ya está visitado.
  if (op.hasta && op.key) { const key = 'tr:' + op.key, ab = abierto(key, false); // plegados por defecto; las opciones se ven igual
    // Todas las formas de ir, a la vista aunque esté plegado: a pie (hasta 3 km), metro, taxi y bus; la recomendada, resaltada.
    const pie = c.k <= 3 ? Math.max(2, Math.round(c.k * 1.3 / 4.5 * 60)) : null, ops = [];
    if (pie) ops.push(['pie', `🚶 ${pie} min`]); if (r) ops.push(['metro', `🚇 ${r.min} min`]); if (c.k > 0.8) ops.push(['taxi', `🚕 ${c.taxi || Math.round(c.k * 1.3 / (c.k > 8 ? 40 : 22) * 60 + 8)} min`]); if (st) ops.push(['bus', '🚌 bus']);
    const chips = ops.map(([m, t]) => `<span class="tr-op ${m === c.modo ? 'mejor' : ''}">${t}</span>`).join('');
    return `<details class="tramo tramo-${c.modo} tramo-pl" data-key="${esc(key)}" ${ab ? 'open' : ''}><summary><span class="tramo-hasta">⬇️ Hasta <b>${esc(op.hasta)}</b> <small class="muted">· ${fmtDist(c.k)}</small> <button class="irmap tr-nv" data-irab="${o[0]},${o[1]}|${esc(nO || '')}|${dst[0]},${dst[1]}|${esc(nD || '')}|${c.modo === 'pie' ? 'walk' : 'public'}" title="Este tramo en Naver Map (de parada a parada)" aria-label="Este tramo en Naver">🗺️</button></span><span class="tr-ops">${chips}</span></summary>${sinTaxi}${pasos}${!sinTaxi && !pasos ? `<div class="muted mini-nota">${txt}</div>` : ''}</details>`; }
  return `<div class="tramo tramo-${c.modo}">${op.hasta ? `<div class="tramo-hasta">⬇️ Hasta <b>${esc(op.hasta)}</b></div>` : ''}${fila}${sinTaxi}${pasos}</div>`;
}
// Todo el día en Naver Map: hotel → paradas → hotel. Naver admite hasta 5 paradas intermedias por enlace
// (documentado para la ruta en coche), así que con más paradas se parte en tramos.
function naverDia(hc, hotN, lista) {
  const pts = lista.filter(l => coordsLugar(l)).map(l => [coordsLugar(l), l.ko || l.es]);
  if (hc) { pts.unshift([hc, hotN || 'Hotel']); pts.push([hc, hotN || 'Hotel']); }
  if (pts.length < 3) return [];
  // Tramos repartidos a partes iguales (cada uno empieza donde acaba el anterior).
  const n = pts.length - 1, paso = Math.ceil(n / Math.ceil(n / 6)), partes = [];
  for (let i = 0; i < n; i += paso) partes.push(pts.slice(i, i + paso + 1));
  const q = (p, c) => `${p}lat=${c[0][0]}&${p}lng=${c[0][1]}&${p}name=${encodeURIComponent(c[1])}`;
  const url = P => `nmap://route/car?${q('s', P[0])}&${P.slice(1, -1).map((c, i) => q('v' + (i + 1), c) + '&').join('')}${q('d', P[P.length - 1])}&appname=viajecorea`;
  // Cada tramo sale donde empieza: el 1.º arriba y los demás tras la parada desde la que salen (inicio = nº de esa parada).
  return partes.map((P, i) => ({ inicio: i * paso + (hc ? 0 : 1), html: `<div class="naver-dia ${i ? 'naver-sig' : ''}">${i ? `<small>Siguiente tramo, desde la parada ${i * paso + (hc ? 0 : 1)}:</small>` : ''}<a class="btn mini" href="${url(P)}">🧭 ${partes.length > 1 ? `Día en Naver (${i + 1}/${partes.length})` : 'Todo el día en Naver'}</a></div>` }));
}
// Sitios recomendados que no están en ningún día del plan y quedan a ≤900 m de la ruta de ese día.
// Sitios recomendados que no están en ningún día y quedan a ≤900 m de la ruta, con dónde encajan
// (tras qué parada numerada: "2*" = entre la parada 2 y la 3, el sitio con menos desvío).
function sugerenciasDe(d, ruta, hot) {
  const k = ck(d.ciudad), cs = ruta.map(coordsLugar).filter(Boolean); if (!cs.length) return [];
  const enAlgun = new Set(); arr(trip.dias).forEach(x => listaDia(x).forEach(l => enAlgun.add(hKey(l))));
  const imp = new Set(((typeof IMPRES !== 'undefined' && IMPRES[k]) || []).map(hKey));
  const paradas = []; if (hot) paradas.push({ n: 0, es: 'el hotel', c: hot });
  let n = 0; ruta.forEach(l => { const c = coordsLugar(l); if (c) paradas.push({ n: ++n, es: l.es, c }); });
  return sitiosCiudadObj(k).filter(l => !enAlgun.has(hKey(l)) && coordsLugar(l)).map(l => {
    const c = coordsLugar(l), ds = ruta.filter(x => coordsLugar(x)).map(x => [x, km(coordsLugar(x), c)]).sort((a, b) => a[1] - b[1]);
    if (!ds.length || ds[0][1] > 0.9) return null;
    let mejor = null;
    for (let j = 1; j < paradas.length; j++) { const dv = km(paradas[j - 1].c, c) + km(c, paradas[j].c) - km(paradas[j - 1].c, paradas[j].c);
      if (!mejor || dv < mejor.dv) mejor = { dv, tras: paradas[j - 1], antes: paradas[j] }; }
    const ult = paradas[paradas.length - 1], alFinal = km(ult.c, c);
    if (!mejor || alFinal < mejor.dv) mejor = { dv: alFinal, tras: ult, antes: null };
    return { l, c, dm: ds[0][1], junto: ds[0][0], peso: (imp.has(hKey(l)) ? 2 : 0) + (l.top ? 1 : 0), ...mejor,
      etq: (mejor.tras.n === 0 ? 'H' : mejor.tras.n) + '*' };
  }).filter(Boolean).sort((a, b) => b.peso - a.peso || a.dm - b.dm).slice(0, 4);
}
const textoEncaje = g => g.antes ? `De paso entre ${g.tras.n ? 'la parada ' + g.tras.n + ' (' + g.tras.es + ')' : 'el hotel'} y la parada ${g.antes.n} (${g.antes.es}): desvío ~${fmtDist(g.dv)}`
  : `Al final, después de ${g.tras.n ? 'la parada ' + g.tras.n + ' (' + g.tras.es + ')' : 'el hotel'}: a ${fmtDist(g.dv)}`;
function sugPlegada(g, d) {
  // Sitio cercano que no está en el plan: va dentro de la Ruta del día como una parada más, con asterisco (no cuenta en tramos ni mapa).
  const D = typeof DIA_LP !== 'undefined' ? DIA_LP : {}, l = g.l, h = hKey(l), txt = D[h.slice(2)] || D[h] || l.desc || l.nota || '', key = 'sug:' + d.fecha + '|' + h, k = ck(d.ciudad);
  return `<details class="sd sd-sug" data-key="${esc(key)}" ${abierto(key, false) ? 'open' : ''}><summary class="sd-tit">${miniFoto(l)}${irQV(l, k, true)}${irMapas(l)}<button class="mini sug-add" data-agtog="${esc(h)}|${d.fecha}" title="Añadir a este día" aria-label="Añadir a este día">＋</button><br>
    <b><span class="sug-etq">${g.etq}</span>${icSitio((l.tipo || '') + ' ' + l.es)} ${esc(l.es)}</b>${lpPill(l)} <span class="ko-s">${esc(l.ko || '')}</span></summary>
    <div class="sd-cuerpo"><div class="sug-encaje">📍 ${esc(textoEncaje(g))}</div>${horarioLinea(l, d.fecha)}${txt ? `<div class="muted">${resaltar(breve(txt), true)}</div>` : ''}</div></details>`;
}
// ---------- Horarios de apertura y horario propuesto del día (ritmo tranquilo) ----------
const DIAS_SEM = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const horDe = l => (typeof HORARIOS !== 'undefined' && l && HORARIOS[hKey(l).slice(2)]) || null;
const aMinH = h => { const m = String(h || '').match(/(\d{1,2}):(\d{2})/); return m ? +m[1] * 60 + +m[2] : null; };
const hhmm = m => `${String(Math.floor(m / 60) % 24).padStart(2, '0')}:${String(Math.round(m % 60)).padStart(2, '0')}`;
// Línea de horario de un sitio; con fecha, avisa si ese día cierra.
function horarioLinea(l, fecha) {
  const h = horDe(l); if (!h) return '';
  const ds = fecha ? new Date(fecha + 'T12:00').getDay() : null;
  const pl = x => DIAS_SEM[x].replace(/([^s])$/, '$1s'), abre = [0, 1, 2, 3, 4, 5, 6].filter(x => !arr(h.x).includes(x));
  const cierra = !arr(h.x).length || /cierra|solo/i.test(h.t || '') || /sábados|domingos|lunes/i.test(h.t || '') && abre.length <= 2 ? ''
    : abre.length <= 2 ? ` · solo los ${abre.map(pl).join(' y ')}` : ` · cierra los ${arr(h.x).map(pl).join(' y ')}`;
  let aviso = '';
  if (ds !== null && arr(h.x).includes(ds)) aviso = `<div class="hor-cerrado">⛔ El ${DIAS_SEM[ds]} está cerrado: cambiadlo de día</div>`;
  else if (ds !== null && h.noche && !h.noche.includes(ds)) aviso = `<div class="hor-cerrado">🌙 El mercado nocturno solo abre viernes y sábado: el ${DIAS_SEM[ds]} no hay</div>`;
  return `<div class="hor-linea">🕒 ${esc(h.t)}${cierra}${h.v ? ' <span class="ver">VERIFICAR</span>' : ''}${h.n ? `<div class="muted">${esc(h.n)}</div>` : ''}</div>${aviso}`;
}
function sitiosDia(d) {
  const k = ck(d.ciudad), A = agendaVer(d.fecha), todos = listaDia(d);
  if (!todos.length) return '';
  const auto = autoDia(d).filter(l => !A.del.includes(hKey(l)));
  const D = typeof DIA_LP !== 'undefined' ? DIA_LP : {}; const G = typeof DIA_INFO !== 'undefined' ? DIA_INFO : {};
  const al = alojDe(d.fecha), hot = al.noche && al.noche.lat != null && ck(al.noche.ciudad) === k ? al.noche : (al.sale && al.sale.lat != null && ck(al.sale.ciudad) === k ? al.sale : null);
  let prev = hot ? [Number(hot.lat), Number(hot.lon)] : null, prevN = hot ? hot.nombre : '';
  const num = {}, naverTras = {}; // número de cada parada (el del mapa) y tramos de Naver que salen tras ella
  const fila = (l, extra) => {
    const h = hKey(l), mas = D[h.slice(2)] || D[h], txt = mas || l.desc || l.nota || G[h.slice(2)] || '', c = coordsLugar(l);
    const t = c && prev ? tramo(prev, c, prevN, l.ko || l.es, { hasta: l.es, aK: hKey(l), key: d.fecha + '|' + h, hecho: hecho(l, k) }) : '';
    if (c) { prev = c; prevN = l.ko || l.es; }
    const n = num[h];
    // Ficha plegable: se pliega sola al marcarla como visitada (y la foto, a la derecha, arriba).
    const key = 'sd:' + d.fecha + '|' + h, ab = abierto(key, !hecho(l, k));
    return `${t}${extra ? encaje(l) : ''}<details class="sd ${hecho(l, k) ? 'hecho-card' : ''}" data-key="${esc(key)}" ${ab ? 'open' : ''}><summary class="sd-tit">${miniFoto(l)}${btnHecho(l, k)}${irQV(l, k, true)}${irMapas(l)}<br><b>${n ? `<span class="sd-num">${n}</span>` : ''}${icSitio(l.es)} ${esc(l.es)}</b>${lpPill(l)} <span class="ko-s">${esc(l.ko || '')}</span>${extra ? `<button class="sd-x" data-agdel="${esc(h)}" aria-label="Quitar de este día">✕</button>` : ''}</summary>
      <div class="sd-cuerpo">${horarioLinea(l, d.fecha)}${txt ? `<div class="muted">${resaltar(breve(l.desc || txt), true)}</div>` : ''}${lp24(l)}</div></details>${num[h] && naverTras[num[h]] ? naverTras[num[h]] : ''}`;
  };
  // Añadidos: en el orden más corto desde el último sitio del itinerario (todas las combinaciones hasta 7).
  let extras = todos.filter(l => !auto.includes(l));
  const ultimo = [...auto].reverse().map(coordsLugar).find(Boolean) || (hot ? [Number(hot.lat), Number(hot.lon)] : null);
  const conC = extras.filter(l => coordsLugar(l)), sinC = extras.filter(l => !coordsLugar(l));
  if (ultimo && conC.length > 1) {
    const largo = o => o.reduce((s, l, i) => s + km(i ? coordsLugar(o[i - 1]) : ultimo, coordsLugar(l)), 0);
    if (conC.length <= 7) { const perm = x => x.length <= 1 ? [x] : x.flatMap((e, i) => perm([...x.slice(0, i), ...x.slice(i + 1)]).map(r => [e, ...r]));
      extras = [...perm(conC).reduce((m, o) => largo(o) < largo(m) ? o : m), ...sinC]; }
    else { const r = [], q = [...conC]; let pto = ultimo; while (q.length) { q.sort((x, y) => km(pto, coordsLugar(x)) - km(pto, coordsLugar(y))); const n = q.shift(); r.push(n); pto = coordsLugar(n); } extras = [...r, ...sinC]; }
  }
  // Dónde encajaría cada añadido dentro del itinerario (menor desvío), solo como aviso.
  const puntos = [...(hot ? [{ es: 'el hotel', c: [Number(hot.lat), Number(hot.lon)] }] : []), ...auto.filter(l => coordsLugar(l)).map(l => ({ es: l.es, c: coordsLugar(l) }))];
  const encaje = l => { const c = coordsLugar(l); if (!c || puntos.length < 2) return '';
    let best = null; for (let i = 1; i < puntos.length; i++) { const dv = km(puntos[i - 1].c, c) + km(c, puntos[i].c) - km(puntos[i - 1].c, puntos[i].c); if (!best || dv < best.dv) best = { dv, a: puntos[i - 1].es, b: puntos[i].es }; }
    const alFinal = km(puntos[puntos.length - 1].c, c);
    return best && best.dv < alFinal - 0.2 ? `<div class="encaje">💡 Os pilla de paso entre ${esc(best.a)} y ${esc(best.b)} (desvío ~${fmtDist(best.dv)}).</div>` : ''; };
  const hc = hot ? [Number(hot.lat), Number(hot.lon)] : null, conMapa = [...auto, ...extras].some(l => coordsLugar(l));
  { let n = 0; [...auto, ...extras].forEach(l => { if (coordsLugar(l)) num[hKey(l)] = ++n; }); }
  const nvP = naverDia(hc, hot && (hot.ko || hot.nombre), [...auto, ...extras]); nvP.slice(1).forEach(x => { naverTras[x.inicio] = x.html; });
  // Sugerencias "cerca y no lo tenéis", plegadas e intercaladas tras la parada donde encajan (H* = tras el hotel).
  const sugs = sugerenciasDe(d, [...auto, ...extras], hc), sugTras = n => sugs.filter(g => g.tras.n === n).map(g => sugPlegada(g, d)).join('');
  return `<div class="card sitios-dia" data-fecha="${d.fecha}">${conMapa ? bannerMapaDia(d, hc, [...auto, ...extras]) : ''}${planLluvia(d)}<b class="rd-tit">📖 Ruta del día</b>
    ${(nvP[0] || {}).html || ''}
    ${hot ? `<div class="sd-hotel">🛏️ ${esc(hot.nombre)}</div>${sugTras(0)}` : ''}
    ${auto.map(l => fila(l, false) + sugTras(num[hKey(l)])).join('')}
    ${extras.length ? `<div class="sd-anadidos">➕ Añadidos desde Ciudades</div>${extras.map(l => fila(l, true) + sugTras(num[hKey(l)])).join('')}` : ''}
    ${sugs.length ? '<div class="muted mini-nota sug-ley"><span class="sug-etq">*</span> Cerca de vuestra ruta y no está en el plan (el número dice tras qué parada encaja; H = tras el hotel). Con ＋ se añade al día.</div>' : ''}
    ${A.del.length ? `<button class="sec mini sd-reset" data-agreset="${d.fecha}">↺ Volver al itinerario</button>` : ''}
    <div class="muted mini-nota">Metro de Seúl © OpenStreetMap (ODbL).</div></div>`;
}

// Medio de transporte principal de un traslado (para el icono).
function medio(t) {
  const x = [t.de, t.a, ...arr(t.pasos)].join(' ').toLowerCase();
  if (t.bus && !t.tren) return ['🚌', 'Bus'];
  if (t.tren && (t.tren.salida || t.tren.comprado != null) || /ktx|tren|korail/.test(x)) return ['🚆', 'Tren'];
  if (/\bbus\b|autob|kobus/.test(x)) return ['🚌', 'Bus'];
  if (/aeropuerto|vuelo/.test(x)) return ['✈️', 'Aeropuerto'];
  return ['🚕', 'Taxi'];
}
// Qué "Paso a paso" están abiertos (lo controla la app, no el navegador).
const pasosAb = {};
// 🧭 Cómo llegar a una parada: Naver Map (ruta desde donde estéis) y Google Maps, solo iconos, junto al de Planes.
function irMapas(l) {
  const c = coordsLugar(l); if (!c) return '';
  const n = l.ko || l.es || '';
  return `<button class="irmap" data-irmap="naver" data-lat="${c[0]}" data-lon="${c[1]}" data-n="${esc(n)}" title="Cómo llegar con Naver Map" aria-label="Naver">🧭</button><button class="irmap" data-irmap="google" data-lat="${c[0]}" data-lon="${c[1]}" data-n="${esc(n)}" title="Cómo llegar con Google Maps" aria-label="Google Maps">📍</button>`;
}
// ＋ de una sugerencia (va dentro del summary): añade al día sin abrir ni cerrar la ficha.
document.addEventListener('click', e => {
  const b = e.target.closest('.sug-add[data-agtog]'); if (!b) return; e.preventDefault(); e.stopPropagation();
  const [h, f] = b.dataset.agtog.split('|'); agendaToggle(h, f); render();
}, true);
// 🗺️ Tramo de parada a parada en Naver Map (con salida y llegada); si la app no se abre, Google Maps con el mismo recorrido.
document.addEventListener('click', e => {
  const b = e.target.closest('[data-irab]'); if (!b) return; e.preventDefault(); e.stopPropagation();
  const [o, nO, dd, nD, modo] = b.dataset.irab.split('|'), [sl, sg] = o.split(','), [dl, dg] = dd.split(',');
  const web = `https://www.google.com/maps/dir/?api=1&origin=${sl},${sg}&destination=${dl},${dg}&travelmode=${modo === 'walk' ? 'walking' : 'transit'}`;
  let fue = false; const vis = () => { if (document.hidden) fue = true; }; document.addEventListener('visibilitychange', vis);
  location.href = `nmap://route/${modo}?slat=${sl}&slng=${sg}&sname=${encodeURIComponent(nO)}&dlat=${dl}&dlng=${dg}&dname=${encodeURIComponent(nD)}&appname=viajecorea`;
  setTimeout(() => { document.removeEventListener('visibilitychange', vis); if (!fue && !document.hidden) window.open(web, '_blank'); }, 1500);
}, true);
document.addEventListener('click', e => {
  const b = e.target.closest('[data-irmap]'); if (!b) return; e.preventDefault(); e.stopPropagation();
  const { lat, lon, n } = b.dataset;
  if (b.dataset.irmap === 'google') { window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`, '_blank'); return; }
  const web = `https://m.map.naver.com/search2/search.naver?query=${encodeURIComponent(n)}`;
  let fue = false; const vis = () => { if (document.hidden) fue = true; }; document.addEventListener('visibilitychange', vis);
  location.href = `nmap://route/public?dlat=${lat}&dlng=${lon}&dname=${encodeURIComponent(n)}&appname=viajecorea`;
  setTimeout(() => { document.removeEventListener('visibilitychange', vis); if (!fue && !document.hidden) window.open(web, '_blank'); }, 1500);
}, true);
function trasladoCard(t, pleg = false, sinFecha = false) {
  const tren = billete(t) || {}, [ic, nom] = medio(t), pend = isPend(t);
  // En Ruta, plegable: se pliega solo cuando ya pasó o se marcó hecho en Hoy.
  const plHecho = (t.fecha && t.fecha < todayISO()) || !!u().hecho['tras:' + (t.id || t.fecha)], plK = 'trr:' + (t.id || t.fecha) + (plHecho ? ':h' : '');
  const d = new Date(String(t.fecha) + 'T12:00:00');
  const dia = isNaN(d) ? esc(t.fecha || '') : `<b>${d.getDate()}</b><small>${d.toLocaleDateString('es-ES', { month: 'short' })}</small><small>${d.toLocaleDateString('es-ES', { weekday: 'short' })}</small>`;
  return `<div class="tl ${pend ? 'pend' : isOk(t) ? 'ok' : ''} ${t.fecha && t.fecha < todayISO() ? 'pasado' : ''} ${sinFecha ? 'sin-fecha' : ''}">
    ${sinFecha ? '' : `<div class="tl-fecha">${dia}</div>`}
    <div class="tl-card card">
      ${pleg ? `<details class="tl-pl" data-key="${esc(plK)}" ${abierto(plK, !plHecho) ? 'open' : ''}><summary>` : ''}<div class="tl-top"><span class="tl-ic" title="${nom}">${ic}</span><div class="tl-ruta"><b>${esc(t.de)}</b><span class="tl-flecha">↓</span><b>${esc(t.a)}</b></div></div>${pleg ? '</summary>' : ''}
      <div class="tl-meta">${t.fecha && t.fecha < todayISO() ? '' : `${estadoBadge(t)} ${ver(t)}`}</div>
      ${tren.salida || tren.llegada ? `<div class="tl-horas"><span>${esc(tren.salida || '?')}</span><i>→</i><span>${esc(tren.llegada || '?')}</span>${tren.comprado === false ? '<em class="badge pend">billete sin comprar</em>' : ''}</div>` : ''}
      ${tren.numero || tren.asientos ? `<div class="tl-billete"><b class="nvuelo">${esc(tren.numero || '')}</b>${tren.clase ? ` <span class="muted">${esc(tren.clase)}</span>` : ''}${tren.precio ? ` <span class="muted">· ${esc(tren.precio)}</span>` : ''}
        ${Object.keys(tren.asientos || {}).length ? `<div>💺 ${tren.coche ? `Coche <b>${esc(tren.coche)}</b> · ` : ''}${Object.entries(tren.asientos).map(([n, a]) => `${esc(n)} <b>${esc(a)}</b>`).join(' · ')}</div>` : ''}${tren.nota ? `<div class="muted">${esc(tren.nota)}</div>` : ''}</div>` : ''}
      ${arr(t.pasos).length ? (() => { const k = 'p:' + (t.id || t.fecha + t.de), ab = k in pasosAb ? pasosAb[k] : pend;
        return `<div class="tl-pasos"><button class="tl-pasos-btn" data-pasos="${esc(k)}" data-v="${ab ? 0 : 1}">${ab ? '▾' : '▸'} Paso a paso (${arr(t.pasos).length})</button>
        ${ab ? `<ol>${arr(t.pasos).map(p => `<li>${resaltar(p)}</li>`).join('')}</ol>` : ''}</div>`; })() : ''}
      ${t.frase_ko ? `<div class="ko">${esc(t.frase_ko)}</div>` : ''}
      ${t.romanizacion ? `<div class="muted">${esc(t.romanizacion)}</div>` : ''}
    ${pleg ? '</details>' : ''}</div>
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
// En Ruta, cada vuelo es plegable y se pliega solo cuando ya ha pasado (como estancias y traslados).
function vueloPleg(v, tipo) {
  const fechas = [String(v.fecha || '').slice(0, 10), ...arr(v.tramos).map(t => String(t.llegada || t.salida || '').slice(0, 10))].filter(f => /^\d{4}-\d{2}-\d{2}$/.test(f)).sort();
  const fin = fechas[fechas.length - 1] || '', pasado = fin && fin < todayISO(), key = 'vu:' + tipo + ':' + (v.fecha || '') + (pasado ? ':h' : '');
  const ruta = arr(v.tramos).filter(t => t.de).map(t => t.de).concat(arr(v.tramos).filter(t => t.a).slice(-1).map(t => t.a)).join(' → ') || v.tramo || '';
  return `<details class="vuelo-pl ${pasado ? 'pasado' : ''}" data-key="${esc(key)}" ${abierto(key, !pasado) ? 'open' : ''}><summary>${tipo === 'ida' ? '🛫 Vuelo de ida' : '🛬 Vuelo de vuelta'}${fechas[0] ? ' · ' + fmtCorto(fechas[0]) : ''}${ruta ? ' · ' + esc(ruta) : ''}${pasado ? ' ✓' : ''}</summary>${vueloCard(v, tipo)}</details>`;
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
// LP (azul) = la Lonely Planet 2016 del PDF original; LP24 (rosa) = lo añadido después desde la Lonely Planet 2024, más actual.
const esLP24 = l => l && typeof l === 'object' && !!(l.lp24 || l.fuente === 'lonely24' || (typeof LP24_INDISP !== 'undefined' && (l.es || l.ko) && (LP24_INDISP[hKey(l).slice(2)] || (typeof LP24_SITIOS !== 'undefined' && LP24_SITIOS.has(hKey(l).slice(2))))));
const lpPill = l => (esLP(l) ? ` <span class="lp-pill" title="Recomendado por Lonely Planet 2016">LP${l.top || /★/.test(l.nota || '') ? ' ★' : ''}</span>` : '')
  + (esLP24(l) ? ` <span class="lp-pill lp24-pill" title="Lonely Planet 2024 (añadido después, más actual)">LP24</span>` : '');
const lpTag = lpPill;
const interesDe = c => arr(c.interes).length ? arr(c.interes) : (CATALOGO[ck(c.nombre)] || []).filter(l => !/^(Estación|Aeropuerto)/.test(l.es)).map(l => l.es);

// Estancia en una ciudad (Ruta): fechas, noches, hotel y días del plan.
function estanciaCard(c) {
  const k = ck(c.nombre), noches = c.hasta ? Math.round((new Date(c.hasta) - new Date(c.desde)) / 864e5) : null;
  const h = arr(trip.alojamientos).find(a => ck(a.ciudad) === k && String(a.fechas || '').startsWith(c.desde)) || arr(trip.alojamientos).find(a => ck(a.ciudad) === k);
  const ds = planIdx().filter(d => d.fecha >= c.desde && (!c.hasta || d.fecha < c.hasta)), ns = ds.map(d => d.n);
  const dias = arr(trip.dias).filter(d => d && d.fecha).sort((a, b) => String(a.fecha).localeCompare(String(b.fecha)));
  // Ya pasado: la estancia en cuanto se deja el hotel (día de salida) y cada día al día siguiente.
  const hoy = todayISO(), fuera = c.hasta && c.hasta <= hoy;
  const ek = 'est:' + (c.id || c.desde) + (fuera ? ':h' : '');
  return `<div class="tl ${fuera ? 'pasado' : ''}"><div class="tl-fecha tl-pin" style="${varsTema(k)}">${tema(k).ic}</div><details class="card estancia" style="${varsTema(k)}" data-key="${esc(ek)}" ${abierto(ek, !fuera) ? 'open' : ''}><summary><div class="big">${esc(c.nombre)}</div>
    <div class="muted">${fmtCorto(c.desde)}${c.hasta ? ' → ' + fmtCorto(c.hasta) : ''}${noches ? ` · ${noches} noche${noches > 1 ? 's' : ''}` : ''}${ns.length ? ` · Día ${ns[0]}${ns.length > 1 ? '-' + ns[ns.length - 1] : ''}` : ''}</div></summary>
    ${h ? `<div class="muted">🛏️ ${esc(h.nombre)}</div>` : ''}
    ${ds.map(d => `<button class="dad-dia ${d.fecha === hoy ? 'on' : ''} ${d.fecha < hoy ? 'pasado' : ''}" data-dia="${d.n - 1}"><span class="hora">${fmtCorto(d.fecha)}</span><span>${esc((dias[d.n - 1] || {}).titulo || '')}</span>${miniTiempo(k, d.fecha)}</button>`).join('')}</details></div>`;
}

function viewRuta() {
  const vuelos = arr(trip.vuelos).filter(v => v && typeof v === 'object').slice().sort((a, b) => String(a.fecha).localeCompare(String(b.fecha)));
  const conTipo = vuelos.some(v => v.tipo);
  const ida = conTipo ? vuelos.filter(v => v.tipo !== 'vuelta') : vuelos.slice(0, vuelos.length > 1 ? vuelos.length - 1 : 1);
  const vuelta = conTipo ? vuelos.filter(v => v.tipo === 'vuelta') : vuelos.length > 1 ? [vuelos[vuelos.length - 1]] : [];
  let html = ida.map(v => vueloPleg(v, 'ida')).join('') + pendingAlert();
  if (arr(trip.ciudades).length) html += viewMapa();
  const tr = arr(trip.traslados).slice().sort((a, b) => String(a.fecha).localeCompare(String(b.fecha)));
  const est = arr(trip.ciudades).filter(c => c && c.desde).map(c => [c.desde, 1, estanciaCard(c)]);
  const ev = [...tr.map(t => [t.fecha || '', 0, trasladoCard(t, true)]), ...est].sort((a, b) => String(a[0]).localeCompare(String(b[0])) || a[1] - b[1]);
  if (ev.length) html += '<h2>Dónde estamos y traslados</h2><div class="timeline">' + ev.map(e => e[2]).join('') + '</div>';
  html += vuelta.map(v => vueloPleg(v, 'vuelta')).join('');
  return html || '<p class="muted">Sin datos de ruta.</p>';
}

// Desplegable con lo que amplía la Lonely (DIA_LP) o una frase general (DIA_INFO).
// "Con ojos de guía": ficha cultural ampliada de los lugares emblemáticos (cultura.js).
// 📜 Enlace desde los títulos de Hoy y Planes a la historia y curiosidades de la ciudad (Historia → Vuestras ciudades).
const linkHist = k => (typeof CIUDAD_INFO !== 'undefined' && CIUDAD_INFO[k]) || (typeof HISTORIA !== 'undefined' && HISTORIA[k]) ? `<button class="hist-link" data-histc="${esc(k)}">📜 Historia, costumbres y curiosidades de ${esc(nombreCiudad(k))} ›</button>` : '';
document.addEventListener('click', e => {
  const b = e.target.closest('[data-histc]'); if (!b) return; e.stopPropagation();
  const k = b.dataset.histc; histSub = 'ciudades'; histCap = null; abiertos['hcd:' + k] = true; ir('historia'); render();
  const el = document.querySelector(`details[data-key="hcd:${CSS.escape(k)}"]`); if (el) { el.scrollIntoView({ block: 'start' }); window.scrollBy(0, -10); }
}, true);
function guiaCult(l, ctx) { return lp24(l) + guiaCult0(l, ctx); }
// 📕 Recuadro «Indispensable» de la Lonely Planet 2024 (LP24_INDISP en contenido.js), con hangul y 🔊.
// 🚶 Rutas a pie de la LP 2024 (LP24_RUTAS): ficha plegada propia en Planes de su ciudad y en Hoy los días que pasan por ≥3 de sus paradas.
function rutasLP24(k, d) {
  const rs = (typeof LP24_RUTAS !== 'undefined' ? LP24_RUTAS : []).filter(r => r.ciudad === k && (!d || listaDia(d).filter(l => r.items.some(([, ko]) => ko.replace(/\s+/g, '') === hKey(l).slice(2))).length >= 3));
  return rs.map((r, i) => { const key = `rlp:${k}:${i}`; return `<details class="card lp24-ruta" data-key="${key}" ${abierto(key, false) ? 'open' : ''}><summary>🚶 <b>${esc(r.t)}</b> <span class="lp-pill lp24-pill">LP24</span> <small class="muted">· ${r.items.length} paradas</small></summary>
    <ol>${r.items.map(([es, ko, t]) => `<li><b>${esc(es)}</b> <span class="ko-s">${esc(ko)}</span>${btnHabla(ko)}<div>${esc(t)}</div></li>`).join('')}</ol></details>`; }).join('');
}
function lp24(l) {
  const x = l && typeof l === 'object' && typeof LP24_INDISP !== 'undefined' && LP24_INDISP[hKey(l).slice(2)]; if (!x) return '';
  return `<div class="lp24"><b>${x.t ? esc(x.t) : `📕 Indispensable · Lonely Planet 2024${x.p ? `, p. ${x.p}` : ''}`}</b><ol>${x.items.map(([es, ko, d]) => `<li><b>${esc(es)}</b> <span class="ko-s">${esc(ko)}</span>${btnHabla(ko.split(' · ')[0])}<div>${esc(d)}</div></li>`).join('')}</ol></div>`;
}
function guiaCult0(l, ctx) {
  const ps = l && typeof l === 'object' && typeof GUIA_CULT !== 'undefined' && GUIA_CULT[hKey(l).slice(2)]; if (!ps) return '';
  const h = hKey(l), k = 'gc:' + ctx + ':' + h;
  return `<details class="guia-cult" data-key="${esc(k)}" ${abierto(k, false) ? 'open' : ''}><summary>🎎 Con ojos de guía</summary>
    <p class="gc-gancho">${esc(ps[0])}</p>${ps.slice(1).map(p => `<p class="${/^👀/.test(p) ? 'gc-mira' : /^💡/.test(p) ? 'gc-tip' : ''}">${resaltar(p, true)}</p>`).join('')}</details>`;
}
function masLP(l, ctx) {
  if (!l || typeof l !== 'object') return '';
  const h = hKey(l), D = typeof DIA_LP !== 'undefined' ? DIA_LP : {}, G = typeof DIA_INFO !== 'undefined' ? DIA_INFO : {};
  // Si hay recuadro de la LP 2024, manda: no se repite lo de la LP 2016 (se solapaba y traía horarios y buses de 2016).
  const con24 = typeof LP24_INDISP !== 'undefined' && LP24_INDISP[h.slice(2)];
  const lp = con24 ? null : D[h.slice(2)] || D[h], txt = lp || (con24 ? null : G[h.slice(2)]);
  if (!txt || txt === l.desc) return guiaCult(l, ctx);
  return guiaCult(l, ctx) + `<details class="mas-lp" data-key="mx:${ctx}:${esc(h)}" ${abierto('mx:' + ctx + ':' + h, false) ? 'open' : ''}><summary>📖 ${lp ? 'Más de la Lonely' : 'Más info'}</summary>
    <p>${resaltar(txt, true)}${lp ? ' <span class="badge otro">LP 2016</span>' : ''}</p></details>`;
}
// Imprescindibles de una ciudad: foto (Wikipedia, se guarda para offline), descripción y ✓ hecho.
// Qué ver: cada sitio es una ficha plegada (foto, nombre y una línea); al abrirla sale toda la información,
// incluidas "Con ojos de guía" y lo que amplía la Lonely, sin más desplegables.
const breve = t => { const x = String(t || '').replace(/\s+/g, ' ').trim(), m = x.match(/^.{25,}?[.!?](\s|$)/); return recorta(m ? m[0] : x, 120); };
const enQueVer = (l, k) => { const h = hKey(l); return qvLista(k, ciudadesUnicas().find(c => ck(c.nombre) === k)).some(o => hKey(o.l) === h); };
function infoCompleta(l, desc) {
  const h = hKey(l), D = typeof DIA_LP !== 'undefined' ? DIA_LP : {}, I = typeof DIA_INFO !== 'undefined' ? DIA_INFO : {};
  const con24 = typeof LP24_INDISP !== 'undefined' && LP24_INDISP[h.slice(2)]; // la LP 2024 manda sobre la de 2016
  const gc = typeof GUIA_CULT !== 'undefined' && GUIA_CULT[h.slice(2)], lp = con24 ? null : D[h.slice(2)] || D[h], info = !lp && !con24 && I[h.slice(2)];
  return `${desc ? `<p>${resaltar(desc, true)}</p>` : ''}${lp24(l)}
    ${lp && lp !== desc ? `<div class="qv-bloque"><b>📖 Más de la Lonely</b> <span class="badge otro">LP 2016</span><p>${resaltar(lp, true)}</p></div>` : ''}
    ${info && info !== desc ? `<div class="qv-bloque"><b>ℹ️ Más info</b><p>${resaltar(info, true)}</p></div>` : ''}
    ${gc ? `<div class="qv-bloque guia-cult-abierta"><b>🎎 Con ojos de guía</b><p class="gc-gancho">${esc(gc[0])}</p>${gc.slice(1).map(p => `<p class="${/^👀/.test(p) ? 'gc-mira' : /^💡/.test(p) ? 'gc-tip' : ''}">${resaltar(p, true)}</p>`).join('')}</div>` : ''}`;
}
// Enlace a la ficha del sitio en Qué ver (abierta); si no tiene ficha, al buscador de Qué ver.
// solo = solo el icono 🏯 (donde ya se sabe qué significa, p. ej. en el plan B de lluvia).
const irQV = (l, k, solo = false) => { const t = solo ? '🏯' : '🏯 Ver en Planes', c = `sec mini irqv${solo ? ' irqv-ic' : ''}`, a = solo ? ' aria-label="Ver en Planes"' : '';
  return enQueVer(l, k) ? `<button class="${c}"${a} data-irqv="${esc(k)}" data-h="${esc(hKey(l))}">${t}</button>` : `<button class="${c}"${a} data-bcity="${esc(k)}" data-bq="${esc(l.es)}">${t}</button>`; };
// Todos los puntos de interés de una ciudad, sin repetir: imprescindibles, Lonely y catálogo.
function qvLista(k, c) {
  const vistos = new Set(), out = [], add = (l, desc) => { const h = hKey(l); if (!l || vistos.has(h)) return; vistos.add(h); out.push({ l, desc, plan: enPlan(l, k) }); };
  ((typeof IMPRES !== 'undefined' && IMPRES[k]) || []).forEach(l => add(l, l.desc));
  (LP[k] || []).forEach(l => add(l, l.nota));
  const cat = CATALOGO[k] || []; (c ? interesDe(c) : cat.map(l => l.es)).map(x => cat.find(l => l.es === x)).filter(Boolean).forEach(l => add(l, l.desc || l.nota));
  return out;
}
const QV_TIPOS = [[/palacio/i, '🏯 Palacios'], [/museo|biblioteca|prisión|memorial/i, '🏛️ Museos'], [/templo|santuario|pagoda|gruta|catedral|confuciana|academia|seowon/i, '🛕 Templos y santuarios'],
  [/mercado|calle|plaza|coex|centro|square|dong$/i, '🛍️ Mercados, calles y barrios'], [/aldea|barrio|hanok|pueblo/i, '🏘️ Aldeas y hanok'], [/parque|monte|isla|playa|mirador|arroyo|torre|lago|estanque|puente|río|muralla|acantilado|túmulo/i, '🌳 Naturaleza y vistas']];
const tipoQV = l => (QV_TIPOS.find(([re]) => re.test((l.tipo || '') + ' ' + l.es)) || [0, '✨ Otros'])[1];
let qvOrden = 'itin', qvFiltro = 'todos', qvMarca = '';
function qvPuntos(k, c) {
  const todos = qvLista(k, c), U = u();
  const F = { todos: () => true, itin: o => o.plan, lp: o => esLP(o.l), otros: o => !o.plan && !esLP(o.l) };
  // ✅ Marcados / ☐ No marcados: se suma al otro filtro (p. ej. Itinerario + No marcados = lo que os queda del plan).
  const base = todos.filter(F[qvFiltro] || F.todos), M = { si: o => hecho(o.l, k), no: o => !hecho(o.l, k) };
  let ls = base.filter(M[qvMarca] || F.todos);
  const cuenta = f => todos.filter(F[f]).length, vis = base.filter(M.si).length;
  const chips = (v, op, attr) => op.map(([x, t]) => `<button class="chip ${v === x ? 'on' : ''}" data-${attr}="${x}">${t}</button>`).join('');
  let grupos;
  if (qvOrden === 'az') grupos = [['', ls.slice().sort((a, b) => a.l.es.localeCompare(b.l.es, 'es'))]];
  else if (qvOrden === 'tipo') { const g = {}; ls.forEach(o => (g[tipoQV(o.l)] = g[tipoQV(o.l)] || []).push(o)); grupos = [...QV_TIPOS.map(x => x[1]), '✨ Otros'].filter(t => g[t]).map(t => [t, g[t].sort((a, b) => a.l.es.localeCompare(b.l.es, 'es'))]); }
  else { const g = new Map(); ls.slice().sort((a, b) => ((a.plan || {}).n || 999) - ((b.plan || {}).n || 999) || (b.l.top ? 1 : 0) - (a.l.top ? 1 : 0))
      .forEach(o => { const t = o.plan ? `📅 Día ${o.plan.n} · ${fmtCorto(o.plan.fecha)}` : '➕ Fuera del itinerario'; if (!g.has(t)) g.set(t, []); g.get(t).push(o); }); grupos = [...g]; }
  // Compacto: el orden es un solo botón que va cambiando; filtros y marcas en una fila con el número dentro.
  const ORD = [['itin', '📅', 'día'], ['tipo', '🏷️', 'tipo'], ['az', '🔤', 'A-Z']], oi = Math.max(0, ORD.findIndex(x => x[0] === qvOrden)), sig = ORD[(oi + 1) % ORD.length][0];
  const fil = [['todos', 'Todos', todos.length], ['itin', '📅', cuenta('itin')], ['lp', 'LP', cuenta('lp')], ['otros', 'Otros', cuenta('otros')]].filter(([x, , n]) => n || x === qvFiltro);
  return `<div class="qv-ctrl"><div class="chips qv-fila"><button class="chip qv-ord" data-qvo="${sig}" title="Orden: ${ORD[oi][2]} (tocar para cambiar)">⇅${ORD[oi][1]}</button><span class="qv-sep"></span>${fil.map(([x, t, n]) => `<button class="chip ${qvFiltro === x ? 'on' : ''}" data-qvf="${x}">${t} <small>${n}</small></button>`).join('')}<span class="qv-sep"></span><button class="chip ${qvMarca === 'si' ? 'on' : ''}" data-qvm="si" title="Marcados">✅ <small>${vis}</small></button><button class="chip ${qvMarca === 'no' ? 'on' : ''}" data-qvm="no" title="No marcados">☐ <small>${base.length - vis}</small></button></div></div>
    ${ls.length ? grupos.map(([t, os]) => `${t ? `<div class="qv-grupo">${esc(t)}</div>` : ''}${os.map(o => fichaQV(o.l, k, { desc: o.desc, plan: o.plan, clase: o.l.top ? 'top' : '',
      extra: o.l.tipo && esLP(o.l) ? `<div class="lp-meta"><span class="lp-tipo">${esc(o.l.tipo)}</span>${o.l.top ? '<span class="lp-top">★ Elección del autor</span>' : ''}${ver(o.l)}</div>` : '' })).join('')}`).join('') : '<p class="muted">Nada con este filtro.</p>'}`;
}
function fichaQV(l, k, { desc = '', extra = '', clase = '', plan = null } = {}) {
  const h = hKey(l), key = 'qv:' + h, w = l.sinFoto ? '' : (l.wiki || wikiDe(l) || (l.ko ? 'ko:' + l.ko : '')), ic = icSitio((l.tipo || '') + ' ' + l.es);
  return `<details class="qv ${clase} ${hecho(l, k) ? 'hecho-card' : ''}" data-key="${esc(key)}" ${abierto(key, false) ? 'open' : ''}>
    <summary>${w ? `<div class="foto mini qv-f" data-wiki="${esc(w)}"><span>${ic}</span></div>` : `<div class="foto mini qv-f vacia"><span>${ic}</span></div>`}
      <span class="qv-cab"><b>${esc(l.es)}${lpPill(l)}</b><small>${plan ? `<span class="qv-dia">📅 ${fmtCorto(plan.fecha)}</span> ` : ''}${esc(breve(desc || l.nota || l.desc))}</small></span>
      <button class="hd-ck qv-ck ${hecho(l, k) ? 'on' : ''}" data-hk="${esc(hKey(l))}" data-v="${hecho(l, k) ? 0 : 1}" aria-label="Visitado">${hecho(l, k) ? '✓' : ''}</button></summary>
    <div class="qv-cuerpo">${w ? `<div class="foto" data-wiki="${esc(w)}"><span>📷</span></div><div class="credito" data-cred="${esc(w)}"></div>` : ''}
      <div class="qv-acc">${btnHecho(l, k)}${agendaBtn(l, k, 'qv')}${naver(l)}${btnGps(l)}</div>${estrBox(hKey(l), l.es)}
      <div class="ko-s">${esc(l.ko || '')}${distHotel(l, k)}</div>${extra}${ojoLinea(ojoDe(null, l.ko))}${horarioLinea(l)}
      ${infoCompleta(l, desc || l.nota || l.desc)}</div></details>`;
}
// Foto principal del artículo de Wikipedia (necesita conexión la primera vez; el service worker la guarda).
const FOTOS = load('corea.fotos', {});
// v134: se reintentan las fotos que fallaron antes (artículos mal escritos o sin imagen).
if (load('corea.fotosv', 0) < 4) { Object.keys(FOTOS).forEach(k => { if (FOTOS[k] === null) delete FOTOS[k]; }); try { save('corea.fotos', FOTOS); save('corea.fotosv', 4); } catch {} } // v166: reintento con la 1.ª foto del artículo
// Hangul de cada artículo (para buscar en la Wikipedia coreana si la inglesa no tiene foto).
let KO_WIKI = null;
const koDeWiki = t => { if (!KO_WIKI) { KO_WIKI = {};
    Object.entries(typeof WIKI !== 'undefined' ? WIKI : {}).forEach(([ko, w]) => { KO_WIKI[w] = KO_WIKI[w] || ko; });
    [...Object.values(typeof IMPRES !== 'undefined' ? IMPRES : {}).flat(), ...(typeof PLANES !== 'undefined' ? PLANES : [])].forEach(l => { if (l && l.wiki && l.ko) KO_WIKI[l.wiki] = KO_WIKI[l.wiki] || l.ko; }); }
  return KO_WIKI[t] || ''; };
async function resumenWiki(lang, titulo) {
  const r = await fetch(`https://${lang}.wikipedia.org/api/rest_v1/page/summary/` + encodeURIComponent(titulo.replace(/ /g, '_')));
  if (!r.ok) return null; const d = await r.json(), im = d && (d.thumbnail || d.originalimage), url = d && d.content_urls && d.content_urls.mobile && d.content_urls.mobile.page;
  if (im) return { src: im.source, url };
  // Sin foto principal: la primera foto del artículo (no iconos, mapas ni banderas en SVG).
  try { const m = await fetch(`https://${lang}.wikipedia.org/api/rest_v1/page/media-list/` + encodeURIComponent(titulo.replace(/ /g, '_')));
    if (!m.ok) return null; const it = arr((await m.json()).items).find(x => x.type === 'image' && !/\.svg$|map|locator|flag|logo|icon/i.test(x.title || '') && arr(x.srcset).length);
    return it ? { src: (it.srcset[0].src.startsWith('//') ? 'https:' : '') + it.srcset[0].src, url } : null; } catch { return null; }
}
async function fotoCommons(q) {
  try {
    const r = await fetch('https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrnamespace=6&gsrlimit=10&prop=imageinfo&iiprop=url|mime&iiurlwidth=640&gsrsearch='
      + encodeURIComponent(q + ' filetype:bitmap'));
    if (!r.ok) return null; const ps = Object.values(((await r.json()).query || {}).pages || {}).sort((a, b) => (a.index || 0) - (b.index || 0));
    const p = ps.find(x => x.imageinfo && x.imageinfo[0] && /jpe?g|png|webp/.test(x.imageinfo[0].mime || '') && !/map|locator|flag|logo|icon|plan|diagram|지도|위치/i.test(x.title || ''));
    return p ? { src: p.imageinfo[0].thumburl || p.imageinfo[0].url, url: p.imageinfo[0].descriptionurl } : null;
  } catch { return null; }
}
// Una sola búsqueda por foto aunque la pidan varias miniaturas a la vez.
const FOTO_PEND = {};
function fotoWiki(t) {
  if (FOTOS[t] !== undefined) return Promise.resolve(FOTOS[t]);
  return FOTO_PEND[t] || (FOTO_PEND[t] = fotoWiki0(t).finally(() => { delete FOTO_PEND[t]; }));
}
async function fotoWiki0(t) {
  if (FOTOS[t] !== undefined) return FOTOS[t];
  let titulo = t; try { titulo = decodeURIComponent(t); } catch {} // algunos nombres venían ya codificados (%27…)
  try {
    let f = titulo.startsWith('ko:') ? null : await resumenWiki('en', titulo);
    const ko = titulo.startsWith('ko:') ? titulo.slice(3) : koDeWiki(t);
    if (!f && ko) f = await resumenWiki('ko', ko.replace(/\s+/g, '')) || (/\s/.test(ko) ? await resumenWiki('ko', ko) : null);
    // Sin foto en Wikipedia: Wikimedia Commons (fotos libres), buscando por el hangul y, si no, por el nombre.
    if (!f && ko) f = await fotoCommons(ko);
    if (!f && !titulo.startsWith('ko:')) f = await fotoCommons(titulo.replace(/_/g, ' ').replace(/\s*\(.*?\)/g, ''));
    FOTOS[t] = f; try { save('corea.fotos', FOTOS); } catch {}
    return f;
  } catch { return undefined; } // sin conexión: se reintenta más tarde
}
// Carrusel del día: pasa solo cada 6 s y a mano con las flechas ‹ › o deslizando; fundido suave entre fotos.
let carrUlt = 0, carrOcupado = false;
async function carrusel(dir) {
  const el = document.querySelector('.dia-foto[data-wikis]'); if (!el || carrOcupado) return;
  const ws = el.dataset.wikis.split('|').filter(Boolean), L = ws.length; if (L < 2) return;
  carrOcupado = true;
  try {
    const i0 = Math.max(0, ws.indexOf(el.dataset.wiki));
    for (let n = 1; n < L; n++) { const w = ws[((i0 + dir * n) % L + L) % L], f = await fotoWiki(w); if (!f || !f.src) continue;
      await new Promise(ok => { const img = new Image(); img.alt = ''; img.className = 'rota';
        img.onload = () => { if (!el.isConnected) return ok(); el.dataset.wiki = w; const viejos = [...el.querySelectorAll('img')]; el.appendChild(img);
          requestAnimationFrame(() => requestAnimationFrame(() => { img.classList.add('on'); viejos.forEach(v => v.classList.add('sale')); }));
          setTimeout(() => viejos.forEach(v => v.remove()), 1300);
          const ix = ws.indexOf(w), noms = (el.dataset.noms || '').split('|'), ban = el.parentElement, cap = ban && ban.querySelector('.dia-cap');
          if (cap && noms[ix]) cap.textContent = noms[ix]; if (ban) ban.querySelectorAll('.dia-puntos i').forEach((p, k) => p.classList.toggle('on', k === ix)); ok(); };
        img.onerror = () => { if (img.src !== f.src) img.src = f.src; else ok(); };
        img.src = /\/\d+px-/.test(f.src) ? f.src.replace(/\/\d+px-/, '/800px-') : f.src; });
      return; }
  } finally { carrOcupado = false; }
}
setInterval(() => { if (!document.hidden && Date.now() - carrUlt > 10000 && document.querySelector('.dia-foto.ok[data-wikis]')) carrusel(1); }, 6000);
// Deslizar el dedo sobre la foto: izquierda = siguiente, derecha = anterior (y ese toque no abre el visor).
let carrX = null, carrSwipe = 0;
document.addEventListener('touchstart', e => { carrX = e.target.closest('.dia-banner') ? e.touches[0].clientX : null; }, { passive: true });
document.addEventListener('touchend', e => { if (carrX == null) return; const dx = e.changedTouches[0].clientX - carrX; carrX = null;
  if (Math.abs(dx) > 40) { carrUlt = carrSwipe = Date.now(); carrusel(dx < 0 ? 1 : -1); } }, { passive: true });
function pintarFotos() {
  document.querySelectorAll('.foto[data-wiki]:not(.ok)').forEach(async el => {
    const f = await fotoWiki(el.dataset.wiki);
    if (!f) { if (f === null) el.classList.add('sinfoto'); return; }
    const img = new Image(); img.alt = '';
    img.onload = () => { el.innerHTML = ''; el.appendChild(img); el.classList.add('ok'); };
    // En banners se pide una versión más grande; si falla (p. ej. sin conexión), la miniatura guardada.
    const grande = (el.classList.contains('dia-foto') || el.classList.contains('banda')) && /\/\d+px-/.test(f.src) ? f.src.replace(/\/\d+px-/, '/800px-') : null;
    img.onerror = () => { if (grande && img.src !== f.src) img.src = f.src; else el.classList.add('sinfoto'); };
    img.src = grande || f.src;
    const c = el.classList.contains('mini') || el.classList.contains('banda') ? null : document.querySelector(`.credito[data-cred="${CSS.escape(el.dataset.wiki)}"]`);
    if (c && f.url) c.innerHTML = `Foto: <a href="${esc(f.url)}" target="_blank" rel="noopener">${/commons\./.test(f.url) ? 'Wikimedia Commons' : 'Wikipedia'}</a>`;
  });
}
// Descarga las fotos (y la versión grande de los banners de cada día) para usarlas sin conexión.
async function descargarFotos(prog) {
  const ts = [...new Set([...Object.values(typeof IMPRES !== 'undefined' ? IMPRES : {}).flat().map(l => l.wiki), ...Object.values(typeof WIKI !== 'undefined' ? WIKI : {}), ...(typeof PLANES !== 'undefined' ? PLANES : []).map(p => p.wiki), ...Object.values(LP).flat().map(l => l.wiki), ...HIST_WIKI].filter(Boolean))];
  const banners = new Set(arr(trip && trip.dias).map(d => listaDia(d).map(wikiDe).find(Boolean)).filter(Boolean));
  let n = 0, hechas = 0, i = 0;
  const uno = async t => {
    delete FOTOS[t]; const f = await fotoWiki(t);
    if (f && f.src) {
      try { await fetch(f.src, { mode: 'no-cors' }); n++; } catch {}
      if (banners.has(t) && /\/\d+px-/.test(f.src)) { try { await fetch(f.src.replace(/\/\d+px-/, '/800px-'), { mode: 'no-cors' }); } catch {} }
    }
    hechas++; if (prog) prog(hechas, ts.length);
  };
  await Promise.all(Array.from({ length: 6 }, async () => { while (i < ts.length) await uno(ts[i++]); }));
  return [n, ts.length];
}

// ---------- Preparar para viajar: con wifi deja todo listo para usar sin conexión ----------
let prep = null;
const PREP_PASOS = [['app', '📱 App sin conexión'], ['fotos', '📷 Fotos'], ['mapas', '🗺️ Mapas de las ciudades'], ['tiempo', '🌤️ Tiempo'], ['cambio', '💱 Cambio ₩/€'], ['copia', '💾 Copia de seguridad']];
function prepCard() {
  const r = prep || load('corea.prep', null), activo = prep && !prep.fin;
  return `<div class="card prep" id="prep"><div class="big">🧳 Preparar para viajar</div>
    ${r ? `<ul class="prep-l">${PREP_PASOS.map(([k, t]) => `<li><span>${t}</span><span>${r[k] || ''}</span></li>`).join('')}</ul>
    ${r.fin ? `<div class="muted">${r.fecha ? `Hecho el ${esc(r.fecha)}. ` : ''}Prueba ahora en modo avión: cierra la app y vuelve a abrirla.</div>` : ''}` : ''}
    <button data-act="preparar" ${activo ? 'disabled' : ''}>${activo ? '⏳ Preparando…' : r ? '🔄 Volver a preparar' : '⬇️ Preparar ahora'}</button></div>`;
}
async function prepararViaje() {
  if (prep && !prep.fin) return;
  if (!navigator.onLine) return alert('Conéctate a una wifi para preparar el viaje.');
  prep = { app: '⏳', fotos: '⏳', mapas: '⏳', tiempo: '⏳', cambio: '⏳', copia: '⏳', fin: false };
  const pinta = () => { const e = document.getElementById('prep'); if (e) e.outerHTML = prepCard(); };
  pinta();
  // 1. Archivos de la app en la caché del service worker (la lista sale de sw.js).
  try {
    const ks = window.caches ? await caches.keys() : [], k = ks.find(x => x === 'corea-' + VERSION) || ks.find(x => /^corea-v/.test(x));
    if (!k) prep.app = '⚠️ Este navegador no la guarda: ábrela desde el icono instalado';
    else {
      const c = await caches.open(k), sw = await (await fetch('sw.js', { cache: 'no-store' })).text();
      const fs = [...new Set([...sw.matchAll(/'(\.\/[^']*)'/g)].map(m => m[1]))];
      let ok = 0;
      for (const f of fs) {
        if (await c.match(f, { ignoreSearch: true })) { ok++; continue; }
        try { await c.add(new Request(f, { cache: 'reload' })); ok++; } catch {}
      }
      prep.app = ok === fs.length ? `✓ ${ok} archivos` : `⚠️ ${ok} de ${fs.length}: repite con mejor conexión`;
    }
  } catch { prep.app = '⚠️ No se pudo comprobar'; }
  pinta();
  // 2. Tiempo (se fuerza aunque sea reciente) y 3. cambio, mientras bajan las fotos.
  const tiempo = (async () => {
    if (TIEMPO) TIEMPO.ts = 0;
    await actualizarTiempo();
    const ds = arr(trip.dias), con = ds.filter(d => tiempoDe(ck(d.ciudad), d.fecha)), ult = con.map(d => d.fecha).sort().pop();
    prep.tiempo = con.length ? `${con.length === ds.length ? '✓' : '◐'} ${con.length} de ${ds.length} días (hasta el ${fmtCorto(ult)})` : '⚠️ Sin previsión (llega hasta 16 días antes)';
    pinta();
  })();
  const camb = (async () => {
    const U = u();
    if (U.cambioManual) prep.cambio = `✓ Manual: 1 € = ${won(cambio())}`;
    else prep.cambio = (await actualizarCambio('silencio')) ? `✓ 1 € = ${won(cambio())} (${esc(U.cambioFecha)})` : cambio() ? `◐ Guardado: 1 € = ${won(cambio())}` : '⚠️ No se pudo bajar';
    pinta();
  })();
  const [n, t] = await descargarFotos((h, tot) => { prep.fotos = `⏳ ${h} de ${tot}`; pinta(); });
  prep.fotos = n >= t * 0.9 ? `✓ ${n} de ${t}` : `◐ ${n} de ${t} (algunos sitios no tienen foto)`;
  pinta();
  const [mo, mt] = await descargarMapas((h, tot) => { prep.mapas = `⏳ ${h} de ${tot}`; pinta(); });
  prep.mapas = mo >= mt * 0.98 ? `✓ ${mo} trozos` : `◐ ${mo} de ${mt}: repite con mejor conexión`;
  await Promise.all([tiempo, camb]);
  const c = localStorage.getItem('corea.ultimaCopia');
  prep.copia = c ? `✓ Última: ${esc(c)}` : '⚠️ Haz "Exportar copia" (arriba)';
  prep.fin = true; prep.fecha = new Date().toLocaleString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  try { save('corea.prep', prep); } catch {}
  pinta(); pintarFotos();
}

// ---------- 🆘 Ayuda: hotel de esta noche y teléfonos, en grande ----------
// Embajada: web de la Embajada (exteriores.gob.es/Embajadas/seul). La lista del Ministerio da otro móvil de urgencia: VERIFICAR.
const EMBAJADA = { tel: '+82 2-794-3581', urg: '+82 10-3793-5706', dir: '17 Hannam-daero 36-gil, Yongsan-gu, Seúl' };
const telLink = (n, txt, cls = '') => `<a class="btn ay-tel ${cls}" href="tel:${n.replace(/[^\d+]/g, '')}">${txt}</a>`;
function abrirAyuda() {
  const ds = arr(trip.dias).map(d => d.fecha).filter(Boolean).sort(), n = new Date();
  let f = todayISO(); if (n.getHours() < 6) f = sumaDia(f, -1); // de madrugada, aún es "la noche de ayer"
  const enViaje = ds.length && f >= ds[0] && f <= ds[ds.length - 1];
  if (!enViaje) { const sel = arr(trip.dias).slice().sort((a, b) => String(a.fecha).localeCompare(String(b.fecha)))[dayIdx || 0]; f = (sel && sel.fecha) || ds[0] || f; }
  // Antes del viaje o en noche de vuelo: el siguiente hotel del viaje.
  let a = alojDe(f).noche;
  if (!a && !enViaje) for (let i = 1; i < 4 && !a; i++) { const g = sumaDia(f, i); a = alojDe(g).noche; if (a) f = g; }
  const s = trip.seguro || {}, as = s.asistencia || {};
  // Sin nombre en hangul: la dirección en grande con "lléveme a esta dirección".
  const hotel = a ? `${a.ko ? `<div class="enorme">${esc(fraseTaxi(a.ko))}</div>${pronHTML(fraseTaxi(a.ko))}${a.direccion_ko ? `<div class="dir">${esc(a.direccion_ko)}</div>` : ''}`
      : a.direccion_ko ? `<div class="enorme">${esc(a.direccion_ko)}</div><div class="dir">이 주소로 가 주세요</div>` : '<div class="falta">falta hangul del hotel</div>'}
      <div class="es"><b>${esc(a.nombre)}</b>${a.direccion_en ? '<br>' + esc(a.direccion_en) : ''} ${ver(a)}</div>
      <div class="row ay-row">${naver(a)}${a.direccion_ko || a.ko ? `<button class="sec mini" data-copy="${esc(a.direccion_ko || a.ko)}">📋 Copiar</button>` : ''}</div>`
    : '<div class="es">Esta noche no hay alojamiento en el viaje (vuelo o traslado).</div>';
  full(`<div class="ayuda">
    <div class="ay-sec">🏨 ${enViaje ? 'Hotel de esta noche' : 'Hotel del ' + fmtCorto(f)}</div>${hotel}
    <div class="ay-sec">🚨 Urgencias en Corea (gratis)</div>
    <div class="ay-tels">${telLink('112', '🚓 112 · Policía')}${telLink('119', '🚑 119 · Ambulancia y bomberos')}</div>
    <div class="ay-tels">${telLink('1330', 'ℹ️ 1330 · Turismo (24 h, en inglés)')}</div>
    <div class="es">1330 con móvil extranjero: 02-1330 (prefijo de Seúl + 1330).</div>
    ${as.telefono ? `<div class="ay-sec">🛡️ Seguro${s.producto ? ' · ' + esc(s.producto) : ''}</div>
      <div class="ay-tels">${telLink(String(as.telefono), '📞 ' + esc(as.telefono))}</div>${s.poliza ? `<div class="es">Póliza: <b>${esc(s.poliza)}</b></div>` : ''}${as.nota ? `<div class="es">${esc(as.nota)}</div>` : ''}` : ''}
    <div class="ay-sec">🇪🇸 Embajada de España en Seúl</div>
    <div class="ay-tels">${telLink(EMBAJADA.urg, '🆘 Urgencia consular ' + EMBAJADA.urg)}${telLink(EMBAJADA.tel, '🏛️ Oficina ' + EMBAJADA.tel, 'sec')}</div>
    <div class="es">${EMBAJADA.dir}<br>Urgencia consular solo para emergencias graves (detención, accidente, pérdida del pasaporte). <span class="ver">VERIFICAR</span> el móvil de urgencia: la lista del Ministerio da otro número.</div>
  </div>`);
}

// Sección de la Lonely Planet: cabecera propia y una tarjeta por recomendación.
// Ciudades: 5 botones; al tocar uno se despliega su ficha debajo. Por defecto, la ciudad del día.
// Qué ver (antes Explorar y Ciudades): por ciudad, Puntos de interés y Planes. El mapa de cada ciudad va en la pestaña Mapas.
let ciudadSel = null, historiaAbierta = false, exSub = 'puntos';
const EX_SUBS = [['puntos', '📍 Puntos de interés'], ['comer', '🍜 Comer'], ['planes', '🧩 Miscelánea']];
// Mapas: el mapa de cada ciudad (itinerario, más sitios, Comer, Planes y hotel). Al tocar un icono, su ficha enlaza con Qué ver o Comer.
function viewMapas() {
  const botones = botonesCiudad(); if (!botones) return '<p class="muted">No hay ciudades (clave "ciudades").</p>';
  return `<h2>🗺️ Mapas</h2>${botones}<div class="mapas-ciudad" style="${varsTema(ciudadSel)}">${mapaCiudadHTML(ciudadSel)}</div>`;
}
function viewCiudades() {
  if (!EX_SUBS.some(([x]) => x === exSub)) exSub = 'puntos';
  const uniq = ciudadesUnicas();
  if (!uniq.length) return '<p class="muted">No hay ciudades (clave "ciudades").</p>';
  const botones = botonesCiudad();
  const i = uniq.findIndex(c => ck(c.nombre) === ciudadSel), c = uniq[i], k = ciudadSel, t = tema(k);
  const fechas = arr(trip.ciudades).filter(o => ck(o.nombre) === k).map(o => `${fmtCorto(o.desde)} → ${fmtCorto(o.hasta)}`).join(' · ');
  const h = typeof HISTORIA !== 'undefined' && HISTORIA[k];
  return buscadorHTML('qcs', qCiu, 'Buscar sitio en todas las ciudades', resCiudades(qCiu)) + botones + `<div class="card ciudad" id="c-${esc(c.id)}" style="${varsTema(k)}">
    <div class="ciudad-hero">
      <div class="ciudad-ko">${esc(c.ko || '')}</div>
      <div class="ciudad-top"><span class="ciudad-ic">${t.ic}</span></div>
      <div class="ciudad-num">${i + 1}</div>
      <div class="ciudad-nom">${esc(nombreCiudad(k))}</div>
      ${(() => { const pob = typeof POBLACION !== 'undefined' && POBLACION[k], pr = c.ko ? pronuncia(c.ko) : '';
        return pob || pr ? `<div class="ciudad-pob">${c.ko ? `${esc(c.ko)} ${pr ? `🗣️ «${esc(pr)}»` : ''} ${btnHabla(c.ko)}` : ''}${pob ? ` · 👥 ${esc(pob)}` : ''}</div>` : ''; })()}
      ${t.lema ? `<div class="ciudad-lema">${esc(t.lema)}</div>` : ''}
      <div class="ciudad-fechas">${fechas}</div>${linkHist(k)}
    </div>
    <div class="row daynav exsubs">${EX_SUBS.filter(([x]) => x !== 'historia' || h).map(([x, tt]) => `<button class="${x === exSub ? '' : 'sec'}" data-exs="${x}">${tt}</button>`).join('')}</div>
    ${exSub === 'comer' ? '' : muchoOjo(k, 'planes')}${exSub === 'puntos' ? rutasLP24(k) : ''}
    ${exSub === 'planes' ? planesDe(k) : ''}${exSub === 'comer' ? (comerCiudad = k, viewComer(true)) : ''}
    ${exSub !== 'puntos' ? '</div>' : ''}${exSub === 'puntos' ? `
    ${typeof INTRO_LP !== 'undefined' && INTRO_LP[k] ? `<div class="intro-lp"><span class="lp-logo mini">LP</span><div><p>${esc(INTRO_LP[k].txt)}</p>
      ${INTRO_LP[k].plan ? `<details data-key="lp:${k}" ${abierto("lp:" + k, false) ? "open" : ""}><summary>La Lonely propone</summary><ul>${INTRO_LP[k].plan.map(x => `<li>${resaltar(x)}</li>`).join('')}</ul></details>` : ''}</div></div>` : ''}
    ${qvPuntos(k, c)}</div>` : ''}`;
}


// ---------- Mapa interactivo de ciudad y de la ruta del día ----------
// Los puntos son nuestros y funcionan sin conexión. Con conexión, detrás se ven las calles de OpenStreetMap;
// el service worker guarda las zonas que ya has visto para el modo avión.
const MP = {}; // estado por mapa: { z, c: [lat, lon], pts, linea, fit }
const MPT = 256, MPZ = [11, 18];
const mpX = (lon, z) => (lon + 180) / 360 * MPT * 2 ** z;
const mpY = (lat, z) => { const s = Math.sin(lat * Math.PI / 180); return (0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI)) * MPT * 2 ** z; };
const mpLon = (x, z) => x / (MPT * 2 ** z) * 360 - 180;
const mpLat = (y, z) => 180 / Math.PI * Math.atan(Math.sinh(Math.PI - 2 * Math.PI * y / (MPT * 2 ** z)));
const MP_CAPAS = [['itin', 'Itinerario', '#cd2e3a'], ['sitios', '🏯 Puntos de interés', '#1f4e8c'], ['comer', 'Comer', '#d97706'], ['planes', 'Miscelánea', '#7c3aed']];
let mpCapas = new Set(['itin', 'sitios', 'comer', 'planes']), mapaCiudad = false, mpCapasDia = new Set();
const mapaDia = new Set();
const recorta = (t, n) => { t = String(t || ''); return t.length > n ? t.slice(0, n - 1) + '…' : t; };

// Registra un mapa (puntos y línea) y devuelve su HTML; se dibuja después de render().
function mapaHTML(id, pts, { linea = null, fit = null, hotel = null, capas = '', mini = false } = {}) {
  const prev = MP[id];
  MP[id] = { ...(prev || {}), pts, linea, hotel, fit: fit || pts.map(p => p.c), k: id.startsWith('c:') ? id.slice(2) : ck((arr(trip.dias).find(x => x.fecha === id.replace(/^d[m]?:/, '')) || {}).ciudad || '') };
  if (prev && prev.pts && prev.pts.length !== pts.length) MP[id].sel = null; // cambiaron las capas: se cierra la ficha
  if (!pts.length) return '<div class="muted">No hay sitios con ubicación para el mapa.</div>';
  if (mini) return `<div class="mapa mini" data-mapa="${esc(id)}"><div class="mp-vista"><div class="mp-capa"></div></div></div>`;
  return `${capas}<div class="mapa" data-mapa="${esc(id)}">
    <div class="mp-vista"><div class="mp-capa"></div></div>
    <div class="mp-bot"><button data-mpz="1" aria-label="Acercar">+</button><button data-mpz="-1" aria-label="Alejar">−</button><button data-mpfit aria-label="Ver todo">⤢</button><button data-mpyo aria-label="Dónde estoy">📍</button></div>
    <div class="mp-attr">© OpenStreetMap</div>
    <div class="mp-info"></div></div><p class="muted mp-pista">✋ ¿Un icono fuera de su calle? Mantenlo pulsado y arrástralo a su sitio.</p>`;
}
function mpEncajar(m, W, H) {
  const cs = m.fit.length ? m.fit : m.pts.map(p => p.c);
  const la = cs.map(c => c[0]), lo = cs.map(c => c[1]);
  const [a, b, c, d] = [Math.min(...la), Math.max(...la), Math.min(...lo), Math.max(...lo)];
  m.c = [(a + b) / 2, (c + d) / 2]; m.z = 16;
  const mg = H < 200 ? 14 : 60;
  while (m.z > MPZ[0] && (mpX(d, m.z) - mpX(c, m.z) > W - mg || mpY(a, m.z) - mpY(b, m.z) > H - mg - 10)) m.z--;
}
function pintarMapas() {
  document.querySelectorAll('.mapa[data-mapa]').forEach(el => {
    const m = MP[el.dataset.mapa]; if (!m || !m.pts.length) return;
    const W = el.clientWidth, H = el.clientHeight; if (!W) return;
    // Al abrir: todo el itinerario a la vista; si queda muy alejado (ciudad grande), centrado en el hotel.
    // En el banner, el recorrido va arriba y deja libre la franja del texto.
    if (m.z == null && el.classList.contains('mini')) { mpEncajar(m, W, H - 52); m.c = [mpLat(mpY(m.c[0], m.z) + 26, m.z), m.c[1]]; }
    if (m.z == null) { mpEncajar(m, W, H); if (m.z < 14 && m.hotel && el.dataset.mapa.startsWith('c:')) { m.z = 14; m.c = m.hotel; } }
    mpDibujar(el, m);
    if (!el._mp && !el.classList.contains('mini')) { el._mp = 1; mpGestos(el, m); }
  });
}
function mpDibujar(el, m) {
  const W = el.clientWidth, H = el.clientHeight, z = m.z, n = 2 ** z;
  const ox = mpX(m.c[1], z) - W / 2, oy = mpY(m.c[0], z) - H / 2;
  const P = c => [mpX(c[1], z) - ox, mpY(c[0], z) - oy];
  let h = '';
  // Teselas con margen de una para que al arrastrar no se vea vacío.
  for (let tx = Math.floor(ox / MPT) - 1; tx <= Math.floor((ox + W) / MPT) + 1; tx++)
    for (let ty = Math.floor(oy / MPT) - 1; ty <= Math.floor((oy + H) / MPT) + 1; ty++) {
      if (ty < 0 || ty >= n) continue;
      h += `<img class="mp-t" alt="" draggable="false" src="https://tile.openstreetmap.org/${z}/${((tx % n) + n) % n}/${ty}.png" style="left:${tx * MPT - ox}px;top:${ty * MPT - oy}px" onerror="this.remove()">`;
    }
  if (m.linea && m.linea.length > 1) h += `<svg class="mp-linea" width="${W}" height="${H}"><polyline points="${m.linea.map(c => P(c).map(v => v.toFixed(1)).join(',')).join(' ')}"/></svg>`;
  // Primero los de detrás (Comer, Planes, más sitios), encima itinerario y hotel.
  const orden = { comer: 0, planes: 1, sitios: 2, sug: 3, itin: 4, hotel: 5 };
  // Marcadores que se pisan: se separan empujando cada pareja que choca (menos de 28 px) hasta que ninguno tape a otro,
  // con un muelle suave hacia su sitio; los importantes (hotel, itinerario) se mueven menos. Un hilo y un puntito marcan el sitio real.
  const vis = m.pts.map((p, i) => { const [x, y] = P(p.c); return { p, i, x, y, x0: x, y0: y, w: orden[p.capa] >= 4 ? 0.25 : 1 }; })
    .filter(o => o.x > -40 && o.y > -40 && o.x < W + 40 && o.y < H + 40);
  const D = 28;
  for (let it = 0; it < 60; it++) {
    let mov = false;
    for (let a = 0; a < vis.length; a++) for (let c = a + 1; c < vis.length; c++) {
      const A = vis[a], B = vis[c]; let dx = B.x - A.x, dy = B.y - A.y, d = Math.hypot(dx, dy);
      if (d >= D) continue; mov = true;
      if (d < 0.01) { const ang = (c * 2.39996) % (2 * Math.PI); dx = Math.cos(ang); dy = Math.sin(ang); d = 1; }
      const f = (D - d) / d, t = A.w + B.w; A.x -= dx * f * A.w / t; A.y -= dy * f * A.w / t; B.x += dx * f * B.w / t; B.y += dy * f * B.w / t;
    }
    vis.forEach(o => { o.x += (o.x0 - o.x) * 0.02; o.y += (o.y0 - o.y) * 0.02; });
    if (!mov) break;
  }
  const hilos = vis.filter(o => Math.hypot(o.x - o.x0, o.y - o.y0) > 6);
  if (hilos.length) h += `<svg class="mp-hilo" width="${W}" height="${H}">${hilos.map(o => `<line x1="${o.x0.toFixed(1)}" y1="${o.y0.toFixed(1)}" x2="${o.x.toFixed(1)}" y2="${o.y.toFixed(1)}"/>`).join('')}</svg>`
    + [...new Set(hilos.map(o => o.x0.toFixed(0) + ',' + o.y0.toFixed(0)))].map(k => { const [x, y] = k.split(','); return `<span class="mp-ancla" style="left:${x}px;top:${y}px"></span>`; }).join('');
  vis.sort((a, b) => orden[a.p.capa] - orden[b.p.capa]).forEach(({ p, i, x, y }) => {
    h += `<button class="mp-pt c-${p.capa} ${p.hecho ? 'hecho' : p.pasado ? 'pasado' : ''} ${m.sel === i ? 'sel' : ''}" data-mpp="${i}" style="left:${x.toFixed(1)}px;top:${y.toFixed(1)}px">${p.num != null ? `<b>${esc(p.num)}</b>` : p.ic}</button>`;
  });
  if (m.yo) { const [x, y] = P(m.yo); h += `<span class="mp-yo" style="left:${x}px;top:${y}px"></span>`; }
  const capa = el.querySelector('.mp-capa'); capa.style.transform = ''; capa.innerHTML = h;
  const inf = el.querySelector('.mp-info'), p = m.pts[m.sel];
  if (inf) { inf.innerHTML = p ? mpFicha(p, m) : ''; inf.classList.toggle('on', !!p); }
}
// En la ficha del mapa los botones van solo con su icono (el texto queda como etiqueta accesible).
const soloIco = h => h.replace(/(<(a|button)\b[^>]*)>\s*(\S+)\s+([^<]+)<\/\2>/g, (m0, ab, tag, ic, t) => `${ab} title="${esc(t.trim())}" aria-label="${esc(t.trim())}">${ic}</${tag}>`);
function mpFicha(p, m) {
  // Sin repetir en la línea gris lo que ya dice el nombre («bar · cócteles» en «Jinhanbam (bar de cócteles…)»).
  const sub = String(p.sub || '').split(' · ').filter(x => x && !norm(p.es).includes(norm(x))).join(' · ');
  return soloIco(`<div class="mp-f"><div class="mp-f-t"><b>${p.ic} ${esc(p.es)}${p.ko ? ` <span class="mp-ko">• ${esc(p.ko)}</span>` : ''}</b>${p.l ? lpPill(p.l) : ''}<button class="sec mini" data-mpcerrar>✕</button></div>
    ${p.capa === 'sug' ? `<div class="sug-encaje">📍 ${esc(p.sub)}</div>${p.txt ? `<div class="muted">${esc(recorta(p.txt, 120))}</div>` : ''}` : `<div class="muted">${esc(sub)}${sub && p.txt ? ' · ' : ''}${p.txt ? esc(recorta(p.txt, 150)) : ''}</div>`}
    ${(() => { if (['itin', 'hotel', 'sug'].includes(p.capa)) return ''; const ps = m.pts.filter(x => x.capa === 'itin' && x.num != null); if (!ps.length || m.pts.some(x => x.capa === 'itin' && x.num == null)) return '';
      const [q, dk] = ps.map(x => [x, km(x.c, p.c)]).sort((a, b) => a[1] - b[1])[0]; return `<div class="mp-parada">📍 A ${fmtDist(dk)} de la parada ${q.num} (${esc(q.es)})</div>`; })()}
    ${m.hotel && !['hotel', 'sug'].includes(p.capa) ? tramo(m.hotel, p.c, 'Hotel', p.ko || p.es, { prefijo: 'Desde el hotel: ', sinPasos: true }) : ''}
    <div class="acciones">${mpEnlace(p, m)}${p.add ? `<button class="mini" data-agtog="${esc(p.add)}">＋ Añadir a este día</button>` : ''}${naver(p.l || p)}${p.l && p.capa !== 'hotel' ? btnGpsDel(p.l) + btnGps(p.l) : ''}</div></div>`);
}
// 📍 Estoy aquí: guarda la posición GPS actual como la buena de ese sitio (para corregir coordenadas aproximadas allí mismo).
const btnGpsDel = l => user && user.coordsFix && user.coordsFix[hKey(l)] ? `<button class="mini sec" data-gpsdel="${esc(hKey(l))}">↩️ Ubicación original</button>` : '';
const btnGps = l => `<button class="mini sec" data-gps="${esc(hKey(l))}" data-gpsn="${esc(l.es || l.nombre || '')}">${user && user.coordsFix && user.coordsFix[hKey(l)] ? '✅ Ubicación corregida' : '📌 Estoy aquí'}</button>`;
// Botón de la ficha del mapa que lleva a la sección de la app donde está ese sitio.
function mpEnlace(p, m) {
  const k = ck((p.l && p.l.ciudad) || '') || m.k || '';
  if (p.capa === 'hotel') return `<button class="mini" data-irhotel>🛏️ Ver el hotel</button>`;
  if (p.capa === 'comer') return `<button class="mini" data-ircomer="${esc(k)}" data-q="${esc(p.es)}">🍜 Ver en Comer</button>`;
  if (p.capa === 'planes') return `<button class="mini" data-irplan="${esc(k)}" data-cat="${esc((p.l && p.l.cat) || '')}">🧩 Ver en Miscelánea</button>`;
  return k ? (p.l && enQueVer(p.l, k) ? `<button class="mini" data-irqv="${esc(k)}" data-h="${esc(hKey(p.l))}">🏯 Ver en Planes</button>` : `<button class="mini" data-bcity="${esc(k)}" data-bq="${esc(p.es)}">🏯 Ver en Planes</button>`) : '';
}
function mpGestos(el, m) {
  const v = el.querySelector('.mp-vista'), capa = () => el.querySelector('.mp-capa');
  const ps = new Map(); let ini = null, movido = false, pinch = null, arr0 = null, larga = 0;
  // ✋ Mantener pulsado un icono (½ s) y arrastrarlo: se guarda donde se suelte como su ubicación buena (user.coordsFix).
  const arrastrable = b => { const p = b && m.pts[Number(b.dataset.mpp)]; return p && p.l && p.capa !== 'hotel' ? p : null; };
  const mover = (dx, dy, s = 1) => { capa().style.transform = `translate(${dx}px,${dy}px) scale(${s})`; };
  v.addEventListener('pointerdown', e => {
    v.setPointerCapture(e.pointerId); ps.set(e.pointerId, [e.clientX, e.clientY]);
    if (ps.size === 1) { ini = [e.clientX, e.clientY]; movido = false; pinch = null; arr0 = null; clearTimeout(larga);
      const b = !el.classList.contains('mini') && e.target.closest('.mp-pt');
      if (arrastrable(b)) larga = setTimeout(() => { if (movido || !ini) return; arr0 = { b, x: parseFloat(b.style.left), y: parseFloat(b.style.top) }; b.classList.add('arrastra'); try { navigator.vibrate && navigator.vibrate(30); } catch {} }, 500); }
    if (ps.size === 2) clearTimeout(larga);
    if (ps.size === 2) { const [a, b] = [...ps.values()]; pinch = { d: Math.hypot(a[0] - b[0], a[1] - b[1]), s: 1 }; movido = true; }
  });
  v.addEventListener('pointermove', e => {
    if (!ps.has(e.pointerId)) return; ps.set(e.pointerId, [e.clientX, e.clientY]);
    if (pinch && ps.size === 2) { const [a, b] = [...ps.values()]; pinch.s = Math.hypot(a[0] - b[0], a[1] - b[1]) / pinch.d; capa().style.transformOrigin = `${el.clientWidth / 2}px ${el.clientHeight / 2}px`; mover(0, 0, pinch.s); return; }
    if (!ini || pinch) return;
    const dx = e.clientX - ini[0], dy = e.clientY - ini[1];
    if (arr0) { arr0.b.style.left = arr0.x + dx + 'px'; arr0.b.style.top = arr0.y + dy + 'px'; return; }
    if (Math.hypot(dx, dy) > 6) movido = true;
    if (movido) mover(dx, dy);
  });
  const fin = e => {
    if (!ps.has(e.pointerId)) return; ps.delete(e.pointerId);
    if (pinch) { if (!ps.size) { const dz = Math.round(Math.log2(pinch.s)); mpZoom(el, m, dz); pinch = null; ini = null; } return; }
    if (!ini) return; clearTimeout(larga);
    const dx = e.clientX - ini[0], dy = e.clientY - ini[1]; ini = null;
    if (arr0) { const { b, x, y } = arr0, p = arrastrable(b); arr0 = null; b.classList.remove('arrastra');
      if (p && Math.hypot(dx, dy) > 4) {
        const W = el.clientWidth, H = el.clientHeight, ox = mpX(m.c[1], m.z) - W / 2, oy = mpY(m.c[0], m.z) - H / 2;
        const c = [+mpLat(oy + y + dy, m.z).toFixed(5), +mpLon(ox + x + dx, m.z).toFixed(5)], nom = p.es || p.l.es || p.l.nombre || 'este sitio';
        if (confirm(`¿Poner «${nom}» aquí?\nSe guarda en este móvil y va con «Pasar mis marcas».`)) {
          const U = u(), h = hKey(p.l); U.coordsFix = U.coordsFix || {}; U.coordsFix[h] = c; saveUser();
          Object.values(MP).forEach(mm => (mm.pts || []).forEach(q => { if (q.l && hKey(q.l) === h) q.c = c; }));
        }
      }
      mpDibujar(el, m); return; }
    if (movido) { m.c = [mpLat(mpY(m.c[0], m.z) - dy, m.z), mpLon(mpX(m.c[1], m.z) - dx, m.z)]; mpDibujar(el, m); return; }
    const t = document.elementFromPoint(e.clientX, e.clientY), b = t && t.closest('.mp-pt');
    m.sel = b ? Number(b.dataset.mpp) : null; mpDibujar(el, m);
  };
  v.addEventListener('pointerup', fin); v.addEventListener('pointercancel', fin);
  v.addEventListener('dblclick', () => mpZoom(el, m, 1));
}
function mpZoom(el, m, dz) { m.z = Math.min(MPZ[1], Math.max(MPZ[0], m.z + dz)); mpDibujar(el, m); }
function mpYo(el, m) {
  if (!navigator.geolocation) return alert('Este móvil no da la ubicación.');
  navigator.geolocation.getCurrentPosition(pos => {
    m.yo = [pos.coords.latitude, pos.coords.longitude];
    const lejos = Math.min(...m.pts.map(p => km(p.c, m.yo)));
    if (lejos > 30) { mpDibujar(el, m); return alert(`Estás a ${fmtDist(lejos)} de esta zona.`); }
    m.c = m.yo; if (m.z < 15) m.z = 15; mpDibujar(el, m);
  }, () => alert('No se pudo saber dónde estás (activa la ubicación).'), { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 });
}

// Puntos de una ciudad: itinerario (con el día), más sitios, Comer y Planes.
// Todos los puntos de una ciudad (todas las capas).
function puntosCiudad(k) {
  const hot = hotelDe(k), D = typeof DIA_LP !== 'undefined' ? DIA_LP : {};
  const dias = arr(trip.dias).filter(d => d.fecha && ck(d.ciudad) === k), enDia = new Map();
  dias.forEach(d => listaDia(d).forEach(l => { const h = hKey(l); if (!enDia.has(h)) enDia.set(h, d.fecha); }));
  const todos = [], cuenta = {};
  const add = (capa, l, extra) => { const c = coordsLugar(l); if (!c) return; cuenta[capa] = (cuenta[capa] || 0) + 1; todos.push({ capa, c, l, es: l.es || l.nombre, ko: l.ko, ...extra }); };
  sitiosCiudadObj(k).forEach(l => {
    const h = hKey(l), f = enDia.get(h), txt = D[h.slice(2)] || D[h] || l.desc || l.nota || '';
    if (f) add('itin', l, { num: new Date(f + 'T12:00').getDate(), pasado: f < todayISO(), ic: icSitio(l.es), sub: `Día ${fmtCorto(f)}`, txt, lp: l.lp || l.top, hecho: hecho(l, k) });
    else add('sitios', l, { ic: '🏯', sub: `${icSitio((l.tipo || '') + ' ' + l.es)} ${l.tipo || 'Punto de interés'}`, txt, lp: !!(LP[k] || []).find(x => hKey(x) === h), hecho: hecho(l, k) });
  });
  lugaresComer().filter(c => c.ciudad === k && !['descartado', 'cerrado'].includes(estadoDe(String(c.id)).estado)).forEach(c =>
    add('comer', c, { es: c.nombre, ic: IC_COMER[c.tipo] || '🍴', sub: [c.plato, c.precio].filter(Boolean).join(' · '), txt: c.nota, lp: c.fuente === 'lonely', lp24: esLP24(c), hecho: hecho(c, k) }));
  (typeof PLANES !== 'undefined' ? PLANES : []).filter(p => p.ciudad === k).forEach(p => add('planes', p, { ic: icPlan(p), sub: p.direccion_en || '', txt: p.desc, hecho: hecho(p, k) }));
  if (hot) todos.push({ capa: 'hotel', c: hot, es: (arr(trip.alojamientos).find(a => ck(a.ciudad) === k) || {}).nombre || 'Hotel', ic: '🛏️', sub: 'Vuestro hotel' });
  return { hot, todos, cuenta };
}
function mapaCiudadHTML(k) {
  const { hot, cuenta } = puntosCiudad(k), todos = puntosCiudad(k).todos.filter(p => p.capa === 'hotel' || mpCapas.has(p.capa));
  const capas = `<div class="mp-capas">${MP_CAPAS.filter(([c]) => cuenta[c]).map(([c, t, col]) => `<button class="chip ${mpCapas.has(c) ? 'on' : ''}" data-mpcapa="${c}" style="--mc:${col}"><i></i>${t} <small>${cuenta[c]}</small></button>`).join('')}</div>`;
  const nucleo = todos.filter(p => p.capa === 'itin' || p.capa === 'hotel').map(p => p.c);
  return `<div class="mp-caja">${mapaHTML('c:' + k, todos, { hotel: hot, capas, fit: nucleo.length > 1 ? nucleo : null })}</div>`;
}
// Teselas para usar el mapa sin conexión: cada ciudad a zoom 12-13, el itinerario a 14 y detalle (15-16)
// alrededor de vuestros sitios. Nunca más de zoom 16 (la política de OpenStreetMap prohíbe guardar zonas grandes a 17 o más).
function teselasViaje() {
  const T = new Set();
  const caja = (cs, z) => { if (!cs.length) return; const xs = cs.map(c => mpX(c[1], z) / MPT), ys = cs.map(c => mpY(c[0], z) / MPT);
    for (let x = Math.floor(Math.min(...xs)); x <= Math.floor(Math.max(...xs)); x++) for (let y = Math.floor(Math.min(...ys)); y <= Math.floor(Math.max(...ys)); y++) T.add(`${z}/${x}/${y}`); };
  const cerca = (c, z, m) => { const r = m / (156543.03 * Math.cos(c[0] * Math.PI / 180) / 2 ** z); const x = mpX(c[1], z), y = mpY(c[0], z);
    for (let tx = Math.floor((x - r) / MPT); tx <= Math.floor((x + r) / MPT); tx++) for (let ty = Math.floor((y - r) / MPT); ty <= Math.floor((y + r) / MPT); ty++) T.add(`${z}/${tx}/${ty}`); };
  [...new Set(arr(trip.dias).map(d => ck(d.ciudad)))].forEach(k => {
    const { todos } = puntosCiudad(k); if (!todos.length) return;
    const nuc = todos.filter(p => p.capa === 'itin' || p.capa === 'hotel');
    caja(nuc.map(p => p.c), 12); caja(nuc.map(p => p.c), 13);
    todos.forEach(p => { const imp = p.capa === 'itin' || p.capa === 'hotel'; cerca(p.c, 12, 0); cerca(p.c, 14, imp ? 1500 : 600); cerca(p.c, 15, imp ? 800 : 300); cerca(p.c, 16, imp ? 450 : 120); });
  });
  return [...T];
}
async function descargarMapas(prog) {
  if (!window.caches) return [0, 0];
  const ts = teselasViaje(), c = await caches.open('corea-mapa'); let ok = 0, i = 0, hechas = 0;
  const una = async t => {
    const url = `https://tile.openstreetmap.org/${t}.png`;
    try {
      if (await c.match(url)) ok++;
      else { let r; try { r = await fetch(url, { mode: 'cors', credentials: 'omit' }); } catch { r = await fetch(url, { mode: 'no-cors' }); }
        if (r.ok || r.type === 'opaque') { await c.put(url, r); ok++; } }
    } catch { /* sin conexión */ }
    hechas++; if (prog) prog(hechas, ts.length);
  };
  // De 2 en 2 para no cargar el servidor de OpenStreetMap.
  await Promise.all([0, 1].map(async () => { while (i < ts.length) await una(ts[i++]); }));
  return [ok, ts.length];
}
// Ruta del día: hotel y sitios numerados en orden de visita, unidos por una línea.
// Banner encima de la Ruta del día: vista previa del recorrido; al tocarlo se abre el mapa grande.
function bannerMapaDia(d, hot, orden) {
  const abierto = mapaDia.has(d.fecha);
  if (abierto) return `<div class="mp-dia-cab"><b>🗺️ Recorrido en el mapa</b><button class="sec mini" data-mpdia="${d.fecha}">✕ Cerrar</button></div>${mapaDiaHTML(d, hot, orden)}`;
  const cs = [...(hot ? [hot] : []), ...orden.map(coordsLugar).filter(Boolean)], n = orden.filter(coordsLugar).length;
  const total = cs.reduce((s, c, i) => s + (i ? km(cs[i - 1], c) : 0), 0);
  return `<button class="mp-banner" data-mpdia="${d.fecha}">${mapaDiaHTML(d, hot, orden, true)}
    <span class="mp-banner-tx"><b>🗺️ Ver el recorrido en el mapa</b><small>${n} ${n === 1 ? 'parada' : 'paradas'}${hot ? ' desde el hotel' : ''}${total ? ` · ${fmtDist(total)} en línea recta` : ''}</small></span></button>`;
}
function mapaDiaHTML(d, hot, orden, mini = false) {
  const D = typeof DIA_LP !== 'undefined' ? DIA_LP : {}, k = ck(d.ciudad);
  const pts = [];
  if (hot) pts.push({ capa: 'hotel', c: hot, es: 'Hotel', ic: '🛏️', sub: 'Salida' });
  let n = 0; orden.forEach(l => { const c = coordsLugar(l); if (!c) return; const h = hKey(l);
    pts.push({ capa: 'itin', c, l, es: l.es, ko: l.ko, num: ++n, pasado: d.fecha < todayISO(), ic: icSitio(l.es), sub: `Parada ${n}`, txt: D[h.slice(2)] || D[h] || l.desc || l.nota || '', hecho: hecho(l, k) }); });
  const ruta = pts.map(p => p.c);
  // Lo que queda de paso y no tenéis: con asterisco y el número de la parada tras la que encaja.
  sugerenciasDe(d, orden, hot).forEach(g => pts.push({ capa: 'sug', c: g.c, l: g.l, es: g.l.es, ko: g.l.ko, num: g.etq, ic: icSitio(g.l.es), sub: textoEncaje(g),
    txt: (DIA_LP[hKey(g.l).slice(2)] || g.l.desc || g.l.nota || ''), add: hKey(g.l) + '|' + d.fecha }));
  const encuadre = pts.map(p => p.c); // recorrido + asteriscos
  if (mini) return mapaHTML('dm:' + d.fecha, pts, { linea: ruta, hotel: hot, mini, fit: encuadre });
  // Capas extra (apagadas por defecto): lo que queda a ≤1,2 km de algún punto de la ruta.
  const ya = new Set([...orden.map(hKey), ...pts.filter(p => p.capa === 'sug').map(p => hKey(p.l))]), cuenta = {};
  puntosCiudad(k).todos.filter(p => ['sitios', 'comer', 'planes'].includes(p.capa) && !(p.l && ya.has(hKey(p.l))) && ruta.some(c => km(c, p.c) <= 1.2))
    .forEach(p => { cuenta[p.capa] = (cuenta[p.capa] || 0) + 1; if (mpCapasDia.has(p.capa)) pts.push(p); });
  const capas = Object.keys(cuenta).length ? `<div class="mp-capas"><span class="muted mini-nota">Cerca de la ruta:</span>${MP_CAPAS.filter(([c]) => cuenta[c]).map(([c, t, col]) => `<button class="chip ${mpCapasDia.has(c) ? 'on' : ''}" data-mpcapad="${c}" style="--mc:${col}"><i></i>${t} <small>${cuenta[c]}</small></button>`).join('')}</div>` : '';
  return mapaHTML('d:' + d.fecha, pts, { linea: ruta, hotel: hot, capas, fit: encuadre });
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

// 🗺️ Mapa de la ruta (Ruta): pequeño, plegable e interactivo. Tocar una ciudad o una línea abre debajo su ficha
// (estancia: fechas, noches y hotel; traslado: fecha, tren o bus, horas, asientos, estado y pasos).
let rmSel = null; // 'c:<k>' o 't:<i>'
const XYR = ([lat, lon]) => [((lon - 126.05) * 92 + 12), ((38.05 - lat) * 112 + 12)];
function viewMapa() {
  const ciudades = arr(trip.ciudades), hoy = todayISO();
  const pts = [];
  ciudades.forEach((c, i) => { const k = ck(c.nombre), co = coordsDe(c.nombre); if (!co || /espa/.test(k)) return;
    const p = pts.find(p => p.k === k); if (p) p.st.push({ c, n: i + 1 }); else pts.push({ k, co, nombre: c.nombre, st: [{ c, n: i + 1 }] }); });
  if (!pts.length) return '';
  const trs = arr(trip.traslados).slice().sort((a, b) => String(a.fecha).localeCompare(String(b.fecha)))
    .map(t => ({ t, a: coordsDe(ciudadEnTexto(t.de)), b: coordsDe(ciudadEnTexto(t.a)), ka: ciudadEnTexto(t.de), kb: ciudadEnTexto(t.a) }))
    .filter(x => x.a && x.b && String(x.a) !== String(x.b));
  // Puntos de traslado que no son estancia (el aeropuerto de Incheon): nodo pequeño ✈️.
  trs.forEach(x => [[x.ka, x.a], [x.kb, x.b]].forEach(([k, co]) => { if (!pts.some(p => p.k === k || String(p.co) === String(co))) pts.push({ k, co, nombre: k === 'incheon' ? 'Aeropuerto' : k, st: [], aero: true }); }));
  const hecho = t => !!u().hecho['tras:' + (t.id || t.fecha)] || String(t.fecha) < hoy;
  const P = c => XYR(c).map(v => v.toFixed(1));
  const costa = COSTA.map(([lon, lat]) => P([lat, lon]).join(',')).join(' ');
  const dmz = DMZ.map(([lon, lat]) => P([lat, lon]).join(',')).join(' ');
  const W = 330, H = 430;
  const lineas = trs.map((x, i) => { const [x1, y1] = P(x.a), [x2, y2] = P(x.b), mx = (+x1 + +x2) / 2, my = (+y1 + +y2) / 2, cls = isPend(x.t) ? 'pend' : hecho(x.t) ? 'ya' : 'ok', on = rmSel === 't:' + i;
    return `<g class="rm-t ${cls} ${on ? 'on' : ''}" data-rms="t:${i}"><line class="rm-hit" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/><line class="rm-l" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>
      <circle class="rm-n" cx="${mx}" cy="${my}" r="9"/><text class="rm-nt" x="${mx}" y="${my + 3.5}" text-anchor="middle">${i + 1}</text></g>`; }).join('');
  const nodos = pts.map(p => { const [x, y] = P(p.co), t = tema(p.k), on = rmSel === 'c:' + p.k, izq = +x > 220, ahora = p.st.some(s => s.c.desde <= hoy && hoy <= s.c.hasta);
    if (p.aero) return `<g class="rm-c rm-aero"><circle class="rm-dot" cx="${x}" cy="${y}" r="10"/><text class="rm-ic" x="${x}" y="${+y + 4}" text-anchor="middle">✈️</text><text class="rm-nom" x="${+x + 13}" y="${+y + 18}">${esc(p.nombre)}</text></g>`;
    return `<g class="rm-c ${on ? 'on' : ''} ${ahora ? 'ahora' : ''}" data-rms="c:${p.k}" style="${varsTema(p.k)}"><circle class="rm-halo" cx="${x}" cy="${y}" r="17"/><circle class="rm-dot" cx="${x}" cy="${y}" r="13"/>
      <text class="rm-ic" x="${x}" y="${+y + 5}" text-anchor="middle">${t.ic}</text>
      <text class="rm-nom" x="${izq ? +x - 18 : +x + 18}" y="${+y + 4}" text-anchor="${izq ? 'end' : 'start'}">${esc(nombreCiudad(p.k))}</text></g>`; }).join('');
  // Ficha de lo tocado
  let ficha = '';
  if (rmSel && rmSel.startsWith('c:')) { const p = pts.find(p => 'c:' + p.k === rmSel && !p.aero);
    if (p) { const hs = arr(trip.alojamientos).filter(a => ck(a.ciudad) === p.k);
      const inn = trs.filter(x => x.kb === p.k), out = trs.filter(x => x.ka === p.k);
      ficha = `<div class="rm-ficha" style="${varsTema(p.k)}"><div class="rm-ft"><b>${tema(p.k).ic} ${esc(nombreCiudad(p.k))}</b> ${p.st[0].c.ko ? `<span class="ko-s">${esc(p.st[0].c.ko)}</span>` : ''}<button class="sec mini" data-rms="">✕</button></div>
        ${p.st.map(({ c }) => { const n = c.desde && c.hasta ? Math.round((new Date(c.hasta) - new Date(c.desde)) / 864e5) : null; return `<div>📅 ${fmtCorto(c.desde)} → ${fmtCorto(c.hasta)}${n ? ` · ${n} ${n === 1 ? 'noche' : 'noches'}` : ''}</div>`; }).join('')}
        ${hs.map(a => `<div>🛏️ ${esc(a.nombre)}${a.direccion_ko ? ` <span class="muted">· ${esc(a.direccion_ko)}</span>` : ''}</div>`).join('')}
        ${inn.map(x => `<div>⬅️ Llegada ${fmtCorto(x.t.fecha)}: ${esc(resumenTr(x.t))}</div>`).join('')}${out.map(x => `<div>➡️ Salida ${fmtCorto(x.t.fecha)}: ${esc(resumenTr(x.t))}</div>`).join('')}
        <div class="acciones"><button class="mini" data-ciudad="${esc(p.st[0].c.id)}">🏯 Ver en Planes</button></div></div>`; } }
  if (rmSel && rmSel.startsWith('t:')) { const x = trs[+rmSel.slice(2)];
    if (x) { const t = x.t, v = t.tren || t.bus, di = arr(trip.dias).findIndex(d => d.fecha === t.fecha);
      ficha = `<div class="rm-ficha tr"><div class="rm-ft"><b>${+rmSel.slice(2) + 1}. ${esc(nomRm(x.ka))} → ${esc(nomRm(x.kb))}</b><button class="sec mini" data-rms="">✕</button></div>
        <div>📅 ${fmtDate(t.fecha)} · ${isPend(t) ? '<span class="badge pend">pendiente</span>' : hecho(t) ? '<span class="badge ok">hecho</span>' : `<span class="badge ${/compr/i.test(t.estado || 'comprado') ? 'ok' : 'otro'}">${esc(t.estado || 'comprado')}</span>`}</div>
        ${v ? `<div>${t.tren ? '🚄' : '🚌'} <b>${esc(v.numero || (t.tren ? 'Tren' : 'Bus'))}</b> · ${esc(v.salida || '?')} → ${esc(v.llegada || '?')}${v.clase ? ' · ' + esc(v.clase) : ''}${v.coche ? ' · coche ' + esc(v.coche) : ''}</div>` : ''}
        ${v && v.asientos ? `<div>💺 ${Object.entries(v.asientos).map(([n, a]) => `${esc(n)} ${esc(a)}`).join(' · ')}</div>` : ''}
        ${arr(t.pasos).length ? `<ol class="rm-pasos">${arr(t.pasos).map(s => `<li>${resaltar(s, true)}</li>`).join('')}</ol>` : ''}
        ${di >= 0 ? `<div class="acciones"><button class="mini" data-rmdia="${di}">📅 Ver ese día en Hoy</button></div>` : ''}</div>`; } }
  const key = 'rmapa';
  return `<details class="card plg rm-pl" data-key="${key}" ${abierto(key, false) ? 'open' : ''}><summary>🗺️ <b>Mapa de la ruta</b> <small class="muted">· ${pts.filter(p => !p.aero).length} ciudades · ${trs.length} traslados · toca para ver</small></summary>
  <svg class="rmapa" viewBox="0 0 ${W} ${H}" role="img" aria-label="Mapa de la ruta">
    <defs><marker id="rmFlecha" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="rm-fl"/></marker>
      <pattern id="rmOlas" width="22" height="10" patternUnits="userSpaceOnUse"><path d="M0 6 Q5.5 1 11 6 T22 6" class="rm-ola"/></pattern></defs>
    <rect class="rm-mar" x="0" y="0" width="${W}" height="${H}" rx="14"/><rect x="0" y="0" width="${W}" height="${H}" rx="14" fill="url(#rmOlas)"/>
    <polygon class="rm-tierra" points="${costa}"/><polyline class="rm-dmz" points="${dmz}"/>
    <text class="rm-mart" x="26" y="250" transform="rotate(-90 26 250)" text-anchor="middle">MAR AMARILLO</text>
    <text class="rm-mart" x="316" y="160" transform="rotate(90 316 160)" text-anchor="middle">MAR DEL ESTE</text>
    ${lineas}${nodos}
  </svg>
  <div class="leyenda muted"><span class="rm-ley ok"></span> comprado · <span class="rm-ley ya"></span> hecho · <span class="rm-ley pend"></span> pendiente · toca una ciudad o un número</div>
  ${ficha}</details>`;
}
const nomRm = k => k === 'incheon' ? 'Aeropuerto de Incheon' : nombreCiudad(k);
// Una línea del traslado para la ficha de la ciudad: tren o bus y horas.
const resumenTr = t => { const v = t.tren || t.bus; return v ? `${v.numero || (t.tren ? 'tren' : 'bus')} ${v.salida || ''}${v.llegada ? '→' + v.llegada : ''}` : (t.estado || ''); };
document.addEventListener('click', e => {
  const r = e.target.closest('[data-rms],[data-rmdia]'); if (!r || !r.closest('.rm-pl')) return; e.stopPropagation();
  if (r.dataset.rmdia != null) { dayIdx = +r.dataset.rmdia; ir('hoy'); render(); window.scrollTo(0, 0); return; }
  const v = r.dataset.rms; rmSel = !v || rmSel === v ? null : v; const y = window.scrollY; render(); window.scrollTo(0, y);
}, true);

// ---------- Pronunciación "a la española" del coreano (aproximada) ----------
// Separa cada sílaba en inicial, vocal y final; aplica las reglas de sonido más comunes entre sílabas
// (enlace con la vocal siguiente, nasalización, ㄹ doble, aspiración, palatalización) y lo escribe con letras españolas.
const PR_INI = ['g', 'kk', 'n', 'd', 'tt', 'r', 'm', 'b', 'pp', 's', 'ss', '', 'j', 'jj', 'ch', 'k', 't', 'p', 'h'];
const PR_VOC = ['a', 'e', 'ya', 'ye', 'o', 'e', 'yo', 'ye', 'o', 'ua', 'ue', 'ue', 'yo', 'u', 'uo', 'ue', 'ui', 'yu', 'u', 'ui', 'i'];
// Finales: [letra que suena al cerrar sílaba, consonante que pasa a la sílaba siguiente si empieza por vocal (índice de inicial o -1), resto que se queda]
const PR_FIN = [null, ['k', 0, ''], ['k', 1, ''], ['k', 9, 'k'], ['n', 2, ''], ['n', 12, 'n'], ['n', -2, 'n'], ['t', 3, ''], ['l', 5, ''], ['k', 0, 'l'], ['m', 6, 'l'],
  ['l', 7, 'l'], ['l', 9, 'l'], ['l', 16, 'l'], ['p', 17, 'l'], ['l', -2, 'l'], ['m', 6, ''], ['p', 7, ''], ['p', 9, 'p'], ['t', 9, ''], ['t', 10, ''], ['ng', -1, 'ng'],
  ['t', 12, ''], ['t', 14, ''], ['k', 15, ''], ['t', 16, ''], ['p', 17, ''], ['t', -2, '']];
function pronuncia(txt) {
  const out = [];
  // Palabra a palabra (el espacio corta las reglas).
  return String(txt || '').split(/(\s+)/).map(pal => {
    const s = [...pal].map(ch => { const c = ch.charCodeAt(0) - 0xAC00; return c >= 0 && c < 11172 ? { i: Math.floor(c / 588), v: Math.floor((c % 588) / 28), f: c % 28 } : { x: ch }; });
    // Reglas entre sílabas.
    for (let n = 0; n < s.length - 1; n++) {
      const a = s[n], b = s[n + 1]; if (a.x !== undefined || b.x !== undefined || !a.f) continue;
      const F = PR_FIN[a.f];
      if (b.i === 11) { // la siguiente empieza por vocal: enlace
        if (F[1] === -1) continue; // ㅇ final se queda
        if (F[1] === -2) { if (F[2] === 'n') b.i = 2; else if (F[2] === 'l') b.i = 5; else b.h = true; a.f = 0; continue; } // ㅎ final: desaparece (ㄶ/ㅀ: la ㄴ/ㄹ pasa a la vocal)
        if ((a.f === 7 || a.f === 25) && b.v === 20) { b.i = a.f === 7 ? 12 : 14; a.f = 0; continue; } // 굳이, 같이: palatalización
        b.i = F[1]; a.f = F[2] === '' ? 0 : F[2] === 'k' ? 1 : F[2] === 'n' ? 4 : F[2] === 'l' ? 8 : F[2] === 'p' ? 17 : 0; continue;
      }
      if (F[1] === -2 && [0, 3, 12].includes(b.i)) { b.i = b.i === 0 ? 15 : b.i === 3 ? 16 : 14; a.f = F[2] === 'n' ? 4 : F[2] === 'l' ? 8 : 0; continue; } // ㅎ + ㄱㄷㅈ: aspiradas
      if (b.i === 18 && ['k', 't', 'p'].includes(F[0])) { b.i = F[0] === 'k' ? 15 : F[0] === 't' ? 16 : 17; a.f = 0; continue; } // ㄱㄷㅂ + ㅎ
      if ((b.i === 2 || b.i === 6) && ['k', 't', 'p'].includes(F[0])) { a.nas = F[0] === 'k' ? 'ng' : F[0] === 't' ? 'n' : 'm'; continue; } // nasalización
      if (b.i === 5 && (F[0] === 'n' || F[0] === 'l')) { a.nas = 'l'; b.ll = true; continue; } // ㄴ+ㄹ, ㄹ+ㄹ → ll
      if (b.i === 2 && F[0] === 'l') { b.i = 5; b.ll = true; continue; } // ㄹ+ㄴ → ll
      if (b.i === 5 && ['m', 'ng'].includes(F[0])) { b.i = 2; continue; } // ㅁ/ㅇ + ㄹ → n
    }
    let r = '', prevSonora = false, prevFuerte = false, prevVocal = false;
    s.forEach((y, n) => {
      if (y.x !== undefined) { r += y.x; prevSonora = false; prevFuerte = false; prevVocal = false; return; }
      const vo = PR_VOC[y.v], ini = n === 0 || prevFuerte ? 'inicio' : 'medio';
      let c = '';
      switch (y.i) {
        case 0: c = ini === 'inicio' || !prevSonora ? 'k' : 'g'; break; case 1: case 15: c = 'k'; break;
        case 3: c = ini === 'inicio' || !prevSonora ? 't' : 'd'; break; case 4: case 16: c = 't'; break;
        case 7: c = ini === 'inicio' || !prevSonora ? 'p' : 'b'; break; case 8: case 17: c = 'p'; break;
        case 9: case 10: c = /^[iy]/.test(vo) || vo === 'ui' && false ? 'sh' : 's'; break;
        case 12: case 13: case 14: c = 'ch'; break;
        case 2: c = 'n'; break; case 6: c = 'm'; break;
        case 5: c = y.ll ? 'l' : 'r'; break;
        case 18: c = y.h ? '' : (n > 0 && !prevVocal ? '' : 'j'); break; // ㅎ suave: se oye tras vocal, se pierde tras consonante
        case 11: c = ''; break;
      }
      if (y.i === 9 && /^y/.test(vo)) c = 'sh';
      let v = vo; if ((c === 'sh' || c === 'ch') && /^y/.test(v)) v = v.slice(1);
      // g/k delante de e/i al estilo español.
      if (c === 'g' && /^[ei]/.test(v)) c = 'gu';
      let fin = '';
      if (y.f) { fin = y.nas || PR_FIN[y.f][0]; }
      if (r.endsWith('ng') && !c && /^[ei]/.test(v)) r += '-'; // pochang-e (si no, se leería «je»)
      r += c + v + fin;
      prevSonora = !y.f || ['n', 'l', 'm', 'ng'].includes(fin);
      prevFuerte = !!y.f && ['k', 't', 'p'].includes(fin); prevVocal = !y.f;
    });
    return r;
  }).join('');
}

const pronHTML = ko => { const p = pronuncia(ko); return p && /[a-z]/.test(p) ? `<div class="pron">🗣️ ${esc(p)}</div>` : ''; };

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
    ${l.ko ? `<div class="ko">${esc(l.ko)}</div>${pronHTML(l.ko)}` : '<div class="falta">falta hangul: copiar de Naver Map</div>'}</div>
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
// ---------- Buscadores de Ciudades y Comer (todas las ciudades; sin tildes; también en hangul) ----------
let qCiu = '', qCom = '', qDic = '';
const nb = t => String(t || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const buscadorHTML = (id, v, ph, res) => `<div class="buscador"><input id="${id}" type="search" placeholder="🔎 ${esc(ph)}" value="${esc(v)}" autocomplete="off" enterkeyhint="search"><button class="sec mini" data-qclear="${id}" aria-label="Borrar">✕</button></div><div id="r${id}">${res}</div>`;
// Puntuación: 2 si está en el nombre o el hangul, 1 si solo en la descripción.
function coincide(q, nombre, extra) { const a = nb(q).trim(); if (!a) return 0; return nb(nombre).includes(a) ? 2 : nb(extra).includes(a) ? 1 : 0; }
function resCiudades(q) {
  if (!String(q || '').trim()) return '';
  const D = typeof DIA_LP !== 'undefined' ? DIA_LP : {}, rs = [];
  ciudadesCatalogo().forEach(k => sitiosCiudadObj(k).forEach(l => { const h = hKey(l), txt = D[h.slice(2)] || D[h] || l.desc || l.nota || '';
    const p = coincide(q, [l.es, l.ko, l.romanizacion].join(' '), [l.tipo, txt].join(' ')); if (p) rs.push({ l, k, p, txt, plan: false }); }));
  (typeof PLANES !== 'undefined' ? PLANES : []).forEach(l => { const p = coincide(q, [l.es, l.ko, l.romanizacion].join(' '), [l.desc, l.direccion_en].join(' ')); if (p) rs.push({ l, k: l.ciudad, p, txt: l.desc || '', plan: true }); });
  rs.sort((a, b) => b.p - a.p);
  if (!rs.length) return '<p class="muted centro">Nada con ese nombre. Prueba otra palabra o en hangul.</p>';
  return `<div class="muted centro">${rs.length} ${rs.length === 1 ? 'resultado' : 'resultados'}${rs.length > 20 ? ' (los 20 primeros)' : ''}</div>` + rs.slice(0, 20).map(({ l, k, txt, plan }) => `<div class="card bres">${miniFoto(l)}<div class="bres-c">
      <div><b>${plan ? icPlan(l) : icSitio((l.tipo || '') + ' ' + l.es)} ${esc(l.es)}</b>${lpPill(l)} <span class="ko-s">${esc(l.ko || '')}</span></div>
      <div class="muted">${tema(k).ic} ${esc(nombreCiudad(k))}${plan ? ' · Miscelánea' : ''}${distHotel(l, k)}</div>
      ${txt ? `<div class="muted">${resaltar(recorta(txt, 130), true)}</div>` : ''}
      ${plan ? '' : guiaCult(l, 'bus') + agendaBtn(l, k, 'bus')}
      <div class="acciones">${naver(l)}${plan ? '' : `<button class="sec mini" data-bcity="${esc(k)}">${tema(k).ic} Ver en la ciudad</button>`}</div></div></div>`).join('');
}
function resComer(q) {
  if (!String(q || '').trim()) return '';
  const rs = lugaresComer().map(l => ({ l, p: coincide(q, [l.nombre, l.ko].join(' '), [l.plato, l.tipo, l.nota, l.direccion].join(' ')) })).filter(x => x.p).sort((a, b) => b.p - a.p);
  if (!rs.length) return '<p class="muted centro">Nada con ese nombre o plato.</p>';
  return `<div class="muted centro">${rs.length} ${rs.length === 1 ? 'resultado' : 'resultados'} en todas las ciudades${rs.length > 15 ? ' (los 15 primeros)' : ''}</div>` + rs.slice(0, 15).map(({ l }) => `<div class="bres-ciudad muted">${tema(l.ciudad).ic} ${esc(nombreCiudad(l.ciudad))}</div>${cardComer(l)}`).join('') + '<hr class="bres-fin">';
}
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
  const ko = (html.match(/<div class="enorme">([^<]*)<\/div>/) || [])[1] || '';
  div.innerHTML = '<button class="sec cerrar" data-close>✕ Cerrar</button>' + html + btnHabla(ko.replace(/&amp;/g, '&'), true);
  document.body.appendChild(div);
  ajustarTexto(div);
  history.pushState({ full: 1 }, '');
  // Mantiene la pantalla encendida mientras se enseña la tarjeta.
  if (navigator.wakeLock) navigator.wakeLock.request('screen').then(l => { div._lock = l; }).catch(() => {});
}
function showFull(key) {
  const [t, a, b] = key.split(':');
  if (t === 'cn') {
    const f = FRASES_CN[a]; if (!f) return;
    return full(`<div class="enorme">${esc(f[1])}</div><div class="es">${esc(f[2])}</div><div class="es">${esc(f[0])}</div>`);
  }
  if (t === 'hc') {
    const ko = key.slice(3), c = (typeof HG_CARTELES !== 'undefined' ? HG_CARTELES : []).find(x => x[0] === ko); if (!c) return;
    return full(`<div class="enorme">${esc(c[0])}</div>${pronHTML(c[0])}<div class="es">${esc(c[1])}</div>`);
  }
  if (t === 'p') {
    const p = ((PLATOS[a] || [])[1] || [])[b]; if (!p) return;
    return full(`<div class="enorme">${esc(p[1])}</div><div class="es">${esc(p[0])} · ${esc(p[2])}</div><div class="es">Glosario Lonely Planet 2016</div>`);
  }
  if (t === 'f' || t === 'd') {
    const f = t === 'f' ? FRASES[a] : ((DICC[a] || [])[1] || [])[b]; if (!f) return;
    return full(`<div class="enorme">${esc(f[1])}</div>${t === 'f' ? pronHTML(f[1]) : ''}<div class="es">${esc(f[0])} · ${esc(f[2])}</div>`);
  }
  if (t === 'pl') {
    const l = (typeof PLANES !== 'undefined' ? PLANES : [])[a]; if (!l) return;
    return full(`<div class="enorme">${esc(fraseTaxi(l.ko))}</div>${pronHTML(fraseTaxi(l.ko))}${l.direccion_ko ? `<div class="dir">${esc(l.direccion_ko)}</div>` : ''}
      <div class="es">${esc(l.es)}${l.direccion_en ? '<br>' + esc(l.direccion_en) : ''}</div>`);
  }
  if (t === 'k') {
    const c = lugaresComer().find(x => String(x.id) === key.slice(2)); if (!c) return;
    return full(`${c.ko ? `<div class="enorme">${esc(c.ko)}</div>${pronHTML(c.ko)}` : '<div class="falta">falta hangul: copiar de Naver Map</div>'}
      <div class="es">${esc(c.nombre || '')}${c.plato ? ' · ' + esc(c.plato) : ''}${c.direccion ? '<br>' + esc(c.direccion) : ''}</div>`);
  }
  const l = t === 'j' ? arr(trip.lugares)[a] : sitiosCiudad(a)[b];
  if (!l) return;
  full(`${l.ko ? `<div class="enorme">${esc(fraseTaxi(l.ko))}</div>${pronHTML(fraseTaxi(l.ko))}
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
// 🔊 Pronunciación con la voz coreana del móvil (sin conexión si el móvil la tiene instalada). Dos toques seguidos: más despacio.
let hablaUlt = { t: '', ms: 0 };
function hablar(t) {
  if (!('speechSynthesis' in window)) { alert('Este navegador no puede leer en voz alta.'); return; }
  const voces = speechSynthesis.getVoices(), v = voces.find(x => /^ko/i.test(x.lang));
  if (voces.length && !v) { alert('Tu móvil no tiene voz en coreano. Instálala: Android → Ajustes → Idioma y entrada → Salida de texto a voz (Google) → Instalar datos de voz → Coreano. iPhone → Ajustes → Accesibilidad → Contenido leído → Voces → Coreano.'); return; }
  const ahora = Date.now(), lento = hablaUlt.t === t && ahora - hablaUlt.ms < 4000; hablaUlt = { t, ms: ahora };
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(t); u.lang = 'ko-KR'; u.rate = lento ? 0.5 : 0.85; if (v) u.voice = v;
  speechSynthesis.speak(u);
}
if ('speechSynthesis' in window) speechSynthesis.getVoices(); // en Android la lista de voces llega tarde
const btnHabla = (ko, grande = false) => /[가-힣]/.test(ko || '') ? `<button class="habla ${grande ? 'grande' : ''}" data-habla="${esc(ko)}" aria-label="Escuchar en coreano">🔊${grande ? ' Escuchar' : ''}</button>` : '';
// ⭐ Favoritas (user.favs: [{k, es, ko, rom}], la última arriba): frases, palabras y carteles.
const esFav = k => arr(u().favs).some(f => f.k === k);
const btnFav = (k, es, ko, rom = '') => `<button class="fav ${esFav(k) ? 'on' : ''}" data-fav="${esc(k)}" data-es="${esc(es)}" data-ko="${esc(ko)}" data-rom="${esc(rom)}" aria-label="Favorita">${esFav(k) ? '★' : '☆'}</button>`;
function viewFavs() {
  const fs = arr(u().favs); if (!fs.length) return '<p class="muted centro">Toca ☆ en cualquier frase, palabra del diccionario o cartel de Hangul y aparecerá aquí.</p>';
  const grupos = [['f', '💬 Frases'], ['d', '📖 Palabras'], ['hc', '🪧 Carteles']];
  return grupos.map(([t, tt]) => { const g = fs.filter(f => f.k.split(':')[0] === t); return g.length ? `<h2>${tt} <small class="muted">${g.length}</small></h2>${g.map(f => dFila([f.es, f.ko, f.rom], f.k, true)).join('')}` : ''; }).join('');
}
const dFila = (e, key, conPron = false) => `<div class="card lugar" data-full="${key}"><div class="fila-acc">${btnFav(key, e[0], e[1], e[2])}${btnHabla(e[1])}</div><div><div>${esc(e[0])}${e[3] ? ' <span class="ver">VERIFICAR</span>' : ''}</div>
  <div class="ko">${esc(e[1])}</div>${conPron ? pronHTML(e[1]) : ''}<div class="muted ${conPron ? 'rom' : ''}">${esc(e[2])}</div></div></div>`;

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

const icGuia = t => [[/snack/i, '🍪'], [/dinero/i, '💰'], [/t-money|transporte/i, '🚇'], [/taxi/i, '🚕'], [/propina/i, '💸'], [/zapato/i, '👟'], [/enchufe/i, '🔌'], [/^apps/i, '📱'], [/pago/i, '💳'],
  [/hangul/i, '🔤'], [/metro y ktx/i, '🚄'], [/clima/i, '🍂'], [/24 h/i, '🏪'], [/baños/i, '🚻'], [/internet/i, '📶'], [/tax free/i, '🛍️'], [/farmacia/i, '💊'], [/beber/i, '🍶'], [/^templos/i, '🛕'], [/fechas/i, '📅'], [/^comida/i, '🍜'], [/^etiqueta/i, '🙇'], [/seguridad|emergencia/i, '🚨'], [/entrada/i, '🛂'], [/básico/i, '🇰🇷'], [/consejos/i, '💡'], [/llevar/i, '🎒'], [/mesa/i, '🥢'], [/saber estar/i, '🤝']]
  .find(([r]) => r.test(t))?.[1] || '📌';
// Hoteles que se pagan allí (de trip.json, solo en el móvil): reservad efectivo por si no aceptan tarjeta.
function pagoAlli() {
  const hs = arr(trip && trip.alojamientos).filter(a => /alojamiento|llegada|allí|in situ/i.test(a.pago || '') && ck(a.ciudad) && !/espana/.test(ck(a.ciudad)) && !/Hostal/.test(a.nombre || ''));
  return hs.length ? `<li><b>Se pagan allí:</b> ${hs.map(a => `${esc(a.nombre)}${a.coste_eur ? ` (${esc(a.coste_eur)} €)` : ''}`).join(', ')}. Lo normal es que acepten tarjeta, pero llevad efectivo de reserva o preguntad antes.</li>` : '';
}
// Historia de Corea para leer en el avión: índice, capítulo, anterior/siguiente y marca de leído (en el móvil).
let histCap = null;
const minLect = c => Math.max(1, Math.round(c.p.join(' ').split(/\s+/).length / 220));
// Línea del tiempo (capítulo al que lleva) y foto de Wikipedia de cada capítulo.
const HIST_ERAS = [
  ['고조선', 'Gojoseon', 'mito – 108 a. C.', 1, '#8a6a3a'], ['삼국', 'Tres Reinos', '57 a. C. – 668', 2, '#b8322a'],
  ['통일신라', 'Silla Unificada', '668 – 935', 3, '#c9962e'], ['고려', 'Goryeo', '918 – 1392', 4, '#2e7d6b'],
  ['조선', 'Joseon', '1392 – 1897', 5, '#1f4e8c'], ['대한제국', 'Imperio Coreano', '1897 – 1910', 8, '#6b3fa0'],
  ['일제강점기', 'Ocupación japonesa', '1910 – 1945', 9, '#555'], ['한국전쟁', 'División y guerra', '1945 – 1953', 10, '#8b2020'],
  ['대한민국', 'República de Corea', '1948 – hoy', 11, '#0047a0']];
const HIST_WIKI = ['Flag_of_South_Korea', 'Dangun', 'Three_Kingdoms_of_Korea', 'Bulguksa', 'Goryeo_ware', 'Gyeongbokgung', 'Sejong_the_Great', 'Turtle_ship',
  'Gojong_of_Korea', 'March_1st_Movement', 'Korean_War', 'Han_River_(Korea)', 'June_Democratic_Struggle', 'Korean_Demilitarized_Zone', 'Yi_Sun-sin', 'Hanbok',
  'Jogyesa', 'Korean_pottery_and_porcelain', 'Korean_wave', 'Taekwondo', 'Kimchi', 'Hahoe_Folk_Village'];
// Símbolos del país (texto propio).
const HIST_SIMBOLOS = [['🇰🇷', 'Taegukgi', 'La bandera: el equilibrio del yin y el yang y cuatro trigramas (cielo, tierra, agua y fuego).'],
  ['🌺', 'Mugunghwa', 'La flor nacional, el hibisco de Siria: su nombre significa «flor eterna» porque florece sin parar todo el verano.'],
  ['한', 'Hangul', 'El alfabeto creado en el siglo XV por el rey Sejong; el 9 de octubre es su fiesta nacional.'],
  ['🐯', 'Tigre', 'Animal protector en el arte popular y la mascota de los Juegos Olímpicos de Seúl 1988.'],
  ['🎵', 'Arirang', 'La canción popular más querida, casi un himno no oficial; Patrimonio Inmaterial de la Humanidad.']];
const eraDe = i => HIST_ERAS.slice().reverse().find(e => i >= e[3] && i <= 13) || null;
let histSub = 'linea', histDir = 'sig';
// Barra de lectura del capítulo y paso de capítulo deslizando el dedo.
window.addEventListener('scroll', () => { const c = document.querySelector('.hist-cap2'); if (!c) return; const r = c.getBoundingClientRect(), tot = r.height - innerHeight;
  const b = c.querySelector('.hc-prog i'); if (b) b.style.width = Math.max(0, Math.min(100, tot > 0 ? -r.top / tot * 100 : 100)) + '%'; }, { passive: true });
let toque0 = null;
document.addEventListener('touchstart', e => { toque0 = e.target.closest('.hist-cap2') && !e.target.closest('.mapa') ? [e.touches[0].clientX, e.touches[0].clientY] : null; }, { passive: true });
document.addEventListener('touchend', e => { if (!toque0 || histCap === null) return; const t = e.changedTouches[0], dx = t.clientX - toque0[0], dy = t.clientY - toque0[1]; toque0 = null;
  if (Math.abs(dx) < 70 || Math.abs(dy) > 50) return; const n = histCap + (dx < 0 ? 1 : -1), H = HISTORIA_COREA;
  if (n < 0 || n >= H.length) return; histDir = dx < 0 ? 'sig' : 'ant'; histCap = n; render(); window.scrollTo(0, 0); }, { passive: true });
const HIST_SUBS = [['linea', '⏳ Línea del tiempo'], ['caps', '📚 Capítulos'], ['ciudades', '🏯 Vuestras ciudades'], ['simbolos', '🇰🇷 Símbolos']];
// Sitio del catálogo por su hangul (para "Dónde lo veréis").
function sitioPorKo(ko) { for (const k of ciudadesCatalogo()) { const l = sitiosCiudadObj(k).find(x => hKey(x).slice(2) === ko); if (l) return [l, k]; } return null; }
function viewHistoria() {
  const H = typeof HISTORIA_COREA !== 'undefined' ? HISTORIA_COREA : []; if (!H.length) return '';
  const M = typeof HIST_META !== 'undefined' ? HIST_META : [], EV = typeof HIST_EVENTOS !== 'undefined' ? HIST_EVENTOS : [];
  const U = u(); U.leidos = U.leidos || {};
  const tot = H.reduce((a, c) => a + minLect(c), 0), leidos = H.filter((c, i) => U.leidos[i]).length;
  if (histCap !== null && H[histCap]) {
    const c = H[histCap], i = histCap, era = eraDe(i), m = M[i] || {}, evs = EV.filter(e => e[2] === i);
    const ver = arr(m.v).map(sitioPorKo).filter(Boolean);
    return `<div class="hist-tema"><div class="hist-cap2" data-dir="${histDir}">
      <div class="hc-prog"><i></i></div>
      <div class="foto banda hc-banner" data-wiki="${esc(HIST_WIKI[i] || '')}"><span>${c.ic}</span></div>
      <div class="hc-meta">${era ? `<span class="hc-era" style="--ec:${era[4]}">${era[0]} · ${era[1]}</span>` : m.e ? `<span class="hc-era" style="--ec:#7a5c3a">${esc(m.e)}</span>` : ''}<span>${m.a ? esc(m.a) + ' · ' : ''}Cap. ${i + 1}/${H.length} · ${minLect(c)} min</span></div>
      <h3 class="hist-h">${c.ic} ${esc(c.t)}</h3>
      ${m.r ? `<div class="hc-resumen"><b>⏱️ En 30 segundos</b>${esc(m.r)}</div>` : ''}
      ${c.p.map((x, j) => `<p class="${j === 0 ? 'capital' : ''}">${resaltar(x, true)}</p>`).join('')}
      ${evs.length ? `<div class="hc-box"><b>📅 Fechas clave</b>${evs.map(e => `<div class="hc-ev"><span>${esc(e[0])}</span>${esc(e[1])}</div>`).join('')}</div>` : ''}
      ${ver.length ? `<div class="hc-box"><b>📍 Dónde lo veréis en el viaje</b><div class="hc-ver">${ver.map(([l, k]) => `<button class="chip" data-bcity="${esc(k)}" data-bq="${esc(l.es)}">${tema(k).ic} ${esc(l.es)}</button>`).join('')}</div></div>` : ''}
      <div class="hc-fin muted">Desliza ← → para cambiar de capítulo</div>
      <div class="hist-nav2"><button class="sec" data-hc="${i - 1}" ${i === 0 ? 'disabled' : ''} aria-label="Anterior">◀</button>
        <button class="sec hn-ind" data-hc="ind">☰ ${i + 1}/${H.length}</button>
        <button class="hn-sig" data-hc="${i + 1 < H.length ? i + 1 : 'ind'}" data-leido="${i}">${i + 1 < H.length ? 'Leído ▶' : 'Leído ✓'}</button></div></div></div>`;
  }
  const sig = H.findIndex((c, i) => !U.leidos[i]);
  const portada = `<div class="hist-portada"><div class="hist-ko">한국사</div><div class="hist-tit">Historia y cultura de Corea</div>
      <div class="hist-sub">${H.length} capítulos · unos ${tot} min · ${EV.length} fechas · para leer en el avión</div>
      <div class="hist-barra"><i style="width:${Math.round(leidos / H.length * 100)}%"></i></div><div class="hist-sub">${leidos} de ${H.length} leídos</div>
      ${sig >= 0 ? `<button class="hist-seguir" data-hc="${sig}">${leidos ? '▶ Seguir' : '▶ Empezar'}: ${esc(H[sig].t)}</button>` : '<div class="hist-sub">✅ ¡Todo leído!</div>'}</div>`;
  const subs = `<div class="row daynav hist-subs">${HIST_SUBS.map(([k, t]) => { const [ic, ...r] = t.split(' '); return `<button class="${k === histSub ? '' : 'sec'}" data-hsub="${k}"><span class="hs-i">${ic}</span>${r.join(' ')}</button>`; }).join('')}</div>`;
  let cuerpo = '';
  if (histSub === 'linea') {
    // Línea vertical: cada etapa con su color y sus fechas; tocar una fecha abre el capítulo.
    cuerpo = `<div class="hist-linea">${HIST_ERAS.map(([ko, es, f, cap, col]) => `<button class="hl-era" style="--ec:${col}" data-hc="${cap}"><span class="hl-ko">${ko}</span><b>${es}</b><small>${f}</small></button>`).join('')}</div>
      <div class="htl">${EV.map((e, n) => { const era = eraDe(e[2]) || ['', '', '', 0, '#7a5c3a']; return `<button class="htl-ev" style="--ec:${era[4]};--i:${Math.min(n, 14)}" data-hc="${e[2]}"><span class="htl-a">${esc(e[0])}</span><span class="htl-t">${esc(e[1])}</span></button>`; }).join('')}</div>`;
  } else if (histSub === 'caps') {
    const tarjeta = i => { const c = H[i], m = M[i] || {}; return `<button class="hc-card ${U.leidos[i] ? 'leido' : ''}" style="--i:${Math.min(i % 14, 10)}" data-hc="${i}">
        <div class="foto mini hc-foto" data-wiki="${esc(HIST_WIKI[i] || '')}"><span>${c.ic}</span></div>
        <span class="hc-txt"><small>${i + 1} · ${m.a ? esc(m.a) + ' · ' : ''}${U.leidos[i] ? '✓ leído' : minLect(c) + ' min'}</small><b>${esc(c.t)}</b></span></button>`; };
    cuerpo = `<div class="hist-sec">📜 De Dangun a hoy</div><div class="hc-grid">${H.map((c, i) => i).filter(i => i <= 13).map(tarjeta).join('')}</div>
      <div class="hist-sec">🎎 Personajes, cultura y vuestra ruta</div><div class="hc-grid">${H.map((c, i) => i).filter(i => i > 13).map(tarjeta).join('')}</div>`;
  } else if (histSub === 'ciudades') {
    const HC = typeof HISTORIA !== 'undefined' ? HISTORIA : {};
    const CI = typeof CIUDAD_INFO !== 'undefined' ? CIUDAD_INFO : {};
    cuerpo = ciudadesUnicas().map(c => ck(c.nombre)).filter((k, i, a) => (HC[k] || CI[k]) && a.indexOf(k) === i).map(k => `<details class="hist-ciudad" style="${varsTema(k)}" data-key="hcd:${k}" ${abierto('hcd:' + k, false) ? 'open' : ''}>
      <summary><span>${tema(k).ic}</span><b>${esc(nombreCiudad(k))}</b><small>${esc(tema(k).lema || '')}</small></summary>
      ${HC[k] ? `<div class="ci-breve"><b>En pocas palabras</b>${HC[k].txt.map(p => `<p>${resaltar(p, true).replace(/\(LP\)/g, '<span class="badge otro">LP</span>')}</p>`).join('')}</div>` : ''}
      ${arr(CI[k]).map(([ic, t, ps], i) => `<details class="ci-sec" data-key="ci:${k}:${i}" ${abierto('ci:' + k + ':' + i, false) ? 'open' : ''}><summary>${ic} ${esc(t)} <small class="muted">· ${minLect({ p: ps })} min</small></summary>${ps.map(p => `<p>${resaltar(p, true)}</p>`).join('')}</details>`).join('')}</details>`).join('');
  } else cuerpo = `<div class="hist-simb">${HIST_SIMBOLOS.map(([ic, t, d]) => `<div class="hs-it"><span class="hs-ic">${ic}</span><span><b>${t}</b> ${esc(d)}</span></div>`).join('')}</div>`;
  return `<div class="hist-tema">${portada}${subs}${cuerpo}</div>`;
}
// ---------- Hangul: lecciones, carteles, test y fuentes (contenido en hangul.js) ----------
let hgSub = 'lec', hgQ = null;
const HG_CHO = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ', HG_JUNG = 'ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ';
const HG_JONG = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
const hgMd = t => esc(t).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
const hgLetras = () => (typeof HG_LEC !== 'undefined' ? HG_LEC : []).flatMap(l => (l.letras || []).map(x => ({ lec: l.id, x })));
const hgSonido = j => { const e = hgLetras().find(o => o.x[0] === j); return e ? e.x[1] : ''; };
// Un bloque letra a letra: 출 = ㅊ ch + ㅜ u + ㄹ l (la final con su sonido al cerrar sílaba).
function hgDescompon(ko) {
  return [...ko].map(ch => { const c = ch.charCodeAt(0) - 0xAC00; if (c < 0 || c >= 11172) return '';
    const i = Math.floor(c / 588), v = Math.floor((c % 588) / 28), f = c % 28;
    const ps = [[HG_CHO[i], i === 11 ? 'muda' : hgSonido(HG_CHO[i]).replace(/ \/.*/, '')], [HG_JUNG[v], hgSonido(HG_JUNG[v])]];
    if (f) ps.push([HG_JONG[f], PR_FIN[f][0]]);
    return `<span class="hg-sil"><b>${ch}</b><small>${ps.map(([j, s]) => `${j} <i>${esc(s)}</i>`).join(' + ')}</small></span>`; }).join('');
}
const hgEj = ko => `<span class="hg-ej"><b>${esc(ko)}</b> <span class="pron-mini">🗣️ ${esc(pronuncia(ko))}</span>${btnHabla(ko)}</span>`;
function hgLeccion(l, n) {
  const U = u(), leida = !!(U.hgLeidas || {})[l.id], k = 'hg:' + l.id;
  const letras = l.letras ? `<div class="hg-rej">${l.letras.map(([j, s, rom, ej, sig, tr]) => `<div class="hg-letra">
      <div class="hg-l">${j}</div><div class="hg-s"><b>${esc(s)}</b><small>romanización: ${esc(rom)}</small></div>
      <div class="hg-tr">${esc(tr)}</div>
      <div class="hg-pie">${hgEj(ej)}<span class="muted">${esc(sig)}</span></div></div>`).join('')}</div>` : '';
  const reglas = l.reglas ? l.reglas.map(([t, d, ejs]) => `<div class="hg-regla"><b>${esc(t)}</b><div class="muted">${esc(d)}</div>
      ${ejs.map(e => `<div class="hg-rej-ej">${hgEj(e)}</div>`).join('')}</div>`).join('') : '';
  return `<details class="card hg-lec ${leida ? 'leida' : ''}" data-key="${k}" ${abierto(k, false) ? 'open' : ''}><summary><span class="hg-n">${leida ? '✓' : n}</span><span>${l.ic} ${esc(l.t)}</span></summary>
    ${(l.puntos || []).length ? `<ul class="hg-puntos">${l.puntos.map(p => `<li>${hgMd(p)}</li>`).join('')}</ul>` : ''}${letras}${reglas}
    ${(l.trucos || []).map(t => `<div class="hg-truco">💡 ${hgMd(t)}</div>`).join('')}${(l.ojo || []).map(t => `<div class="hg-ojo">⚠️ ${hgMd(t)}</div>`).join('')}
    <button class="${leida ? 'sec ' : ''}mini" data-hgleida="${l.id}">${leida ? '↺ Marcar como no leída' : '✓ Lección leída'}</button></details>`;
}
// Test: letras (cómo suena) o carteles (qué significa). Repite más lo que se falla.
const HG_NIVELES = [['vocales', '🅰️ Vocales'], ['consonantes', '🔤 Consonantes'], ['todo', '🔀 Todas las letras'], ['carteles', '🪧 Carteles']];
function hgPregunta(nivel) {
  const U = u(), T = U.hgTest = U.hgTest || { ok: 0, n: 0, f: {} };
  const carteles = nivel === 'carteles';
  const pool = carteles ? HG_CARTELES.map(c => ({ k: c[0], q: c[0], a: c[1] }))
    : hgLetras().filter(o => nivel === 'todo' || (nivel === 'vocales' ? ['vocales', 'y', 'w'] : ['cons', 'aire', 'dobles']).includes(o.lec)).map(o => ({ k: o.x[0], q: o.x[0], a: o.x[1], ej: o.x[3] }));
  const peso = p => 1 + 3 * (T.f[p.k] || 0) + (hgQ && hgQ.item && hgQ.item.k === p.k ? -1 : 0);
  let r = Math.random() * pool.reduce((s, p) => s + Math.max(0.1, peso(p)), 0), item = pool[0];
  for (const p of pool) { r -= Math.max(0.1, peso(p)); if (r <= 0) { item = p; break; } }
  const otras = [...new Set(pool.map(p => p.a).filter(a => a !== item.a))].sort(() => Math.random() - 0.5).slice(0, 3);
  return { nivel, item, ops: [item.a, ...otras].sort(() => Math.random() - 0.5), resp: null };
}
function hgTest() {
  const U = u(), T = U.hgTest || { ok: 0, n: 0, f: {} };
  if (!hgQ) hgQ = hgPregunta('vocales');
  const { item, ops, resp, nivel } = hgQ, carteles = nivel === 'carteles', bien = resp != null && ops[resp] === item.a;
  const repasar = Object.entries(T.f).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([k]) => k);
  return `<div class="chips hg-niv">${HG_NIVELES.map(([k, t]) => `<button class="chip ${k === nivel ? 'on' : ''}" data-hgniv="${k}">${t}</button>`).join('')}</div>
    <div class="card hg-q"><div class="muted">${carteles ? '¿Qué significa?' : '¿Cómo suena?'}</div>
      <div class="hg-q-l ${carteles ? 'pal' : ''}">${esc(item.q)}</div>
      <div class="hg-ops">${ops.map((o, i) => `<button class="hg-op ${resp == null ? '' : o === item.a ? 'ok' : i === resp ? 'mal' : 'off'}" data-hgr="${i}" ${resp == null ? '' : 'disabled'}>${esc(o)}</button>`).join('')}</div>
      ${resp == null ? '' : `<div class="hg-res ${bien ? 'ok' : 'mal'}">${bien ? '✅ ¡Bien!' : `❌ Era «${esc(item.a)}»`}</div>
        <div class="hg-desc">${carteles ? `${hgEj(item.q)}<div class="hg-silabas">${hgDescompon(item.q)}</div>` : item.ej ? `Ejemplo: ${hgEj(item.ej)}` : ''}</div>
        <button data-hgsig>Siguiente →</button>`}</div>
    <div class="muted centro">✅ ${T.ok} de ${T.n} aciertos${repasar.length ? ` · 🔁 Para repasar: ${repasar.map(esc).join(' ')}` : ''}</div>${T.n ? '<div class="centro"><button class="sec mini" data-hgreset>↺ Empezar de cero</button></div>' : ''}`;
}
function viewHangul() {
  if (typeof HG_LEC === 'undefined') return '<p class="muted">Falta hangul.js.</p>';
  const U = u(), n = HG_LEC.filter(l => (U.hgLeidas || {})[l.id]).length;
  const subs = [['lec', `📚 Lecciones ${n}/${HG_LEC.length}`], ['carteles', '🪧 Carteles'], ['test', '🎯 Practicar'], ['fuentes', '🔗 Fuentes']];
  let h = `<div class="chips hg-subs">${subs.map(([k, t]) => `<button class="chip ${k === hgSub ? 'on' : ''}" data-hgsub="${k}">${t}</button>`).join('')}</div>`;
  if (hgSub === 'carteles') h += HG_CARTELES.map(([ko, es, ing]) => `<div class="card hg-cartel"><div class="hg-c-top"><span class="hg-c-ko">${esc(ko)}</span><span class="fila-acc">${btnFav('hc:' + ko, es, ko)}${btnHabla(ko)}</span></div>
      <div><b>${esc(es)}</b>${ing ? ' <span class="badge otro">del inglés</span>' : ''} · <span class="pron-mini">🗣️ ${esc(pronuncia(ko))}</span></div>
      <div class="hg-silabas">${hgDescompon(ko)}</div></div>`).join('');
  else if (hgSub === 'test') h += hgTest();
  else if (hgSub === 'fuentes') h += `${HG_FUENTES.map(([t, url, d]) => `<div class="card hg-fuente"><a href="${esc(url)}" target="_blank" rel="noopener"><b>${esc(t)}</b></a><div class="muted">${esc(d)}</div></div>`).join('')}
      <p class="muted">Los enlaces necesitan conexión. Los trucos para memorizar de las lecciones son propios, inspirados en el Hunminjeongeum y en el cómic de Ryan Estrada.</p>`;
  else h += HG_LEC.map((l, i) => hgLeccion(l, i + 1)).join('');
  return h;
}
// 🏛️ País: política, educación, ser médico, sueldos y población (PAIS en sociedad.js). Rejilla como la Guía.
let paisSel = null;
const negritas = t => esc(t).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/VERIFICAR/g, '<span class="ver">VERIFICAR</span>');
function viewPais(soloDetalle = false) {
  const P = typeof PAIS !== 'undefined' ? PAIS : [], g = P.find(x => x.id === paisSel);
  return `${soloDetalle ? '' : `<div class="guia-rej">${P.map(x => `<button class="guia-t ${x.id === paisSel ? 'on' : ''}" data-pais="${x.id}"><span>${x.ic}</span>${esc(x.t)}</button>`).join('')}</div>`}
    ${g ? `<div class="card guia-txt pais"><b>${g.ic} ${esc(g.t)}</b><p class="pais-intro">${negritas(g.intro)}</p>
      ${g.bloques.map(([h, xs]) => `<h3>${esc(h)}</h3><ul>${xs.map(x => `<li>${negritas(x)}</li>`).join('')}</ul>`).join('')}
      <div class="muted pais-fuentes">Fuentes (noviembre de 2026): ${g.fuentes.map(([t, u]) => `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(t)}</a>`).join(' · ')}</div></div>`
    : '<p class="muted centro">Toca un tema. Datos buscados en noviembre de 2026, con fuentes.</p>'}`;
}
// 🔤 Idioma (pestaña propia desde v161): Hangul, Frases, Diccionario, Enseñar y Favoritas.
function viewIdioma() {
  // ⭐ Favoritas primero y abiertas por defecto al entrar en Idioma.
  if (!['hangul', 'frases', 'dicc', 'ensenar', 'favs'].includes(coreaSub)) coreaSub = 'favs';
  const seg = [['favs', `⭐${arr(u().favs).length ? ' ' + arr(u().favs).length : ''}`], ['hangul', '🔤 Hangul'], ['frases', '💬 Frases'], ['dicc', '📖 Dicc.'], ['ensenar', '🪧 Enseñar']].map(([k, t]) =>
    `<button class="${coreaSub === k ? '' : 'sec'}" data-sub="${k}">${t}</button>`).join('');
  let html = `<div class="row daynav seg5">${seg}</div>`;
  if (coreaSub === 'ensenar') html += viewEnsenar();
  else if (coreaSub === 'favs') html += viewFavs();
  else if (coreaSub === 'frases') {
    let off = 0; const grupos = FRASES_SIT.map(([t, fs]) => { const g = [t, fs, off]; off += fs.length; return g; });
    const g = grupos.find(x => x[0] === fraseSit) || grupos[0];
    html += `<div class="chips sit">${grupos.map(([t]) => `<button class="chip ${t === g[0] ? 'on' : ''}" data-sit="${esc(t)}">${esc(t)}</button>`).join('')}</div>` + g[1].map((f, i) => dFila(f, 'f:' + (g[2] + i), true)).join('');
  }
  // La búsqueda se recuerda: si la pantalla se redibuja (p. ej. al cerrar el teclado), no se pierde.
  else if (coreaSub === 'dicc') html += `<input id="q" type="search" placeholder="Buscar (español, coreano o romanización)" autocomplete="off" enterkeyhint="search" value="${esc(qDic)}">
    <div id="dres">${dResultados(qDic)}</div>`;
  else if (coreaSub === 'hangul') html += viewHangul();
  return html;
}
// 🇰🇷 Corea: la Guía por bloques temáticos; País (sociedad.js) y los platos típicos van dentro. Lo que no esté en un bloque, al último.
const GUIA_BLOQUES = [
  ['🚇 Moverse', ['T-money y transporte', 'Metro y KTX', 'Taxis', 'Apps', 'Internet y móvil', 'Entrada al país']],
  ['💳 Dinero y compras', ['Dinero y pagos', 'Compras, tax free y último día', 'Propinas', 'Tiendas 24 h']],
  ['🍜 Comida', ['Comida', 'platos', 'snacks', 'En la mesa (Lonely Planet)', 'Beber a la coreana']],
  ['🙇 Costumbres y cultura', ['Etiqueta', 'Saber estar (Lonely Planet)', 'Zapatos', 'Templos', 'Fechas de vuestro viaje']],
  ['🚨 Salud, seguridad y práctico', ['Seguridad y emergencias', 'Salud y farmacias', 'Baños', 'Enchufes', 'Clima en noviembre', 'Qué llevar (Lonely Planet)', 'Lo básico (Lonely Planet)', 'Consejos de la Lonely Planet']],
  ['🏛️ País', 'pais']
];
// 🍪 Snacks: la captura que añada el usuario (solo en su móvil: localStorage 'corea.img.snacks', reducida a JPEG) y la lista con hangul.
const K_SNACKS = 'corea.img.snacks';
function guiaSnacks() {
  let img = ''; try { img = localStorage.getItem(K_SNACKS) || ''; } catch {}
  return `<div class="card guia-txt snacks"><b>🍪 Snacks de tienda 24 h</b>
    ${img ? `<div class="foto ok snack-img" data-wiki=""><img alt="" src="${img}"></div><button class="sec mini" data-snackimg="quitar">✕ Quitar la imagen</button>`
      : `<button class="sec mini" data-snackimg="poner">📷 Poner aquí tu captura (se guarda solo en tu móvil)</button>`}
    <p class="muted">Los clásicos de cualquier GS25, CU o 7-Eleven: buen recuerdo barato para regalar. Si no lo encontráis, enseñad el nombre en hangul.</p>
    ${(typeof SNACKS !== 'undefined' ? SNACKS : []).map(([es, ko, d]) => `<div class="card plato"><div><b>${esc(es)}</b><div class="muted">${esc(d)}</div></div><div class="ko">${esc(ko)}${btnHabla(ko)}</div></div>`).join('')}</div>`;
}
function ponerSnackImg() {
  const inp = document.createElement('input'); inp.type = 'file'; inp.accept = 'image/*';
  inp.onchange = async () => { const f = inp.files && inp.files[0]; if (!f) return;
    try { const bm = await createImageBitmap(f), esc0 = Math.min(1, 1100 / bm.width), cv = document.createElement('canvas');
      cv.width = Math.round(bm.width * esc0); cv.height = Math.round(bm.height * esc0); cv.getContext('2d').drawImage(bm, 0, 0, cv.width, cv.height);
      localStorage.setItem(K_SNACKS, cv.toDataURL('image/jpeg', 0.82)); render(); }
    catch { alert('No se pudo guardar la imagen (quizá es demasiado grande).'); } };
  inp.click();
}
function glosarioPlatos() {
  if (typeof PLATOS === 'undefined') return '';
  return `<div class="card guia-txt"><b>🥢 Platos típicos ${lpPill({ lp: 1 })}</b><div class="chips">${PLATOS.map(([t], gi) => `<button class="chip ${gi === platoGrupo ? 'on' : ''}" data-pg="${gi}">${esc(t)}</button>`).join('')}</div>
    ${(PLATOS[platoGrupo] || PLATOS[0])[1].map((p, i) => `<div class="card plato" data-full="p:${platoGrupo}:${i}"><div><b>${esc(p[0])}</b><div class="muted">${esc(p[2])}</div></div><div class="ko">${esc(p[1])}</div></div>`).join('')}</div>`;
}
function viewCorea() {
  const usados = new Set(GUIA_BLOQUES.flatMap(([, ts]) => Array.isArray(ts) ? ts : [])), P = typeof PAIS !== 'undefined' ? PAIS : [];
  const resto = GUIA.map(([t]) => t).filter(t => !usados.has(t));
  const btn = (k, ic, t, lp) => `<button class="guia-t ${k === guiaSel ? 'on' : ''}" data-guia="${esc(k)}"><span>${ic}</span>${esc(t)}${lp ? '<small>LP</small>' : ''}</button>`;
  const detalle = k => {
    if (k === 'platos') return glosarioPlatos();
    if (k === 'snacks') return guiaSnacks();
    if (k.startsWith('pais:')) { paisSel = k.slice(5); return viewPais(true); }
    const g = GUIA.find(([t]) => t === k); if (!g) return '';
    return `<div class="card guia-txt"><b>${icGuia(g[0])} ${esc(g[0])}</b><ul>${g[1].map(x => `<li>${resaltar(x, true)}</li>`).join('')}${g[0] === 'Dinero y pagos' ? pagoAlli() : ''}</ul></div>`;
  };
  return GUIA_BLOQUES.map(([tit, ts], bi) => {
    const items = ts === 'pais' ? P.map(x => ['pais:' + x.id, x.ic, x.t])
      : [...ts, ...(bi === GUIA_BLOQUES.length - 2 ? resto : [])].filter(t => t === 'platos' || t === 'snacks' || GUIA.some(([g]) => g === t))
        .map(t => t === 'platos' ? ['platos', '🥢', 'Platos típicos'] : t === 'snacks' ? ['snacks', '🍪', 'Snacks de tienda 24 h'] : [t, icGuia(t), t.replace(/ \(Lonely Planet\)/, ''), /Lonely/.test(t)]);
    if (!items.length) return '';
    const abierto = items.some(([k]) => k === guiaSel);
    return `<h2 class="guia-bloque">${esc(tit)}</h2><div class="guia-rej">${items.map(([k, ic, t, lp]) => btn(k, ic, t, lp)).join('')}</div>${abierto ? detalle(guiaSel) : ''}`;
  }).join('') + '<p class="muted centro">La Lonely Planet (2016) solo vale para cultura: precios y apps, verificarlos.</p>';
}


// ---------- Planes: League of Legends y cosmética ----------
let planesCat = 'curioso';
// Orden alfabético (Curioso es además la que se abre por defecto).
const PCATS = [['curioso', '✨ Curioso'], ['servicio', '🧺 Lavandería'], ['lol', '🎮 LoL'], ['ropa', '👕 Ropa']];
// Calendario del Mundial de LoL con la ciudad donde estaréis cada día.
// Cibercafés coreanos (PC bang, PC방): cómo usarlos siendo turista.
const PCBANG = `<details class="card pcbang" data-key="pcbang"><summary><b>🖥️ Cibercafés (PC bang, PC방): cómo jugar</b></summary><ul>
  <li>Hay en casi cada esquina, muchos abiertos 24 h. Buscad <b>PC방</b> en Naver Map.</li>
  <li>Sin tarjeta de socio, elegid <b>«비회원» (no socio)</b> en la máquina de la entrada y pagad por adelantado.</li>
  <li>Precio orientativo: <b>1.000-2.000 ₩ la hora</b>; más en zonas premium y en los temáticos como el T1 Base Camp. VERIFICAR en cada sitio.</li>
  <li>LoL viene instalado: entráis con vuestra cuenta de Riot. Ojo: vuestra cuenta es del servidor europeo (EUW), así que jugaréis con mucho ping. Crear cuenta en el servidor coreano suele pedir verificación coreana (VERIFICAR).</li>
  <li>Se pide comida desde el ordenador (ramen, tteokbokki…) y os la traen al sitio.</li></ul></details>`;
function worldsCard() {
  if (typeof WORLDS === 'undefined') return '';
  const hoy = todayISO(), dias = arr(trip && trip.dias);
  return `<details class="card worlds" data-key="worlds" ${abierto('worlds', false) ? 'open' : ''}><summary><b>🏆 Mundial de LoL 2026 · hora de Corea</b></summary>
    ${WORLDS.partidos.map(m => { const pas = m.f < hoy;
      // De madrugada seguís en la ciudad de la noche anterior.
      const d = dias.find(x => x.fecha === (parseInt(m.h) < 10 ? sumaDia(m.f, -1) : m.f));
      const tr = arr(trip && trip.traslados).find(t => t.fecha === m.f), sal = tr && billete(tr) && billete(tr).salida;
      const donde = !d ? '' : ck(d.ciudad) === 'espana' ? 'en el avión' : `en ${esc(d.ciudad.replace(/ \(.*\)/, ''))}`;
      const extra = donde === 'en el avión' ? donde : sal && sal <= m.h ? `en el tren a ${esc(String(tr.a).replace(/.*\((.*)\)/, '$1'))} (sale ${esc(sal)})` : donde + (tr ? ' · día de traslado' : '');
      return `<div class="w-fila ${pas ? 'pasado' : ''} ${m.f === hoy ? 'hoy' : ''} ${m.t1 || m.final ? 'top' : ''}"><span class="hora">${fmtCorto(m.f)} ${esc(m.h)}</span><span><b>${esc(m.fase)}</b> · ${esc(m.p)}${extra ? `<small class="muted"> · ${extra}</small>` : ''}</span></div>`; }).join('')}
    <div class="muted">${esc(WORLDS.nota)} <span class="ver">VERIFICAR</span></div>
    <div class="muted">Dónde verlo en grupo: T1 Base Camp (Hongdae, Gangnam y Busan, 24 h) y LoL Park en Seúl. Final: el T1 Base Camp de Busan está a unos 300 m del hotel.</div></details>`;
}
const icPlan = p => p.ic || ({ lol: '🎮', servicio: '🧺', curioso: '✨', ropa: '👕' })[p.cat] || '⭐';
function planesDe(k) {
  const P = typeof PLANES !== 'undefined' ? PLANES : [];
  if (!P.some(p => p.ciudad === k)) return `${worldsCard()}<p class="muted">No hay planes guardados en esta ciudad.</p>`;
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
      <div class="muted">${resaltar(p.desc, true)}</div>
      ${p.direccion_en ? `<div class="muted">📌 ${esc(p.direccion_en)}</div>` : ''}
      ${p.nota ? `<div class="muted">🕒 ${resaltar(p.nota, true)}</div>` : ''}
      ${p.precio ? `<div class="pl-precio">💰 ${resaltar(p.precio, true)}</div>` : ''}
      ${p.opiniones || p.resenas ? `<div class="pl-resenas">${p.opiniones ? `<b>⭐ ${esc(String(p.opiniones.v).replace('.', ','))}</b> <span class="muted">(${esc(p.opiniones.n)} reseñas, ${esc(p.opiniones.fuente)})</span> ` : ''}${p.resenas ? `👥 ${esc(p.resenas)}` : ''}</div>` : ''}
      ${otros.length || plan.length ? `<details class="pl-cerca" data-key="plc:${esc(p.id)}" ${abierto('plc:' + p.id, false) ? 'open' : ''}><summary>📍 Cerca${otros.length ? `: ${otros.length} ${otros.length === 1 ? 'plan' : 'planes'}` : ''}${plan.length ? ` · 📅 ${plan.length} de vuestro plan` : ''}</summary>
        ${otros.length ? `<div class="cerca">${otros.map(([o, d]) => `${icPlan(o)} ${esc(o.es)} <span class="muted">${fmtDist(d)}</span>`).join(' · ')}</div>` : ''}
        ${plan.length ? `<div class="cerca">📅 ${plan.map(([l, d, e]) => `${esc(l.es)} <span class="muted">(día ${e.n}, ${fmtDist(d)})</span>`).join(' · ')}</div>` : ''}</details>` : ''}
      <div class="acciones">${naver(p)}<button class="mini" data-full="pl:${i}">Enseñar</button></div>${estrBox(hKey(p), icPlan(p) + ' ' + p.es)}</div>`;
  };
  const grupo = (cat, t) => { const ls = P.filter(p => p.ciudad === k && p.cat === cat).sort((a, b) => (km(hotelDe(k) || [0, 0], coordsLugar(a) || [0, 0]) - km(hotelDe(k) || [0, 0], coordsLugar(b) || [0, 0])));
    return ls.length ? (t ? `<h2>${t}</h2>` : '') + ls.map(card).join('') : ''; };
  return `<p class="muted">Horarios de webs (nov 2026): compruébalos antes de ir.</p>
    ${worldsCard()}${(() => { const cats = PCATS.filter(([c]) => P.some(p => p.ciudad === k && p.cat === c)); if (!cats.some(([c]) => c === planesCat)) planesCat = (cats[0] || [])[0];
      return `<div class="row daynav pcats">${cats.map(([c, t]) => `<button class="${c === planesCat ? '' : 'sec'}" data-pcat="${c}">${t}</button>`).join('')}</div>` + (planesCat === 'lol' ? PCBANG : '') + grupo(planesCat, ''); })()}`;
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
// Clave por hangul (si lo hay) o por nombre: así el mismo sitio en Ciudades, Enseñar, Hoy y Comer comparte marca.
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
const btnHecho = (l, k) => `<button class="hk ${hecho(l, k) ? 'on' : ''}" data-hk="${esc(hKey(l))}" data-v="${hecho(l, k) ? 0 : 1}" aria-label="Marcar como visitado">${hecho(l, k) ? '✅ Visitado' : '☐ Visitado'}</button>`;


// ---------- Comer (data/comer.json + lugares propios) ----------
let DATOS_COMER = [];
cargaDatos('data/comer.json', d => { DATOS_COMER = arr(d); });
const CIUDADES_COMER = [['seul', 'Seúl'], ['andong', 'Andong'], ['gyeongju', 'Gyeongju'], ['busan', 'Busan'], ['jeonju', 'Jeonju']];
const TIPOS = ['todos', 'restaurante', 'café', 'mercado', 'plato', 'bar'];
const ESTADOS = [['quiero', 'Quiero'], ['visitado', 'Visitado'], ['descartado', 'Descartado'], ['cerrado', 'Cerrado']];
const FUENTES = { itinerario: 'Itinerario', guia: 'Guía web (no verificado)', lonely: 'Lonely Planet 2016', lonely24: 'Lonely Planet 2024', propio: 'Propio' };
let platoGrupo = 0;
let comerCiudad = null, comerTipo = 'todos', comerForm = false, comerEstado = 'todos', comerOrden = 'rec';
const lugaresComer = () => [...DATOS_COMER, ...arr(u().comerPropios)].filter(l => l && typeof l === 'object');
const estadoDe = id => (u().comer && user.comer[id]) || {};

// ⚠️ Mucho ojo con…: aviso en la tarjeta o ficha del sitio y desplegable con todos los de la ciudad.
const ojoDe = (id, ko) => (typeof MUCHO_OJO !== 'undefined' ? MUCHO_OJO : []).find(o => (id && o.ids.includes(String(id))) || (ko && String(ko).replace(/\s+/g, '') === o.ko));
const ojoLinea = o => o ? `<div class="ojo">⚠️ <b>Mucho ojo:</b> ${esc(o.txt)}</div>` : '';
// tipo: 'comer' (por defecto, en Comer) o 'planes' (en Planes, arriba de cada ciudad).
function muchoOjo(ciudad, tipo = 'comer') {
  const os = (typeof MUCHO_OJO !== 'undefined' ? MUCHO_OJO : []).filter(o => (o.tipo || 'comer') === tipo && (!ciudad || ciudad === 'todas' || o.ciudad === ciudad)); if (!os.length) return '';
  const key = 'ojo:' + tipo + ':' + (ciudad || '');
  return `<details class="card ojo-card" data-key="${esc(key)}" ${abierto(key, false) ? 'open' : ''}><summary><b>⚠️ Mucho ojo con… (${os.length})</b> <span class="muted">${tipo === 'planes' ? 'famosos con pegas' : 'famosos con quejas'}</span></summary>
    ${os.map(o => `<div class="ojo-item"><b>${esc(o.es)}</b><p>${esc(o.txt)}</p><div class="muted">Fuentes: ${o.fuentes.map(([t, u]) => `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(t)}</a>`).join(' · ')}</div></div>`).join('')}</details>`;
}
// 🔎 Lo mejor valorado según Naver: no se puede consultar desde aquí, así que botones que abren Naver Map con la búsqueda hecha
// (zonas del itinerario y del hotel). Allí se ven la nota y las reseñas de verdad; lo que os guste se añade a Comer.
const NAVER_TOP = {
  seul: ['명동 맛집', '을지로 맛집', '익선동 맛집', '광장시장 맛집', '남대문시장 맛집', '서울 빵집'],
  andong: ['안동 맛집', '안동 구시장 찜닭'],
  gyeongju: ['황리단길 맛집', '경주 황남동 맛집', '황리단길 카페', '황리단길 디저트', '불국사 맛집'],
  busan: ['해운대 맛집', '해운대 시장 맛집', '광안리 맛집', '남포동 맛집', '자갈치 맛집', '해운대 카페'],
  jeonju: ['전주 한옥마을 맛집', '전주 남부시장 맛집', '전주 한옥마을 카페', '전주 빵집']
};
function naverTop(k) {
  const qs = NAVER_TOP[k]; if (!qs) return '';
  const key = 'ntop:' + k;
  return `<details class="card ntop" data-key="${key}" ${abierto(key, false) ? 'open' : ''}><summary>🔎 <b>Lo mejor valorado en Naver</b> <small class="muted">· abre Naver con la búsqueda hecha</small></summary>
    <p class="muted">Desde aquí no se pueden leer las notas de Naver. Toca una zona y mirad la ★ y el número de reseñas de cada sitio: los de más de 4,75 con miles de reseñas suelen ser apuesta segura. Si os gusta uno, mandadme la captura y lo añado.</p>
    <div class="acciones">${qs.map(q => `<a class="btn sec mini" href="https://m.map.naver.com/search2/search.naver?query=${encodeURIComponent(q)}" data-app="naver" data-q="${esc(q)}" target="_blank" rel="noopener">🗺️ ${esc(q)}</a>`).join('')}</div></details>`;
}
function viewComer(dentro = false) {
  if (comerCiudad === null) {
    const k = ck(ciudadActual());
    comerCiudad = CIUDADES_COMER.some(c => c[0] === k) ? k : 'todas';
  }
  const base = lugaresComer().filter(l => (comerCiudad === 'todas' || l.ciudad === comerCiudad) && (comerTipo === 'todos' || l.tipo === comerTipo));
  const est = l => estadoDe(String(l.id)).estado || '';
  const n = v => base.filter(l => est(l) === v).length;
  let lista = base.filter(l => comerEstado === 'todos' ? true : comerEstado === 'cerca' ? distKm(l) <= 1.2 : comerEstado === 'pendiente' ? !est(l) : est(l) === comerEstado);
  lista = ordenarComer(lista);
  const chip = (attr, v, t, on) => `<button class="chip ${on ? 'on' : ''}" ${attr}="${esc(v)}">${esc(t)}</button>`;
  const opt = (v, t, on) => `<option value="${esc(v)}" ${on ? 'selected' : ''}>${esc(t)}</option>`;
  const enC = l => comerCiudad === 'todas' || l.ciudad === comerCiudad;
  const tipos = TIPOS.slice(1).map(t => [t, lugaresComer().filter(l => enC(l) && l.tipo === t).length]).filter(([t, nt]) => nt || comerTipo === t);
  const chipN = (attr, v, t, nn, on, tit) => `<button class="chip ${on ? 'on' : ''}" ${attr}="${esc(v)}" title="${esc(tit)}">${esc(t)} <small>${nn}</small></button>`;
  const ordIc = { rec: '🏅', nota: '👥', dist: '📏', val: '★' };
  const ord = { rec: '🏅 Recomendado', nota: '👥 Mejor valorados', dist: '📏 Más cerca del hotel', val: '★ Mi valoración' }, sigOrd = { rec: 'nota', nota: 'dist', dist: 'val', val: 'rec' };
  return buscadorHTML('qcm', qCom, 'Buscar sitio para comer (nombre, plato…)', resComer(qCom)) + (dentro ? '' : `<div class="cc-row">${[['todas', 'Todas', '🗺️'], ...CIUDADES_COMER.map(([k, t]) => [k, t, tema(k).ic])].map(([k, t, ic]) =>
      `<button class="cbtn ${comerCiudad === k ? 'on' : ''}" ${k !== 'todas' ? `style="${varsTema(k)}"` : ''} data-cc="${k}"><span>${ic}</span>${esc(t)}</button>`).join('')}</div>`) + `
    <div class="chips qv-fila">${chipN('data-ct', 'todos', 'Todo', lugaresComer().filter(enC).length, comerTipo === 'todos', 'Todo')}${tipos.map(([t, nt]) => chipN('data-ct', t, IC_COMER[t] || t, nt, comerTipo === t, t[0].toUpperCase() + t.slice(1))).join('')}</div>
    <div class="chips qv-fila"><button class="chip qv-ord" data-co="${sigOrd[comerOrden] || 'rec'}" title="Orden: ${esc(ord[comerOrden] || ord.rec)} (tocar para cambiar)">⇅${(ordIc[comerOrden] || ordIc.rec)}</button><span class="qv-sep"></span>${chipN('data-ce', 'cerca', '📍', base.filter(l => distKm(l) <= 1.2).length, comerEstado === 'cerca', 'Cerca del hotel (≤1,2 km)')}${chipN('data-ce', 'quiero', '⭐', n('quiero'), comerEstado === 'quiero', 'Quiero ir')}${chipN('data-ce', 'visitado', '✅', n('visitado'), comerEstado === 'visitado', 'Visitados')}${chipN('data-ce', 'pendiente', '☐', base.filter(l => !est(l)).length, comerEstado === 'pendiente', 'Sin marcar')}</div>
    <p class="muted mini-nota c2-leyenda">⇅ ${esc(ord[comerOrden] || ord.rec)} · ${lista.length} lugares</p>
    ${muchoOjo(comerCiudad)}${naverTop(comerCiudad)}
    ${lista.map((l, i) => (comerFuera(l) && !(i && comerFuera(lista[i - 1])) ? `<div class="qv-grupo">👎 Descartados y cerrados · ${lista.filter(comerFuera).length}</div>` : '') + cardComer(l)).join('') || '<p class="muted">No hay lugares con este filtro.</p>'}
    ${comerForm ? formComer() : '<button class="sec" data-act="comer-nuevo">＋ Añadir lugar</button>'}`;
}

// Orden: recomendado (Quiero, itinerario, ★ Lonely, guía…), distancia al hotel o mi valoración.
function puntos(l) {
  const e = estadoDe(String(l.id));
  if (['descartado', 'cerrado'].includes(e.estado)) return -100;
  const gp = arr(l.guias).reduce((s, g) => s + (g.g === 'michelin' ? (/estrella/.test(g.d) ? 45 : 35) : 20), 0);
  return gp + (e.estado === 'quiero' ? 100 : 0) + (l.fuente === 'itinerario' ? 50 : 0) + (/★/.test(l.nota || '') ? 30 : 0)
    + (l.fuente === 'guia' ? 20 : l.fuente === 'lonely' || l.fuente === 'lonely24' ? 10 : 0) + (l.lp24 ? 5 : 0) + (Number(e.val) || 0) * 5 - (e.estado === 'visitado' ? 40 : 0);
}
function distKm(l) { const h = hotelDe(l.ciudad), p = coordsLugar(l); return h && p ? km(h, p) : Infinity; }
// Al salir de las casillas de nota se redibuja (no mientras se pasa de una a otra).
let opPend = false;
document.addEventListener('focusout', e => { if (opPend && !(e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest('.op-form'))) { opPend = false; setTimeout(render, 50); } });
// Nota de usuarios: la que apuntáis vosotros (user.comer[id].op) o la guardada en comer.json (opiniones).
const opinionDe = l => { const o = estadoDe(String(l.id)).op; return o && Number(o.v) ? o : l.opiniones && Number(l.opiniones.v) ? l.opiniones : null; };
// Valoración ajustada por número de reseñas (pocas reseñas pesan menos).
const notaAjustada = l => { const o = opinionDe(l); if (!o) return 0; const n = Number(o.n) || 5; return (Number(o.v) * n + 3.8 * 30) / (n + 30); };
const fmtN = n => n == null || n === '' ? '' : Number(n) >= 1000 ? (Number(n) / 1000).toLocaleString('es-ES', { maximumFractionDigits: 1 }) + ' mil' : String(n);
// Orden congelado: al marcar (⭐ ✅ 👎 🚫 o valorar) la lista no se reordena hasta cambiar de filtro o de pestaña.
let comerCongelado = false, comerOrdenPrev = { k: '', ids: [] };
// 👎 Descartados y 🚫 cerrados, siempre al fondo (también con el orden congelado) y plegados.
const comerFuera = l => ['descartado', 'cerrado'].includes(estadoDe(String(l.id)).estado);
function ordenarComer(ls) { const r = ordenarComer1(ls); return [...r.filter(l => !comerFuera(l)), ...r.filter(comerFuera)]; }
function ordenarComer1(ls) {
  const clave = [comerCiudad, comerTipo, comerEstado, comerOrden, qCom].join('|');
  if (comerCongelado && comerOrdenPrev.k === clave) { const pos = new Map(comerOrdenPrev.ids.map((id, i) => [id, i]));
    return ls.map((l, i) => [l, pos.has(String(l.id)) ? pos.get(String(l.id)) : 1e6 + i]).sort((a, b) => a[1] - b[1]).map(x => x[0]); }
  const res = ordenarComer0(ls); comerOrdenPrev = { k: clave, ids: res.map(l => String(l.id)) }; return res;
}
function ordenarComer0(ls) {
  const r = ls.map((l, i) => [l, i]);
  const f = comerOrden === 'dist' ? ([a], [b]) => distKm(a) - distKm(b)
    : comerOrden === 'nota' ? ([a], [b]) => notaAjustada(b) - notaAjustada(a) || puntos(b) - puntos(a)
    : comerOrden === 'val' ? ([a], [b]) => (Number(estadoDe(String(b.id)).val) || 0) - (Number(estadoDe(String(a.id)).val) || 0) || puntos(b) - puntos(a)
    : ([a], [b]) => ((enPlan(a) || {}).n || 999) - ((enPlan(b) || {}).n || 999) || puntos(b) - puntos(a);
  return r.sort((x, y) => f(x, y) || x[1] - y[1]).map(x => x[0]);
}

function cardComer(l) {
  const card = cardComer0(l); if (!comerFuera(l)) return card;
  const id = String(l.id ?? ''), e = estadoDe(id).estado, k = `cmd:${id}:${e}`; // con el estado en la clave, se vuelve a plegar al descartar otra vez
  return `<details class="comer-fuera est-${esc(e)}" data-key="${esc(k)}" ${abierto(k, false) ? 'open' : ''}><summary>${e === 'cerrado' ? '🚫' : '👎'} <b>${esc(l.nombre || 'Sin nombre')}</b>${l.ko ? ` <span class="ko-s">${esc(l.ko)}</span>` : ''} <small class="muted">${e === 'cerrado' ? 'Cerrado' : 'Descartado'}</small></summary>${card}</details>`;
}
function cardComer0(l) {
  const id = String(l.id ?? ''), e = estadoDe(id), q = l.ko || l.nombre || '';
  const ciudad = (CIUDADES_COMER.find(c => c[0] === l.ciudad) || [])[1] || l.ciudad || '';
  const w = wikiDe(l), meta = [l.plato, l.precio ? '💰 ' + l.precio + precioEur(l.precio).replace(/<[^>]+>/g, '') : '', l.horario ? '🕒 ' + l.horario : '', comerCiudad === 'todas' ? ciudad : ''].filter(Boolean);
  const comp = l.comprobado ? { activo: '🟢 Abierto (fuentes recientes)', existe: '🟡 En listados actuales', dudoso: '🟠 Dudoso', 'no encontrado': '🔴 No encontrado' }[l.comprobado.estado] : '';
  return `<div class="card comer c2 ${tipoClase(l.tipo)} est-${esc(e.estado || '')}">
    <div class="c2-top">
      ${w ? `<div class="foto mini c2-foto" data-wiki="${esc(w)}"><span>${IC_COMER[l.tipo] || '🍽️'}</span></div>` : `<div class="c2-ic">${IC_COMER[l.tipo] || '🍽️'}</div>`}
      <div class="c2-txt">
        <div class="c2-nom"><b>${esc(l.nombre || 'Sin nombre')}</b>${lpPill(l)}</div>
        <div class="c2-sub">${l.ko ? `<span class="ko-s">${esc(l.ko)}</span>` : ''}${distHotel(l, l.ciudad)}</div>
        ${meta.length ? `<div class="c2-meta">${meta.map(esc).join(' · ')}</div>` : ''}${ojoLinea(ojoDe(l.id))}
        ${arr(l.guias).map(g => `<span class="c2-guia ${g.g}" title="${g.g === 'michelin' ? 'Guía Michelin Seúl y Busan' : 'Blue Ribbon Survey'}">${g.g === 'michelin' ? '🔴 Michelin' : '🎗️ Blue Ribbon'} ${esc(g.d)}${g.anio ? ' ' + esc(g.anio) : ''}${g.verificar ? ' <span class="ver">VERIFICAR</span>' : ''}</span>`).join('')}
        ${(o => o ? `<span class="c2-op" title="${esc(o.fuente || '')}${o.fecha ? ', ' + esc(o.fecha) : ''}">👥 ★${Number(o.v).toLocaleString('es-ES')}${o.n ? ` · ${fmtN(o.n)} reseñas` : ''}${o.fuente ? ` · ${esc(String(o.fuente).split(' (')[0])}` : ''}</span>` : '')(opinionDe(l))}${planBadge(l)}${comp ? `<span class="c2-comp">${comp}</span>` : ''}
      </div>
    </div>
    <div class="c2-acc">
      ${ESTADOS.map(([k, t]) => `<button class="c2-est ${e.estado === k ? 'on' : ''} e-${k}" data-est="${esc(id)}" data-v="${k}" title="${t}">${{ quiero: '⭐', visitado: '✅', descartado: '👎', cerrado: '🚫' }[k]}<small>${t}</small></button>`).join('')}
      <button class="mini" data-full="k:${esc(id)}">Enseñar</button>
      ${q ? `<a class="btn sec mini" href="https://m.map.naver.com/search2/search.naver?query=${encodeURIComponent(q)}" data-app="naver" data-q="${esc(q)}" target="_blank" rel="noopener">🗺️</a>${googleMaps((l.ko || l.nombre || '') + ' ' + ciudad, 'G')}` : ''}
    </div>
    <details class="c2-mas" data-key="cm:${esc(id)}" ${abierto('cm:' + id, false) ? 'open' : ''}><summary>Más detalles${e.nota ? ' · 📝' : ''}${Number(e.val) ? ' · ' + '★'.repeat(Number(e.val)) : ''}</summary>
      ${l.direccion ? `<div class="muted">📍 ${esc(l.direccion)}</div>` : ''}
      ${l.nota ? `<div class="muted">${resaltar(l.nota, true)}</div>` : ''}
      <div class="muted">Fuente: ${esc(FUENTES[l.fuente] || l.fuente || '—')}${l.url ? ` · <a href="${esc(l.url)}" target="_blank" rel="noopener">enlace</a>` : ''}</div>
      ${l.comprobado && l.comprobado.nota ? `<div class="muted">🔎 ${esc(l.comprobado.nota)}${l.comprobado.fecha ? ' (' + esc(l.comprobado.fecha) + ')' : ''}</div>` : ''}
      <div>${verificado('k:' + id) ? '<span class="badge ok">✓ verificado</span>' : '<span class="ver">VERIFICAR que sigue abierto</span>'}
        <button class="sec mini verif" data-verif="k:${esc(id)}">${verificado('k:' + id) ? 'Deshacer' : '✓ Verificado'}</button></div>
      <div class="op-caja"><b>👥 Notas de usuarios</b>${(o => o ? `<div class="muted">Guardada: ★${esc(o.v)}${o.n ? ' · ' + esc(fmtN(o.n)) + ' reseñas' : ''} · ${esc(o.fuente || '')} · ${esc(o.fecha || '')}</div>` : '<div class="muted">Sin nota guardada.</div>')(opinionDe(l))}
        <div class="acciones op-links"><a class="btn sec mini" href="https://m.map.naver.com/search2/search.naver?query=${encodeURIComponent(q)}" data-app="naver" data-q="${esc(q)}" target="_blank" rel="noopener">Naver</a><a class="btn sec mini" href="https://m.map.kakao.com/actions/searchView?q=${encodeURIComponent(q)}" data-app="kakao" data-q="${esc(q)}" target="_blank" rel="noopener">Kakao</a><a class="btn sec mini" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((l.ko || l.nombre || '') + ' ' + ciudad)}" target="_blank" rel="noopener">Google</a></div>
        <div class="op-form">Apuntar: ★ <input data-opv="${esc(id)}" type="number" step="0.1" min="0" max="5" inputmode="decimal" value="${esc((estadoDe(id).op || {}).v || '')}" placeholder="4.3">
          reseñas <input data-opn="${esc(id)}" type="number" min="0" inputmode="numeric" value="${esc((estadoDe(id).op || {}).n || '')}" placeholder="1200">
          <select data-opf="${esc(id)}">${['Naver', 'Kakao', 'Google'].map(f => `<option ${((estadoDe(id).op || {}).f || 'Naver') === f ? 'selected' : ''}>${f}</option>`).join('')}</select></div></div>
      <div class="estrellas">Mi valoración: ${[1, 2, 3, 4, 5].map(v => `<button class="star ${(Number(e.val) || 0) >= v ? 'on' : ''}" data-val="${esc(id)}" data-n="${v}" aria-label="${v} estrellas">★</button>`).join('')}</div>
      <textarea data-cnota="${esc(id)}" rows="1" placeholder="Nota propia…">${esc(e.nota || '')}</textarea>
      <div class="acciones">${l.ko ? `<button class="sec mini" data-copy="${esc(l.ko)}">📋 Copiar coreano</button>` : ''}${l.fuente === 'propio' ? `<button class="sec mini" data-delcomer="${esc(id)}">✕ Borrar</button>` : ''}</div>
    </details>
  </div>`;
}

function formComer() {
  const def = comerCiudad === 'todas' ? 'seul' : comerCiudad;
  return `<form class="card" data-comerform>
    <div class="muted">Nuevo lugar</div>
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
  if (TIEMPO && TIEMPO.ts && TIEMPO.h && Date.now() - TIEMPO.ts < 3 * 3600e3) return;
  const ks = [...new Set(arr(trip.dias).map(d => ck(d.ciudad)))].filter(k => coordsCiudad(k));
  const nuevo = { ts: Date.now(), c: {}, h: {} };
  await Promise.all(ks.map(async k => {
    const [la, lo] = coordsCiudad(k);
    try {
      const d = await (await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${la.toFixed(3)}&longitude=${lo.toFixed(3)}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&hourly=weather_code,precipitation_probability,temperature_2m&timezone=Asia%2FSeoul&forecast_days=16`, { cache: 'no-store' })).json();
      const t = d && d.daily; if (!t || !t.time) return;
      nuevo.c[k] = {}; t.time.forEach((f, i) => { nuevo.c[k][f] = [t.weather_code[i], t.temperature_2m_max[i], t.temperature_2m_min[i], t.precipitation_probability_max[i]]; });
      // Por horas, solo de 8 a 23 h (lo que se vive del día): [hora, código, % lluvia, temperatura].
      const hh = d.hourly; if (hh && hh.time) { nuevo.h[k] = {}; hh.time.forEach((x, i) => { const f = x.slice(0, 10), h = +x.slice(11, 13); if (h < 8 || h > 23) return;
        (nuevo.h[k][f] = nuevo.h[k][f] || []).push([h, hh.weather_code[i], hh.precipitation_probability[i], hh.temperature_2m[i]]); }); }
    } catch { /* sin conexión o servicio caído */ }
  }));
  if (!Object.keys(nuevo.c).length) return;
  TIEMPO = { ts: nuevo.ts, c: { ...((TIEMPO && TIEMPO.c) || {}), ...nuevo.c }, h: { ...((TIEMPO && TIEMPO.h) || {}), ...nuevo.h } };
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
function chipTiempo(d) {
  const t = tiempoDe(ck(d.ciudad), d.fecha); if (!t) return '';
  const [c, mx, mn, p] = t;
  return `<div class="dia-tiempo"><span class="t-ic">${icTiempo(c)}</span><b>${Math.round(mn)}° / ${Math.round(mx)}°</b><span>${descTiempo(c)}</span>${p != null ? `<span>💧 ${p} %</span>` : ''}<small>${haceTiempo()}</small></div>`;
}
// ⏱️ Por horas, en bloques de 2 h (8-10 … 22-24): el peor cielo y la mayor probabilidad de lluvia de cada bloque. Una fila.
function horasTiempo(d) {
  const hs = TIEMPO && TIEMPO.h && TIEMPO.h[ck(d.ciudad)] && TIEMPO.h[ck(d.ciudad)][d.fecha]; if (!hs || !hs.length) return '';
  const ahora = d.fecha === todayISO() ? new Date().getHours() : -1, bl = [];
  for (let h = 8; h < 24; h += 2) { const xs = hs.filter(x => x[0] >= h && x[0] < h + 2); if (!xs.length) continue;
    const c = Math.max(...xs.map(x => x[1] ?? 0)), p = Math.max(...xs.map(x => x[2] ?? 0)), t = Math.round(xs.reduce((a, x) => a + (x[3] ?? 0), 0) / xs.length);
    bl.push({ h, c, p, t, ya: ahora >= h + 2 }); }
  return `<div class="t-horas">${bl.map(b => `<span class="t-h ${b.p >= 50 ? 'lluvia' : b.p >= 25 ? 'quiza' : ''} ${b.ya ? 'ya' : ''}" title="${b.h}-${b.h + 2} h: ${descTiempo(b.c)}, ${b.p} % de lluvia"><small>${b.h}h</small><i>${icTiempo(b.c)}</i><small>${b.p >= 25 ? b.p + '%' : b.t + '°'}</small></span>`).join('')}</div>`;
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
  if (forzar === true) alert('No se pudo actualizar el cambio (¿sin conexión?).');
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
  return `<div class="card"><b>${hechos} de ${total} verificados</b></div>
    ${g.map(([t, ls]) => { const p = ls.filter(x => !verificado(x.key)).length; return `<details data-key="vf:${esc(t)}" ${abierto('vf:' + t, false) ? 'open' : ''}><summary class="card big">${esc(t)} <span class="muted">${p ? p + ' pendientes' : '✓ todo'}</span></summary>
      ${ls.map(x => `<div class="card lugar ${verificado(x.key) ? 'hecho' : ''}"><div><div>${esc(x.titulo)}</div><div class="muted">${esc(x.sub || '')}</div></div>
        <div class="acciones">${x.q ? `<a class="btn sec mini" href="https://m.map.naver.com/search2/search.naver?query=${encodeURIComponent(x.q)}" data-app="naver" data-q="${esc(x.q)}" target="_blank" rel="noopener">🗺️</a>` : ''}
        <button class="mini ${verificado(x.key) ? 'sec' : ''}" data-verif="${esc(x.key)}">${verificado(x.key) ? 'Deshacer' : '✓'}</button></div></div>`).join('')}</details>`; }).join('')}`;
}

// Más con rejilla de iconos, como la Guía de Corea: se toca un tema y sale debajo.
let masSub = 'maleta';
const MAS_SUB = [['maleta', 'Maleta', '🧳'], ['seguro', 'Seguro', '🛡️'], ['verificar', 'Verificar', '🔎'],
  ['docs', 'Documentos', '📄'], ['notas', 'Notas', '📝'], ['regalos', 'Regalos', '🎁'], ['resumen', 'Resumen del viaje', '📖'], ['escala', 'Escala Pekín', '🇨🇳'], ['datos', 'Datos y app', '⚙️']];
function viewMas() {
  const pend = trip ? pendientesVerificar().reduce((a, [, ls]) => a + ls.filter(x => !verificado(x.key)).length, 0) : 0;
  const subs = trip ? MAS_SUB : MAS_SUB.filter(([k]) => k === 'datos');
  if (!subs.some(([k]) => k === masSub)) masSub = subs[0][0];
  const rej = `<div class="guia-rej">${subs.map(([k, t, ic]) => `<button class="guia-t ${k === masSub ? 'on' : ''}" data-ms="${k}"><span>${ic}</span>${t}${k === 'verificar' && pend ? `<small>${pend}</small>` : ''}</button>`).join('')}</div>`;
  let c = '';
  if (masSub === 'maleta') { const docs = arr(trip.checklist_documentos).map((d, i) => ({ id: d.id || 'd' + i, texto: d.texto, url: d.url })); c = `<h2>🧳 Maleta y documentos</h2>${checks('docs', docs)}`; }
  else if (masSub === 'seguro') c = viewSeguro();
  else if (masSub === 'verificar') c = viewVerificar();
  else if (masSub === 'docs') c = viewFotos();
  else if (masSub === 'escala') c = viewEscala();
  else if (masSub === 'regalos') c = viewRegalos();
  else if (masSub === 'resumen') c = viewResumen();
  else if (masSub === 'notas') c = `<h2>📝 Notas</h2><textarea data-notas rows="10" placeholder="Escribe aquí… (se guarda solo)">${esc(u().notas)}</textarea>${diarioResumen()}`;
  else c = `<h2>Datos del viaje</h2>
    <button data-act="import">📂 Importar viaje</button>
    <button class="sec" data-act="export">💾 Exportar copia</button>
    <h2>Con el otro móvil</h2>
    <button class="sec" data-act="marcas">📤 Pasar mis marcas</button>
    <p class="muted">Manda por WhatsApp un archivo con visitados, favoritas, diario, Comer y regalos. En el otro móvil: 📂 Importar viaje y elegirlo; se unen a las suyas sin borrar nada.</p>
    <p class="muted">Última copia: <b>${esc(localStorage.getItem('corea.ultimaCopia') || 'nunca')}</b></p>
    <h2>App</h2>
    ${prepCard()}
    ${usoCard()}
    <button class="sec" data-act="update">🔄 Forzar actualización (no borra tus datos)</button>
    <button class="danger" data-act="wipe">Borrar datos de este móvil</button>
    <p class="muted" id="ver">Versión: ${esc(window.VERSION || '…')}</p>`;
  return rej + c;
}

// ---------- 🔍 Buscador global: todo a la vez (sitios, Comer, Miscelánea, días, frases, palabras, Guía, Historia) ----------
let qG = '', buscaTras = null;
function abrirBusca() {
  if (document.getElementById('busca-pop')) return;
  const d = document.createElement('div'); d.id = 'busca-pop';
  d.innerHTML = `<div class="pop-caja"><div class="pop-cab"><input id="qg" type="search" placeholder="Buscar en toda la app (sitio, plato, frase…)" autocomplete="off" enterkeyhint="search" value="${esc(qG)}"><button class="sec mini" data-close>✕</button></div><div class="pop-cuerpo" id="rqg">${resGlobal(qG)}</div></div>`;
  document.body.appendChild(d); history.pushState({ full: 1 }, '');
  const i = d.querySelector('#qg'); i.focus(); i.select();
  i.addEventListener('input', () => { qG = i.value; d.querySelector('#rqg').innerHTML = resGlobal(qG); });
  // Al tocar un resultado se cierra el buscador (con «atrás», para no dejar historia de más) y se va a su sitio.
  d.addEventListener('click', e => {
    if (e.target === d) { history.back(); return; }
    if (e.target.closest('[data-habla],[data-fav]')) return;
    const r = e.target.closest('.bg-r'); if (!r) return;
    e.preventDefault(); e.stopPropagation();
    const ds = { ...r.dataset }; delete ds.bg;
    buscaTras = () => { const b = document.createElement('button'); b.hidden = true; Object.assign(b.dataset, ds); document.body.appendChild(b); b.click(); b.remove(); };
    history.back();
  }, true);
}
function resGlobal(q) {
  const a = nb(q).trim(); if (a.length < 2) return '<p class="muted centro">Escribe al menos 2 letras. Busca a la vez en Planes, Comer, Miscelánea, el itinerario, Frases, Diccionario, la Guía y la Historia (también en hangul).</p>';
  const fila = (attrs, ic, t, sub, ko) => `<div class="bg-r" data-bg ${attrs}><span class="bg-ic">${ic}</span><span class="bg-t"><b>${esc(t)}</b>${ko ? ` <span class="ko-s">${esc(ko)}</span>` : ''}<small class="muted">${sub}</small></span></div>`;
  const G = [], grupo = (tit, rs, n = 6) => { if (rs.length) G.push(`<div class="bg-g">${tit} <span class="muted">${rs.length}</span></div>` + rs.sort((x, y) => y.p - x.p).slice(0, n).map(x => x.h).join('') + (rs.length > n ? `<p class="muted bg-mas">y ${rs.length - n} más: afina la búsqueda</p>` : '')); };
  const D = typeof DIA_LP !== 'undefined' ? DIA_LP : {};
  const sit = []; ciudadesCatalogo().forEach(k => sitiosCiudadObj(k).forEach(l => { const h = hKey(l), txt = D[h.slice(2)] || D[h] || l.desc || l.nota || '';
    const p = coincide(q, [l.es, l.ko, l.romanizacion].join(' '), [l.tipo, txt].join(' ')); if (p) sit.push({ p, h: fila(`data-irqv="${esc(k)}" data-h="${esc(h)}"`, icSitio((l.tipo || '') + ' ' + l.es), l.es, `${tema(k).ic} ${esc(nombreCiudad(k))} · Planes`, l.ko) }); }));
  grupo('🏯 Puntos de interés', sit);
  grupo('🍜 Comer', lugaresComer().map(l => ({ l, p: coincide(q, [l.nombre, l.ko].join(' '), [l.plato, l.tipo, l.nota, l.direccion].join(' ')) })).filter(x => x.p)
    .map(({ l, p }) => ({ p, h: fila(`data-ircomer="${esc(l.ciudad)}" data-q="${esc(l.nombre)}"`, '🍜', l.nombre, `${tema(l.ciudad).ic} ${esc(nombreCiudad(l.ciudad))}${l.plato ? ' · ' + esc(l.plato) : ''}`, l.ko) })));
  grupo('🧩 Miscelánea', (typeof PLANES !== 'undefined' ? PLANES : []).map(l => ({ l, p: coincide(q, [l.es, l.ko, l.romanizacion].join(' '), [l.desc, l.direccion_en, l.cat].join(' ')) })).filter(x => x.p)
    .map(({ l, p }) => ({ p, h: fila(`data-irplan="${esc(l.ciudad)}" data-cat="${esc(l.cat || '')}"`, icPlan(l), l.es, `${tema(l.ciudad).ic} ${esc(nombreCiudad(l.ciudad))} · Miscelánea`, l.ko) })));
  grupo('📅 Itinerario', arr(trip && trip.dias).map((d, i) => { const its = [d.titulo, ...arr(d.items).map(x => x && x.texto)].filter(Boolean), m = its.find(t => nb(t).includes(a));
    return m ? { p: 1, i, h: fila(`data-bdia="${i}"`, tema(ck(d.ciudad)).ic, `Día ${i + 1} · ${fmtCorto(d.fecha)} · ${d.ciudad || ''}`, esc(recorta(m, 90))) } : null; }).filter(Boolean).map(x => ({ ...x, p: -x.i })), 8);
  grupo('💬 Frases', FRASES.map((f, i) => ({ f, i, p: coincide(q, f[0] + ' ' + f[1], f[2]) })).filter(x => x.p)
    .map(({ f, i, p }) => ({ p, h: `<div class="bg-r bg-ko" data-bg data-full="f:${i}"><span class="bg-ic">💬</span><span class="bg-t"><b>${esc(f[0])}</b><small><span class="ko-s">${esc(f[1])}</span> · ${esc(f[2])}</small></span>${btnHabla(f[1])}</div>` })));
  const pal = []; (typeof DICC !== 'undefined' ? DICC : []).forEach(([cat, es], ci) => es.forEach((e, i) => { const p = coincide(q, e[0] + ' ' + e[1], e[2]); if (p) pal.push({ p, h: `<div class="bg-r bg-ko" data-bg data-full="d:${ci}:${i}"><span class="bg-ic">📖</span><span class="bg-t"><b>${esc(e[0])}</b><small><span class="ko-s">${esc(e[1])}</span> · ${esc(e[2])} · ${esc(cat)}</small></span>${btnHabla(e[1])}</div>` }); }));
  grupo('📖 Diccionario', pal);
  grupo('🇰🇷 Guía', GUIA.map(([t, ps]) => ({ t, p: coincide(q, t, arr(ps).join(' ')) })).filter(x => x.p)
    .map(({ t, p }) => ({ p, h: fila(`data-bguia="${esc(t)}"`, icGuia(t), t, 'Corea · Guía') })));
  grupo('📜 Historia', (typeof HISTORIA_COREA !== 'undefined' ? HISTORIA_COREA : []).map((c, i) => ({ c, i, p: coincide(q, c.t, arr(c.p).join(' ')) })).filter(x => x.p)
    .map(({ c, i, p }) => ({ p, h: fila(`data-bhist="${i}"`, c.ic || '📜', c.t, `Capítulo ${i + 1}`) })));
  return G.length ? G.join('') : '<p class="muted centro">Nada con eso. Prueba otra palabra, en singular o en hangul.</p>';
}
document.addEventListener('click', e => {
  if (e.target.closest('#buscabtn')) { abrirBusca(); return; }
  const b = e.target.closest('[data-bdia],[data-bguia],[data-bhist]'); if (!b) return;
  if (b.dataset.bdia != null) { dayIdx = +b.dataset.bdia; ir('hoy'); render(); window.scrollTo(0, 0); }
  else if (b.dataset.bguia != null) { guiaSel = b.dataset.bguia; coreaSub = 'guia'; ir('corea'); render(); const g = document.querySelector('.guia-t.on'); if (g) g.scrollIntoView({ block: 'start' }); }
  else { histCap = +b.dataset.bhist; ir('historia'); render(); window.scrollTo(0, 0); }
});
// ---------- 📊 Qué tocáis y qué no (solo en este móvil, para decidir qué quitar) ----------
// Cada control se agrupa por su función (todos los «Visitado» cuentan como uno); los de navegación, por su destino.
const K_USO = 'corea.uso';
const USO_NAV = new Set(['tab', 'sub', 'hsub', 'hgsub', 'act', 'ms', 'app', 'resumen', 'guia', 'pais', 'pcat', 'mpcapa', 'mpcapad', 'bcity', 'conv', 'sit', 'hgniv', 'carr', 'esmas', 'irplan', 'ircomer', 'irqv']);
const USO_NO = new Set(['key', 'es', 'ko', 'rom', 'q', 'wiki', 'wikis', 'noms', 'fecha', 'h', 'n', 'i', 'v']);
let uso = null, usoT = 0;
function usoCarga() { if (!uso) { try { uso = JSON.parse(localStorage.getItem(K_USO)) || null; } catch {} if (!uso || !uso.k) uso = { desde: todayISO(), k: {} }; } return uso; }
function usoGuarda() { clearTimeout(usoT); usoT = setTimeout(() => { try { localStorage.setItem(K_USO, JSON.stringify(uso)); } catch {} }, 800); }
function usoLugar() {
  const t = (TABS.find(x => x[0] === tab) || [tab, tab])[1];
  const sub = tab === 'mas' ? ((MAS_SUB.find(x => x[0] === masSub) || [])[1] || masSub) : tab === 'ciudades' ? exSub : tab === 'idioma' ? coreaSub : tab === 'historia' ? histSub : '';
  return sub ? t + ' › ' + sub : t;
}
function usoId(el) {
  const c = el.closest('summary, button, a, input[type=checkbox], label, [data-dia], [data-tab]'); if (!c || c.closest('#visor')) return null;
  let k, l = (c.getAttribute('aria-label') || c.title || c.textContent || '').replace(/\s+/g, ' ').trim();
  if (c.tagName === 'SUMMARY') { const d = c.closest('details[data-key]'); k = 'det:' + (d ? d.dataset.key.split(/[:|]/)[0] : (l.replace(/[\d\s:.,-]+/g, '').slice(0, 20))); }
  else {
    const a = [...c.attributes].map(x => x.name).find(n => n.startsWith('data-') && !USO_NO.has(n.slice(5)));
    if (a) { const n = a.slice(5); k = n + (USO_NAV.has(n) ? '=' + c.getAttribute(a) : ''); }
    else if (c.tagName === 'A') { try { k = 'a:' + new URL(c.href).hostname; } catch { k = 'a'; } }
    else k = c.tagName.toLowerCase() + ':' + l.replace(/[\d\s:.,-]+/g, '').slice(0, 20);
  }
  if (!k) return null;
  // Los botones de navegación (rejillas y apartados) son de la pestaña, no del apartado abierto.
  const lugar = c.closest('#tabs') ? 'Barra inferior' : USO_NAV.has(k.split('=')[0]) ? (TABS.find(x => x[0] === tab) || [tab, tab])[1] : usoLugar();
  // Los que repiten el nombre de un sitio se nombran por su función, no por el primero que salió.
  if (!USO_NAV.has(k.split('=')[0]) && l.length > 28) l = l.slice(0, 28) + '…';
  return [lugar + '|' + k, lugar, l || k];
}
document.addEventListener('click', e => {
  const id = usoId(e.target); if (!id) return; const U = usoCarga(), x = U.k[id[0]] || (U.k[id[0]] = { w: id[1], l: id[2], n: 0 });
  usoOtro(x, id[2]); x.n++; x.u = todayISO(); usoGuarda();
}, true);
function usoVistos() {
  const U = usoCarga(); let nuevo = false;
  document.querySelectorAll('#view summary, #view button, #view a, #view input[type=checkbox], #view [data-dia], #tabs button').forEach(el => {
    const id = usoId(el); if (!id) return; const x = U.k[id[0]];
    if (!x) { U.k[id[0]] = { w: id[1], l: id[2], n: 0 }; nuevo = true; } else if (usoOtro(x, id[2])) nuevo = true;
  });
  if (nuevo) usoGuarda();
}
// Mismo control con otro texto (cada tramo, cada ficha…): se cuentan los distintos para decir «y N más».
function usoOtro(x, l) { if (x.l === l || (x.o || []).includes(l)) return false; x.o = (x.o || []).concat(l).slice(0, 30); return true; }
const usoNom = x => x.l + (x.o && x.o.length ? ` (y ${x.o.length}${x.o.length >= 30 ? '+' : ''} parecidos)` : '');
addEventListener('pagehide', () => { if (uso) try { localStorage.setItem(K_USO, JSON.stringify(uso)); } catch {} });
document.addEventListener('visibilitychange', () => { if (document.hidden && uso) try { localStorage.setItem(K_USO, JSON.stringify(uso)); } catch {} });
function usoTexto() {
  const U = usoCarga(), es = Object.values(U.k), nunca = es.filter(x => !x.n), top = es.filter(x => x.n).sort((a, b) => b.n - a.n);
  const porLugar = {}; nunca.forEach(x => (porLugar[x.w] = porLugar[x.w] || []).push(usoNom(x)));
  return `Uso de la app desde ${U.desde} (${es.length} controles vistos)\n\nNUNCA TOCADO (${nunca.length}):\n` +
    Object.keys(porLugar).sort().map(w => `- ${w}: ${porLugar[w].join(' · ')}`).join('\n') +
    `\n\nLO MÁS TOCADO:\n` + top.slice(0, 25).map(x => `- ${x.n}× ${x.w}: ${usoNom(x)}`).join('\n');
}
function usoCard() {
  const U = usoCarga(), es = Object.values(U.k), nunca = es.filter(x => !x.n).length;
  return `<details class="card" data-key="uso"><summary><b>📊 Qué tocáis y qué no</b> <span class="muted">· ${nunca} sin tocar de ${es.length}</span></summary>
    <p class="muted">Cuenta en este móvil (nada sale de él) qué botones y apartados tocáis desde el ${esc(fmtCorto(U.desde))}. Sirve para quitar lo que no se usa. Mándamelo con «Copiar» cuando queráis.</p>
    <pre class="uso-pre" style="white-space:pre-wrap;word-break:break-word;font-size:.78rem">${esc(usoTexto())}</pre>
    <button class="sec" data-copy="${esc(usoTexto())}">📋 Copiar</button> <button class="sec" data-act="uso-cero">Poner a cero</button></details>`;
}

// ---------- Escala en Pekín (Capital, T3): todo lo útil para el tránsito ----------
// Frases en chino mandarín: [español, caracteres, pinyin].
const FRASES_CN = [
  ['¿Dónde está el tránsito internacional?', '国际中转在哪里？', 'Guójì zhōngzhuǎn zài nǎlǐ?'],
  ['Tenemos que hacer transbordo a Seúl.', '我们要转机去首尔。', 'Wǒmen yào zhuǎnjī qù Shǒu’ěr.'],
  ['Tenemos que hacer transbordo a Madrid.', '我们要转机去马德里。', 'Wǒmen yào zhuǎnjī qù Mǎdélǐ.'],
  ['¿Dónde está la puerta de embarque?', '登机口在哪里？', 'Dēngjīkǒu zài nǎlǐ?'],
  ['Vamos justos de tiempo.', '我们赶时间。', 'Wǒmen gǎn shíjiān.'],
  ['¿Mi equipaje va directo?', '我的行李是直挂的吗？', 'Wǒ de xíngli shì zhí guà de ma?'],
  ['¿Dónde está el baño?', '洗手间在哪里？', 'Xǐshǒujiān zài nǎlǐ?'],
  ['No hablo chino.', '我不会说中文。', 'Wǒ bú huì shuō Zhōngwén.'],
  ['Ayúdeme, por favor.', '请帮帮我。', 'Qǐng bāngbang wǒ.'],
  ['Agua', '水', 'Shuǐ'],
  ['¿Cuánto cuesta?', '多少钱？', 'Duōshao qián?'],
  ['Hola / Gracias', '你好 / 谢谢', 'Nǐ hǎo / Xièxie']];
const ESCALA_INFO = [
  ['🚶', 'Paso a paso del tránsito', [
    'Al bajar del avión NO sigáis "Arrival" (entrada a China): buscad los carteles "International Transfer / 国际中转".',
    'Control de tránsito: pasaporte y tarjeta de embarque del siguiente vuelo. Si no la tenéis, se saca en el mostrador de tránsito de Air China.',
    'Sin visado: si no salís de la zona internacional y seguís viaje en menos de 24 h, no hace falta (VERIFICAR con Air China si hay dudas).',
    'Después, control de seguridad otra vez: líquidos de 100 ml como máximo en bolsa transparente, portátil fuera.',
    'Mirad la puerta en las pantallas nada más pasar el control. Los vuelos internacionales salen de la zona T3-E.',
    'Puede haber colas de 40-50 min en el control de tránsito: id directos, sin paradas.']],
  ['🧳', 'Equipaje', [
    'Con un solo billete de Air China, la maleta facturada va directa hasta el destino final: no hay que recogerla en Pekín.',
    'Comprobadlo al facturar: la etiqueta de la maleta debe decir ICN a la ida (y MAD a la vuelta). Frase útil: "¿Va directa a Seúl?".',
    'No compréis líquidos en el duty free de Madrid ni de Incheon para llevar en cabina: en el control de Pekín os los pueden quitar.']],
  ['📶', 'Internet y comunicación', [
    'En China están bloqueados Google (Maps, Gmail, Traductor), WhatsApp, Instagram, YouTube y Facebook si usáis la wifi del aeropuerto.',
    'Con los datos de vuestra tarjeta española en itinerancia suelen funcionar, porque la conexión sale por España. Pero China no es UE: mirad antes el precio de vuestra tarifa.',
    'Wifi gratis del aeropuerto: hace falta un código; para extranjeros, máquinas que escanean el pasaporte o el mostrador de información.',
    'Mandad un mensaje a la familia antes de despegar; tened las tarjetas de embarque en captura de pantalla.',
    'Para traducir sin Google: esta misma sección tiene las frases clave en chino a pantalla completa.']],
  ['🔋', 'Baterías y seguridad', [
    'Baterías externas solo en cabina, nunca en la maleta facturada, con la capacidad visible (mAh o Wh) en la etiqueta.',
    'China es muy estricta: en vuelos nacionales exige la marca 3C y algunos controles la piden también en internacionales. Si tenéis una con 3C, llevad esa.',
    'Mecheros y cerillas: en China los retiran en el control. Mejor no llevarlos.']],
  ['💴', 'Dinero', [
    'No hace falta cambiar: la moneda es el yuan (CNY, ¥). Muchas tiendas del aeropuerto aceptan Visa/Mastercard.',
    'En China casi todo se paga con Alipay o WeChat Pay. Alipay admite tarjetas extranjeras, pero para 2 h no merece la pena instalarlo.']]];
function viewEscala() {
  const ahora = new Date(), hPek = ahora.toLocaleTimeString('es-ES', { timeZone: 'Asia/Shanghai', hour: '2-digit', minute: '2-digit' });
  // Vuestras escalas en Pekín (del trip.json, solo en el móvil).
  const escalas = arr(trip && trip.vuelos).map(v => { const ts = arr(v.tramos).filter(x => x.vuelo); const i = ts.findIndex(x => x.a === 'PEK');
    if (i < 0 || !ts[i + 1]) return null; const lleg = ts[i].llegada, sal = ts[i + 1].salida;
    const min = (new Date(sal.replace(' ', 'T')) - new Date(lleg.replace(' ', 'T'))) / 60000;
    return { v, de: ts[i], a: ts[i + 1], lleg, sal, min }; }).filter(Boolean);
  const hm = m => `${Math.floor(m / 60)} h${m % 60 ? ' ' + (m % 60) + ' min' : ''}`;
  return `<h2>🇨🇳 Escala en Pekín</h2>
    <div class="card esc-hora"><div class="big">🕐 Ahora en Pekín: ${hPek}</div>
      <div class="muted">China no cambia la hora: Pekín = España <b>+7 h</b> · Canarias <b>+8 h</b> · Corea <b>−1 h</b>. Los horarios de vuelo de Pekín están en hora local.</div></div>
    ${escalas.map(e => `<div class="card esc-vuelo"><b>${e.v.tipo === 'vuelta' ? '⬅️ Vuelta' : '➡️ Ida'} · ${fmtDate(e.lleg.slice(0, 10))}</b>
      <div>🛬 Llegáis a las <b>${e.lleg.slice(11)}</b> en el ${esc(e.de.vuelo)} (terminal ${esc(e.de.a_terminal || '?')})</div>
      <div>🛫 Sale el <b>${esc(e.a.vuelo)}</b> a las <b>${e.sal.slice(11)}</b> (terminal ${esc(e.a.de_terminal || '?')}) → ${esc(e.a.a_nombre || e.a.a)}</div>
      <div class="esc-con ${e.min < 150 ? 'justa' : ''}">⏱️ Conexión de <b>${hm(e.min)}</b>${e.min < 150 ? ': id directos al tránsito, sin paradas' : ''}</div></div>`).join('')}
    ${ESCALA_INFO.map(([ic, t, ls]) => `<details class="card esc-sec" data-key="esc:${esc(t)}" ${abierto('esc:' + t, t.startsWith('Paso')) ? 'open' : ''}><summary><b>${ic} ${esc(t)}</b></summary><ul>${ls.map(x => `<li>${resaltar(x, true)}</li>`).join('')}</ul></details>`).join('')}
    <h2>🗣️ Frases en chino (toca para enseñar)</h2>
    ${FRASES_CN.map((f, i) => `<div class="card lugar" data-full="cn:${i}"><div><div>${esc(f[0])}</div><div class="muted">${esc(f[2])}</div></div><div class="ko">${esc(f[1])}</div></div>`).join('')}
    <p class="muted">Información de guías y foros de 2025-2026; los procedimientos pueden cambiar: ante la duda, preguntad al personal de Air China.</p>`;
}

// Redibujado por tareas en segundo plano (datos, tiempo, fotos): se espera si estás usando un desplegable o escribiendo.
let renderPendiente = false;
function renderLuego() {
  const ae = document.activeElement;
  if (ae && /^(SELECT|INPUT|TEXTAREA)$/.test(ae.tagName) && ae.closest('#view, #conv-pop, #busca-pop')) { renderPendiente = true; return; }
  render();
}
document.addEventListener('focusout', () => { if (renderPendiente) { renderPendiente = false; setTimeout(render, 50); } });

let tiraX = null, tabAnt = null;
// ---------- render ----------
// Guarda dónde está un botón en pantalla y devuelve la función que lo deja en el mismo sitio tras redibujar.
function anclar(el) {
  const at = [...el.attributes].find(x => /^data-(etq|cara|esmas|avok|stk|fav|hgleida|hk|est|val|verif|agtog|agdel|cara)$/.test(x.name)); if (!at) return () => {};
  const dt = el.closest('details[data-key]:not(.horario-dia)');
  if (dt) { const sd = `details[data-key="${CSS.escape(dt.dataset.key)}"]`, yd = dt.getBoundingClientRect().top; return () => { const n = document.querySelector(sd); if (n) window.scrollBy(0, n.getBoundingClientRect().top - yd); }; }
  const sel = `[${at.name}="${CSS.escape(at.value)}"]`, i = [...document.querySelectorAll(sel)].indexOf(el), y = el.getBoundingClientRect().top;
  return () => { const n = document.querySelectorAll(sel)[i] || document.querySelector(sel); if (n) window.scrollBy(0, n.getBoundingClientRect().top - y); };
}
function render() {
  applyTheme();
  $('#title').textContent = String((trip && trip.meta && trip.meta.titulo) || 'Viaje a Corea').replace(/ del Sur\b/i, ''); // «Corea 2026»: se sobreentiende
  $('#back').hidden = !pila.length;
  $('#tabs').innerHTML = TABS.map(([id, label, ic]) =>
    `<button data-tab="${id}" class="${tab === id || (id === 'mas' && EN_MAS.some(m => m[0] === tab)) ? 'on' : ''}"><span>${ic}</span>${label}</button>`).join('');

  if (tab === 'checklist') { masSub = 'maleta'; tab = 'mas'; }
  if (tab === 'planes') { exSub = 'planes'; tab = 'ciudades'; } // Planes vive dentro de Qué ver desde v102
  if (['seguro', 'verificar'].includes(tab)) { masSub = tab; tab = 'mas'; }
  // Comer vive dentro de Planes (botón 🍜 Comer de cada ciudad) desde v161.
  if (tab === 'comer') { if (comerCiudad && comerCiudad !== 'todas') ciudadSel = comerCiudad; exSub = 'comer'; tab = 'ciudades'; }
  let html;
  if (!trip && tab !== 'mas' && tab !== 'conv') html = viewWelcome();
  else switch (tab) {
    case 'hoy': html = viewHoy(); break;
    case 'ruta': html = viewRuta(); break;
    case 'ensenar': coreaSub = 'ensenar'; tab = 'idioma'; html = viewIdioma(); break;
    case 'idioma': html = viewIdioma(); break;
    case 'seguro': html = viewSeguro(); break;
    case 'historia': html = viewHistoria(); break;
    case 'corea': html = viewCorea(); break;
    case 'ciudades': html = viewCiudades(); break;
    case 'mapas': html = viewMapas(); break;
    case 'conv': html = viewConv(); break;
    case 'verificar': html = viewVerificar(); break;
    default: html = viewMas();
  }
  const tiraAnt = document.getElementById('tira'); tiraX = tiraAnt ? tiraAnt.scrollLeft : null;
  // Las filas de chips deslizables conservan su posición al redibujar (si no, vuelven al principio).
  const filas = el => [...el.querySelectorAll('.chips, .hoysubs, .pcats')];
  const posX = tab === tabAnt ? filas($('#view')).map(f => f.scrollLeft) : [];
  const cambia = tab !== tabAnt;
  document.body.dataset.pest = tab; // color propio de cada pestaña (CSS). Ojo: NO usar data-tab, que es el atributo de los botones de la barra
  $('#view').innerHTML = html; tabAnt = tab;
  setTimeout(usoVistos, 0);
  if (cambia) { const v = $('#view'); v.classList.remove('entra'); void v.offsetWidth; v.classList.add('entra'); } // fundido suave al cambiar de pestaña
  filas($('#view')).forEach((f, i) => { if (posX[i]) { f.style.scrollBehavior = 'auto'; f.scrollLeft = posX[i]; f.style.scrollBehavior = ''; } });
  if (['ciudades', 'hoy', 'corea', 'historia'].includes(tab)) pintarFotos();
  if (['ciudades', 'hoy', 'mapas'].includes(tab)) pintarMapas();
  const ch = tab === 'hoy' && document.querySelector('#tira .dchip.on');
  if (ch) { const t = ch.parentElement, obj = ch.offsetLeft - t.clientWidth / 2 + ch.offsetWidth / 2; t.style.scrollBehavior = 'auto'; t.scrollLeft = tiraX != null ? tiraX : obj; if (tiraX != null) requestAnimationFrame(() => { t.style.scrollBehavior = 'smooth'; t.scrollLeft = obj; }); }
}

// Naver Map / Kakao Map: intenta abrir la app; si en 1,5 s no se ha ido la página, abre la web móvil.
document.addEventListener('click', e => {
  const ap = e.target.closest('a[data-app]'); if (!ap) return;
  e.preventDefault();
  const q = encodeURIComponent(ap.dataset.q || ''), web = ap.href;
  const app = ap.dataset.app === 'kakao' ? `kakaomap://search?q=${q}` : `nmap://search?query=${q}&appname=viajecorea`;
  let fue = false; const vis = () => { if (document.hidden) fue = true; };
  document.addEventListener('visibilitychange', vis);
  location.href = app;
  setTimeout(() => { document.removeEventListener('visibilitychange', vis); if (!fue && !document.hidden) window.open(web, '_blank'); }, 1500);
}, true);
// 🔍 Visor: tocar cualquier foto cargada la abre en grande (otra vez = cerrar). Va antes que todo para que no abra/cierre la ficha.
document.addEventListener('click', e => {
  const si = e.target.closest('[data-snackimg]'); if (si) { e.preventDefault(); e.stopPropagation(); if (si.dataset.snackimg === 'poner') ponerSnackImg(); else if (confirm('¿Quitar la imagen de los snacks?')) { try { localStorage.removeItem(K_SNACKS); } catch {} render(); } return; }
  const cb = e.target.closest('[data-carr]'); if (cb) { e.preventDefault(); e.stopPropagation(); carrUlt = Date.now(); carrusel(+cb.dataset.carr); return; }
  if (Date.now() - carrSwipe < 400 && e.target.closest('.dia-banner')) { e.preventDefault(); e.stopPropagation(); return; }
  const vz = document.getElementById('visor'); if (vz && e.target.closest('#visor')) { if (!e.target.closest('a')) vz.remove(); e.preventDefault(); e.stopPropagation(); return; }
  const ft = e.target.closest('.foto.ok'); if (!ft) return; const img = ft.querySelector('img:last-of-type'); if (!img) return;
  e.preventDefault(); e.stopPropagation();
  const f = FOTOS[ft.dataset.wiki] || {}, card = ft.closest('details, .card, .sd'), nom = card && (card.querySelector('b') || {}).textContent || '';
  const v = document.createElement('div'); v.id = 'visor';
  v.innerHTML = `<img alt="" src="${esc(img.src.replace(/\/\d+px-/, '/1280px-'))}"><div class="visor-pie"><b>${esc(nom.trim().replace(/^\d+\s*/, '').slice(0, 80))}</b>${f.url ? `<a href="${esc(f.url)}" target="_blank" rel="noopener">${/commons\./.test(f.url) ? 'Foto: Wikimedia Commons' : 'Foto: Wikipedia'}</a>` : ''}<span>Toca para cerrar</span></div>`;
  const big = v.querySelector('img'); big.onerror = () => { if (big.src !== img.src) big.src = img.src; };
  document.body.appendChild(v);
}, true);
document.addEventListener('click', e => {
  // Campos de texto: el toque es para escribir; nunca debe redibujar nada.
  if (e.target.matches('input:not([type=checkbox]):not([type=radio]), textarea, select')) return;
  const fv = e.target.closest('[data-fav]');
  if (fv) { const U = u(), d = fv.dataset; U.favs = arr(U.favs);
    if (U.favs.some(f => f.k === d.fav)) U.favs = U.favs.filter(f => f.k !== d.fav); else U.favs.unshift({ k: d.fav, es: d.es, ko: d.ko, rom: d.rom });
    saveUser(); render(); return; }
  const rgd = e.target.closest('[data-rgde]'); if (rgd) { rgDe = rgd.dataset.rgde; render(); return; }
  const rg = e.target.closest('[data-rgadd],[data-rgok],[data-rgdel],[data-resumen]');
  if (rg) { const U = u(), d = rg.dataset; U.regalos = arr(U.regalos);
    if (d.rgadd != null) { const v = id => (document.getElementById(id) || {}).value || '', que = v('rg-que').trim(); if (!que) { alert('Escribe qué quieres comprar.'); return; }
      const de = v('rg-yo').trim(); try { localStorage.setItem(K_YO, de); } catch {}
      U.regalos.push({ id: 'r' + Date.now(), para: v('rg-para').trim() || 'Sin asignar', que, donde: v('rg-donde').trim(), de, ok: false }); }
    else if (d.rgok) { const r = U.regalos.find(x => x.id === d.rgok); if (r) r.ok = !r.ok; }
    else if (d.rgdel) { if (!confirm('¿Quitar este regalo?')) return; U.regalos = U.regalos.filter(x => x.id !== d.rgdel); }
    else if (d.resumen === 'word') { exportarWord(rg); return; }
    else if (d.resumen === 'pdf') { verPDF(rg); return; }
    else if (d.resumen) { const t = textoResumen();
      if (d.resumen === 'copiar') { (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(() => alert('Resumen copiado.'), () => alert('No se pudo copiar: usa Descargar.')); return; }
      if (d.resumen === 'compartir' && navigator.share) { navigator.share({ title: 'Nuestro viaje a Corea', text: t }).catch(() => {}); return; }
      compartirArchivo(`viaje-corea-resumen-${todayISO()}.txt`, t, 'text/plain'); return; }
    saveUser(); render(); return; }
  const hb = e.target.closest('[data-habla]');
  if (hb) { hablar(hb.dataset.habla); return; }
  const hg = e.target.closest('[data-hgsub],[data-hgleida],[data-hgniv],[data-hgr],[data-hgsig],[data-hgreset]');
  if (hg) {
    const U = u(), d = hg.dataset;
    if (d.hgsub) { hgSub = d.hgsub; render(); window.scrollTo(0, 0); return; }
    if (d.hgleida) { U.hgLeidas = U.hgLeidas || {}; if (U.hgLeidas[d.hgleida]) delete U.hgLeidas[d.hgleida]; else U.hgLeidas[d.hgleida] = todayISO(); saveUser(); render(); return; }
    if (d.hgniv) hgQ = hgPregunta(d.hgniv);
    else if (d.hgsig != null) hgQ = hgPregunta(hgQ ? hgQ.nivel : 'vocales');
    else if (d.hgreset != null) { if (!confirm('¿Borrar el progreso del test?')) return; U.hgTest = { ok: 0, n: 0, f: {} }; saveUser(); }
    else if (d.hgr != null && hgQ && hgQ.resp == null) {
      hgQ.resp = +d.hgr; const T = U.hgTest = U.hgTest || { ok: 0, n: 0, f: {} }, k = hgQ.item.k, bien = hgQ.ops[hgQ.resp] === hgQ.item.a;
      T.n++; if (bien) { T.ok++; if (T.f[k]) T.f[k]--; if (!T.f[k]) delete T.f[k]; } else T.f[k] = (T.f[k] || 0) + 1; saveUser();
      if (bien && hgQ.item.ej) hablar(hgQ.item.ej); else if (bien) hablar(hgQ.item.q);
    }
    render(); return;
  }
  // Botones de marcar (visitado, valorar, estado…): tras redibujar, el botón tocado vuelve al mismo punto de la pantalla.
  const mk = e.target.closest('button[data-avok],button[data-stk],button[data-fav],button[data-hgleida],button[data-hk],button[data-est],button[data-val],button[data-verif],button[data-agtog],button[data-agdel],button[data-cara]');
  if (mk) queueMicrotask(anclar(mk));
  const stb = e.target.closest('button[data-stk]');
  if (stb) { e.preventDefault(); const U = u(), es = U.estrellas = U.estrellas || {}, k = stb.dataset.stk, v = Number(stb.dataset.sv);
    if (estrDe(k) === v) delete es[k]; else es[k] = { n: stb.dataset.stn, v }; saveUser(); render(); return; }
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
  const hix = e.target.closest('[data-hdini-x]');
  if (hix) { const U = u(); ['hdIni', 'hdLev'].forEach(c => { if (U[c]) delete U[c][hix.dataset.hdiniX]; }); saveUser(); render(); return; }
  const gpsb = e.target.closest('button[data-gps]');
  if (gpsb) { e.preventDefault(); const h = gpsb.dataset.gps, n = gpsb.dataset.gpsn;
    if (!navigator.geolocation) { alert('Este móvil no da la ubicación.'); return; }
    gpsb.textContent = '📌 …';
    navigator.geolocation.getCurrentPosition(pos => { const { latitude: la, longitude: lo, accuracy: ac } = pos.coords;
      if (confirm(`¿Guardar tu posición actual (precisión ±${Math.round(ac)} m) como la ubicación de «${n}»?\nHazlo solo si estás delante del sitio.`)) { const U = u(); U.coordsFix = U.coordsFix || {}; U.coordsFix[h] = [+la.toFixed(5), +lo.toFixed(5)]; saveUser(); }
      render(); }, () => { alert('No se pudo obtener la ubicación (¿permiso de ubicación activado?).'); render(); }, { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 });
    return; }
  const esm = e.target.closest('button[data-esmas]');
  // «Leer más» crece hacia abajo: queda quieto el principio de la lista (no el botón), y si ese principio estaba fuera de la pantalla, se baja hasta él.
  if (esm) { const k = esm.dataset.esmas, sel = `ol[data-esq="${CSS.escape(k)}"]`, ol0 = document.querySelector(sel), y0 = ol0 ? ol0.getBoundingClientRect().top : null;
    abiertos[k] = !abiertos[k]; render();
    const ol = document.querySelector(sel); if (ol && y0 != null) { const cab = ($('header') || { offsetHeight: 60 }).offsetHeight + 8; window.scrollBy(0, ol.getBoundingClientRect().top - Math.max(y0, cab)); }
    return; }
  const avb = e.target.closest('button[data-avok]');
  if (avb) { e.preventDefault(); const U = u(), o = U.avisosOk = U.avisosOk || {}, a = avb.dataset.avok; if (o[a]) delete o[a]; else o[a] = todayISO(); saveUser(); render(); return; }
  const hk = e.target.closest('button[data-hk]');
  if (hk) { e.preventDefault(); const h = hk.dataset.hk, v = hk.dataset.v === '1'; marcarHecho(h, v);
    if (v) Object.keys(abiertos).concat('qv:' + h).forEach(k => { if (k === 'qv:' + h || k.endsWith('|' + h) || (h.startsWith('tras:') && k.startsWith('trd:'))) abiertos[k] = false; });
    render(); return; }
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
  const hsb = e.target.closest('[data-hsub]');
  if (hsb) { histSub = hsb.dataset.hsub; histCap = null; render(); return; }
  const exs = e.target.closest('[data-exs]');
  if (exs) { exSub = exs.dataset.exs; render(); return; }
  const qo = e.target.closest('[data-qvo],[data-qvf],[data-qvm]');
  if (qo) { if (qo.dataset.qvo) qvOrden = qo.dataset.qvo; else if (qo.dataset.qvm) qvMarca = qvMarca === qo.dataset.qvm ? '' : qo.dataset.qvm; else qvFiltro = qo.dataset.qvf; render(); return; }
  const iq = e.target.closest('[data-irqv]');
  if (iq) { ciudadSel = iq.dataset.irqv; exSub = 'puntos'; qCiu = ''; qvFiltro = 'todos'; qvMarca = ''; abiertos['qv:' + iq.dataset.h] = true; ir('ciudades'); render();
    const el = document.querySelector(`details[data-key="${CSS.escape('qv:' + iq.dataset.h)}"]`); if (el) { el.scrollIntoView({ block: 'start' }); window.scrollBy(0, -80); } return; }
  const irc = e.target.closest('[data-ircomer],[data-irplan],[data-irhotel]');
  if (irc) {
    if (irc.hasAttribute('data-irhotel')) { hoySub = 'hotel'; ir('hoy'); }
    else if (irc.dataset.ircomer != null) { if (irc.dataset.ircomer) comerCiudad = irc.dataset.ircomer; comerTipo = 'todos'; comerEstado = 'todos'; qCom = irc.dataset.q || ''; if (irc.dataset.ircomer) ciudadSel = irc.dataset.ircomer; exSub = 'comer'; ir('ciudades'); }
    else { if (irc.dataset.irplan) ciudadSel = irc.dataset.irplan; exSub = 'planes'; if (irc.dataset.cat) planesCat = irc.dataset.cat; ir('ciudades'); }
    render(); window.scrollTo(0, 0); return;
  }
  const qc = e.target.closest('[data-qclear],[data-bcity]');
  if (qc) {
    if (qc.dataset.bcity) { ciudadSel = qc.dataset.bcity; qCiu = qc.dataset.bq || ''; exSub = 'puntos'; if (tab !== 'ciudades') ir('ciudades'); render(); window.scrollTo(0, 0); }
    else { if (qc.dataset.qclear === 'qcs') qCiu = ''; else qCom = ''; render(); }
    return;
  }
  const et = e.target.closest('[data-etq]');
  if (et) { const [f, c] = et.dataset.etq.split('|'), U = u(); U.diario = U.diario || {}; const o = U.diario[f] = U.diario[f] || {}; o.tags = arr(o.tags); o.tags = o.tags.includes(c) ? o.tags.filter(x => x !== c) : [...o.tags, c]; saveUser(); queueMicrotask(anclar(et)); render(); return; }
  const ca = e.target.closest('[data-cara]');
  if (ca) { const [f, c] = ca.dataset.cara.split('|'), U = u(); U.diario = U.diario || {}; const o = U.diario[f] = U.diario[f] || {}; o.cara = o.cara === c ? '' : c; saveUser(); render(); return; }
  const gd = e.target.closest('[data-gpsdel]');
  if (gd) { if (!confirm('¿Volver a la ubicación original de este sitio?')) return; const U = u(); delete (U.coordsFix || {})[gd.dataset.gpsdel]; saveUser();
    Object.values(MP).forEach(mm => (mm.pts || []).forEach(q => { if (q.l && hKey(q.l) === gd.dataset.gpsdel) q.c = coordsLugar(q.l) || q.c; })); render(); return; }
  const mq = e.target.closest('[data-mpz],[data-mpfit],[data-mpyo],[data-mpcerrar],[data-mpcapa],[data-mpcapad],[data-mpdia]');
  if (mq) {
    if (mq.dataset.mpcapad) { const c = mq.dataset.mpcapad; if (mpCapasDia.has(c)) mpCapasDia.delete(c); else mpCapasDia.add(c); render(); return; }
    if (mq.dataset.mpcapa) { const c = mq.dataset.mpcapa; if (mpCapas.has(c)) mpCapas.delete(c); else mpCapas.add(c); render(); return; }
    if (mq.dataset.mpdia) { const f = mq.dataset.mpdia; if (mapaDia.has(f)) mapaDia.delete(f); else mapaDia.add(f); render(); return; }
    const el = mq.closest('.mapa'), m = el && MP[el.dataset.mapa]; if (!m) return;
    if (mq.dataset.mpz) mpZoom(el, m, Number(mq.dataset.mpz));
    else if (mq.hasAttribute('data-mpfit')) { mpEncajar(m, el.clientWidth, el.clientHeight); mpDibujar(el, m); }
    else if (mq.hasAttribute('data-mpyo')) mpYo(el, m);
    else { m.sel = null; mpDibujar(el, m); }
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
    comerCongelado = !!(cm.dataset.val || cm.dataset.est);
    if (cm.dataset.ce) comerEstado = comerEstado === cm.dataset.ce ? 'todos' : cm.dataset.ce; // tocar el activo lo quita
    else if (cm.dataset.co) comerOrden = cm.dataset.co;
    else if (cm.dataset.val) {
      const U = u(); U.comer = U.comer || {}; const o = U.comer[cm.dataset.val] = U.comer[cm.dataset.val] || {};
      const v = Number(cm.dataset.n); o.val = Number(o.val) === v ? 0 : v; saveUser();
    }
    else if (cm.dataset.cc) comerCiudad = cm.dataset.cc;
    else if (cm.dataset.ct) comerTipo = comerTipo === cm.dataset.ct && cm.dataset.ct !== 'todos' ? 'todos' : cm.dataset.ct;
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
  if (cs) { ciudadSel = cs.dataset.csel; historiaAbierta = false; render(); return; }
  const df = e.target.closest('[data-diaf]');
  if (df) { const ds = arr(trip.dias).map(x => x.fecha).sort(); dayIdx = Math.max(0, ds.indexOf(df.dataset.diaf)); hoySub = 'diario'; ir('hoy'); render(); window.scrollTo(0, 0); return; }
  const dd = e.target.closest('[data-dia]');
  if (dd) { dayIdx = +dd.dataset.dia; ir('hoy'); render(); return; }
  if (e.target.closest('#tema')) { const o = ['auto', 'light', 'dark'], t0 = load(K_THEME, 'auto'); save(K_THEME, o[(o.indexOf(t0) + 1) % 3]); applyTheme(); return; }
  // Desplegables con data-key: los controla la app (así no se cierran si la pantalla se redibuja).
  const sm = e.target.closest('details[data-key] > summary');
  if (sm) { e.preventDefault(); const dt = sm.parentElement; abiertos[dt.dataset.key] = !dt.open; dt.open = abiertos[dt.dataset.key]; return; }
  const hc = e.target.closest('[data-hc]');
  if (hc) { if (hc.dataset.leido !== undefined) { const U = u(); U.leidos = U.leidos || {}; U.leidos[hc.dataset.leido] = 1; saveUser(); }
    const nuevo = hc.dataset.hc === 'ind' ? null : +hc.dataset.hc; histDir = histCap !== null && nuevo !== null && nuevo < histCap ? 'ant' : 'sig';
    histCap = nuevo; render(); window.scrollTo(0, 0); return; }
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
  if (pc) { ciudadSel = pc.dataset.pc; render(); return; }
  const pai = e.target.closest('[data-pais]');
  if (pai) { paisSel = paisSel === pai.dataset.pais ? null : pai.dataset.pais; render(); return; }
  const gs = e.target.closest('[data-guia]');
  if (gs) { guiaSel = guiaSel === gs.dataset.guia ? null : gs.dataset.guia; render(); return; }
  const b = e.target.closest('[data-tab],[data-act],[data-day],[data-theme],[data-go],[data-sub],[data-sit]');
  if (!b) return;
  if (b.dataset.sub) { coreaSub = b.dataset.sub; paisSel = null; }
  else if (b.dataset.sit) fraseSit = b.dataset.sit;
  else if (b.dataset.tab) ir(b.dataset.tab);
  else if (b.dataset.go) ir(b.dataset.go);
  else if (b.dataset.day) { dayIdx += Number(b.dataset.day); }
  else if (b.dataset.theme) { save(K_THEME, b.dataset.theme); }
  else switch (b.dataset.act) {
    case 'import': $('#file').click(); return;
    case 'export': exportCopy(); return;
    case 'marcas': exportMarcas(); return;
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
    case 'preparar': prepararViaje(); return;
    case 'preparar-ir': masSub = 'datos'; ir('mas'); render(); window.scrollTo(0, 0); prepararViaje(); return;
    case 'ayuda': abrirAyuda(); return;
    case 'comer-cancelar': comerForm = false; break;
    case 'example': loadExample(); return;
    case 'uso-cero': if (!confirm('¿Poner a cero el recuento de uso?')) return; uso = { desde: todayISO(), k: {} }; try { localStorage.setItem(K_USO, JSON.stringify(uso)); } catch {} break;
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
  if (t.id === 'q') { qDic = t.value; $('#dres').innerHTML = dResultados(qDic); }
  else if (t.id === 'qcs' || t.id === 'qcm') {
    if (t.id === 'qcs') qCiu = t.value; else qCom = t.value;
    $('#r' + t.id).innerHTML = t.id === 'qcs' ? resCiudades(qCiu) : resComer(qCom); pintarFotos();
  }
  else if (t.dataset.conv) {
    const otro = document.querySelector(`[data-conv="${t.dataset.conv === 'KRW' ? 'EUR' : 'KRW'}"]`), v = Number(t.value), c = cambio();
    otro.value = !t.value || !c ? '' : t.dataset.conv === 'KRW' ? (v / c).toFixed(2) : Math.round(v * c);
  }
  else if (t.dataset.notas !== undefined) { u().notas = t.value; saveUser(); }
  else if (t.dataset.diario) { const U = u(); U.diario = U.diario || {}; (U.diario[t.dataset.diario] = U.diario[t.dataset.diario] || {}).nota = t.value; saveUser(); }
  else if (t.dataset.cnota) { const U = u(); U.comer = U.comer || {}; (U.comer[t.dataset.cnota] = U.comer[t.dataset.cnota] || {}).nota = t.value; saveUser(); }
});
document.addEventListener('change', e => {
  const t = e.target;
  if (t.dataset.sc !== undefined) { comerCiudad = t.value; if (comerTipo !== 'todos' && !lugaresComer().some(l => (comerCiudad === 'todas' || l.ciudad === comerCiudad) && l.tipo === comerTipo)) comerTipo = 'todos'; render(); }
  else if (t.dataset.st !== undefined) { comerTipo = t.value; render(); }
  else if (t.dataset.hk) { marcarHecho(t.dataset.hk, t.checked); render(); }
  else if (t.dataset.hdini || t.dataset.hdlev) { const U = u(), c = t.dataset.hdini ? 'hdIni' : 'hdLev', f = t.dataset.hdini || t.dataset.hdlev; U[c] = U[c] || {}; if (t.value) U[c][f] = t.value; else delete U[c][f]; saveUser(); render(); }
  else if (t.dataset.check) { u().checklist[t.dataset.check] = t.checked; if (!t.checked) delete user.checklist[t.dataset.check]; saveUser(); render(); }
  else if (t.dataset.opv || t.dataset.opn || t.dataset.opf) {
    const id = t.dataset.opv || t.dataset.opn || t.dataset.opf, U = u(); U.comer = U.comer || {}; const e = U.comer[id] = U.comer[id] || {}, o = e.op = e.op || {};
    if (t.dataset.opv) o.v = Math.min(5, Math.max(0, Number(String(t.value).replace(',', '.')) || 0)); else if (t.dataset.opn) o.n = Number(t.value) || 0; else o.f = t.value;
    o.fuente = (o.f || 'Naver') + ' (apuntada por vosotros)'; o.fecha = todayISO(); if (!o.v && !o.n) delete e.op; saveUser(); opPend = true;
  }
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
    document.addEventListener('visibilitychange', () => { if (!document.hidden) { r.update().catch(() => {}); actualizarCambio(false); actualizarTiempo(); } });
  });
}
// Muestra la versión de caché en Más.
if (window.caches) caches.keys().then(k => { const v = k.find(x => /^corea-v\d/.test(x)); window.VERSION = v; const e = $('#ver'); if (e && v) e.textContent = 'Versión: ' + v; });
