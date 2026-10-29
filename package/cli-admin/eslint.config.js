import js from '@eslint/js'
import importPlugin from 'eslint-plugin-import'
import reactHooks from 'eslint-plugin-react-hooks'
import unusedImports from 'eslint-plugin-unused-imports'
import { globalIgnores } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'

// The move makers (code-convention.md of frontend-admin, "Make Impossible
// Updates Impossible"): the branded types stop any other write, but not a
// call to their exported makers. Only a move holds a guarded destination
// and opens a screen: the navigation and the boot of the core
// (`frontend-admin-core`, which checks its own files) and tests call them.
// Nothing in this app does.
const moveMakerUsers = ['tests/**/*.ts']
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
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.node,
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
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    ignores: moveMakerUsers,
    rules: {
      'no-restricted-syntax': [
        'error',
        ...moveMakerUses(['guardDestination', 'currentScreenModelOfMove']),
      ],
    },
  },
])
