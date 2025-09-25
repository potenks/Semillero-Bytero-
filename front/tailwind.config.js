/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4285F4',
          dark: '#3367D6',
          light: '#8AB4F8'
        }
      },
      fontFamily: {
        sans: ['Roboto', 'system-ui', 'sans-serif'],
        heading: ['Inter', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
}
