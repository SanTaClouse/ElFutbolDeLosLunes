import { GameEvent, Player } from "./types";

export interface Insight {
  tag: string;
  title: string;
  desc: string;
}

interface PairStat {
  games: number;
  wins: number;
}

/**
 * Detecta patrones a partir de los partidos registrados:
 * - Duplas que ganan mucho jugando en el mismo equipo.
 * - Jugadores en racha de invictos (y cerca del punto por "3 invicto").
 * Todo se calcula sobre los eventos; sin datos hardcodeados.
 */
export function computeInsights(
  players: Player[],
  events: GameEvent[]
): Insight[] {
  const nameById = new Map(players.map((p) => [p.id, p.name]));
  const insights: Insight[] = [];

  // --- duplas ---
  const pairs = new Map<string, PairStat>();
  const addPair = (a: string, b: string, won: boolean) => {
    const key = a < b ? `${a}|${b}` : `${b}|${a}`;
    const s = pairs.get(key) ?? { games: 0, wins: 0 };
    s.games += 1;
    if (won) s.wins += 1;
    pairs.set(key, s);
  };
  const eachTeamPair = (team: string[], won: boolean) => {
    for (let i = 0; i < team.length; i++) {
      for (let j = i + 1; j < team.length; j++) {
        if (nameById.has(team[i]) && nameById.has(team[j])) {
          addPair(team[i], team[j], won);
        }
      }
    }
  };

  for (const ev of events) {
    if (ev.type === "result") {
      const white = ev.teamWhite ?? [];
      const black = ev.teamBlack ?? [];
      eachTeamPair(white, ev.winner === "Blancos");
      eachTeamPair(black, ev.winner === "Negros");
    } else if (ev.type === "draw") {
      eachTeamPair(ev.teamWhite ?? [], false);
      eachTeamPair(ev.teamBlack ?? [], false);
    }
  }

  let bestKey: string | null = null;
  let bestRate = 0;
  let bestGames = 0;
  for (const [key, s] of pairs) {
    if (s.games < 3) continue;
    const rate = s.wins / s.games;
    if (rate > bestRate || (rate === bestRate && s.games > bestGames)) {
      bestRate = rate;
      bestGames = s.games;
      bestKey = key;
    }
  }
  if (bestKey && bestRate >= 0.6) {
    const [a, b] = bestKey.split("|");
    const s = pairs.get(bestKey)!;
    insights.push({
      tag: "Dupla letal",
      title: `${nameById.get(a)} + ${nameById.get(b)}`,
      desc: `Juntos en el mismo equipo ganan ${s.wins} de ${s.games} (${Math.round(
        bestRate * 100
      )}%).`,
    });
  }

  // --- rachas de invicto (evento cronológico ascendente) ---
  const chrono = [...events]
    .filter((e) => e.type === "result" || e.type === "draw")
    .sort((x, y) => x.createdAt.localeCompare(y.createdAt));

  const streak = new Map<string, number>();
  for (const ev of chrono) {
    const white = ev.teamWhite ?? [];
    const black = ev.teamBlack ?? [];
    const played = [...white, ...black];
    for (const id of played) {
      if (!nameById.has(id)) continue;
      let lost = false;
      if (ev.type === "result") {
        const onWhite = white.includes(id);
        lost = ev.winner === "Blancos" ? !onWhite : onWhite;
      }
      streak.set(id, lost ? 0 : (streak.get(id) ?? 0) + 1);
    }
  }

  // el que más invictos lleva al hilo
  let hotId: string | null = null;
  let hotN = 0;
  for (const [id, n] of streak) {
    if (n > hotN) {
      hotN = n;
      hotId = id;
    }
  }
  if (hotId && hotN >= 3) {
    insights.push({
      tag: "En racha",
      title: nameById.get(hotId)!,
      desc: `${hotN} partidos invicto al hilo. ¡Imparable!`,
    });
  }

  // jugadores a 1 de "3 invicto"
  for (const [id, n] of streak) {
    if (n === 2 && id !== hotId) {
      insights.push({
        tag: "Cerca",
        title: nameById.get(id)!,
        desc: "A 1 partido de sumar el punto por 3 invicto.",
      });
      break;
    }
  }

  return insights;
}
