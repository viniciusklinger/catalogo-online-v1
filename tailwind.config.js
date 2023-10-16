const defaultTheme = require('tailwindcss/defaultTheme')
/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      screens: {
        'xxs': '425px',
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
      backgroundImage: {
        'burger': "url(./src/imgs/burguer-bg.png)",
        'fruits-2': "url(./src/imgs/bg-2.png)",
        'fruits-1': "url(./src/imgs/bg-1.png)",
        'star': "url(./src/imgs/icon/star.png)",
        'h-star': "url(./src/imgs/icon/h-star.png)",
        'quote': "url(./src/imgs/icon/quote.png)",
      }
    },
    letterSpacing: {
      'widest': '5px',
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
}

