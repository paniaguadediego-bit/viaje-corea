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
5. Pestañas (barra inferior, 7 desde v103): Hoy, Ruta, Explorar (antes Ciudades; por ciudad, botones
   📍 Puntos de interés / 🗺️ Mapa / ⭐ Planes), Historia, Corea, Comer y Más. Historia (pestaña propia): portada,
   ⏳ Línea del tiempo (HIST_EVENTOS en historia.js, unas 35 fechas que abren su capítulo), 📚 Capítulos (cada uno con
   época y años, "En 30 segundos", fechas clave y "📍 Dónde lo veréis" con enlace a Explorar; HIST_META), 🏯 Vuestras
   ciudades (HISTORIA de cada ciudad) y 🇰🇷 Símbolos. Planes va dentro de Explorar (calendario del Mundial de LoL plegado: WORLDS en contenido.js, hora de
   Corea y dónde estaréis; botones en orden alfabético Cosmética / Curioso (cafés de animales, postres famosos, tiendas raras) / Lavandería / LoL / Ropa (solo cerca del hotel) que muestran sus sitios debajo: PLANES en contenido.js,
   con distancia al hotel, "cerca", foto, 💰 precio aproximado y 👥 reseñas; lavandería y Olive Young en cada ciudad). Corea tiene apartados:
   Guía (primero, con iconos por tema), Enseñar, Frases y Diccionario
   (la Historia, historia.js: 22 capítulos con marca de leído en user.leidos y diseño hanji/dancheong, pasó a su pestaña en v103). Más es una rejilla de iconos
   como la Guía (se toca y sale debajo): Maleta, Seguro,
   Verificar, Documentos (fotos/PDF), Notas, Escala Pekín (hora de Pekín, vuestras escalas desde trip.vuelos,
   tránsito, equipaje, internet, baterías, dinero y frases en chino a pantalla completa) y Datos y app (importar,
   exportar, "Preparar para viajar" (con wifi: app offline, fotos, mapas, tiempo,
   cambio y aviso de copia), actualizar, borrar). En Hoy, botón rojo "🆘 Ayuda"
   a pantalla completa: hotel de esta noche en hangul grande, 112/119/1330,
   seguro y Embajada de España (urgencia consular VERIFICAR). El conversor ₩/€
   es el botón 💱 junto al título y se abre en una ventana. Gastos: quitado (el usuario usa
   otra app). No añadir
   nada que no esté aquí. Ruta: vuelos, mapa y línea de tiempo con cada estancia (ciudad,
   noches, hotel y una línea por día) intercalada con los traslados. Incluye un mapa esquemático de
   Corea (SVG propio, offline) con ciudades, traslados y sitios
   (las fichas de ciudad con sitios van en Explorar: buscador arriba (todas las ciudades, sin tildes y en hangul;
   también en Comer), 5 botones, se despliega la ciudad elegida con sus botones; cada sitio tiene
   "📅" para apuntarlo a un día de esa ciudad). Agenda en user.agenda[fecha]
   = {add, del}: Hoy → Sitios es la "Ruta del día": hotel → sitios del
   itinerario en orden fijo (orden del texto) → "Añadidos desde Ciudades"
   al final (se quitan con ✕), ordenados por el camino más corto desde el
   último sitio y con aviso "💡 Os pilla de paso entre A y B (desvío)"
   si encajan mejor dentro del itinerario. Entre cada dos puntos, en su propia franja ("⬇️ Hasta <sitio>"), distancia, tiempo
   aproximado (a pie ≤1,6 km; si no, líneas de metro concretas con data/metro.json:
   Seúl © OpenStreetMap ODbL, Busan L1/L2 a mano con VERIFICAR; o taxi) y "🧭 Ruta" que abre
   la app de Naver Map (nmap://route, sin origen: sale desde la ubicación del móvil; si gana el taxi, el metro va plegado como alternativa; misma decisión en el horario). Botón "🧭 Todo el día en Naver" (ruta en coche con hasta 5 paradas intermedias por enlace; si hay más, tramos). Encima, banner "🕘 Horario del día"
   (ritmo tranquilo: 8:00 levantarse, 9:15 salida, comida ~13:30, cena ~19:30, acaba hacia las 21:00: acorta visitas y lo que no cabe va a "⏭️ Si os da tiempo"; casilla de visitado en cada parada; "🚪 Llegar a la 1ª parada a las" (user.hdIni) y "⏰ Levantarse a las" (user.hdLev) por día; salida hacia atrás y desayuno fuera si sobra tiempo; horas fijas y aperturas respetadas;
   HORARIOS en contenido.js con cierre semanal y VERIFICAR; "🕒" en cada sitio). En Explorar, botón "☐ Visitado". Banner con vista previa del mapa encima de la Ruta del día (hotel y sitios numerados unidos por línea; al tocarlo, mapa grande con filtros "Cerca de la ruta": más sitios, Comer y Planes a ≤1,2 km, apagados por defecto) y botón "🗺️ Mapa" en cada
   ciudad de Ciudades (capas itinerario, más sitios, Comer, Planes y hotel; tocar = ficha con
   Naver). Mapa propio sin librerías: puntos offline; calles de OpenStreetMap solo con conexión
   (el service worker guarda las teselas vistas en 'corea-mapa'; "Preparar para viajar" baja
   ~1.000 teselas de zoom 12-16 alrededor de los sitios del viaje; nunca zoom 17+ ni ciudades enteras).
   Debajo, "💡 Cerca y no lo tenéis":
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
   abre en 1,5 s, la web móvil m.map.naver.com; igual con Kakao Map; requiere conexión),
   Hoy con tira deslizable de días, tarjeta del día con banner (foto del
   primer sitio, fecha, título y tiempo), etiquetas con los sitios del día
   y nombres propios en negrita, y botones Sitios / Hotel / Ciudad / Diario bajo la tarjeta del día (Mañana quitado en v88;
   el traslado va dentro de Sitios, al principio, desde v89) (hotel por fechas, no por ciudad),
   "🧳 Antes de salir" (plegable) al principio de Sitios los días que se deja hotel (vuelo, tren, pagar hotel, pasaportes…; casillas por fecha),
   "📔 Diario" (carita y nota por día en user.diario; resumen en Más → Notas;
   en viaje, días pasados atenuados, avisos solo en días con traslado y sin avisos de compras pasadas), tarjeta "Ahora" (lo próximo con hora o cuenta
   atrás) y hora Corea/Canarias en Hoy, frases por situación en Corea, fotos y PDF de
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
 coche?,asientos?{nombre:asiento},nota?},verificar}]  (billete: privado)
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
worker la guarda en la caché 'corea-fotos'), WIKI (hangul → artículo de Wikipedia para
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
(para la distancia al hotel).

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
SX Comer (independiente): data/comer.json precacheado; pestaña
   Comer con filtro por ciudad (por defecto la del día) y tipo;
   tarjeta con hangul, precio, horario, fuente y "VERIFICAR que
   sigue abierto"; Copiar coreano, Enseñar, Naver; estado y nota
   por lugar; "Añadir lugar". Diseño compacto (v69): botones de ciudad
   como Ciudades, chips de tipo con recuento, chips de estado (con "📍 Cerca del hotel" ≤1,2 km), orden con
   un botón; tarjeta con foto o icono, nombre, hangul, distancia y una
   línea de datos; botones ⭐ ✅ 👎 🚫, Enseñar y Naver; el resto en
   "Más detalles". (El botón "Comer en <ciudad>" de Hoy
   se quitó: Comer ya filtra por la ciudad del día.)

## Pruebas mínimas por sesión
Abrir con wifi, cerrar, activar modo avión y reabrir: todo
funciona. Lo guardado persiste al cerrar y reabrir. Sin
trip.json cargado, bienvenida con botón de importar.
