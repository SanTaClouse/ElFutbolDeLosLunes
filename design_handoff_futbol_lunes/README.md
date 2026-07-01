# Handoff: Fútbol de los Lunes

## Overview
"Fútbol de los Lunes" es una web app mobile-first para un grupo de amigos que juega fútbol 5 todos los lunes a las 20hs. El grupo se organiza por WhatsApp (los primeros 10 que se anotan juegan). La app **no** reemplaza la organización por WhatsApp; agrega:

1. Una **tabla de posiciones** de jugadores por puntos (corazón del producto).
2. Un **armador de equipos** que toma un mensaje de WhatsApp y arma dos equipos parejos (Blancos vs Negros), editables a mano, con un mensaje pre-armado para compartir de vuelta en el grupo.
3. **Registro de resultados** que suma puntos automáticamente.
4. **Puntos extra** manuales (con trazabilidad de quién los agregó).
5. **Historial** de todos los movimientos (auditable, se puede deshacer).
6. **Patrones** detectados automáticamente (ej: "cuando Nacho juega con Juanma, ganan").

El acceso es sin cuenta: cada usuario **elige su nombre** de una lista del grupo en el onboarding.

## About the Design Files
El archivo `Fútbol de los lunes.dc.html` en este bundle es una **referencia de diseño creada en HTML** — un prototipo navegable que muestra el look & feel y el comportamiento buscado. **No es código de producción para copiar directamente.**

La tarea es **recrear este diseño en un entorno real**. No hay codebase existente todavía, así que se debe elegir el stack más apropiado. Sugerencia (el usuario mencionó Vercel): **Next.js (App Router) + React + Tailwind CSS + una base de datos (Postgres vía Supabase o Vercel Postgres)**. El prototipo usa estado en memoria; la app real necesita persistencia.

> Nota técnica sobre el prototipo: está escrito como un "Design Component" (`.dc.html`) con estilos inline y una clase de lógica. Ignorá esa estructura de runtime — lo que importa es el layout, los colores, la tipografía, el copy y las reglas de negocio documentadas abajo.

## Fidelity
**Alta fidelidad (hifi).** Colores, tipografía, espaciados, radios y microinteracciones son finales. Recrear la UI lo más fiel posible. La lógica de balanceo de equipos es un **placeholder** (ver más abajo) — el usuario la reemplazará con su propio criterio.

---

## Design Tokens

### Colores
- Fondo de página (fuera del teléfono): gradiente radial `#EEF2EC → #DFE6DC → #D3DCCF`
- Fondo de app: `#F4F6F3`
- Superficie / tarjetas: `#FFFFFF`
- Texto principal (ink): `#10160F`
- Texto secundario / muted: `#5A635A`
- Texto terciario / labels: `#9AA39B`
- Verde primario (acción): `#12A150`
- Verde oscuro (headers, marca): `#0C7C3D` / degradado a `#0A6A35` / `#08532A`
- Verde suave (fondos de chip/badge): `#E9F7EE`, borde `#CDEDD9`
- Verde claro texto sobre oscuro: `#8FE0AC`
- Negro de equipo "Negros": `#17201A`
- Bordes / líneas: `#E7ECE6`, líneas internas `#F0F3EF` / `#F4F6F3`
- Rojo (quitar): texto `#B0433A`, fondo hover `#FBE7E5`
- Amarillo (fondo icono estrella historial): `#FFF6E0`

### Tipografía
- **Manrope** (Google Fonts) — UI y texto general. Pesos: 400, 500, 600, 700, 800.
- **Space Grotesk** (Google Fonts) — títulos, marca y **todos los números** (puntos, ranking). Pesos: 500, 600, 700.
- Los números usan `font-variant-numeric: tabular-nums`.

### Radios
- Teléfono (shell): 46px
- Tarjetas grandes: 20–24px
- Tarjetas medianas / inputs / botones: 14–18px
- Chips / badges: 999px (pill)
- Avatares: 50%

