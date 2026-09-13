# Guía Operativa de Google Sheets

Esta guía explica cómo actualizar el contenido de la web de Ministerio Manantial de Avivamiento desde Google Sheets.

Está pensada para la persona que administra la información de la iglesia. No hace falta saber programación. Seguí los nombres de las hojas y columnas exactamente como están escritos aquí.

## Antes de empezar

- Editá solamente el contenido de las celdas. No cambies el nombre de las hojas ni los encabezados de las columnas.
- Usá una fila por reunión, ministerio, pregunta, integrante o programa.
- Esperá hasta 5 minutos para ver los cambios publicados. La web actualiza la información periódicamente.
- Para opciones de sí/no, escribí solamente `TRUE` o `FALSE`, en mayúsculas.
- Las fechas puntuales deben tener formato `YYYY-MM-DD`, por ejemplo `2026-09-20`.
- Para los horarios, usá `19:30 h` o `19:30`. Mantené el mismo formato en toda la hoja.
- Si un campo opcional se deja vacío, la web puede usar un valor por defecto. No borres las columnas.
- Antes de comunicar un cambio, revisá la página correspondiente en la web.

## Qué editar según la necesidad

| Quiero cambiar... | Hoja que debo editar |
|---|---|
| Nombre, dirección, teléfonos, redes o textos institucionales | `DatosIglesia` |
| Horarios semanales, GDI y actividades por edad | `Reuniones` |
| Santa Cena, Noche de Unción, vigilia, conferencia u otro evento especial | `ReunionesEspeciales` |
| Texto, horarios o CTA de un ministerio | `Ministerios` |
| Preguntas para quienes visitan por primera vez | `PrimeraVez` |
| Equipo pastoral | `EquipoPastoral` |
| Datos de ofrendas | `Ofrendas` y `OfrendasCategorias` |
| Programación de Radio Maranata | `ProgramacionRadio` |

## Cómo funciona la agenda

La web diferencia entre tres cosas. Es importante no confundirlas:

| Concepto | Dónde aparece | Cuándo usarlo |
|---|---|---|
| Próxima reunión | Inicio y Agenda | Reuniones abiertas de la iglesia, GDI y especiales públicos |
| Próxima transmisión | Página `En vivo` | Encuentros que se transmitirán realmente por YouTube |
| Actividad | Agenda, bajo su audiencia | Espacios para niños, adolescentes, jóvenes, formación o servicio |

Una actividad de un grupo específico no debe aparecer como `Próxima reunión` en Inicio. Por ejemplo, Escuela Bíblica, Avivamiento Jóvenes, Avivamiento Adolescente, IBE o Escuela de Vida.

## Hoja: Reuniones

Usá esta hoja para la agenda semanal que se repite todas las semanas.

### Columnas

| Columna | Qué escribir | Para qué sirve |
|---|---|---|
| `day` | `Martes`, `Miércoles`, `Sábados` o `Domingos` | Día de la actividad |
| `time` | Ejemplo: `19:30 h` | Horario de inicio |
| `label` | Ejemplo: `Reunión general` | Nombre que verá el visitante |
| `isPublic` | `TRUE` o `FALSE` | Decide si puede aparecer como próxima reunión en Inicio |
| `audience` | Ver valores permitidos abajo | Define el filtro de Agenda |
| `streamed` | `TRUE` o `FALSE` | Decide si puede aparecer en próximas transmisiones |
| `location` | `auditorium` o `homes` | Lugar del encuentro |
| `locationLabel` | Texto libre, opcional | Reemplaza el lugar mostrado, por ejemplo `En hogares` |
| `calendarEnabled` | `TRUE` o `FALSE` | Decide si se ofrece la opción de agendar |
| `calendarTitle` | Texto libre, opcional | Título que tendrá el evento al agendarlo |
| `calendarDurationMinutes` | Número, opcional | Duración estimada en minutos |

### Valores permitidos para `audience`

| Valor | Se muestra en el filtro |
|---|---|
| `all` | Toda la iglesia |
| `children` | Niños |
| `teens` | Adolescentes |
| `youth` | Jóvenes |
| `formation` | Formación |
| `service` | Servicio |

### Cómo clasificar correctamente una fila

