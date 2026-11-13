# Guía de la app (y cómo hacer otra para otro país)

Esta guía vive en el repositorio (GUIA-APP.md) y se lee también dentro de la app, en Más → 🛠️ Guía de la app, sin conexión y sin haber importado ningún viaje.

Sirve para dos cosas:

1. Entender qué hace cada parte de la app.
2. Hacer otra igual para otro país (Japón, Vietnam, Perú…) reutilizando lo genérico y cambiando solo los datos.

## 1. Qué es

Una web instalable (PWA) para el móvil que funciona 100 % sin conexión. No tiene servidor, cuentas ni librerías externas: es HTML, CSS y JavaScript puro, publicado gratis en GitHub Pages.

Una comparación útil: la app es una **libreta de viaje con dos tipos de hojas**.

- **Hojas impresas (públicas):** la guía del país, los sitios, los restaurantes, el idioma y la historia. Van en el repositorio, que es público.
- **Hojas escritas a mano (privadas):** tus vuelos, hoteles, reservas, póliza y lo que marcas (visitado, notas, estrellas). Solo viven en tu móvil. Entran con «Importar viaje» (un archivo trip.json) y nunca se suben al repositorio.

## 2. Uso rápido, pestaña a pestaña

- **Hoy:** el día del viaje. Incluye el tiempo por horas, el traslado, el hotel, la «Ruta del día» (paradas numeradas, tramos a pie, en metro o en taxi, mapa y Naver), el diario y el botón 🆘 Ayuda.
- **Ruta:** vuelos, mapa del país y línea de tiempo con estancias y traslados.
- **Planes:** cada ciudad con sus botones:
  - Puntos de interés;
  - Comer;
  - Platos típicos;
  - Hotel;
  - Curioso, Lavandería, PC y Ropa.

  Cada sitio tiene una ficha con foto, horario, distancia al hotel, casilla de visitado (✓, ✗ o nada), estrellas y 📅 para apuntarlo a un día.
- **Mapas:** el mapa de cada ciudad con capas (itinerario, sitios, comer, hotel). Las calles solo se ven con conexión o si se descargaron antes. Un icono mal colocado se arrastra manteniéndolo pulsado.
- **Historia:** línea del tiempo, capítulos, ciudades y símbolos.
- **Corea (la guía del país):** moverse, dinero, comida, costumbres, salud y país.
- **Idioma:** favoritas, alfabeto, frases, diccionario y tarjetas «Enseñar» a pantalla completa (para el taxista), con 🔊.
- **Más:**
  - Maleta, Seguro, Verificar, Documentos (fotos y PDF guardados solo en el móvil), Notas, Regalos, Resumen del viaje (Word y PDF) y Escala;
  - Datos y app: importar, exportar, pasar marcas al otro móvil, preparar para viajar y actualizar;
  - 🔒 Bloquear marcas, para que un toque sin querer no marque ni desmarque nada (se desbloquea con el 🔒 de arriba);
  - esta guía.
- **Arriba:** 🔍 busca en toda la app y 💱 abre el conversor de moneda.

Antes de salir, con wifi: Más → Datos y app → «Preparar para viajar». Descarga las fotos, los mapas, el tiempo y el cambio de moneda para tenerlos offline.

## 3. Cómo está hecha

### Archivos