### Sombras
- Tarjetas: `0 4px 14px -8px rgba(20,40,20,.22)`
- Podio verde: `0 14px 30px -16px rgba(12,124,61,.7)`
- Botón primario verde: `0 6px 16px -8px rgba(12,124,61,.9)` / `0 8px 18px -8px rgba(18,161,80,.9)`
- Toast: `0 10px 24px -8px rgba(0,0,0,.5)`

### Layout general
- Diseño **mobile-first**, pensado a 402px de ancho (marco de teléfono en el prototipo; en la app real es full-width en mobile).
- Estructura de app: status bar → header (kicker + título + avatar de usuario) → área scrolleable → bottom nav de 4 pestañas.
- Bottom nav fijo: **Tabla · Armar · Registrar · Historial**. Íconos de línea (stroke 2, lucide-style). Activo en `#0C7C3D`, inactivo `#AEB6AD`.

---

## Screens / Views

### 1. Onboarding
- **Propósito:** el usuario elige su nombre para entrar (no hay login/cuenta).
- **Layout:** overlay full-screen con degradado verde (`#0C7C3D → #0A6A35 → #08532A`), texto blanco. Arriba centrado: logo, marca, subtítulo. Abajo: grid 2-columnas de botones con los nombres del grupo.
- **Logo:** badge redondeado 96px, fondo `rgba(255,255,255,.12)` con borde sutil; adentro un ícono de pelota (círculo blanco + pentágono negro + líneas radiales). Marca: "FÚTBOL DE LOS" (kicker, `#8FE0AC`, uppercase, letter-spacing 3px) + "Lunes" (Space Grotesk 52px, 700, blanco).
- **Botones de nombre:** fondo `rgba(255,255,255,.10)`, borde `rgba(255,255,255,.16)`, radio 16px, avatar circular con inicial. Ordenados alfabéticamente. Al tocar → entra a la app (pestaña Tabla) con ese usuario activo.
- **Copy:** "Elegí tu nombre para entrar" / "No tenés que crear cuenta. Tu nombre es tu acceso."

### 2. Tabla de posiciones (pantalla principal)
- **Propósito:** lo primero que se ve. Ranking de jugadores por puntos.
- **Podio (top 3):** tarjeta con degradado verde. 3 columnas, el #1 con avatar más grande (56px vs 46px). Medallas 🥇🥈🥉, nombre, "X pts" en `#8FE0AC`.
- **Patrones detectados:** franja horizontal scrolleable de tarjetas (78% de ancho c/u). Cada una: badge de categoría (uppercase, verde sobre `#E9F7EE`), título (dupla o jugador), descripción. Label "Automático" a la derecha.
- **Tabla completa:** tarjeta blanca con filas. Cada fila: ranking (top-3 en verde) · avatar con inicial · nombre (+ "· vos" si es el usuario) · récord "G# · E# · P#" · PJ · **PTS** (Space Grotesk 17px). La fila del usuario logueado tiene fondo `#F1FAF3` y avatar verde.

### 3. Armar equipos
- **Propósito:** pegar el mensaje de WhatsApp y generar dos equipos parejos.
- **Input:** textarea (precargado con un mensaje de ejemplo). Placeholder "Pegá el mensaje de WhatsApp…".
- **Botones:** "Armar equipos" (verde, primario) + "Otra" (re-mezcla, con ícono shuffle).
- **Parsing del mensaje:** cada línea puede tener número prefijo ("1 nachoo", "2juanma", "3 Martin"). Se ignora la línea de header ("Lunes 20hs"). Los nombres se normalizan (minúsculas, sin acentos) y se hace match difuso contra el roster (ej. "nachoo" → "Nacho", "juani" → "Juani"). Toma los primeros 10. Nombres que no matchean se muestran igual con 0 pts.
- **Resultado:** dos columnas — **Blancos** (tarjeta blanca, punto blanco con borde negro) y **Negros** (tarjeta `#17201A`, punto negro con borde blanco). Cada equipo muestra su suma de puntos. Cada jugador: número, nombre, sus puntos.
- **Editar:** tocar un jugador de un equipo lo selecciona (highlight); tocar uno del otro equipo → **intercambia** los dos. Copy: "Tocá un jugador de cada equipo para intercambiarlos".
- **Balance:** muestra "Diferencia de puntos: X · lo más parejo posible".
- **Compartir:** botón verde con ícono share → abre modal con el mensaje pre-armado (ver "Mensaje de compartir" abajo) y botones Copiar / WhatsApp.

