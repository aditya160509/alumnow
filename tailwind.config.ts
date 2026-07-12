import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: { "xs": "420px", "2xl": "1400px" },
    },
    extend: {
      colors: {
        landing: {
          surface: "rgba(255, 255, 255, 0.10)",
          "surface-hover": "rgba(255, 255, 255, 0.16)",
          border: "rgba(255, 255, 255, 0.10)",
          "border-strong": "rgba(255, 255, 255, 0.20)",
          text: "rgba(255, 255, 255, 0.80)",
          "text-muted": "rgba(255, 255, 255, 0.60)",
        },
        primary: {
          DEFAULT: "#1B3A6B",
          light: "#2B5A9B",
          dark: "#0F2240",
          50: "#EBF0F7",
          100: "#D6E0EF",
          200: "#ADC1DF",
          300: "#85A2CF",
          400: "#5C83BF",
          500: "#1B3A6B",
          600: "#162E56",
          700: "#102341",
          800: "#0B172B",
          900: "#050C16",
        },
        accent: {
          DEFAULT: "#B8D8D0",
          light: "#D9E9E5",
          dark: "#739F96",
          50: "#F1F7F5",
          100: "#E4F0ED",
          200: "#D9E9E5",
          300: "#CBE2DC",
          400: "#B8D8D0",
          500: "#B8D8D0",
          600: "#739F96",
          700: "#587D76",
          800: "#3D5B56",
          900: "#263B38",
        },
        background: "#F8F9FB",
        foreground: "#2C3E50",
        border: "#E2E5EA",
        input: "#E2E5EA",
        ring: "#1B3A6B",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "DM Sans", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        marck: ["var(--font-marck)", "cursive"],
        mono: ["JetBrains Mono", "SF Mono", "Fira Code", "monospace"],
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "16px",
        xl: "20px",
      },
      boxShadow: {
        sm: "0 1px 3px rgba(27, 58, 107, 0.08)",
        md: "0 4px 12px rgba(27, 58, 107, 0.1)",
        lg: "0 8px 24px rgba(27, 58, 107, 0.12)",
        xl: "0 16px 48px rgba(27, 58, 107, 0.15)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.3" },
        },
        "check-draw": {
          "0%": { strokeDashoffset: "50" },
          "100%": { strokeDashoffset: "0" },
        },
        "slide-up": {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        shimmer: "shimmer 1.5s infinite",
        "pulse-dot": "pulse-dot 1.5s ease-in-out infinite",
        "check-draw": "check-draw 0.4s ease-out forwards",
        "slide-up": "slide-up 0.3s ease-out",
      },
    },
  },
  plugins: [animate],
};

export default config;
