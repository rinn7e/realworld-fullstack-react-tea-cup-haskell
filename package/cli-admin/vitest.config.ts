import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    server: {
      deps: {
        inline: [
          '@rinn7e/tea-cup-prelude',
          '@rinn7e/tea-cup-pagination',
          'fp-ts',
        ],
      },
    },
  },
})
