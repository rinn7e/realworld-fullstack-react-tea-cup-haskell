import js from '@eslint/js'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import unusedImports from 'eslint-plugin-unused-imports'
import globals from 'globals'
import tseslint from 'typescript-eslint'

// The move maker (code-convention.md, "Make Impossible Updates Impossible"):
// the branded type stops any other write, but not a call to its exported
// maker. Only a move opens a screen: the navigation (`navigation-handler.ts`)
// and tests call it. The file defining it is left out.
const moveMakerFiles = ['src/type.ts']
const moveMakerUsers = ['src/handler/navigation-handler.ts', 'tests/**/*.ts']
// By name, so a namespace use (`Type.currentScreenModelOfMove`) and a
// computed access (`m['currentScreenModelOfMove']`) are caught too
const moveMakerUses = (makers) =>
  [
    `Identifier[name=/^(${makers.join('|')})$/]`,
    `Literal[value=/^(${makers.join('|')})$/]`,
  ].map((selector) => ({
    selector,
    message:
      'A move is made only by the navigation (`navigation-handler.ts`): navigate instead.',
  }))

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'unused-imports': unusedImports,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'unused-imports/no-unused-imports': 'error',
      '@typescript-eslint/consistent-type-assertions': [
        'error',
        {
          assertionStyle: 'never',
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    ignores: [...moveMakerFiles, ...moveMakerUsers],
    rules: {
      'no-restricted-syntax': [
        'error',
        ...moveMakerUses(['currentScreenModelOfMove']),
      ],
    },
  },
)
