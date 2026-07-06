-- ============================================================
--  Fútbol de los Lunes — esquema de base de datos (Supabase)
--  Pegá esto en el SQL Editor de tu proyecto Supabase y ejecutá.
-- ============================================================

-- Jugadores del grupo
create table if not exists public.players (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  created_at timestamptz not null default now()
);

-- Eventos: unidad de verdad. La tabla de posiciones se reconstruye
-- sumando eventos. Borrar un evento revierte sus puntos.
--   type = 'result' -> partido con ganador (guarda ambos equipos)
--   type = 'draw'   -> empate (guarda ambos equipos)
--   type = 'extra'  -> punto extra manual (jugador, motivo, autor)
--   type = 'lineup' -> equipos confirmados para el próximo partido (no suma puntos)
create table if not exists public.events (
  id           uuid primary key default gen_random_uuid(),
  type         text not null check (type in ('result', 'draw', 'extra', 'lineup')),
  occurred_on  date not null default current_date,
  -- result | draw
  team_white   uuid[],
  team_black   uuid[],
  winner       text check (winner in ('Blancos', 'Negros')),
  -- extra
  player_id    uuid references public.players (id) on delete cascade,
  reason       text,
  reason_label text,
  added_by     text,
  delta        integer,
  -- baja lógica (trazabilidad de quién quitó un movimiento)
  removed      boolean not null default false,
  removed_by   text,
  removed_at   timestamptz,
  created_at   timestamptz not null default now()
);

create index if not exists events_created_at_idx on public.events (created_at);
create index if not exists events_type_idx on public.events (type);

-- Equipos compartidos: guardan la mezcla de un partido bajo un código corto,
-- así el link de WhatsApp queda cortito (…/?s=Ab3xK9) en vez de enorme.
create table if not exists public.shares (
  code       text primary key,
  team_white text[] not null,
  team_black text[] not null,
  leader     text,
  leader_pts integer,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
--  Row Level Security
--  El acceso es sin cuenta (elegís tu nombre). Para un grupo de
--  amigos alcanza con permitir lectura/escritura pública con la
--  anon key. Si más adelante querés cerrar esto, cambiá las policies.
-- ------------------------------------------------------------
alter table public.players enable row level security;
alter table public.events enable row level security;
alter table public.shares enable row level security;

drop policy if exists "players open" on public.players;
create policy "players open" on public.players
  for all using (true) with check (true);

drop policy if exists "events open" on public.events;
create policy "events open" on public.events
  for all using (true) with check (true);

drop policy if exists "shares open" on public.shares;
create policy "shares open" on public.shares
  for all using (true) with check (true);

-- ------------------------------------------------------------
--  Roster inicial (opcional). Borralo o editá con los nombres reales.
-- ------------------------------------------------------------
insert into public.players (name)
select name from (values
  ('Nacho'), ('Juanma'), ('Santi'), ('Mateo'), ('Fede'),
  ('Martin'), ('Chiva'), ('Mauro'), ('Vale'), ('Juani'),
  ('Franco'), ('Joa'), ('Mati'), ('Lea'), ('Joaquín')
) as t(name)
where not exists (select 1 from public.players);
