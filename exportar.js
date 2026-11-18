// 📘 Word y 🖨️ PDF del Resumen del viaje, con fotos y los colores de la app. Sin librerías:
// el Word (.docx) se arma aquí mismo (un .zip con XML) y el PDF sale de "Imprimir → Guardar como PDF".
// Usa datosResumen(), fmtCorto(), FOTOS, fotoWiki() y compartirArchivo() de app.js.

const EX_COL = { hoy: '0047A0', ruta: '0B6E78', planes: '2C6E45', comer: 'C2630A', historia: 'B8322A', mas: '6B3FA0', oro: 'E3B23C' };
const EX_FRANJA = ['2E8B57', 'B8322A', '1F4E8C', 'E3B23C', '2E8B57', 'B8322A', '1F4E8C', 'E3B23C', '2E8B57', 'B8322A', '1F4E8C', 'E3B23C'];
const exFecha = f => { const d = new Date(f + 'T12:00:00'); if (isNaN(d)) return f; const t = d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }); return t[0].toUpperCase() + t.slice(1); };
// Cifras de la portada (en singular o plural).
const exCifras = D => { const pl = (n, a, b) => `${n} ${n === 1 ? a : b}`, vistos = D.dias.reduce((n, d) => n + (d.visto ? d.sitios.length : 0), 0), nc = new Set(D.ruta.map(r => ck(r.ciudad))).size;
  return [['📅', pl(D.nDias, 'día', 'días')], ['🏯', pl(nc, 'ciudad', 'ciudades')], vistos ? ['✅', pl(vistos, 'sitio visitado', 'sitios visitados')] : null, D.comidos.length ? ['🍜', pl(D.comidos.length, 'sitio para comer', 'sitios para comer')] : null].filter(Boolean); };

// Foto de un artículo, recortada a banda 2:1 y en JPEG (sirve para los dos formatos). null si no hay o no se puede leer.
async function exFoto(w) {
  if (!w) return null;
  try {
    const f = FOTOS[w] !== undefined ? FOTOS[w] : await fotoWiki(w); if (!f || !f.src) return null;
    const r = await fetch(f.src, { mode: 'cors', credentials: 'omit' }); if (!r.ok) return null;
    const bm = await createImageBitmap(await r.blob()), W = 1000, H = 500;
    const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
    const esc0 = Math.max(W / bm.width, H / bm.height), sw = W / esc0, sh = H / esc0;
    cv.getContext('2d').drawImage(bm, (bm.width - sw) / 2, (bm.height - sh) / 2, sw, sh, 0, 0, W, H);
    const blob = await new Promise(ok => cv.toBlob(ok, 'image/jpeg', 0.8)); if (!blob) return null;
    return { bytes: new Uint8Array(await blob.arrayBuffer()), url: URL.createObjectURL(blob) };
  } catch { return null; }
}
async function exFotos(D, aviso) {
  const ws = [...new Set([...D.dias.map(d => d.wiki), ...D.comidos.map(c => c.wiki)].filter(Boolean))], m = {};
  for (let i = 0; i < ws.length; i++) { if (aviso) aviso(`Preparando fotos ${i + 1} de ${ws.length}…`); m[ws[i]] = await exFoto(ws[i]); }
  for (const x of arr(D.caps)) { if (aviso) aviso(`Dibujando los mapas de ${x.ciudad}…`);
    for (const r of [null, ...x.recorrido]) { const k = 'mapa:' + x.k + (r ? ':' + r.fecha : ''); try { m[k] = await exMapa(x, r); } catch { m[k] = null; } } }
  return m;
}

