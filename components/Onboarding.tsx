"use client";

import { useState } from "react";
import { useApp } from "./store";
import { BallLogo, IconPlus } from "./Icons";
import { initial } from "@/lib/format";

export function Onboarding() {
  const { players, pick, createAndPick } = useApp();
  const roster = [...players].sort((a, b) => a.name.localeCompare(b.name));

  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    const clean = name.trim();
    if (!clean || busy) return;
    setBusy(true);
    await createAndPick(clean);
    setBusy(false);
  };

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

      <div className="flex-shrink-0 pt-3.5">
        {adding ? (
          <div className="animate-up">
            <div className="flex gap-2">
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                placeholder="Tu nombre…"
                maxLength={20}
                className="flex-1 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-[15px] font-semibold text-white outline-none placeholder:text-white/50 focus:border-white/40"
              />
              <button
                onClick={submit}
                disabled={!name.trim() || busy}
                className="rounded-2xl bg-white px-5 py-3 text-[15px] font-extrabold text-brand2 disabled:opacity-50"
              >
                Entrar
              </button>
            </div>
            <button
              onClick={() => setAdding(false)}
              className="mt-2 w-full text-center text-[12.5px] font-semibold text-white/50"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={() => setAdding(true)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-white/30 bg-white/[.06] py-3 text-[14px] font-bold text-white transition hover:bg-white/10"
            >
              <IconPlus size={16} />
              Mi nombre no está
            </button>
            <div className="mt-2.5 text-center text-[12.5px] text-white/50">
              No tenés que crear cuenta. Tu nombre es tu acceso.
            </div>
          </>
        )}
      </div>
    </div>
  );
}
