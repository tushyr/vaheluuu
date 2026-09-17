import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0A0A0B",
        foreground: "#EDEDED",
        cream: {
          50: "#FCFAF7",
          100: "#F7F3EC",
          200: "#EEE5D8",
          300: "#E3D3BE",
          400: "#D4BFA0",
        },
        noir: {
          950: "#070708",
          900: "#0D0D0F",
          850: "#131316",
          800: "#1A1A1E",
          700: "#27272D",
          600: "#3D3D46",
        },
        caramel: {
          400: "#D89E62",
          500: "#C6823E",
          600: "#AA6627",
          700: "#864B17",
        },
        rosewood: {
          400: "#E28B96",
          500: "#CF6B78",
          600: "#B24C5A",
        },
        amberGold: {
          400: "#E5C07B",
          500: "#D4A346",
          600: "#B88328",
        },
      },
      fontFamily: {
        serif: ["Playfair Display", "Cinzel", "Georgia", "serif"],
        sans: ["Plus Jakarta Sans", "Inter", "-apple-system", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      animation: {
        "spin-slow": "spin 20s linear infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "shimmer": "shimmer 2.5s infinite linear",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
