/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        fairy: {
          bg: '#FFFBFC',
          'bg-secondary': '#FFF4F6',
          pink: '#F4A6B7',
          'pink-light': '#FADCE3',
          green: '#B9D5A4',
          'green-light': '#E5F0DA',
          yellow: '#F9E7A7',
          'yellow-light': '#FFF6D9',
          text: '#514A50',
          'text-secondary': '#958A91',
          white: '#FFFFFF',
        },
      },
      fontFamily: {
        sans: ['"Quicksand"', '"Nunito"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(244, 166, 183, 0.15)',
        'soft-hover': '0 8px 30px -4px rgba(244, 166, 183, 0.25)',
        'card': '0 2px 12px rgba(81, 74, 80, 0.04), 0 1px 3px rgba(81, 74, 80, 0.03)',
        'card-hover': '0 10px 25px -3px rgba(244, 166, 183, 0.2), 0 4px 6px -2px rgba(81, 74, 80, 0.05)',
        'glow-pink': '0 0 25px rgba(244, 166, 183, 0.45)',
        'glow-yellow': '0 0 25px rgba(249, 231, 167, 0.5)',
        'glow-green': '0 0 25px rgba(185, 213, 164, 0.45)',
      },
      animation: {
        'float': 'float 3.5s ease-in-out infinite',
        'float-slow': 'float 5s ease-in-out infinite',
        'float-reverse': 'floatReverse 4s ease-in-out infinite',
        'sparkle': 'sparkle 1.8s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 2.5s ease-in-out infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'shimmer': 'shimmer 2.5s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        floatReverse: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(8px)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(0.85) rotate(0deg)' },
          '50%': { opacity: '1', transform: 'scale(1.15) rotate(15deg)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.88', transform: 'scale(1.02)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
}
