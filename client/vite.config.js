import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Some environments disallow binding on IPv6 ::1; force IPv4 localhost.
    host: '127.0.0.1',
    port: 5173,
    strictPort: false,
  },
})
