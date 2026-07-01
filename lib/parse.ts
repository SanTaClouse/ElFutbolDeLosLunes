import { Player, Standing } from "./types";

/** Normaliza: minúsculas, sin acentos, solo letras. */
export function norm(s: string): string {
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z]/g, "");
}

const SKIP = /^(lunes|martes|miercoles|jueves|viernes|sabado|domingo|equipos|partido|blancos|negros|hs|hora|horas|lista|anotados)$/;

/**
 * Toma el texto pegado del grupo y devuelve los nombres, en orden.
 * - Ignora el prefijo numérico ("1 nachoo", "2juanma", "3. Martin").
 * - Ignora líneas de header ("Lunes 20hs").
 */
export function parseNames(input: string): string[] {
  const out: string[] = [];
  (input || "").split("\n").forEach((line) => {
    let t = line.trim();
    if (!t) return;
    const hadNum = /^\s*\d+/.test(t);
    // saca prefijo tipo "1", "2.", "3)", "4 -", "5:"
    t = t.replace(/^\s*\d+\s*[.)\-:]?\s*/, "").trim();
    if (!t) return;
    const n = norm(t);
    if (!n) return;
    if (SKIP.test(n)) return;
    // línea sin número que además tiene dígitos sueltos (ej "Lunes 20hs") -> header
    if (!hadNum && /\d/.test(line)) return;
    if (!hadNum && n.length < 3) return;
    out.push(t);
  });
  return out;
}

export interface ResolvedName {
  raw: string;
  name: string;
  playerId: string | null;
  known: boolean;
  standing: Standing | null;
}

/** Capitaliza un nombre libre ("nachoo" -> "Nachoo"). */
function niceName(raw: string): string {
  const t = raw.trim();
  return t.charAt(0).toUpperCase() + t.slice(1).toLowerCase();
}

/**
 * Match difuso de un nombre suelto contra el roster real.
 * "nachoo" -> "Nacho", "juani" -> "Juani". Si no matchea, queda como
 * jugador desconocido con 0 pts (se puede crear después).
 */
export function resolveName(
  raw: string,
  players: Player[],
  standings: Standing[]
): ResolvedName {
  const n = norm(raw);
  const stByPlayer = new Map(standings.map((s) => [s.player.id, s]));

  let match: Player | null = null;
  let best = 0;
  for (const p of players) {
    const pn = norm(p.name);
    if (!pn || !n) continue;
    let score = 0;
    if (pn === n) score = 100;
    else if (pn.startsWith(n) || n.startsWith(pn)) {
      // premia el prefijo compartido más largo
      score = Math.min(pn.length, n.length);
    }
    if (score > best) {
      best = score;
      match = p;
    }
  }

  // umbral: al menos 3 letras compartidas para evitar falsos positivos
  if (match && best >= 3) {
    return {
      raw,
      name: match.name,
      playerId: match.id,
      known: true,
      standing: stByPlayer.get(match.id) ?? null,
    };
  }

  return {
    raw,
    name: niceName(raw),
    playerId: null,
    known: false,
    standing: null,
  };
}

/** Parsea y resuelve el mensaje entero, tomando los primeros `max`. */
export function parseRoster(
  input: string,
  players: Player[],
  standings: Standing[],
  max = 10
): ResolvedName[] {
  return parseNames(input)
    .slice(0, max)
    .map((raw) => resolveName(raw, players, standings));
}
