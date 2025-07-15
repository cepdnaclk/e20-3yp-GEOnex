/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", 
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'pulse-signal': {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(2.5)', opacity: '0' },
        },
        wave: {
          '0%': { transform: 'scale(0.5)', opacity: '0.6' },
          '70%': { transform: 'scale(2)', opacity: '0' },
          '100%': { opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        floatDrift: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '25%': { transform: 'translate(10px, -10px)' },
          '50%': { transform: 'translate(0px, -20px)' },
          '75%': { transform: 'translate(-10px, -10px)' },
        },
      },
      animation: {
        'pulse-signal': 'pulse-signal 1.5s ease-out infinite',
         wave: 'wave 2s ease-out infinite',
        'wave-delay': 'wave 2s ease-out infinite 1s',
        float: 'float 6s ease-in-out infinite',
        floatDrift: 'floatDrift 8s ease-in-out infinite',
      },
    }
  },
  plugins: [],
}