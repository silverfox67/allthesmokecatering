import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/config/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/data/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        obsidian: "#0A0A0A",
        charcoal: "#121212",
        ember: "#F59E0B",
        "ember-dark": "#D97706",
        crimson: "#990000",
      },
      fontFamily: {
        display: ["var(--font-display)", "Bebas Neue", "Oswald", "Impact", "sans-serif"],
        sans: ["var(--font-body)", "Inter", "Geist", "sans-serif"],
        body: ["var(--font-body)", "Inter", "Geist", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
