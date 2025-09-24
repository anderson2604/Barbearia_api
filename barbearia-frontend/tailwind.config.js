/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Inclui todos os arquivos JS/JSX/TS/TSX na pasta src
  ],
  theme: {
    extend: {}, // Opcional: personalize cores, fontes, etc.
  },
  plugins: [], // Opcional: adicione plugins como @tailwindcss/forms
};