/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#FFFFFF',
        surface: '#F5F5F5',
        black: '#0A0A0A',
        red: {
          DEFAULT: '#D32F2F',
          dark: '#B71C1C',
          light: '#FFEBEE',
        },
        gray: {
          DEFAULT: '#6B6B6B',
          light: '#E0E0E0',
        },
        white: '#FFFFFF',
      },
      fontFamily: {
        heading: ['"Barlow Condensed"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        accent: ['Barlow', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 8px rgba(0,0,0,0.08)',
      },
      borderRadius: {
        card: '4px',
        btn: '2px',
      }
    },
  },
  plugins: [],
}
