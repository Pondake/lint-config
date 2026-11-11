import prettier from 'eslint-config-prettier'

import { ignores, importOrderRules, jsRules, tsRules, vueRules } from './rules.js'

/**
 * House rules for Nuxt apps, layered on top of the config that @nuxt/eslint
 * generates. Returns config items, so it fits both entry points:
 *
 *   import withNuxt from './.nuxt/eslint.config.mjs'
 *   export default withNuxt(...nuxt())
 *
 *   createConfigForNuxt({ features: { stylistic: false } }).append(...nuxt())
 *
 * @param {{ importOrder?: boolean, ignores?: string[] }} [options]
 * @returns {import('eslint').Linter.Config[]}
 */
export default function nuxt(options = {}) {
  const { importOrder = true } = options

  return [
    { name: 'absolit/ignores', ignores: [...ignores, ...(options.ignores ?? [])] },
    { name: 'absolit/js', rules: jsRules },
    { name: 'absolit/ts', files: ['**/*.{ts,tsx,mts,cts,vue}'], rules: tsRules },
    { name: 'absolit/vue', files: ['**/*.vue'], rules: vueRules },
    ...(importOrder ? [{ name: 'absolit/import-order', rules: importOrderRules }] : []),
    // Last, so it switches off every layout rule above and in the Nuxt base.
    { name: 'absolit/prettier', ...prettier },
  ]
}
