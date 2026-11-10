#!/usr/bin/env node
/**
 * 视觉禁令检查。
 *
 * 规则来自 bookchain/web/DESIGN.md 第 5.1 与 6.4 节：
 *   1. border-radius 只能是 0，正圆除外（用 var(--radius-round)）
 *   2. 不出现 box-shadow
 *   3. 不出现 scale( 缩放
 *   4. transition / animation 的属性只允许颜色、透明度、位移（位移仅限 toast）
 *
 * 命中即退出码 1，纳入 npm test。
 * 行内注释里出现规则名不算命中：以 // 或 /* 开头到行尾的部分先剥掉。
 */
import { readdir, readFile } from 'node:fs/promises'
import { join, relative, extname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const scanDirs = ['src']

const ALLOWED_TRANSITION_PROPS = new Set([
  'color',
  'background-color',
  'border-color',
  'border-top-color',
  'border-bottom-color',
  'border-left-color',
  'outline-color',
  'fill',
  'stroke',
  'opacity',
  'transform',
  'all',
])

/** 逐行剥掉注释后再检查，避免文档里的示例被误判。 */
function stripComments(line) {
  const blockStripped = line.replace(/\/\*.*?\*\//g, '')
  const lineStripped = blockStripped.replace(/\/\/.*$/, '')
  return lineStripped
}

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === 'dist') continue
      yield* walk(full)
    } else if (['.css', '.vue', '.scss'].includes(extname(entry.name))) {
      yield full
    }
  }
}

const problems = []

function report(file, line, rule, text) {
  problems.push({ file: relative(root, file).replace(/\\/g, '/'), line, rule, text: text.trim() })
}

/** 展开 transition 简写的属性列表，只留属性名。 */
function transitionProps(value) {
  return value
    .split(',')
    .map((part) => part.trim().split(/\s+/)[0])
    .filter(Boolean)
}

for (const dir of scanDirs) {
  for await (const file of walk(join(root, dir))) {
    const text = await readFile(file, 'utf8')
    const lines = text.split(/\r?\n/)
    let inBlockComment = false

    lines.forEach((rawLine, index) => {
      let line = rawLine
      if (inBlockComment) {
        const end = line.indexOf('*/')
        if (end === -1) return
        line = line.slice(end + 2)
        inBlockComment = false
      }
      const open = line.indexOf('/*')
      if (open !== -1 && line.indexOf('*/', open) === -1) {
        inBlockComment = true
        line = line.slice(0, open)
      }
      line = stripComments(line)
      if (!line.trim()) return

      const radius = line.match(/border(-[a-z]+)*-radius\s*:\s*([^;]+)/)
      if (radius) {
        const value = radius[2].trim()
        const allowed = /^(0|0px|inherit|var\(--radius-flat\)|var\(--radius-round\))$/.test(value)
        if (!allowed) report(file, index + 1, 'radius', line)
      }

      if (/(^|[^-])box-shadow\s*:/.test(line)) report(file, index + 1, 'shadow', line)

      if (/(^|[^\w-])scale\(/.test(line)) report(file, index + 1, 'scale', line)

      const transition = line.match(/transition\s*:\s*([^;]+)/)
      if (transition && transition[1].trim() === 'none') return
      if (transition && !transition[1].includes('var(')) {
        for (const prop of transitionProps(transition[1])) {
          if (!ALLOWED_TRANSITION_PROPS.has(prop)) report(file, index + 1, 'transition-property', line)
        }
      }

      const animation = line.match(/animation\s*:\s*([^;]+)/)
      if (animation && /width|height|scale/.test(animation[1])) {
        report(file, index + 1, 'animation-property', line)
      }
    })
  }
}

if (problems.length === 0) {
  console.log('check-style: 通过，无视觉禁令命中')
  process.exit(0)
}

const byRule = new Map()
for (const p of problems) {
  if (!byRule.has(p.rule)) byRule.set(p.rule, [])
  byRule.get(p.rule).push(p)
}

for (const [rule, list] of byRule) {
  console.error(`\n[${rule}] ${list.length} 处`)
  for (const item of list) console.error(`  ${item.file}:${item.line}  ${item.text}`)
}
console.error(`\n共 ${problems.length} 处违规。规则见 bookchain/web/DESIGN.md 5.1 / 6.4。`)
process.exit(1)
