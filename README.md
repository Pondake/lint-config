# @absolit/lint-config

Shared lint and format presets, one per stack, so a project installs one
package instead of copying `eslint.config.*`, `.prettierrc` and `pint.json`.

| Stack                   | ESLint               | Prettier           | PHP                                      |
| ----------------------- | -------------------- | ------------------ | ---------------------------------------- |
| Nuxt 4                  | `eslint/nuxt`        | `prettier/nuxt`    | –                                        |
| Laravel + Inertia + Vue | `eslint/laravel-vue` | `prettier/laravel` | `pint/laravel.json`                      |
| React on Vite           | `eslint/react`       | `prettier/react`   | –                                        |
| Next.js                 | `eslint/next`        | `prettier/next`    | –                                        |
| WordPress Bedrock       | –                    | –                  | `pint/bedrock.json`, `phpcs/bedrock.xml` |

Requires ESLint 10 (Node `^20.19 || ^22.13 || >=24`) and Prettier 3.

## What is shared

- `eslint/rules` exports the rule sets the presets are built from, for a
  project that wants one set without a whole preset:
  - `ignores`: `node_modules`, `vendor`, `dist`, `.claude` worktrees, …
  - `jsRules`: `no-debugger`, `no-var`, `prefer-const`, `no-console` (warn).
  - `tsRules`: `no-explicit-any` off, unused vars warn unless prefixed `_`.
  - `vueRules`: template → script → style, `<script setup lang="ts">` only,
    macro order, kebab-case components (names of HTML elements such as `Button` or `Head` excepted).
  - `importOrderRules`: grouped, alphabetised imports (Nuxt and Laravel + Vue).
- Layout is Prettier's job. Every preset ends with `eslint-config-prettier`.
- `prettier` is the base: no semicolons, single quotes, trailing commas,
  2 spaces, 100 columns, Tailwind class sorting. `prettier/laravel` changes
  only what the Laravel starter kit does differently: semicolons, 4 spaces,
  150 columns.

## Install

The package is a git dependency, pinned to a tag. pnpm and npm both work.

```bash
pnpm add -D eslint prettier "@absolit/lint-config@github:Pondake/lint-config#v1.0.4"
```

Check that `package.json` still ends in `#v1.0.4`: some pnpm versions drop the
tag on `pnpm add`. If it is gone, put it back and run `pnpm install`.

PHP presets come from the same repository through Composer:

```json
{
  "repositories": [{ "type": "vcs", "url": "https://github.com/Pondake/lint-config.git" }],
  "require-dev": { "absolit/lint-config": "^1.0" }
}
```

Remove the plugins the preset now brings along: `@nuxt/eslint-config`,
`eslint-config-prettier`, `eslint-plugin-vue`, `eslint-plugin-import`,
`typescript-eslint`, `@eslint/js`, `globals`, `prettier-plugin-tailwindcss`.
Keep `eslint`, `prettier` and, in Nuxt, the `@nuxt/eslint` module.

`pnpm audit` can flag advisories in the preset's dependencies (for example
`minimatch` via `eslint-plugin-import-x`). A git dependency cannot override them
for you; add a `pnpm.overrides` entry (or `overrides` in `pnpm-workspace.yaml`)
in the project.

## Use

### Nuxt

```js
// eslint.config.mjs
import nuxt from '@absolit/lint-config/eslint/nuxt'

import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(...nuxt())
```

Without the `@nuxt/eslint` module:
`createConfigForNuxt({ features: { stylistic: false } }).append(...nuxt())`.

### Laravel + Inertia + Vue

```js
// eslint.config.mjs
import laravelVue from '@absolit/lint-config/eslint/laravel-vue'

export default laravelVue({ ignores: ['resources/js/vendor/**'] })
```

Options: `ignores`, `globals` (extra browser globals, e.g. `{ axios: 'readonly' }`),
`importOrder: false` (for projects that sort imports with
`prettier-plugin-organize-imports`).

### React on Vite

The React plugins are optional peers, so other stacks do not install them:

```bash
pnpm add -D eslint-plugin-react-hooks eslint-plugin-react-refresh
```

```js
// eslint.config.js
import react from '@absolit/lint-config/eslint/react'

export default react()
```

### Next.js

Install `eslint-config-next` at the project's Next.js version, then:

```js
// eslint.config.mjs
import next from '@absolit/lint-config/eslint/next'

export default await next()
```

### Prettier

```js
// prettier.config.mjs
export { default } from '@absolit/lint-config/prettier/nuxt'
```

Overriding one option:

```js
import laravel from '@absolit/lint-config/prettier/laravel'

export default { ...laravel, printWidth: 140 }
```

Tailwind v4 projects that use their own utilities add
`tailwindStylesheet: './resources/css/app.css'` so those classes sort too.

### Pint

```json
{
  "extend": "vendor/absolit/lint-config/pint/laravel.json",
  "exclude": ["lib/some-vendored-client"]
}
```

`extend` needs a recent Pint (tested with 1.32). Rules in the project file
are merged over the preset. `exclude` is **not** merged: list every exclude
in the project file. Bedrock projects extend `pint/bedrock.json` and exclude
`web/wp`, `web/app/plugins` and the bundled `twenty*` themes themselves.

### PHP_CodeSniffer (Bedrock)

```xml
<?xml version="1.0"?>
<ruleset name="Project">
  <file>.</file>
  <rule ref="./vendor/absolit/lint-config/phpcs/bedrock.xml"/>
</ruleset>
```

## Project-specific rules

Append them after the preset. They win because they come later:

```js
export default withNuxt(...nuxt(), {
  files: ['app/pages/legal/**/*.vue'],
  rules: { 'vue/no-v-html': 'off' },
})
```

When the same override shows up in a second project, move it into this
package instead.

## Adopting it in a project

1. Install as above, remove the plugins listed under Install.
2. Replace `eslint.config.*` with the preset plus project overrides only.
3. Replace `.prettierrc*` with a `prettier.config.mjs` that re-exports the
   stack preset (with overrides if the project must keep its own style).
4. Laravel: `composer require --dev absolit/lint-config`, shrink `pint.json`
   to `extend` + project rules + `exclude`.
5. Run `eslint . --fix`, then `eslint .` until clean. Most findings
   (block order, component casing, import order) are autofixable.
6. Run `prettier --write` only in a commit of its own, so the reformat
   stays out of feature diffs.
7. Build the app once: the autofix renames components in templates.

## Releasing

1. Change the presets, add a test in `test/presets.test.js`, run `pnpm test`.
2. Note the change in `CHANGELOG.md`, bump `version` in `package.json`.
3. Commit, tag `vX.Y.Z`, push the tag.
4. Projects move by changing `#vX.Y.Z` in their `package.json` and running
   `composer update absolit/lint-config`.

A rule that makes existing projects fail lint is a major version.
