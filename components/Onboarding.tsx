"use client";

import { useState } from "react";
import Image from "next/image";
import { useApp } from "./store";
import { IconPlus } from "./Icons";
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
    <div className="relative flex h-full flex-col overflow-hidden bg-gradient-to-b from-brand via-brand2 to-brand3 text-white">
      {/* --- capa decorativa --- */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-28 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-20 h-72 w-72 rounded-full bg-lightgreen/10 blur-3xl" />
        {/* guiño a la cancha: círculo central */}
        <div className="absolute left-1/2 top-[112px] h-64 w-64 -translate-x-1/2 rounded-full border border-white/[.07]" />
        <div className="absolute inset-x-0 top-[244px] h-px bg-white/[.06]" />
      </div>

      {/* --- contenido --- */}
      <div className="relative flex h-full flex-col px-7 pb-8 pt-14">
        <div className="flex-shrink-0 animate-up text-center">
          <div className="relative mx-auto w-fit">
            <div className="absolute inset-0 -z-10 rounded-full bg-white/10 blur-2xl" />
            <Image
              src="/logo-white-transparent.svg"
              alt="El Fútbol de los Lunes"
              width={300}
              height={163}
              priority
              unoptimized
              className="mx-auto h-auto w-[276px] drop-shadow-[0_10px_30px_rgba(0,0,0,.28)]"
            />
          </div>
          <div className="mt-6 text-[19px] font-extrabold tracking-tight text-white">
            Elegí tu nombre
          </div>
          <div className="mx-auto mt-1 max-w-[280px] text-[13px] leading-snug text-white/60">
            Tocá tu nombre para entrar. No hace falta crear cuenta.
          </div>
        </div>

        <div className="mb-2 mt-7 flex flex-shrink-0 items-center justify-between px-0.5">
          <span className="text-[11px] font-bold uppercase tracking-[2px] text-lightgreen">
            Jugadores
          </span>
          <span className="text-[11px] font-semibold text-white/45">
            {roster.length}
          </span>
        </div>

        <div className="no-scrollbar -mx-1 flex-1 overflow-y-auto px-1">
          <div className="grid grid-cols-2 gap-2.5 pb-2">
            {roster.map((p, i) => (
              <button
                key={p.id}
                onClick={() => pick(p.name)}
                style={{ animationDelay: `${Math.min(i, 14) * 35}ms` }}
                className="group flex animate-up items-center gap-3 rounded-2xl border border-white/15 bg-white/[.08] p-2.5 pr-3 text-left backdrop-blur-sm transition-all duration-200 hover:border-white/35 hover:bg-white/[.16] active:scale-[.97]"
              >
                <span className="flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-full bg-white/90 text-[15px] font-extrabold text-brand2 ring-2 ring-white/20 transition-transform duration-200 group-hover:scale-105">
                  {initial(p.name)}
                </span>
                <span className="overflow-hidden text-ellipsis whitespace-nowrap text-[15px] font-semibold">
                  {p.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-shrink-0 pt-4">
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
                  className="flex-1 rounded-2xl border border-white/25 bg-white/10 px-4 py-3 text-[15px] font-semibold text-white outline-none backdrop-blur-sm placeholder:text-white/50 focus:border-white/50"
                />
                <button
                  onClick={submit}
                  disabled={!name.trim() || busy}
                  className="rounded-2xl bg-white px-5 py-3 text-[15px] font-extrabold text-brand2 transition active:scale-95 disabled:opacity-50"
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
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-white/30 bg-white/[.06] py-3 text-[14px] font-bold text-white transition hover:bg-white/10 active:scale-[.98]"
              >
                <IconPlus size={16} />
                Mi nombre no está
              </button>
              <div className="mt-3 text-center text-[12px] text-white/45">
                Tu nombre es tu acceso · sin contraseñas
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
