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

        // Grid components
        'grid/column/component': path.resolve(
          __dirname,
          'lib/grid/column/component.tsx',
        ),
        'grid/columns/component': path.resolve(
          __dirname,
          'lib/grid/columns/component.tsx',
        ),

        // Layout components
        'layout/container/component': path.resolve(
          __dirname,
          'lib/layout/container/component.tsx',
        ),
        'layout/footer/component': path.resolve(
          __dirname,
          'lib/layout/footer/component.tsx',
        ),
        'layout/hero/component': path.resolve(
          __dirname,
          'lib/layout/hero/component.tsx',
        ),
        'layout/level/component': path.resolve(
          __dirname,
          'lib/layout/level/component.tsx',
        ),
        'layout/media-object/component': path.resolve(
          __dirname,
          'lib/layout/media-object/component.tsx',
        ),
        'layout/section/component': path.resolve(
          __dirname,
          'lib/layout/section/component.tsx',
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
        'component/popover': path.resolve(
          __dirname,
          'lib/component/popover/index.ts',
        ),
        'component/popover/component': path.resolve(
          __dirname,
          'lib/component/popover/component.tsx',
        ),
        'component/tabs/component': path.resolve(
          __dirname,
          'lib/component/tabs/component.tsx',
        ),
        'component/floating-sidebar': path.resolve(
          __dirname,
          'lib/component/floating-sidebar/index.ts',
        ),
        'component/floating-sidebar/component': path.resolve(
          __dirname,
          'lib/component/floating-sidebar/component.tsx',
        ),
        'component/sidebar': path.resolve(
          __dirname,
          'lib/component/sidebar/index.ts',
        ),
        'component/sidebar/component': path.resolve(
          __dirname,
          'lib/component/sidebar/component.tsx',
        ),
        // Form components
        'form/checkbox/component': path.resolve(
          __dirname,
          'lib/form/checkbox/component.tsx',
        ),
        'form/field/component': path.resolve(
          __dirname,
          'lib/form/field/component.tsx',
        ),
        'form/file/component': path.resolve(
          __dirname,
          'lib/form/file/component.tsx',
        ),
        'form/input/component': path.resolve(
          __dirname,
          'lib/form/input/component.tsx',
        ),
        'form/radio/component': path.resolve(
          __dirname,
          'lib/form/radio/component.tsx',
        ),
        'form/select/component': path.resolve(
          __dirname,
          'lib/form/select/component.tsx',
        ),
        'form/textarea/component': path.resolve(
          __dirname,
          'lib/form/textarea/component.tsx',
        ),

        // Misc components
        'misc/dot-loading/component': path.resolve(
          __dirname,
          'lib/misc/dot-loading/component.tsx',
        ),

        // Shared types
        'type/animate': path.resolve(__dirname, 'lib/type/animate.ts'),
        'type/nav-item': path.resolve(__dirname, 'lib/type/nav-item.ts'),
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
