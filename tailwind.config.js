/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ral-primary': '#1e3a4f',
        'ral-secondary': '#2a4f69',
        'ral-light': '#3c6d8f',
        'ral-extra-light': '#d8e6f0',
        'ral-dark': '#162a39',
        'ral-accent': '#41839c'
      }
    },
  },
  plugins: [],
}