/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'fade-in': {
          '0%': {
            opacity: '0',
          },
          '100%': {
            opacity: '1',
          },
        },
        'fade-out': {
          '0%': {
            opacity: '1',
          },
          '100%': {
            opacity: '0',
          },
        },
        'slide-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
      animation: {
        'fade-in': 'fade-in var(--transition-duration, 0.2s) var(--transition-timing, ease-out)',
        'fade-out': 'fade-out var(--transition-duration, 0.2s) var(--transition-timing, ease-out)',
        'slide-up': 'slide-up var(--transition-duration, 0.2s) var(--transition-timing, ease-out)',
      },
    },
  },
  plugins: [],
};