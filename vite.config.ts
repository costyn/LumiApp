import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteCompression from 'vite-plugin-compression'
import { execSync } from 'node:child_process'

export default defineConfig({
  base: '/lumiapp/',
  plugins: [
    react(),
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      filter: /\.(js|css|html|svg)$/i,
      deleteOriginFile: true
    }),
    {
      name: 'copy-to-esp',
      closeBundle() {
        execSync('cp -r dist/ /Users/costyn/Developer/platformio/ledflower/data/lumiapp/')
      }
    },
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  assetsInclude: ['**/*.json'],
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
})