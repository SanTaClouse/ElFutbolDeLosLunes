# Fútbol de los Lunes ⚽

Web app mobile-first para el grupo que juega fútbol 5 los lunes: tabla de
posiciones, armador de equipos parejos desde un mensaje de WhatsApp, registro de
resultados, puntos extra con trazabilidad, historial reversible y detección de
patrones (duplas que ganan juntas).

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS**
- **Supabase** (Postgres) para persistencia — opcional en desarrollo

## Correr en local

```bash
npm install
npm run dev
```

Abrí <http://localhost:3000>.

> Sin configurar Supabase, la app corre con **datos de ejemplo persistidos en el
> navegador** (localStorage). Ideal para desarrollo y demo. El "login" es elegir
> tu nombre (se guarda en localStorage); no hay cuentas ni contraseñas.

## Conectar Supabase (persistencia compartida)

1. Creá un proyecto en [supabase.com](https://supabase.com).
2. En el **SQL Editor**, pegá y ejecutá [`supabase/schema.sql`](supabase/schema.sql).
3. Copiá `.env.local.example` a `.env.local` y completá:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
   ```

4. Reiniciá `npm run dev`. La app detecta las credenciales y usa Postgres
   automáticamente (todos ven la misma tabla).

## Cómo funciona

- **Puntos:** victoria +3 (y PJ/G) a los 5 ganadores · empate +1 a los 10 ·
  extras +1 (gol de cabeza, gol de mitad de cancha, 5+ goles, 3 invicto).
- **Todo son eventos.** La tabla de posiciones se reconstruye sumándolos, así
  borrar un movimiento del historial revierte sus puntos automáticamente.
- **Balanceo:** prueba las 252 formas de partir 10 jugadores en dos equipos de 5
  y elige la más pareja. Editable con tap-tap. La base de balanceo se cambia con
  `BALANCE_STRATEGY` en [`lib/balance.ts`](lib/balance.ts) (`"points"` o `"avg"`).

## Estructura

```
app/            layout, estilos y shell principal (page.tsx)
components/     store (estado + acciones), pantallas y modales
lib/            lógica pura: puntos, parser, balanceo, patrones, share
lib/data/       capa de datos: interfaz + mock (localStorage) + Supabase
supabase/       schema.sql
```

## Deploy

Deploy directo en [Vercel](https://vercel.com): importás el repo y cargás las dos
variables de entorno de Supabase. Listo.
# ElFutbolDeLosLunes
