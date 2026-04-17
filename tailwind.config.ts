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
        'navy':      '#0F172A', // Slate-950 equivalent for deep backgrounds
        'gold':      '#E8A020',
        'gold-lt':   '#FDF3DC',
        'teal-brand':'#1A7A6E',
        'teal-lt':   '#D8F0ED',
        'coral':     '#E84B3A',
        'iu-slate':  '#334155',
        'iu-silver': '#64748B',
        'iu-smoke':  '#F8FAFC',
        'iu-rule':   '#E2E8F0',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
