import type { Config } from "tailwindcss";

/**
 * Trueline Spectrum — Brand Design System
 * STRICT palette. Only these brand colors are permitted across the app:
 *   Primary Green  #00A99D  (CTAs, active nav, links, category accents, highlights)
 *   Primary Blue   #002C71  (headings, navigation, footer, premium sections)
 *   Gray           #5E5858  (secondary text, metadata, descriptions)
 *   White          #FFFFFF  (neutral background / contrast)
 * No red / orange / purple / pink / yellow. No unapproved gradients.
 */
const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Green — teal from the logo mark
        green: {
          DEFAULT: "#00A99D",
          50: "#E6F7F6",
          100: "#CCEFEC",
          200: "#99DFD9",
          300: "#66CFC6",
          400: "#33BFB3",
          500: "#00A99D",
          600: "#00887E",
          700: "#00665E",
          800: "#00443F",
          900: "#00221F",
        },
        // Primary Blue — navy from the wordmark
        navy: {
          DEFAULT: "#002C71",
          50: "#E6EAF1",
          100: "#CCD5E3",
          200: "#99AAC6",
          300: "#6680AA",
          400: "#33568D",
          500: "#002C71",
          600: "#00235A",
          700: "#001A44",
          800: "#00122D",
          900: "#000917",
        },
        // Neutral gray for supporting text
        stone: {
          DEFAULT: "#5E5858",
          50: "#F4F3F3",
          100: "#E9E7E7",
          200: "#D3CFCF",
          300: "#BDB7B7",
          400: "#8C8585",
          500: "#5E5858",
          600: "#4B4646",
          700: "#383535",
          800: "#262323",
          900: "#131111",
        },
      },
      fontFamily: {
        // Editorial serif for headlines, clean sans for body/UI
        serif: ["var(--font-serif)", "Georgia", "Cambria", "serif"],
        sans: ["var(--font-sans)", "system-ui", "Segoe UI", "sans-serif"],
      },
      maxWidth: {
        editorial: "1240px",
        reading: "720px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0, 44, 113, 0.06), 0 1px 2px rgba(0, 44, 113, 0.04)",
        lift: "0 8px 30px rgba(0, 44, 113, 0.08)",
      },
      keyframes: {
        "ticker": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        ticker: "ticker 40s linear infinite",
        "fade-up": "fade-up 0.4s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
