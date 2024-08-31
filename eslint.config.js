import node from '@strv/eslint-config-node'
import nodeOptional from '@strv/eslint-config-node/optional'
import nodeStyle from '@strv/eslint-config-node/style'
import ts from '@strv/eslint-config-typescript'
import tsOptional from '@strv/eslint-config-typescript/optional'
import tsStyle from '@strv/eslint-config-typescript/style'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

const jsFiles = '{*,.*}.{js,cjs}'
const tsFiles = '**/*.ts'
const tsxFiles = '**/*.tsx'

/** @type {Array<import("eslint").Linter.FlatConfig>} */
const config = [

  // General

  {
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    ignores: ['node_modules', 'dist'],
  },


  // JavaScript

  { files: [jsFiles], ...node },
  { files: [jsFiles], ...nodeOptional },
  { files: [jsFiles], ...nodeStyle },


  // TypeScript

  {
    files: [tsFiles, tsxFiles],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        project: ['./tsconfig.json', './src/server/tsconfig.json', './src/ui/tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  { files: [tsFiles], ...node },
  { files: [tsFiles], ...nodeOptional },
  { files: [tsFiles], ...nodeStyle },

  {
    files: [tsxFiles],
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },

  { files: [tsFiles, tsxFiles], ...ts },
  { files: [tsFiles, tsxFiles], ...tsOptional },
  { files: [tsFiles, tsxFiles], ...tsStyle },
  {
    files: [tsFiles, tsxFiles],
    rules: {
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/indent': ['warn', 2],
      '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: { arguments: false } }],
    },
  },


  // Global overrides

  {
    files: [jsFiles, tsFiles, tsxFiles],
    rules: {
      'id-length': 'off',
      'no-inline-comments': 'off',
      'no-undefined': 'off',
      '@stylistic/indent': ['warn', 2],
      '@stylistic/max-len': ['warn', {
        code: 160,
        ignoreTrailingComments: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
      }],
      '@stylistic/padding-line-between-statements': 'off',
    },
  },
]

export default config
