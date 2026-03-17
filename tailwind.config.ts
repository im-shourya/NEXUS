import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
        display: ["var(--font-display)", "Impact", "sans-serif"],
      },
      colors: {
        // NEXUS backgrounds
        "nx-bg":  "#060D08",
        "nx-bg2": "#0B1610",
        "nx-bg3": "#111F18",
        "nx-bg4": "#172B1E",
        "nx-bg5": "#1E3527",
        // NEXUS accents
        "nx-green":  "#00F574",
        "nx-orange": "#FF5B19",
        "nx-cyan":   "#00D4FF",
        "nx-gold":   "#FFB800",
        "nx-purple": "#9B5DFF",
        "nx-red":    "#FF3B30",
        "nx-amber":  "#F5A623",
        "nx-teal":   "#00C9B1",
        "nx-blue":   "#3B82F6",
        "nx-pink":   "#F72585",
        // ShadCN semantic tokens
        background:     "var(--background)",
        foreground:     "var(--foreground)",
        card:           { DEFAULT: "var(--card)", foreground: "var(--card-foreground)" },
        primary:        { DEFAULT: "var(--primary)", foreground: "var(--primary-foreground)" },
        secondary:      { DEFAULT: "var(--secondary)", foreground: "var(--secondary-foreground)" },
        muted:          { DEFAULT: "var(--muted)", foreground: "var(--muted-foreground)" },
        accent:         { DEFAULT: "var(--accent)", foreground: "var(--accent-foreground)" },
        destructive:    { DEFAULT: "var(--destructive)", foreground: "var(--destructive-foreground)" },
        border:         "var(--border)",
        input:          "var(--input)",
        ring:           "var(--ring)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        // NEXUS standard radii
        "nx-sm":   "8px",
        "nx-md":   "12px",
        "nx-lg":   "16px",
        "nx-xl":   "20px",
        "nx-pill": "9999px",
      },
      boxShadow: {
        "nx-card":  "0 4px 8px rgba(0,0,0,0.5), 0 1px 3px rgba(0,0,0,0.4)",
        "nx-hover": "0 20px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,245,116,0.22)",
        "nx-float": "0 32px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.05)",
        "nx-green": "0 0 28px rgba(0,245,116,0.22), 0 0 64px rgba(0,245,116,0.08)",
      },
      animation: {
        "nx-pulse":    "nx-live-pulse 2s ease-in-out infinite",
        "nx-float":    "nx-float 3.8s ease-in-out infinite",
        "nx-shimmer":  "nx-shimmer 2s infinite",
        "nx-fade-up":  "nx-fade-up 0.6s ease-out forwards",
        "nx-slide":    "nx-slide-right 0.6s ease-out forwards",
      },
    },
  },
  plugins: [],
}

export default config
