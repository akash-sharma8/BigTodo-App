const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
  darkMode: "class", // important
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
};


export default config;
