import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1e3a5f',
          50: '#e8eef5',
          100: '#c5d4e8',
          200: '#9fb7d8',
          300: '#7899c7',
          400: '#5a82ba',
          500: '#3c6bac',
          600: '#2d5a9e',
          700: '#1e3a5f',
          800: '#152b47',
          900: '#0c1c2f',
        },
        gold: {
          DEFAULT: '#c9a84c',
          50: '#fdf8ec',
          100: '#f9edcc',
          200: '#f5e6c8',
          300: '#edcf7e',
          400: '#e4b84e',
          500: '#c9a84c',
          600: '#b08f3a',
          700: '#8a6e2b',
          800: '#654f1e',
          900: '#3e3012',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
