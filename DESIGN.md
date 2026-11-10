# paper-ui — 设计

通用的纸感直角设计系统。本文定义视觉令牌、组件接口与实现约定；运行命令与模块导航见 `AGENTS.md`。

## 1. 定位

独立 Vue 3 组件库，CSS 变量加普通 CSS，不依赖原子化框架。面向纸黄底色、直角色块、一像素线这一类界面，可被任意项目消费。

不做跨框架支持。React 版本另起项目，复用同一份 token 与视觉规则，不复用组件源码。

## 2. 令牌

全部令牌定义在 `src/styles/tokens.css`。组件 CSS 只读变量，不写字面色值。

### 2.1 色

| 变量 | 值 | 用途 |
|---|---|---|
| `--paper` | `#F0E9D8` | 纸黄，主背景 |
| `--paper-deep` | `#E0D6C0` | 深纸黄，次级色块 |
| `--ink` | `#191713` | 墨，正文与墨底色块 |
| `--ink-soft` | `#4A4640` | 次级文字 |
| `--green` | `#3F4A35` | 深纸绿 |
| `--green-mid` | `#7E8B69` | 纸绿，标签底色与非文字元素 |
| `--orange` | `#A8461C` | 纸橙，强调与当前标记 |
| `--gold` | `#B8892F` | 暗金，第二强调色 |
| `--line` | `#B9AE95` | 一像素分隔线 |

对比度：墨/纸黄 14.79:1（AAA），深纸绿/纸黄 7.74:1（AAA），纸橙/纸黄 4.88:1（AA），纸橙/墨 3.03:1（仅限大字号），纸绿/纸黄 3.00:1（仅限大字号与图形）。

正文只用 `--ink`。`--green-mid` 不作正文色。`--orange` 不做大块背景，橙底文字须用纸黄且不小于 20px。

### 2.2 字号

| 用途 | 桌面 / 移动 | 字重 | 行高 | 字距 | 变量 |
|---|---|---|---|---|---|
| 超大展示 | 176 / 64 | 800 | 0.86 | -0.05em | `--text-mega` |
| 页首标题 | 64 / 36 | 700 | 1.05 | -0.02em | `--text-display` |
| 区块标题 | 36 / 26 | 700 | 1.15 | -0.01em | `--text-title` |
| 卡片标题 | 22 / 18 | 600 | 1.3 | 0 | `--text-card` |
| 正文 | 16 / 15 | 400 | 1.65 | 0 | `--text-body` |
| 标签注脚 | 12 / 11 | 500 | 1.4 | 0.02em | `--text-meta` |

字号用 `clamp()` 连续过渡。数字用 `--font-mono` 配 `tabular-nums`。

### 2.3 构成主义尺度

| 变量 | 值 | 用途 |
|---|---|---|
| `--bar-hair` ~ `--bar-mega` | 2 / 6 / 14 / 28 / 56px | 色条粗细 |
| `--slant-sm` / `--slant-md` / `--slant-lg` | 24 / 56 / 104px | 斜切深度 |
| `--offstep` | 12px | 错位偏移单位 |

移动端 `--slant-md` 与 `--slant-lg` 减半。

### 2.4 纸噪

| 变量 | 默认 | 说明 |
|---|---|---|
| `--noise-image` | SVG data URL | 半透明黑点，浅色表面使用 |
| `--noise-image-dark` | SVG data URL | 半透明白点，深色表面使用 |
| `--noise-opacity` | `0.22` | 浓度 |
| `--noise-scale` | `180px` | 平铺尺寸 |
| `--noise-blend` | `normal` | 混合模式 |

噪声图由 `feTurbulence` 生成，`feColorMatrix` 把亮度映射到 alpha，RGB 固定为纯黑或纯白。`normal` 混合下不依赖底色相乘，浅底与深底都可见。

浓度档位：`--noise-opacity` 默认 0.22，`.paper-noise--strong` 提到 0.34，`.paper-noise--faint` 降到 0.10，`.paper-noise--plain` 归零。

### 2.5 动效

