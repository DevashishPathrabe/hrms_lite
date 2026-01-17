/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        beige: {
          50: '#faf8f5',
          100: '#f5f1eb',
          200: '#ede6d8',
          300: '#e0d5c2',
          400: '#d1c2aa',
          500: '#c4b299',
          600: '#b39d7d',
          700: '#9a8568',
          800: '#7d6a54',
          900: '#655845',
        },
        accent: {
          warm: '#d4a574',
          cool: '#a8b5a0',
        },
      },
    },
  },
  plugins: [],
}
