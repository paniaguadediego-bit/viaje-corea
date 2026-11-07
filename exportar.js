// 📘 Word y 📕 PDF del Resumen del viaje, con fotos y los colores de la app. Sin librerías:
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
  return m;
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
    const id = 'rIdF' + (rels.length + 1), n = rels.length + 1, alto = Math.round(ancho / 2); rels.push({ id, n, bytes: f.bytes });
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
  if (D.ruta.length) { B.push(wTitulo('✈️', 'Ruta', EX_COL.ruta));
    D.ruta.forEach(r => { B.push(wp(wr(r.ciudad + ' ', { b: true, sz: 13, c: EX_COL.ruta }) + (r.ko ? wr(r.ko + '  ', { c: '8A8070' }) : '') + wr(`${fmtCorto(r.desde)}${r.hasta ? ' → ' + fmtCorto(r.hasta) : ''}${r.noches ? ` · ${r.noches} noche${r.noches > 1 ? 's' : ''}` : ''}`, { c: '6B6255' }), { borde: EX_COL.ruta, fondo: 'F4F8F8', despues: r.hotel || r.nota ? 0 : 100 }));
      if (r.hotel) B.push(wp(wr('🛏️ ' + r.hotel), { borde: EX_COL.ruta, fondo: 'F4F8F8', despues: r.nota ? 0 : 100 }));
      if (r.nota) B.push(wp(wr('📝 ' + r.nota, { i: true }), { borde: EX_COL.ruta, fondo: 'F4F8F8' })); });
    D.notasHotel.forEach(x => B.push(wp(wr('📝 ' + x.es + ': ', { b: true }) + wr(x.t, { i: true })))); }
  if (D.traslados.length) { B.push(wTitulo('🚆', 'Cómo nos movimos', EX_COL.ruta));
    D.traslados.forEach(t => { B.push(wp(wr(`${t.ic}  ${fmtCorto(t.fecha)}  `, { b: true }) + wr(`${t.de} → ${t.a}`, { b: true, c: EX_COL.ruta }) + wr(`  ${t.nom}${t.numero ? ' ' + t.numero : ''}${t.horas ? ` · ${t.horas}` : ''}${t.precio ? ' · ' + t.precio : ''}`, { c: '6B6255' }), { despues: t.nota ? 0 : 80 }));
      if (t.nota) B.push(wp(wr('📝 ' + t.nota, { i: true }), { despues: 80 })); }); }
  // Día a día
  B.push(wSalto, wTitulo('📅', 'Día a día', EX_COL.hoy));
  D.dias.forEach(d => {
    B.push(wp(wr(`DÍA ${d.n}`, { b: true, c: 'FFFFFF', sz: 10 }) + wr(`   ${exFecha(d.fecha)} · ${d.ciudad}`, { b: true, c: 'FFFFFF', sz: 10 }) + (d.cara ? wr('   ' + d.cara, { sz: 12 }) : ''), { fondo: EX_COL.hoy, keep: true, antes: 240, despues: 0 }));
    if (fotos[d.wiki]) B.push(img(d.wiki));
    if (d.titulo) B.push(wp(wr(d.titulo, { b: true, sz: 14, f: 'Georgia', c: '1B2230' }), { keep: true, despues: 60 }));
    if (d.sitios.length) B.push(wp(wr(d.visto ? '✅ Vimos: ' : '📍 Plan: ', { b: true, c: d.visto ? '2E7D4F' : '8A5A14' }) + wr(d.sitios.join(' · '))));
    d.notas.forEach(x => B.push(wp(wr('📝 ' + x.es + ': ', { b: true }) + wr(x.t, { i: true }), { borde: EX_COL.oro, fondo: 'FBF5E6' })));
    if (d.diario) B.push(wp(wr('📔 ', {}) + wr(d.diario, { i: true }), { borde: EX_COL.mas, fondo: 'F5F0FA' }));
  });
  // Comer
  if (D.comidos.length) { B.push(wSalto, wTitulo('🍜', 'Dónde comimos', EX_COL.comer));
    D.comidos.forEach(c => { B.push(wp(wr(c.nombre + ' ', { b: true, sz: 12, c: EX_COL.comer }) + (c.ko ? wr(c.ko + '  ', { c: '8A8070' }) : '') + (c.val ? wr('★'.repeat(c.val) + '☆'.repeat(5 - c.val), { c: EX_COL.oro }) : ''), { borde: EX_COL.comer, fondo: 'FDF6EE', despues: 0, keep: true }));
      B.push(wp(wr(`${c.ciudad}${c.plato ? ' · ' + c.plato : ''}`, { c: '6B6255' }) + (c.nota ? wr('  📝 ' + c.nota, { i: true }) : ''), { borde: EX_COL.comer, fondo: 'FDF6EE' })); }); }
  if (D.top.length) { B.push(wTitulo('⭐', 'Imprescindibles para nosotros', EX_COL.oro)); D.top.forEach(c => B.push(wp(wr('⭐ ' + c.nombre, { b: true }) + wr(` (${c.ciudad})`, { c: '6B6255' })))); }
  if (D.resto.length) { B.push(wTitulo('📝', 'Más notas nuestras', EX_COL.mas)); D.resto.forEach(x => B.push(wp(wr(x.es + ': ', { b: true }) + wr(x.t, { i: true })))); }
  if (D.malos.length) { B.push(wTitulo('👎', 'No merece tanto la pena', EX_COL.historia)); D.malos.forEach(m => B.push(wp(wr('• ' + m)))); }
  B.push(wTitulo('💡', 'Consejos prácticos', EX_COL.planes), ...D.consejos.map(c => wp(wr('• ' + c))), wFranja());
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
function docHTML(D, fotos) {
  const e = esc, ft = (w, cls = '') => fotos[w] ? `<img class="dx-foto ${cls}" src="${fotos[w].url}" alt="">` : '';
  const sec = (ic, t, col, cuerpo, salto) => `<section class="dx-sec ${salto ? 'dx-salto' : ''}" style="--c:#${col}"><h2><span>${ic}</span>${e(t)}</h2>${cuerpo}</section>`;
  const portada = D.dias.find(d => fotos[d.wiki]);
  return `<div class="dx-franja"></div>
  <div class="dx-portada"><div class="dx-ko">대한민국</div><h1>🇰🇷 ${e(D.titulo)}</h1>${D.nDias ? `<p class="dx-fechas">${e(exFecha(D.desde))} → ${e(exFecha(D.hasta))}</p>` : ''}
    ${portada ? ft(portada.wiki, 'dx-gran') : ''}
    <div class="dx-cifras">${exCifras(D).map(([ic, t]) => `<span>${ic} <b>${e(t)}</b></span>`).join('')}</div>
    <p class="dx-lema">Nuestro resumen para quien prepare su viaje: ruta, traslados, lo que vimos cada día, dónde comimos y lo que aprendimos.</p></div>
  ${D.ruta.length ? sec('✈️', 'Ruta', EX_COL.ruta, `<div class="dx-ruta">${D.ruta.map(r => `<div class="dx-card"><b class="dx-c">${e(r.ciudad)}</b> <span class="dx-mut">${e(r.ko)}</span>
      <div class="dx-mut">${e(fmtCorto(r.desde))}${r.hasta ? ' → ' + e(fmtCorto(r.hasta)) : ''}${r.noches ? ` · ${r.noches} noche${r.noches > 1 ? 's' : ''}` : ''}</div>${r.hotel ? `<div>🛏️ ${e(r.hotel)}</div>` : ''}${r.nota ? `<div class="dx-nota">📝 ${e(r.nota)}</div>` : ''}</div>`).join('')}</div>
      ${D.notasHotel.map(x => `<div class="dx-nota">📝 <b>${e(x.es)}:</b> ${e(x.t)}</div>`).join('')}`, true) : ''}
  ${D.traslados.length ? sec('🚆', 'Cómo nos movimos', EX_COL.ruta, D.traslados.map(t => `<div class="dx-tras"><span class="dx-ic">${t.ic}</span><div><b>${e(fmtCorto(t.fecha))} · ${e(t.de)} → ${e(t.a)}</b>
      <div class="dx-mut">${e(t.nom)}${t.numero ? ' ' + e(t.numero) : ''}${t.horas ? ' · ' + e(t.horas) : ''}${t.precio ? ' · ' + e(t.precio) : ''}</div>${t.nota ? `<div class="dx-nota">📝 ${e(t.nota)}</div>` : ''}</div></div>`).join('')) : ''}
  ${sec('📅', 'Día a día', EX_COL.hoy, D.dias.map(d => `<article class="dx-dia"><div class="dx-dcab"><span>DÍA ${d.n}</span>${e(exFecha(d.fecha))} · ${e(d.ciudad)}${d.cara ? `<i>${d.cara}</i>` : ''}</div>
      ${ft(d.wiki)}<div class="dx-dcuerpo">${d.titulo ? `<h3>${e(d.titulo)}</h3>` : ''}
      ${d.sitios.length ? `<div class="dx-chips"><b class="${d.visto ? 'ok' : ''}">${d.visto ? '✅ Vimos' : '📍 Plan'}</b>${d.sitios.map(s => `<span>${e(s)}</span>`).join('')}</div>` : ''}
      ${d.notas.map(x => `<div class="dx-nota">📝 <b>${e(x.es)}:</b> ${e(x.t)}</div>`).join('')}${d.diario ? `<div class="dx-diario">📔 ${e(d.diario)}</div>` : ''}</div></article>`).join(''), true)}
  ${D.comidos.length ? sec('🍜', 'Dónde comimos', EX_COL.comer, `<div class="dx-comer">${D.comidos.map(c => `<div class="dx-card">${ft(c.wiki, 'dx-mini')}<b class="dx-c">${e(c.nombre)}</b> <span class="dx-mut">${e(c.ko)}</span>
      ${c.val ? `<div class="dx-est">${'★'.repeat(c.val)}<span>${'☆'.repeat(5 - c.val)}</span></div>` : ''}<div class="dx-mut">${e(c.ciudad)}${c.plato ? ' · ' + e(c.plato) : ''}</div>${c.nota ? `<div class="dx-nota">📝 ${e(c.nota)}</div>` : ''}</div>`).join('')}</div>`, true) : ''}
  ${D.top.length ? sec('⭐', 'Imprescindibles para nosotros', EX_COL.oro, `<ul>${D.top.map(c => `<li><b>${e(c.nombre)}</b> <span class="dx-mut">(${e(c.ciudad)})</span></li>`).join('')}</ul>`) : ''}
  ${D.resto.length ? sec('📝', 'Más notas nuestras', EX_COL.mas, `<ul>${D.resto.map(x => `<li><b>${e(x.es)}:</b> ${e(x.t)}</li>`).join('')}</ul>`) : ''}
  ${D.malos.length ? sec('👎', 'No merece tanto la pena', EX_COL.historia, `<ul>${D.malos.map(m => `<li>${e(m)}</li>`).join('')}</ul>`) : ''}
  ${sec('💡', 'Consejos prácticos', EX_COL.planes, `<ul>${D.consejos.map(c => `<li>${e(c)}</li>`).join('')}</ul>`)}
  <div class="dx-franja"></div>`;
}
async function verPDF(btn) {
  exEstado(btn, 'Preparando…');
  try {
    const D = datosResumen(), fotos = await exFotos(D, t => exEstado(btn, t));
    let v = document.getElementById('doc-vista'); if (v) v.remove();
    v = document.createElement('div'); v.id = 'doc-vista';
    v.innerHTML = `<div class="dx-barra"><button data-dx="pdf">📕 Guardar como PDF</button><button class="sec" data-dx="cerrar">✕ Cerrar</button></div>
      <p class="dx-ayuda">En la ventana de imprimir elige <b>«Guardar como PDF»</b> como impresora.</p><div class="dx-doc">${docHTML(D, fotos)}</div>`;
    document.body.appendChild(v); document.body.classList.add('con-doc'); window.scrollTo(0, 0);
    v.addEventListener('click', ev => { const b = ev.target.closest('[data-dx]'); if (!b) return;
      if (b.dataset.dx === 'pdf') window.print();
      else { v.remove(); document.body.classList.remove('con-doc'); Object.values(fotos).forEach(f => f && URL.revokeObjectURL(f.url)); } });
  } catch (e) { alert('No se pudo preparar el PDF: ' + (e && e.message || e)); }
  finally { exEstado(btn); }
}
