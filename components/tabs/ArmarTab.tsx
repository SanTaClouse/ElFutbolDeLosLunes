"use client";

import { useApp } from "../store";
import { IconShuffle, IconShare } from "../Icons";
import { BuilderSlot } from "@/lib/balance";

export function ArmarTab() {
  const {
    builderInput,
    setBuilderInput,
    doParse,
    teamsReady,
    whites,
    blacks,
    whitesPts,
    blacksPts,
    diffPoints,
    selected,
    tapPlayer,
    openShare,
  } = useApp();

  return (
    <div>
      <div className="mx-0.5 mb-2 mt-0.5 text-[13px] font-semibold text-muted">
        Pegá la lista del grupo y la app arma dos equipos parejos.
      </div>
      <textarea
        value={builderInput}
        onChange={(e) => setBuilderInput(e.target.value)}
        placeholder="Pegá el mensaje de WhatsApp…"
        className="h-[118px] w-full resize-none rounded-2xl border border-line bg-white px-3.5 py-3 text-[13.5px] leading-[1.5] text-ink outline-none focus:border-primary"
      />
      <div className="mt-2.5 flex gap-[9px]">
        <button
          onClick={() => doParse(false)}
          className="flex-1 rounded-2xl bg-brand py-3.5 text-[14.5px] font-extrabold text-white shadow-btn transition hover:bg-brand2"
        >
          Armar equipos
        </button>
        <button
          onClick={() => doParse(true)}
          className="flex flex-shrink-0 items-center gap-[7px] rounded-2xl border border-line bg-white px-4 py-3.5 text-sm font-bold text-ink transition hover:bg-appbg"
        >
          <IconShuffle size={16} />
          Otra
        </button>
      </div>

      {teamsReady && (
        <div className="mt-4 animate-up">
          <div className="mb-2.5 text-center text-xs font-bold text-faint">
            Tocá un jugador de cada equipo para intercambiarlos
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <TeamCard
              variant="white"
              title="Blancos"
              pts={whitesPts}
              slots={whites}
              selectedIdx={selected?.team === "w" ? selected.idx : null}
              onTap={(i) => tapPlayer("w", i)}
            />
            <TeamCard
              variant="black"
              title="Negros"
              pts={blacksPts}
              slots={blacks}
              selectedIdx={selected?.team === "b" ? selected.idx : null}
              onTap={(i) => tapPlayer("b", i)}
            />
          </div>
          <div className="mt-[9px] text-center text-xs font-semibold text-faint">
            Diferencia de puntos: <b className="text-ink">{diffPoints}</b> · lo
            más parejo posible
          </div>
          <button
            onClick={openShare}
            className="mt-3 flex w-full items-center justify-center gap-[9px] rounded-2xl bg-primary py-3.5 text-[14.5px] font-extrabold text-white shadow-btn2 transition hover:bg-primary-dark"
          >
            <IconShare size={18} />
            Compartir en el grupo
          </button>
        </div>
      )}
    </div>
  );
}

function TeamCard({
  variant,
  title,
  pts,
  slots,
  selectedIdx,
  onTap,
}: {
  variant: "white" | "black";
  title: string;
  pts: number;
  slots: BuilderSlot[];
  selectedIdx: number | null;
  onTap: (idx: number) => void;
}) {
  const dark = variant === "black";
  return (
    <div
      className={`overflow-hidden rounded-[20px] border ${
        dark ? "border-teamblack bg-teamblack" : "border-line bg-white"
      }`}
    >
      <div
        className={`flex items-center justify-between border-b px-3.5 py-[11px] ${
          dark ? "border-white/10" : "border-line2"
        }`}
      >
        <span
          className={`flex items-center gap-2 text-sm font-extrabold ${
            dark ? "text-white" : "text-ink"
          }`}
        >
          <span
            className="h-3.5 w-3.5 rounded-full border-2"
            style={
              dark
                ? { background: "#17201A", borderColor: "#fff" }
                : { background: "#fff", borderColor: "#10160F" }
            }
          />
          {title}
        </span>
        <span
          className={`font-display text-[13px] font-bold ${
            dark ? "text-lightgreen" : "text-primary"
          }`}
        >
          {pts} pts
        </span>
      </div>
      {slots.map((p, i) => {
        const isSel = selectedIdx === i;
        return (
          <button
            key={i}
            onClick={() => onTap(i)}
            className={`flex w-full items-center gap-[9px] border-t px-3.5 py-2.5 text-left ${
              dark ? "border-white/[.07]" : "border-line3"
            }`}
            style={
              isSel
                ? dark
                  ? {
                      background: "rgba(143,224,172,.18)",
                      boxShadow: "inset 0 0 0 2px #8FE0AC",
                    }
                  : {
                      background: "#E9F7EE",
                      boxShadow: "inset 0 0 0 2px #12A150",
                    }
                : undefined
            }
          >
            <span
              className={`w-3 font-display text-xs font-bold ${
                dark ? "text-white/50" : "text-faint"
              }`}
            >
              {i + 1}
            </span>
            <span
              className={`flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-bold ${
                dark ? "text-white" : "text-ink"
              }`}
            >
              {p.name}
            </span>
            <span
              className={`tabular text-[11px] font-bold ${
                dark ? "text-white/50" : "text-faint"
              }`}
            >
              {p.pts}
            </span>
          </button>
        );
      })}
    </div>
  );
}
