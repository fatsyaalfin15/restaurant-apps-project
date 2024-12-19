const { defineConfig } = require('eslint-define-config');
const pluginJs = require('@eslint/js');
const daStyle = require('eslint-config-dicodingacademy');
const globals = require('globals');

module.exports = defineConfig([
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        showSection: 'writable', 
        displayRestaurantDetails: 'readonly', 
        displayFavoriteRestaurants: 'readonly', 
      }
    },
  },
  pluginJs.configs.recommended, 
  daStyle, 
  {
    rules: {
      'space-infix-ops': ['error'],
      'brace-style': ['error', '1tbs'],
      'space-before-blocks': ['error', 'always'],
      'indent': ['error', 2], 
      'no-trailing-spaces': 'error',   
    },
  },
]);