### 4. Registrar resultado
- **Propósito:** cargar quién ganó y sumar puntos.
- **Requiere equipos armados.** Si no hay, muestra empty state con botón "Ir a armar equipos".
- **Selección de resultado:** dos botones grandes Blancos / Negros + botón ancho "Empate". El seleccionado se pinta (Blancos → verde, Negros → negro, Empate → verde).
- **Resumen:** al elegir, tarjeta verde muestra qué pasa: "Ganan Blancos" → "+3 pts y +1 partido para: [nombres]." / "Empate" → "+1 punto para los 10 jugadores."
- **Puntos extra:** botón dashed "Sumar punto extra a un jugador" → abre la misma hoja de puntos extra.
- **Confirmar:** botón "Confirmar resultado" (deshabilitado gris hasta elegir resultado). Al confirmar → actualiza stats de jugadores + agrega entrada al historial + toast.

### 5. Historial
- **Propósito:** trazabilidad auditable de todos los movimientos.
- **Stats arriba:** dos tarjetas — "Partidos" y "Puntos extra" (contador total).
- **Botón:** "Agregar punto extra" (dashed).
- **Feed:** lista de tarjetas. Cada una: ícono (⭐ extra / 🏆 resultado / 🤝 empate) con fondo tintado, título, subtítulo con fecha, delta "+N" en verde, y botón "−" para **quitar** el movimiento (revierte los puntos que había otorgado).
  - Extra: "Santi sumó a Nacho" / "Gol de cabeza · 30/06"
  - Resultado: "Ganó Blancos" / "+3 a 5 jugadores · 30/06"
  - Empate: "Empate" / "+1 a todos · 16/06"

### Modales (bottom sheets)
- **Puntos extra:** sheet que sube desde abajo. Selección de jugador (fila horizontal de avatares) + selección de motivo (lista de opciones). Botón confirma "+1 a [jugador]" (deshabilitado hasta elegir ambos). Se registra a nombre del usuario logueado. Copy: "Queda registrado a tu nombre en el historial."
- **Compartir:** sheet con preview del mensaje + Copiar / WhatsApp.
- **Toast:** pill oscuro centrado abajo, aparece 2.4s con animación.

---

## Reglas de negocio (LÓGICA — crítico)

### Puntos base
- **Partido ganado:** cada uno de los 5 jugadores del equipo ganador suma **+3 puntos** y **+1 partido ganado (PJ +1, G +1)**.
- **Empate:** cada uno de los 10 jugadores suma **+1 punto** (PJ +1, E +1). (El usuario confirmó querer puntos por empate.)
- **Puntaje total de un jugador** = `ganados*3 + empates*1 + puntos_extra`.

### Puntos extra (+1 cada uno, cualquier jugador puede agregarlos)
Catálogo inicial (dejar el sistema extensible para agregar más):
1. Gol de cabeza — +1
2. Gol de atrás de mitad de cancha — +1
3. 5+ goles en un partido — +1
4. 3 partidos invicto — +1

**Trazabilidad (importante):** cada punto extra queda registrado como "[quién lo agregó] sumó a [jugador] · [motivo] · [fecha]". Debe poder **quitarse** (y al quitarse, revertir el punto). Esto evita que se carguen puntos indebidos.

