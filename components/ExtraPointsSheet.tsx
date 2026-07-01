"use client";

import { useState } from "react";
import { useApp } from "./store";
import { Sheet } from "./Sheet";
import { Avatar } from "./Avatar";

export function ExtraPointsSheet() {
  const { standings, reasons, confirmExtra, closeModal } = useApp();
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [reasonId, setReasonId] = useState<string | null>(null);
  const ok = Boolean(playerId && reasonId);

  const selectedName = standings.find((s) => s.player.id === playerId)?.player
    .name;

  return (
    <Sheet onClose={closeModal}>
      <div className="font-display text-[19px] font-bold text-ink">
        Sumar punto extra
      </div>
      <div className="mt-0.5 text-[12.5px] text-muted">
        Queda registrado a tu nombre en el historial.
      </div>

      <div className="mb-2 mt-4 text-xs font-extrabold uppercase tracking-[.5px] text-faint">
        Jugador
      </div>
      <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1">
        {standings.map((s) => {
          const active = playerId === s.player.id;
          return (
            <button
              key={s.player.id}
              onClick={() => setPlayerId(s.player.id)}
              className="flex w-[62px] flex-shrink-0 flex-col items-center gap-[5px] rounded-2xl px-1.5 py-2"
              style={active ? { background: "#E9F7EE" } : undefined}
            >
              <Avatar
                name={s.player.name}
                size={42}
                fontSize={16}
                className={
                  active ? "bg-brand text-white" : "bg-avatarbg text-brand"
                }
              />
              <span className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-[11px] font-bold text-ink">
                {s.player.name}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mb-2 mt-4 text-xs font-extrabold uppercase tracking-[.5px] text-faint">
        Motivo
      </div>
      <div className="flex flex-col gap-2">
        {reasons.map((r) => {
          const active = reasonId === r.id;
          return (
            <button
              key={r.id}
              onClick={() => setReasonId(r.id)}
              className={`flex items-center gap-[11px] rounded-2xl px-3.5 py-3 text-left ${
                active
                  ? "border-2 border-primary bg-softgreen"
                  : "border-2 border-line bg-white"
              }`}
            >
              <span className="text-lg">{r.icon}</span>
              <span className="flex-1 text-sm font-bold text-ink">
                {r.label}
              </span>
              <span className="font-display text-sm font-bold text-primary">
                +{r.pts}
              </span>
            </button>
          );
        })}
      </div>

      <button
        onClick={() => ok && confirmExtra(playerId!, reasonId!)}
        disabled={!ok}
        className={`mt-[18px] w-full rounded-2xl py-[15px] text-[15px] font-extrabold text-white ${
          ok ? "bg-primary" : "cursor-not-allowed bg-[#D6DCD4]"
        }`}
      >
        {ok ? `Sumar +1 a ${selectedName}` : "Elegí jugador y motivo"}
      </button>
    </Sheet>
  );
}
