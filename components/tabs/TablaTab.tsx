"use client";

import { useApp } from "../store";
import { Avatar } from "../Avatar";
import { Podium } from "../Podium";

export function TablaTab() {
  const { standings, insights, user } = useApp();
  const podium = standings.slice(0, 3);

  return (
    <div className="animate-up">
      {/* Podio */}
      <Podium top={podium} me={user} />



      {/* Tabla completa */}
      <div className="mx-0.5 mb-[9px] mt-[18px] flex items-center justify-between">
        <span className="text-sm font-extrabold text-ink">
          Tabla de posiciones
        </span>
        <span className="text-xs font-semibold text-faint">PJ · PTS</span>
      </div>
      <div className="overflow-hidden rounded-[20px] border border-line bg-white shadow-card">
        {standings.map((s, i) => {
          const isMe = s.player.name === user;
          return (
            <div
              key={s.player.id}
              className="flex items-center gap-3 border-t border-line2 px-3.5 py-[11px] first:border-t-0"
              style={isMe ? { background: "#F1FAF3" } : undefined}
            >
              <span
                className="tabular w-[22px] text-center font-display text-sm font-bold"
                style={{ color: i < 3 ? "#0C7C3D" : "#9AA39B" }}
              >
                {i + 1}
              </span>
              <Avatar
                name={s.player.name}
                size={34}
                className={isMe ? "bg-brand text-white" : "bg-avatarbg text-brand"}
              />
              <div className="min-w-0 flex-1">
                <div className="overflow-hidden text-ellipsis whitespace-nowrap text-[14.5px] font-bold text-ink">
                  {s.player.name}
                  {isMe && (
                    <span className="font-semibold text-faint"> · vos</span>
                  )}
                </div>
                <div className="text-[11.5px] font-semibold text-faint">
                  G{s.g} · E{s.e} · P{s.p}
                </div>
              </div>
              <span className="tabular w-[26px] text-right text-[11px] font-bold text-faint">
                {s.pj}
              </span>
              <span className="tabular w-[38px] text-right font-display text-[17px] font-bold text-ink">
                {s.pts}
              </span>
            </div>
          );
        })}
      </div>
      {/* Patrones */}
      {insights.length > 0 && (
        <>
          <div className="mx-0.5 mb-[9px] mt-4 flex items-center justify-between">
            <span className="text-sm font-extrabold text-ink">
              Patrones detectados
            </span>
            <span className="text-xs font-bold text-primary">Automático</span>
          </div>
          <div className="no-scrollbar -mx-4 flex gap-2.5 overflow-x-auto px-4 pb-1">
            {insights.map((it, i) => (
              <div
                key={i}
                className="flex-shrink-0 basis-[78%] rounded-[18px] border border-line bg-white px-[15px] py-3.5 shadow-insight"
              >
                <span className="inline-block rounded-full bg-softgreen px-2 py-[3px] text-[10.5px] font-extrabold uppercase tracking-[.5px] text-brand">
                  {it.tag}
                </span>
                <div className="mt-[9px] text-[15px] font-extrabold text-ink">
                  {it.title}
                </div>
                <div className="mt-1 text-[12.5px] leading-[1.4] text-muted">
                  {it.desc}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      <div className="h-1.5" />
    </div>
  );
}
