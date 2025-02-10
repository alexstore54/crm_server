module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'prettier', 'jest'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:jest/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js', 'dist/*'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'warn',
    '@typescript-eslint/explicit-module-boundary-types': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
    '@typescript-eslint/no-inferrable-types': 'warn',
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        trailingComma: 'all',
        semi: true,
        tabWidth: 2,
        printWidth: 100,
      },
    ],
    'jest/no-disabled-tests': 'warn',
    'jest/no-focused-tests': 'error',
    'import/no-unresolved': 'error',
    'import/no-unused-modules': 'warn',
  },
};
