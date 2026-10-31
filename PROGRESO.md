# Progreso
- [x] S1  - [x] S2  - [ ] S3  - [ ] S4  - [ ] S5  - [ ] S6

Caché del service worker: corea-v2

## Decisiones
- S1: datos guardados en localStorage (más simple que IndexedDB; el viaje cabe de sobra).
- S1: el commit se hace directamente en main (sin PR), por petición del usuario.

- Cambio pedido: interfaz más compacta (texto 17px, tarjetas y botones más pequeños).
- Cambio pedido: mapa esquemático de Corea en Ruta con ciudades, traslados (azul comprado, rojo discontinuo pendiente) y sitios de interés por ciudad. Nuevos campos opcionales en ciudades: lat, lon, interes[].

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

## Verificar por el usuario
- Activar GitHub Pages (Settings → Pages → rama main, carpeta / root).
- Importar el trip.json real y revisar Hoy y Ruta.
- Probar en modo avión tras abrir una vez con wifi.
- Añadir a "lugares" el hangul real de hoteles y sitios (copiado de Naver Map) y a "ciudades" sus "interes".
- Revisar en Seguro que teléfono y póliza son los correctos.
