import type { Config } from "tailwindcss";
import plugin from 'tailwindcss/plugin'

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        primary: 'var(--font-display)',
        secondary: 'var(--font-text)',
      },
      fontSize: {
        'kinda-sm': ['0.8rem', '1.1rem'],
        'xxs': ['0.6rem', '0.75rem'],
      },
      colors: {
        'tiktok': {
          'red': '#FE2C55',
          'gray': '#1E1E1E'
        },
        'repost': '#FFCC00',
        'link': '#2D75FD',
        'invite': '#9849FC'
      }
    }
  },
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities({
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      })
    }),
  ],
};
export default config;