| Tipo de encuentro | `isPublic` | `audience` | `streamed` | `location` |
|---|---:|---|---:|---|
| Reunión general | `TRUE` | `all` | `TRUE` solo si se transmite | `auditorium` |
| GDI | `TRUE` | `all` | `FALSE` | `homes` |
| Escuela Bíblica | `FALSE` | `children` | `FALSE` | `auditorium` |
| Avivamiento Adolescente | `FALSE` | `teens` | `FALSE` | `auditorium` |
| Avivamiento Jóvenes | `FALSE` | `youth` | `FALSE` | `auditorium` |
| IBE o Escuela de Vida | `FALSE` | `formation` | `FALSE` | `auditorium` |
| Evangelismo o acción solidaria | `FALSE` | `service` | `FALSE` | `auditorium` o `homes` |

### Ejemplos listos para usar

```text
day       | time     | label                         | isPublic | audience | streamed | location
Martes    | 20:00 h  | Reunión general              | TRUE     | all      | FALSE    | auditorium
Miércoles | 19:30 h  | GDI — Grupos de Integración  | TRUE     | all      | FALSE    | homes
Sábados   | 10:30 h  | Escuela Bíblica              | FALSE    | children | FALSE    | auditorium
Sábados   | 20:30 h  | Avivamiento Jóvenes          | FALSE    | youth    | FALSE    | auditorium
Domingos  | 19:30 h  | Reunión general              | TRUE     | all      | TRUE     | auditorium
```

### Cambiar un horario semanal

1. Abrí la hoja `Reuniones`.
2. Buscá la fila de la actividad.
3. Editá `day`, `time` o `label`.
4. Confirmá que `isPublic`, `audience`, `streamed` y `location` sigan siendo correctos.
5. Esperá hasta 5 minutos y revisá Inicio, Agenda y, si corresponde, `En vivo`.

## Hoja: ReunionesEspeciales

Usá esta hoja para encuentros mensuales, cambios de fecha, vigilia, conferencia, retiro u otro evento especial.

### Columnas principales

| Columna | Qué escribir | Para qué sirve |
|---|---|---|
| `name` | Ejemplo: `Noche de Unción` | Nombre del encuentro |
| `schedule` | Ejemplo: `Día 1 de cada mes` | Descripción de la frecuencia |
| `description` | Texto breve | Explicación para la Agenda |
| `isPublic` | `TRUE` o `FALSE` | Decide si puede aparecer como próxima reunión en Inicio |
| `streamed` | `TRUE` o `FALSE` | Decide si puede aparecer en próximas transmisiones |
| `recurrence` | `first-day` o `first-sunday` | Regla mensual del encuentro |
| `time` | Ejemplo: `20:00 h` | Hora habitual; conviene siempre completarla |
| `location` | `auditorium` o `homes` | Lugar del encuentro |
| `locationLabel` | Texto libre, opcional | Reemplaza el lugar mostrado |
| `calendarEnabled` | `TRUE` o `FALSE` | Muestra u oculta la acción Agendar |
| `calendarTitle` | Texto libre, opcional | Título del calendario |
| `calendarDurationMinutes` | Número, opcional | Duración estimada |

### Regla mensual

- Usá `first-day` para un encuentro el primer día de cada mes.
- Usá `first-sunday` para un encuentro el primer domingo de cada mes.
- Santa Cena normalmente usa `first-sunday`.

### Cambiar una sola fecha

Cuando un encuentro cambia solo este mes, no edites su regla habitual. Completá estos campos:

```text
nextDate      | 2026-09-18
nextTime      | 20:00 h
nextStreamed  | TRUE
nextNote      | Esta reunión reemplaza la fecha habitual.
```

- `nextDate`: fecha puntual, obligatoria para activar el cambio.
- `nextTime`: reemplaza el horario habitual solo para esa fecha.
- `nextStreamed`: reemplaza la indicación de YouTube solo para esa fecha.
- `nextNote`: mensaje breve que verá el visitante.

Después de que pasó la fecha, borrá `nextDate`, `nextTime`, `nextStreamed` y `nextNote`. La web volverá a usar automáticamente la recurrencia habitual.

### Destacar un único evento en Inicio

Esto es para eventos excepcionales y relevantes para la comunidad: una conferencia, una vigilia, un aniversario, un retiro abierto o una jornada solidaria grande.

No usar para actividades semanales normales.

