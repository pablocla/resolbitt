// tailwind.config.js
<<<<<<< HEAD
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./public/index.html"],
  darkMode: "class", // Esto permite usar la clase 'dark' para cambiar los temas
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
=======

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
>>>>>>> 6b7626470a55dafe12231f2164104a1a31fd70de
  },
  plugins: [],
};
