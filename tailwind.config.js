/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1769c7",
        dodgerblue: "dodgerblue",
        green: "#6bc144",
        orange: "#fbb32b",
        unavailable: "#a6a6a6",
      },
      backgroundImage: {
        objectImage: "url('./src/assets/images/project-icon.png')",
      },
      screens: {
        sx: { max: "640px" },
      },
      boxShadow: {
        best: "0 5px 10px rgba(0, 0, 0, 0.3)",
      }
    },
  },
  plugins: [],
};
