import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

const entry = fileURLToPath(new URL('./src/index.ts', import.meta.url))

// 库构建与单测共用一份配置；预览页走 vite.preview.config.ts。
export default defineConfig(({ command }) => ({
  plugins: [
    vue(),
    ...(command === 'build'
      ? [
          dts({
            include: ['src'],
            outDirs: ['dist'],
            tsconfigPath: './tsconfig.json',
            entryRoot: 'src',
            insertTypesEntry: false,
          }),
        ]
      : []),
  ],
  resolve: {
    alias: { '@naimio/paper-ui': entry },
  },
  build: {
    lib: {
      entry,
      name: 'PaperUI',
      formats: ['es'],
      fileName: () => 'paper-ui.js',
      cssFileName: 'paper-ui',
    },
    rollupOptions: {
      external: ['vue'],
    },
    cssCodeSplit: false,
    emptyOutDir: true,
    sourcemap: true,
  },
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.{test,spec}.{ts,mjs}'],
    restoreMocks: true,
  },
}))
