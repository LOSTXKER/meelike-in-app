// tailwind.config.ts
// ═══════════════════════════════════════════════════════════════════════════
// 🎨 MEELIKE COLOR SYSTEM
// ═══════════════════════════════════════════════════════════════════════════
//
// สีหลักใช้ CSS Variables ใน globals.css (เปลี่ยนตาม theme อัตโนมัติ)
// สีที่นี่เป็น fallback และสี static ที่ไม่เปลี่ยนตาม theme
//
// วิธีใช้:
// 1. Semantic colors (แนะนำ): bg-surface, text-primary, border-default
//    → เปลี่ยนตาม theme อัตโนมัติ ไม่ต้องใส่ dark:
//
// 2. Brand colors (เดิม): bg-brand-primary, text-brand-text-dark
//    → ต้องใส่ dark: เอง เช่น bg-brand-primary dark:bg-dark-primary
//
// ═══════════════════════════════════════════════════════════════════════════

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
      // ─────────────────────────────────────────────────────────────────────
      // Background Patterns
      // ─────────────────────────────────────────────────────────────────────
      backgroundImage: {
        'minimal-pattern': 'radial-gradient(var(--pattern-color) 1px, transparent 1px)',
      },
      
      // ─────────────────────────────────────────────────────────────────────
      // Colors
      // ─────────────────────────────────────────────────────────────────────
      colors: {
        // ═══════════════════════════════════════════════════════════════════
        // 🎯 SEMANTIC COLORS (ใช้ CSS Variables - แนะนำ!)
        // ═══════════════════════════════════════════════════════════════════
        
        // Background
        'main': 'rgb(var(--color-bg) / <alpha-value>)',
        'surface': 'rgb(var(--color-surface) / <alpha-value>)',
        'surface-hover': 'rgb(var(--color-surface-hover) / <alpha-value>)',
        'surface-active': 'rgb(var(--color-surface-active) / <alpha-value>)',
        
        // Text
        'primary': 'rgb(var(--color-text-primary) / <alpha-value>)',
        'secondary': 'rgb(var(--color-text-secondary) / <alpha-value>)',
        'muted': 'rgb(var(--color-text-muted) / <alpha-value>)',
        'inverse': 'rgb(var(--color-text-inverse) / <alpha-value>)',
        
        // Brand
        'brand': 'rgb(var(--color-primary) / <alpha-value>)',
        'brand-hover': 'rgb(var(--color-primary-hover) / <alpha-value>)',
        'brand-light': 'rgb(var(--color-primary-light) / <alpha-value>)',
        
        'accent': 'rgb(var(--color-secondary) / <alpha-value>)',
        'accent-hover': 'rgb(var(--color-secondary-hover) / <alpha-value>)',
        'accent-light': 'rgb(var(--color-secondary-light) / <alpha-value>)',
        
        'highlight': 'rgb(var(--color-accent) / <alpha-value>)',
        'highlight-hover': 'rgb(var(--color-accent-hover) / <alpha-value>)',
        
        // Border
        'default': 'rgb(var(--color-border) / <alpha-value>)',
        'light': 'rgb(var(--color-border-light) / <alpha-value>)',
        'focus': 'rgb(var(--color-border-focus) / <alpha-value>)',
        
        // Status
        'success': 'rgb(var(--color-success) / <alpha-value>)',
        'success-bg': 'rgb(var(--color-success-bg) / <alpha-value>)',
        'success-text': 'rgb(var(--color-success-text) / <alpha-value>)',
        
        'warning': 'rgb(var(--color-warning) / <alpha-value>)',
        'warning-bg': 'rgb(var(--color-warning-bg) / <alpha-value>)',
        'warning-text': 'rgb(var(--color-warning-text) / <alpha-value>)',
        
        'error': 'rgb(var(--color-error) / <alpha-value>)',
        'error-bg': 'rgb(var(--color-error-bg) / <alpha-value>)',
        'error-text': 'rgb(var(--color-error-text) / <alpha-value>)',
        
        'info': 'rgb(var(--color-info) / <alpha-value>)',
        'info-bg': 'rgb(var(--color-info-bg) / <alpha-value>)',
        'info-text': 'rgb(var(--color-info-text) / <alpha-value>)',
        
        // Bill Status
        'status': {
          'pending': 'rgb(var(--color-status-pending) / <alpha-value>)',
          'pending-bg': 'rgb(var(--color-status-pending-bg) / <alpha-value>)',
          'pending-text': 'rgb(var(--color-status-pending-text) / <alpha-value>)',
          
          'confirmed': 'rgb(var(--color-status-confirmed) / <alpha-value>)',
          'confirmed-bg': 'rgb(var(--color-status-confirmed-bg) / <alpha-value>)',
          'confirmed-text': 'rgb(var(--color-status-confirmed-text) / <alpha-value>)',
          
          'processing': 'rgb(var(--color-status-processing) / <alpha-value>)',
          'processing-bg': 'rgb(var(--color-status-processing-bg) / <alpha-value>)',
          'processing-text': 'rgb(var(--color-status-processing-text) / <alpha-value>)',
          
          'completed': 'rgb(var(--color-status-completed) / <alpha-value>)',
          'completed-bg': 'rgb(var(--color-status-completed-bg) / <alpha-value>)',
          'completed-text': 'rgb(var(--color-status-completed-text) / <alpha-value>)',
          
          'cancelled': 'rgb(var(--color-status-cancelled) / <alpha-value>)',
          'cancelled-bg': 'rgb(var(--color-status-cancelled-bg) / <alpha-value>)',
          'cancelled-text': 'rgb(var(--color-status-cancelled-text) / <alpha-value>)',
        },
        
        // Subscription Badges
        'boost': 'rgb(var(--color-boost) / <alpha-value>)',
        'boost-bg': 'rgb(var(--color-boost-bg) / <alpha-value>)',
        'boost-plus': 'rgb(var(--color-boost-plus) / <alpha-value>)',
        'boost-plus-bg': 'rgb(var(--color-boost-plus-bg) / <alpha-value>)',
        
        // Profit/Cost
        'profit': 'rgb(var(--color-profit) / <alpha-value>)',
        'cost': 'rgb(var(--color-cost) / <alpha-value>)',
        'loss': 'rgb(var(--color-loss) / <alpha-value>)',
        
        // ═══════════════════════════════════════════════════════════════════
        // 📦 LEGACY COLORS (ใช้สำหรับ compatibility)
        // ═══════════════════════════════════════════════════════════════════
        
        // Light Theme (Static)
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

        // Dark Theme (Static)
        'dark-bg': '#211d1a',
        'dark-surface': '#2c2825',
        'dark-text-dark': '#FFFAF5',
        'dark-text-light': '#C9B7AB',
        'dark-primary': '#FCD77F',
        'dark-secondary': '#937058',
        'dark-border': '#3a3532',
        'dark-accent': '#F892A2',

        // System Colors (Static)
        'brand-success': '#22C55E',
        'brand-warning': '#F59E0B',
        'brand-error': '#EF4444',
        'brand-info': '#3B82F6',
      },
      
      // ─────────────────────────────────────────────────────────────────────
      // Ring Colors
      // ─────────────────────────────────────────────────────────────────────
      ringColor: {
        'focus': 'rgb(var(--color-border-focus) / <alpha-value>)',
      },
      
      // ─────────────────────────────────────────────────────────────────────
      // Border Colors
      // ─────────────────────────────────────────────────────────────────────
      borderColor: {
        'default': 'rgb(var(--color-border) / <alpha-value>)',
        'light': 'rgb(var(--color-border-light) / <alpha-value>)',
      },
    },
  },
  plugins: [],
}
export default config
