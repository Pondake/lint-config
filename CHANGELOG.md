# Changelog

## 1.0.4 - 2026-11-12

- `phpcs/bedrock.xml` skips Blade templates (`*.blade.php`). They are not PHP,
  and PSR-2 sniffs misread their directives.

## 1.0.3 - 2026-11-12

- `vue/component-name-in-template-casing` no longer renames components named
  after an HTML or SVG element (`Button`, `Input`, `Label`, `Dialog`, …).
  Kebab-casing them turned shadcn-vue components into native elements.
- `phpcs/bedrock.xml` also skips `node_modules`, `web/app/uploads` and
  `web/app/cache`.

## 1.0.2 - 2026-11-12

- `eslint-plugin-react-hooks` and `eslint-plugin-react-refresh` are now optional
  peer dependencies, so Vue and Laravel projects no longer install them.
  React projects add them themselves.
- README: how to handle `pnpm audit` findings in preset dependencies.

## 1.0.1 - 2026-11-12

- Removed repository housekeeping files that do not belong in the package.

## 1.0.0 - 2026-11-11

- ESLint 10 presets: `nuxt`, `laravel-vue`, `react`, `next`, and the shared
  rule sets in `eslint/rules`.
- Prettier presets: shared base plus `nuxt`, `laravel`, `react`, `next`.
- Pint presets `pint/laravel.json` and `pint/bedrock.json`, for `extend`.
- PHP_CodeSniffer ruleset `phpcs/bedrock.xml`.
