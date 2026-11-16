/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#F5B800',
          light: '#FCE8A3',
          dark: '#D49E00',
        },
        dark: {
          DEFAULT: '#222026',
          surface: '#2C2A31',
          muted: '#36343C',
        },
        page: '#F6F6F8',
        muted: '#8A8A93',
        border: '#ECECF0',
        amberText: '#8A6500',
      },
      fontFamily: {
        sans: ['"Arbutus Slab"', 'Georgia', 'serif'],
        serif: ['"Arbutus Slab"', 'Georgia', 'serif'],
      },
      borderRadius: {
        '3xl': '24px',
        '4xl': '28px',
        '5xl': '32px',
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.04), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
        'card-hover': '0 12px 32px -4px rgba(0, 0, 0, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.04)',
        'floating': '0 20px 40px -8px rgba(34, 32, 38, 0.25)',
      }
    },
  },
  plugins: [],
}
