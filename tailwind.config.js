/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './lib/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-deep': '#020617',
        'divine-gold': '#FFD700',
        'indigo-psych': '#818cf8',
        'rose-crisis': '#f43f5e',
        'emerald-success': '#10b981',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Anuphan', 'sans-serif'],
      },
      backdropBlur: {
        xl: '30px',
      },
    },
  },
  plugins: [],
};
