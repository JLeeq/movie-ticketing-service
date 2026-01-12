import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// React 프론트엔드를 3000번 포트에서 띄우고, /api 요청은 백엔드 서버(5000번)로 전달해주는 설정
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})

