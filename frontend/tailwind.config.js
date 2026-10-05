/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#151515",
        ivory: "#F7F4EE",
        wine: "#6B2636",
        gold: "#B99A5B",
        warm: "#E8E1D6"
      },
      fontFamily: {
        display: ["'Playfair Display'", "Georgia", "serif"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};
