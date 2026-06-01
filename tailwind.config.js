/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      animation: {
        "aurora":          "aurora-gradient 14s ease-in-out infinite",
        "connect-pulse":   "connect-pulse 1.2s ease-in-out infinite",
      },
      keyframes: {
        "aurora-gradient": {
          "0%, 100%": { backgroundPosition: "0% 50%"   },
          "50%":       { backgroundPosition: "100% 50%" },
        },
        "connect-pulse": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(168, 85, 247, 0.7)"  },
          "50%":       { boxShadow: "0 0 0 12px rgba(168, 85, 247, 0)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
