-- ============================================================
--  Migración: confirmación de equipos (type = 'lineup')
--  Pegá esto en el SQL Editor de Supabase y ejecutá UNA vez.
--  No toca datos existentes; solo permite el nuevo tipo de evento.
-- ============================================================

-- Sanity-check opcional: ver el nombre real del constraint antes de correr.
--   select conname, pg_get_constraintdef(oid)
--   from pg_constraint where conrelid = 'public.events'::regclass;

alter table public.events drop constraint if exists events_type_check;
alter table public.events add constraint events_type_check
  check (type in ('result', 'draw', 'extra', 'lineup'));
