/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        bg: '#0a0a0f',
        surface: '#111118',
        card: '#16161f',
        border: '#2a2a3a',
        accent: '#7c6af7',
        accent2: '#f7c76a',
        accent3: '#6af7c0',
        muted: '#6b6b8a',
        danger: '#f76a6a',
        success: '#6af7a0',
      },
      animation: {
        'fade-up': 'fadeUp 0.35s ease both',
        'slide-down': 'slideDown 0.25s ease both',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        slideDown: { from: { opacity: 0, maxHeight: 0 }, to: { opacity: 1, maxHeight: '2000px' } },
        pulseGlow: { '0%,100%': { opacity: 0.6 }, '50%': { opacity: 1 } },
      },
    },
  },
  plugins: [],
}
