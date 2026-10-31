# Progreso
- [x] S1  - [ ] S2  - [ ] S3  - [ ] S4  - [ ] S5  - [ ] S6

Caché del service worker: corea-v1

## Decisiones
- S1: datos guardados en localStorage (más simple que IndexedDB; el viaje cabe de sobra).
- S1: el commit se hace directamente en main (sin PR), por petición del usuario.

## Supuestos
- [Supuesto] Botón "Probar con datos de ejemplo" en la bienvenida, para probar la app sin el trip.json real.
- [Supuesto] Tema (Auto/Claro/Oscuro) e Importar/Exportar/Borrar viven en la pestaña Más.
- [Supuesto] "Importar viaje" acepta también una copia exportada por la app (restaura viaje + gastos/checklist/notas).
- [Supuesto] Un traslado es "pendiente" si su estado contiene "pendiente"; "comprado" si contiene "comprad" o tren.comprado = true.
- [Supuesto] En Hoy se muestra el alojamiento cuya "ciudad" coincide con la ciudad del día.
- [Supuesto] Pestañas de sesiones futuras muestran "Llega en la sesión Sx".

## Verificar por el usuario
- Activar GitHub Pages (Settings → Pages → rama main, carpeta / root).
- Importar el trip.json real y revisar Hoy y Ruta.
- Probar en modo avión tras abrir una vez con wifi.
