"use client";

import React from "react";

export function Sheet({
  onClose,
  children,
}: {
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      onClick={onClose}
      className="absolute inset-0 z-50 flex flex-col justify-end bg-[rgba(16,22,15,.5)]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="animate-sheet rounded-t-[28px] bg-appbg px-5 pb-8 pt-5"
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[#D6DCD4]" />
        {children}
      </div>
    </div>
  );
}
