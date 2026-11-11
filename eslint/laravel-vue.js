import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import importX from 'eslint-plugin-import-x'
import vue from 'eslint-plugin-vue'
import { defineConfig } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'

import { ignores, importOrderRules, jsRules, tsRules, vueRules } from './rules.js'

/** Laravel output and generated code that never needs linting. */
const laravelIgnores = [
  '**/public/**',
  '**/bootstrap/ssr/**',
  '**/bootstrap/cache/**',
  '**/storage/**',
  // shadcn-vue components from the Laravel starter kit are generated code.
  'resources/js/components/ui/**',
]

/**
 * Laravel + Inertia + Vue (Vite). A complete config: export it as is, or
 * spread it and append project rules.
 *
 *   import laravelVue from '@absolit/lint-config/eslint/laravel-vue'
 *   export default laravelVue({ ignores: ['resources/js/vendor/**'] })
 *
 * @param {{ ignores?: string[], globals?: Record<string, 'readonly' | 'writable'>, importOrder?: boolean }} [options]
 * @returns {import('eslint').Linter.Config[]}
 */
export default function laravelVue(options = {}) {
  const { importOrder = true } = options

  return defineConfig(
    {
      name: 'absolit/ignores',
      ignores: [...ignores, ...laravelIgnores, ...(options.ignores ?? [])],
    },
    js.configs.recommended,
    tseslint.configs.recommended,
    vue.configs['flat/recommended'],
    {
      name: 'absolit/vue-parser',
      files: ['**/*.vue'],
      languageOptions: {
        parserOptions: { parser: tseslint.parser, extraFileExtensions: ['.vue'] },
      },
    },
    {
      name: 'absolit/globals',
      languageOptions: {
        globals: {
          ...globals.browser,
          // Ziggy's route() helper, exposed globally by the @routes directive.
          route: 'readonly',
          ...options.globals,
        },
      },
    },
    {
      name: 'absolit/node-files',
      files: ['*.{js,mjs,cjs,ts}', 'tests/**/*.{js,ts}'],
      languageOptions: { globals: globals.node },
    },
    { name: 'absolit/js', rules: jsRules },
    { name: 'absolit/ts', files: ['**/*.{ts,tsx,mts,cts,vue}'], rules: tsRules },
    { name: 'absolit/vue', files: ['**/*.vue'], rules: vueRules },
    // Registered as `import`, the name @nuxt/eslint-config uses, so rule
    // names and inline disables are the same in every stack.
    ...(importOrder
      ? [{ name: 'absolit/import-order', plugins: { import: importX }, rules: importOrderRules }]
      : []),
    { name: 'absolit/prettier', ...prettier },
  )
}
