import plugin from 'tailwindcss/plugin'

export const realworldPlugin = plugin(
  function () {
    // RealWorld Design System Tailwind Plugin
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
