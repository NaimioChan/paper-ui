# paper-ui

纸感直角设计系统。Vue 3 组件库，面向纸黄底色、直角色块、一像素线这一类界面。可被任意项目消费。

## 起步

```bash
npm install
npm run dev         # 预览页 http://localhost:5180
npm test            # 视觉禁令检查 + 全部单测
npm run build       # 产出 dist/
```

## 使用

```json
{ "dependencies": { "paper-ui": "file:../paper-ui" } }
```

```ts
// main.ts
import PaperUI from 'paper-ui'
import 'paper-ui/style.css'

app.use(PaperUI)
```

按需引入：

```ts
import { PaperButton, PaperTag } from 'paper-ui'
```

只要令牌、自己写样式时引 `paper-ui/tokens.css` 与 `paper-ui/base.css`。

## 定制

全部视觉参数在 `src/styles/tokens.css`。覆盖其中的变量即可换色、改字号、调噪点浓度。

```css
:root {
  --paper: #f4efe2;
  --orange: #b8481a;
  --noise-opacity: 0.18;
  --noise-scale: 200px;
}
```

纸噪由两个 SVG data URL 提供：`--noise-image` 是半透明黑点，供浅色表面；`--noise-image-dark` 是半透明白点，供深色表面。浓度档位见 `.paper-noise--strong` / `--faint` / `--plain`。

## 悬停

所有可交互控件的悬停一律为拉出式：色块从左向右展开，文字翻为纸黄。由 `clip-path` 实现，不做位移与缩放。

## 分层

```
src/styles/tokens.css       全部 CSS 变量
src/styles/base.css         重置、排版、纸噪工具类、构成主义工具类
src/styles/components/*     组件私有样式
src/components/*.vue        组件实现，<style src> 外链
src/lib/*.ts                无 DOM 依赖的纯逻辑
```

## 视觉禁令由脚本守

`scripts/check-style.mjs` 扫描 `src/`，命中即失败：

- `border-radius` 不是 0、`inherit` 或正圆令牌
- `box-shadow`
- `scale(`
- `transition` 出现白名单外的属性

纳入 `npm test`。

## 组件

布局 `PaperContainer` `PaperGrid` `PaperCell` `PaperStack` `PaperComposition` `PaperShell`

导航 `PaperNavbar` `PaperSidebar`

表单 `PaperButton` `PaperField` `PaperInput` `PaperSelect` `PaperCheckbox` `PaperRadio`

展示 `PaperCard` `PaperSlab` `PaperTag` `PaperRule` `PaperMega` `PaperStat` `PaperStatGroup` `PaperFigure` `PaperBadge` `PaperTimeline` `PaperTable` `PaperTabs`

反馈 `PaperDialog` `PaperToast` `PaperEmpty` `PaperSkeleton`

接口细节见 `DESIGN.md`。
