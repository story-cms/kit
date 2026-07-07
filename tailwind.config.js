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
        tertiary: '#649ABB',
        accent: {
          DEFAULT: '#39CCFB',
          one: '#FF7070',
          green: '#34D399',
          orange: '#FB923C',
          gray: '#E2E8F0',
          pink: '#EC4899'
        },
        error: colors.red['500'],
        red: colors.red,
        green: colors.green,
        purple: '#B88C9E',
        black: '#2E2D2C',
        neutral: '#F1F0EA',
        transparent: 'transparent',
        current: 'currentColor',
        white: colors.white,
        gray: colors.gray,
        slate: colors.slate,
        blue: colors.blue,
        yellow: colors.yellow,
        indigo: colors.indigo,
        app_gray: '#F9FAFB',
        app_green: '#16A34A',
        studio_forest_green: '#102F35',
        studio_lime: '#D7FE96',
      },
    },
  },
  plugins: [forms],
}
