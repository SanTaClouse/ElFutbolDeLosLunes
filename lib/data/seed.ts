import { GameEvent, Player, REASONS } from "../types";

/** Roster inicial del grupo. Cambialo por los nombres reales. */
const ROSTER = [
  "Nacho",
  "Juanma",
  "Santi",
  "Mateo",
  "Fede",
  "Martin",
  "Chiva",
  "Mauro",
  "Vale",
  "Juani",
  "Franco",
  "Joa",
  "Mati",
  "Lea",
  "Joaquín",
];

function slug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

export const seedPlayers: Player[] = ROSTER.map((n) => ({
  id: slug(n),
  name: n,
}));

const idByName = new Map(seedPlayers.map((p) => [p.name, p.id]));
const ids = (names: string[]) => names.map((n) => idByName.get(n)!);

interface MatchSpec {
  date: string;
  winner: "Blancos" | "Negros" | "Empate";
  white: string[];
  black: string[];
}

// Partidos de los últimos lunes. Nacho + Juanma aparecen mucho juntos y
// ganando: la app lo detecta solo como "Dupla letal".
const MATCHES: MatchSpec[] = [
  { date: "2026-04-13", winner: "Blancos", white: ["Nacho", "Juanma", "Fede", "Vale", "Joa"], black: ["Santi", "Mateo", "Martin", "Chiva", "Mauro"] },
  { date: "2026-04-20", winner: "Negros", white: ["Santi", "Juani", "Franco", "Mati", "Lea"], black: ["Nacho", "Juanma", "Mateo", "Chiva", "Vale"] },
  { date: "2026-04-27", winner: "Blancos", white: ["Nacho", "Juanma", "Martin", "Mauro", "Joaquín"], black: ["Santi", "Fede", "Vale", "Juani", "Joa"] },
  { date: "2026-05-04", winner: "Empate", white: ["Nacho", "Juanma", "Santi", "Chiva", "Lea"], black: ["Mateo", "Fede", "Vale", "Franco", "Mati"] },
  { date: "2026-05-11", winner: "Blancos", white: ["Nacho", "Juanma", "Santi", "Joa", "Mati"], black: ["Mateo", "Fede", "Martin", "Mauro", "Vale"] },
  { date: "2026-05-18", winner: "Negros", white: ["Fede", "Chiva", "Juani", "Franco", "Lea"], black: ["Nacho", "Juanma", "Mateo", "Martin", "Joaquín"] },
  { date: "2026-05-25", winner: "Blancos", white: ["Santi", "Mateo", "Vale", "Mauro", "Joa"], black: ["Fede", "Martin", "Chiva", "Juani", "Mati"] },
  { date: "2026-06-01", winner: "Blancos", white: ["Nacho", "Juanma", "Vale", "Franco", "Lea"], black: ["Santi", "Mateo", "Fede", "Mauro", "Joaquín"] },
  { date: "2026-06-08", winner: "Negros", white: ["Nacho", "Mateo", "Chiva", "Juani", "Joa"], black: ["Juanma", "Santi", "Martin", "Mauro", "Mati"] },
  { date: "2026-06-15", winner: "Blancos", white: ["Nacho", "Juanma", "Fede", "Chiva", "Joaquín"], black: ["Santi", "Mateo", "Vale", "Franco", "Lea"] },
  { date: "2026-06-22", winner: "Negros", white: ["Fede", "Martin", "Mauro", "Juani", "Mati"], black: ["Nacho", "Juanma", "Santi", "Vale", "Joa"] },
  { date: "2026-06-29", winner: "Blancos", white: ["Nacho", "Mateo", "Fede", "Chiva", "Lea"], black: ["Juanma", "Santi", "Martin", "Vale", "Joaquín"] },
];

interface ExtraSpec {
  date: string;
  by: string;
  player: string;
  reason: string;
}

const EXTRAS: ExtraSpec[] = [
  { date: "2026-06-29", by: "Santi", player: "Nacho", reason: "cabeza" },
  { date: "2026-06-22", by: "Mateo", player: "Juanma", reason: "lejos" },
  { date: "2026-06-15", by: "Nacho", player: "Santi", reason: "cinco" },
  { date: "2026-06-08", by: "Fede", player: "Martin", reason: "invicto" },
];

export function seedEvents(): GameEvent[] {
  const events: GameEvent[] = [];

  MATCHES.forEach((m, i) => {
    const isDraw = m.winner === "Empate";
    events.push({
      id: `seed-m${i + 1}`,
      type: isDraw ? "draw" : "result",
      occurredOn: m.date,
      createdAt: `${m.date}T20:00:00.000Z`,
      teamWhite: ids(m.white),
      teamBlack: ids(m.black),
      winner: isDraw ? undefined : (m.winner as "Blancos" | "Negros"),
    });
  });

  EXTRAS.forEach((x, i) => {
    const r = REASONS.find((r) => r.id === x.reason)!;
    events.push({
      id: `seed-x${i + 1}`,
      type: "extra",
      occurredOn: x.date,
      createdAt: `${x.date}T20:30:00.000Z`,
      playerId: idByName.get(x.player)!,
      reason: r.id,
      reasonLabel: r.label,
      addedBy: x.by,
      delta: r.pts,
    });
  });

  return events;
}
