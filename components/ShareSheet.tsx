"use client";

import { useApp } from "./store";
import { Sheet } from "./Sheet";
import { IconWhatsApp } from "./Icons";

export function ShareSheet() {
  const { shareMsg, closeModal, showToast } = useApp();

  const copy = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareMsg);
      }
    } catch {
      /* sin permiso de clipboard */
    }
    closeModal();
    showToast("Mensaje copiado ✓");
  };

  const openWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareMsg)}`;
    if (typeof window !== "undefined") window.open(url, "_blank");
    closeModal();
  };

  return (
    <Sheet onClose={closeModal}>
      <div className="font-display text-[19px] font-bold text-ink">
        Compartir en el grupo
      </div>
      <div className="mt-3.5 whitespace-pre-wrap rounded-2xl border border-line bg-white p-[15px] text-[13px] leading-[1.55] text-ink">
        {shareMsg}
      </div>
      <div className="mt-3.5 flex gap-[9px]">
        <button
          onClick={copy}
          className="flex-shrink-0 rounded-2xl border border-line bg-white px-[18px] py-3.5 text-sm font-bold text-ink"
        >
          Copiar
        </button>
        <button
          onClick={openWhatsApp}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-[14.5px] font-extrabold text-white transition hover:bg-primary-dark"
        >
          <IconWhatsApp size={17} />
          WhatsApp
        </button>
      </div>
    </Sheet>
  );
}
