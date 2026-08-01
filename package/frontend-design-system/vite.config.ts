import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ['lib/**/*'],
      outDir: 'dist',
    }),
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    lib: {
      entry: {
        index: path.resolve(__dirname, 'lib/index.ts'),
        plugin: path.resolve(__dirname, 'lib/plugin.ts'),
      },
      name: 'RealWorldDesignSystem',
      fileName: (format, entryName) =>
        format === 'es' ? `${entryName}.mjs` : `${entryName}.js`,
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react-tea-cup',
        'tea-cup-fp',
        'fp-ts',
        'tailwindcss',
        'tailwindcss/plugin',
        'fs',
        'path',
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react-tea-cup': 'ReactTeaCup',
          'tea-cup-fp': 'TeaCupFp',
          'fp-ts': 'FpTs',
        },
      },
    },
  },
})
