import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        yt: '#0f0f0f',
      },
    },
  },
  plugins: [],
} satisfies Config
