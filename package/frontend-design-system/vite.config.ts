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

        // Type
        'type/nav-item': path.resolve(__dirname, 'lib/type/nav-item.ts'),

        // Element views
        'element/block/view': path.resolve(
          __dirname,
          'lib/element/block/view.tsx',
        ),
        'element/box/view': path.resolve(
          __dirname,
          'lib/element/box/view.tsx',
        ),
        'element/button/view': path.resolve(
          __dirname,
          'lib/element/button/view.tsx',
        ),
        'element/content/view': path.resolve(
          __dirname,
          'lib/element/content/view.tsx',
        ),
        'element/delete/view': path.resolve(
          __dirname,
          'lib/element/delete/view.tsx',
        ),
        'element/icon/view': path.resolve(
          __dirname,
          'lib/element/icon/view.tsx',
        ),
        'element/image/view': path.resolve(
          __dirname,
          'lib/element/image/view.tsx',
        ),
        'element/notification/view': path.resolve(
          __dirname,
          'lib/element/notification/view.tsx',
        ),
        'element/progress/view': path.resolve(
          __dirname,
          'lib/element/progress/view.tsx',
        ),
        'element/table/view': path.resolve(
          __dirname,
          'lib/element/table/view.tsx',
        ),
        'element/tag/view': path.resolve(
          __dirname,
          'lib/element/tag/view.tsx',
        ),
        'element/title/view': path.resolve(
          __dirname,
          'lib/element/title/view.tsx',
        ),

        // Component entries
        'component/generic-link': path.resolve(
          __dirname,
          'lib/component/generic-link/index.tsx',
        ),
        'component/navbar': path.resolve(
          __dirname,
          'lib/component/navbar/index.ts',
        ),
        'component/navbar/component': path.resolve(
          __dirname,
          'lib/component/navbar/component.tsx',
        ),
        'component/breadcrumb/view': path.resolve(
          __dirname,
          'lib/component/breadcrumb/view.tsx',
        ),
        'component/card/view': path.resolve(
          __dirname,
          'lib/component/card/view.tsx',
        ),
        'component/dropdown/view': path.resolve(
          __dirname,
          'lib/component/dropdown/view.tsx',
        ),
        'component/menu/view': path.resolve(
          __dirname,
          'lib/component/menu/view.tsx',
        ),
        'component/message/view': path.resolve(
          __dirname,
          'lib/component/message/view.tsx',
        ),
        'component/modal/view': path.resolve(
          __dirname,
          'lib/component/modal/view.tsx',
        ),
        'component/pagination/view': path.resolve(
          __dirname,
          'lib/component/pagination/view.tsx',
        ),
        'component/panel/view': path.resolve(
          __dirname,
          'lib/component/panel/view.tsx',
        ),
        'component/tabs/view': path.resolve(
          __dirname,
          'lib/component/tabs/view.tsx',
        ),
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
