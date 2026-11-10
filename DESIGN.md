# paper-ui — 设计

纸感直角设计系统。本文定义视觉规则、组件接口与实现约定；运行命令与模块导航见 `AGENTS.md`。

## 1. 定位

独立 Vue 3 组件库，CSS 变量加普通 CSS，不依赖原子化框架。不做跨框架支持：若日后需要 React 版本，另起项目复用同一份 token 与视觉规则，不复用组件源码。

组件清单按 BookChain 的实际需要确定。为不存在的页面预先造组件，最后会发现接口不合适而全部返工。

## 2. 视觉规则

### 2.1 硬性禁令

- 圆角：`border-radius` 只能是 0。正圆裁切图是版式母题，写作 `var(--radius-round)`
- 阴影：不用 `box-shadow` 做层次。层次靠底色分区与一像素实线
- 缩放：不用 `transform: scale()`，不用尺寸过渡，悬停不放大
- 渐变：不用渐变做装饰
- 位移：只在轻提示入场时出现，且 `prefers-reduced-motion` 下移除

### 2.2 色彩

| 变量 | 值 | 用途 |
|---|---|---|
| `--paper` | `#F0E9D8` | 纸黄，主背景 |
| `--paper-deep` | `#E0D6C0` | 深纸黄，次级色块、表头 |
| `--ink` | `#191713` | 墨，正文与墨底块 |
| `--ink-soft` | `#4A4640` | 次级文字 |
| `--green` | `#3F4A35` | 深纸绿，标题与强调块 |
| `--green-mid` | `#7E8B69` | 纸绿，标签底色与非文字元素 |
| `--orange` | `#A8461C` | 纸橙，仅价格、当前标记、错误 |
| `--line` | `#B9AE95` | 一像素分隔线 |

对比度实测：墨/纸黄 14.79:1（AAA），深纸绿/纸黄 7.74:1（AAA），纸橙/纸黄 4.88:1（AA），纸橙/墨 3.03:1（仅限大字号），纸绿/纸黄 3.00:1（仅限大字号与图形）。

使用约束：正文只用 `--ink`；`--green-mid` 不作正文色；`--orange` 不做大块背景，纸橙上的文字必须用纸黄且不小于 20px。

### 2.3 字号层级

| 用途 | 桌面 / 移动 | 字重 | 行高 | 字距 | 变量 |
|---|---|---|---|---|---|
| 页首大标题 | 64 / 36 | 700 | 1.05 | -0.02em | `--text-display` |
| 区块标题 | 36 / 26 | 700 | 1.15 | -0.01em | `--text-title` |
| 卡片标题 | 22 / 18 | 600 | 1.3 | 0 | `--text-card` |
| 正文 | 16 / 15 | 400 | 1.65 | 0 | `--text-body` |
| 标签注脚 | 12 / 11 | 500 | 1.4 | 0.02em | `--text-meta` |

字号用 `clamp()` 在桌面与移动之间连续过渡，避免断点跳变。数字（价格、统计、ISBN）用 `--font-mono` 并开启 `tabular-nums`。

### 2.4 版式

十二列栅格，桌面最大宽度 1240px，左右留白 48px；移动端留白 20px。区块间距桌面 96px、移动 56px。信息块之间靠底色区分，分隔用一像素 `--line` 实线。

### 2.5 动效

只允许透明度淡入（200ms）与骨架屏明暗循环（400ms）。过渡属性限定为颜色与透明度。`prefers-reduced-motion: reduce` 下全部关闭。

## 3. 分层

```
src/styles/tokens.css       CSS 变量：色、字号、间距、线宽、动效时长。无组件概念
src/styles/base.css         重置、字体栈、正文排版、焦点轮廓
src/styles/field.css        表单骨架（.paper-control 等），供表单类组件共用
src/styles/components/*.css 组件私有样式
src/components/*.vue        组件实现，通过 <style src> 外链同名 CSS
src/lib/*.ts                无 DOM 依赖的纯逻辑
```

