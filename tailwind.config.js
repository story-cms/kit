// https://tailwindcss.com/docs/guides/vite#vue
import forms from '@tailwindcss/forms';
import colors from 'tailwindcss/colors';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/frontend/**/*.{vue,js,ts,jsx,tsx}",
  ],
  safelist: [
    'bg-green-400',
    'focus:ring-green-400',
    'bg-indigo-50',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        dmsans: ['DM Sans', 'sans-serif'],
        amiri: ['Amiri', 'serif'],
      },
      colors: {
        accent: {
          DEFAULT: '#39CCFB',
        },
        studio: {
          yellow:"#FBFF96",
          lime: '#D7FE96',
          green: '#B9E86C',
          dark: '#64748B',
          forest: "#102F35",
        },
        error:{
          DEFAULT: '#DC2626',
          light: '#FECACA',
        },
        red: colors.red,
        green: colors.green,
        black: '#2E2D2C',
        transparent: 'transparent',
        current: 'currentColor',
        white: colors.white,
        gray: colors.gray,
        slate: colors.slate,
        blue: colors.blue,
        yellow: colors.yellow,
        indigo: colors.indigo,
      },
    },
  },
  plugins: [forms],
}
