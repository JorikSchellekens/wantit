import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'burgues-script': ['var(--font-burgues-script)'],
        'coinbase-mono': ['var(--font-coinbase-mono)'],
        'coinbase-sans': ['var(--font-coinbase-sans)'],
      },
      colors: {
        'risd-blue': '#2151F5',
        'black': '#000000',
        'ash-gray': '#C9CEBD',
        'dark-ash-gray': '#b2b6a8',
        'lilac': '#C297B8', 
        'mimi-pink': '#FDCFF3',
        // Semantic color assignments
        'primary': '#2151F5', // RISD Blue as the primary color
        'secondary': '#C9CEBD', // Ash Gray as a subtle secondary color
        'accent': '#b2b6a8', // Dark Ash Gray as an accent color
        'highlight': '#FDCFF3', // Mimi Pink for highlights or call-to-actions
        'background': '#000000', // Black as the background color
        'text': '#FFFFFF', // White for text, assuming light text on dark background
      },
    },
  },
  plugins: [],
};
export default config;