消费方可以只引 `tokens.css` 自己写样式，也可以整套用组件。两层分开，避免为了用一颗按钮把整套拖进来。

样式外链而非内联 `<style>`：Vite 库模式会把组件内的 `<style>` 一并抽进 `paper-ui.css`，但外链让样式文件在仓库里可检索，`check-style` 扫描时不必解析 `.vue` 的模板段。

## 4. 组件

### 4.1 布局

**PaperContainer** — 版心。`width` 取 `narrow`（760）/ `default`（1240）/ `wide`（1440）/ `full`，`flush` 去掉左右留白，`as` 指定语义标签。

**PaperGrid / PaperCell** — 十二栅格。`columns` 改列数，`gap` 改列间距。`PaperCell` 的 `span` 是桌面占列，`spanSm` 是 640px 以下的占列，缺省满 12 列（移动端默认单列堆叠），`start` 指定起始列。

**PaperStack** — 等间距堆叠。`gap` 接受数字（映射到 `--space-N`）或任意长度；`direction`、`align`、`justify` 控制排布。

### 4.2 表单

**PaperButton** — `variant` 取 `solid`（墨底纸黄字）/ `outline`（描边）/ `ghost`（行内次级动作，带下划线）；`size` 取 `md`/`sm`；`loading` 时禁用并显示方块脉冲；`block` 撑满宽度。悬停是颜色反转，不做位移。

**PaperField** — 表单外壳，不单独出现在页面里。`label` 同时是控件的可访问名，`hint` 是常态提示，`error` 非空即进入错误态，`note` 排在标签右侧。默认插槽回传 `id`、`message-id`、`invalid`、`required`，供内部控件绑定。

**PaperInput** — 下边框输入框。给出 `rows` 时渲染 `textarea`。`mono` 用于 ISBN、价格这类需要位对齐的字段。

**PaperSelect** — 原生 `select` 包样式。`options` 传数组，或用默认插槽塞 `option`。`placeholder` 渲染为一个禁用的空项，未选时文字取次级色。右侧标记是两像素边框旋转 45 度形成的折角，不是圆角三角。

**PaperCheckbox / PaperRadio** — 原生控件隐藏，可视部分是 16px 直角方块。勾与内点都用方块绘制，不使用圆点。`PaperRadio` 需要 `name` 与 `value` 组成一组。

### 4.3 展示

**PaperCard** — 无边框无阴影。`tone` 取 `paper`/`deep`/`ink`；`padding` 取 `none`/`sm`/`md`/`lg`；`header`、`footer`、默认三个插槽，内部分栏用一像素线。

**PaperTag** — 直角小块，`tone` 取 `quiet`/`mid`/`strong`，`outline` 切成描边版本。库不定义业务分档，书况到色调的映射写在消费方。

**PaperRule** — 一像素分隔线，`weight` 取 `hair`/`bold`，`vertical` 切换竖向，`space` 控制留白（数字映射 `--space-N`）。

**PaperStat / PaperStatGroup** — 统计块。`PaperStat` 接受 `value`、`label`、`unit`、`mono`；`PaperStatGroup` 用 `columns` 排版，格子之间是一像素线，`inverse` 打开墨底纸黄字。

**PaperFigure** — 图片容器。`shape` 取 `rect`（按 `ratio` 占位，默认 3:4）/ `round`（正圆，`size` 定直径）；无 `src` 或加载失败时显示墨底色块与首字（`fallback` 首字，缺省「书」）；`photo` 打开 `filter: sepia(0.06) contrast(1.04)`。

**PaperBadge** — 直角小方块。`count` 超过 `max` 显示 `max+`，`dot` 关闭数字只作状态点，`tone` 取 `ink`/`orange`。

