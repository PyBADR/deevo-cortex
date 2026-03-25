import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        deevo: { bg: "#05070b", surface: "#0a0e17", border: "#1a1f2e", cyan: "#06b6d4", text: "#e2e8f0", muted: "#64748b" },
      },
      fontFamily: { mono: ["JetBrains Mono", "Fira Code", "monospace"], sans: ["Inter", "system-ui", "sans-serif"] },
      animation: { "pulse-slow": "pulse 3s cubic-bezier(0.4,0,0.6,1) infinite", glow: "glow 2s ease-in-out infinite alternate" },
      keyframes: { glow: { "0%": { boxShadow: "0 0 5px rgba(6,182,212,0.2)" }, "100%": { boxShadow: "0 0 20px rgba(6,182,212,0.4)" } } },
    },
  },
  plugins: [],
};
export default config;
