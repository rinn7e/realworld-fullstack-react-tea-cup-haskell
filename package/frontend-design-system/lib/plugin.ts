import plugin from 'tailwindcss/plugin'

export const realworldPlugin = plugin(
  function ({ addBase, addUtilities }) {
    addBase({
      '@keyframes indeterminate': {
        '0%': { transform: 'translate(-100%) scaleX(.2)' },
        '50%': { transform: 'translate(0) scaleX(.5)' },
        '100%': { transform: 'translate(100%) scaleX(.2)' },
      },
    })
    addUtilities({
      '.animate-indeterminate': {
        'transform-origin': '0%',
        animation: '1.5s linear infinite indeterminate',
      },
    })
  },
  {
    theme: {
      extend: {
        fontFamily: {
          titillium: ['"Titillium Web"', 'sans-serif'],
        },
      },
    },
  },
)

export default realworldPlugin
