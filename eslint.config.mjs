import { defineConfig, globalIgnores } from 'eslint/config';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unusedImports from 'eslint-plugin-unused-imports';
import tseslint from 'typescript-eslint';

const eslintConfig = defineConfig([
    globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
    {
        plugins: {
            'unused-imports': unusedImports,
            'simple-import-sort': simpleImportSort,
            prettier: eslintPluginPrettierRecommended,
            '@typescript-eslint': tseslint.plugin,
        },
        rules: {
            'prettier/prettier': 'error',
            semi: ['error', 'always'],
            'no-console':
                process.env.NODE_ENV === 'production' ? 'warn' : 'off',
            'react/jsx-uses-react': 'off',
            'react/react-in-jsx-scope': 'off',
            'simple-import-sort/imports': [
                'error',
                {
                    groups: [
                        ['^\\u0000'],
                        ['^react$', '^@?\\w'],
                        ['^@', '^'],
                        ['^\\./'],
                        ['^.+\\.(module.css|module.scss)$'],
                        ['^.+\\.(gif|png|svg|jpg)$'],
                    ],
                },
            ],
            '@typescript-eslint/no-unused-vars': 'off',
            'unused-imports/no-unused-imports': 'warn',
            'unused-imports/no-unused-vars': [
                'warn',
                {
                    vars: 'all',
                    varsIgnorePattern: '^_',
                    args: 'after-used',
                    argsIgnorePattern: '^_',
                },
            ],
            '@typescript-eslint/no-explicit-any': 'warn',
        },
    },
]);

export default eslintConfig;
