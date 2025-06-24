// tailwind.config.js
export default {
  content: [
    "./index.html",
    './src/**/*.{js,ts,jsx,tsx}',  // Make sure this matches your project structure
  ],
  theme: {
    extend: {
      opacity: {
        '15': '0.15',
        '35': '0.35',
        '65': '0.65',
      },
      colors: {
        lavender: '#B3A0FF',
      },
    },
  },
  plugins: [],
}
