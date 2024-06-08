module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: "media", // o elimina esta línea si no necesitas dark mode
  theme: {
    extend: {
      colors: {
        "purple-200": "#E0BBE4", // Color medio violeta
      },
    },
  },
  plugins: [],
};
