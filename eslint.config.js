// eslint.config.js
import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default [

    js.configs.recommended,

    {
        ignores: ['**/*.json'],
    },

    {
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.node,
            },
            parserOptions: {
                ecmaFeatures: { jsx: true },
            },
        },
    },

    {
        plugins: {
            react: reactPlugin,
            'react-hooks': reactHooksPlugin,
            'jsx-a11y': jsxA11yPlugin,
            import: importPlugin,
        },
    },
    {
        rules: {
            ...reactHooksPlugin.configs.recommended.rules,
            ...jsxA11yPlugin.configs.recommended.rules,
            ...reactPlugin.configs.recommended.rules,
        },
    },

    {
        rules: {
            indent: ['warn', 4, { VariableDeclarator: 1, SwitchCase: 1 }],
            quotes: ['error', 'single', { avoidEscape: true }],
            semi: ['error', 'always'],
            'comma-dangle': ['error', 'always-multiline'],
            'no-trailing-spaces': 'error',
            'eol-last': ['error', 'always'],
            'no-multiple-empty-lines': ['error', { max: 1 }],
            'space-before-blocks': ['error', 'always'],
            'keyword-spacing': ['error', { before: true, after: true }],
            'space-infix-ops': 'error',
            'arrow-spacing': ['error', { before: true, after: true }],
            'object-curly-spacing': ['error', 'always'],
            'array-bracket-spacing': ['error', 'never'],

            'prefer-const': 'error',
            'no-var': 'error',
            'prefer-template': 'error',
            'arrow-body-style': ['error', 'as-needed'],
            'prefer-arrow-callback': 'error',
            'object-shorthand': ['error', 'always'],

            'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
            'no-shadow': 'error',
            'no-param-reassign': ['error', { props: false }],
            'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
            'no-nested-ternary': 'error',

            'import/order': [
                'error',
                {
                    groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
                    'newlines-between': 'always',
                    alphabetize: { order: 'asc', caseInsensitive: true },
                },
            ],
            'import/no-duplicates': 'error',
            'import/no-unresolved': 'error',

            'react/jsx-indent': ['error', 2],
            'react/jsx-indent-props': ['error', 2],
            'react/self-closing-comp': 'error',
            'react/jsx-no-useless-fragment': 'error',

            'react/react-in-jsx-scope': 'off',
            'react/jsx-uses-react': 'off',

            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',

            'jsx-a11y/anchor-is-valid': 'error',
            'jsx-a11y/alt-text': 'error',
        },
    },
];
