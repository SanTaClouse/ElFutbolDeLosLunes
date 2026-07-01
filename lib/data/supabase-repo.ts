import { GameEvent, Player } from "../types";
import { todayISO } from "../format";
import { getSupabase } from "../supabase/client";
import { AddExtraInput, AddResultInput, Repo } from "./repo";

interface EventRow {
  id: string;
  type: "result" | "draw" | "extra";
  occurred_on: string;
  created_at: string;
  winner: "Blancos" | "Negros" | null;
  team_white: string[] | null;
  team_black: string[] | null;
  player_id: string | null;
  reason: string | null;
  reason_label: string | null;
  added_by: string | null;
  delta: number | null;
  removed: boolean | null;
  removed_by: string | null;
  removed_at: string | null;
}

function rowToEvent(r: EventRow): GameEvent {
  return {
    id: r.id,
    type: r.type,
    occurredOn: r.occurred_on,
    createdAt: r.created_at,
    winner: r.winner ?? undefined,
    teamWhite: r.team_white ?? undefined,
    teamBlack: r.team_black ?? undefined,
    playerId: r.player_id ?? undefined,
    reason: r.reason ?? undefined,
    reasonLabel: r.reason_label ?? undefined,
    addedBy: r.added_by ?? undefined,
    delta: r.delta ?? undefined,
    removed: r.removed ?? undefined,
    removedBy: r.removed_by ?? undefined,
    removedAt: r.removed_at ?? undefined,
  };
}

/** Repo real contra Supabase (Postgres). Ver supabase/schema.sql. */
export class SupabaseRepo implements Repo {
  async getPlayers(): Promise<Player[]> {
    const { data, error } = await getSupabase()
      .from("players")
      .select("id, name")
      .order("name");
    if (error) throw error;
    return (data ?? []) as Player[];
  }

  async getEvents(): Promise<GameEvent[]> {
    const { data, error } = await getSupabase()
      .from("events")
      .select("*")
      .order("created_at", { ascending: true });
    if (error) throw error;
    return ((data ?? []) as EventRow[]).map(rowToEvent);
  }

  async addPlayer(name: string): Promise<Player> {
    const clean = name.trim();
    // evita duplicados por nombre (case-insensitive)
    const existing = await getSupabase()
      .from("players")
      .select("id, name")
      .ilike("name", clean)
      .limit(1)
      .maybeSingle();
    if (existing.data) return existing.data as Player;

    const { data, error } = await getSupabase()
      .from("players")
      .insert({ name: clean })
      .select("id, name")
      .single();
    if (error) throw error;
    return data as Player;
  }

  async addResult(input: AddResultInput): Promise<GameEvent> {
    const isDraw = input.outcome === "Empate";
    const { data, error } = await getSupabase()
      .from("events")
      .insert({
        type: isDraw ? "draw" : "result",
        occurred_on: todayISO(),
        winner: isDraw ? null : input.outcome,
        team_white: input.teamWhite,
        team_black: input.teamBlack,
      })
      .select("*")
      .single();
    if (error) throw error;
    return rowToEvent(data as EventRow);
  }

  async addExtra(input: AddExtraInput): Promise<GameEvent> {
    const { data, error } = await getSupabase()
      .from("events")
      .insert({
        type: "extra",
        occurred_on: todayISO(),
        player_id: input.playerId,
        reason: input.reason,
        reason_label: input.reasonLabel,
        added_by: input.addedBy,
        delta: input.delta,
      })
      .select("*")
      .single();
    if (error) throw error;
    return rowToEvent(data as EventRow);
  }

  async removeEvent(id: string, removedBy: string): Promise<void> {
    const { error } = await getSupabase()
      .from("events")
      .update({
        removed: true,
        removed_by: removedBy,
        removed_at: new Date().toISOString(),
      })
      .eq("id", id);
    if (error) throw error;
  }
}
