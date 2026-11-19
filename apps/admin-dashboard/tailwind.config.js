/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'xs': '480px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    colors: {
      primary: 'rgb(var(--primary-rgb) / <alpha-value>)',
      secondary: 'rgb(var(--secondary-rgb) / <alpha-value>)',
      background: 'rgb(var(--background-rgb) / <alpha-value>)',
      neutral: 'rgb(var(--neutral-rgb) / <alpha-value>)',
      ink: 'rgb(var(--ink-rgb) / <alpha-value>)',
      black: 'rgb(var(--ink-rgb) / <alpha-value>)',
      white: '#FFFFFF',
      transparent: 'transparent',
      current: 'currentColor',
    },
    extend: {
      maxWidth: {
        'content-2xl': '1760px',
      },
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
        'card': '0 1px 2px rgba(18, 55, 71, 0.04), 0 8px 24px rgba(18, 55, 71, 0.06)',
        'card-hover': '0 2px 4px rgba(18, 55, 71, 0.06), 0 12px 28px rgba(18, 55, 71, 0.08)',
        'floating': '0 20px 40px -8px rgba(18, 55, 71, 0.25)',
      }
    },
  },
  plugins: [],
}
