-- ============================================================
--  Fútbol de los Lunes — RESET de datos
--  Pegá esto en el SQL Editor de Supabase y ejecutá.
--  OJO: borra datos de forma irreversible.
-- ============================================================

-- ------------------------------------------------------------
--  OPCIÓN A (la más común): volver la tabla a CERO,
--  pero MANTENER el roster de jugadores.
--  Borra todos los partidos, empates y puntos extra.
-- ------------------------------------------------------------
truncate table public.events;


-- ------------------------------------------------------------
--  OPCIÓN B: reset TOTAL (borra jugadores + eventos) y recarga
--  el roster inicial. Descomentá este bloque y comentá la
--  Opción A de arriba si querés empezar de cero de cero.
-- ------------------------------------------------------------
-- truncate table public.events, public.players cascade;
--
-- insert into public.players (name) values
--   ('Nacho'), ('Juanma'), ('Santi'), ('Mateo'), ('Fede'),
--   ('Martin'), ('Chiva'), ('Mauro'), ('Vale'), ('Juani'),
--   ('Franco'), ('Joa'), ('Mati'), ('Lea'), ('Joaquín');
