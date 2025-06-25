/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'poke-red': '#CC0000',
        'poke-blue': '#3B4CCA',
        'poke-yellow': '#FFDE00',
        'poke-gold': '#B3A125',
      },
    },
  },
  plugins: [],
}
