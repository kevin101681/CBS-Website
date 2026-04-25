/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './services/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#FDFEFF',
          100: '#F4F8FB',
          200: '#E4ECF4',
          300: '#C8D9EA',
          400: '#A4BFDB',
          500: '#809FC9',
          600: '#607DA8',
          700: '#4D6487',
          800: '#3F506A',
          900: '#344155',
        },
        surface: {
          DEFAULT: '#ffffff',
          variant: '#FDFEFF',
        },
      },
    },
  },
  plugins: [],
};