### Balanceo de equipos (PLACEHOLDER — el usuario lo reemplaza)
El prototipo usa un **draft serpenteado** por puntos: ordena los 10 jugadores por puntaje descendente y reparte en patrón W,B,B,W,W,B,B,W,W,B para equilibrar la suma. **El usuario tiene su propio criterio de balanceo** (basado en historial de mezclas parejas y duplas) y lo va a implementar aparte. Dejar la función de balanceo aislada y fácil de reemplazar.

Ejemplos de mezclas parejas reales que dio el usuario (para entrenar/validar el criterio):
```
Blancos: Juani, Fede, Vale, Chiva, Nacho   /  Negros: Martin, Juanma, Mauro, Santi, Mateo
Negros:  Juani, Martin, Franco, Santi, Mauro /  Blancos: Juanma, Meina, Mateo, Nacho, Vale
Negros:  Juanma, Negro, Juani, Santi, Chiva  /  Blancos: Nacho, Mateo, Fede, Martin, Pancho
```

### Patrones (algoritmo a implementar)
Detectar correlaciones a partir del historial de partidos, por ejemplo:
- Duplas que ganan mucho juntas (ej: "Nacho + Juanma ganan 8 de 9 veces").
- Rachas de victorias de una dupla.
- Jugadores que dependen de otro para ganar.
- Jugadores cerca de un logro (ej: a 1 partido de "3 invicto").
En el prototipo son datos de ejemplo; en la app real se calculan sobre los partidos registrados.

### Mensaje de compartir (pre-armado)
```
⚽ Equipos del partido — Lunes 20hs

⚪ Blancos:
1. [nombre]
... (5)

⚫ Negros:
1. [nombre]
... (5)

[Puntero] está puntero con [X] puntos 🏆
Mirá tus puntos en la app 👉 futboldeloslunes.vercel.app
```

---

## State Management (para la app real)
Entidades / tablas sugeridas:
- **players**: id, nombre, (stats derivables o cacheadas: pj, ganados, empates, perdidos, puntos_extra, puntos_total).
- **matches**: id, fecha, resultado (blancos | negros | empate), equipo_blancos (5 player ids), equipo_negros (5 player ids).
- **extra_points**: id, player_id, motivo, puntos, agregado_por (player id/nombre), fecha. (Reversible.)
- La tabla de posiciones se calcula sumando matches + extra_points por jugador.
- El "usuario logueado" es sólo un nombre elegido (guardar en sesión/localStorage). No hay auth real por ahora, aunque el usuario evaluó un PIN simple a futuro para evitar suplantación.

## Interactions & Behavior
- Navegación por bottom nav (4 pestañas), sin recarga.
- Onboarding → app al elegir nombre.
- Armador: parse en vivo, re-shuffle, swap por tap-tap.
- Modales tipo bottom-sheet con animación de subida (`transform: translateY(100%) → 0`, ~0.3s, `cubic-bezier(.2,.8,.2,1)`).
- Toast auto-dismiss 2.4s.
- Animaciones sutiles de entrada (`opacity + translateY`, ~0.3–0.6s ease).
- Todo debe funcionar bien en mobile; hit targets ≥ 44px.

## Assets
- **Fuentes:** Manrope + Space Grotesk (Google Fonts).
- **Íconos:** SVG de línea estilo Lucide (shuffle, share, plus, bar-chart, whistle/plus-circle, clock, minus, whatsapp). Reemplazar por una librería de íconos (ej. lucide-react).
- **Logo:** ícono de pelota simple (círculo + pentágono). Puede rediseñarse con un logo propio.
- **Emojis** usados como íconos de categoría: 🥇🥈🥉 ⚪⚫ ⭐🏆🤝 🎯🚀🔥🛡️ (opcional reemplazar por íconos).
- Sin imágenes raster.

## Files
- `Fútbol de los lunes.dc.html` — prototipo de referencia (todas las pantallas y la lógica de demo).
