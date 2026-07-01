"use client";

import { useApp, Tab } from "./store";
import { Avatar } from "./Avatar";

const TITLES: Record<Tab, [string, string]> = {
  tabla: ["Posiciones", "Fútbol de los lunes"],
  armar: ["Armador", "Equipos del lunes"],
  registrar: ["Resultado", "Cargar partido"],
  historial: ["Historial", "Movimientos"],
};

export function AppHeader() {
  const { tab, user, logout } = useApp();
  const [kicker, title] = TITLES[tab];

  return (
    <div className="flex flex-shrink-0 items-center justify-between px-5 pb-3 pt-1.5">
      <div>
        <div className="font-display text-xs font-semibold uppercase tracking-[1.5px] text-primary">
          {kicker}
        </div>
        <div className="mt-px font-display text-2xl font-bold leading-[1.05] text-ink">
          {title}
        </div>
      </div>
      <button
        onClick={logout}
        title="Cambiar de usuario"
        className="flex items-center gap-[9px] rounded-full border border-line bg-white py-[5px] pl-[5px] pr-3 shadow-chip"
      >
        <Avatar
          name={user || "?"}
          size={30}
          className="bg-brand text-white"
          fontSize={14}
        />
        <span className="text-[13.5px] font-bold text-ink">{user || "—"}</span>
      </button>
    </div>
  );
}
