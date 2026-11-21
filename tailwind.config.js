/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        app: "#0B0F19",
        card: "#111827",
        elevated: "#1F2937",
        subtle: "#1F2937",
        stroke: "#374151",
        primary: "#F9FAFB",
        muted: "#9CA3AF",
        sky: {
          primary: "#0284C7",
          focus: "#38BDF8",
        },
        tier: {
          veryLow: "#38BDF8",
          low: "#2DD4BF",
          moderate: "#FBBF24",
          high: "#FB923C",
          veryHigh: "#F43F5E",
        }
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        mono: ["JetBrains Mono", "SFMono-Regular", "Menlo", "monospace"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.5), 0 1px 2px rgba(0,0,0,0.3)",
        drawer: "-4px 0 24px rgba(0,0,0,0.7)",
      }
    },
  },
  plugins: [],
}
