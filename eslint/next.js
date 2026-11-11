import prettier from 'eslint-config-prettier'
import { defineConfig, globalIgnores } from 'eslint/config'

import { ignores, jsRules, tsRules } from './rules.js'

/**
 * Next.js (App Router). Builds on eslint-config-next, which the project
 * installs itself so its version matches the project's Next.js version.
 *
 *   import next from '@absolit/lint-config/eslint/next'
 *   export default await next()
 *
 * @param {{ ignores?: string[] }} [options]
 * @returns {Promise<import('eslint').Linter.Config[]>}
 */
export default async function next(options = {}) {
  let vitals
  let typescript
  try {
    vitals = (await import('eslint-config-next/core-web-vitals')).default
    typescript = (await import('eslint-config-next/typescript')).default
  } catch (error) {
    if (
      error?.code === 'ERR_MODULE_NOT_FOUND' &&
      String(error.message).includes("'eslint-config-next")
    ) {
      throw new Error(
        '@absolit/lint-config/eslint/next needs eslint-config-next: pnpm add -D eslint-config-next',
        { cause: error },
      )
    }
    throw error
  }

  return defineConfig(
    ...vitals,
    ...typescript,
    globalIgnores([
      ...ignores,
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
      ...(options.ignores ?? []),
    ]),
    { name: 'absolit/js', rules: jsRules },
    { name: 'absolit/ts', files: ['**/*.{ts,tsx,mts,cts}'], rules: tsRules },
    { name: 'absolit/prettier', ...prettier },
  )
}
