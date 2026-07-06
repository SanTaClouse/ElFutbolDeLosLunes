import { GameEvent, Player, TeamSide } from "../types";
import { SharedTeams } from "../share";

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

export interface AddLineupInput {
  teamWhite: string[]; // player ids
  teamBlack: string[]; // player ids
  addedBy: string;
}

/** Contrato de persistencia. Lo cumplen el mock (localStorage) y Supabase. */
export interface Repo {
  getPlayers(): Promise<Player[]>;
  getEvents(): Promise<GameEvent[]>;
  addPlayer(name: string): Promise<Player>;
  addResult(input: AddResultInput): Promise<GameEvent>;
  addExtra(input: AddExtraInput): Promise<GameEvent>;
  /** Confirma los equipos armados para que todo el grupo vea la misma formación. */
  addLineup(input: AddLineupInput): Promise<GameEvent>;
  /** Baja lógica: marca el evento como quitado y guarda quién lo hizo. */
  removeEvent(id: string, removedBy: string): Promise<void>;

  /** Guarda una mezcla de equipos y devuelve un código corto para el link. */
  createShare(teams: SharedTeams): Promise<string>;
  /** Recupera los equipos compartidos por su código corto. */
  getShare(code: string): Promise<SharedTeams | null>;
}

/** Código corto legible para el link compartido (sin caracteres ambiguos). */
export function shortCode(len = 7): string {
  const alphabet = "23456789abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";
  let out = "";
  const arr = new Uint32Array(len);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(arr);
  }
  for (let i = 0; i < len; i++) {
    const n = arr[i] || Math.floor(Math.random() * 1e9);
    out += alphabet[n % alphabet.length];
  }
  return out;
}

export function newId(prefix = "id"): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
