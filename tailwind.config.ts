import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#101314",
        carbon: "#252a2b",
        copy: "#505958",
        muted: "#767d7a",
        line: "#d5d8d2",
        canvas: "#f4f4f0",
        surface: "#e7e8e3",
        surface2: "#d5d8d2",
        mist: "#e7eff0",
        brand: {
          DEFAULT: "#4f6f78",
          light: "#8da6ad",
          dark: "#304c54",
        },
        gold: {
          DEFAULT: "#b88748",
          light: "#c9a36e",
          dark: "#876130",
        },
      },
      fontFamily: {
        display: ["var(--font-sans)", "sans-serif"],
        body: ["var(--font-sans)", "sans-serif"],
      },
      backgroundImage: {
        "radial-fade":
          "radial-gradient(120% 120% at 50% 0%, rgba(79,111,120,0.18) 0%, rgba(244,244,240,0) 60%)",
        "hero-grid":
          "linear-gradient(rgba(32,37,38,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(32,37,38,0.07) 1px, transparent 1px)",
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
