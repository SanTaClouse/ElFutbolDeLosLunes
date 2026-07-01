"use client";

import { useApp } from "../store";
import { Podium } from "../Podium";
import { StandingsTable } from "../StandingsTable";

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
        <span className="text-xs font-semibold text-faint">
          {standings.length} jugadores
        </span>
      </div>
      <StandingsTable standings={standings} me={user} />
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
