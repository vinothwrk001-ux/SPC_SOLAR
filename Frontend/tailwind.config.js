/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base
        bg: '#FAFAFA',
        surface: '#F4F4F4',

        // Brand
        black: {
          DEFAULT: '#0A0A0A',
          soft: '#141414',
          muted: '#1C1C1C',
        },
        red: {
          DEFAULT: '#CC2222',
          dark: '#A81B1B',
          light: '#FFF0F0',
          muted: 'rgba(204,34,34,0.12)',
        },
        white: {
          DEFAULT: '#FFFFFF',
          off: '#F9F9F9',
        },
        gray: {
          DEFAULT: '#6B6B6B',
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E8E8E8',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#6B6B6B',
          700: '#404040',
          900: '#1A1A1A',
          light: '#E0E0E0',
        },
      },
      fontFamily: {
        heading: ['"Barlow Condensed"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        accent: ['Barlow', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      fontSize: {
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '0.95' }],
        '10xl': ['10rem', { lineHeight: '0.9' }],
      },
      boxShadow: {
        card: '0 2px 8px rgba(0,0,0,0.07)',
        'card-md': '0 8px 24px rgba(0,0,0,0.1)',
        'card-lg': '0 20px 60px rgba(0,0,0,0.12)',
        'red-sm': '0 4px 16px rgba(204,34,34,0.2)',
        'red-md': '0 8px 32px rgba(204,34,34,0.3)',
        'inner-red': 'inset 0 0 0 2px #CC2222',
      },
      borderRadius: {
        card: '4px',
        btn: '2px',
        sm: '2px',
        DEFAULT: '4px',
      },
      transitionTimingFunction: {
        'expo-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'expo-in': 'cubic-bezier(0.7, 0, 0.84, 0)',
        'bounce-out': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        '250': '250ms',
        '350': '350ms',
        '450': '450ms',
        '600': '600ms',
      },
      animation: {
        'energy-pulse': 'energyPulse 2.5s ease-in-out infinite',
        'scan-line': 'scanLine 3s linear infinite',
        'counter-up': 'counterUp 0.6s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 1.5s infinite',
      },
      keyframes: {
        energyPulse: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        scanLine: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      backgroundImage: {
        'grid-pattern': "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='rgba(255,255,255,0.06)' stroke-width='1'%3E%3Cpath d='M0 0h40v40H0z'/%3E%3C/g%3E%3C/svg%3E\")",
        'grid-dark': "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='rgba(0,0,0,0.06)' stroke-width='1'%3E%3Cpath d='M0 0h40v40H0z'/%3E%3C/g%3E%3C/svg%3E\")",
        'radial-red': 'radial-gradient(ellipse at center, rgba(204,34,34,0.15) 0%, transparent 70%)',
        'hero-gradient': 'linear-gradient(135deg, #0A0A0A 0%, #1C1C1C 50%, #0A0A0A 100%)',
      },
    },
  },
  plugins: [],
}
