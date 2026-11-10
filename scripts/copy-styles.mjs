#!/usr/bin/env node
/**
 * 把 tokens.css 与 base.css 复制进 dist。
 *
 * 这两个文件通过 package.json 的 exports 单独暴露，供只想要令牌与基础排版、
 * 不引入全部组件样式的消费方使用。构建产物只保留 dist，因此需要复制。
 */
import { copyFile, mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const src = join(root, 'src', 'styles')
const dist = join(root, 'dist')

const files = ['tokens.css', 'base.css']

await mkdir(dist, { recursive: true })
for (const file of files) {
  await copyFile(join(src, file), join(dist, file))
  console.log(`copied ${file} -> dist/`)
}
