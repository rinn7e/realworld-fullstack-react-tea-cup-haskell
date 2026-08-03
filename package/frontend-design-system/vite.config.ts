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

        // Element components
        'element/block/component': path.resolve(
          __dirname,
          'lib/element/block/component.tsx',
        ),
        'element/box/component': path.resolve(
          __dirname,
          'lib/element/box/component.tsx',
        ),
        'element/button/component': path.resolve(
          __dirname,
          'lib/element/button/component.tsx',
        ),
        'element/content/component': path.resolve(
          __dirname,
          'lib/element/content/component.tsx',
        ),
        'element/delete/component': path.resolve(
          __dirname,
          'lib/element/delete/component.tsx',
        ),
        'element/icon/component': path.resolve(
          __dirname,
          'lib/element/icon/component.tsx',
        ),
        'element/image/component': path.resolve(
          __dirname,
          'lib/element/image/component.tsx',
        ),
        'element/notification/component': path.resolve(
          __dirname,
          'lib/element/notification/component.tsx',
        ),
        'element/progress/component': path.resolve(
          __dirname,
          'lib/element/progress/component.tsx',
        ),
        'element/table/component': path.resolve(
          __dirname,
          'lib/element/table/component.tsx',
        ),
        'element/tag/component': path.resolve(
          __dirname,
          'lib/element/tag/component.tsx',
        ),
        'element/title/component': path.resolve(
          __dirname,
          'lib/element/title/component.tsx',
        ),

        // Grid views
        'grid/column/view': path.resolve(
          __dirname,
          'lib/grid/column/view.tsx',
        ),
        'grid/columns/view': path.resolve(
          __dirname,
          'lib/grid/columns/view.tsx',
        ),

        // Layout views
        'layout/container/view': path.resolve(
          __dirname,
          'lib/layout/container/view.tsx',
        ),
        'layout/footer/view': path.resolve(
          __dirname,
          'lib/layout/footer/view.tsx',
        ),
        'layout/hero/view': path.resolve(
          __dirname,
          'lib/layout/hero/view.tsx',
        ),
        'layout/level/view': path.resolve(
          __dirname,
          'lib/layout/level/view.tsx',
        ),
        'layout/media-object/view': path.resolve(
          __dirname,
          'lib/layout/media-object/view.tsx',
        ),
        'layout/section/view': path.resolve(
          __dirname,
          'lib/layout/section/view.tsx',
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
        'component/breadcrumb/component': path.resolve(
          __dirname,
          'lib/component/breadcrumb/component.tsx',
        ),
        'component/card/component': path.resolve(
          __dirname,
          'lib/component/card/component.tsx',
        ),
        'component/dropdown/component': path.resolve(
          __dirname,
          'lib/component/dropdown/component.tsx',
        ),
        'component/menu/component': path.resolve(
          __dirname,
          'lib/component/menu/component.tsx',
        ),
        'component/message/component': path.resolve(
          __dirname,
          'lib/component/message/component.tsx',
        ),
        'component/modal/component': path.resolve(
          __dirname,
          'lib/component/modal/component.tsx',
        ),
        'component/pagination/component': path.resolve(
          __dirname,
          'lib/component/pagination/component.tsx',
        ),
        'component/panel/component': path.resolve(
          __dirname,
          'lib/component/panel/component.tsx',
        ),
        'component/tabs/component': path.resolve(
          __dirname,
          'lib/component/tabs/component.tsx',
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
