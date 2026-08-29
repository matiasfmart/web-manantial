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

Todos los datos de contenido están centralizados en [`lib/data.ts`](lib/data.ts):

- `churchInfo.radioStreamUrl`: reemplazar por la URL real del stream de audio (icecast/shoutcast/HLS).
- `churchInfo.appStore` / `churchInfo.playStore`: enlaces reales a las tiendas cuando la app esté publicada.
- `churchInfo.social` / `churchInfo.whatsappChannelUrl` / `churchInfo.prayerRequest`: redes, canal de WhatsApp y teléfonos reales.
- `churchInfo.youtubeChannelId`: completar con el ID del canal (YouTube Studio → Configuración → Canal → Configuración avanzada) para activar el embed en vivo automático en `/en-vivo`. Mientras esté vacío, se usa el link `.../live`, que YouTube redirige solo a la transmisión en curso.
- `pastoralTeam`: reemplazar los avatares con iniciales por fotos reales de cada matrimonio/pastor (ver sección de imágenes abajo).
- `components/contact-form.tsx`: el formulario actualmente no envía el mensaje a ningún backend. Conectar a un servicio de email (Resend, Formspree, etc.) o a un endpoint propio antes de producción.

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
```

Para reemplazar o sumar una foto: agregá el archivo en la subcarpeta que corresponda
y actualizá el path en `lib/data.ts` (no hace falta tocar componentes ni páginas).

**Imágenes pendientes de conseguir** (hoy usan avatares con iniciales o no tienen foto):
- Fotos reales de cada pastor/matrimonio del equipo pastoral (`pastoralTeam`).
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
