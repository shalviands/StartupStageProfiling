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
        navy:        '#0F2647',
        navy2:       '#1A3A6B',
        gold:        '#E8A020',
        'gold-lt':   '#FDF3DC',
        teal:        '#1A7A6E',
        'teal-lt':   '#D8F0ED',
        coral:       '#E84B3A',
        'coral-lt':  '#FDECEA',
        purple:      '#5B4FCF',
        'purple-lt': '#EEEAFF',
        slate:       '#3B5070',
        silver:      '#8A9BB0',
        smoke:       '#F4F6F9',
        rule:        '#DDE3EC',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
