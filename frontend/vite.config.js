import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    rollupOptions: {
      input: {
        main:     resolve(__dirname, 'index.html'),
        upload:   resolve(__dirname, 'upload.html'),
        liked:    resolve(__dirname, 'liked.html'),
        stats:    resolve(__dirname, 'stats.html'),
      },
    },
  },
})