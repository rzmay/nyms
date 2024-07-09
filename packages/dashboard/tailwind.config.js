const relations = require('lib/constants/relations');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js}'],
  theme: {
    extend: {
      colors: {
        [null]: relations.null.hex,
        syn: relations.synonym.hex,
        ant: relations.antonym.hex,
        rhyme: relations.rhyme.hex,
      },
      fontFamily: {
        karnak: ['Karnak', 'sans-serif'],
        franklin: ['Franklin', 'sans-serif'],
      },
      animation: {
        fade: 'fadeIn .5s ease-in-out',
        shimmer: 'shimmer 4s ease-out infinite',
        goal: 'fadeIn .5s ease-in-out, bounce 1s infinite',
        draw: 'draw .5s linear forwards',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        shimmer: {
          '40%, 100%': { transform: 'translateX(calc(300%))' },
        },
        draw: {
          to: { 'stroke-dashoffset': 0 },
        },
      },
    },
  },
  plugins: [],
};
