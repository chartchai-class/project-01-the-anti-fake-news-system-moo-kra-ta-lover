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
      }
    },
  },
  plugins: [],
} satisfies Config
