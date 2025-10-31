/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#003d52',
        'primary-light': '#004d66',
        'primary-dark': '#002d3d'
      }
    },
  },
  plugins: [],
}