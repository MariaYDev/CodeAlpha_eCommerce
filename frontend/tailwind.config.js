/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        graphite: {
          950: '#121215',
          900: '#1B1B1F',
          800: '#232328',
          700: '#2E2E35',
          600: '#3B3B44',
          500: '#54545F',
          400: '#7A7A85',
          300: '#A5A5AD',
          200: '#D0D0D4',
          100: '#EDEDEF'
        },
        copper: {
          400: '#F0B45C',
          500: '#E8A33D',
          600: '#C9822A',
          700: '#A6691F'
        },
        signal: {
          500: '#4FD1C5'
        }
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace']
      }
    }
  },
  plugins: []
};