// 🗺️ Mapa de cada ciudad para el Word y el PDF: calles de OpenStreetMap (guardadas o con conexión) con el recorrido de cada día
// (hotel → sitios visitados, un color por día) y los sitios numerados como en «Lo que vimos». Sin calles: esquema en papel hanji.
const EX_MW = 1000, EX_MH = 640;
const exPx = (lat, lon, z) => { const n = 256 * 2 ** z, s = Math.sin(lat * Math.PI / 180); return [(lon + 180) / 360 * n, (0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI)) * n]; };
async function exTesela(url) {
  try { const r = await Promise.race([fetch(url, { mode: 'cors', credentials: 'omit' }), new Promise((_, no) => setTimeout(() => no(new Error('t')), 7000))]);
    return r.ok ? await createImageBitmap(await r.blob()) : null; } catch { return null; }
}
// solo = un día (su recorrido y sus sitios, con los mismos números): mapa más apaisado dentro de la ficha del día.
async function exMapa(x, solo) {
  const rec = solo ? [solo] : x.recorrido, items = x.items.filter(i => i.co && (!solo || solo.ns.includes(i.n))), hoteles = rec.map(r => r.hotel).filter(Boolean);
  if (!items.length) return null;
  const W = EX_MW, H = solo ? 460 : EX_MH, todos = [...items.map(i => i.co), ...hoteles];
  const caja = z => { const ps = todos.map(([a, b]) => exPx(a, b, z)), xs = ps.map(p => p[0]), ys = ps.map(p => p[1]);
    return [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)]; };
  let z = 16; for (; z > 10; z--) { const [x0, x1, y0, y1] = caja(z); if (x1 - x0 <= W - 150 && y1 - y0 <= H - 150) break; }
  const [x0, x1, y0, y1] = caja(z), ox = (x0 + x1) / 2 - W / 2, oy = (y0 + y1) / 2 - H / 2;
  const P = co => { const [px, py] = exPx(co[0], co[1], z); return [px - ox, py - oy]; };
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const g = cv.getContext('2d');
  // Papel hanji de fondo (se ve si faltan calles).
  g.fillStyle = '#f3ead6'; g.fillRect(0, 0, W, H);
  // Teselas, de 4 en 4 para no cargar el servidor de OpenStreetMap.
  const n = 2 ** z, ts = [];
  for (let tx = Math.floor(ox / 256); tx <= Math.floor((ox + W) / 256); tx++) for (let ty = Math.floor(oy / 256); ty <= Math.floor((oy + H) / 256); ty++) ts.push([tx, ty]);
  const bms = new Array(ts.length); let k = 0;
  await Promise.all([0, 1, 2, 3].map(async () => { while (k < ts.length) { const i = k++, [tx, ty] = ts[i]; bms[i] = await exTesela(`https://tile.openstreetmap.org/${z}/${((tx % n) + n) % n}/${ty}.png`); } }));
  const osm = bms.filter(Boolean).length > 0;
  if (osm) { bms.forEach((b, i) => b && g.drawImage(b, ts[i][0] * 256 - ox, ts[i][1] * 256 - oy)); g.fillStyle = 'rgba(251,247,238,.25)'; g.fillRect(0, 0, W, H); }
  else { const gr = g.createLinearGradient(0, 0, W, H); gr.addColorStop(0, x.c2 + '22'); gr.addColorStop(1, x.c1 + '18'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    g.strokeStyle = 'rgba(140,110,60,.12)'; g.lineWidth = 1; for (let i = 0; i < W; i += 50) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, H); g.stroke(); } for (let i = 0; i < H; i += 50) { g.beginPath(); g.moveTo(0, i); g.lineTo(W, i); g.stroke(); }
    g.fillStyle = 'rgba(80,60,30,.55)'; g.font = 'bold 22px Georgia, serif'; g.textAlign = 'center'; g.fillText('N', W - 34, 38); g.beginPath(); g.moveTo(W - 34, 44); g.lineTo(W - 42, 64); g.lineTo(W - 26, 64); g.closePath(); g.fill(); }
  // Posición de cada número (si se pisan, se separan un poco).
  const pos = {}, puestos = [];
  items.forEach(i => { let [px, py] = P(i.co), t = 0; while (puestos.some(([a, b]) => Math.hypot(a - px, b - py) < 30) && t < 12) { px += Math.cos(t * 1.7) * 30; py += Math.sin(t * 1.7) * 30; t++; } puestos.push([px, py]); pos[i.n] = [px, py]; });
  // Recorrido de cada día.
  g.lineJoin = g.lineCap = 'round';
  rec.forEach(r => { const pts = [...(r.hotel ? [P(r.hotel)] : []), ...r.ns.map(m => pos[m]).filter(Boolean)]; if (pts.length < 2) return;
    [[10, 'rgba(255,255,255,.9)'], [5, r.col]].forEach(([w, c]) => { g.lineWidth = w; g.strokeStyle = c; g.beginPath(); pts.forEach(([a, b], i) => i ? g.lineTo(a, b) : g.moveTo(a, b)); g.stroke(); }); });
  // Hoteles (H) y sitios numerados con el color de la ciudad.
  g.textAlign = 'center'; g.textBaseline = 'middle';
  [...new Set(hoteles.map(String))].map(s => s.split(',').map(Number)).forEach(co => { const [a, b] = P(co);
    g.fillStyle = '#1b2230'; g.strokeStyle = '#fff'; g.lineWidth = 3; g.beginPath(); g.roundRect ? g.roundRect(a - 15, b - 15, 30, 30, 7) : g.rect(a - 15, b - 15, 30, 30); g.fill(); g.stroke();
    g.fillStyle = '#fff'; g.font = 'bold 17px sans-serif'; g.fillText('H', a, b + 1); });
  items.forEach(i => { const [a, b] = pos[i.n]; g.shadowColor = 'rgba(0,0,0,.35)'; g.shadowBlur = 5; g.fillStyle = x.c1; g.beginPath(); g.arc(a, b, 15, 0, 7); g.fill(); g.shadowBlur = 0;
    g.strokeStyle = '#fff'; g.lineWidth = 3; g.stroke(); g.fillStyle = '#fff'; g.font = `bold ${i.n > 9 ? 14 : 16}px sans-serif`; g.fillText(String(i.n), a, b + 1); });
  if (osm) { g.font = '13px sans-serif'; g.textAlign = 'right'; g.textBaseline = 'alphabetic'; const t = '© OpenStreetMap', w = g.measureText(t).width;
    g.fillStyle = 'rgba(255,255,255,.85)'; g.fillRect(W - w - 14, H - 22, w + 14, 22); g.fillStyle = '#444'; g.fillText(t, W - 7, H - 6); }
  const blob = await new Promise(ok => cv.toBlob(ok, 'image/jpeg', 0.86)); if (!blob) return null;
  return { bytes: new Uint8Array(await blob.arrayBuffer()), url: URL.createObjectURL(blob), w: W, h: H, osm };
}
const exEstado = (btn, t) => { if (btn) { btn.dataset.txt = btn.dataset.txt || btn.textContent; btn.textContent = t || btn.dataset.txt; btn.disabled = !!t; } };

