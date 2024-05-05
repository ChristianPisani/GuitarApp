/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,tsx,jsx}'],
  theme: {
    extend: {
      colors: {
        'primary-50': 'hsl(var(--primary-50) / <alpha-value>)',
        'primary-100': 'hsl(var(--primary-100) / <alpha-value>)',
        'primary-200': 'hsl(var(--primary-200) / <alpha-value>)',
        'primary-300': 'hsl(var(--primary-300) / <alpha-value>)',
        'primary-400': 'hsl(var(--primary-400) / <alpha-value>)',
        'primary-500': 'hsl(var(--primary-500) / <alpha-value>)',
        'primary-600': 'hsl(var(--primary-600) / <alpha-value>)',
        'primary-700': 'hsl(var(--primary-700) / <alpha-value>)',
        'primary-800': 'hsl(var(--primary-800) / <alpha-value>)',
        'primary-900': 'hsl(var(--primary-900) / <alpha-value>)',
        'primary-950': 'hsl(var(--primary-950) / <alpha-value>)',

        'secondary-50': 'hsl(var(--secondary-50) / <alpha-value>)',
        'secondary-100': 'hsl(var(--secondary-100) / <alpha-value>)',
        'secondary-200': 'hsl(var(--secondary-200) / <alpha-value>)',
        'secondary-300': 'hsl(var(--secondary-300) / <alpha-value>)',
        'secondary-400': 'hsl(var(--secondary-400) / <alpha-value>)',
        'secondary-500': 'hsl(var(--secondary-500) / <alpha-value>)',
        'secondary-600': 'hsl(var(--secondary-600) / <alpha-value>)',
        'secondary-700': 'hsl(var(--secondary-700) / <alpha-value>)',
        'secondary-800': 'hls(var(--secondary-800) / <alpha-value>)',
        'secondary-900': 'hsl(var(--secondary-900) / <alpha-value>)',
        'secondary-950': 'hsl(var(--secondary-950) / <alpha-value>)',

        'accent-shadow': 'var(--accent-shadow)',
      },
    },
    borderRadius: {
      none: '0',
      sm: '.125rem',
      DEFAULT: '.25rem',
      lg: '0.75rem',
      '2xl': '1rem',
      '3xl': '1.5rem',
      '4xl': '2rem',
      full: '9999px',
    },
  },
  plugins: ['prettier-plugin-tailwindcss'],
}
