"use client";

import { useEffect, useState } from "react";
import { Standing } from "@/lib/types";
import { initial } from "@/lib/format";

function useCountUp(target: number, duration = 850) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return v;
}

const PEDESTAL_H = [78, 56, 42]; // por ranking (1°, 2°, 3°)
const AVATAR = [66, 52, 50];
const MEDALS = ["👑", "🥈", "🥉"];

export function Podium({
  top,
  me,
}: {
  top: Standing[];
  me: string | null;
}) {
  // orden visual: 2° · 1° · 3°  (el 1° al centro y más alto)
  const order =
    top.length >= 3
      ? [1, 0, 2]
      : top.length === 2
      ? [1, 0]
      : [0];

  return (
    <div className="relative mb-3.5 overflow-hidden rounded-[26px] bg-gradient-to-br from-brand via-brand2 to-brand2 px-3 pt-5 shadow-podium">
      {/* brillo superior */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_-10%,rgba(255,255,255,.20),transparent_70%)]" />
      {/* barrido de luz (una vez) */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 animate-shine bg-gradient-to-r from-transparent via-white/25 to-transparent" />

      <div className="relative flex items-end justify-center gap-2">
        {order.map((rank, displayIdx) => {
          const s = top[rank];
          if (!s) return null;
          return (
            <PodiumColumn
              key={s.player.id}
              standing={s}
              rank={rank}
              delay={displayIdx * 90}
              isMe={s.player.name === me}
            />
          );
        })}
      </div>
    </div>
  );
}

function PodiumColumn({
  standing,
  rank,
  delay,
  isMe,
}: {
  standing: Standing;
  rank: number;
  delay: number;
  isMe: boolean;
}) {
  const pts = useCountUp(standing.pts);
  const first = rank === 0;
  const size = AVATAR[rank];

  return (
    <div
      className="flex flex-1 animate-podium-rise flex-col items-center"
      style={{ animationDelay: `${delay}ms`, maxWidth: 118 }}
    >
      {/* corona / medalla */}
      <div
        className={`text-lg ${first ? "animate-float" : ""}`}
        style={{ filter: "drop-shadow(0 2px 3px rgba(0,0,0,.25))" }}
      >
        {MEDALS[rank]}
      </div>

      {/* avatar */}
      <span
        className={`animate-pop flex items-center justify-center rounded-full bg-white/95 font-extrabold text-brand2 shadow-[0_6px_14px_-6px_rgba(0,0,0,.5)] ${
          first ? "ring-2 ring-white/70 animate-glow" : ""
        } ${isMe ? "outline outline-2 outline-offset-2 outline-lightgreen" : ""}`}
        style={{
          width: size,
          height: size,
          fontSize: size * 0.4,
          animationDelay: `${delay + 60}ms`,
          marginTop: 6,
        }}
      >
        {initial(standing.player.name)}
      </span>

      {/* nombre */}
      <div className="mt-2 max-w-full overflow-hidden text-ellipsis whitespace-nowrap px-1 text-[13.5px] font-bold text-white">
        {standing.player.name}
      </div>

      {/* puntos */}
      <div className="tabular mt-1 rounded-full bg-white/15 px-2.5 py-0.5 font-display text-[13px] font-bold text-lightgreen">
        {pts} pts
      </div>

      {/* pedestal */}
      <div
        className="mt-2.5 flex w-full origin-bottom animate-pedestal-grow justify-center rounded-t-xl border-t border-white/25 bg-gradient-to-b from-white/[.18] to-white/[.03]"
        style={{ height: PEDESTAL_H[rank], animationDelay: `${delay + 120}ms` }}
      >
        <span className="mt-1.5 font-display text-[17px] font-bold text-white/80">
          {rank + 1}
        </span>
      </div>
    </div>
  );
}