| 变量 | 默认 | 用途 |
|---|---|---|
| `--dur-fade` | 200ms | 颜色、透明度 |
| `--dur-sweep` | 340ms | 拉出式展开 |
| `--ease-sweep` | `cubic-bezier(0.65, 0, 0.35, 1)` | 拉出曲线 |

`prefers-reduced-motion: reduce` 下时长归零。

## 3. 视觉规则

- 控件一律直角。`border-radius` 只允许 `0`、`inherit`、`var(--radius-round)`（正圆裁切图）
- 不用 `box-shadow`，层次靠底色分区与一像素线
- 不用 `transform: scale()`，不做尺寸过渡
- 悬停一律为拉出式：伪元素用 `clip-path: inset(0 100% 0 0)` 起步，悬停展开到 `inset(0)`，方向从左向右
- 文字始终在拉出层之上（拉出层 `z-index: -1`，宿主 `isolation: isolate`）
- 纸噪只加在背景与容器表面，不加在文字与控件内部

## 4. 分层

```
src/styles/tokens.css       全部 CSS 变量
src/styles/base.css         重置、排版、纸噪工具类、构成主义工具类
src/styles/components/*.css 组件私有样式
src/components/*.vue        组件实现，<style src> 外链同名 CSS
src/lib/*.ts                无 DOM 依赖的纯逻辑
```

工具类：`.paper-noise` / `.paper-noise--strong` / `--faint` / `--plain`，`.paper-slab`，`.paper-bar`，`.paper-slant`，`.paper-offstep`，`.paper-mono`，`.paper-meta`，`.paper-visually-hidden`。

## 5. 组件

### 5.1 布局

**PaperContainer** — 版心。`width` 取 `narrow`/`default`/`wide`/`full`，`flush` 去掉留白，`as` 指定标签。

**PaperGrid / PaperCell** — 十二栅格。`PaperCell` 的 `span` 是桌面占列，`spanSm` 是 640px 以下占列，缺省满 12 列。

**PaperStack** — 等间距堆叠。`gap` 接受数字（映射 `--space-N`）或长度；`direction`、`align`、`justify` 控制排布。

**PaperComposition** — 构图容器。`layout` 取 `offset`（右栏下移错位）、`diagonal`（两栏斜切对接）、`stack`（单列挂左缘色条）；`ratio` 定义两栏比例；`divider` 与 `dividerTone` 控制色条粗细与颜色。

### 5.2 表单

**PaperButton** — `variant` 取 `solid`/`outline`/`ghost`，`size` 取 `md`/`sm`。悬停时填充从左向右拉出，文字翻为纸黄。`loading` 显示方块脉冲，`block` 撑满宽度。

**PaperField** — 表单外壳。默认插槽回传 `id`、`message-id`、`invalid`、`required`。

**PaperInput** — 下边框输入框。给 `rows` 渲染 `textarea`。`mono` 用于位对齐字段。

**PaperSelect** — 原生 `select` 包样式。`options` 传数组或用插槽。`placeholder` 渲染为禁用的空项。

**PaperCheckbox / PaperRadio** — 原生控件隐藏，可视部分为 16px 直角方块，勾与内点均为方形。

### 5.3 展示

**PaperCard** — 无边框无阴影。`tone` 取 `paper`/`deep`/`ink`；`padding` 取 `none`/`sm`/`md`/`lg`；`noise` 叠加纸噪；`corner` 在右上角贴一个三角色块。`header`、`footer`、默认三个插槽。

**PaperSlab** — 构成主义色块容器。`tone` 取 `ink`/`green`/`orange`/`gold`/`paper`/`deep`；`padding` 四档；`slant` 斜切右侧（`reverse` 反向）；`noise` 叠加纸噪；`bar` 加顶部色条。

**PaperTag** — 直角标签。`tone` 取 `quiet`/`mid`/`strong`/`gold`，`outline` 切描边版。

**PaperRule** — 分隔线。`weight` 取 `hair`/`bold`/`heavy`；`ink` 用墨色线；`vertical` 竖排；`space` 控制留白。

