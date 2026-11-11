import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import { defineConfig } from 'eslint/config'
import globals from 'globals'

import { ignores, jsRules } from './eslint/rules.js'

export default defineConfig(
  { ignores: [...ignores, 'test/fixtures/**'] },
  js.configs.recommended,
  { languageOptions: { globals: globals.node }, rules: jsRules },
  prettier,
)
