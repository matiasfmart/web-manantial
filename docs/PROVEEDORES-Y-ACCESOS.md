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
- **Login de la cuenta de Render:** "Continuar con GitHub" (cuenta `@matiasfmart`,
  mismo comportamiento que Cloudflare: toma el email `martinez.matiashc@gmail.com`).
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
  `@matiasfmart`). Importante: el login con GitHub toma el email público/primario
  configurado en esa cuenta de GitHub, que es `martinez.matiashc@gmail.com` — no
  hace falta acordarse de una contraseña separada de Cloudflare, con entrar a
  GitHub alcanza.
- **Nota importante:** durante esta conversación se detectó que
  `iglesiamanantial.org` existe pero **no es el sitio real** — redirige a un
  formulario de Google no relacionado. No confundir ambos dominios.
- **Dónde administrar:** [dash.cloudflare.com](https://dash.cloudflare.com) →
  loguearse con la cuenta que administra el dominio → sección "DNS" para ver/editar
  los registros, y "Domain Registration" para renovación y datos de compra.

## 4. Envío de email (formulario de contacto)

- **Proveedor:** Resend (resend.com)
- **Login de la cuenta de Resend:** "Continuar con GitHub" (cuenta `@matiasfmart`,
  mismo comportamiento: toma el email `martinez.matiashc@gmail.com`).
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
- **Login de la cuenta de Zeno.fm:** email `martinez_matias@live.com.ar` (cuenta
  propia, no vinculada a GitHub).
- **Mount point:** `wxal9ufxpolvv`
- **URL de reproducción pública:** `https://stream.zeno.fm/wxal9ufxpolvv`
  (configurada en `churchTechnical.radioStreamUrl`, [lib/data.ts](../lib/data.ts))
- **Metadata pública de "sonando ahora"** (sin autenticación):
  `https://api.zeno.fm/mounts/metadata/subscribe/wxal9ufxpolvv`
  (hoy no está siendo usada por la web; solo confirmada como disponible).
- **Encoder/fuente (credenciales para transmitir, NO para consultar datos):**
  server `link.zeno.fm`, puerto `80`, mount `wxal9ufxpolvv`, usuario `source`.
  La contraseña del mount es sensible — no debe compartirse ni pegarse en chats
  o archivos del repo. Si se expuso alguna vez, regenerarla desde el panel de
  Zeno.fm (botón "Reset").
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
- **Cuenta de Google del Sheet:** la cuenta de Google "Oficina Manantial", que
  administra **Lea Valdez** (no es una cuenta personal tuya). Para cualquier
  cambio de permisos, contactarla a ella.
- **Dónde administrar:** buscar el Sheet compartido desde esa cuenta, o pedirle
  el link/acceso a Lea Valdez.

## 8. Lo que falta confirmar (pendiente de completar por vos)

- [ ] Cuenta de Google Cloud Console usada para generar la `YOUTUBE_API_KEY`
      (confirmar si es la misma cuenta "Oficina Manantial" administrada por Lea
      Valdez, o una cuenta personal distinta).

**Nota sobre el login con GitHub:** Cloudflare, Render y Resend se manejan los
tres con "Continuar con GitHub" usando la cuenta `@matiasfmart`. Ese login
toma automáticamente el email público/primario de esa cuenta de GitHub
(`martinez.matiashc@gmail.com`), aunque el usuario visible sea `@matiasfmart`.
Si en el futuro no se encuentra una cuenta buscando por email, buscarla por el
login de GitHub en su lugar.
