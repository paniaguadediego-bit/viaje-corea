# Arranque: FamiliadeAMuchis · Escapadas (Tenerife)

Instrucciones para la sesión que empiece el repo **FamiliadeAMuchis.Escapadas**.
Primer paso de esa sesión: copiar este texto como `CLAUDE.md` del repo nuevo
(ajustando lo que haga falta) y crear `PROGRESO.md`. Después, hacer solo la S1.

## Qué es
PWA para el móvil (instalable, funciona sin conexión) para descubrir Tenerife
en grupo: sitios por **municipio**, marcarlos (🔖 Quiero ir / ✅ Fuimos /
✖️ No) con ⭐ y nota, y **ver lo que ha marcado cada miembro del grupo, al
momento y sin pasarse archivos**. Para animarse a hacer planes los fines de
semana y, al proponer uno, saber quién ya lo ha hecho.

## Punto de partida
El esqueleto de `paniaguadediego-bit/viaje-corea` (repo público): service
worker y caché offline, manifest, pestañas inferiores, fichas plegables,
marcas y estrellas, mapa propio sin librerías (puntos offline y calles de
OpenStreetMap con conexión), tiempo de Open-Meteo, buscador sin tildes,
diario, Resumen en Word/PDF (exportar.js) y Trivial (trivial.js).
Se copia lo útil y se **borra** todo lo de Corea: Naver y Kakao (pasa a
🌐 Google Maps), hangul, Idioma, ₩/€, metro, vuelos, traslados, Seguro,
Escala Pekín, Lonely Planet, trip.json de viaje. Mejor borrar que arrastrar.

## Reglas
1. Repo PÚBLICO (GitHub Pages). Nunca subir direcciones de casa, emails,
   teléfonos ni claves secretas (la `service_role` de Supabase JAMÁS).
   La clave `anon` de Supabase sí puede ir en el código: es pública y la
   protegen las reglas RLS.
2. HTML, CSS y JS puro. Sin frameworks, sin CDN, sin build.
   Excepción aprobada: **Supabase** como única nube, llamado con `fetch`
   a su API REST (sin SDK).
3. Rutas relativas en todo (vive en /FamiliadeAMuchis.Escapadas/):
   start_url "./index.html", sin id ni scope.
4. Funciona sin conexión: las marcas se guardan primero en el móvil y se
   envían en cuanto hay red (cola en localStorage).
5. Dato dudoso = "VERIFICAR". No inventar horarios, precios, teléfonos
   ni coordenadas: cada sitio con su fuente.
6. Mobile-first, una mano, tema claro/oscuro. Un icono por significado.
7. Cada sesión acaba con: cómo probarlo en modo avión, versión subida
   (CACHE en sw.js, VERSION en app.js y --css-ver en styles.css, iguales),
   PROGRESO.md actualizado y commit en main. Resumen en 5 líneas y
   "Para continuar escribe: Sigue".

## Datos
`data/sitios.json` (público): `[{id, municipio, nombre, tipo, lat, lon,
desc, fuente, url, verificar?, duracion?, dificultad?, acceso?}]`.
Tipos: 🥾 sendero, 🏖️ playa/charco, 👀 mirador, 🏘️ pueblo, 🏛️ museo,
🌳 naturaleza, 🍷 guachinche, 🍽️ restaurante, 🎟️ evento, ✨ curioso.
Municipios (31): Adeje, Arafo, Arico, Arona, Buenavista del Norte,
Candelaria, El Rosario, El Sauzal, El Tanque, Fasnia, Garachico,
Granadilla de Abona, Guía de Isora, Güímar, Icod de los Vinos, La Guancha,
La Matanza de Acentejo, La Orotava, La Victoria de Acentejo, Los Realejos,
Los Silos, Puerto de la Cruz, San Cristóbal de La Laguna, San Juan de la
Rambla, San Miguel de Abona, Santa Cruz de Tenerife, Santa Úrsula,
Santiago del Teide, Tacoronte, Tegueste, Vilaflor de Chasna.

## Compartir en el grupo (Supabase)
- El usuario crea un proyecto gratuito en supabase.com (la sesión le guía
  paso a paso) y pega en el chat la URL y la clave anon.
- Entrada con **código de 6 cifras por email** (no enlace: en una PWA
  instalada el enlace abre el navegador, no la app). Una vez por móvil.
- Tablas (SQL en `supabase/esquema.sql`, versionado en el repo):
  - `perfiles(id = auth.uid, nombre, emoji, color)`
  - `grupos(id, nombre, codigo_invitacion)` y
    `miembros(grupo_id, user_id)`: se entra a un grupo con su código
  - `marcas(user_id, grupo_id, sitio_id, estado quiero|fuimos|no,
    estrellas, nota, fecha, updated_at)`, clave (user_id, grupo_id, sitio_id)
  - Más adelante `planes(id, grupo_id, sitio_id, fecha, propone,
    apuntados[])`
- RLS: cada uno escribe solo sus marcas; lee las de los grupos a los que
  pertenece.
- Sincronización: al abrir la app, al volver a ella, cada ~60 s mientras
  está abierta y justo después de marcar. Sin conexión, cola local.
- En cada ficha: caritas de quién fue (✅), quién quiere ir (🔖) y sus ⭐.
  Pestaña 👥 Grupo: quién lleva más sitios, últimas marcas y «nadie ha ido
  todavía».

## Hoja de ruta (una por sesión, en orden)
- **S1** Esqueleto desde viaje-corea, limpio de Corea. Pestañas: 🏠 Este
  finde, 📍 Sitios (por municipio y tipo), 🗺️ Mapa, 👥 Grupo (vacío de
  momento), ☰ Más. Unos 20 sitios de ejemplo REALES con fuente. Marcas
  solo en el móvil. Instrucciones para activar GitHub Pages.
- **S2** Catálogo: unos 100-150 sitios repartidos por los 31 municipios,
  con coordenadas, descripción propia y fuente; dudosos con VERIFICAR.
- **S3** Supabase: guía para crear el proyecto, esquema.sql con RLS,
  entrada por código de email, perfil (nombre y emoji), grupo
  «Familia de A Muchis» con código de invitación.
- **S4** Sincronización de marcas, cola sin conexión, caritas en fichas y
  mapa, pestaña Grupo.
- **S5** Este finde: tiempo por zona (norte/sur/cumbre), «🎲 Sorpréndeme»
  (algo que nadie del grupo o tú no hayáis hecho, según tiempo y tiempo
  disponible), distancia desde casa (la ubicación de casa solo en el móvil).
- **S6** Planes propuestos al grupo (proponer fecha, apuntarse), diario,
  Resumen anual en PDF y Trivial canario.

## Decisiones ya tomadas por el usuario
- Nombre: FamiliadeAMuchis.Escapadas.
- Organización por municipios.
- El catálogo inicial lo prepara Claude.
- Lo ya visitado se marcará con la app hecha.
- Marcas compartidas y automáticas desde el principio del diseño; amigos
  poco a poco (grupos con código de invitación).
