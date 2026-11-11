import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

/**
 * Shared Prettier options. Stack presets spread this and change only what
 * differs. The Tailwind plugin is resolved to an absolute path here, so the
 * project does not need to install it (pnpm would not expose it otherwise).
 * It sorts nothing in projects without Tailwind.
 *
 * @type {import('prettier').Config}
 */
const base = {
  semi: false,
  singleQuote: true,
  trailingComma: 'all',
  tabWidth: 2,
  printWidth: 100,
  endOfLine: 'lf',
  plugins: [require.resolve('prettier-plugin-tailwindcss')],
  tailwindFunctions: ['clsx', 'cn', 'cva', 'tv'],
}

export default base