// ---------- Word (.docx) ----------
const X = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const wr = (t, o = {}) => `<w:r><w:rPr>${o.f ? `<w:rFonts w:ascii="${o.f}" w:hAnsi="${o.f}"/>` : ''}${o.b ? '<w:b/>' : ''}${o.i ? '<w:i/>' : ''}${o.c ? `<w:color w:val="${o.c}"/>` : ''}${o.sz ? `<w:sz w:val="${o.sz * 2}"/>` : ''}</w:rPr><w:t xml:space="preserve">${X(t)}</w:t></w:r>`;
const wp = (runs, o = {}) => `<w:p><w:pPr>${o.keep ? '<w:keepNext/>' : ''}${o.borde ? `<w:pBdr><w:left w:val="single" w:sz="24" w:space="8" w:color="${o.borde}"/></w:pBdr>` : ''}${o.fondo ? `<w:shd w:val="clear" w:color="auto" w:fill="${o.fondo}"/>` : ''}<w:spacing w:before="${o.antes || 0}" w:after="${o.despues == null ? 100 : o.despues}"/>${o.borde || o.fondo ? '<w:ind w:left="180" w:right="180"/>' : ''}${o.al ? `<w:jc w:val="${o.al}"/>` : ''}</w:pPr>${runs}</w:p>`;
const wSalto = '<w:p><w:r><w:br w:type="page"/></w:r></w:p>';
const wFranja = () => { const n = EX_FRANJA.length, cw = Math.floor(9900 / n);
  return `<w:tbl><w:tblPr><w:tblW w:w="${cw * n}" w:type="dxa"/><w:tblLayout w:type="fixed"/></w:tblPr><w:tblGrid>${EX_FRANJA.map(() => `<w:gridCol w:w="${cw}"/>`).join('')}</w:tblGrid>
    <w:tr><w:trPr><w:trHeight w:val="110" w:hRule="exact"/></w:trPr>${EX_FRANJA.map(c => `<w:tc><w:tcPr><w:tcW w:w="${cw}" w:type="dxa"/><w:shd w:val="clear" w:color="auto" w:fill="${c}"/></w:tcPr><w:p><w:pPr><w:spacing w:before="0" w:after="0"/></w:pPr></w:p></w:tc>`).join('')}</w:tr></w:tbl>`; };
const wTitulo = (ic, t, col) => wp(wr(ic + '  ', { sz: 18 }) + wr(t.toUpperCase(), { b: true, c: col, sz: 16, f: 'Georgia' }), { keep: true, antes: 320, despues: 140 })
  + `<w:p><w:pPr><w:pBdr><w:top w:val="single" w:sz="12" w:space="1" w:color="${col}"/></w:pBdr><w:spacing w:before="0" w:after="120"/></w:pPr></w:p>`;

