"use client";

import { useApp } from "./store";
import { BallLogo } from "./Icons";
import { initial } from "@/lib/format";

export function Onboarding() {
  const { players, pick } = useApp();
  const roster = [...players].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-brand via-brand2 to-brand3 px-7 pb-8 pt-16 text-white">
      <div className="flex-shrink-0 animate-up text-center">
        <div className="mx-auto mb-[22px] flex h-24 w-24 items-center justify-center rounded-[28px] border border-white/20 bg-white/10 backdrop-blur">
          <BallLogo size={56} />
        </div>
        <div className="font-display text-[15px] font-semibold uppercase tracking-[3px] text-lightgreen">
          Fútbol de los
        </div>
        <div className="mt-0.5 font-display text-[52px] font-bold leading-[.95]">
          Lunes
        </div>
        <div className="mt-3.5 text-[15px] font-medium text-white/70">
          Elegí tu nombre para entrar
        </div>
      </div>

      <div className="no-scrollbar mt-[26px] flex-1 animate-up-slow overflow-y-auto">
        <div className="grid grid-cols-2 gap-2.5">
          {roster.map((p) => (
            <button
              key={p.id}
              onClick={() => pick(p.name)}
              className="flex items-center gap-[11px] rounded-2xl border border-white/[.16] bg-white/10 p-3 text-left text-[15px] font-semibold text-white transition hover:bg-white/20"
            >
              <span className="flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-full bg-white/90 text-sm font-extrabold text-brand2">
                {initial(p.name)}
              </span>
              <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                {p.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-shrink-0 pt-3.5 text-center text-[12.5px] text-white/50">
        No tenés que crear cuenta. Tu nombre es tu acceso.
      </div>
    </div>
  );
}
