module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    'jest/globals': true,
  },
  extends: ['plugin:react/recommended', 'airbnb', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
  },
  plugins: ['react', 'jest'],

  rules: {
    'jest/no-disabled-tests': 'warn',
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'error',
    'jest/prefer-to-have-length': 'warn',
    'jest/valid-expect': 'error',
    'no-unused-expressions': [2, { allowShortCircuit: true, allowTernary: true }],
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'no-param-reassign': ['error', { props: false }],
  },
};
