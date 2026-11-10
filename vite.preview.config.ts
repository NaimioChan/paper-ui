import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// 组件预览页：只服务于本地看样式，产物不参与库构建。
export default defineConfig({
  root: 'preview',
  plugins: [vue()],
  resolve: {
    alias: {
      '@naimio/paper-ui': fileURLToPath(new URL('./src/index.ts', import.meta.url)),
    },
  },
  server: {
    port: 5180,
    strictPort: true,
    open: false,
  },
})