**PaperMega** — 超大字号展示字。`text` 为文本，`orientation` 取横排或竖排，`tone` 取 `ink`/`paper`/`orange`/`green`/`outline`。

**PaperStat / PaperStatGroup** — 统计块。`PaperStatGroup` 的 `columns` 定列数，`inverse` 用墨底纸黄字，`ruled` 加顶部纸橙横线。

**PaperFigure** — 图片容器。`shape` 取 `rect`（按 `ratio`）/`round`（`size` 定径）/`slant`（斜切）；无源或加载失败时显示墨底色块与首字；`photo` 开启暖色与对比度微调。

**PaperBadge** — 直角小方块。`count` 超 `max` 显示 `max+`；`dot` 只作状态点；`tone` 取 `ink`/`orange`/`gold`。

**PaperTimeline** — 时间轴。`items` 每项含 `id`、`when`、`title`、`meta`、`price`、`current`；当前节点由 `resolveTimeline()` 决定，未标记时取末项。

**PaperTable** — 线框表格。`columns` 每项含 `key`、`title`、`width`、`numeric`、`align`；`rows` 为对象数组；`loading` 显示骨架行；`ruled` 用墨底表头；`striped`、`dense`、`stickyHead` 控制密度。每个列 key 对应同名插槽。

**PaperTabs** — 标签切换。`variant` 取 `underline`/`block`；键盘 `ArrowLeft`/`ArrowRight`/`Home`/`End` 在可用项间循环；`count` 渲染等宽数字。

### 5.4 反馈

**PaperDialog** — 弹窗。`v-model:open` 控制显隐；`size` 取 `sm`/`md`/`lg`；`noise` 给面板加纸噪；`ruled` 加顶部色条；`confirmText`/`cancelText`/`footer` 定制底部；打开时锁定滚动并把焦点放到面板，Tab 在面板内循环，关闭后焦点还给触发元素。

**PaperToast** — 轻提示容器，页面根部放一个。队列由 `usePaperToast()` 管理，最多同时三条。`show(message, { tone, duration })`，`duration` 为 0 时不自动关闭。

**PaperEmpty** — 空态。`title`、`description`、默认插槽放动作，`ruled` 加顶底线。

**PaperSkeleton** — 骨架屏。`width`、`height`、`lines`；只动透明度。

### 5.5 导出

`src/index.ts` 提供具名导出与 `PaperUI` 插件（`app.use(PaperUI)` 全量注册）。纯逻辑导出 `resolveTimeline`、`usePaperToast`、`filterFocusable`、`nextFocusIndex`、`FOCUSABLE_SELECTOR`。

## 6. 视觉禁令的自动检查

`scripts/check-style.mjs` 扫描 `src/` 下的 `.css` 与 `.vue`，剥掉注释后检查 `border-radius` 取值、`box-shadow`、`scale(`、`transition` 属性白名单。命中打印文件与行号并以退出码 1 结束，纳入 `npm test`。

白名单内的过渡属性：`color`、`background-color`、`border-color`（含各向）、`outline-color`、`fill`、`stroke`、`opacity`、`transform`。`transform` 仅用于轻提示之外的毛刺场景，组件里出现需在评审时确认。

## 7. 分发

Vite 库模式输出 ESM，`peerDependencies` 只声明 `vue`。

```
dist/paper-ui.js      ESM，外部化 vue
dist/paper-ui.css     全部样式
dist/index.d.ts       类型入口
```

`exports` 暴露主入口、`./style.css`、`./tokens.css`、`./base.css`。消费方式为 `file:` 本地依赖或 npm 安装。

## 8. 测试

- `tests/*.test.ts` 覆盖 `src/lib/` 纯函数：时间轴当前节点与连线、提示队列容量与自动关闭、焦点筛选与 Tab 循环取模
- `tests/components.test.ts` 用 `@vue/test-utils` 断言类名、ARIA、插槽与事件，不测像素
- 视觉与动效由预览页人工验收

`check-style.mjs` 与单测共同构成 `npm test`。
