export type TeamSide = "Blancos" | "Negros";
export type MatchOutcome = TeamSide | "Empate";

export interface Player {
  id: string;
  name: string;
}

export type EventType = "result" | "draw" | "extra" | "lineup";

/**
 * Un evento es la unidad de verdad. La tabla de posiciones se reconstruye
 * sumando eventos, así borrar un evento revierte sus puntos sin cálculos aparte.
 *
 * - result: partido con ganador. Guarda ambos equipos (para contar PJ de todos)
 *   y el equipo ganador (para contar G).
 * - draw:   empate. Guarda ambos equipos; +1 a los 10.
 * - extra:  punto extra manual a un jugador, con motivo y autor (trazabilidad).
 * - lineup: equipos confirmados para el próximo partido. No suma puntos; el
 *   último no quitado (posterior al último partido) es la formación vigente.
 */
export interface GameEvent {
  id: string;
  type: EventType;
  occurredOn: string; // yyyy-mm-dd
  createdAt: string; // ISO timestamp

  // result | draw
  teamWhite?: string[]; // player ids (blancos)
  teamBlack?: string[]; // player ids (negros)
  winner?: TeamSide; // solo en result

  // extra
  playerId?: string;
  reason?: string; // id del motivo
  reasonLabel?: string;
  addedBy?: string; // nombre de quien lo cargó
  delta?: number; // puntos otorgados por el evento extra

  // trazabilidad de bajas (soft-delete): el movimiento no suma más puntos,
  // pero queda registrado quién lo quitó y cuándo.
  removed?: boolean;
  removedBy?: string;
  removedAt?: string;
}

export interface Standing {
  player: Player;
  pj: number; // partidos jugados
  g: number; // ganados
  e: number; // empatados
  p: number; // perdidos
  extra: number; // puntos extra
  pts: number; // total = g*3 + e + extra
}

export interface ExtraReason {
  id: string;
  label: string;
  icon: string;
  pts: number;
}

/** Catálogo de puntos extra. Extensible: agregá motivos acá. */
export const REASONS: ExtraReason[] = [
  { id: "cabeza", label: "Gol de cabeza", icon: "🎯", pts: 1 },
  { id: "lejos", label: "Gol de atrás de mitad de cancha", icon: "🚀", pts: 1 },
  { id: "cinco", label: "5+ goles en un partido", icon: "🔥", pts: 1 },
  { id: "invicto", label: "3 partidos invicto", icon: "🛡️", pts: 1 },
];

export const POINTS_WIN = 3;
export const POINTS_DRAW = 1;
