import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        teko: ["Teko", "sans-serif"],
      },

      colors: {
          'dark-blue' : "#2A3342",
          'grey' : '#556987',
          'light-grey' : '#E7E7E9',
          'loading-grey': '#d1d5db',
          'orange' : '#F1723B',
          'light-orange' : "#ff853e"
      }
    },
  },
  plugins: [],
} satisfies Config;
