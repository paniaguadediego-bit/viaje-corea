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

function viewRuta() {
  let html = pendingAlert();
  const vuelos = arr(trip.vuelos);
  if (vuelos.length) html += '<h2>Vuelos</h2>' + vuelos.map(v => `<div class="card">
    <div class="big">${esc(v.tramo)} ${ver(v)}</div>
    <div class="muted">${esc(v.fecha)} · ${esc(v.aerolinea)}</div>${estadoBadge(v)}</div>`).join('');

  const ciudades = arr(trip.ciudades);
  if (ciudades.length) html += '<h2>Ciudades</h2>' + ciudades.map((c, i) => `<div class="card">
    <div class="big">${i + 1}. ${esc(c.nombre)} ${c.ko ? `<span class="muted">${esc(c.ko)}</span>` : ''}</div>
    <div class="muted">${esc(c.desde)} → ${esc(c.hasta)}</div></div>`).join('');

  const tr = arr(trip.traslados);
  if (tr.length) html += '<h2>Traslados</h2>' + tr.map(trasladoCard).join('');
  return html || '<p class="muted">Sin datos de ruta.</p>';
}

function viewPronto(nombre, ses) {
  return `<div class="card"><div class="big">${nombre}</div><p class="muted">Llega en la sesión ${ses}.</p></div>`;
}

function viewMas() {
  const t = load(K_THEME, 'auto');
  return `<h2>Datos del viaje</h2>
    <button data-act="import">📂 Importar viaje</button>
    <button class="sec" data-act="export">💾 Exportar copia</button>
    <p class="muted">La copia incluye el viaje, gastos, checklist y notas. Guárdala fuera del móvil.</p>
    <h2>Tema</h2>
    <div class="row">
      ${['auto', 'light', 'dark'].map(v => `<button class="${t === v ? '' : 'sec'}" data-theme="${v}">
        ${{ auto: 'Auto', light: 'Claro', dark: 'Oscuro' }[v]}</button>`).join('')}
    </div>
    ${viewPronto('Maleta / Documentos y Notas', 'S5')}
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
    case 'ensenar': html = viewPronto('Enseñar (tarjetas para taxi y hotel)', 'S2'); break;
    case 'seguro': html = viewPronto('Seguro', 'S2'); break;
    case 'corea': html = viewPronto('Corea y frases útiles', 'S3'); break;
    case 'gastos': html = viewPronto('Gastos', 'S5'); break;
    case 'checklist': html = viewPronto('Checklist por ciudad', 'S5'); break;
    default: html = viewMas();
  }
  $('#view').innerHTML = html;
}

document.addEventListener('click', e => {
  const b = e.target.closest('[data-tab],[data-act],[data-day],[data-theme],[data-go]');
  if (!b) return;
  if (b.dataset.tab) { tab = b.dataset.tab; window.scrollTo(0, 0); }
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
$('#file').addEventListener('change', e => {
  if (e.target.files[0]) importFile(e.target.files[0]);
  e.target.value = '';
});

render();
if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js');
