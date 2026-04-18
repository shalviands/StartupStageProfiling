import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'navy':      '#0F172A',
        'gold':      '#E8A020',
        'gold-lt':   '#FDF3DC',
        'teal':      '#1A7A6E',
        'teal-lt':   '#D8F0ED',
        'coral':     '#E84B3A',
        'slate':     '#334155',
        'silver':    '#64748B',
        'smoke':     '#F8FAFC',
        'rule':      '#E2E8F0',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
