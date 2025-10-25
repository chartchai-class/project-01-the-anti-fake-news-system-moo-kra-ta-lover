import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sumana': ['Sumana', 'serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      keyframes: {
        pop: {
          '0%': { opacity: 0, transform: 'translateY(20px) scale(0.95)' },
          '50%': { opacity: 1, transform: 'translateY(0) scale(1.05)' },
          '100%': { opacity: 1, transform: 'translateY(0) scale(1)' },
        },
        fadeOut: {
          '0%': { opacity: 1 },
          '100%': { opacity: 0 },
        },
      },
      animation: {
        pop: 'pop 0.3s ease-out forwards',
        fadeOut: 'fadeOut 1s ease-in forwards',
      },
    },
  },
  plugins: [],
} satisfies Config

