/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./@next/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        tomorrow: ["Tomorrow"],
        epilogue: ["Epilogue"],
        exo: ["Exo"],
      },
      colors: {
        "header-grad-1": "rgba(255, 0, 0, 0.01)",
        "header-grad-2": "rgba(255, 78, 255, 0.02)",
        "header-grad-3": "rgba(247, 249, 255, 0.1)",
        "dropdown-menu": "rgba(255, 255, 255, 1)",
        walletAddress: "rgba(255, 106, 204, 0.1)",
      },
    },
  },
  plugins: [],
};
