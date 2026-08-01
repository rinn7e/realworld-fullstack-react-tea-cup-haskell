import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@rinn7e/frontend-design-system': path.resolve(
        __dirname,
        '../../lib/index.ts',
      ),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
})
