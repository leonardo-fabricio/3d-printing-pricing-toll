import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animate'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: { DEFAULT: '#0a0a0b', subtle: '#111113', elevated: '#17171a' },
        border: { DEFAULT: '#26262b', strong: '#3a3a42' },
        fg: { DEFAULT: '#e7e7ea', muted: '#a0a0a8', subtle: '#6b6b74' },
        brand: { 400: '#a78bfa', 500: '#8b5cf6', 600: '#7c3aed' },
        accent: { cyan: '#22d3ee' },
      },
      fontFamily: { sans: ['Inter', 'system-ui'] },
      borderRadius: { xl: '14px', '2xl': '20px' },
      boxShadow: {
        card: '0 1px 0 rgba(255,255,255,0.04) inset, 0 8px 30px rgba(0,0,0,0.35)',
      },
    },
  },
  plugins: [animate],
} satisfies Config
