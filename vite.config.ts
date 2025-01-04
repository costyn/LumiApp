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
        entryFileNames: '[name]-[hash].js',
        chunkFileNames: '[name]-[hash].js',
        assetFileNames: '[name]-[hash].[ext]'
      }
    }
  },
  plugins: [
    react(),
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      filter: /\.(html|js|css|json)$/i,
      deleteOriginFile: false
    }),
    {
      name: 'copy-to-esp',
      closeBundle() {
        // skip if build failed
        if (!fs.existsSync('dist') || fs.readdirSync('dist').length === 0) {
          console.warn('No dist output found – skipping copy.')
          return
        }
        // remove old
        execSync('rm -rf /Users/costyn/Developer/platformio/ledflower/data/lumiapp/*')

        // copy new hashed files & gz
        try {
          execSync('cp dist/*.* dist/*.gz /Users/costyn/Developer/platformio/ledflower/data/lumiapp/')
        } catch {
          // if any pattern has no matches, ignore
        }
      }
    }
  ]
})