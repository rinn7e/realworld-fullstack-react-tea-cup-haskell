import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@rinn7e/realworld-design-system/styles.css': path.resolve(
        __dirname,
        '../../lib/styles.css',
      ),
      '@rinn7e/realworld-design-system': path.resolve(
        __dirname,
        '../../lib/index.ts',
      ),
    },
  },
  server: {
    port: 5175,
    open: true,
    fs: {
      allow: [path.resolve(__dirname, '../..')],
    },
  },
})
