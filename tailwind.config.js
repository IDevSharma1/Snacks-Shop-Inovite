/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FBF1E6',
        coral: '#FF7F7E',
        charcoal: '#3C3C3C',
        chip: '#F6F3EF',
        banana: '#FBE49B',
        blush: '#F7C3BC',
      },
      boxShadow: {
        soft: '0 10px 25px rgba(0,0,0,0.08)',
      },
      fontFamily: {
        heading: ['Poppins', 'ui-sans-serif', 'system-ui'],
        body: ['Inter', 'ui-sans-serif', 'system-ui']
      },
      borderRadius: {
        xl2: '1.25rem'
      }
    },
  },
  plugins: [],
}