| Columna | Qué escribir |
|---|---|
| `featureOnHome` | `TRUE` |
| `featureTitle` | Título que se verá en Inicio |
| `featureDate` | Fecha puntual, formato `YYYY-MM-DD` |
| `featureAudience` | Ejemplo: `Para toda la familia` |
| `featureCtaLabel` | Ejemplo: `Conocer más` |
| `featureCtaUrl` | Ejemplo: `/reuniones` o una URL `https://...` |

Ejemplo:

```text
featureOnHome    | TRUE
featureTitle     | Conferencia para familias
featureDate      | 2026-09-20
featureAudience  | Para toda la familia
featureCtaLabel  | Ver agenda
featureCtaUrl    | /reuniones
```

Reglas importantes:

- Marcá `featureOnHome=TRUE` en una sola fila a la vez.
- Si hay más de una fila marcada, la web muestra solamente el evento futuro más próximo.
- Los eventos pasados no aparecen.
- Al terminar el evento, cambiá `featureOnHome` a `FALSE` y borrá los campos `feature...` que ya no sirvan.
- Para un enlace interno, usá rutas como `/reuniones`, `/contacto` o `/ministerios`.
- Para un enlace externo, la URL debe comenzar con `https://`.

## Hoja: Ministerios

Esta hoja actualiza el contenido de las siete páginas de ministerios y sus tarjetas.

### Regla más importante: no cambiar `slug`

El `slug` conecta cada ministerio con su página, foto e identidad visual. No lo cambies.

Los valores permitidos son:

```text
avivamiento-jovenes
anos-dorados
ibe
escuela-de-vida
escuela-biblica
avivamiento-en-las-calles
gdi
```

### Campos de uso frecuente

| Columna | Uso |
|---|---|
| `name` | Nombre visible del ministerio |
| `tagline` | Frase breve de presentación |
| `schedule` | Día y horario o forma de consultar |
| `scheduleNote` | Aclaración opcional sobre el horario |
| `description` | Resumen corto para la tarjeta |
| `longDescription1`, `longDescription2`, `longDescription3` | Textos de la página interna |
| `audience` | Público al que está dirigido |
| `category` | `life-stage`, `formation`, `community` o `serve` |
| `location` | `auditorium`, `homes` o `community` |
| `locationLabel` | Texto libre para reemplazar el lugar |
| `joinLabel` | Texto del botón de contacto |
| `contactTopic` | Tema que llega preseleccionado al formulario |
| `highlights` | Puntos separados por `|` |
| `acceptingMembers` | `TRUE` si acepta incorporaciones; `FALSE` si invita a colaborar/conocer |
| `featured` | `TRUE` para mostrarlo en Inicio |
| `featuredOrder` | Orden de Inicio: `1`, `2` o `3` |

Ejemplo de `highlights`:

```text
Alabanza | Palabra práctica | Comunidad | Actividades durante el año
```

### Ministerios destacados en Inicio

Inicio muestra hasta tres ministerios destacados.

```text
featured       | TRUE
featuredOrder  | 1
```

- Usá `featured=TRUE` solo en los ministerios que deban aparecer en Inicio.
- Usá `featuredOrder` con `1`, `2` y `3` para ordenarlos.
- No repitas el mismo número de orden.
- Si no hay ningún ministerio destacado, la web muestra los tres primeros disponibles.

## Hoja: DatosIglesia

Cada fila tiene dos columnas: `key` y `value`.

No cambies las claves de la columna `key`. Editá solo la columna `value`.

### Datos de contacto y redes

```text
name
shortName
auditoriumName
historicNote
address
mapsQuery
phone
email
instagram
youtube
facebook
tiktok
whatsappChannelUrl
prayerIntro
prayerMobile
prayerLandline
prayerWhatsappLink
radioName
```

### Textos de Inicio

```text
homeHeroKicker
homeHeroTitle
homeHeroText
homeWelcomeTitle
homeWelcomeText
homeStats1Value
homeStats1Label
homeStats2Value
homeStats2Label
homeStats3Value
homeStats3Label
homeStats4Value
homeStats4Label
```

### Textos de Nosotros

```text
historyTitle
historyText
vision
mission
values
communityStatement
```

En `values`, separá cada valor con `|`:

```text
Fe genuina | Familia | Servicio | Excelencia | Comunidad
```

### Textos de Primera vez

