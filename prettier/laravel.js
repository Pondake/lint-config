import base from './base.js'

/**
 * Laravel projects follow the Laravel starter kit: four-space indent (as in
 * Laravel's .editorconfig and PHP code), semicolons and a wider line.
 *
 * @type {import('prettier').Config}
 */
export default {
  ...base,
  semi: true,
  tabWidth: 4,
  printWidth: 150,
  overrides: [{ files: '**/*.{yml,yaml}', options: { tabWidth: 2 } }],
}
