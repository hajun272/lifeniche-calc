import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#172033",
        muted: "#667085",
        line: "#E3E8EF",
        warm: "#F59E6C",
        mint: "#5CBFA7"
      },
      boxShadow: {
        soft: "0 18px 55px rgba(27, 39, 64, 0.09)"
      }
    }
  },
  plugins: []
};

export default config;
