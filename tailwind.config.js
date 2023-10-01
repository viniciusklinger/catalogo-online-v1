const defaultTheme = require('tailwindcss/defaultTheme')
/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
      ...defaultTheme.screens,
      },
      colors: {
        primary: '#ffbf00',
        default: '#212121',
      },
      fontFamily: {
        pop: ['Poppins', 'sans-serif'],
      },
    },
    letterSpacing: {
      'widest': '5px',
    }
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
}

