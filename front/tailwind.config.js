export default {
    content: [
      "./src/**/*.{html,ts}", 
    ],
    theme: {
      extend: {},
      screens: {
        'portrait': { 'raw': '(orientation: portrait)' },
        'landscape': { 'raw': '(orientation: landscape)' },
      }
    },
    plugins: [],
  }