// eslint.config.js
const globals = require('globals');
const js = require('@eslint/js');
const jest = require('eslint-plugin-jest');

module.exports = [
  js.configs.recommended,

  {
    files: ['src/**/*.js', 'scripts/**/*.js'],
    languageOptions: {
      ecmaVersion: 12,
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      quotes: ['error', 'single'], //  single quotes
      semi: ['error', 'always'], //  semicolons
      eqeqeq: ['error', 'always'], //  triple-equals
      'no-unused-vars': ['warn', { args: 'none' }], // warning on unused variables
    },
  },

  {
    files: ['test/**/*.js'],
    ...jest.configs['flat/recommended'], // Jest's rules
    languageOptions: {
      globals: {
        ...globals.jest,
        ...globals.node,
      },
    },
  },

  // global ignores
  {
    ignores: [
      'node_modules/',
      'models/',
      '.prettierrc', //  ignoring the prettier config file
    ],
  },
];
