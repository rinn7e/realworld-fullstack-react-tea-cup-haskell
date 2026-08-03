import plugin from 'tailwindcss/plugin'

export const realworldPlugin = plugin(
  function ({ addUtilities }) {
    addUtilities({
      '.delay-200': {
        'animation-delay': '0.2s',
      },
      '.delay-400': {
        'animation-delay': '0.4s',
      },
    })
  },
  {
    theme: {
      extend: {
        fontFamily: {
          titillium: ['"Titillium Web"', 'sans-serif'],
        },
        keyframes: {
          slideIn: {
            '0%': { transform: 'translateX(100%)' },
            '100%': { transform: 'translateX(0)' },
          },
          slideOut: {
            '0%': { transform: 'translateX(0)' },
            '100%': { transform: 'translateX(100%)' },
          },
          slideInLeft: {
            '0%': { transform: 'translateX(-100%)' },
            '100%': { transform: 'translateX(0)' },
          },
          slideOutLeft: {
            '0%': { transform: 'translateX(0)' },
            '100%': { transform: 'translateX(-100%)' },
          },
          fadeIn: {
            '0%': { opacity: '0' },
            '100%': { opacity: '1' },
          },
          fadeOut: {
            '0%': { opacity: '1' },
            '100%': { opacity: '0' },
          },
          flicker: {
            '0%, 100%': { opacity: '0.2' },
            '50%': { opacity: '1' },
          },
          indeterminate: {
            '0%': { transform: 'translateX(-100%) scaleX(.2)' },
            '50%': { transform: 'translateX(0) scaleX(.5)' },
            '100%': { transform: 'translateX(100%) scaleX(.2)' },
          },
        },
        animation: {
          'slide-in': 'slideIn 0.15s cubic-bezier(0, 0, 0.2, 1) forwards',
          'slide-out': 'slideOut 0.15s cubic-bezier(0, 0, 0.2, 1) forwards',
          'slide-in-left':
            'slideInLeft 0.15s cubic-bezier(0, 0, 0.2, 1) forwards',
          'slide-out-left':
            'slideOutLeft 0.15s cubic-bezier(0, 0, 0.2, 1) forwards',
          'fade-in': 'fadeIn 0.15s cubic-bezier(0, 0, 0.2, 1) forwards',
          'fade-out': 'fadeOut 0.15s cubic-bezier(0, 0, 0.2, 1) forwards',
          flicker: 'flicker 1.4s infinite both',
          indeterminate: 'indeterminate 1.5s linear infinite',
        },
      },
    },
  },
)

export default realworldPlugin
