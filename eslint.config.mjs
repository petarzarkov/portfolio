import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';

const config = tseslint.config(
  eslint.configs.all,
  tseslint.configs.recommended,
  tseslint.configs.stylistic,
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  eslintConfigPrettier,
);

export default [
  {
    ignores: ['**/*.js', '**/*.d.ts', 'node_modules', 'build', 'tests', '**/*.md', '**/*.json', 'dist'],
  },
  ...config,
  {
    rules: {
      'sort-imports': 'off',
      'sort-keys': 'off',
      'no-magic-numbers': 'off',
      'no-ternary': 'off',
      'no-void': 'off',
      'one-var': 'off',
      'id-length': 'off',
      'react/prop-types': 'off',
      'sort-vars': 'off',
      'no-undefined': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'consistent-return': 'off',
      camelcase: 'warn',
      'no-nested-ternary': 'warn',
      'func-style': 'warn',
      'react/no-deprecated': 'warn',
      'max-lines': ['warn', 350],
      'max-lines-per-function': ['warn', 350],
    },
  },
];
