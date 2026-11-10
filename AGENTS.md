# AGENTS.md — paper-ui

纸感直角设计系统，Vue 3 组件库。入口文件只放技术栈、命令、硬性约定与模块导航。
具体组件接口与视觉依据写在 `DESIGN.md`。

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
2. `border-radius` 只能取 `0` 或 `var(--radius-round)`（正圆裁切图）。其余一律视为违规，`check-style` 会拦。
3. 不出现 `box-shadow`，不用阴影做层次；层次靠底色分区与一像素实线。
4. 不出现 `transform: scale()` 与尺寸过渡。过渡只允许颜色、透明度；`transform` 仅限轻提示入场位移。
5. 每个组件 = 一个 `.vue` + 一份同名 CSS（放在 `src/styles/components/`），样式用 `<style src>` 外链，不写内联 `<style>`。
6. 无 DOM 依赖的逻辑放进 `src/lib/` 并配单测。组件里的复杂判断先抽成纯函数。
7. 库不含业务概念：组件只接受 `tone` / `size` / `variant` 这类外观属性，不接受「书况」「订单状态」这类字段。
8. 新增组件后同步 `src/index.ts` 的导出与注册表、`preview/App.vue` 的示例区块、`DESIGN.md` 的组件清单。
9. 改完必跑 `npm test` 与 `npm run typecheck`，两个都过才算完。
10. 文档不用口语、不用第二人称，统一无人称陈述或祈使句。

## 模块导航

| 模块 | 位置 |
|---|---|
| 视觉令牌、版式尺度、对比度 | `src/styles/tokens.css`、`DESIGN.md` 第 2 节 |
| 重置与正文排版 | `src/styles/base.css` |
| 组件实现 | `src/components/`，样式在 `src/styles/components/` |
| 纯逻辑（时间轴、提示队列、焦点） | `src/lib/`，测试在 `tests/` |
| 导出与插件注册 | `src/index.ts` |
| 预览页（验收用） | `preview/`，`npm run dev` |
| 视觉禁令检查 | `scripts/check-style.mjs` |
| 库构建 | `vite.config.ts`（lib 模式）、`vite.preview.config.ts`（预览） |

## 与 BookChain 的关系

`bookchain/web/DESIGN.md` 第 6 节定义本库的定位与组件清单，本库是那节的实现。
消费方式是 `file:` 本地依赖。改了导出或组件 API 后，需要回 BookChain 侧确认调用点未失效。
