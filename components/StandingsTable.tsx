"use client";

import { Standing } from "@/lib/types";
import { Avatar } from "./Avatar";

const MEDAL = [
  { bg: "#F6C650", fg: "#6B4E00" }, // oro
  { bg: "#CDD4DC", fg: "#454B52" }, // plata
  { bg: "#E4A972", fg: "#5A3410" }, // bronce
];

function RankBadge({ rank }: { rank: number }) {
  if (rank < 3) {
    const c = MEDAL[rank];
    return (
      <span
        className="tabular flex h-[26px] w-[26px] items-center justify-center rounded-full font-display text-[13px] font-bold shadow-[0_2px_5px_-2px_rgba(0,0,0,.45)]"
        style={{ background: c.bg, color: c.fg }}
      >
        {rank + 1}
      </span>
    );
  }
  return (
    <span className="tabular flex w-[26px] justify-center font-display text-[13px] font-bold text-faint">
      {rank + 1}
    </span>
  );
}

function barColor(rank: number, isMe: boolean): string {
  if (isMe) return "#12A150";
  if (rank === 0) return "#F6C650";
  if (rank === 1) return "#CDD4DC";
  if (rank === 2) return "#E4A972";
  return "#CDE8D6";
}

export function StandingsTable({
  standings,
  me,
}: {
  standings: Standing[];
  me: string | null;
}) {
  const maxPts = Math.max(1, standings[0]?.pts ?? 1);

  return (
    <div className="overflow-hidden rounded-[20px] border border-line bg-white shadow-card">
      {/* encabezado de columnas */}
      <div className="flex items-center gap-3 border-b border-line2 bg-[#FBFCFA] px-3.5 py-2 text-[10.5px] font-bold uppercase tracking-[.5px] text-faint">
        <span className="w-[26px] text-center">#</span>
        <span className="flex-1">Jugador</span>
        <span className="w-[28px] text-right">PJ</span>
        <span className="w-[40px] text-right">Pts</span>
      </div>

      {standings.map((s, i) => {
        const isMe = s.player.name === me;
        const pct = Math.max(6, Math.round((s.pts / maxPts) * 100));
        return (
          <div
            key={s.player.id}
            className="relative flex animate-up items-center gap-3 border-t border-line2 px-3.5 py-2.5 first:border-t-0"
            style={{
              animationDelay: `${Math.min(i, 12) * 28}ms`,
              background: isMe ? "#F1FAF3" : undefined,
            }}
          >
            <RankBadge rank={i} />
            <Avatar
              name={s.player.name}
              size={34}
              className={isMe ? "bg-brand text-white" : "bg-avatarbg text-brand"}
            />
            <div className="min-w-0 flex-1">
              <div className="overflow-hidden text-ellipsis whitespace-nowrap text-[14.5px] font-bold text-ink">
                {s.player.name}
                {isMe && <span className="font-semibold text-faint"> · vos</span>}
              </div>
              <div className="mt-[3px] text-[11px] font-semibold text-faint">
                <span className="text-brand">{s.g}G</span> · {s.e}E · {s.p}P
              </div>
            </div>
            <span className="tabular w-[28px] text-right text-[11px] font-bold text-faint">
              {s.pj}
            </span>
            <span
              className="tabular w-[40px] text-right font-display text-[18px] font-bold"
              style={{ color: i === 0 ? "#0C7C3D" : "#10160F" }}
            >
              {s.pts}
            </span>

            {/* barra de progreso relativa al líder */}
            <span
              className="pointer-events-none absolute bottom-0 left-0 h-[2.5px] rounded-r-full"
              style={{
                width: `${pct}%`,
                background: barColor(i, isMe),
                opacity: 0.55,
              }}
            />
          </div>
        );
      })}

      {standings.length === 0 && (
        <div className="px-4 py-10 text-center text-[13px] text-faint">
          Todavía no hay jugadores. Sumá el primer partido.
        </div>
      )}
    </div>
  );
}
