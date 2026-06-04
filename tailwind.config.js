/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
        mono: ['ui-monospace', 'monospace'],
      },
      colors: {
        /* Stripe — bug tracker app only */
        stripe: {
          bg: '#f6f9fc',
          surface: '#ffffff',
          ink: '#0a2540',
          muted: '#425466',
          faint: '#8898aa',
          border: '#e6ebf1',
          accent: '#635bff',
          'accent-hover': '#5851ea',
          'accent-soft': '#f2efff',
        },
        /* Modern retail — Test Playground only */
        pg: {
          bg: '#f4f6fb',
          surface: '#ffffff',
          ink: '#0f172a',
          muted: '#64748b',
          faint: '#94a3b8',
          line: '#e2e8f0',
          accent: '#4f46e5',
          'accent-hover': '#4338ca',
          'accent-soft': '#eef2ff',
          glow: '#c7d2fe',
        },
      },
      boxShadow: {
        stripe: '0 1px 1px rgba(0, 0, 0, 0.06), 0 2px 5px rgba(50, 50, 93, 0.08)',
        'stripe-lg': '0 4px 12px rgba(50, 50, 93, 0.1), 0 8px 24px rgba(50, 50, 93, 0.08)',
        pg: '0 4px 24px rgba(15, 23, 42, 0.06), 0 1px 3px rgba(15, 23, 42, 0.04)',
        'pg-lg': '0 20px 50px -12px rgba(79, 70, 229, 0.15)',
      },
    },
  },
  plugins: [],
};
