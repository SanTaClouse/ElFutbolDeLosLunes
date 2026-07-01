import React from "react";

type P = React.SVGProps<SVGSVGElement> & { size?: number };

function base(size: number, props: P) {
  const { size: _omit, ...rest } = props;
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    ...rest,
  };
}

export const IconTable = ({ size = 22, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M8 21V9m4 12V4m4 17v-7" />
    <line x1="3" y1="21" x2="21" y2="21" />
  </svg>
);

export const IconShuffle = ({ size = 22, ...p }: P) => (
  <svg {...base(size, p)}>
    <polyline points="16 3 21 3 21 8" />
    <line x1="4" y1="20" x2="21" y2="3" />
    <polyline points="21 16 21 21 16 21" />
    <line x1="15" y1="15" x2="21" y2="21" />
    <line x1="4" y1="4" x2="9" y2="9" />
  </svg>
);

export const IconWhistle = ({ size = 22, ...p }: P) => (
  <svg {...base(size, p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v8m-4-4h8" />
  </svg>
);

export const IconClock = ({ size = 22, ...p }: P) => (
  <svg {...base(size, p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

export const IconShare = ({ size = 18, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7" />
    <polyline points="16 6 12 2 8 6" />
    <line x1="12" y1="2" x2="12" y2="15" />
  </svg>
);

export const IconPlus = ({ size = 17, ...p }: P) => (
  <svg {...base(size, p)}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export const IconMinus = ({ size = 14, ...p }: P) => (
  <svg {...base(size, p)}>
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export const IconWhatsApp = ({ size = 17, ...p }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.13c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.36c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.2 8.2 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24Z" />
  </svg>
);

export const BallLogo = ({ size = 56 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 56 56" fill="none">
    <circle cx="28" cy="28" r="24" fill="#fff" />
    <polygon points="28,15 38,22.5 34,34 22,34 18,22.5" fill="#10160F" />
    <path
      d="M28 15 L28 4 M38 22.5 L48 19 M34 34 L41 44 M22 34 L15 44 M18 22.5 L8 19"
      stroke="#10160F"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
  </svg>
);
