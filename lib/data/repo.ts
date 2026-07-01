import { GameEvent, Player, TeamSide } from "../types";

export interface AddResultInput {
  outcome: TeamSide | "Empate";
  teamWhite: string[]; // player ids
  teamBlack: string[]; // player ids
}

export interface AddExtraInput {
  playerId: string;
  reason: string;
  reasonLabel: string;
  addedBy: string;
  delta: number;
}

/** Contrato de persistencia. Lo cumplen el mock (localStorage) y Supabase. */
export interface Repo {
  getPlayers(): Promise<Player[]>;
  getEvents(): Promise<GameEvent[]>;
  addPlayer(name: string): Promise<Player>;
  addResult(input: AddResultInput): Promise<GameEvent>;
  addExtra(input: AddExtraInput): Promise<GameEvent>;
  /** Baja lógica: marca el evento como quitado y guarda quién lo hizo. */
  removeEvent(id: string, removedBy: string): Promise<void>;
}

export function newId(prefix = "id"): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
