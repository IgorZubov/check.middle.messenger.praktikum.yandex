import { defineConfig } from 'vite';
import { resolve } from 'path';
import handlebars from 'vite-plugin-handlebars';

export default defineConfig({
    server: {
        host: 'localhost',
        port: 3000,
    },
    plugins: [
        handlebars({
            reloadOnPartialChange: false,
            transformIndexHtmlOptions: {},
            compileOptions: {
                preventIndent: true,
              },
        }),
    ],
    build: {
        target: 'esnext',
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
            },
        },
    },
    css: {
        postcss: './postcss.config.js',
    },
    resolve: {
        alias: {
            '@/': `${resolve(__dirname, './src')}/`,
        },
    },
});
