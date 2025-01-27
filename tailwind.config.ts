import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "#1E1E2E", // Darker, richer background
        foreground: "#E4E4E7", // Light gray for better readability
        primary: {
          DEFAULT: "#86A8E7", // Soft blue
          foreground: "#FFFFFF",
          light: "#9DB7EB",
        },
        secondary: {
          DEFAULT: "#91A7FF", // Periwinkle
          foreground: "#FFFFFF",
          light: "#A5B7FF",
        },
        accent: {
          DEFAULT: "#B4C6FC", // Light periwinkle
          foreground: "#1E1E2E",
          light: "#C8D5FD",
        },
        text: {
          primary: "#FFFFFF", // Pure white for primary text
          secondary: "#A1A1AA", // Lighter gray for secondary text
        },
        muted: {
          DEFAULT: "#27273A", // Slightly lighter than background
          foreground: "#A1A1AA",
        },
        destructive: {
          DEFAULT: "#FF8787", // Soft red
          foreground: "#FFFFFF",
        },
        popover: {
          DEFAULT: "#1E1E2E",
          foreground: "#E4E4E7",
        },
        card: {
          DEFAULT: "#27273A",
          foreground: "#E4E4E7",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      backgroundImage: {
        'gradient-professional': 'linear-gradient(135deg, #1E1E2E 0%, #27273A 100%)',
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "slide-in": {
          "0%": { transform: "translateX(-10px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" }
        },
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" }
        }
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;