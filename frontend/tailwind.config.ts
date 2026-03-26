import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        d: {
          bg: "#0B0F14",
          surface: "#11161D",
          panel: "#161C24",
          border: "#273140",
          text: "#E8EEF5",
          sub: "#9FB0C3",
          muted: "#5A6E82",
          blue: "#4DA3FF",
          cyan: "#37C5F3",
          amber: "#F5B942",
          danger: "#FF5C6C",
          success: "#3CCB7F",
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        ar: ['"IBM Plex Sans Arabic"', '"Noto Sans Arabic"', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"IBM Plex Mono"', 'monospace'],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4,0,0.6,1) infinite",
      },
    },
  },
  plugins: [],
};
export default config;
