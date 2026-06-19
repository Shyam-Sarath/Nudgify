module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#fcf9f8',
        foreground: '#1c1b1b',
        border: '#c3c8c1',
        card: '#ffffff',
        popover: '#ffffff',
        muted: '#f0eded',
        accent: '#c3c8c1',
        destructive: '#ba1a1a',
        success: '#334537', // mapping success/indigo to our primary deep sage style
        danger: '#ba1a1a',
        warning: '#964824', // terracotta for warnings/accents
        info: '#4a5d4e',
        app: '#fcf9f8',
        dark: {
          DEFAULT: '#121212',
          bg: '#121212',
          card: '#1e1e1e',
          border: '#2a2a2a',
        },
        light: {
          DEFAULT: '#fcf9f8',
          bg: '#fcf9f8',
          card: '#ffffff',
          border: '#e5e2e1',
        },
        primary: {
          50: '#f3f7f4',
          100: '#d3e8d5',
          200: '#b7ccb9',
          300: '#9cbea0',
          400: '#7aa580',
          500: '#4a5d4e',
          600: '#334537',
          700: '#2b3a2e',
          800: '#222f25',
          900: '#19231c',
          950: '#0e1f13',
        },
        secondary: {
          50: '#fdf4f0',
          100: '#ffdbcd',
          200: '#ffb597',
          300: '#fd9a6f',
          400: '#e4865a',
          500: '#c76e44',
          600: '#964824',
          700: '#77320e',
          800: '#5a2307',
          900: '#360f00',
        },
        tertiary: {
          50: '#fcfbf9',
          100: '#e5e2db',
          200: '#c9c6c0',
          300: '#a3a19b',
          400: '#7e7c77',
          500: '#5a5954',
          600: '#42413d',
          700: '#33322f',
          800: '#262523',
          900: '#1c1c18',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Manrope', 'sans-serif'],
      },
      borderRadius: {
        'sm': '0.5rem',     // 8px
        'DEFAULT': '1rem',  // 16px
        'md': '1.5rem',     // 24px (standard cards)
        'lg': '2rem',       // 32px (hero cards, bottom sheets)
        'xl': '3rem',       // 48px
        'full': '9999px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(74, 93, 78, 0.06)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
