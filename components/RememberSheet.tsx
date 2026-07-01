"use client";

import { useApp } from "./store";
import { Sheet } from "./Sheet";
import { Avatar } from "./Avatar";

export function RememberSheet() {
  const { user, confirmRemember } = useApp();

  return (
    <Sheet onClose={() => confirmRemember(false)}>
      <div className="flex items-center gap-3">
        <Avatar
          name={user || "?"}
          size={48}
          className="bg-brand text-white"
          fontSize={20}
        />
        <div>
          <div className="font-display text-[19px] font-bold text-ink">
            Entraste como {user}
          </div>
          <div className="text-[12.5px] text-muted">
            ¿Te recordamos en este dispositivo?
          </div>
        </div>
      </div>

      <button
        onClick={() => confirmRemember(true)}
        className="mt-5 w-full rounded-2xl bg-primary py-3.5 text-[15px] font-extrabold text-white"
      >
        Sí, guardar
      </button>
      <button
        onClick={() => confirmRemember(false)}
        className="mt-2 w-full rounded-2xl border border-line bg-white py-3.5 text-sm font-bold text-muted"
      >
        Ahora no
      </button>
      <div className="mt-3 text-center text-[11.5px] leading-[1.4] text-faint">
        Si guardás, la próxima vez entrás directo sin elegir el nombre.
      </div>
    </Sheet>
  );
}
