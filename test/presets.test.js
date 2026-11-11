// Smoke tests: every preset loads under ESLint 10 and reports what it should.
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { test } from 'node:test'

import { createConfigForNuxt } from '@nuxt/eslint-config'
import { ESLint } from 'eslint'
import * as prettier from 'prettier'

import laravelVue from '../eslint/laravel-vue.js'
import next from '../eslint/next.js'
import nuxt from '../eslint/nuxt.js'
import react from '../eslint/react.js'
import prettierLaravel from '../prettier/laravel.js'
import prettierNuxt from '../prettier/nuxt.js'

const fixtures = fileURLToPath(new URL('./fixtures/', import.meta.url))

async function lint(config, file) {
  const eslint = new ESLint({ cwd: fixtures, overrideConfigFile: true, overrideConfig: config })
  const [result] = await eslint.lintFiles([file])
  return result.messages.map((m) => m.ruleId ?? m.message)
}

test('nuxt preset applies house Vue rules on top of @nuxt/eslint-config', async () => {
  const config = await createConfigForNuxt({ features: { stylistic: false } }).append(...nuxt())
  const rules = await lint(config, 'bad.vue')
  assert.ok(rules.includes('vue/block-order'), rules.join(', '))
  assert.ok(rules.includes('vue/component-api-style'), rules.join(', '))
  assert.ok(rules.includes('vue/component-name-in-template-casing'), rules.join(', '))
  assert.deepEqual(await lint(config, 'good.vue'), [])
})

test('nuxt preset enforces import order', async () => {
  const config = await createConfigForNuxt({ features: { stylistic: false } }).append(...nuxt())
  assert.ok((await lint(config, 'unordered.ts')).includes('import/order'))
})

test('laravel-vue preset is a complete config', async () => {
  const config = laravelVue()
  const rules = await lint(config, 'bad.vue')
  assert.ok(rules.includes('vue/block-order'), rules.join(', '))
  assert.ok(rules.includes('vue/component-api-style'), rules.join(', '))
  assert.deepEqual(await lint(config, 'good.vue'), [])
  assert.ok((await lint(config, 'unordered.ts')).includes('import/order'))
})

test('react preset checks hooks', async () => {
  const rules = await lint(react(), 'hooks.jsx')
  assert.ok(rules.includes('react-hooks/rules-of-hooks'), rules.join(', '))
})

// eslint-config-next loads its parser from the `next` package, which is too
// heavy to install here. Runs where `next` is resolvable (a Next.js project).
const hasNext = await import('next/package.json', { with: { type: 'json' } }).then(
  () => true,
  () => false,
)

test(
  'next preset loads eslint-config-next',
  { skip: !hasNext && 'next is not installed' },
  async () => {
    const rules = await lint(await next(), 'page.tsx')
    assert.ok(rules.includes('@next/next/no-img-element'), rules.join(', '))
  },
)

test('prettier presets share the base and differ per stack', async () => {
  const source = readFileSync(new URL('./fixtures/format.ts', import.meta.url), 'utf8')
  const nuxtOut = await prettier.format(source, { ...prettierNuxt, filepath: 'x.ts' })
  const laravelOut = await prettier.format(source, { ...prettierLaravel, filepath: 'x.ts' })
  assert.equal(nuxtOut, "const a = { b: 'c' }\n")
  assert.equal(laravelOut, "const a = { b: 'c' };\n")
})

test('prettier sorts Tailwind classes without the project installing the plugin', async () => {
  const out = await prettier.format('<div class="p-4 flex"></div>\n', {
    ...prettierNuxt,
    filepath: 'x.vue',
  })
  assert.match(out, /class="flex p-4"/)
})
