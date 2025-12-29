// tailwind.config.ts

/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: { // <-- เพิ่มส่วนนี้เข้าไป
        'minimal-pattern': 'radial-gradient(var(--pattern-color) 1px, transparent 1px)',
      },
      colors: {
        // Light Theme
        'brand-bg': '#FFFAF5',
        'brand-surface': '#FFFFFF',
        'brand-text-dark': '#473B30',
        'brand-text-light': '#937058',
        'brand-primary': '#937058',
        'brand-primary-light': '#C9B7AB',
        'brand-secondary': '#FCD77F',
        'brand-secondary-light': '#FDE8BD',
        'brand-border': '#EAE5E0',
        'brand-accent': '#F892A2',

        // Dark Theme
        'dark-bg': '#211d1a',
        'dark-surface': '#2c2825',
        'dark-text-dark': '#FFFAF5',
        'dark-text-light': '#C9B7AB',
        'dark-primary': '#FCD77F',
        'dark-secondary': '#937058',
        'dark-border': '#3a3532',
        'dark-accent': '#F892A2',

        // System Colors
        'brand-success': '#6A994E',
        'brand-warning': '#FCD77F',
        'brand-error': '#BC4749',
        'brand-info': '#A6CDE3',
      }
    },
  },
  plugins: [],
}
export default config