| Archivo | Qué guarda | ¿Del país o genérico? |
|---|---|---|
| index.html | Esqueleto, barra de pestañas y orden de carga de los scripts | Genérico |
| styles.css | Estilo (papel hanji, franja dancheong, un color por pestaña, claro y oscuro) | Genérico; cambiar los motivos decorativos |
| app.js | Toda la lógica: pestañas, Hoy, rutas, mapas, buscador, importar y exportar, marcas | Genérico en un 90 %; tiene textos y listas de Corea (ver el apartado 4) |
| sw.js | Service worker: caché offline de los archivos, fotos y teselas | Genérico |
| manifest.json e icons/ | Instalación en la pantalla de inicio | Cambiar el nombre y el icono |
| contenido.js | Sitios por ciudad (CATALOGO, LP, IMPRES), horarios, frases, guía, Miscelánea (PLANES), «Mucho ojo con…», platos y snacks | Del país |
| ciudades.js | Lectura larga de cada ciudad (historia, costumbres, famosos, sabores…) | Del país |
| cultura.js | Fichas «Con ojos de guía» de los lugares emblemáticos | Del país |
| historia.js | Capítulos y línea del tiempo | Del país |
| sociedad.js | País: política, educación, sueldos, población | Del país |
| hangul.js | Lecciones del alfabeto y carteles | Del país (o se quita si el alfabeto es latino) |
| diccionario.js | Diccionario ES → idioma local | Del país |
| exportar.js | Resumen del viaje en Word y PDF, sin librerías | Genérico |
| data/comer.json | Restaurantes, cafés, mercados y bares | Del país |
| data/coords.json | Coordenadas aproximadas de los sitios públicos | Del país |
| data/metro.json | Estaciones y líneas de metro para calcular trayectos | Del país |
| example.trip.json | Viaje de ejemplo ficticio con el esquema completo | Del país (ficticio) |
| CLAUDE.md | Reglas fijas del proyecto para Claude | Adaptar |
| PROGRESO.md | Diario de versiones, decisiones y supuestos | Empezar en blanco |

### Datos y memoria

- **trip.json (privado):** se importa desde Más y se guarda en localStorage (corea.trip). Su esquema está en CLAUDE.md.
- **Lo que marcas:** se guarda en corea.user (visitados, ✗, estrellas, agenda por día, notas, diario, coordenadas corregidas…). «Pasar mis marcas» lo une con el otro móvil sin borrar nada.
- **Fotos y PDF de documentos:** se guardan en IndexedDB, solo en el móvil.
- **Datos que llegan de fuera, solo con conexión** y guardados para usarlos offline:
  - fotos de Wikipedia y Wikimedia;
  - tiempo de Open-Meteo, sin clave;
  - cambio de moneda del BCE (frankfurter);
  - calles de OpenStreetMap.

### Versiones

En cada cambio se suben a la vez tres marcas, que deben ser iguales:

- CACHE en sw.js;
- VERSION en app.js;
- --css-ver al final de styles.css.

Si el móvil mezcla un CSS viejo con un JS nuevo, la app lo detecta y recarga la hoja de estilos.

### Reglas que conviene conservar

1. El repositorio es público: nada de datos personales, reservas ni pólizas. Los ejemplos, siempre ficticios.
2. Un dato dudoso lleva la marca VERIFICAR. No se inventan nombres en el idioma local, teléfonos, horarios ni precios.
3. Todas las rutas son relativas (la app vive en /nombre-repo/).
4. Cada icono tiene un solo significado en toda la app.
5. Mejor borrar que añadir: lo que no se usa se quita. Más → «Qué tocáis y qué no» cuenta qué se toca.

## 4. Hacer otra app para otro país

La idea: **copiar el mueble y cambiar los cajones.** El mueble (app.js, sw.js, styles.css, exportar.js e index.html) se queda. Los cajones (los archivos de datos) se vacían y se llenan con el país nuevo.

### Paso a paso

1. **Crear el repositorio.** En GitHub, copia de este repositorio con otro nombre (por ejemplo viaje-japon): marcarlo como plantilla (Settings → Template repository) y usar «Use this template», o subir los archivos a uno nuevo. Activar GitHub Pages (Settings → Pages → rama main, carpeta raíz).
2. **Cambiar el nombre.** Tocar:
   - manifest.json (name, short_name);
   - el título en index.html;
   - el prefijo de las claves de localStorage (corea.) y de las cachés (corea-v…, corea-fotos, corea-mapa) en app.js y sw.js, para que dos apps en el mismo móvil no se pisen.
