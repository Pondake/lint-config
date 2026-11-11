// Rule sets shared by the stack presets. Import them directly when a project
// wants one set without the whole preset:
//   import { vueRules } from '@absolit/lint-config/eslint/rules'

/** Paths no project wants linted. Agent worktrees under .claude carry their own build output. */
export const ignores = [
  '**/node_modules/**',
  '**/vendor/**',
  '**/dist/**',
  '**/coverage/**',
  '**/.claude/**',
  '**/.pnpm-store/**',
]

/** Plain JavaScript rules, valid in every stack. */
export const jsRules = {
  'no-debugger': 'error',
  'no-var': 'error',
  'prefer-const': 'error',
  'no-console': ['warn', { allow: ['warn', 'error'] }],
}

/** TypeScript rules, for files parsed by typescript-eslint. */
export const tsRules = {
  '@typescript-eslint/no-explicit-any': 'off',
  'no-unused-vars': 'off',
  '@typescript-eslint/no-unused-vars': [
    'warn',
    { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
  ],
}

/**
 * House Vue rules: structure and naming only. Layout (indentation, attribute
 * wrapping) is Prettier's job, so eslint-config-prettier runs after these.
 */
export const vueRules = {
  'vue/multi-word-component-names': 'off',
  'vue/block-order': ['error', { order: ['template', 'script', 'style'] }],
  'vue/component-api-style': ['error', ['script-setup']],
  'vue/block-lang': ['error', { script: { lang: 'ts', allowNoLang: false } }],
  'vue/padding-line-between-blocks': ['error', 'always'],
  'vue/define-macros-order': [
    'error',
    {
      order: ['defineOptions', 'defineModel', 'defineProps', 'defineEmits', 'defineSlots'],
      defineExposeLast: true,
    },
  ],
  'vue/prop-name-casing': ['error', 'camelCase'],
  // `registeredComponentsOnly: false` is needed to see globally registered
  // components (Nuxt UI, auto-imports). `Head` and `Link` stay PascalCase:
  // kebab-cased they become the native <head> and <link> elements, which
  // breaks page titles and turns `</link>` into a parse error.
  'vue/component-name-in-template-casing': [
    'error',
    'kebab-case',
    { registeredComponentsOnly: false, ignores: ['Head', 'Link'] },
  ],
}

/**
 * Import order. Needs eslint-plugin-import-x registered as `import`:
 * @nuxt/eslint-config does that itself, the laravel-vue preset adds it.
 */
export const importOrderRules = {
  'import/order': [
    'error',
    {
      groups: [['builtin', 'external'], ['internal'], ['parent', 'sibling', 'index'], ['type']],
      'newlines-between': 'always',
      alphabetize: { order: 'asc', caseInsensitive: true },
    },
  ],
}
