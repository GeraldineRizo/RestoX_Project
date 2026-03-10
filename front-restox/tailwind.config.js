/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'arvi-verde': '#3C4623',
        'arvi-crema': '#E8E4D9',
        'arvi-fondo': '#F9F7F2',
      },
    },
  },
  plugins: [],
}