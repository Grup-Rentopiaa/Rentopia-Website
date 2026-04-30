/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:   '#EFF6FF',
          100:  '#DBEAFE',
          200:  '#BFDBFE',
          300:  '#93C5FD',
          400:  '#60A5FA',
          500:  '#3B82F6',
          600:  '#2563EB',
          700:  '#1D4ED8',
          800:  '#1E40AF',
          900:  '#1E3A8A',
        },
        status: {
          success: '#22C55E',
          warning: '#F59E0B',
          error:   '#EF4444',
          info:    '#0EA5E9',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        card:       '0 1px 4px rgba(0,0,0,0.07)',
        'card-hover': '0 6px 24px rgba(37,99,235,0.13)',
      },
    },
  },
  plugins: [],
};
