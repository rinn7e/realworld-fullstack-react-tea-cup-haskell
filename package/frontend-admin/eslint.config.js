import js from '@eslint/js'
import importPlugin from 'eslint-plugin-import'
import reactDom from 'eslint-plugin-react-dom'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import reactX from 'eslint-plugin-react-x'
import unusedImports from 'eslint-plugin-unused-imports'
import { globalIgnores } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'

// The move makers (code-convention.md, "Make Impossible Updates Impossible"):
// the branded types stop any other write, but not a call to their exported
// makers. Only a move holds a guarded destination and opens a screen: the
// navigation (`navigation-handler.ts`) and tests call them, the boot
// (`src/update.ts`) the guard only. The files defining them are left out.
const moveMakerFiles = ['src/util/guard.ts', 'src/type.ts']
const moveMakerUsers = ['src/handler/navigation-handler.ts', 'tests/**/*.ts']
const boot = 'src/update.ts'
// By name, so a namespace use (`Util.guardDestination`) and a computed
// access (`m['guardDestination']`) are caught too
const moveMakerUses = (makers) =>
  [
    `Identifier[name=/^(${makers.join('|')})$/]`,
    `Literal[value=/^(${makers.join('|')})$/]`,
  ].map((selector) => ({
    selector,
    message:
      'A move is made only by the navigation (`navigation-handler.ts`): navigate instead.',
  }))

export default tseslint.config([
  globalIgnores(['dist', 'src/generated', 'src/package', 'deprecated']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },

    plugins: {
      import: importPlugin,
      'unused-imports': unusedImports,
    },

    rules: {
      'no-else-return': 'off',
      'no-lonely-if': 'off',
      'no-control-regex': 'off',
      'import/no-cycle': [2, { ignoreExternal: true }],
      'import/no-duplicates': ['error', { 'prefer-inline': true }],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'inline-type-imports',
        },
      ],
      '@typescript-eslint/consistent-type-assertions': [
        'error',
        {
          assertionStyle: 'never',
        },
      ],

      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/no-explicit-any': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      // TODO: Fix this later
      'react-hooks/exhaustive-deps': 'off',

      'react-x/no-use-context': 'off',
      'react-x/no-forward-ref': 'off',
      'react-x/no-array-index-key': 'off',

      'react-dom/no-dangerously-set-innerhtml': 'off',
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    ignores: [...moveMakerFiles, ...moveMakerUsers, boot],
    rules: {
      'no-restricted-syntax': [
        'error',
        ...moveMakerUses(['guardDestination', 'currentScreenModelOfMove']),
      ],
    },
  },
  {
    files: [boot],
    rules: {
      'no-restricted-syntax': [
        'error',
        ...moveMakerUses(['currentScreenModelOfMove']),
      ],
    },
  },
])
