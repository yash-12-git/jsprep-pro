/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        // Syne removed — no longer used
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      colors: {
        // Notion-style light palette — maps to CSS vars for theme switching
        bg: "var(--bg-base)",
        subtle: "var(--bg-subtle)",
        hover: "var(--bg-hover)",
        active: "var(--bg-active)",
        border: "var(--border-default)",
        "border-strong": "var(--border-strong)",
        text: "var(--text-primary)",
        muted: "var(--text-secondary)",
        accent: "var(--accent)",
        "accent-hover": "var(--accent-hover)",
        "accent-subtle": "var(--accent-subtle)",
        "accent-text": "var(--accent-text)",
        success: "var(--color-green)",
        "success-subtle": "var(--color-green-subtle)",
        warning: "var(--color-amber)",
        "warning-subtle": "var(--color-amber-subtle)",
        danger: "var(--color-red)",
        "danger-subtle": "var(--color-red-subtle)",
        "code-bg": "var(--code-bg)",
        "code-text": "var(--code-text)",
      },
      animation: {
        "fade-up": "fadeUp 0.35s ease both",
        "slide-down": "slideDown 0.25s ease both",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "fade-in": "fadeIn 0.2s ease both",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
        slideDown: {
          from: { opacity: "0", maxHeight: "0" },
          to: { opacity: "1", maxHeight: "2000px" },
        },
        pulseGlow: { "0%,100%": { opacity: "0.6" }, "50%": { opacity: "1" } },
      },
    },
  },
  plugins: [],
};
