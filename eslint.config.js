import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import vuePlugin from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';

export default [
    {
        ignores: ['dist/**', '.histoire/**'],
    },
    js.configs.recommended,
    {
        files: ['**/*.ts', '**/*.tsx'],
        languageOptions: {
            parser: vueParser,
            parserOptions: {
                parser: {
                    ts: tsParser,
                    js: "espree",
                },
                ecmaVersion: "latest",
                sourceType: "module",
            },
        },
        plugins: {
            "@typescript-eslint": tsPlugin,
            "vue": vuePlugin,
        },
        rules: {
            ...tsPlugin.configs.recommended.rules,
            ...vuePlugin.configs.recommended.rules,
            // ...vuePlugin.configs["vue3-recommended"].rules,
        },
    },
];