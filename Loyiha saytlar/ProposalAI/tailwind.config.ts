import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#07111f",
          900: "#0b1324",
          800: "#101b33",
          700: "#16233f"
        },
        brand: {
          500: "#5668ff",
          600: "#4457f3"
        },
        mint: {
          500: "#47d7a7"
        },
        amber: {
          500: "#f4ad4e"
        }
      },
      boxShadow: {
        glow: "0 24px 80px rgba(86, 104, 255, 0.18)"
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "system-ui", "sans-serif"],
        display: ["var(--font-space-grotesk)", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
