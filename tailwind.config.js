export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        surface: {
          950: '#07070f',
          900: '#0b1120',
          800: '#111827',
          700: '#131b2e',
          600: '#17263f'
        },
        border: 'rgba(148, 163, 184, 0.16)',
        primary: {
          DEFAULT: '#7c78f2',
          soft: '#818cf8',
          strong: '#6366f1'
        },
        neutral: {
          100: '#f8fafc',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569'
        },
        success: '#22c55e',
        warning: '#f59e0b',
        danger: '#f97316',
        info: '#38bdf8'
      },
      fontFamily: {
        sans: ['Geist', 'Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        soft: '0 10px 30px rgba(15, 23, 42, 0.24)',
        elevated: '0 20px 45px rgba(15, 23, 42, 0.28)',
        glow: '0 0 0 1px rgba(148, 163, 184, 0.08), 0 24px 70px rgba(15, 23, 42, 0.32)'
      },
      borderRadius: {
        sm: '0.5rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.5rem',
        '2xl': '2rem'
      },
      transitionTimingFunction: {
        soft: 'cubic-bezier(0.16, 0.8, 0.24, 1)'
      },
      transitionDuration: {
        base: '180ms',
        slow: '280ms'
      },
      zIndex: {
        dropdown: 50,
        overlay: 60,
        modal: 70,
        drawer: 75,
        tooltip: 80,
        toast: 90
      },
      screens: {
        xs: '420px',
        sm: '640px',
        md: '900px',
        lg: '1120px',
        xl: '1440px'
      }
    }
  },
  plugins: []
}
