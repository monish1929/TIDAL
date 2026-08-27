import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F7F8FA",
        surface: "#FFFFFF",
        primary: {
          DEFAULT: "#2563EB",
          hover: "#1D4ED8",
          subtle: "#EFF6FF",
          border: "#BFDBFE",
        },
        dark: {
          text: "#1F2937",
          muted: "#6B7280",
          light: "#9CA3AF",
        },
        border: {
          DEFAULT: "#E5E7EB",
          subtle: "#F3F4F6",
          dark: "#D1D5DB",
        },
        status: {
          safe: "#059669",
          safeBg: "#ECFDF5",
          safeBorder: "#A7F3D0",
          caution: "#D97706",
          cautionBg: "#FFFBEB",
          cautionBorder: "#FDE68A",
          hazard: "#DC2626",
          hazardBg: "#FEF2F2",
          hazardBorder: "#FECACA",
          ai: "#4F46E5",
          aiBg: "#EEF2FF",
          aiBorder: "#C7D2FE",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      borderRadius: {
        lg: "12px",
        xl: "14px",
        "2xl": "16px",
      },
      boxShadow: {
        subtle: "0 1px 2px 0 rgba(0, 0, 0, 0.03)",
        card: "0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)",
        dropdown: "0 4px 12px 0 rgba(0, 0, 0, 0.08)",
      },
    },
  },
  plugins: [],
};
export default config;
