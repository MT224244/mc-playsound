module.exports = {
    root: true,
    env: {
        node: true
    },
    extends: [
        'plugin:vue/essential',
        '@vue/standard',
        '@vue/typescript/recommended'
    ],
    parser: 'vue-eslint-parser',
    parserOptions: {
        ecmaVersion: 2020,
        parser: '@typescript-eslint/parser'
    },
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'semi': ['error', 'always'],
        'semi-style': ['error', 'last'],
        'no-extra-semi': 'error',
        'no-unexpected-multiline': 'error',
        'no-unreachable': 'error',
        'indent': ['warn', 4],
        'quotes': ['warn', 'single'],
        'space-before-function-paren': ['warn', { anonymous: 'never', named: 'never', asyncArrow: 'always' }],
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        'no-undef': 'off',
        'camelcase': 'off',
        '@typescript-eslint/camelcase': 'off',
        'brace-style': 'off'
    }
};
