import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Fútbol de los Lunes";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BALL = `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220" viewBox="0 0 48 48" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="24" cy="24" r="21"/><polygon points="24,15 32.56,21.22 29.29,31.28 18.71,31.28 15.44,21.22" fill="#ffffff"/><path d="M24,15 L24,3 M32.56,21.22 L43.97,17.51 M29.29,31.28 L36.34,40.99 M18.71,31.28 L11.66,40.99 M15.44,21.22 L4.03,17.51"/></svg>`;

export default function OpengraphImage() {
  const ball = `data:image/svg+xml;base64,${btoa(BALL)}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(160deg, #0C7C3D 0%, #0A6A35 55%, #08532A 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={ball} width={190} height={190} alt="" />
        <div
          style={{
            marginTop: 30,
            fontSize: 30,
            letterSpacing: 10,
            color: "#8FE0AC",
            display: "flex",
          }}
        >
          EL FÚTBOL DE LOS
        </div>
        <div style={{ fontSize: 150, fontWeight: 800, lineHeight: 1, display: "flex" }}>
          LUNES
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 30,
            color: "rgba(255,255,255,0.75)",
            display: "flex",
          }}
        >
          Tabla · Equipos parejos · Puntos del grupo
        </div>
      </div>
    ),
    { ...size }
  );
}
