'use strict';

// ---------- utilidades ----------
const $ = s => document.querySelector(s);
const esc = v => String(v ?? '').replace(/[&<>"']/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const arr = v => (Array.isArray(v) ? v : []);
const ver = o => (o && o.verificar ? '<span class="ver">VERIFICAR</span>' : '');

const K_TRIP = 'corea.trip', K_USER = 'corea.user', K_THEME = 'corea.theme';
const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));

let trip = load(K_TRIP, null);
let user = load(K_USER, { gastos: [], checklist: {}, notas: '' });
let tab = 'hoy';
let dayIdx = null;

const TABS = [
  ['hoy', 'Hoy', '📅'], ['ruta', 'Ruta', '🗺️'], ['ensenar', 'Enseñar', '🪧'],
  ['corea', 'Corea', '🇰🇷'], ['seguro', 'Seguro', '🛡️'], ['gastos', 'Gastos', '💶'],
  ['checklist', 'Checklist', '✅'], ['mas', 'Más', '☰']
];

function todayISO() {
  const d = new Date();
  return new Date(d - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
}
function fmtDate(iso) {
  if (!iso) return '';
  const d = new Date(iso + 'T12:00:00');
  return isNaN(d) ? esc(iso) : d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
}
const isPend = t => /pendiente/i.test(t.estado || '');
const isOk = t => /comprad/i.test(t.estado || '') || (t.tren && t.tren.comprado === true);
function estadoBadge(t) {
  if (isPend(t)) return `<span class="badge pend">${esc(t.estado)}</span>`;
  if (isOk(t)) return `<span class="badge ok">${esc(t.estado || 'COMPRADO')}</span>`;
  return t.estado ? `<span class="badge otro">${esc(t.estado)}</span>` : '';
}

// ---------- tema ----------
function applyTheme() {
  const t = load(K_THEME, 'auto');
  if (t === 'auto') document.documentElement.removeAttribute('data-theme');
  else document.documentElement.setAttribute('data-theme', t);
}

// ---------- importar / exportar ----------
function importFile(file) {
  const r = new FileReader();
  r.onload = () => {
    try {
      const obj = JSON.parse(r.result);
      if (!obj || typeof obj !== 'object') throw new Error();
      if (obj.trip && obj.user) { // copia exportada por esta app
        trip = obj.trip; user = obj.user; save(K_USER, user);
      } else {
        trip = obj;
      }
      save(K_TRIP, trip);
      dayIdx = null; tab = 'hoy';
      render();
      alert('Viaje importado y guardado en el móvil.');
    } catch {
      alert('El archivo no es un JSON válido.');
    }
  };
  r.readAsText(file);
}
function exportCopy() {
  const data = { exportado: new Date().toISOString(), trip, user };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `corea-copia-${todayISO()}.json`;
  document.body.appendChild(a); a.click(); a.remove();
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

function pendingAlert() {
  const p = arr(trip.traslados).filter(isPend);
  if (!p.length) return '';
  return `<div class="alert" data-go="ruta">⚠️ Traslados PENDIENTES DE COMPRAR:
    <ul>${p.map(t => `<li>${esc(t.fecha)} · ${esc(t.de)} → ${esc(t.a)}</li>`).join('')}</ul></div>`;
}

function viewHoy() {
  const dias = arr(trip.dias).slice().sort((a, b) => String(a.fecha).localeCompare(String(b.fecha)));
  let html = pendingAlert();
  const avisos = arr(trip.avisos);
  if (avisos.length) html += `<div class="card"><b>Avisos</b><ul>${avisos.map(a => `<li>${esc(a)}</li>`).join('')}</ul></div>`;
  if (!dias.length) return html + '<p class="muted">El viaje no tiene días (clave "dias").</p>';

  if (dayIdx === null) {
    const t = todayISO();
    dayIdx = dias.findIndex(d => d.fecha === t);
    if (dayIdx < 0) dayIdx = t < dias[0].fecha ? 0 : Math.max(0, dias.findIndex(d => d.fecha > t));
    if (t > dias[dias.length - 1].fecha) dayIdx = dias.length - 1;
  }
  dayIdx = Math.min(Math.max(dayIdx, 0), dias.length - 1);
  const d = dias[dayIdx];
  const esHoy = d.fecha === todayISO();

  html += `<div class="daynav row">
    <button class="sec" data-day="-1" ${dayIdx === 0 ? 'disabled' : ''}>◀</button>
    <div class="label">Día ${esc(d.dia ?? dayIdx + 1)} de ${dias.length}${esHoy ? '<br>HOY' : ''}</div>
    <button class="sec" data-day="1" ${dayIdx === dias.length - 1 ? 'disabled' : ''}>▶</button>
  </div>
  <div class="card">
    <div class="muted">${fmtDate(d.fecha)} · ${esc(d.ciudad)}</div>
    <div class="big">${esc(d.titulo)}</div>
    <ul class="items">${arr(d.items).map(i =>
      `<li>${i.hora ? `<span class="hora">${esc(i.hora)}</span>` : ''}${esc(i.texto)}</li>`).join('')}</ul>
  </div>`;

  const tr = arr(trip.traslados).filter(t => t.fecha === d.fecha);
  if (tr.length) html += '<h2>Traslado de hoy</h2>' + tr.map(trasladoCard).join('');

  const aloj = arr(trip.alojamientos).filter(a => a.ciudad && a.ciudad === d.ciudad);
  if (aloj.length) html += '<h2>Alojamiento</h2>' + aloj.map(a => `<div class="card">
    <div class="big">${esc(a.nombre)} ${ver(a)}</div>
    ${a.ko ? `<div class="ko">${esc(a.ko)}</div>` : ''}
    ${a.direccion_ko ? `<div>${esc(a.direccion_ko)}</div>` : ''}
    ${a.direccion_en ? `<div class="muted">${esc(a.direccion_en)}</div>` : ''}
    ${a.nota ? `<div class="muted">${esc(a.nota)}</div>` : ''}</div>`).join('');
  return html;
}

function trasladoCard(t) {
  const tren = t.tren || {};
  return `<div class="card">
    <div class="muted">${esc(t.fecha)}</div>
    <div class="big">${esc(t.de)} → ${esc(t.a)} ${ver(t)}</div>
    <div>${estadoBadge(t)}</div>
    ${tren.salida || tren.llegada ? `<div>🚆 Sale ${esc(tren.salida || '?')} · Llega ${esc(tren.llegada || '?')}
      ${tren.comprado === false ? '<span class="badge pend">billete sin comprar</span>' : ''}</div>` : ''}
    ${arr(t.pasos).length ? `<ol>${arr(t.pasos).map(p => `<li>${esc(p)}</li>`).join('')}</ol>` : ''}
    ${t.frase_ko ? `<div class="ko">${esc(t.frase_ko)}</div>` : ''}
    ${t.romanizacion ? `<div class="muted">${esc(t.romanizacion)}</div>` : ''}
  </div>`;
}

const sitiosCiudad = k => {
  const base = CATALOGO[k] || [], ko = new Set(base.map(l => l.ko));
  return [...base, ...(LP[k] || []).filter(l => !l.ko || !ko.has(l.ko))];
};
const lpTag = l => l.lp ? ` <span class="badge otro">LP${l.top ? ' ★' : ''}</span>` : '';
const interesDe = c => arr(c.interes).length ? arr(c.interes) : (CATALOGO[norm(c.nombre)] || []).filter(l => !/^(Estación|Aeropuerto)/.test(l.es)).map(l => l.es);

function viewRuta() {
  let html = pendingAlert();

  const ciudades = arr(trip.ciudades);
  if (ciudades.length) html += '<h2>Mapa</h2>' + viewMapa() + '<h2>Ciudades</h2>' + ciudades.map((c, i) => `<div class="card" id="c-${esc(c.id)}">
    <div class="big">${i + 1}. ${esc(c.nombre)} ${c.ko ? `<span class="muted">${esc(c.ko)}</span>` : ''}</div>
    <div class="muted">${esc(c.desde)} → ${esc(c.hasta)}</div>
    ${interesDe(c).length ? `<ul>${interesDe(c).map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}
    ${(LP[norm(c.nombre)] || []).length && !arr(trip.ciudades).slice(0, i).some(o => norm(o.nombre) === norm(c.nombre)) ? `<details><summary class="muted">Lonely Planet 2016 recomienda (${LP[norm(c.nombre)].length})</summary><ul>
      ${LP[norm(c.nombre)].map(l => `<li><b>${esc(l.es)}</b>${l.top ? ' ★' : ''}${l.verificar ? ' <span class="ver">VERIFICAR</span>' : ''}<br><span class="muted">${esc(l.tipo)} · ${esc(l.nota)}</span></li>`).join('')}</ul></details>` : ''}</div>`).join('');

  const tr = arr(trip.traslados);
  if (tr.length) html += '<h2>Traslados</h2>' + tr.map(trasladoCard).join('');
  const vuelos = arr(trip.vuelos);
  if (vuelos.length) html += '<h2>Vuelos</h2>' + vuelos.map(v => `<div class="card">
    <div class="big">${esc(v.tramo)} ${ver(v)}</div>
    <div class="muted">${esc(v.fecha)} · ${esc(v.aerolinea)}</div>${estadoBadge(v)}</div>`).join('');
  return html || '<p class="muted">Sin datos de ruta.</p>';
}


// ---------- mapa esquemático (SVG propio, sin internet) ----------
// Coordenadas aproximadas de reserva si el JSON no trae lat/lon.
const COORDS = {
  seul: [37.57, 126.98], incheon: [37.46, 126.44], andong: [36.57, 128.73],
  gyeongju: [35.86, 129.22], busan: [35.18, 129.08], jeonju: [35.82, 127.15]
};
// Contorno simplificado de Corea del Sur [lon, lat].
const COSTA = [[126.55,37.75],[127,38],[127.5,38.3],[128,38.3],[128.35,38.6],[128.59,38.2],
  [128.9,37.75],[129.12,37.5],[129.4,37],[129.4,36.4],[129.57,36.08],[129.45,35.5],[129.15,35.1],
  [128.6,34.85],[128.4,34.83],[127.7,34.7],[127.3,34.5],[126.7,34.3],[126.5,34.3],[126.35,34.75],
  [126.4,35],[126.4,35.3],[126.6,35.98],[126.15,36.75],[126.6,37],[126.6,37.45]];
const norm = t => String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z]/g, '');
const XY = ([lat, lon]) => [((lon - 125.9) * 81 + 10).toFixed(1), ((38.75 - lat) * 100 + 10).toFixed(1)];
function coordsDe(nombre) {
  const c = arr(trip.ciudades).find(c => norm(c.nombre) === norm(nombre) && c.lat != null && c.lon != null);
  return c ? [c.lat, c.lon] : COORDS[norm(nombre)];
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
  let tramos = arr(trip.traslados).map(t => ({ a: coordsDe(t.de), b: coordsDe(t.a), pend: isPend(t) }));
  const conTraslado = new Set(arr(trip.traslados).map(t => norm(t.de) + '>' + norm(t.a)));
  ciudades.forEach((c, i) => { // completa tramos sin traslado definido
    const d = ciudades[i + 1]; if (!d || conTraslado.has(norm(c.nombre) + '>' + norm(d.nombre))) return;
    tramos.push({ a: coordsDe(c.nombre), b: coordsDe(d.nombre), pend: false });
  });
  tramos = tramos.filter(t => t.a && t.b && String(t.a) !== String(t.b));
  const costa = COSTA.map(([lon, lat]) => XY([lat, lon]).join(',')).join(' ');
  return `<svg class="mapa" viewBox="0 0 335 495" role="img" aria-label="Mapa de la ruta">
    <polygon class="tierra" points="${costa}"/>
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

function lugarFila(l, key) {
  return `<div class="card lugar">
    <div><div class="big">${esc(l.es)}${lpTag(l)} ${ver(l)}</div>
    ${l.ko ? `<div class="ko">${esc(l.ko)}</div>` : '<div class="falta">falta hangul: copiar de Naver Map</div>'}</div>
    <button data-full="${key}">Enseñar</button></div>`;
}
// Ciudades del viaje (en orden, sin repetir) y después el resto del catálogo.
function ciudadesCatalogo() {
  const ids = [...new Set(arr(trip.ciudades).map(c => norm(c.nombre)))].filter(k => CATALOGO[k] || LP[k]);
  return [...ids, ...Object.keys(CATALOGO).filter(k => !ids.includes(k))];
}
const nombreCiudad = k => (arr(trip.ciudades).find(c => norm(c.nombre) === k) || {}).nombre || k;

function viewEnsenar() {
  const mios = arr(trip.lugares);
  return '<p class="muted">Toca "Enseñar" para mostrarlo a pantalla completa al taxista o en recepción.</p>' +
    (mios.length ? '<h2>Mis lugares</h2>' + mios.map((l, i) => lugarFila(l, 'j:' + i)).join('') : '') +
    '<h2>Sitios conocidos</h2>' +
    ciudadesCatalogo().map(k => `<details><summary class="card big">${esc(nombreCiudad(k))}</summary>
      ${sitiosCiudad(k).map((l, i) => lugarFila(l, `c:${k}:${i}`)).join('')}</details>`).join('');
}

function full(html) {
  const div = document.createElement('div');
  div.id = 'full';
  div.innerHTML = '<button class="sec cerrar" data-close>✕ Cerrar</button>' + html;
  document.body.appendChild(div);
}
function showFull(key) {
  const [t, a, b] = key.split(':');
  if (t === 'f' || t === 'd') {
    const f = t === 'f' ? FRASES[a] : ((DICC[a] || [])[1] || [])[b]; if (!f) return;
    return full(`<div class="enorme">${esc(f[1])}</div><div class="es">${esc(f[0])} · ${esc(f[2])}</div>`);
  }
  const l = t === 'j' ? arr(trip.lugares)[a] : sitiosCiudad(a)[b];
  if (!l) return;
  full(`${l.ko ? `<div class="enorme">${esc(fraseTaxi(l.ko))}</div>
      ${particula(l.ko) ? '' : '<div class="es">VERIFICAR partícula (으)로</div>'}`
      : '<div class="falta">falta hangul: copiar de Naver Map</div>'}
    ${l.direccion_ko ? `<div class="dir">${esc(l.direccion_ko)}</div>` : ''}
    <div class="es">${esc(l.es)}${l.romanizacion ? ' · ' + esc(l.romanizacion) : ''}
      ${l.direccion_en ? '<br>' + esc(l.direccion_en) : ''}${l.nota ? '<br>' + esc(l.nota) : ''}
      ${l.verificar ? '<br><span class="ver">VERIFICAR</span>' : ''}</div>`);
}

// ---------- Corea (frases, diccionario, guía) ----------
let coreaSub = 'frases';
const sinTildes = t => String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const dFila = (e, key) => `<div class="card lugar" data-full="${key}"><div><div>${esc(e[0])}${e[3] ? ' <span class="ver">VERIFICAR</span>' : ''}</div>
  <div class="ko">${esc(e[1])}</div><div class="muted">${esc(e[2])}</div></div></div>`;

function dResultados(q) {
  q = sinTildes(q).trim();
  if (!q) return DICC.map(([cat, es], ci) => `<details><summary class="card big">${esc(cat)} <span class="muted">${es.length}</span></summary>
    ${es.map((e, i) => dFila(e, `d:${ci}:${i}`)).join('')}</details>`).join('');
  const res = [];
  DICC.forEach(([, es], ci) => es.forEach((e, i) => {
    if (sinTildes(e[0]).includes(q) || sinTildes(e[2]).includes(q) || e[1].includes(q)) res.push(dFila(e, `d:${ci}:${i}`));
  }));
  return res.length ? res.slice(0, 80).join('') : '<p class="muted">Sin resultados. Prueba con otra palabra.</p>';
}

function viewCorea() {
  const seg = [['frases', 'Frases'], ['dicc', 'Diccionario'], ['guia', 'Guía']].map(([k, t]) =>
    `<button class="${coreaSub === k ? '' : 'sec'}" data-sub="${k}">${t}</button>`).join('');
  let html = `<div class="row daynav">${seg}</div>`;
  if (coreaSub === 'frases') html += '<p class="muted">Toca una frase para verla a pantalla completa.</p>' +
    FRASES.map((f, i) => dFila([f[0], f[1], f[2]], 'f:' + i)).join('');
  else if (coreaSub === 'dicc') html += `<input id="q" type="search" placeholder="Buscar (español, coreano o romanización)" autocomplete="off">
    <div id="dres">${dResultados('')}</div>`;
  else html += `<div class="card muted">La guía Lonely Planet de 2016 solo vale para cultura. Precios y apps hay que verificarlos.</div>
    ${GUIA.map(([t, ps]) => `<details><summary class="card big">${esc(t)}</summary><div class="card"><ul>
      ${ps.map(x => `<li>${esc(x).replace('VERIFICAR', '<span class="ver">VERIFICAR</span>')}</li>`).join('')}</ul></div></details>`).join('')}`;
  return html;
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
  return user;
}
const saveUser = () => save(K_USER, user);

// Lista de casillas: base (del JSON o catálogo) + elementos propios. scope separa cada lista.
function checks(scope, base) {
  const U = u(), propios = arr(U.extra[scope]);
  const items = [...base.map(b => ({ ...b, propio: false })), ...propios.map((t, i) => ({ id: 'p' + i, texto: t, propio: true, i }))];
  const hechos = items.filter(it => U.checklist[scope + '|' + it.id]).length;
  return `<div class="muted">${hechos} de ${items.length} hechos</div>
    ${items.map(it => { const k = scope + '|' + it.id; return `<label class="check card">
      <input type="checkbox" data-check="${esc(k)}" ${U.checklist[k] ? 'checked' : ''}>
      <span>${esc(it.texto)}${it.url ? ` · <a href="${esc(it.url)}" target="_blank" rel="noopener">enlace</a>` : ''}</span>
      ${it.propio ? `<button class="sec mini" data-delitem="${esc(scope)}" data-i="${it.i}">✕</button>` : ''}</label>`; }).join('')}
    <form class="row" data-additem="${esc(scope)}"><input name="t" placeholder="Añadir…" autocomplete="off"><button class="mini">＋</button></form>`;
}

function ciudadesUnicas() {
  const vistas = new Set();
  return arr(trip.ciudades).filter(c => { const k = norm(c.nombre); if (vistas.has(k)) return false; vistas.add(k); return true; });
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

// ---------- Checklist por ciudad ----------
function viewChecklist() {
  const cs = ciudadesUnicas();
  if (!cs.length) return '<p class="muted">No hay ciudades (clave "ciudades").</p>';
  const act = norm(ciudadActual());
  return '<p class="muted">Sitios de interés de cada ciudad y lo que quieras añadir.</p>' + cs.map(c =>
    `<details data-key="ck:${esc(norm(c.nombre))}" ${abierto('ck:' + norm(c.nombre), norm(c.nombre) === act) ? 'open' : ''}><summary class="card big">${esc(c.nombre)}</summary>
      ${checks('c:' + norm(c.nombre), [...interesDe(c), ...(LP[norm(c.nombre)] || []).map(l => l.es + ' (LP)')].map(t => ({ id: norm(t), texto: t })))}</details>`).join('');
}

// ---------- Gastos ----------
const CATS = ['Comida', 'Transporte', 'Alojamiento', 'Entradas', 'Compras', 'Otros'];
const cambio = () => Number(u().cambio) || Number(trip.meta && trip.meta.cambio_won_por_euro) || 0;
const aEur = g => g.moneda === 'EUR' ? g.importe : (cambio() ? g.importe / cambio() : 0);
const eur = n => n.toLocaleString('es-ES', { maximumFractionDigits: 2 }) + ' €';
const won = n => '₩' + Math.round(n).toLocaleString('es-ES');

function viewGastos() {
  const U = u(), G = U.gastos, ref = Number(trip.meta && trip.meta.presupuesto_referencia) || 0;
  const total = G.reduce((a, g) => a + aEur(g), 0);
  const suma = key => { const m = {}; G.forEach(g => { m[g[key] || '—'] = (m[g[key] || '—'] || 0) + aEur(g); }); return m; };
  const tabla = m => Object.entries(m).sort((a, b) => b[1] - a[1]).map(([k, v]) => `<div class="lugar"><span>${esc(k)}</span><b>${eur(v)}</b></div>`).join('');
  const act = ciudadActual();
  return `<div class="card">
      <div class="big">Total: ${eur(total)}</div>
      ${ref ? `<div class="barra"><div style="width:${Math.min(100, total / ref * 100).toFixed(0)}%"></div></div>
        <div class="muted">Presupuesto de referencia: ${eur(ref)} · quedan ${eur(ref - total)}</div>` : ''}
      ${cambio() ? '' : '<div class="falta">Pon el cambio para pasar ₩ a €</div>'}
    </div>
    <form class="card" data-gasto>
      <div class="row"><input name="importe" type="number" inputmode="decimal" step="any" min="0" placeholder="Importe" required>
        <select name="moneda"><option value="KRW">₩</option><option value="EUR">€</option></select></div>
      <input name="concepto" placeholder="Concepto (opcional)" autocomplete="off">
      <div class="row"><select name="cat">${CATS.map(c => `<option>${c}</option>`).join('')}</select>
        <select name="ciudad">${ciudadesUnicas().map(c => `<option ${norm(c.nombre) === norm(act) ? 'selected' : ''}>${esc(c.nombre)}</option>`).join('')}<option>Otra</option></select></div>
      <button>Añadir gasto</button>
    </form>
    <div class="card row"><span>Cambio: 1 € =</span><input data-cambio type="number" inputmode="decimal" step="any" value="${cambio() || ''}" placeholder="₩"><span>₩</span></div>
    ${G.length ? `<h2>Por ciudad</h2><div class="card">${tabla(suma('ciudad'))}</div>
      <h2>Por categoría</h2><div class="card">${tabla(suma('cat'))}</div>
      <h2>Últimos gastos</h2>${G.slice().reverse().map(g => `<div class="card lugar"><div>
        <b>${g.moneda === 'EUR' ? eur(g.importe) : won(g.importe)}</b>${g.moneda === 'EUR' ? '' : ` <span class="muted">≈ ${eur(aEur(g))}</span>`}
        <div class="muted">${esc(g.fecha)} · ${esc(g.ciudad)} · ${esc(g.cat)}${g.concepto ? ' · ' + esc(g.concepto) : ''}</div></div>
        <button class="sec mini" data-delgasto="${esc(g.id)}">✕</button></div>`).join('')}` : '<p class="muted">Aún no hay gastos.</p>'}`;
}

function viewMas() {
  const t = load(K_THEME, 'auto');
  const docs = arr(trip && trip.checklist_documentos).map((d, i) => ({ id: d.id || 'd' + i, texto: d.texto, url: d.url }));
  return `${trip ? `<h2>Maleta y documentos</h2>${checks('docs', docs)}
    <h2>Notas</h2><textarea data-notas rows="6" placeholder="Escribe aquí… (se guarda solo)">${esc(u().notas)}</textarea>` : ''}
    <h2>Datos del viaje</h2>
    <button data-act="import">📂 Importar viaje</button>
    <button class="sec" data-act="export">💾 Exportar copia</button>
    <p class="muted">La copia incluye el viaje, gastos, checklist y notas. Guárdala fuera del móvil.</p>
    <h2>Tema</h2>
    <div class="row">
      ${['auto', 'light', 'dark'].map(v => `<button class="${t === v ? '' : 'sec'}" data-theme="${v}">
        ${{ auto: 'Auto', light: 'Claro', dark: 'Oscuro' }[v]}</button>`).join('')}
    </div>
    <h2>Borrar</h2>
    <button class="danger" data-act="wipe">Borrar datos de este móvil</button>`;
}

// ---------- render ----------
function render() {
  applyTheme();
  $('#title').textContent = (trip && trip.meta && trip.meta.titulo) || 'Viaje a Corea';
  $('#tabs').innerHTML = TABS.map(([id, label, ic]) =>
    `<button data-tab="${id}" class="${tab === id ? 'on' : ''}"><span>${ic}</span>${label}</button>`).join('');

  let html;
  if (!trip && tab !== 'mas') html = viewWelcome();
  else switch (tab) {
    case 'hoy': html = viewHoy(); break;
    case 'ruta': html = viewRuta(); break;
    case 'ensenar': html = viewEnsenar(); break;
    case 'seguro': html = viewSeguro(); break;
    case 'corea': html = viewCorea(); break;
    case 'gastos': html = viewGastos(); break;
    case 'checklist': html = viewChecklist(); break;
    default: html = viewMas();
  }
  $('#view').innerHTML = html;
}

document.addEventListener('click', e => {
  const del = e.target.closest('[data-delitem],[data-delgasto]');
  if (del) {
    e.preventDefault();
    if (del.dataset.delgasto) { if (!confirm('¿Borrar este gasto?')) return; u().gastos = user.gastos.filter(g => g.id !== del.dataset.delgasto); }
    else arr(u().extra[del.dataset.delitem]).splice(+del.dataset.i, 1);
    saveUser(); render(); return;
  }
  const x = e.target.closest('[data-full],[data-close],[data-copy],[data-ciudad]');
  if (x) {
    if (x.dataset.full) showFull(x.dataset.full);
    else if (x.dataset.copy) copiar(x.dataset.copy);
    else if (x.dataset.ciudad) document.getElementById('c-' + x.dataset.ciudad)?.scrollIntoView({ behavior: 'smooth' });
    else document.getElementById('full')?.remove();
    return;
  }
  const b = e.target.closest('[data-tab],[data-act],[data-day],[data-theme],[data-go],[data-sub]');
  if (!b) return;
  if (b.dataset.sub) coreaSub = b.dataset.sub;
  else if (b.dataset.tab) { tab = b.dataset.tab; window.scrollTo(0, 0); }
  else if (b.dataset.go) { tab = b.dataset.go; window.scrollTo(0, 0); }
  else if (b.dataset.day) { dayIdx += Number(b.dataset.day); }
  else if (b.dataset.theme) { save(K_THEME, b.dataset.theme); }
  else switch (b.dataset.act) {
    case 'import': $('#file').click(); return;
    case 'export': exportCopy(); return;
    case 'example': loadExample(); return;
    case 'wipe':
      if (!confirm('¿Borrar viaje, gastos, checklist y notas de este móvil? Exporta antes una copia.')) return;
      localStorage.removeItem(K_TRIP); localStorage.removeItem(K_USER);
      trip = null; user = { gastos: [], checklist: {}, notas: '' }; dayIdx = null; tab = 'hoy';
  }
  render();
});
document.addEventListener('input', e => {
  const t = e.target;
  if (t.id === 'q') $('#dres').innerHTML = dResultados(t.value);
  else if (t.dataset.notas !== undefined) { u().notas = t.value; saveUser(); }
});
document.addEventListener('change', e => {
  const t = e.target;
  if (t.dataset.check) { u().checklist[t.dataset.check] = t.checked; if (!t.checked) delete user.checklist[t.dataset.check]; saveUser(); render(); }
  else if (t.dataset.cambio !== undefined) { u().cambio = Number(t.value) || 0; saveUser(); render(); }
});
document.addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target, d = Object.fromEntries(new FormData(f));
  if (f.dataset.additem) {
    const t = (d.t || '').trim(); if (!t) return;
    (u().extra[f.dataset.additem] = arr(user.extra[f.dataset.additem])).push(t);
  } else if (f.dataset.gasto !== undefined) {
    const importe = Number(d.importe); if (!(importe > 0)) return;
    u().gastos.push({ id: Date.now().toString(36), fecha: todayISO(), importe, moneda: d.moneda,
      concepto: (d.concepto || '').trim(), cat: d.cat, ciudad: d.ciudad });
  } else return;
  saveUser(); render();
});
$('#file').addEventListener('change', e => {
  if (e.target.files[0]) importFile(e.target.files[0]);
  e.target.value = '';
});

render();
if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js');
