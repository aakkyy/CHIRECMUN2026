import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['attribute', 'data-theme'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        brand: ['Rubik', 'sans-serif'],
        ui:    ['Geist', 'sans-serif'],
        body:  ['Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          red:    '#c0392b',
          'red-h': '#e74c3c',
          'red-d': '#8e1f15',
          cyan:   '#56CCF2',
          'cyan-h': '#85DEFF',
        },
        surface: {
          DEFAULT: '#09090f',
          2:       '#0e0e18',
          3:       '#141420',
        },
      },
      borderRadius: {
        DEFAULT: '10px',
        sm:      '6px',
        pill:    '999px',
      },
      animation: {
        'fade-up':   'fadeUp 0.65s cubic-bezier(.22,1,.36,1) both',
        'blob-pulse': 'blobPulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(28px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        blobPulse: {
          '0%, 100%': { transform: 'scale(1.08)' },
          '50%':      { transform: 'scale(1.02)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
