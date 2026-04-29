import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,      // Port standar Vite
    host: true,      // Penting agar bisa diakses jika nanti pakai Docker/Network lain
    strictPort: true,
    watch: {
      usePolling: true, // Memastikan perubahan file terdeteksi meski di sistem file yang berat
    },
  },
})