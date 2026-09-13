# Proveedores y accesos del proyecto

Mapa de "dónde está cada cosa": dominio, hosting, email, radio, YouTube y Google
Sheets. Armado revisando el código real del repositorio (`render.yaml`,
`lib/data.ts`, `lib/sheets.ts`, `app/api/contacto/route.ts`) y el historial de
esta conversación — no es una lista de memoria.

**Este documento no contiene contraseñas ni API keys reales.** Esas viven
únicamente en:

- `.env.local` (solo en tu máquina — está en `.gitignore`, nunca se sube a git)
- El panel **Environment** del servicio en Render (producción)

Si perdés una key, no está guardada en ningún otro lado: hay que entrar al panel
del proveedor correspondiente y generar una nueva.

---

## 1. Repositorio de código

- **Repositorio:** `github.com/matiasfmart/web-manantial`
- **Rama que se despliega a producción:** `develop`
  (confirmado por Render en despliegues anteriores durante esta conversación).
- **Rama `master`:** existe pero está desactualizada, no es la fuente de producción.

## 2. Hosting (Render)

- **Proveedor:** Render.com
- **Servicio:** `iglesia-manantial-web` (definido en [render.yaml](../render.yaml))
- **Plan:** `free`
- **Build command:** `npm install && npm run build`
- **Start command:** `npm run start`
- **Auto-deploy:** habilitado (cada push a la rama conectada dispara un deploy)
- **Login de la cuenta de Render:** "Continuar con GitHub" (cuenta `@matiasfmart`).
  Nota: el login con GitHub toma el email primario configurado en esa cuenta de
  GitHub (no es un email institucional aparte) — ver la nota al final del
  documento.
- **Variables de entorno declaradas** (todas `sync: false`, o sea: se cargan
  manualmente en el dashboard de Render, no viven en el repo):
  - `GOOGLE_SHEET_ID`
  - `RESEND_API_KEY`
  - `RESEND_FROM_EMAIL`
  - `YOUTUBE_API_KEY`

