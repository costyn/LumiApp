import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteCompression from 'vite-plugin-compression';
import { execSync } from 'node:child_process';
export default defineConfig({
    base: '/lumiapp/',
    plugins: [
        react(),
        viteCompression({
            algorithm: 'gzip',
            ext: '.gz',
            filter: /\.(html)$/i,
            deleteOriginFile: false
        }),
        {
            name: 'copy-to-esp',
            closeBundle() {
                execSync('cp dist/index.html /Users/costyn/Developer/platformio/ledflower/data/lumiapp/');
                execSync('cp dist/assets/* /Users/costyn/Developer/platformio/ledflower/data/lumiapp/');
                execSync('cp dist/vite.svg /Users/costyn/Developer/platformio/ledflower/data/lumiapp/');
            }
        },
    ],
    resolve: {
        alias: {
            '@': '/src',
        },
    },
    // assetsInclude: ['**/*.json'],
    build: {
        rollupOptions: {
            output: {
                manualChunks: undefined
            }
        }
    }
});
