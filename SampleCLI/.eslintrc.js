module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended', // Integrate Prettier with ESLint
  ],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error', // Show Prettier issues as ESLint errors
    'no-console': 'warn', // Example custom ESLint rule
    'no-unused-vars': 'warn', // Example custom ESLint rule
  },
  env: {
    browser: true,
    node: true,
  },
};
