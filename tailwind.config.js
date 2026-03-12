/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"] ,
  theme: {
    extend: {
      fontFamily: {
        sans: ["Space Grotesk", "Manrope", "sans-serif"]
      },
      colors: {
        brand: {
          blue: "#2F80ED",
          green: "#27AE60",
          amber: "#F2994A",
          violet: "#9B51E0",
          ink: "#0f172a"
        }
      },
      boxShadow: {
        card: "0 18px 40px rgba(15, 23, 42, 0.12)"
      },
      backgroundImage: {
        app: "radial-gradient(circle at top, #eef2ff, #f5f6fa 60%, #f8fafc 100%)"
      }
    }
  },
  plugins: []
};
