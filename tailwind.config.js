/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue"
  ],
  safelist: [
    'font-lexend',
    'font-inter'
  ],
  theme: {
    extend: {
      colors: {
        'brown-300': '#8B4513',
        'city-blue': '#001840', // Dark blue for footer background
        'city-gold': '#F5A623', // Gold accent color for branding
      },
      fontFamily: {
        'lexend': ['Lexend', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
} 