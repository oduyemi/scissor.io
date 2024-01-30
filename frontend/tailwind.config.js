/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:["Monteserrat", "sans-serif"]
      },
      colors:{
        goldie: "#FAF2A1",
        pry: "#ffbe0b",
        pee: "#FDCFF3",
      }
    },
  },
  plugins: [],
}