function docxXML(D, fotos) {
  const rels = [], img = (w, ancho = 6200000) => { const f = fotos[w]; if (!f) return '';
    const id = 'rIdF' + (rels.length + 1), n = rels.length + 1, alto = Math.round(ancho * (f.h || 1) / (f.w || 2)); rels.push({ id, n, bytes: f.bytes });
    return wp(`<w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0"><wp:extent cx="${ancho}" cy="${alto}"/><wp:docPr id="${n}" name="Foto ${n}"/>
      <a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">
      <pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:nvPicPr><pic:cNvPr id="${n}" name="foto${n}.jpeg"/><pic:cNvPicPr/></pic:nvPicPr>
      <pic:blipFill><a:blip r:embed="${id}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill>
      <pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${ancho}" cy="${alto}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r>`, { keep: true, despues: 60, al: 'center' }); };
  const B = [];
  // Portada
  B.push(wFranja(), wp(wr('대한민국', { c: EX_COL.historia, sz: 14 }), { antes: 600, despues: 40, al: 'center' }),
    wp(wr('🇰🇷 ' + D.titulo, { b: true, sz: 30, f: 'Georgia', c: '1B2230' }), { al: 'center', despues: 80 }),
    wp(wr(D.nDias ? `${exFecha(D.desde)} → ${exFecha(D.hasta)}` : '', { c: '6B6255', sz: 13 }), { al: 'center', despues: 300 }));
  const portada = D.dias.find(d => fotos[d.wiki]); if (portada) B.push(img(portada.wiki));
  B.push(wp(exCifras(D).map(([ic, t]) => wr(`  ${ic} ${t}  `, { b: true, c: EX_COL.hoy })).join(wr(' · ', { c: 'B0A690' })), { al: 'center', antes: 200, despues: 200 }));
  B.push(wp(wr('Nuestro resumen para quien prepare su viaje: ruta, traslados, lo que vimos cada día, dónde comimos y lo que aprendimos.', { i: true, c: '6B6255' }), { al: 'center' }), wFranja(), wSalto);
  // Ruta
  const est = v => v ? wr(estrTxt(v), { c: EX_COL.oro }) : '', hx = c => String(c).replace('#', '').toUpperCase();
  if (D.ruta.length) { B.push(wTitulo('✈️', 'Ruta', EX_COL.ruta));
    D.ruta.forEach(r => { const t = tema(ck(r.ciudad)), c = hx(t.c1);
      B.push(wp(wr(t.ic + ' ' + r.ciudad + ' ', { b: true, sz: 13, c }) + (r.ko ? wr(r.ko + '  ', { c: '8A8070' }) : '') + wr(`${fmtCorto(r.desde)}${r.hasta ? ' → ' + fmtCorto(r.hasta) : ''}${r.noches ? ` · ${r.noches} noche${r.noches > 1 ? 's' : ''}` : ''}`, { c: '6B6255' }), { borde: c, fondo: 'FBF7EE', despues: r.hotel ? 0 : 100 }));
      if (r.hotel) B.push(wp(wr('🛏️ ' + r.hotel + '  ') + est(r.val), { borde: c, fondo: 'FBF7EE' })); }); }
  if (D.traslados.length) { B.push(wTitulo('🚆', 'Cómo nos movimos', EX_COL.ruta));
    D.traslados.forEach(t => { B.push(wp(wr(`${t.ic}  ${fmtCorto(t.fecha)}  `, { b: true }) + wr(`${t.de} → ${t.a}`, { b: true, c: EX_COL.ruta }) + wr(`  ${t.nom}${t.numero ? ' ' + t.numero : ''}${t.horas ? ` · ${t.horas}` : ''}${t.precio ? ' · ' + t.precio : ''}  `, { c: '6B6255' }) + est(t.val), { despues: 80 })); }); }
  const dia = (d, col, x) => {
    B.push(wp(wr(`DÍA ${d.n}`, { b: true, c: 'FFFFFF', sz: 10 }) + wr(`   ${exFecha(d.fecha)}`, { b: true, c: 'FFFFFF', sz: 10 }) + (d.cara ? wr('   ' + d.cara, { sz: 12 }) : ''), { fondo: col, keep: true, antes: 240, despues: 0 }));
    if (fotos[d.wiki]) B.push(img(d.wiki));
    if (d.titulo) B.push(wp(wr(d.titulo, { b: true, sz: 14, f: 'Georgia', c: '1B2230' }), { keep: true, despues: 60 }));
    if (d.sitios.length) B.push(wp(wr(d.visto ? '✅ Vimos: ' : '📍 Plan: ', { b: true, c: d.visto ? '2E7D4F' : '8A5A14' }) + wr(d.sitios.join(' · '))));
    if (x && fotos['mapa:' + x.k + ':' + d.fecha]) B.push(img('mapa:' + x.k + ':' + d.fecha, 5000000));
    if (d.tags.length) B.push(wp(wr('🏷️ ' + d.tags.join(' · '), { c: '6B6255' })));
    if (d.diario) B.push(wp(wr('📔 ', {}) + wr(d.diario, { i: true }), { borde: EX_COL.mas, fondo: 'F5F0FA' }));
  };
  const comida = (c, col) => { B.push(wp(wr(c.nombre + ' ', { b: true, sz: 12, c: col }) + (c.ko ? wr(c.ko + '  ', { c: '8A8070' }) : '') + est(c.val), { borde: col, fondo: 'FDF6EE', despues: 0, keep: true }));
    B.push(wp(wr(c.plato || ' ', { c: '6B6255' }) + (c.nota ? wr('  📝 ' + c.nota, { i: true }) : ''), { borde: col, fondo: 'FDF6EE' })); };
  const sub = (ic, t, col) => wp(wr(ic + '  ', { sz: 13 }) + wr(t, { b: true, sz: 13, c: col, f: 'Georgia' }), { keep: true, antes: 260, despues: 80 });
  if (arr(D.diasFuera).length) { B.push(wTitulo('✈️', 'Ida y vuelta', EX_COL.hoy)); D.diasFuera.forEach(d => dia(d, EX_COL.hoy)); }
  // Un capítulo por ciudad: banda con su color, hotel, mapa con el recorrido, lo que vimos (numerado como en el mapa), días y comidas.
  arr(D.caps).forEach(x => { const c1 = hx(x.c1), p = x.dias.find(d => fotos[d.wiki]), m = fotos['mapa:' + x.k];
    const cel = [wp(wr(x.ic + '  ', { sz: 26 }) + wr(x.ciudad, { b: true, sz: 26, f: 'Georgia', c: 'FFFFFF' }) + (x.ko ? wr('   ' + x.ko, { sz: 14, c: 'FFFFFF' }) : ''), { antes: 120, despues: 40 }),
      x.lema ? wp(wr(x.lema, { i: true, c: 'FFFFFF', sz: 12 }), { despues: 40 }) : '', wp(wr('📅 ' + exFechasCap(x), { b: true, c: 'FFFFFF', sz: 11 }), { despues: 120 })].join('');
    B.push(wSalto, `<w:tbl><w:tblPr><w:tblW w:w="9900" w:type="dxa"/><w:tblLayout w:type="fixed"/><w:tblCellMar><w:left w:w="240" w:type="dxa"/><w:right w:w="240" w:type="dxa"/></w:tblCellMar></w:tblPr><w:tblGrid><w:gridCol w:w="9900"/></w:tblGrid>
      <w:tr><w:tc><w:tcPr><w:tcW w:w="9900" w:type="dxa"/><w:shd w:val="clear" w:color="auto" w:fill="${c1}"/></w:tcPr>${cel}</w:tc></w:tr></w:tbl>`, wFranja());
    if (p) B.push(img(p.wiki));
    if (x.hoteles.length) x.hoteles.forEach(h => B.push(wp(wr('🛏️ ' + h.nombre + '  ', { b: true }) + est(h.val), { borde: c1, fondo: 'FBF7EE' })));
    if (m) { B.push(sub('🗺️', 'Nuestro recorrido', c1), img('mapa:' + x.k));
      B.push(wp(x.recorrido.map(r => wr('━━ ', { b: true, c: hx(r.col) }) + wr(`Día ${r.n} · ${fmtCorto(r.fecha)}    `, { c: '4A4A4A', sz: 9 })).join('') + wr('H', { b: true, c: '1B2230', sz: 9 }) + wr(' Hotel', { c: '4A4A4A', sz: 9 }) + (m.osm ? '' : wr('   (esquema: no había calles guardadas)', { i: true, c: '8A8070', sz: 9 })), { al: 'center' })); }
    if (x.items.length) { B.push(sub('✅', 'Lo que vimos', c1)); x.items.forEach(i => B.push(wp(wr(` ${i.n} `, { b: true, c: c1 }) + wr('  ' + i.es + '  ') + est(i.v), { despues: 40 }))); }
    if (x.dias.length) { B.push(sub('📅', 'Día a día', c1)); x.dias.forEach(d => dia(d, c1, x)); }
    if (x.comidos.length) { B.push(sub('🍜', 'Dónde comimos', c1)); x.comidos.forEach(c => comida(c, c1)); }
  });
  if (arr(D.probados).length) { B.push(wSalto, wTitulo('🥢', 'Lo que probamos', EX_COL.oro)); D.probados.forEach(g => B.push(wp(wr(g.t + ': ', { b: true }) + wr(g.xs.join(', '))))); }
  if (arr(D.otros).length) { B.push(wTitulo('📍', 'Otros sitios', EX_COL.comer)); D.otros.forEach(c => comida(c, EX_COL.comer)); }
  if (D.consejos.length) B.push(wTitulo('💡', 'Consejos prácticos', EX_COL.planes), ...D.consejos.map(c => wp(wr('• ' + c))));
  B.push(wFranja());
  const doc = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing">
<w:body>${B.join('')}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1000" w:right="1000" w:bottom="1000" w:left="1000" w:header="500" w:footer="500" w:gutter="0"/></w:sectPr></w:body></w:document>`;
  return { doc, rels };
}
async function exportarWord(btn) {
  exEstado(btn, 'Preparando…');
  try {
    const D = datosResumen(), fotos = await exFotos(D, t => exEstado(btn, t)), { doc, rels } = docxXML(D, fotos), te = new TextEncoder();
    const files = [
      ['[Content_Types].xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Default Extension="jpeg" ContentType="image/jpeg"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/></Types>`],
      ['_rels/.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`],
      ['word/_rels/document.xml.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rIdS" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>${rels.map(r => `<Relationship Id="${r.id}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/foto${r.n}.jpeg"/>`).join('')}</Relationships>`],
      ['word/styles.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:eastAsia="Malgun Gothic" w:cs="Calibri"/><w:color w:val="2B2B2B"/><w:sz w:val="21"/><w:lang w:val="es-ES" w:eastAsia="ko-KR"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="100" w:line="276" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults></w:styles>`],
      ['word/document.xml', doc]
    ].map(([n, t]) => [n, te.encode(t)]);
    rels.forEach(r => files.push([`word/media/foto${r.n}.jpeg`, r.bytes]));
    const blob = zipStore(files), nombre = `viaje-corea-${todayISO()}.docx`, tipo = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    const file = new File([blob], nombre, { type: tipo });
    if (navigator.canShare && navigator.canShare({ files: [file] })) { try { await navigator.share({ files: [file], title: nombre }); return; } catch (e) { if (e && e.name === 'AbortError') return; } }
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = nombre; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    if (!rels.length) alert('El Word va sin fotos: abre antes Planes con conexión para que se guarden y vuelve a probar.');
  } catch (e) { alert('No se pudo crear el Word: ' + (e && e.message || e)); }
  finally { exEstado(btn); }
}
// .zip sin comprimir (suficiente para un .docx; las fotos ya van en JPEG).
const CRC_T = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
const crc32 = b => { let c = 0xFFFFFFFF; for (let i = 0; i < b.length; i++) c = CRC_T[(c ^ b[i]) & 255] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; };
function zipStore(files) {
  const te = new TextEncoder(), partes = [], central = []; let off = 0;
  const d = new Date(), hora = (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1), dia = ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate();
  files.forEach(([nombre, datos]) => { const nb = te.encode(nombre), crc = crc32(datos), h = new DataView(new ArrayBuffer(30));
    [[0, 0x04034b50, 4], [4, 20, 2], [6, 0x0800, 2], [8, 0, 2], [10, hora, 2], [12, dia, 2], [14, crc, 4], [18, datos.length, 4], [22, datos.length, 4], [26, nb.length, 2], [28, 0, 2]]
      .forEach(([o, v, n]) => n === 4 ? h.setUint32(o, v, true) : h.setUint16(o, v, true));
    const c = new DataView(new ArrayBuffer(46));
    [[0, 0x02014b50, 4], [4, 20, 2], [6, 20, 2], [8, 0x0800, 2], [10, 0, 2], [12, hora, 2], [14, dia, 2], [16, crc, 4], [20, datos.length, 4], [24, datos.length, 4], [28, nb.length, 2], [30, 0, 2], [32, 0, 2], [34, 0, 2], [36, 0, 2], [38, 0, 4], [42, off, 4]]
      .forEach(([o, v, n]) => n === 4 ? c.setUint32(o, v, true) : c.setUint16(o, v, true));
    partes.push(h, nb, datos); central.push(c, nb); off += 30 + nb.length + datos.length; });
  const tam = central.reduce((n, x) => n + x.byteLength, 0), fin = new DataView(new ArrayBuffer(22));
  [[0, 0x06054b50, 4], [4, 0, 2], [6, 0, 2], [8, files.length, 2], [10, files.length, 2], [12, tam, 4], [16, off, 4], [20, 0, 2]]
    .forEach(([o, v, n]) => n === 4 ? fin.setUint32(o, v, true) : fin.setUint16(o, v, true));
  return new Blob([...partes, ...central, fin], { type: 'application/zip' });
}

// ---------- PDF: vista bonita a pantalla completa y "Imprimir → Guardar como PDF" ----------
const exFechasCap = x => x.estancias.map(r => `${fmtCorto(r.desde)}${r.hasta ? ' → ' + fmtCorto(r.hasta) : ''}`).join(' · ') + (x.noches ? ` · ${x.noches} noche${x.noches > 1 ? 's' : ''}` : '');
function docHTML(D, fotos) {
  const e = esc, ft = (w, cls = '') => fotos[w] ? `<img class="dx-foto ${cls}" src="${fotos[w].url}" alt="">` : '';
  const sec = (ic, t, col, cuerpo, salto) => `<section class="dx-sec ${salto ? 'dx-salto' : ''}" style="--c:#${col}"><h2><span>${ic}</span>${e(t)}</h2>${cuerpo}</section>`;
  const est = v => v ? `<span class="dx-est">${'★'.repeat(v)}<span>${'☆'.repeat(5 - v)}</span></span>` : '';
  const dia = (d, x) => { const m = x && fotos['mapa:' + x.k + ':' + d.fecha];
    return `<article class="dx-dia"><div class="dx-dcab"><span>DÍA ${d.n}</span>${e(exFecha(d.fecha))}${d.cara ? `<i>${d.cara}</i>` : ''}</div>
      ${ft(d.wiki)}<div class="dx-dcuerpo">${m ? `<img class="dx-dmapa" src="${m.url}" alt="Recorrido del día ${d.n}">` : ''}${d.titulo ? `<h3>${e(d.titulo)}</h3>` : ''}
      ${d.sitios.length ? `<div class="dx-chips"><b class="${d.visto ? 'ok' : ''}">${d.visto ? '✅ Vimos' : '📍 Plan'}</b>${d.sitios.map(s => `<span>${e(s)}</span>`).join('')}</div>` : ''}
      ${d.tags.length ? `<div class="dx-chips">${d.tags.map(t => `<span>${e(t)}</span>`).join('')}</div>` : ''}${d.diario ? `<div class="dx-diario">📔 ${e(d.diario)}</div>` : ''}</div></article>`; };
  const comida = c => `<div class="dx-card">${ft(c.wiki, 'dx-mini')}<b class="dx-c">${e(c.nombre)}</b> <span class="dx-mut">${e(c.ko)}</span>
      ${c.val ? `<div>${est(c.val)}</div>` : ''}${c.plato ? `<div class="dx-mut">${e(c.plato)}</div>` : ''}${c.nota ? `<div class="dx-nota">📝 ${e(c.nota)}</div>` : ''}</div>`;
  const cap = x => { const p = x.dias.find(d => fotos[d.wiki]), m = fotos['mapa:' + x.k];
    return `<section class="dx-cap dx-salto" style="--c1:${x.c1};--c2:${x.c2};--c:${x.c1}">
      <div class="dx-banner"${p ? ` style="background-image:linear-gradient(100deg, ${x.c1}f2 0%, ${x.c1}c0 50%, ${x.c2}66 100%), url('${fotos[p.wiki].url}')"` : ''}>
        <div class="dx-bic">${x.ic}</div><div class="dx-btx">${x.ko ? `<div class="dx-bko">${e(x.ko)}</div>` : ''}<h2>${e(x.ciudad)}</h2>${x.lema ? `<p>${e(x.lema)}</p>` : ''}<div class="dx-bfe">📅 ${e(exFechasCap(x))}</div></div></div>
      <div class="dx-franja dx-frc"></div>
      ${x.hoteles.length ? `<div class="dx-hot">${x.hoteles.map(h => `<span>🛏️ <b>${e(h.nombre)}</b> ${est(h.val)}</span>`).join('')}</div>` : ''}
      ${m ? `<h3 class="dx-h3">🗺️ Nuestro recorrido</h3><figure class="dx-mapa"><img src="${m.url}" alt="Mapa de ${e(x.ciudad)}"><figcaption>${x.recorrido.map(r => `<span><i style="background:${r.col}"></i>Día ${r.n} · ${e(fmtCorto(r.fecha))}</span>`).join('')}<span><b class="dx-hh">H</b> Hotel</span>${m.osm ? '' : '<span class="dx-mut">(esquema: no había calles guardadas)</span>'}</figcaption></figure>` : ''}
      ${x.items.length ? `<h3 class="dx-h3">✅ Lo que vimos</h3><ol class="dx-vistos">${x.items.map(i => `<li><b class="dx-num">${i.n}</b><span>${e(i.es)}</span>${est(i.v)}</li>`).join('')}</ol>` : ''}
      ${x.dias.length ? `<h3 class="dx-h3">📅 Día a día</h3>${x.dias.map(d => dia(d, x)).join('')}` : ''}
      ${x.comidos.length ? `<h3 class="dx-h3">🍜 Dónde comimos</h3><div class="dx-comer">${x.comidos.map(comida).join('')}</div>` : ''}
    </section>`; };
  const portada = D.dias.find(d => fotos[d.wiki]);
  return `<div class="dx-franja"></div>
  <div class="dx-portada"><div class="dx-ko">대한민국</div><h1>🇰🇷 ${e(D.titulo)}</h1>${D.nDias ? `<p class="dx-fechas">${e(exFecha(D.desde))} → ${e(exFecha(D.hasta))}</p>` : ''}
    ${portada ? ft(portada.wiki, 'dx-gran') : ''}
    <div class="dx-cifras">${exCifras(D).map(([ic, t]) => `<span>${ic} <b>${e(t)}</b></span>`).join('')}</div>
    <p class="dx-lema">Nuestro resumen para quien prepare su viaje: ruta, traslados, lo que vimos en cada ciudad, dónde comimos y lo que aprendimos.</p></div>
  ${D.ruta.length ? sec('✈️', 'Ruta', EX_COL.ruta, `<div class="dx-ruta">${D.ruta.map(r => { const t = tema(ck(r.ciudad)); return `<div class="dx-card" style="--c:${t.c1}"><b class="dx-c">${t.ic} ${e(r.ciudad)}</b> <span class="dx-mut">${e(r.ko)}</span>
      <div class="dx-mut">${e(fmtCorto(r.desde))}${r.hasta ? ' → ' + e(fmtCorto(r.hasta)) : ''}${r.noches ? ` · ${r.noches} noche${r.noches > 1 ? 's' : ''}` : ''}</div>${r.hotel ? `<div>🛏️ ${e(r.hotel)} ${est(r.val)}</div>` : ''}</div>`; }).join('')}</div>`, true) : ''}
  ${D.traslados.length ? sec('🚆', 'Cómo nos movimos', EX_COL.ruta, D.traslados.map(t => `<div class="dx-tras"><span class="dx-ic">${t.ic}</span><div><b>${e(fmtCorto(t.fecha))} · ${e(t.de)} → ${e(t.a)}</b>
      <div class="dx-mut">${e(t.nom)}${t.numero ? ' ' + e(t.numero) : ''}${t.horas ? ' · ' + e(t.horas) : ''}${t.precio ? ' · ' + e(t.precio) : ''} ${est(t.val)}</div></div></div>`).join('')) : ''}
  ${arr(D.diasFuera).length ? sec('✈️', 'Ida y vuelta', EX_COL.hoy, D.diasFuera.map(d => dia(d)).join('')) : ''}
  ${arr(D.caps).map(cap).join('')}
  ${arr(D.probados).length ? sec('🥢', 'Lo que probamos', EX_COL.oro, `<ul>${D.probados.map(g => `<li><b>${e(g.t)}:</b> ${e(g.xs.join(', '))}</li>`).join('')}</ul>`, true) : ''}
  ${arr(D.otros).length ? sec('📍', 'Otros sitios', EX_COL.comer, `<div class="dx-comer">${D.otros.map(comida).join('')}</div>`) : ''}
  ${D.consejos.length ? sec('💡', 'Consejos prácticos', EX_COL.planes, `<ul>${D.consejos.map(c => `<li>${e(c)}</li>`).join('')}</ul>`) : ''}
  <div class="dx-franja"></div>`;
}
async function verPDF(btn) {
  exEstado(btn, 'Preparando…');
  try {
    const D = datosResumen(), fotos = await exFotos(D, t => exEstado(btn, t));
    let v = document.getElementById('doc-vista'); if (v) v.remove();
    v = document.createElement('div'); v.id = 'doc-vista';
    v.innerHTML = `<div class="dx-barra"><button data-dx="pdf">🖨️ Guardar como PDF</button><button class="sec" data-dx="cerrar">✕ Cerrar</button></div>
      <p class="dx-ayuda">En la ventana de imprimir elige <b>«Guardar como PDF»</b> como impresora.</p><div class="dx-doc">${docHTML(D, fotos)}</div>`;
    document.body.appendChild(v); document.body.classList.add('con-doc'); window.scrollTo(0, 0);
    v.addEventListener('click', ev => { const b = ev.target.closest('[data-dx]'); if (!b) return;
      if (b.dataset.dx === 'pdf') window.print();
      else { v.remove(); document.body.classList.remove('con-doc'); Object.values(fotos).forEach(f => f && URL.revokeObjectURL(f.url)); } });
  } catch (e) { alert('No se pudo preparar el PDF: ' + (e && e.message || e)); }
  finally { exEstado(btn); }
}
