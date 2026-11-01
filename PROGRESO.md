# Progreso
- [x] S1  - [x] S2  - [x] S3  - [x] S4  - [x] S5  - [x] S6  - [x] SX Comer

Caché del service worker: corea-v33

## Pendiente (para después)
- (Hecho en v20) Distancia al hotel.

## Decisiones
- S1: datos guardados en localStorage (más simple que IndexedDB; el viaje cabe de sobra).
- S1: el commit se hace directamente en main (sin PR), por petición del usuario.

- Cambio pedido: interfaz más compacta (texto 17px, tarjetas y botones más pequeños).
- Cambio pedido: mapa esquemático de Corea en Ruta con ciudades, traslados (azul comprado, rojo discontinuo pendiente) y sitios de interés por ciudad. Nuevos campos opcionales en ciudades: lat, lon, interes[].
- Cambio pedido: que Claude haga lo que pueda de "Qué debes hacer tú". Añadido contenido.js con un catálogo PÚBLICO de sitios conocidos por ciudad (con hangul seguro): alimenta los sitios de interés en Ruta (si la ciudad no trae "interes") y la sección "Sitios conocidos" en Enseñar.
- Los datos privados (hoteles, póliza, teléfono del seguro) NO se pueden hacer desde aquí: no están en el repo y no deben estarlo.
- S4: diccionario (587 entradas ES→KO en diccionario.js) dentro de la pestaña Corea, con subpestañas Frases / Diccionario / Guía (no se añaden pestañas nuevas).
- Lonely Planet 2016: el usuario la adjuntó como texto. Se añadieron a contenido.js (LP) unas 10-14 recomendaciones por ciudad con el nombre y hangul de la guía y resúmenes propios (no se copia texto). Salen en Ruta (desplegable "Lonely Planet 2016 recomienda"), en Enseñar (marca LP, ★ = elección del autor) y en Checklist. Restaurantes con VERIFICAR (la guía es de 2016). La guía NO se sube al repo.
- S5: Gastos (₩/€, cambio manual editable, categoría, totales por ciudad y categoría, barra de presupuesto), Checklist por ciudad (sitios + LP + propios) y Más (Maleta/Documentos desde checklist_documentos + propios, Notas con autoguardado).
- S6: actualización automática (al llegar una versión nueva la app se recarga sola una vez); el navegador marca los datos como persistentes para que no se borren; pantalla siempre encendida mientras se enseña una tarjeta; "Última copia" y versión visibles en Más; manifest con id e iconos any/maskable separados; importar rechaza archivos que no son un viaje.
- S6: prueba automática completa en modo avión (8 pestañas, gasto guardado, diccionario) y con datos vacíos o mal formados: sin errores.

- Cambio pedido: aún más compacta (texto 16px, tarjetas, títulos y barra inferior más pequeños).

- Cambio pedido (mejoras tipo TripIt/Wanderlog): conversor rápido ₩↔€ en Gastos; botón "🗺️ Naver" en hoteles (Hoy) y lugares (Enseñar); tarjeta "Mañana" en Hoy (cambio de ciudad, traslados con hora y estado, plan con horas); hora de Corea y España arriba en Hoy.

- Cambio pedido: fotos de documentos en Más (se reducen a 1600 px JPEG y se guardan en IndexedDB; se ven sin conexión; entran en "Exportar copia").

- Cambio pedido: quitar los gastos compartidos (el usuario no los quiere).

- Cambio pedido: Gastos mejor alineado (conversor con el cambio dentro, casillas de igual altura, bloque "Nuevo gasto") y botón atrás: "‹" en la cabecera y el gesto/botón atrás de Android vuelven a la pestaña anterior y cierran las tarjetas a pantalla completa.

- Arreglo: el service worker descargaba a veces archivos viejos de la memoria del navegador al actualizarse (GitHub Pages los guarda 10 min). Ahora fuerza descarga nueva y busca actualizaciones al volver a la app.

