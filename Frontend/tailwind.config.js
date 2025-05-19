import { heroui } from "@heroui/theme";
import defaultTheme from 'tailwindcss/defaultTheme.js';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    './src/layouts/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Golos Text"', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [
    heroui({
      layout: {
        fontFamily: {
          sans: '"Golos Text", ui-sans-serif, system-ui',
        },
      },
      themes: {
        light: {
          // светлая тема без изменений
        },
        dark: {
          colors: {
            background: '#1E1E1E',
          },
        },
      },
    }),
  ],
}