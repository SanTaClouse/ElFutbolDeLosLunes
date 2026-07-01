import {
  GameEvent,
  Player,
  Standing,
  POINTS_WIN,
  POINTS_DRAW,
} from "./types";

/**
 * Reconstruye la tabla de posiciones a partir de los eventos.
 * Todo sale de acá: PJ, G, E, P, extra y total. Sin stats cacheadas =
 * borrar un evento revierte sus puntos automáticamente.
 */
export function computeStandings(
  players: Player[],
  events: GameEvent[]
): Standing[] {
  const byId = new Map<string, Standing>();
  for (const p of players) {
    byId.set(p.id, { player: p, pj: 0, g: 0, e: 0, p: 0, extra: 0, pts: 0 });
  }

  for (const ev of events) {
    if (ev.type === "result") {
      const white = ev.teamWhite ?? [];
      const black = ev.teamBlack ?? [];
      const winners = ev.winner === "Blancos" ? white : black;
      const losers = ev.winner === "Blancos" ? black : white;
      for (const id of winners) {
        const s = byId.get(id);
        if (s) {
          s.pj += 1;
          s.g += 1;
        }
      }
      for (const id of losers) {
        const s = byId.get(id);
        if (s) {
          s.pj += 1;
          s.p += 1;
        }
      }
    } else if (ev.type === "draw") {
      const all = [...(ev.teamWhite ?? []), ...(ev.teamBlack ?? [])];
      for (const id of all) {
        const s = byId.get(id);
        if (s) {
          s.pj += 1;
          s.e += 1;
        }
      }
    } else if (ev.type === "extra") {
      if (ev.playerId) {
        const s = byId.get(ev.playerId);
        if (s) s.extra += ev.delta ?? 1;
      }
    }
  }

  for (const s of byId.values()) {
    s.pts = s.g * POINTS_WIN + s.e * POINTS_DRAW + s.extra;
  }

  return sortStandings([...byId.values()]);
}

/** Orden: puntos desc, luego ganados, luego nombre. */
export function sortStandings(list: Standing[]): Standing[] {
  return [...list].sort(
    (a, b) =>
      b.pts - a.pts ||
      b.g - a.g ||
      a.player.name.localeCompare(b.player.name)
  );
}

/** Promedio de puntos por partido jugado (fuerza para el balanceo). */
export function pointsPerGame(s: Standing): number {
  return s.pj > 0 ? s.pts / s.pj : 0;
}
