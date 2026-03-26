import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        d: {
          bg: "#1F232A",
          shell: "#232830",
          surface: "#2A3038",
          panel: "#2E353F",
          border: "#39414C",
          "border-d": "#444D59",
          text: "#E5EAF0",
          sub: "#AAB3BF",
          muted: "#818B97",
          blue: "#5D8BFF",
          cyan: "#4DB6D6",
          amber: "#D6A24A",
          danger: "#C96A6A",
          success: "#67B58A",
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
