# Progreso
- [x] S1  - [x] S2  - [x] S3  - [x] S4  - [x] S5  - [x] S6

Caché del service worker: corea-v12

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
