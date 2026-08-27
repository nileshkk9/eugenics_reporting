/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        sidebar: {
          DEFAULT: "#7386d5",
          header: "#6d7fcc",
          hover: "#5d6fbc",
        },
        brand: {
          blue: "#3498db",
          "blue-dark": "#2f87c2",
          red: "#c41230",
          "red-dark": "#a30f28",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
