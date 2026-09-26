/// <reference types="vitest/config" />
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.tsx', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@rinn7e/realworld-design-system/plugin': path.resolve(
        __dirname,
        '../../dist/plugin.mjs',
      ),
      '@rinn7e/realworld-design-system$': path.resolve(
        __dirname,
        '../../dist/index.mjs',
      ),
      '@rinn7e/realworld-design-system': path.resolve(__dirname, '../../dist'),
    },
  },
  server: {
    port: 5175,
    open: false,
    fs: {
      allow: [path.resolve(__dirname, '../..')],
    },
  },
  test: {
    server: {
      deps: {
        inline: ['@rinn7e/tea-cup-prelude', '@rinn7e/fp-ts-routing', 'fp-ts'],
      },
    },
  },
})
