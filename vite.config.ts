import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import content from '@originjs/vite-plugin-content'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: true,
    port: 8080,
  },
  build: {
    outDir: 'docs',
  },
  base: '/base24-designer/',
  plugins: [
    vue(),
    content(),
  ]
})
