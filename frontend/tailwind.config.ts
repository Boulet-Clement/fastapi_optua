import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/styles/tiptap.scss"
  ],
  theme: {
    extend: {
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1240px",
      },
      colors: {
        "primary": "var(--color-primary)",
        "primary-light": "var(--color-primary-light)",
        "primary-dark": "var(--color-primary-dark)",
        
        /*"secondary": "var(--color-secondary)",
        "secondary-light": "var(--color-secondary-light)",
        "secondary-dark": "var(--color-secondary-dark)",*/

        "grey-light": "var(--color-grey-light)",
        "grey-dark": "var(--color-grey-dark)",

        "green": "var(--color-green)",
        "green-light": "var(--color-green-light)",
        "green-dark": "var(--color-green-dark)",

        "red": "var(--color-red)",
        "red-light": "var(--color-red-light)",
        "red-dark": "var(--color-red-dark)",
        
        white: "#FFFFFF",
        black: "#000000",
        "light-gray": "#f7fafc",
      },
      fontFamily: {
        sans: ["Arial", "Helvetica", "sans-serif"],
        mono: ["monospace"],
      },
    },
  },
  darkMode: "class", // permet le dark mode via <html class="dark">
  plugins: [typography],
};

export default config;
