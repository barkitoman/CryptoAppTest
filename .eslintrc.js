module.exports = {
    root: true,
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react-native/all',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
    ],
    parser: '@typescript-eslint/parser',
    plugins: ['react', 'react-native', '@typescript-eslint'],
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 2021,
        sourceType: 'module',
    },
    env: {
        'react-native/react-native': true,
    },
    rules: {
        'prettier/prettier': 'error',
        // Custom rules
        'react/react-in-jsx-scope': 'off', // Not needed in React 17+
        '@typescript-eslint/no-explicit-any': 'warn',
        'react-native/no-inline-styles': 'warn',
        'react-native/no-color-literals': 'off',
        'react-native/sort-styles': 'off',
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
};
