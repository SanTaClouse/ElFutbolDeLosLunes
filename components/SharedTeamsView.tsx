"use client";

import { useApp } from "./store";
import { BallLogo } from "./Icons";

export function SharedTeamsView() {
  const { sharedTeams, dismissShared } = useApp();
  if (!sharedTeams) return null;

  const { w, b, l, lp } = sharedTeams;

  return (
    <div className="no-scrollbar flex h-full flex-col overflow-y-auto bg-gradient-to-b from-brand via-brand2 to-brand3 px-6 pb-8 pt-14 text-white">
      <div className="flex-shrink-0 animate-up text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[20px] border border-white/20 bg-white/10">
          <BallLogo size={38} />
        </div>
        <div className="font-display text-[13px] font-semibold uppercase tracking-[2px] text-lightgreen">
          Fútbol de los lunes
        </div>
        <div className="mt-1 font-display text-[26px] font-bold leading-tight">
          Equipos del partido
        </div>
        <div className="mt-1 text-[13px] text-white/70">Lunes 20hs</div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-2.5">
        <TeamCol title="Blancos" names={w} dark={false} />
        <TeamCol title="Negros" names={b} dark />
      </div>

      {l && (
        <div className="mt-5 rounded-2xl border border-white/15 bg-white/10 px-4 py-3.5 text-center">
          <span className="font-bold">{l}</span> está puntero
          {typeof lp === "number" ? (
            <>
              {" "}
              con <span className="font-bold">{lp} puntos</span> 🏆
            </>
          ) : (
            " 🏆"
          )}
        </div>
      )}

      <div className="flex-1" />

      <button
        onClick={dismissShared}
        className="mt-6 w-full flex-shrink-0 rounded-2xl bg-white py-3.5 text-[15px] font-extrabold text-brand2"
      >
        Ver la tabla y mis puntos
      </button>
    </div>
  );
}

function TeamCol({
  title,
  names,
  dark,
}: {
  title: string;
  names: string[];
  dark: boolean;
}) {
  return (
    <div
      className={`overflow-hidden rounded-[18px] border ${
        dark ? "border-white/10 bg-black/25" : "border-white/20 bg-white/10"
      }`}
    >
      <div className="flex items-center gap-2 border-b border-white/15 px-3.5 py-2.5 text-sm font-extrabold">
        <span
          className="h-3.5 w-3.5 rounded-full border-2"
          style={
            dark
              ? { background: "#17201A", borderColor: "#fff" }
              : { background: "#fff", borderColor: "#10160F" }
          }
        />
        {title}
      </div>
      <div className="flex flex-col">
        {names.map((n, i) => (
          <div
            key={i}
            className="flex items-center gap-2 border-t border-white/[.08] px-3.5 py-2.5 text-sm font-semibold first:border-t-0"
          >
            <span className="w-3 font-display text-xs font-bold text-white/50">
              {i + 1}
            </span>
            <span className="overflow-hidden text-ellipsis whitespace-nowrap">
              {n}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
