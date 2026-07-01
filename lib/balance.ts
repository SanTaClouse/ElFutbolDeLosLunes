import { ResolvedName } from "./parse";

export interface BuilderSlot {
  raw: string;
  name: string;
  playerId: string | null;
  known: boolean;
  pts: number; // puntos totales (lo que se muestra en el encabezado del equipo)
  avg: number; // puntos por partido (base alternativa de balanceo)
}

/**
 * Base de balanceo:
 * - "points": por puntos totales. Coincide con los números que se ven en
 *   pantalla y con lo que eligió el grupo. (Default)
 * - "avg": por puntos por partido jugado. Más justo con quien tiene menos
 *   partidos. Cambiá esta constante para usarlo.
 */
export const BALANCE_STRATEGY: "points" | "avg" = "points";

function strength(slot: BuilderSlot): number {
  return BALANCE_STRATEGY === "avg" ? slot.avg : slot.pts;
}

export function toSlot(r: ResolvedName): BuilderSlot {
  const pts = r.standing?.pts ?? 0;
  const pj = r.standing?.pj ?? 0;
  return {
    raw: r.raw,
    name: r.name,
    playerId: r.playerId,
    known: r.known,
    pts,
    avg: pj > 0 ? pts / pj : 0,
  };
}

export interface BalancedTeams {
  whites: BuilderSlot[];
  blacks: BuilderSlot[];
  diffPoints: number; // diferencia de puntos totales entre equipos
}

function sumPts(slots: BuilderSlot[]): number {
  return slots.reduce((a, s) => a + s.pts, 0);
}

/**
 * Arma dos equipos lo más parejos posible probando TODAS las particiones
 * (con 10 jugadores son solo 252). Fija el jugador 0 en un equipo para no
 * contar cada división dos veces.
 *
 * @param shuffle si es true, elige al azar entre las divisiones casi óptimas
 *   (para el botón "Otra"), manteniéndolo parejo pero variando la mezcla.
 */
export function balanceTeams(
  slots: BuilderSlot[],
  shuffle = false
): BalancedTeams {
  const n = slots.length;
  if (n <= 1) {
    return { whites: slots, blacks: [], diffPoints: sumPts(slots) };
  }

  const sizeA = Math.ceil(n / 2);

  // Fuerza bruta hasta 16 jugadores; arriba, reparto greedy.
  if (n > 16) {
    return greedy(slots);
  }

  type Split = { a: number[]; diff: number };
  const splits: Split[] = [];

  const idx: number[] = [];
  const build = (start: number) => {
    if (idx.length === sizeA) {
      const a = [...idx];
      const setA = new Set(a);
      let sa = 0;
      let sb = 0;
      for (let i = 0; i < n; i++) {
        if (setA.has(i)) sa += strength(slots[i]);
        else sb += strength(slots[i]);
      }
      splits.push({ a, diff: Math.abs(sa - sb) });
      return;
    }
    for (let i = start; i < n; i++) {
      // fija el índice 0 en el equipo A para evitar duplicar A/B
      if (idx.length === 0 && i !== 0) break;
      idx.push(i);
      build(i + 1);
      idx.pop();
    }
  };
  build(0);

  splits.sort((x, y) => x.diff - y.diff);
  const best = splits[0].diff;
  let chosen = splits[0];
  if (shuffle) {
    // divisiones dentro de un margen chico de la óptima
    const near = splits.filter((s) => s.diff <= best + 3);
    chosen = near[Math.floor(Math.random() * near.length)] ?? splits[0];
  }

  const setA = new Set(chosen.a);
  const whites: BuilderSlot[] = [];
  const blacks: BuilderSlot[] = [];
  slots.forEach((s, i) => (setA.has(i) ? whites : blacks).push(s));

  return {
    whites,
    blacks,
    diffPoints: Math.abs(sumPts(whites) - sumPts(blacks)),
  };
}

/** Reparto greedy (fallback para muchos jugadores). */
function greedy(slots: BuilderSlot[]): BalancedTeams {
  const sorted = [...slots].sort((a, b) => strength(b) - strength(a));
  const whites: BuilderSlot[] = [];
  const blacks: BuilderSlot[] = [];
  let sw = 0;
  let sb = 0;
  for (const s of sorted) {
    if (sw <= sb) {
      whites.push(s);
      sw += strength(s);
    } else {
      blacks.push(s);
      sb += strength(s);
    }
  }
  return {
    whites,
    blacks,
    diffPoints: Math.abs(sumPts(whites) - sumPts(blacks)),
  };
}
