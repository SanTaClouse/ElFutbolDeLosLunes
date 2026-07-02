"use client";

/** Pelota de la marca, girando. Se usa como indicador de carga. */
export function SpinnerBall({ size = 48 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke="#0C7C3D"
      strokeWidth={3.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="animate-spin [animation-duration:1.3s]"
    >
      <circle cx="24" cy="24" r="21" />
      <polygon
        points="24,15 32.56,21.22 29.29,31.28 18.71,31.28 15.44,21.22"
        fill="#0C7C3D"
      />
      <path d="M24,15 L24,3 M32.56,21.22 L43.97,17.51 M29.29,31.28 L36.34,40.99 M18.71,31.28 L11.66,40.99 M15.44,21.22 L4.03,17.51" />
    </svg>
  );
}

export function BrandLoader({ label = "Cargando…" }: { label?: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4">
      <div className="flex flex-col items-center">
        <SpinnerBall size={54} />
        <span className="mt-3 h-1.5 w-9 animate-pulse rounded-full bg-black/10 blur-[1px]" />
      </div>
      <span className="text-[13px] font-semibold tracking-wide text-faint">
        {label}
      </span>
    </div>
  );
}
