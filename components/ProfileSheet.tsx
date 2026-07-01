"use client";

import { useState } from "react";
import { useApp } from "./store";
import { Sheet } from "./Sheet";
import { Avatar } from "./Avatar";

export function ProfileSheet() {
  const { user, logout, closeModal } = useApp();
  const [confirming, setConfirming] = useState(false);

  return (
    <Sheet onClose={closeModal}>
      <div className="flex items-center gap-3">
        <Avatar
          name={user || "?"}
          size={48}
          className="bg-brand text-white"
          fontSize={20}
        />
        <div>
          <div className="font-display text-[19px] font-bold text-ink">
            {user}
          </div>
          <div className="text-[12.5px] text-muted">
            Estás usando la app como {user}.
          </div>
        </div>
      </div>

      {!confirming ? (
        <>
          <button
            onClick={() => setConfirming(true)}
            className="mt-5 w-full rounded-2xl border border-line bg-white py-3.5 text-sm font-extrabold text-ink transition hover:bg-appbg"
          >
            Cambiar de usuario
          </button>
          <button
            onClick={closeModal}
            className="mt-2 w-full rounded-2xl bg-brand py-3.5 text-sm font-extrabold text-white"
          >
            Seguir como {user}
          </button>
        </>
      ) : (
        <div className="mt-5 animate-up rounded-2xl border border-softborder bg-softgreen px-4 py-3.5">
          <div className="text-[13px] font-bold text-brand">
            ¿Cambiar de usuario?
          </div>
          <div className="mt-1 text-[12.5px] text-[#3f7a55]">
            Vas a volver a la pantalla de inicio para elegir otro nombre.
          </div>
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => setConfirming(false)}
              className="flex-1 rounded-xl border border-line bg-white py-3 text-[13.5px] font-bold text-ink"
            >
              Cancelar
            </button>
            <button
              onClick={logout}
              className="flex-1 rounded-xl bg-brand py-3 text-[13.5px] font-extrabold text-white"
            >
              Sí, cambiar
            </button>
          </div>
        </div>
      )}
    </Sheet>
  );
}
