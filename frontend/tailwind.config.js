/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        graphite: {
          950: '#0C0C0C',
          900: '#111111',
          850: '#151515',
          800: '#1A1A1A',
          700: '#262626',
          600: '#333333',
        },
        bone: {
          50: '#FAF9F6',
          100: '#F7F5F0',
          200: '#EFECE6',
          300: '#E5E0D8',
          400: '#D5CFC5',
        },
        signal: {
          DEFAULT: '#FF5A1F',
          hover: '#E04E19',
          light: '#FFF0EB',
          dark: '#B83B10',
        },
        charcoal: '#1F2421',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'sm': '4px',
        DEFAULT: '6px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
      },
    },
  },
  plugins: [],
}
