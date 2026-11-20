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
   teléfonos, cuentas de servicio ni claves privadas de Firebase. El
   `firebaseConfig` de la app web sí puede ir en el código: es público y
   lo que protege los datos son las reglas de Firestore.
2. HTML, CSS y JS puro. Sin frameworks, sin CDN, sin build.
   Excepción aprobada: **Firebase** (Auth con Google y Firestore) como
   única nube, con su SDK copiado en el repo.
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

## Compartir en el grupo (Firebase, de Google)
- El usuario lo hace todo desde el móvil: la sesión le guía con pasos muy
  sencillos para crear el proyecto en console.firebase.google.com (gratis,
  plan Spark), activar la entrada con Google y Firestore, añadir
  `paniaguadediego-bit.github.io` a los dominios autorizados y pegar en el
  chat el `firebaseConfig` de la app web.
- Entrada con **cuenta de Google** (`signInWithPopup`; en una PWA instalada
  el redirect falla por el bloqueo de almacenamiento de terceros: probarlo
  en el móvil del usuario). Una vez por móvil.
- SDK de Firebase (app, auth y firestore) **copiado en el repo** (carpeta
  `vendor/`, versión fija y precacheada), sin CDN.
- Datos en Firestore:
  - `perfiles/{uid}`: nombre, emoji, color
  - `grupos/{gid}`: nombre, codigoInvitacion, miembros [uid]
  - `grupos/{gid}/marcas/{uid}_{sitioId}`: uid, sitioId, estado
    (quiero|fuimos|no), estrellas, nota, fecha, actualizado
  - Más adelante `grupos/{gid}/planes/{id}`: sitioId, fecha, propone,
    apuntados [uid]
- Reglas de seguridad en `firebase/firestore.rules` (en el repo; el usuario
  las pega en la consola): cada uno escribe solo sus marcas y su perfil;
  lee las marcas de los grupos en los que está; se entra a un grupo con
  su código de invitación.
- Al día y sin conexión: `onSnapshot` (las marcas de los demás aparecen al
  momento) y la persistencia offline de Firestore (lo marcado sin red se
  envía solo al volver).
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
- **S3** Firebase: guía para crear el proyecto desde el móvil, reglas de
  Firestore, entrada con Google, perfil (nombre y emoji), grupo
  «Familia de A Muchis» con código de invitación.
- **S4** Marcas compartidas al momento (onSnapshot), sin conexión con la
  persistencia de Firestore, caritas en fichas y mapa, pestaña Grupo.
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
- Nube: Firebase con cuenta de Google (no Supabase: ya tiene 2 proyectos).
- Todo se hace desde el móvil.
