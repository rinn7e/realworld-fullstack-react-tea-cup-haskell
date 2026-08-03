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
