"use client";

import { useApp, Tab } from "./store";
import { IconTable, IconShuffle, IconWhistle, IconClock } from "./Icons";

const ITEMS: { tab: Tab; label: string; Icon: typeof IconTable }[] = [
  { tab: "tabla", label: "Tabla", Icon: IconTable },
  { tab: "armar", label: "Armar", Icon: IconShuffle },
  { tab: "registrar", label: "Registrar", Icon: IconWhistle },
  { tab: "historial", label: "Historial", Icon: IconClock },
];

export function BottomNav() {
  const { tab, go } = useApp();

  return (
    <div className="flex flex-shrink-0 border-t border-line bg-white px-2 pb-6 pt-[9px]">
      {ITEMS.map(({ tab: t, label, Icon }) => {
        const active = tab === t;
        return (
          <button
            key={t}
            onClick={() => go(t)}
            className="flex flex-1 flex-col items-center gap-1 text-[10.5px] font-bold transition-colors"
            style={{ color: active ? "#0C7C3D" : "#AEB6AD" }}
          >
            <Icon size={22} />
            {label}
          </button>
        );
      })}
    </div>
  );
}