3. **Vaciar los datos del país** y rellenarlos con el mismo formato:
   - contenido.js;
   - ciudades.js;
   - cultura.js;
   - historia.js;
   - sociedad.js;
   - diccionario.js;
   - data/comer.json;
   - data/coords.json;
   - data/metro.json.
4. **Lo coreano que hay dentro de app.js.** Buscarlo y adaptarlo:
   - la partícula de las tarjetas «Enseñar» ((으)로 가 주세요);
   - la voz ko-KR de 🔊;
   - Naver y Kakao (en otro país: Google Maps, o la app local que se use);
   - PC_BUSQ y NAVER_TOP;
   - los teléfonos de emergencia (112, 119, 1330) y la embajada;
   - la moneda (₩ / KRW en el conversor);
   - la hora de casa (Canarias) y la del país;
   - la Escala (Pekín).
5. **Alfabeto.** Si el idioma usa letras latinas, quitar la pestaña de alfabeto (hangul.js) y la romanización. Si no (japonés, tailandés, griego…), adaptar las lecciones.
6. **Mapa de la Ruta.** El contorno del país en el SVG propio (en app.js, junto a COORDS) y las coordenadas de reserva de cada ciudad.
7. **Viaje de ejemplo.** Hacer un example.trip.json ficticio del país nuevo que cumpla el esquema.
8. **Probar.** Abrir con wifi, cerrar, poner el modo avión y reabrir: todo debe funcionar. Sin viaje importado debe salir la bienvenida.

### De dónde sacar los datos

- **Una guía de viaje en papel o PDF** (por ejemplo, la Lonely Planet). Sirve para los imprescindibles, las descripciones resumidas con palabras propias y los restaurantes, siempre con su página. Precios y horarios: VERIFICAR.
- **Wikipedia:** el artículo de cada sitio para la foto (WIKI e IMPRES) y las coordenadas.
- **Fuentes oficiales:** la oficina de turismo del país, el Ministerio de Asuntos Exteriores (embajada y recomendaciones) y la web del metro.
- **Tu propio itinerario:** va en trip.json, nunca en el repositorio.

### Encargo para Claude (para copiar y pegar)

> Quiero una PWA de viaje como la de mi repositorio viaje-corea, pero para [PAÍS], del [FECHA] al [FECHA], con estas ciudades: [CIUDADES]. Lee GUIA-APP.md y CLAUDE.md de viaje-corea. Conserva app.js, sw.js, styles.css, exportar.js e index.html, y cambia solo los datos del país siguiendo el apartado 4 de la guía. Haz el CLAUDE.md nuevo a partir del de Corea, quitando lo que no aplique. Repositorio público: nada de datos personales; dato dudoso = VERIFICAR; no inventes nombres en el idioma local, teléfonos, horarios ni precios. Empieza por S1 (estructura, importar/exportar, bienvenida, Hoy y Ruta) y ve sesión a sesión.

### Lo aprendido (para no repetirlo)

- **Las coordenadas aproximadas fallan.** Por eso existen «📍 Estoy aquí», arrastrar el icono en el mapa y «📌 Estoy en el hotel». Prevé corregir desde el principio.
- **Algunas webs locales no se pueden leer desde Claude** (en Corea, Naver). Mejor botones que abran la búsqueda en la app local que inventar notas o direcciones.
- **Los sitios se reconocen en el itinerario por palabras.** Las palabras genéricas («isla», «museo», «playa») dan falsos positivos. Usa «buscar» o ALIAS en los sitios con nombres comunes.
- **Agrupa por zonas.** Las sugerencias cercanas van junto a la parada más próxima, para no ir y volver.
- **El móvil puede quedarse con archivos viejos en caché.** Sube siempre las tres marcas de versión.
- **Antes del viaje, «Preparar para viajar» con wifi.** Sin eso, ni fotos ni calles offline.