**PaperTimeline** — 流转链。`items` 每项含 `id`、`when`、`title`、`meta`、`price`、`current`；当前节点用纸橙方块标记，未标记时末项为当前，由 `resolveTimeline()` 计算。竖线用绝对定位画在节点边界，相邻节点的上下两段首尾相接。`showPrice` 控制价格列。

**PaperTable** — 线框表格。`columns` 每项含 `key`、`title`、`width`、`numeric`、`align`；`rows` 是对象数组，`rowKey` 指定行键；`loading` 显示骨架行，空数据显示 `emptyText`；`striped`、`dense`、`stickyHead` 控制密度与吸顶。每个列 key 对应一个同名插槽，用于自定义单元格。

**PaperTabs** — 直角标签切换。`variant` 取 `underline`（下压一条纸橙实线）/ `block`（选中整块墨底）；`ArrowLeft`/`ArrowRight`/`Home`/`End` 在可用项之间循环，跳过 `disabled`；`count` 渲染为等宽数字。

### 4.4 反馈

**PaperDialog** — 弹窗。`v-model:open` 控制显隐，`title` 必填并作为可访问名，`size` 取 `sm`/`md`/`lg`；`confirmText`/`cancelText`/`footer` 插槽定制底部，`loading` 让确认按钮进入加载态，`dismissible` 控制遮罩与 Esc 是否关闭。打开时锁定页面滚动并把焦点放到面板，Tab 在面板内循环，关闭后把焦点还给触发元素。遮罩不模糊，入场只淡入。

**PaperToast** — 轻提示容器，页面根部放一个即可。队列由 `usePaperToast()` 管理，模块级单例：`show(message, { tone, duration })` 入队，最多同时三条，超出丢弃最早的，`duration` 为 0 时不自动关闭。从顶部滑入，位移仅此一处。

**PaperEmpty** — 空态。`title` 必填，`description` 可选，默认插槽放动作按钮；`ruled` 加顶线与底线。

**PaperSkeleton** — 骨架屏。`width`、`height` 任意长度；`lines` 给出行数，最后一行半宽。只动透明度。

### 4.5 导出

`src/index.ts` 同时提供具名导出与 `PaperUI` 插件（`app.use(PaperUI)` 全量注册）。纯逻辑导出：`resolveTimeline`、`usePaperToast`、`filterFocusable`、`nextFocusIndex`、`FOCUSABLE_SELECTOR`。

## 5. 视觉禁令的自动检查

`scripts/check-style.mjs` 逐行扫描 `src/` 下的 `.css` 与 `.vue`，剥掉注释后检查四条：`border-radius` 取值、`box-shadow`、`scale(`、`transition` 属性白名单。命中打印文件与行号并以退出码 1 结束，已纳入 `npm test`。

扫描器不读意图，只报模式。真正的取舍仍写在本文第 2.1 节。

## 6. 分发与接入

Vite 库模式输出 ESM，`peerDependencies` 只声明 `vue`。产物：

```
dist/paper-ui.js      ESM，外部化 vue
dist/paper-ui.css     全部样式（token + base + 组件）
dist/index.d.ts       类型入口
```

`package.json` 的 `exports` 暴露三个入口：主入口、`./style.css`、`./tokens.css` 与 `./base.css`（后者直接指向 `src/`，供只要令牌的消费方）。

BookChain 走 `file:` 本地依赖，不发布 npm。课程项目周期短，发布需要账号、版本管理与流水线，收益不足以抵消成本。

## 7. 测试策略

两层：

- `tests/*.test.ts` 针对 `src/lib/` 的纯函数：时间轴解析的当前节点与连线规则、提示队列的容量与自动关闭、焦点筛选与 Tab 循环取模。这些不需要 DOM，改逻辑先改测试。
- `tests/components.test.ts` 用 `@vue/test-utils` 挂载组件，断言类名、ARIA 属性、插槽内容与事件，不测像素。视觉由预览页人工验收。

`check-style.mjs` 与单测一起构成 `npm test`。