- Arreglo: el móvil del usuario se quedó con una versión vieja (conversor desbordado → Chrome empuja la barra inferior fuera de pantalla). El service worker pasa a "primero red, si no caché" (timeout 3 s) para que las versiones nuevas lleguen siempre con conexión; sigue funcionando sin conexión. Botón "Forzar actualización" en Más (borra caché, no datos).

- Cambio pedido: número de versión arriba a la derecha (VERSION en app.js, igual que CACHE en sw.js). Hora de Canarias (Atlantic/Canary) con su bandera dibujada en SVG en lugar de la de España.

- Cambio pedido: restaurantes y cafés. Reddit bloquea el acceso automático; se recopilaron 25 sitios de guías web (Michelin, Frommer's, turismo de Busan, blogs) en contenido.js (COMIDA). Salen en Ruta ("🍜 Dónde comer y cafés"), Enseñar (marca 🍜, tarjeta para taxi y botón Naver) y Checklist. Todos con VERIFICAR.

- SX Comer: data/comer.json (30 lugares públicos dados por el usuario, contenido exacto) precacheado; pestaña Comer con chips de ciudad y tipo, tarjetas con "VERIFICAR que sigue abierto", Copiar coreano, Enseñar (pantalla completa) y Naver; estado Quiero/Visitado/Descartado/Cerrado y nota por lugar; "Añadir lugar" (fuente propio). Todo en user → entra en "Exportar copia". Acceso "🍜 Comer en <ciudad>" en cada día de Hoy.
- SX Comer: se quita la lista "Dónde comer" que estaba en contenido.js (COMIDA) para no duplicar; Comer es ahora el único sitio de restaurantes (los de la Lonely siguen en Ruta).

- Cambio pedido: Comer con todo lo recopilado. data/comer.json pasa a 116 lugares: los 30 del usuario (sin tocar), 19 de guías web con su enlace (la lista anterior) y 67 de la Lonely Planet 2016 (nombre y hangul de la guía, página en la nota, ★ si es elección del autor, precio por símbolos y horario "LP 2016"). Nuevo tipo "bar" y fuente "lonely". Los restaurantes de la Lonely salen ya solo en Comer (quitados de Ruta/Enseñar).
- Cambio pedido: sitios de la Lonely que faltaban añadidos a Ruta/Enseñar/Checklist (25 en Seúl, 4 en Gyeongju, 5 en Busan, 2 en Jeonju).

- Notas del usuario (WhatsApp): Ruta separada de Ciudades (nueva pestaña Ciudades; el mapa lleva a la ficha); "Destacados en <ciudad>" en Hoy (★ Lonely y sitios conocidos + Comer: Quiero, itinerario y ★); Enseñar → "Mis lugares" agrupados por ciudad; Gastos quitado; conversor ₩/€ como pestaña propia con cambio automático (BCE, se guarda para offline, opción manual) y precios KRW de Comer con "≈ €"; lista Verificar en Más (con Naver y "✓", también en cada tarjeta de Comer).
- Arreglo: las tarjetas a pantalla completa reducen la letra para que los nombres coreanos largos no se corten.

- Distancia al hotel: "📍 X km del hotel" en Comer, Enseñar y Ciudades (Lonely). Hoteles con lat/lon en el trip.json del usuario (privado, devuelto por el chat, no en el repo); lugares en data/coords.json (~200 públicos, aprox. ±300 m). 21 restaurantes sin ubicación conocida: sin distancia.
- Arreglos con el viaje real: "Seúl (vuelta)" se trata como Seúl (catálogo, mapa, comer); los traslados se sitúan en el mapa por la ciudad entre paréntesis (los pendientes salen en rojo); "Mis lugares" sin campo ciudad se agrupan por texto o por cercanía al hotel; si "dia" es el día de la semana, se muestra "Día 15 de 17 · Mar".

- Cambio pedido (v21): en Comer, "Quiero ir" muy visible (cinta dorada, borde azul y fondo degradado; Visitado en verde); filtro por estado (Todos / ⭐ Quiero / ✅ Visitados / Sin marcar, con contadores); ordenar por Recomendado, Distancia al hotel o Mi valoración (estrellas 1-5 propias, guardadas en el móvil). Aspecto más cuidado: fondo y cabecera con degradados muy claros azul/rojo coreanos, tarjetas blancas con sombra suave, botones con degradado, barra inferior translúcida; modo oscuro equivalente.

- Cambio pedido (v22): tarjeta "⏱️ Ahora" en Hoy (antes del viaje, cuenta atrás; durante, lo próximo con hora de hoy —items y trenes— con "en X min"; si no queda nada, lo primero de mañana; aviso de maleta la víspera de cambiar de ciudad). Frases por situación (Básicas, Taxi, Hotel, Restaurante, Compras, Transporte, Farmacia, Emergencia; 67 frases). Revisión web de 13 lugares de Comer guardada en "comprobado" (Ryusenso no está en Gyeongju; Sugyeongsa corregido; Bagel Bageler en Gyochon; Wolseon no encontrado; Mammoth activo con colas; Hongsi 4,3/5).

- Cambio pedido (v23): "hecho/visitado" unificado. Tachar en Checklist marca el sitio en toda la app: tachado con ✓ en Ciudades (botón redondo para marcar desde ahí), ✅ y atenuado en Enseñar, tachado en los destacados de Hoy y "Visitado" en Comer; y al revés. Checklist por ciudad ahora lista sitios (catálogo + Lonely), "Para comer" (Quiero, Visitado e itinerario) y "Mis cosas"; contador hechos/total.

- Cambio pedido (v24): "Imprescindibles" en cada ciudad (18 sitios clave) con descripción breve en español (resumida de la Lonely 2016 cuando la trae, marca LP) y foto representativa de Wikipedia. Las fotos no se pudieron meter en el repo (el entorno no tiene acceso a Wikimedia): la app las pide con conexión al artículo de Wikipedia, las guarda en una caché propia y se ven luego sin conexión; botón en Más para descargarlas todas. Crédito "Foto: Wikipedia" con enlace.

- Cambio pedido (v25): el conversor ya no abre el teclado al entrar (solo al tocar la casilla). Contenido centrado (columna central, títulos, filtros, conversor, Ahora). Personalidad: cada ciudad con su color, icono, lema y hangul grande de fondo (Seúl 🏙️ azul/rojo, Andong 🎭 madera, Gyeongju 👑 oro Silla, Busan 🌊 mar, Jeonju 🍚 verde hanok); el día de Hoy lleva el color de su ciudad; los sitios llevan icono por tipo (🏯 palacio, 🛕 templo, 🏛️ museo, 🏘️ aldea, 🌳 naturaleza…); en Comer cada tipo tiene color e icono (🍲 restaurante naranja, ☕ café marrón, 🧺 mercado verde, 🥢 plato rojo, 🍶 bar morado).

- Cambio pedido (v26): en Comer, ciudad y tipo pasan a dos desplegables en una fila (con icono; la ciudad del día marcada y con "(hoy)"). Antes del viaje se marca la primera ciudad (Seúl).

- Cambio pedido (v27): marca "📅 Día N · fecha" en todo lo que aparece en nuestro itinerario (Ciudades, Imprescindibles, Lonely, Enseñar, Checklist y Comer), y orden según el día del plan (lo planeado primero). Detección: palabras completas del nombre en los textos de los días de la MISMA ciudad (sin palabras genéricas), alias para algunos sitios, y para Comer del itinerario la fecha de su nota. Más fotos: miniaturas en las listas de Ciudades (Lonely y sitios), banda en tarjetas de Comer conocidas (mercados…) y tira de 3 fotos en los Destacados de Hoy; el botón de Más descarga todas (unas 75).

- Cambio pedido (v28): Ciudades como 5 botones (con color e icono de cada una); al tocar uno se despliega debajo su ficha (por defecto la ciudad del día; "Seúl (vuelta)" se junta con Seúl y muestra las dos fechas). Botón "📜 Historia" junto al icono con un resumen de la historia de la ciudad (lo que trae la Lonely va marcado LP; el resto son datos generales). El mapa de Ruta abre la ciudad tocada.

- Cambio pedido (v29): Checklist pasa a la barra inferior (8 pestañas; probado que caben sin cortarse desde 360 px de ancho). En Más quedan Corea, Seguro y Verificar.

- Cambio pedido (v30): en Ciudades se quita "Comer aquí". La sección de la Lonely pasa a bloque propio: cabecera azul con logo "LP", nº de sitios y de ★; cada recomendación es una tarjeta con foto (o icono), tipo, "★ Elección del autor" destacada en dorado, descripción, hangul, distancia, día del plan y ✓ hecho. Se abre desplegada y se puede plegar; muestra 8 (primero lo del plan y las ★) y un botón "Ver los N restantes".

- Cambio pedido (v31): Enseñar pasa a ser el primer apartado de Corea (Enseñar · Frases · Diccionario · Guía) y Corea ocupa su sitio en la barra inferior. En Más quedan Seguro y Verificar.

- Cambio pedido (v32): en Corea → Enseñar, las ciudades son los mismos 5 botones que en Ciudades; debajo, "Mis lugares" y "Sitios conocidos" de la ciudad elegida (lugares sin ciudad en "Otros lugares"). La ciudad elegida se comparte entre Ciudades y Enseñar.

- Cambio pedido (v33): Ruta rehecha. Vuelo de ida arriba del todo y vuelo de vuelta al final, con horarios (campos salida_*/llegada_* del viaje), ruta MAD ✈ PEK ✈ ICN y aviso VERIFICAR si faltan nº de vuelo o terminal. Traslados como línea de tiempo: fecha en recuadro, icono del medio (🚆 tren, 🚌 bus, 🚕 taxi, ✈️ aeropuerto), horas del tren grandes, estado y "Paso a paso" plegable (abierto si está pendiente). Negrita automática de lo importante (horas, KTX, bus/metro + número, estaciones y terminales, precios en ₩ y palabras en MAYÚSCULAS en rojo) en los pasos y en el plan de cada día de Hoy.

## Supuestos
- [Supuesto] Botón "Probar con datos de ejemplo" en la bienvenida, para probar la app sin el trip.json real.
- [Supuesto] Tema (Auto/Claro/Oscuro) e Importar/Exportar/Borrar viven en la pestaña Más.
- [Supuesto] "Importar viaje" acepta también una copia exportada por la app (restaura viaje + gastos/checklist/notas).
- [Supuesto] Un traslado es "pendiente" si su estado contiene "pendiente"; "comprado" si contiene "comprad" o tren.comprado = true.
- [Supuesto] En Hoy se muestra el alojamiento cuya "ciudad" coincide con la ciudad del día.
- [Supuesto] Pestañas de sesiones futuras muestran "Llega en la sesión Sx".

- [Supuesto] El mapa es un SVG dibujado a mano (contorno aproximado, sin Jeju), sin tiles ni internet. Si una ciudad no trae lat/lon se usan coordenadas aproximadas de Seúl, Incheon, Andong, Gyeongju, Busan y Jeonju.
- [Supuesto] Enseñar usa solo "lugares" (como dice la hoja de ruta). Si quieres tarjetas de los hoteles, añádelos a "lugares" con su hangul.
- [Supuesto] Si el hangul no termina en sílaba coreana (p. ej. un número), se muestra "(으)로" con aviso VERIFICAR.
- [Supuesto] Corea: frases primero (lo más usado), luego la guía en apartados plegables.
- [Supuesto] "Estación de Gyeongju" = 경주역 (antes 신경주역), marcado VERIFICAR.
- [Supuesto] El usuario pidió "lo siguiente": se hicieron S4 y S5 en la misma sesión.
- [Supuesto] Los gastos se guardan en su moneda y se pasan a € con el cambio actual.
- [Supuesto] Museo de Máscaras de Hahoe sin hangul (la guía no lo da): marca "falta hangul".
- [Supuesto] Naver busca por dirección en coreano; si no hay, por hangul del nombre, dirección en inglés o nombre.
- [Supuesto] "Mañana" se calcula respecto al día que se está viendo (no solo hoy).
- [Supuesto] Solo imágenes (no PDF): de un PDF, haz captura de pantalla y súbela.
- [Supuesto] 9 pestañas no caben: la barra queda en Hoy, Ruta, Enseñar, Comer, Más; Corea, Seguro, Gastos y Checklist van como botones grandes arriba de Más (la pestaña Más se marca al estar en ellas; el botón atrás vuelve).
- [Supuesto] Ciudad por defecto en Comer: la del día actual; antes del viaje, Seúl. "Todas" disponible.
- [Supuesto] Tocar otra vez un estado lo quita. Descartado/Cerrado se ven atenuados.
- [Supuesto] Lugares propios sin hangul: Enseñar muestra "falta hangul" y Naver busca por el nombre.
- [Supuesto] No se añaden de la Lonely: tiendas, estadios, karaoke, festivales fuera de fechas y lo de la isla de Ulleungdo/costa de Pohang (la guía lo mete en la zona de Gyeongju).
- [Supuesto] Duplicados guía web/Lonely se unen en una tarjeta (fuente Lonely + enlace web).
- [Supuesto] Cambio automático: api.frankfurter.dev (y .app de reserva), datos del Banco Central Europeo; se actualiza como mucho cada 6 h. Escribir un cambio a mano lo fija hasta pulsar "Usar cambio automático".
- [Supuesto] Lista Verificar incluye todos los lugares de Comer (salvo los marcados Cerrado), lo marcado con verificar en el viaje y los sitios dudosos.
- [Supuesto] "Valoración": no hay puntuaciones públicas sin conexión ni API sin cuenta; se usa una valoración propia (1-5) y un orden "Recomendado" (Quiero, itinerario, ★ Lonely, guía web; Descartado/Cerrado al final; Visitado baja).
- [Supuesto] El mismo sitio se reconoce por su hangul (o por el nombre si no tiene): p. ej. "Mercado Gwangjang" en Comer y en Ciudades comparten marca. Las marcas antiguas del checklist se respetan.
- [Supuesto] Si un artículo de Wikipedia no tiene foto (o no existe), se queda el marcador 📷 sin romper nada.
- [Supuesto] "Justificado en el medio" = bloques y títulos centrados; las listas y textos largos siguen alineados a la izquierda para leerse bien.
- [Supuesto] La detección del plan es automática: puede fallar con nombres muy distintos (p. ej. "Mercado de electrónica de Yongsan" coincide con el KTX a Yongsan). Si algo no cuadra, se corrige con un alias en contenido.js.

## Verificar por el usuario
- Prueba real en tu móvil: abrir con wifi, cerrar, modo avión, abrir y recorrer las 8 pestañas.
- Exportar una copia antes de salir y guardarla en Drive o enviártela por correo.
- Activar GitHub Pages (Settings → Pages → rama main, carpeta / root).
- Importar el trip.json real y revisar Hoy y Ruta.
- Probar en modo avión tras abrir una vez con wifi.
- Añadir a "lugares" del trip.json los hoteles con su hangul (copiado de Naver Map o de la reserva).
- Revisar en Seguro que teléfono y póliza son los correctos.
- K-ETA / tarjeta de llegada: comprobar en la web oficial antes de salir.
- Hacer fotos del pasaporte, reservas y póliza y añadirlas en Más → Fotos de documentos.
- Comer: comprobar con Naver que los sitios siguen abiertos y marcar los cerrados.
- Con wifi: Más → "Descargar fotos de los imprescindibles" y comprobar en Ciudades que salen las fotos (también en modo avión).
