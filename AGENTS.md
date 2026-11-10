# AGENTS.md — paper-ui

纸感直角设计系统，Vue 3 组件库。入口文件只放技术栈、命令、硬性约定与模块导航。组件接口与视觉规则写在 `DESIGN.md`。

## 技术栈

```
Vue 3.5 + TypeScript + Vite 8 库模式（rollup 输出 ESM）
样式      普通 CSS + CSS 变量，无预处理器、无 Tailwind / UnoCSS
测试      Vitest 5 + @vue/test-utils + jsdom
类型产出  vite-plugin-dts
```

## 命令

```bash
npm install
npm test                  # check-style + vitest run
npm run check:style       # 只跑视觉禁令检查
npx vitest run            # 只跑单测
npm run typecheck         # vue-tsc --noEmit
npm run build             # 产出 dist/
npm run dev               # 组件预览页 :5180
```

## 硬性约定

1. 组件 CSS 只读 `tokens.css` 的变量，不写字面色值。改色只改 `tokens.css`。
2. `border-radius` 只能取 `0`、`inherit` 或 `var(--radius-round)`。其余视为违规，`check-style` 会拦。
3. 不出现 `box-shadow`。层次靠底色分区与一像素实线。
4. 不出现 `transform: scale()` 与尺寸过渡。
5. 悬停一律为拉出式：`clip-path: inset(0 100% 0 0)` 起步，悬停展开到 `inset(0)`，方向从左向右。
6. 每个组件 = 一个 `.vue` + 一份同名 CSS（放 `src/styles/components/`），样式用 `<style src>` 外链，不写内联 `<style>`。
7. 无 DOM 依赖的逻辑放进 `src/lib/` 并配单测。组件里的复杂判断先抽成纯函数。
8. 纸噪只加在容器表面，不加在文字与控件内部。浅色表面用 `--noise-image`，深色用 `--noise-image-dark`。
9. 新增组件后同步 `src/index.ts` 的导出与注册表、`preview/App.vue` 的示例区块、`DESIGN.md` 的组件清单。
10. 多根节点的组件（如带 Teleport 遮罩的侧栏）不能用 `wrapper.classes()` / `wrapper.attributes()` 断言，改查 `.find()` 或 `document.body`。
11. 改完必跑 `npm test` 与 `npm run typecheck`，两个都过才算完。
12. 令牌层必须包在 `:where(:root)` 里，特异性为 0。这样消费方在任意位置覆盖变量都生效，不受加载顺序影响。新增令牌时不要另起裸 `:root` 块。
13. 字体名只出现在 `tokens.css` 的 `--font-sans` / `--font-mono` 里，组件 CSS 与 `<template>` 不得写字体名。
14. 注释只写接口契约与行为，不写动机、历史与设计意图。
15. 文档不用口语、不用第二人称，统一无人称陈述或祈使句。

## 模块导航

| 模块 | 位置 |
|---|---|
| 视觉令牌（色、字、距、噪、动效） | `src/styles/tokens.css`，说明见 `DESIGN.md` 第 2 节 |
| 重置、排版、工具类 | `src/styles/base.css` |
| 组件实现 | `src/components/`，样式在 `src/styles/components/` |
| 纯逻辑（时间轴、提示队列、焦点、导航） | `src/lib/`，测试在 `tests/` |
| 导出与插件注册 | `src/index.ts` |
| 预览页（验收用） | `preview/`，`npm run dev` |
| 视觉禁令检查 | `scripts/check-style.mjs` |
| 库构建 | `vite.config.ts`（lib 模式）、`vite.preview.config.ts`（预览） |

## 复用边界

库不含业务概念。组件只接受 `tone`、`size`、`variant`、`shape` 这类外观属性，不接受业务字段，也不内置业务语义的分档映射。