⚠️ **Dónde administrar:** entrar a [render.com](https://render.com), loguearse
con la cuenta que se usó para crear el servicio, y buscar `iglesia-manantial-web`
en el dashboard. Ahí está la sección "Environment" con las 4 variables de arriba.

## 3. Dominio

- **Dominio de producción confirmado:** `manantialdeavivamiento.com`
- **Registrador y DNS:** **Cloudflare**. Ahí se compró/administra el dominio y ahí
  viven los registros DNS (el registro que apunta a Render, y los registros TXT/DKIM
  que verifican el dominio en Resend — ver sección 4).
- **Login de la cuenta de Cloudflare:** "Continuar con GitHub" (cuenta de GitHub
  `@matiasfmart`). Ver nota sobre login con GitHub al final del documento.
- **Nota importante:** durante esta conversación se detectó que
  `iglesiamanantial.org` existe pero **no es el sitio real** — redirige a un
  formulario de Google no relacionado. No confundir ambos dominios.
- **Dónde administrar:** [dash.cloudflare.com](https://dash.cloudflare.com) →
  loguearse con la cuenta que administra el dominio → sección "DNS" para ver/editar
  los registros, y "Domain Registration" para renovación y datos de compra.

## 4. Envío de email (formulario de contacto)

- **Proveedor:** Resend (resend.com)
- **Login de la cuenta de Resend:** "Continuar con GitHub" (cuenta `@matiasfmart`).
- **Para qué se usa exactamente:** el formulario de [Contacto](../app/contacto/page.tsx)
  no manda el mail directo desde el navegador (eso no es posible ni seguro). En
  su lugar, el formulario llama a la ruta propia del sitio
  [app/api/contacto/route.ts](../app/api/contacto/route.ts), y esa ruta —del lado
  del servidor, con la API key privada— le pide a Resend que envíe el email real
  hacia la casilla institucional (`churchInfo.email`), con el email de quien
  escribió el formulario como "reply-to" (para poder responderle directo).
- **Por qué hizo falta el paso "raro" con Cloudflare:** Resend, por defecto,
  solo permite mandar emails desde un remitente de pruebas
  (`onboarding@resend.dev`), que además **solo entrega al mismo email con el
  que te registraste en Resend** — no sirve para producción real. Para poder
  enviar como `oficina@manantialdeavivamiento.com` (remitente real, que le
  llega a cualquier destinatario), Resend exige **verificar que sos dueño del
  dominio**: te pide agregar un conjunto de registros DNS (típicamente SPF,
  DKIM y a veces un registro de verificación aparte) en el proveedor de DNS del
  dominio — que en este caso es **Cloudflare** (ver sección 3). Una vez que esos
  registros se agregaron en Cloudflare y Resend los detectó, el dominio quedó
  verificado y se pudo usar como remitente real. Ese ida y vuelta entre Resend
  (que pide los registros) y Cloudflare (donde hay que cargarlos) es la parte
  que se sintió rara/confusa.
- **Estado actual confirmado:** ya está configurado con el remitente real del
  dominio (no el de pruebas) — o sea, el paso de verificación en Cloudflare ya
  se completó en su momento.
- **Variables necesarias:**
  - `RESEND_API_KEY`: API key generada desde el dashboard de Resend.
  - `RESEND_FROM_EMAIL`: remitente verificado (`oficina@manantialdeavivamiento.com`).
    Si esta variable faltara, el código cae automáticamente al remitente de
    pruebas `onboarding@resend.dev`.
- **Si hay que volver a verificar el dominio en el futuro** (por ejemplo, si se
  migra de Cloudflare a otro proveedor de DNS): entrar a Resend → "Domains" →
  el dominio en cuestión, ahí Resend muestra exactamente qué registros DNS
  espera; esos registros se cargan en la sección "DNS" de Cloudflare.
- **Dónde administrar:** [resend.com](https://resend.com) → tu cuenta → API Keys
  / Domains.

## 5. Radio en vivo (streaming de audio)

- **Proveedor:** Zeno.fm
- **Login de la cuenta de Zeno.fm:** cuenta personal del administrador (ver
  detalle en tus notas privadas, no se documenta el email acá).
- **Mount point:** `wxal9ufxpolvv`
- **URL de reproducción pública:** `https://stream.zeno.fm/wxal9ufxpolvv`
  (configurada en `churchTechnical.radioStreamUrl`, [lib/data.ts](../lib/data.ts))
- **Metadata pública de "sonando ahora"** (sin autenticación):
  `https://api.zeno.fm/mounts/metadata/subscribe/wxal9ufxpolvv`
  (hoy no está siendo usada por la web; solo confirmada como disponible).
- **Encoder/fuente (credenciales para transmitir, NO para consultar datos):**
  ver panel de Zeno.fm → "Stream Encoder Settings". No se documentan acá el
  servidor/puerto/usuario juntos por seguridad (reduce el esfuerzo para intentar
  interferir con la transmisión real). La contraseña del mount es sensible — no
  debe compartirse ni pegarse en chats o archivos del repo. Si se expuso alguna
  vez, regenerarla desde el panel de Zeno.fm (botón "Reset").
- **Estadísticas de oyentes/país:** confirmado que **no son accesibles** con el
  plan actual — el dashboard de Zeno.fm los muestra solo visualmente, sin
  opción de generar una API key para consultarlos programáticamente.
- **Dónde administrar:** [zeno.fm](https://zeno.fm) → dashboard de tu emisora.

## 6. YouTube (transmisión de cultos)

- **Canal ID:** `UCBsH_17YGsnfglxEm0Z96Xw`
  (`churchTechnical.youtubeChannelId`, [lib/data.ts](../lib/data.ts))
- **API usada:** YouTube Data API v3 (`videos.list`, `playlistItems.list`,
  `channels.list`) — es la única fuente de verdad para detectar transmisiones
  en vivo (ver [lib/youtube.ts](../lib/youtube.ts)).
- **Variable necesaria:** `YOUTUBE_API_KEY`.
- **Dónde administrar:** [Google Cloud Console](https://console.cloud.google.com)
  → el proyecto donde se generó la API key → "APIs & Services" → "Credentials".
  Ahí también se ve la cuota diaria consumida (10.000 unidades/día por defecto).

## 7. Contenido editable (Google Sheets)

- **Variable necesaria:** `GOOGLE_SHEET_ID` (el ID de la hoja, no una API key —
  el sitio la lee de forma pública vía export CSV, sin autenticación).
- **Guía operativa completa (cómo editar cada pestaña):**
  [docs/GUIA-OPERATIVA-GOOGLE-SHEETS.md](GUIA-OPERATIVA-GOOGLE-SHEETS.md)
- **Requisito:** el Sheet debe estar compartido como "Cualquier persona con el
  enlace puede ver".
- **Cuenta de Google del Sheet:** cuenta institucional de oficina, administrada
  por una persona del equipo (ver notas internas para el contacto). Para
  cualquier cambio de permisos, coordinar con esa persona.
- **Dónde administrar:** buscar el Sheet compartido desde esa cuenta
  institucional, o pedir el link/acceso a quien la administra.

## 8. Lo que falta confirmar (pendiente de completar por vos)

- [ ] Cuenta de Google Cloud Console usada para generar la `YOUTUBE_API_KEY`
      (confirmar si es la misma cuenta institucional del Sheet, o una cuenta
      personal distinta).

**Nota sobre el login con GitHub:** Cloudflare, Render y Resend se manejan los
tres con "Continuar con GitHub" usando la misma cuenta de GitHub. Ese login
toma automáticamente el email primario configurado en esa cuenta de GitHub,
aunque el usuario visible sea el de GitHub. Si en el futuro no se encuentra una
cuenta buscando por email, buscarla por el login de GitHub en su lugar.

**Nota de seguridad:** este archivo es público (vive en el repositorio de
GitHub). A propósito no incluye emails personales, nombres de terceros, ni
datos de encoder/servidor que puedan facilitar un ataque dirigido. Si necesitás
un listado con esos detalles completos (emails exactos, contactos, etc.), guardalo
en un documento privado fuera del repositorio (por ejemplo, un Google Doc
compartido solo con el equipo), no acá.
