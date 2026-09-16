import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    {
      pattern: /(from|to|via)-(sky|blue|indigo|purple|pink|rose|orange|amber|emerald|teal|slate|yellow|red|cyan)-(500|600|700|800)/,
    },
    {
      pattern: /shadow-(sky|blue|indigo|purple|pink|rose|orange|amber|emerald|teal|slate)-(200|300)/,
    },
    'bg-gradient-to-tr',
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          50: "#f0f7ff",
          100: "#e0effe",
          200: "#bae0fd",
          300: "#7cc8fb",
          400: "#36abf6",
          500: "#0c8ee7",
          600: "#0271c5",
          700: "#0359a0",
          800: "#074c83",
          900: "#0c406e",
          950: "#082849",
        },
      },
      fontFamily: {
        sans: ["var(--font-kanit)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
