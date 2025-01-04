import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteCompression from 'vite-plugin-compression'
import { execSync } from 'node:child_process'
import fs from 'fs'

export default defineConfig({
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  base: '/lumiapp/',
  build: {
    outDir: 'dist',
    assetsDir: '',
    rollupOptions: {
      output: {
        manualChunks: undefined,
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
      },
    },
  },
  plugins: [
    react(),
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      filter: /\.(html|js|css|json)$/i,
      deleteOriginFile: false,
    }),
    {
      name: 'copy-to-esp',
      closeBundle() {
        if (!fs.existsSync('dist') || fs.readdirSync('dist').length === 0) {
          console.warn('No dist output found – skipping copy.')
          return
        }
        execSync('rm -rf /Users/costyn/Developer/platformio/ledflower/data/lumiapp/*')
        execSync('cp dist/* /Users/costyn/Developer/platformio/ledflower/data/lumiapp/')
      },
    },
  ],
})