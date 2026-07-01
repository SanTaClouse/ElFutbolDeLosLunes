"use client";

import { useApp } from "../store";
import { IconPlus, IconMinus } from "../Icons";
import { shortDate } from "@/lib/format";
import { GameEvent } from "@/lib/types";

const ICON = { extra: "⭐", result: "🏆", draw: "🤝" };
const ICON_BG = {
  extra: "#FFF6E0",
  result: "#E9F7EE",
  draw: "#EEF1F4",
};

export function HistorialTab() {
  const { events, players, removeEvent, openExtra } = useApp();
  const nameById = new Map(players.map((p) => [p.id, p.name]));

  const feed = [...events].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  );

  const totalMatches = events.filter((e) => e.type !== "extra").length;
  const totalExtra = events
    .filter((e) => e.type === "extra")
    .reduce((a, e) => a + (e.delta ?? 1), 0);

  const describe = (h: GameEvent) => {
    if (h.type === "extra") {
      return {
        title: `${h.addedBy ?? "Alguien"} sumó a ${
          nameById.get(h.playerId ?? "") ?? "jugador"
        }`,
        sub: `${h.reasonLabel ?? "Punto extra"} · ${shortDate(h.occurredOn)}`,
        delta: h.delta ?? 1,
      };
    }
    if (h.type === "result") {
      const winners = h.winner === "Blancos" ? h.teamWhite : h.teamBlack;
      return {
        title: `Ganó ${h.winner}`,
        sub: `+3 a ${winners?.length ?? 5} jugadores · ${shortDate(
          h.occurredOn
        )}`,
        delta: 3,
      };
    }
    return {
      title: "Empate",
      sub: `+1 a todos · ${shortDate(h.occurredOn)}`,
      delta: 1,
    };
  };

  return (
    <div>
      <div className="mx-0 mb-3 mt-0.5 flex gap-[9px]">
        <div className="flex-1 rounded-2xl border border-line bg-white px-3.5 py-3">
          <div className="text-[11px] font-bold uppercase tracking-[.5px] text-faint">
            Partidos
          </div>
          <div className="font-display text-[22px] font-bold text-ink">
            {totalMatches}
          </div>
        </div>
        <div className="flex-1 rounded-2xl border border-line bg-white px-3.5 py-3">
          <div className="text-[11px] font-bold uppercase tracking-[.5px] text-faint">
            Puntos extra
          </div>
          <div className="font-display text-[22px] font-bold text-primary">
            {totalExtra}
          </div>
        </div>
      </div>

      <button
        onClick={openExtra}
        className="mb-3.5 flex w-full items-center justify-center gap-2 rounded-2xl border-[1.5px] border-dashed border-[#C4D2C4] bg-white py-3 text-[13.5px] font-extrabold text-brand transition hover:bg-appbg"
      >
        <IconPlus size={16} />
        Agregar punto extra
      </button>

      <div className="mx-0.5 mb-[9px] mt-0.5 text-sm font-extrabold text-ink">
        Historial de movimientos
      </div>
      <div className="flex flex-col gap-[9px]">
        {feed.map((h) => {
          const d = describe(h);
          return (
            <div
              key={h.id}
              className="flex items-center gap-3 rounded-2xl border border-line bg-white px-3.5 py-3"
            >
              <span
                className="flex h-[38px] w-[38px] flex-shrink-0 items-center justify-center rounded-[11px] text-base"
                style={{ background: ICON_BG[h.type] }}
              >
                {ICON[h.type]}
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-[13.5px] font-bold leading-[1.3] text-ink">
                  {d.title}
                </div>
                <div className="mt-0.5 text-[11.5px] font-semibold text-faint">
                  {d.sub}
                </div>
              </div>
              <span className="tabular font-display text-sm font-bold text-primary">
                +{d.delta}
              </span>
              <button
                onClick={() => removeEvent(h.id)}
                title="Quitar movimiento"
                className="flex h-[26px] w-[26px] flex-shrink-0 items-center justify-center rounded-lg bg-appbg text-danger transition hover:bg-dangerbg"
              >
                <IconMinus size={14} />
              </button>
            </div>
          );
        })}
        {feed.length === 0 && (
          <div className="py-10 text-center text-[13px] text-faint">
            Todavía no hay movimientos.
          </div>
        )}
      </div>
    </div>
  );
}
