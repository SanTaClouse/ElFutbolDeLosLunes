"use client";

import { useApp } from "./store";

export function Toast() {
  const { toast } = useApp();
  if (!toast) return null;
  return (
    <div
      key={toast}
      className="absolute bottom-24 left-1/2 z-[60] -translate-x-1/2 animate-toast whitespace-nowrap rounded-full bg-ink px-[18px] py-[11px] text-[13.5px] font-bold text-white shadow-toast"
    >
      {toast}
    </div>
  );
}
