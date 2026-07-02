import { GameEvent, Player } from "../types";
import { SharedTeams } from "../share";
import { todayISO } from "../format";
import {
  AddExtraInput,
  AddResultInput,
  Repo,
  newId,
  shortCode,
} from "./repo";
import { seedEvents, seedPlayers } from "./seed";

const STORAGE_KEY = "flu:data:v1";

interface Store {
  players: Player[];
  events: GameEvent[];
  shares: Record<string, SharedTeams>;
}

/**
 * Repo en memoria + localStorage. Corre sin backend: ideal para desarrollo,
 * demo o uso en un solo dispositivo. Persiste entre recargas del navegador.
 */
export class MockRepo implements Repo {
  private store: Store;

  constructor() {
    this.store = this.load();
  }

  private load(): Store {
    if (typeof window !== "undefined") {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as Partial<Store>;
          return {
            players: parsed.players ?? [],
            events: parsed.events ?? [],
            shares: parsed.shares ?? {},
          };
        }
      } catch {
        /* ignora storage corrupto */
      }
    }
    // Los datos de ejemplo (partidos/puntos falsos) solo se cargan en
    // desarrollo. En producción sin Supabase, el mock arranca vacío para no
    // mostrar data falsa. Lo real vive en Supabase.
    const isDev = process.env.NODE_ENV === "development";
    const seeded: Store = isDev
      ? { players: seedPlayers, events: seedEvents(), shares: {} }
      : { players: [], events: [], shares: {} };
    this.persist(seeded);
    return seeded;
  }

  private persist(store: Store) {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
      } catch {
        /* storage lleno / no disponible */
      }
    }
  }

  private save() {
    this.persist(this.store);
  }

  async getPlayers(): Promise<Player[]> {
    return [...this.store.players];
  }

  async getEvents(): Promise<GameEvent[]> {
    return [...this.store.events];
  }

  async addPlayer(name: string): Promise<Player> {
    const existing = this.store.players.find(
      (p) => p.name.toLowerCase() === name.trim().toLowerCase()
    );
    if (existing) return existing;
    const player: Player = { id: newId("p"), name: name.trim() };
    this.store.players.push(player);
    this.save();
    return player;
  }

  async addResult(input: AddResultInput): Promise<GameEvent> {
    const isDraw = input.outcome === "Empate";
    const event: GameEvent = {
      id: newId("m"),
      type: isDraw ? "draw" : "result",
      occurredOn: todayISO(),
      createdAt: new Date().toISOString(),
      teamWhite: input.teamWhite,
      teamBlack: input.teamBlack,
      winner: isDraw ? undefined : (input.outcome as "Blancos" | "Negros"),
    };
    this.store.events.push(event);
    this.save();
    return event;
  }

  async addExtra(input: AddExtraInput): Promise<GameEvent> {
    const event: GameEvent = {
      id: newId("x"),
      type: "extra",
      occurredOn: todayISO(),
      createdAt: new Date().toISOString(),
      playerId: input.playerId,
      reason: input.reason,
      reasonLabel: input.reasonLabel,
      addedBy: input.addedBy,
      delta: input.delta,
    };
    this.store.events.push(event);
    this.save();
    return event;
  }

  async removeEvent(id: string, removedBy: string): Promise<void> {
    this.store.events = this.store.events.map((e) =>
      e.id === id
        ? {
            ...e,
            removed: true,
            removedBy,
            removedAt: new Date().toISOString(),
          }
        : e
    );
    this.save();
  }

  async createShare(teams: SharedTeams): Promise<string> {
    const code = shortCode();
    this.store.shares[code] = teams;
    this.save();
    return code;
  }

  async getShare(code: string): Promise<SharedTeams | null> {
    return this.store.shares[code] ?? null;
  }
}
