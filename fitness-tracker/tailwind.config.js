// tailwind.config.js
export default {
  content: [
    "./index.html",
    './src/**/*.{js,ts,jsx,tsx}',  // Make sure this matches your project structure
  ],
  theme: {
    extend: {
      colors: {
        lavender: '#B3A0FF',
      },
    },
  },
  plugins: [],
}
