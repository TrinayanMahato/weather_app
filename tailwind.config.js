/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#003ec7',
        'primary-container': '#0052ff',
        'primary-fixed': '#dde1ff',
        'on-primary': '#ffffff',
        surface: '#faf8ff',
        'surface-container': '#eaedff',
        'surface-container-low': '#f2f3ff',
        'surface-container-lowest': '#ffffff',
        'on-surface': '#131b2e',
        'on-surface-variant': '#434656',
        outline: '#737688',
        'outline-variant': '#c3c5d9',
        'accent-orange': '#F97316',
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        ambient: '0 4px 20px rgba(0,0,0,0.03)',
        card:    '0 4px 20px rgba(0,0,0,0.02)',
        modal:   '0 10px 50px rgba(0,0,0,0.18)',
        orange:  '0 4px 16px rgba(249,115,22,0.35)',
        'orange-lg': '0 8px 24px rgba(249,115,22,0.45)',
      },
      keyframes: {
        popIn: {
          from: { opacity: '0', transform: 'scale(0.92) translateY(12px)' },
          to:   { opacity: '1', transform: 'scale(1)   translateY(0)'    },
        },
      },
      animation: {
        'pop-in': 'popIn 0.22s cubic-bezier(0.34,1.56,0.64,1)',
      },
    },
  },
  plugins: [],
}
