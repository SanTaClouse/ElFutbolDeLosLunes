import { GameEvent, Player } from "../types";
import { todayISO } from "../format";
import {
  AddExtraInput,
  AddResultInput,
  Repo,
  newId,
} from "./repo";
import { seedEvents, seedPlayers } from "./seed";

const STORAGE_KEY = "flu:data:v1";

interface Store {
  players: Player[];
  events: GameEvent[];
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
        if (raw) return JSON.parse(raw) as Store;
      } catch {
        /* ignora storage corrupto */
      }
    }
    const seeded: Store = { players: seedPlayers, events: seedEvents() };
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

  async removeEvent(id: string): Promise<void> {
    this.store.events = this.store.events.filter((e) => e.id !== id);
    this.save();
  }
}
