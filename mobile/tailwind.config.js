/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        navy: {
          light: '#3b4a6b',
          DEFAULT: '#1c2a48',
          dark: '#111b30'
        },
        beige: {
          light: '#f5f5dc',
          DEFAULT: '#f3efe4',
          dark: '#e1dccc'
        }
      },
      borderRadius: {
        xl: '1.25rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [],
}