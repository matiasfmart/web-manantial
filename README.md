# Ministerio Manantial de Avivamiento — Web institucional

Sitio web institucional para la iglesia, construido con **Next.js 14 (App Router) + TypeScript + Tailwind CSS**.

## Secciones

- **Inicio**: hero, próximas reuniones, radio en vivo, ministerios y ubicación.
- **Nosotros**: historia, visión, misión y liderazgo.
- **Ministerios**: las 7 áreas de la iglesia, cada una con página propia.
- **Reuniones**: horario semanal completo (cultos generales y GDI).
- **Radio en vivo**: reproductor de streaming, programación y enlaces a apps móviles.
- **Contacto**: formulario y mapa de ubicación.

## Datos a personalizar antes de producción

Todos los textos del sitio (ministerios, horarios, datos de contacto, ofrendas, equipo
pastoral, programación de radio) se pueden editar **sin tocar código**, desde un
Google Sheet — ver la sección [Backoffice sin código (Google Sheets)](#backoffice-sin-código-google-sheets)
más abajo. Si no se configura ningún Sheet, el sitio funciona igual, usando el
contenido por defecto que está en [`lib/data.ts`](lib/data.ts).

Lo que sí sigue siendo parte del código (no editable desde la hoja):

- `churchInfo.radioStreamUrl`: reemplazar por la URL real del stream de audio (icecast/shoutcast/HLS).
- `churchInfo.youtubeChannelId`: completar con el ID del canal (YouTube Studio → Configuración → Canal → Configuración avanzada) para activar el embed en vivo automático en `/en-vivo`. Mientras esté vacío, se usa el link `.../live`, que YouTube redirige solo a la transmisión en curso.
- `churchInfo.appStore` / `churchInfo.playStore`: enlaces reales a las tiendas cuando la app esté publicada.
- Imágenes de ministerios, logos y fotos del equipo pastoral (ver sección de imágenes abajo): se administran en el código, no desde la hoja.
- `RESEND_API_KEY` y `RESEND_FROM_EMAIL`: variables privadas necesarias para que el formulario de contacto envíe correos mediante Resend.

## Backoffice sin código (Google Sheets)

El sitio puede leer sus textos desde un Google Sheet público (solo lectura), sin
necesidad de API keys ni de tocar código. Mientras no se configure, se usan los
valores por defecto embebidos en `lib/data.ts`.

### 1. Crear el Google Sheet

Creá una planilla nueva en la cuenta de Google de la iglesia, con **una hoja
(tab) por cada uno de estos nombres exactos** (respetando mayúsculas):

| Hoja | Columnas | Para qué es |
|---|---|---|
| `DatosIglesia` | `key`, `value` | Nombre de la iglesia, dirección, teléfonos, redes, oración y textos institucionales |
| `Ministerios` | `slug`, `name`, `tagline`, `schedule`, `scheduleNote`, `description`, `longDescription1`, `longDescription2`, `longDescription3`, `audience`, `isOutreach`, `subMinistryName`, `subMinistrySchedule`, `subMinistryDescription`, `category`, `location`, `locationLabel`, `joinLabel`, `contactTopic`, `highlights`, `acceptingMembers`, `featured`, `featuredOrder` | Texto, orientación, CTA y destacados de cada uno de los 7 ministerios |
| `Reuniones` | `day`, `time`, `label`, `streamed`, `location`, `locationLabel`, `calendarEnabled`, `calendarTitle`, `calendarDurationMinutes` | Horario semanal general |
| `ReunionesEspeciales` | `name`, `schedule`, `description`, `streamed`, `recurrence`, `time`, `location`, `locationLabel`, `calendarEnabled`, `calendarTitle`, `calendarDurationMinutes`, `nextDate`, `nextTime`, `nextStreamed`, `nextNote` | Noche de Unción, Santa Cena, etc. |
| `PrimeraVez` | `order`, `title`, `text` | Preguntas frecuentes de la página para visitantes nuevos |
| `EquipoPastoral` | `displayName`, `role`, `order` | Pastora principal, matrimonios, evangelista y orden de aparición |
| `Ofrendas` | `key`, `value` | Texto de la página de ofrendas, alias de Mercado Pago, CBU, etc. |
| `OfrendasCategorias` | `name`, `description` | "Ofrenda general", "Diezmo", etc. |
| `ProgramacionRadio` | `time`, `program`, `host` | Grilla horaria de Radio Maranata |

**Importante sobre `Ministerios`**: el valor de `slug` tiene que ser exactamente
uno de estos (son los que ya usan las fotos y colores del sitio):
`avivamiento-jovenes`, `anos-dorados`, `ibe`, `escuela-de-vida`, `escuela-biblica`,
`avivamiento-en-las-calles`, `gdi`. Si falta una fila para un slug, esa página
simplemente no se genera.

En las columnas `streamed` / `isOutreach` usá el texto `TRUE` o `FALSE`.

Para `Ministerios`, `category` organiza la página en `life-stage`, `formation`,
`community` o `serve`. `location` puede ser `auditorium`, `homes` o
`community`; `locationLabel` permite reemplazar el texto mostrado. `joinLabel`
personaliza el CTA, `contactTopic` define el motivo que llega preseleccionado a
Contacto y `acceptingMembers` admite `TRUE` o `FALSE`. En `highlights`, separá
cada punto con `|`, por ejemplo: `Alabanza | Palabra práctica | Comunidad`.
Todas estas columnas son opcionales y usan valores adecuados por defecto si se
dejan vacías.

En `Ministerios`, usá `featured=TRUE` para mostrar un ministerio en Inicio y
`featuredOrder` para definir su posición. Inicio muestra hasta tres destacados;
si no hay ninguno marcado, muestra los primeros tres disponibles.

Para los textos de la página `Nosotros`, agregá en `DatosIglesia` las claves
opcionales `historyTitle`, `historyText`, `vision`, `mission`, `values` y
`communityStatement`. En `values`, separá cada valor con `|`, por ejemplo:
`Fe genuina | Familia | Servicio | Excelencia | Comunidad`. En
`EquipoPastoral`, `order` es un número opcional para decidir el orden visible
del equipo. Las imágenes pastorales siguen siendo archivos estáticos dentro de
`public/images/pastoral`, para no exponer paths de imágenes en la hoja.

Para la página `Primera vez`, `DatosIglesia` admite las claves opcionales
`firstVisitIntro`, `firstVisitArrivalTitle`, `firstVisitArrivalStep1`,
`firstVisitArrivalStep2`, `firstVisitArrivalStep3` y
`firstVisitWhatsappMessage`. En la hoja `PrimeraVez`, `order` define el orden
de las preguntas; la primera fila es la que aparece abierta inicialmente. Si
esa hoja está vacía, se usan las preguntas y el orden por defecto del sitio.

Para Inicio, `DatosIglesia` admite `homeHeroKicker`, `homeHeroTitle`,
`homeHeroText`, `homeWelcomeTitle`, `homeWelcomeText`, `homeStats1Value`,
`homeStats1Label`, `homeStats2Value`, `homeStats2Label`, `homeStats3Value`,
`homeStats3Label`, `homeStats4Value` y `homeStats4Label`. Estos campos editan
el hero, el mensaje de bienvenida y los cuatro datos breves de la portada.

Para `Reuniones`, `location` puede ser `auditorium` o `homes`; sin valor, se
usa `auditorium`. Para `ReunionesEspeciales`, `recurrence` puede ser
`first-day` o `first-sunday`; sin valor, Santa Cena usa `first-sunday` y las
demás reuniones `first-day`. `calendarEnabled` admite `TRUE` o `FALSE`, y las
columnas de calendario son opcionales: el sitio conserva valores por defecto
si no se completan.

Si una reunión especial cambia de fecha, cargá `nextDate` con formato
`YYYY-MM-DD`. Mientras esa fecha sea actual o futura, reemplaza la recurrencia
habitual. `nextTime`, `nextStreamed` y `nextNote` son opcionales y se aplican
solo a esa próxima fecha; al pasar la fecha o vaciar `nextDate`, el sitio vuelve
automáticamente a la regla de `recurrence`.

En `DatosIglesia`, cada fila es un dato suelto, por ejemplo:

```
key              | value
name             | Ministerio Manantial de Avivamiento
shortName        | Manantial de Avivamiento
phone            | +54 11 2799-4682
email            | hola@iglesiamanantial.org
instagram        | https://www.instagram.com/manantialavivamiento/
prayerMobile     | +54 9 11 2799-4682
prayerWhatsappLink | https://wa.me/5491127994682
```

(Las claves disponibles son las mismas que ves en `defaultChurchText` dentro de
`lib/data.ts`; cualquiera que no completes usa el valor por defecto.)

### 2. Compartir el Sheet

En el Sheet: **Compartir → Cambiar a "Cualquier persona con el enlace" → Rol: Lector**.
No hace falta hacerlo público en buscadores, solo que cualquiera con el link pueda verlo
(esto es lo que le permite al sitio leerlo sin necesidad de login ni API key).

### 3. Configurar la variable de entorno

De la URL del Sheet, copiá el ID (la parte entre `/d/` y `/edit`):

```
https://docs.google.com/spreadsheets/d/ESTE_ES_EL_ID/edit
```

En Render: **Dashboard → tu servicio → Environment → Add Environment Variable**:

```
GOOGLE_SHEET_ID = ESTE_ES_EL_ID
```

Guardá y Render va a redeployar. Localmente, para probarlo, creá un archivo
`.env.local` en la raíz del proyecto con la misma variable.

### 4. Uso diario

A partir de acá, cualquier persona con acceso de edición al Sheet puede cambiar
horarios, descripciones, teléfonos, etc. Los cambios tardan hasta 5 minutos en
reflejarse en la web (el sitio cachea cada hoja por 300 segundos). Si una hoja
está vacía o mal escrita, esa sección vuelve a mostrar el contenido por defecto
en vez de romperse.

## Estructura de imágenes (`public/`)

```
public/
  logo/
    logo-blanco.png   → usado en el header (fondo oscuro)
    logo-negro.png    → favicon / usos sobre fondo claro
  images/
    hero/
      home-1.jpg       → fondo del hero de Inicio
      home-2.jpg       → sección "Bienvenida" (fondo blanco) de Inicio
    ministries/
      <slug>.jpg / <slug>-1.jpg / <slug>-2.jpg → foto(s) de cada ministerio,
      referenciadas desde `ministry.image` / `ministry.image2` en `lib/data.ts`.
    pastoral/
      silvana-zagari.jpg
      ivan-damaris.jpg
      alejandro-claudia.jpg
      matias-abigail.jpg
      mathias-lorena.jpg
      samuel-leticia.jpg
      orlando-flores.jpg
```

Para reemplazar o sumar una foto: agregá el archivo en la subcarpeta que corresponda
y actualizá el path en `lib/data.ts` (no hace falta tocar componentes ni páginas).

**Imágenes pendientes de conseguir** (hoy usan placeholders con logo o no tienen foto):
- Fotos reales de cada unidad pastoral (`pastoralTeam`): una foto para Silvana, una por matrimonio, y una para Orlando. Cuando agregues el archivo, copiá el valor de `suggestedImage` a `image` en `lib/data.ts`.
- Una segunda foto para I.B.E., Escuela de Vida, Escuela Bíblica y GDI (hoy solo tienen una).
- Un ícono cuadrado (isotipo) para reemplazar el favicon actual, que usa el logo completo (funciona, pero un isotipo se ve más nítido en tamaños chicos).

## Desarrollo local

```bash
npm install
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

## Despliegue en Render

Este repo incluye `render.yaml` para desplegar como **Web Service**:

- Build command: `npm install && npm run build`
- Start command: `npm run start` (usa la variable `$PORT` que provee Render)

Alternativamente, crear el servicio manualmente en Render con esos mismos comandos y Node 20.
