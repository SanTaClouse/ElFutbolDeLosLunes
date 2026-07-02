import type { Metadata, Viewport } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://futboldeloslunes.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Fútbol de los Lunes",
  description:
    "Tabla de posiciones, armador de equipos parejos y puntos del grupo.",
  openGraph: {
    title: "Fútbol de los Lunes",
    description:
      "Mirá la tabla, armá equipos parejos y seguí tus puntos del grupo.",
    type: "website",
    locale: "es_AR",
    siteName: "Fútbol de los Lunes",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fútbol de los Lunes",
    description: "Mirá la tabla, armá equipos parejos y seguí tus puntos.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0C7C3D",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${manrope.variable} ${spaceGrotesk.variable}`}>
      <body>{children}</body>
    </html>
  );
}
