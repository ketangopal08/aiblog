/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './app/**/*.{vue,js,ts}',
    './components/**/*.{vue,js,ts}',
    './pages/**/*.{vue,js,ts}',
    './layouts/**/*.{vue,js,ts}',
    './plugins/**/*.{js,ts}',
    './composables/**/*.{js,ts}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Playfair Display"', 'serif'],
        display: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: '#4bc471',
      },
    },
  },
  plugins: [],
}