```text
firstVisitIntro
firstVisitArrivalTitle
firstVisitArrivalStep1
firstVisitArrivalStep2
firstVisitArrivalStep3
firstVisitWhatsappMessage
```

## Otras hojas

### PrimeraVez

| Columna | Uso |
|---|---|
| `order` | Número de orden. La primera pregunta aparece abierta inicialmente. |
| `title` | Pregunta frecuente |
| `text` | Respuesta |

### EquipoPastoral

| Columna | Uso |
|---|---|
| `displayName` | Nombre de la persona o matrimonio |
| `role` | Función en la iglesia |
| `order` | Orden de aparición |

### Ofrendas

Cada fila tiene `key` y `value`. Actualizá datos de transferencia, alias, CBU, CUIT, titulares, textos y enlaces de ofrenda según corresponda.

### OfrendasCategorias

| Columna | Uso |
|---|---|
| `name` | Nombre de la categoría |
| `description` | Breve explicación |

### ProgramacionRadio

| Columna | Uso |
|---|---|
| `day` | Día de emisión o `Todos` para un bloque que se repite durante toda la semana |
| `time` | Rango horario, por ejemplo `09:00 – 12:00` |
| `program` | Nombre del programa |
| `host` | Conductor, equipo o `Automatizado` |

Usá estos valores exactamente en `day`:

```text
Lunes
Martes
Miércoles
Jueves
Viernes
Sábados
Domingos
Todos
```

`Todos` sirve para música, automatización u otros bloques que se repiten todos
los días. Si un programa de un día específico ocupa el mismo horario que uno de
`Todos`, la web muestra el programa específico de ese día.

Ejemplo:

```text
day       | time          | program                    | host
Todos     | 23:00 – 06:00 | Adoración Nocturna         | Automatizado
Miércoles | 18:00 – 20:00 | Palabra en comunidad       | Equipo de radio
Domingos  | 19:30 – 21:30 | Reunión general en vivo    | Manantial de Avivamiento
```

Los rangos de horario no deben superponerse dentro del mismo día. La web usa
esta grilla para indicar qué programa está sonando ahora y para mostrar la
programación del día elegido.

## Qué no se administra desde Sheets

No modifiques ni intentes agregar estos elementos a las hojas:

- Fotos, logo, colores e íconos.
- Dirección técnica de la señal de radio.
- ID técnico de YouTube.
- Configuración de correo de contacto.
- Diseño, botones, menús o estructura de páginas.

Para esos cambios, contactá a quien administra la web.

## Lista de control antes de publicar

```text
[ ] No renombré hojas ni columnas.
[ ] Usé TRUE o FALSE en mayúsculas.
[ ] Las fechas puntuales usan YYYY-MM-DD.
[ ] Las horas tienen formato HH:MM o HH:MM h.
[ ] Revisé isPublic antes de publicar una actividad.
[ ] Revisé audience para que aparezca en el filtro correcto de Agenda.
[ ] Marqué streamed=TRUE solo si habrá una transmisión real por YouTube.
[ ] Hay solo un evento con featureOnHome=TRUE.
[ ] Revisé el sitio después de esperar hasta 5 minutos.
```

## Resolución de problemas

| Situación | Qué revisar |
|---|---|
| El cambio todavía no aparece | Esperá hasta 5 minutos y recargá la página. |
| No aparece una reunión en Inicio | Revisá que `isPublic=TRUE`, que tenga día/hora válidos y que sea futura. |
| Aparece una actividad de grupo en Inicio | Cambiá `isPublic` a `FALSE`. |
| No aparece una próxima transmisión | Revisá que `streamed=TRUE` y que la fecha/hora sea futura. La agenda usa estos datos de la hoja. |
| Un evento especial muestra una fecha antigua | Borrá o actualizá `nextDate`, `nextTime`, `nextStreamed` y `nextNote`. |
| No aparece un ministerio en Inicio | Revisá `featured=TRUE` y `featuredOrder` entre `1` y `3`. |
| El evento destacado no aparece en Inicio | Revisá `featureOnHome=TRUE`, `featureDate` futura y formato `YYYY-MM-DD`. |
| Un texto no cambia | Revisá que la clave de `DatosIglesia` esté escrita exactamente igual. |
| La web parece volver a textos viejos | Verificá que la hoja siga compartida como lector para cualquier persona con el enlace. |
