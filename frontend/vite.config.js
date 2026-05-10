import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@':           resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@pages':      resolve(__dirname, './src/pages'),
      '@hooks':      resolve(__dirname, './src/hooks'),
      '@store':      resolve(__dirname, './src/store'),
      '@lib':        resolve(__dirname, './src/lib'),
      '@assets':     resolve(__dirname, './src/assets'),
    },
  },
  base: '/static/react/',
  build: {
    outDir: resolve(__dirname, '../home/static/react'),
    emptyOutDir: false,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/main.js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
})
