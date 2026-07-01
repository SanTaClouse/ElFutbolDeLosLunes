import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#10160F",
        muted: "#5A635A",
        faint: "#9AA39B",
        appbg: "#F4F6F3",
        line: "#E7ECE6",
        line2: "#F0F3EF",
        line3: "#F4F6F3",
        primary: "#12A150",
        "primary-dark": "#0f8f46",
        brand: "#0C7C3D",
        brand2: "#0A6A35",
        brand3: "#08532A",
        softgreen: "#E9F7EE",
        softborder: "#CDEDD9",
        lightgreen: "#8FE0AC",
        teamblack: "#17201A",
        danger: "#B0433A",
        dangerbg: "#FBE7E5",
        star: "#FFF6E0",
        merow: "#F1FAF3",
        avatarbg: "#EEF3EC",
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "system-ui", "sans-serif"],
        display: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 14px -8px rgba(20,40,20,.22)",
        podium: "0 14px 30px -16px rgba(12,124,61,.7)",
        btn: "0 6px 16px -8px rgba(12,124,61,.9)",
        btn2: "0 8px 18px -8px rgba(18,161,80,.9)",
        toast: "0 10px 24px -8px rgba(0,0,0,.5)",
        chip: "0 2px 8px -4px rgba(20,40,20,.2)",
        insight: "0 3px 10px -6px rgba(20,40,20,.25)",
      },
      keyframes: {
        pop: {
          "0%": { transform: "scale(.92)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        up: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        toast: {
          "0%": { transform: "translate(-50%,20px)", opacity: "0" },
          "12%": { transform: "translate(-50%,0)", opacity: "1" },
          "88%": { transform: "translate(-50%,0)", opacity: "1" },
          "100%": { transform: "translate(-50%,20px)", opacity: "0" },
        },
        sheet: {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
      },
      animation: {
        pop: "pop .3s ease both",
        up: "up .35s ease both",
        "up-slow": "up .6s ease both",
        toast: "toast 2.4s ease both",
        sheet: "sheet .3s cubic-bezier(.2,.8,.2,1) both",
      },
    },
  },
  plugins: [],
};

export default config;
