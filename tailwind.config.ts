import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#05070c",
        surface: "#0a0e17",
        surface2: "#111827",
        brand: {
          DEFAULT: "#215bd6",
          light: "#5c8bf0",
          dark: "#0e2e73",
        },
        gold: {
          DEFAULT: "#e2891f",
          light: "#f2b661",
          dark: "#8a4c0c",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      backgroundImage: {
        "radial-fade":
          "radial-gradient(120% 120% at 50% 0%, rgba(33,91,214,0.22) 0%, rgba(5,7,12,0) 60%)",
        "hero-grid":
          "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
      },
      animation: {
        pulseSlow: "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        marquee: "marquee 22s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
