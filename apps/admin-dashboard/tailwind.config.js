/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      primary: '#F5B800',
      secondary: '#FCE8A3',
      black: '#000000',
      white: '#FFFFFF',
      transparent: 'transparent',
      current: 'currentColor',
    },
    extend: {
      fontFamily: {
        sans: ['"Poppins"', 'sans-serif'],
        heading: ['"Arbutus Slab"', 'Georgia', 'serif'],
        serif: ['"Arbutus Slab"', 'Georgia', 'serif'],
      },
      borderRadius: {
        '3xl': '24px',
        '4xl': '28px',
        '5xl': '32px',
      },
      boxShadow: {
        'card': '0 1px 2px rgba(0, 0, 0, 0.04), 0 8px 24px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 2px 4px rgba(0, 0, 0, 0.06), 0 12px 28px rgba(0, 0, 0, 0.08)',
        'floating': '0 20px 40px -8px rgba(0, 0, 0, 0.25)',
      }
    },
  },
  plugins: [],
}
