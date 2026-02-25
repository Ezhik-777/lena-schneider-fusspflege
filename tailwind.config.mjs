/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  corePlugins: {
    container: false,
  },
  theme: {
    extend: {
      colors: {
        cream: '#FDF6EC',
        'warm-white': '#FFFCF7',
        sage: {
          DEFAULT: '#8B9E7E',
          light: '#A8B89E',
          dark: '#6B7E60',
          50: '#F2F5EF',
          100: '#E1E8DB',
          200: '#C5D4BA',
        },
        terracotta: {
          DEFAULT: '#C67D5B',
          dark: '#A8674A',
          light: '#D4967A',
          50: '#FDF3EE',
        },
        olive: {
          DEFAULT: '#4A5540',
          light: '#5C6B50',
          dark: '#3A4332',
        },
        gold: {
          DEFAULT: '#D4A574',
          light: '#E8C9A0',
          dark: '#B88A5C',
        },
        'text-dark': '#2D2A26',
        'text-muted': '#6B6560',
        'amber-bg': '#FEF3E2',
        'amber-border': '#F0D4A8',
      },
      fontFamily: {
        display: ['"DM Serif Display"', 'serif'],
        body: ['Outfit', 'sans-serif'],
      },
      borderRadius: {
        organic: '2rem',
        'organic-sm': '1.25rem',
        'organic-lg': '2.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-down': 'slideDown 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
