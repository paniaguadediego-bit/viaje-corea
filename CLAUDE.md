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
   la raíz): start_url y scope "./", service worker con ruta
   relativa, iconos relativos.
5. Pestañas (barra inferior): Hoy, Ruta, Ciudades, Enseñar,
   Comer, ₩/€ (conversor), Más. Dentro de Más (botones arriba):
   Corea, Seguro, Checklist, Verificar; y debajo Maleta/
   Documentos, Fotos y Notas. Gastos: quitado (el usuario usa
   otra app). No añadir
   nada que no esté aquí. Ruta incluye un mapa esquemático de
   Corea (SVG propio, offline) con ciudades, traslados y sitios
   (las fichas de ciudad con sitios van en Ciudades). Extras
   aprobados: conversor ₩↔€ con cambio automático del BCE vía
   api.frankfurter (solo con conexión; se guarda para offline; se
   puede fijar a mano), destacados de la ciudad en Hoy, lista
   Verificar (marca "✓ verificado" en el móvil), botón "Naver" (abre Naver Map, requiere conexión),
   resumen "Mañana" y hora Corea/Canarias en Hoy, fotos de
   documentos en Más (IndexedDB, solo en el móvil). Gastos
   compartidos: descartado por el usuario.
6. Dato dudoso = "VERIFICAR". No inventar hangul, teléfonos,
   horarios ni precios. Si un objeto del JSON trae
   "verificar": true, mostrar una marca visible.
7. Mobile-first, compacto pero legible, una mano, tema claro/oscuro.
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
vuelos[{tramo,fecha,aerolinea,estado,verificar}]
alojamientos[{id,nombre,ciudad,fechas,noches,coste_eur,pago,
 direccion_en,direccion_ko,ko,nota,verificar,lat?,lon?}]
 (lat/lon del hotel: privados, solo en trip.json; sirven para
 "📍 a X km del hotel")
ciudades[{id,nombre,ko,desde,hasta,lat?,lon?,interes[]?}]
traslados[{id,fecha,de,a,estado,pasos[],frase_ko,
 romanizacion,tren{salida,llegada,comprado},verificar}]
dias[{fecha,dia,ciudad,titulo,items[{hora?,texto}]}]
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
"guia" lleva el enlace en url.
Estado (Quiero/Visitado/Descartado/Cerrado), notas y lugares
propios se guardan en el móvil (user.comer, user.comerPropios).
Campos opcionales: la app NO debe romperse si falta alguno.
Crea example.trip.json FICTICIO que cumpla este esquema.
data/coords.json: coordenadas aproximadas PÚBLICAS de sitios y
restaurantes (clave = hangul o id de comer.json) para distancias
en línea recta. Si un lugar no tiene, no se muestra distancia.
Las ciudades se comparan sin paréntesis ("Seúl (vuelta)" = Seúl).
contenido.js guarda contenido fijo y público: CATALOGO (sitios
conocidos por ciudad con hangul seguro), FRASES y GUIA.

## Hoja de ruta (la vital primero: el viaje empieza el 3 nov)
S1 Estructura PWA, importar/exportar, pantalla de bienvenida
   si no hay datos. Hoy: día actual (si es antes del viaje, el
   primero), anterior/siguiente, alerta roja si algún traslado
   está "PENDIENTE DE COMPRAR". Ruta: ciudades y traslados
   paso a paso con estado (comprado/pendiente).
S2 Enseñar: tarjetas a pantalla completa con hangul enorme para
   taxistas y recepcionistas. Se generan desde "lugares" con
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
   por lugar; "Añadir lugar"; acceso "Comer en <ciudad>" en Hoy.

## Pruebas mínimas por sesión
Abrir con wifi, cerrar, activar modo avión y reabrir: todo
funciona. Lo guardado persiste al cerrar y reabrir. Sin
trip.json cargado, bienvenida con botón de importar.
