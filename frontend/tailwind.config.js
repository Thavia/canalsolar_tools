/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e8eaf5',
          100: '#d1d5eb',
          200: '#a3abd7',
          300: '#7581c3',
          400: '#4757af',
          500: '#2a3a8b',
          600: '#1f2d6f',
          700: '#1a2559',
          800: '#151d47',
          900: '#141C4D',
          950: '#0f1538',
        },
        secondary: {
          500: '#E50913',
        },
      },
    },
  },
  plugins: [],
}





