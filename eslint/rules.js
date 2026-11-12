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
 * Component names that, lower-cased, are HTML or SVG elements. The template
 * casing rule must leave them alone: autofixing them to kebab-case silently
 * swaps the component for the native element.
 */
const nativeElementNames = [
  'A',
  'Abbr',
  'Address',
  'Area',
  'Article',
  'Aside',
  'Audio',
  'B',
  'Base',
  'Bdi',
  'Bdo',
  'Blockquote',
  'Body',
  'Br',
  'Button',
  'Canvas',
  'Caption',
  'Circle',
  'Cite',
  'Code',
  'Col',
  'Colgroup',
  'Data',
  'Datalist',
  'Dd',
  'Defs',
  'Del',
  'Desc',
  'Details',
  'Dfn',
  'Dialog',
  'Div',
  'Dl',
  'Dt',
  'Ellipse',
  'Em',
  'Embed',
  'Fieldset',
  'Figcaption',
  'Figure',
  'Filter',
  'Footer',
  'Form',
  'G',
  'H1',
  'H2',
  'H3',
  'H4',
  'H5',
  'H6',
  'Head',
  'Header',
  'Hgroup',
  'Hr',
  'Html',
  'I',
  'Iframe',
  'Image',
  'Img',
  'Input',
  'Ins',
  'Kbd',
  'Label',
  'Legend',
  'Li',
  'Line',
  'Link',
  'Main',
  'Map',
  'Mark',
  'Marker',
  'Mask',
  'Menu',
  'Meta',
  'Meter',
  'Nav',
  'Noscript',
  'Object',
  'Ol',
  'Optgroup',
  'Option',
  'Output',
  'P',
  'Path',
  'Pattern',
  'Picture',
  'Polygon',
  'Polyline',
  'Pre',
  'Progress',
  'Q',
  'Rect',
  'S',
  'Samp',
  'Script',
  'Search',
  'Section',
  'Select',
  'Slot',
  'Small',
  'Source',
  'Span',
  'Stop',
  'Strong',
  'Style',
  'Sub',
  'Summary',
  'Sup',
  'Svg',
  'Symbol',
  'Table',
  'Tbody',
  'Td',
  'Template',
  'Text',
  'Textarea',
  'Tfoot',
  'Th',
  'Thead',
  'Time',
  'Title',
  'Tr',
  'Track',
  'U',
  'Ul',
  'Use',
  'Var',
  'Video',
  'View',
  'Wbr',
]

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
  // components (Nuxt UI, auto-imports). Components named after an HTML or SVG
  // element stay PascalCase: kebab-cased, `<Button>` (shadcn-vue) becomes the
  // native <button>, `<Head>` the document <head>, and `</Link>` a parse error.
  'vue/component-name-in-template-casing': [
    'error',
    'kebab-case',
    { registeredComponentsOnly: false, ignores: nativeElementNames },
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
