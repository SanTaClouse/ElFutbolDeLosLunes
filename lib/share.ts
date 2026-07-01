import { BuilderSlot } from "./balance";
import { Standing } from "./types";

const APP_URL = "futboldeloslunes.vercel.app";

/**
 * Mensaje pre-armado para pegar en el grupo de WhatsApp.
 * Incluye ambos equipos, el puntero actual y el link a la app.
 */
export function buildShareMessage(
  whites: BuilderSlot[],
  blacks: BuilderSlot[],
  leader: Standing | null
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
  msg += `Mirá tus puntos en la app 👉 ${APP_URL}`;
  return msg;
}
