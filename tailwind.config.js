/** @type {import('tailwindcss').Config} */

const colors = require("tailwindcss/colors")
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      azul: "#2DA4FA",
      verde: "#63FA20",
      naranja: "#F9904F",
      fondo: "#FEF3EB",
      blanco: "#FFFFFF",
      negro: "#000000",
      rojo: "#FF0000",
      ...colors,
    },
    fontFamily: {
      sans: ['Roboto', 'sans-serif'],
    },
    extend: {
      backgroundImage: {
        "logo": "URL('/img/logo.png')",
        "placeholder": "URL('/img/placeholder.png')"
      },
      brightness: {
        40: '.40',
      },
      animation: {
        "unhidde": "unhidde 300ms ease-in 300ms 1 normal forwards",
        "expand": "expand 600ms ease-in"
      },
      keyframes: {
        unhidde: {
          "0%": {opacity: "0%"},
          "100%": {opacity: "100%"}
        },
        expand: {
          "0%": {height: "0%"},
          "100%": {height: "auto"}
        }
      },
      width: {
        "form": '31.25rem',
        "form-thin": "25rem",
        "extendido": "500%",
      },
      height: {
        "cuadrado": "40vw"
      },
      transitionProperty: {
        'height': 'height'
      },
    },
  },
  plugins: [],
}