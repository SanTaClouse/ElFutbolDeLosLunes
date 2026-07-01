import { isSupabaseConfigured } from "../supabase/client";
import { MockRepo } from "./mock";
import { Repo } from "./repo";
import { SupabaseRepo } from "./supabase-repo";

let repo: Repo | null = null;

/**
 * Devuelve el repo activo. Si hay credenciales de Supabase usa Postgres;
 * si no, cae al mock con localStorage (la app corre igual).
 */
export function getRepo(): Repo {
  if (!repo) {
    repo = isSupabaseConfigured ? new SupabaseRepo() : new MockRepo();
  }
  return repo;
}

export const usingSupabase = isSupabaseConfigured;

export type { Repo } from "./repo";
export type { AddResultInput, AddExtraInput } from "./repo";
