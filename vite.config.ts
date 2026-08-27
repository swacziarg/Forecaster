import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const kalshiProxy = {
  target: 'https://external-api.kalshi.com',
  changeOrigin: true,
  secure: true,
  rewrite: (path: string) => path.replace(/^\/api\/kalshi/, ''),
}

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5178,
    proxy: {
      '/api/kalshi': kalshiProxy,
    },
  },
  preview: {
    proxy: {
      '/api/kalshi': kalshiProxy,
    },
  },
})
