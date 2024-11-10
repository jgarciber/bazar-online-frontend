/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,vue}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('tailwindcss/plugin')(({ addVariant }) => {
      addVariant('search-cancel', '&::-webkit-search-cancel-button');
    }),
    require('flowbite/plugin'),
  ],
  variants: {
    extend: {
      opacity: ['disabled'],
    }
  },
}

// module.exports = {

//   content: [
//       "./node_modules/flowbite/**/*.js"
//   ]

// }

