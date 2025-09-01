/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'neu': '8px 8px 15px #d1d9e6, -8px -8px 15px #ffffff',
        'neu-btn': '5px 5px 10px #d1d9e6, -5px -5px 10px #ffffff',
        'neu-btn-hover': 'inset 5px 5px 10px #d1d9e6, inset -5px -5px 10px #ffffff',
      }
    },
  },
  plugins: [],
}
