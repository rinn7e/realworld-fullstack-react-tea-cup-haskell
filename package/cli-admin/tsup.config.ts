import { defineConfig } from 'tsup'

// One file for `node`: the app and the core (`@core/*`, its source) are
// bundled, the packages of `node_modules` stay imports. Except the fp ones:
// the core imports their files without extension (`fp-ts/lib/Option`),
// which Node's ESM cannot resolve, so they are bundled too.
export default defineConfig({
  entry: ['src/main.tsx'],
  format: ['esm'],
  platform: 'node',
  target: 'node22',
  clean: true,
  banner: { js: '#!/usr/bin/env node' },
  noExternal: [
    /^fp-ts/,
    /^io-ts/,
    /^@devexperts\//,
    /^@rinn7e\//,
    'tea-cup-fp',
  ],
})
