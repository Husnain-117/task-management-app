/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
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
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#6C5DD3",
          50: "#F4F3FB",
          100: "#E8E6F7",
          200: "#D1CCEF",
          300: "#BAB3E7",
          400: "#A39ADF",
          500: "#8C81D7",
          600: "#6C5DD3",
          700: "#4A3AC4",
          800: "#3B2E9D",
          900: "#2C2275"
        },
        secondary: {
          DEFAULT: "#A8A8FF",
          50: "#FFFFFF",
          100: "#F5F5FF",
          200: "#E0E0FF",
          300: "#CCCCFF",
          400: "#B7B7FF",
          500: "#A8A8FF",
          600: "#7575FF",
          700: "#4242FF",
          800: "#0F0FFF",
          900: "#0000DB"
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "slide-in": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" }
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        },
        "bounce-in": {
          "0%": { transform: "scale(0.3)", opacity: "0" },
          "50%": { transform: "scale(1.05)" },
          "70%": { transform: "scale(0.9)" },
          "100%": { transform: "scale(1)", opacity: "1" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "slide-in": "slide-in 0.5s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "bounce-in": "bounce-in 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)"
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} 