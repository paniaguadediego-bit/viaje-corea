# App de viaje a Corea (PWA personal, offline)

Web instalable (PWA) en GitHub Pages para UNA persona, en su
móvil, 100 % offline. Viaje: Corea del Sur, 3-19 nov 2026
(Seúl, Andong, Gyeongju, Busan, Jeonju, Seúl).

## Reglas fijas
1. Repo PÚBLICO. Nunca subir trip.json real, PDFs, número de
   póliza, reservas ni datos personales. Datos de ejemplo
   siempre FICTICIOS.
2. Los datos del viaje entran solo con el botón "Importar
   viaje" (archivo JSON) y se guardan en el móvil (IndexedDB o
   localStorage). También "Exportar copia" (descarga un JSON
   con gastos, checklist y notas).
3. HTML, CSS y JS puro. Sin frameworks, backend, cuentas ni CDN.
4. Rutas RELATIVAS en todo (la app vive en /viaje-corea/, no en
   la raíz): start_url "./index.html" (sin id ni scope:
   así se instala en el Xiaomi del usuario), service worker con ruta
   relativa, iconos relativos.
5. Pestañas (barra inferior, 8; desde v161): Hoy, Ruta (✈️), Planes (🏯; antes Planes/Explorar/Ciudades; id interno 'ciudades'; por ciudad, botones
   📍 Puntos de interés / 🍜 Comer (lo que era la pestaña Comer, filtrado por esa ciudad; el antiguo tab 'comer' redirige aquí) / 🧩 Miscelánea), Mapas (🗺️, mapa de cada ciudad con botones de ciudad; la ficha de cada icono enlaza con Planes, Comer, Miscelánea u Hoy → Hotel), Historia, Corea (🇰🇷 solo la Guía), Idioma (🔤) y Más. Historia (pestaña propia): portada,
   ⏳ Línea del tiempo (HIST_EVENTOS en historia.js, unas 35 fechas que abren su capítulo), 📚 Capítulos (cada uno con
   época y años, "En 30 segundos", fechas clave y "📍 Dónde lo veréis" con enlace a Planes; HIST_META), 🏯 Vuestras
   ciudades (HISTORIA de cada ciudad) y 🇰🇷 Símbolos. Miscelánea (antes Planes) va dentro de Planes (calendario del Mundial de LoL plegado: WORLDS en contenido.js, hora de
   Corea y dónde estaréis; botones en orden alfabético Curioso (cafés de animales, postres famosos, tiendas raras) / Lavandería / LoL (con consejos de PC bang y T1 HQ Shop) / Ropa (cerca del hotel o en barrios del itinerario; Musinsa Standard y galerías subterráneas, lo que recomiendan los viajeros) que muestran sus sitios debajo: PLANES en contenido.js,
   con distancia al hotel, "cerca", foto, 💰 precio aproximado y 👥 reseñas; lavandería en cada ciudad; sin Cosmética desde v146: hay tiendas por todas partes). Corea es la Guía en bloques temáticos (GUIA_BLOQUES: 🚇 Moverse, 💳 Dinero y compras, 🍜 Comida (con 🥢 Platos típicos, PLATOS, que salió de Comer, y 🍪 Snacks de tienda 24 h: SNACKS en contenido.js con hangul, 🔊 y una línea, más la captura que añada el usuario, guardada solo en su móvil en localStorage corea.img.snacks; nunca se sube al repo porque no es nuestra), 🙇 Costumbres y cultura, 🚨 Salud, seguridad y práctico, y 🏛️ País: sociedad.js, PAIS con Política, Educación, Ser médico, Sueldos y trabajo y Población, cada tema con fuentes y fecha de búsqueda; POBLACION = habitantes bajo el nombre de cada ciudad en Planes, con hangul, 🗣️ pronunciación y 🔊; el tema abierto sale bajo su bloque). Idioma tiene apartados: ⭐ Favoritas (primero y abierto por defecto), 🔤 Hangul, Frases, Diccionario y Enseñar. 🔤 Hangul (hangul.js: HG_LEC 11 lecciones esquematizadas con letras, sonido a la española,
   romanización, ejemplo con 🔊, trucos y reglas de lectura, marca de leída en user.hgLeidas; 🪧 Carteles HG_CARTELES descompuestos letra a letra; 🎯 Practicar:
   test de letras o carteles que repite lo fallado, user.hgTest; 🔗 Fuentes gratuitas HG_FUENTES) y ⭐ Favoritas (☆ en cada frase, palabra y cartel; user.favs; agrupadas en Frases, Palabras y Carteles)
   (la Historia, historia.js: 22 capítulos con marca de leído en user.leidos y diseño hanji/dancheong, pasó a su pestaña en v103). Más es una rejilla de iconos
   como la Guía (se toca y sale debajo): Maleta, Seguro,
   Verificar, Documentos (fotos/PDF), Notas, 🎁 Regalos (user.regalos: para quién, qué, dónde, ✍️ quién lo apunta (nombre en localStorage corea.yo, solo en ese móvil; filtro por autor si hay dos), comprado), 📖 Resumen del viaje (datosResumen() con lo marcado: copiar, compartir, .txt, 📘 Word .docx y 📕 PDF con fotos y colores de la app; exportar.js, sin librerías: el .docx es un zip hecho a mano y el PDF sale de Imprimir → Guardar como PDF; el service worker pide las fotos de Wikipedia con CORS para poder meterlas), Escala Pekín (hora de Pekín, vuestras escalas desde trip.vuelos,
   tránsito, equipaje, internet, baterías, dinero y frases en chino a pantalla completa) y Datos y app (importar,
   exportar, "📤 Pasar mis marcas" (archivo corea-marcas que al importarlo en el otro móvil se UNE, sin borrar nada), "📊 Qué tocáis y qué no" (desde v181: recuento solo en el móvil, localStorage corea.uso, de qué controles se ven y se tocan, agrupados por función; lista "nunca tocado" por pestaña y "lo más tocado", con Copiar y Poner a cero; sirve para decidir qué quitar), "Preparar para viajar" (con wifi: app offline, fotos, mapas, tiempo,
   cambio y aviso de copia), actualizar, borrar). En Hoy, botón rojo "🆘 Ayuda"
   a pantalla completa: hotel de esta noche en hangul grande, 112/119/1330,
   seguro y Embajada de España (urgencia consular VERIFICAR). El conversor ₩/€
   es el botón 💱 junto al título y se abre en una ventana. Antes, 🔍 (desde v183): buscador global en ventana que busca a la vez en Puntos de interés, Comer, Miscelánea, itinerario (días), Frases, Diccionario, Guía e Historia (sin tildes y en hangul); tocar un resultado cierra la ventana y lleva a su ficha (frases y palabras: pantalla completa; 🔊 en la propia fila). Gastos: quitado (el usuario usa
   otra app). No añadir
   nada que no esté aquí. Ruta: vuelos, mapa y línea de tiempo con cada estancia (ciudad,
   noches, hotel y una línea por día) intercalada con los traslados; vuelos, estancias y traslados plegables, plegados solos cuando ya pasaron (o el traslado se marcó hecho en Hoy). Incluye un mapa esquemático de
   Corea (SVG propio, offline) con ciudades, traslados y sitios
   (las fichas de ciudad con sitios van en Planes: buscador arriba (todas las ciudades, sin tildes y en hangul;
   también en Comer), 5 botones, se despliega la ciudad elegida con sus botones; cada sitio tiene
   "📅" para apuntarlo a un día de esa ciudad). Agenda en user.agenda[fecha]
   = {add, del}: Hoy → Sitios es la "Ruta del día": hotel → sitios del
   itinerario en orden fijo (orden del texto) → "Añadidos desde Ciudades"
   al final (se quitan con ✕), ordenados por el camino más corto desde el
   último sitio y con aviso "💡 Os pilla de paso entre A y B (desvío)"
   si encajan mejor dentro del itinerario. Cada parada lleva su número (el mismo que en el mapa del día) y es una ficha plegable con tono del color de la pestaña y filo izquierdo (los tramos, sin fondo) y la foto arriba a la derecha (se pliega sola al marcarla visitada). Entre cada dos puntos, en su propia franja plegable ("⬇️ Hasta <sitio>"; se pliega sola si el destino ya está visitado), distancia, tiempo
   aproximado (a pie ≤1,6 km; si no, líneas de metro concretas con data/metro.json:
   Seúl © OpenStreetMap ODbL, Busan L1/L2 a mano con VERIFICAR; o taxi; si sale taxi y hay alternativa, "🚌 Sin taxi:" con bus o tren de SIN_TAXI en contenido.js, clave = hangul del destino, VERIFICAR) y "🧭 Ruta" que abre
   la app de Naver Map (nmap://route, sin origen: sale desde la ubicación del móvil; si gana el taxi, el metro va plegado como alternativa; misma decisión en el horario). Botón "🧭 Todo el día en Naver" (ruta en coche con hasta 5 paradas intermedias por enlace; si hay más, tramos: cada uno sale tras la parada desde la que empieza). "Horario del día" quitado en v163 (sus tiempos no eran reales); HORARIOS en contenido.js sigue dando el "🕒" de cada sitio, con cierre semanal y VERIFICAR. Título "Ruta del día", botón de Naver y tramos, centrados; 🏯 (solo icono, va a Planes) junto a "Visitado"; cada ficha muestra si está plegada («▸ más») o abierta (▾). En Hoy cada sitio va compacto (horario, una frase y "🏯 Ver en Planes", que abre su ficha). En Planes, una sola lista por ciudad (imprescindibles + Lonely + catálogo, sin repetir, todos) con orden 📅 Itinerario (por día) / 🏷️ Tipo / 🔤 A-Z (desde v188 un solo botón ⇅ que va cambiando, en la misma fila compacta que los filtros, con el número dentro y sin la línea «n de m visitados»), filtro Todos / Itinerario / LP / Otros (Otros solo si hay) (más ✅ Marcados / ☐ No marcados desde v187, que se suma a ese filtro; tocar otra vez lo quita) y "✅ n de m visitados"; cada sitio es una ficha plegada (foto, nombre, fecha del plan, una línea y casilla de visitado); abiertas muestran todo: "☐ Visitado", 📅, Naver y Google, ⭐ valoración propia de 1 a 5 (user.estrellas[clave] = {n, v}; tocar la misma la quita; también en Miscelánea y hoteles; va al pasar marcas y al Resumen: en Más → Resumen, "✅ Planes realizados" lista por ciudad y numerados los sitios visitados con estrellas para tocar; "⭐ Imprescindibles" = solo los de 5 ★ (sitios y Comer); sin "No merece tanto la pena"), distancia, horario, descripción, Más de la Lonely y Con ojos de guía sin más desplegables. Banner con vista previa del mapa encima de la Ruta del día (hotel y sitios numerados unidos por línea; al tocarlo, mapa grande con filtros "Cerca de la ruta": Puntos de interés, Comer y Miscelánea a ≤1,2 km, apagados por defecto) y pestaña Mapas con el mapa de cada
   ciudad (capas itinerario, 🏯 Puntos de interés (marcador 🏯 con borde azul), Comer, Miscelánea y hotel; visitado = fondo verde con ✓ y su icono; parada del itinerario de un día ya pasado y sin visitar = medio transparente; tocar = ficha con
   Naver y botón a su sección: Planes, Comer, Miscelánea u Hoy → Hotel). Solo iconos, sin nombres; los que se pisan (<28 px) se separan solos con un hilo y un puntito a su sitio real. Mapa propio sin librerías: puntos offline; calles de OpenStreetMap solo con conexión
   (el service worker guarda las teselas vistas en 'corea-mapa'; "Preparar para viajar" baja
   ~1.000 teselas de zoom 12-16 alrededor de los sitios del viaje; nunca zoom 17+ ni ciudades enteras).
   Intercalado tras la parada donde encaja y plegado, "💡 Cerca y no lo tenéis":
   hasta 4 sitios recomendados que no están en ningún día y quedan a
   ≤900 m de la ruta, con "+" para añadirlos a ese día; también en el mapa del día con asterisco y la
   parada tras la que encajan ("2*" = entre la 2 y la 3; "H*" = tras el hotel). Extras
   aprobados: conversor ₩↔€ con cambio automático del BCE vía
   api.frankfurter (solo con conexión; se guarda para offline; se
   puede fijar a mano), tiempo previsto por día (Open-Meteo, sin clave,
   hasta 16 días; solo con conexión, se guarda para offline y muestra
   "hace X h") en la tarjeta del día de Hoy y en cada día de Ruta,
   destacados de la ciudad en Hoy, lista
   Verificar (marca "✓ verificado" en el móvil), botón "Naver" (abre la app de Naver Map con nmap://search; si no se
   abre en 1,5 s, la web móvil m.map.naver.com; igual con Kakao Map; requiere conexión) y junto a él "📍 Google" (Google Maps, búsqueda por hangul o dirección),
   Hoy con tira deslizable de días, tarjeta del día con una franja de color propia (día X de Y, fecha, ciudad, título y tiempo) y debajo un carrusel con las fotos de los sitios del día, cada una con el nombre de su sitio (en una pastilla oscura para que se lea sobre cualquier foto) y puntitos de posición; pasa sola cada 6 s con fundido cruzado y a mano con flechas ‹ › o deslizando el dedo (tras tocarlo, espera 10 s antes de seguir solo); sustituye a las etiquetas de sitios, itinerario del día en esquema (icono y título corto, sin columna de horas desde v180; "▾ Leer más" amplía cada línea con su texto completo en el mismo sitio; cada sitio con horario en HORARIOS lleva sus horas entre paréntesis justo detrás de su nombre, una vez por día y en la línea que más lo nombra, con * si es VERIFICAR; la leyenda sale con "Leer más"). Desde v158 sin botones; orden desde v163: traslado, 🛏️ Hotel plegado (por fechas, no por ciudad; el nombre en la cabecera, sin repetirlo dentro; los días de cambio, el que se deja y el de esa noche), Sitios y 📔 «¿Qué tal el día?» plegado; "Ciudad" quitado; en la tira de días, la carita va como añadido pequeño sin tapar el icono de la ciudad,
   "☔ Plan B" a cubierto si el pronóstico marca lluvia (plegado), avisos de trip.avisos tachables (user.avisosOk; el número cuenta solo los pendientes), "Primero, el traslado" con casilla de hecho y plegable (sin estrellas en los traslados), "🧳 Antes de salir" (plegable; el día del vuelo de vuelta: saldo T-money, quiosco Tax Free y wones) al principio de Sitios los días que se deja hotel (vuelo, tren, pagar hotel, pasaportes…; casillas por fecha),
   "📔 Diario" (carita pequeña entre 6: Genial, Muy bien, Bien, Normal, Cansado, Duro; etiquetas del día, varias a la vez, ETIQ_DIA en user.diario[f].tags, que salen en el Resumen; y nota por día en user.diario; resumen en Más → Notas;
   en viaje, días pasados atenuados, avisos solo en días con traslado y sin avisos de compras pasadas), tarjeta "Ahora" (lo próximo con hora o cuenta
   atrás) en Hoy, 🔊 escuchar en coreano (voz del móvil, speechSynthesis ko-KR; dos toques = despacio) en Frases, Diccionario y toda pantalla completa con hangul, hora de Canarias en la cabecera (entre 💱 y la versión; la de Corea no: la da el móvil), frases por situación en Corea, fotos y PDF de
   documentos/billetes en Más (IndexedDB, solo en el móvil; el PDF se
   abre con el visor del móvil). Gastos
   compartidos: descartado por el usuario.
6. Dato dudoso = "VERIFICAR". No inventar hangul, teléfonos,
   horarios ni precios. Si un objeto del JSON trae
   "verificar": true, mostrar una marca visible.
7. Mobile-first, compacto pero legible, una mano, tema claro/oscuro. Estilo desde v109: papel hanji, franja
   dancheong y un color por pestaña (body[data-pest] → --acc; nunca data-tab en el body) en títulos, botones activos y filo de las tarjetas.
8. Cada sesión acaba con: cómo probarlo en modo avión, versión
   subida (CACHE en sw.js y VERSION en app.js, iguales), PROGRESO.md actualizado
   y commit en main.

## Cómo trabajar
- Al empezar lee CLAUDE.md y PROGRESO.md. Haz SOLO la siguiente
  sesión sin completar. No adelantes trabajo.
- Si pido un cambio, aplícalo y anótalo en "Decisiones" de
  PROGRESO.md. Si afecta a las reglas, edita CLAUDE.md.
- Pregunta solo si algo bloquea; si no, haz un supuesto y
  anótalo como [Supuesto] en PROGRESO.md.
- Prefiere borrar a añadir. Mantén todo simple.
- Al terminar resume en 5 líneas: hecho, falta y qué debo
  verificar yo. Acaba con: "Para continuar escribe: Sigue".

## Esquema de trip.json (claves)
meta{titulo,salida_espana,vuelta_espana,viajeros,
 presupuesto_referencia,cambio_won_por_euro}
vuelos[{tipo?(ida|vuelta),tramo,fecha,aerolinea,estado,localizador?,
 equipaje?,nota?,tramos?[{vuelo,de,de_nombre,de_terminal,a,a_nombre,
 a_terminal,salida,llegada,duracion,avion,asientos{nombre:asiento}}
 |{escala}],verificar}]  (datos del billete: privados, nunca al repo)
alojamientos[{id,nombre,ciudad,fechas,noches,coste_eur,pago,
 direccion_en,direccion_ko,ko,nota,verificar,lat?,lon?}]
 (lat/lon del hotel: privados, solo en trip.json; sirven para
 "📍 a X km del hotel")
ciudades[{id,nombre,ko,desde,hasta,lat?,lon?,interes[]?}]
traslados[{id,fecha,de,a,estado,pasos[],frase_ko,
 romanizacion,tren{salida,llegada,comprado,numero?,clase?,precio?,
 coche?,asientos?{nombre:asiento},nota?},bus?{mismos campos que tren},verificar}]  (billete: privado)
dias[{fecha,dia,ciudad,titulo,items[{hora?,texto}],llegada?(hh:mm a la 1ª parada),
 levantarse?(hh:mm)}]
lugares[{id,es,ko,romanizacion,direccion_ko,direccion_en,
 verificar,nota,ciudad?}]  (sin "ciudad", se deduce del texto)
seguro{producto,poliza,vigencia,viajeros_asegurados,
 asistencia{app,telefono,nota},coberturas_clave[],airhelp_plus,
 como_reclamar[],verificar}
checklist_documentos[{id,texto,url?}]   avisos[]

## data/comer.json (público, sí va al repo)
[{id,ciudad(seul|andong|gyeongju|busan|jeonju),nombre,ko,tipo
 (restaurante|café|mercado|plato|bar),plato,direccion,horario,precio,
 fuente(itinerario|guia|lonely|propio),url,nota}]. Campos pueden
ser null. "lonely" = Lonely Planet Korea 2016 (página en nota);
"guia" lleva el enlace en url. Opcional comprobado{fecha,estado
(activo|existe|dudoso|no encontrado),nota,fuente}: revisión web
hecha por Claude (se muestra en la tarjeta; no sustituye al ✓ del
usuario). Opcional opiniones{v,n,fuente,fecha}: nota media de usuarios
(sobre 5), nº de reseñas y web de donde sale (Google vía agregadores,
Trip.com, Polle…). El usuario puede apuntar la suya (user.comer[id].op),
que manda sobre la guardada; orden "👥 Mejor valorados" ajustado por nº
de reseñas; enlaces para consultarla en Naver, Kakao y Google.
Opcional guias[{g(michelin|bluer),d,anio,verificar?}]: distintivos de
guías de prestigio (🔴 Michelin, 🎗️ Blue Ribbon); suman en el orden
"Recomendado". Solo los confirmados en fuentes; si no, VERIFICAR.
Estado (Quiero/Visitado/Descartado/Cerrado), notas y lugares
propios se guardan en el móvil (user.comer, user.comerPropios).
"Hecho/visitado" es UNA marca por sitio (user.hecho, clave = hangul
o nombre): Ciudades, Enseñar, Hoy y Comer la comparten (el Checklist
por ciudad se quitó en v65).
Campos opcionales: la app NO debe romperse si falta alguno.
Crea example.trip.json FICTICIO que cumpla este esquema.
data/coords.json: coordenadas aproximadas PÚBLICAS de sitios y
restaurantes (clave = hangul o id de comer.json) para distancias
en línea recta. Si un lugar no tiene, no se muestra distancia.
Las ciudades se comparan sin paréntesis ("Seúl (vuelta)" = Seúl).
contenido.js guarda contenido fijo y público: CATALOGO (sitios
conocidos por ciudad con hangul seguro), IMPRES (imprescindibles
por ciudad: descripción propia resumida de la Lonely y artículo de
Wikipedia para la foto; la foto se pide con conexión y el service
worker la guarda en la caché 'corea-fotos'; si la Wikipedia inglesa no tiene foto, se prueba la coreana con el hangul; si el artículo no tiene foto principal, la primera foto del artículo; si Wikipedia no da foto, Wikimedia Commons (búsqueda por hangul y luego por nombre, sin mapas ni logos); sinFoto: true = mejor sin foto que una equivocada; tocar cualquier foto cargada la abre en grande en un visor), WIKI (hangul → artículo de Wikipedia para
más fotos), ALIAS (nombres alternativos para reconocer sitios en el
itinerario), HISTORIA (historia breve por ciudad, LP marcado),
INTRO_LP (introducción de cada ciudad según la Lonely y su
propuesta de visita), PLATOS (glosario de platos con hangul de la
Lonely, en Comer),
cultura.js: GUIA_CULT (fichas "🎎 Con ojos de guía" de unos 30 lugares emblemáticos: gancho,
historia, 👀 qué mirar y 💡 consejo; clave = hangul sin espacios; sale en Ciudades, Ruta del día y buscador).
DIA_LP (lo que amplía la Lonely de cada sitio del itinerario y de los
que recomienda; sale en Hoy, "Sitios de hoy", y en Ciudades como
desplegable "📖 Más de la Lonely" en cada sitio) y DIA_INFO (frase general si la Lonely no lo trata),
FRASES_SIT (frases por
situación; FRASES es la lista plana), GUIA y PLANES (LoL, cosmética y servicios; wiki = artículo para la foto; aprox: true = ubicación
aproximada, la distancia sale con "≈").
Lo recomendado por la Lonely (lp: true o fuente lonely) lleva el distintivo
azul "LP" (★ = elección del autor) allí donde aparezca.
Todo sitio nuevo lleva descripción y coordenadas en data/coords.json
(para la distancia al hotel). Si están mal, en el mapa grande se mantiene pulsado el icono (½ s) y se arrastra a su sitio (desde v185; pide confirmación; "↩️ Ubicación original" en su ficha lo deshace), o "📍 Estoy aquí" (en la ficha de Planes y del mapa) guarda la posición GPS en user.coordsFix[hKey], que manda sobre coords.json y va al pasar marcas.

## Hoja de ruta (la vital primero: el viaje empieza el 3 nov)
S1 Estructura PWA, importar/exportar, pantalla de bienvenida
   si no hay datos. Hoy: día actual (si es antes del viaje, el
   primero), anterior/siguiente, alerta roja si algún traslado
   está "PENDIENTE DE COMPRAR". Ruta: ciudades y traslados
   paso a paso con estado (comprado/pendiente).
S2 Enseñar: tarjetas a pantalla completa con hangul enorme para
   taxistas y recepcionistas (con 🗣️ pronunciación a la española desde v107, como en Frases). Se generan desde "lugares" con
   "<lugar>(으)로 가 주세요". Regla de partícula: termina en
   vocal o en ㄹ -> 로; en otra consonante -> 으로. Si falta el
   hangul: "falta hangul: copiar de Naver Map". Más la pestaña
   Seguro: póliza, vigencia, teléfono (botón copiar), coberturas
   clave, AirHelp, cómo reclamar.
S3 Corea (nociones, etiqueta, precauciones: T-money, propinas,
   zapatos, enchufes, apps, pagos, bus/taxi, comida,
   seguridad) y Frases útiles con botón de pantalla completa.
   Aviso: la guía Lonely Planet de 2016 solo vale para cultura;
   precios y apps hay que verificarlos.
S4 Diccionario offline: unas 400-600 palabras y frases de viaje
   ES->KO con romanización y buscador sin tildes. Solo entradas
   con total seguridad; el resto con marca.
S5 Más (Maleta/Documentos desde checklist_documentos, y Notas),
   Checklist por ciudad y Gastos (₩ y €, cambio manual,
   categoría, total por ciudad, presupuesto de referencia).
S6 Pulido, prueba completa en modo avión e instalación en
   pantalla de inicio.
SX Comer (independiente): data/comer.json precacheado; desde v161 va en Planes → 🍜 Comer de cada ciudad (sin botones de ciudad propios ni glosario de platos), con filtro por tipo;
   tarjeta con hangul, precio, horario, fuente y "VERIFICAR que
   sigue abierto"; Copiar coreano, Enseñar, Naver; estado y nota
   por lugar; "Añadir lugar". Diseño compacto (v69): botones de ciudad
   como Ciudades, chips de tipo con recuento, chips de estado (con "📍 Cerca del hotel" ≤1,2 km), orden con
   un botón; tarjeta con foto o icono, nombre, hangul, distancia y una
   línea de datos; botones ⭐ ✅ 👎 🚫, Enseñar y Naver; el resto en
   "Más detalles". Desplegable "⚠️ Mucho ojo con…" (MUCHO_OJO en contenido.js: famosos con quejas documentadas en prensa o notas bajas, siempre con fuentes; tipo "planes" sale arriba de cada ciudad en Planes y el resto en Comer; consejo: true = aviso práctico, no un sitio; aviso también en la tarjeta de Comer y en la ficha de Planes si coincide el id o el hangul). (El botón "Comer en <ciudad>" de Hoy
   se quitó: Comer ya filtra por la ciudad del día.)

## Pruebas mínimas por sesión
Abrir con wifi, cerrar, activar modo avión y reabrir: todo
funciona. Lo guardado persiste al cerrar y reabrir. Sin
trip.json cargado, bienvenida con botón de importar.
