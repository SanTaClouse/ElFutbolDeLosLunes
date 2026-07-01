import { BuilderSlot } from "./balance";
import { Standing } from "./types";

export const APP_URL = "https://futboldeloslunes.vercel.app";

export interface SharedTeams {
  w: string[]; // nombres blancos
  b: string[]; // nombres negros
  l?: string; // puntero (nombre)
  lp?: number; // puntos del puntero
}

/** Codifica los equipos en un string apto para la URL (base64 url-safe). */
export function encodeTeams(
  whites: BuilderSlot[],
  blacks: BuilderSlot[],
  leader: Standing | null
): string {
  const payload: SharedTeams = {
    w: whites.map((s) => s.name),
    b: blacks.map((s) => s.name),
    l: leader?.player.name,
    lp: leader?.pts,
  };
  const json = encodeURIComponent(JSON.stringify(payload));
  const b64 = typeof btoa !== "undefined" ? btoa(json) : json;
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** Decodifica el parámetro `t` de la URL a los equipos compartidos. */
export function decodeTeams(param: string): SharedTeams | null {
  try {
    const b64 = param.replace(/-/g, "+").replace(/_/g, "/");
    const json = typeof atob !== "undefined" ? atob(b64) : b64;
    const parsed = JSON.parse(decodeURIComponent(json)) as SharedTeams;
    if (!Array.isArray(parsed.w) || !Array.isArray(parsed.b)) return null;
    return parsed;
  } catch {
    return null;
  }
}

/** URL para ver los equipos armados (la abren los demás desde el grupo). */
export function buildShareUrl(
  whites: BuilderSlot[],
  blacks: BuilderSlot[],
  leader: Standing | null,
  origin?: string
): string {
  const base =
    origin ||
    (typeof window !== "undefined" ? window.location.origin : APP_URL);
  return `${base}/?t=${encodeTeams(whites, blacks, leader)}`;
}

/**
 * Mensaje pre-armado para pegar en el grupo de WhatsApp.
 * Incluye ambos equipos, el puntero actual y el link a los equipos.
 */
export function buildShareMessage(
  whites: BuilderSlot[],
  blacks: BuilderSlot[],
  leader: Standing | null,
  url: string
): string {
  const line = (arr: BuilderSlot[]) =>
    Array.from({ length: Math.max(arr.length, 0) })
      .map((_, i) => `${i + 1}. ${arr[i] ? arr[i].name : "—"}`)
      .join("\n");

  let msg = "⚽ Equipos del partido — Lunes 20hs\n\n";
  msg += "⚪ Blancos:\n" + line(whites) + "\n\n";
  msg += "⚫ Negros:\n" + line(blacks) + "\n\n";
  if (leader) {
    msg += `${leader.player.name} está puntero con ${leader.pts} puntos 🏆\n`;
  }
  msg += `Mirá los equipos y tus puntos 👉 ${url}`;
  return msg;
}
