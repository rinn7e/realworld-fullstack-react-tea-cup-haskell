import { defineConfig } from 'tsup'

// One file for `node`: the app is bundled, the packages of `node_modules`
// stay imports. Except the fp ones: the app imports their files without
// extension (`fp-ts/lib/Option`), which Node's ESM cannot resolve, so they
// are bundled too.
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
