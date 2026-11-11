import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'

import { ignores, jsRules, tsRules } from './rules.js'

/**
 * React on Vite. A complete config:
 *
 *   import react from '@absolit/lint-config/eslint/react'
 *   export default react()
 *
 * @param {{ ignores?: string[] }} [options]
 * @returns {import('eslint').Linter.Config[]}
 */
export default function react(options = {}) {
  return defineConfig(
    { name: 'absolit/ignores', ignores: [...ignores, ...(options.ignores ?? [])] },
    js.configs.recommended,
    {
      name: 'absolit/react',
      files: ['**/*.{js,jsx,ts,tsx}'],
      extends: [reactHooks.configs.flat['recommended-latest'], reactRefresh.configs.vite],
      languageOptions: {
        globals: globals.browser,
        parserOptions: { ecmaFeatures: { jsx: true } },
      },
      rules: {
        ...jsRules,
        'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      },
    },
    {
      name: 'absolit/ts',
      files: ['**/*.{ts,tsx,mts,cts}'],
      extends: [tseslint.configs.recommended],
      rules: tsRules,
    },
    {
      name: 'absolit/node-files',
      files: ['*.{js,mjs,cjs,ts}'],
      languageOptions: { globals: globals.node },
    },
    { name: 'absolit/prettier', ...prettier },
  )
}
