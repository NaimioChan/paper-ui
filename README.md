# paper-ui

纸感直角设计系统。Vue 3 组件库，只为「纸黄底、墨线、直角、无缩放」这一类界面服务。

第一个消费方是 BookChain（本校教材流转平台），组件清单按它的实际页面需求确定，不做用不上的组件。

## 起步

```bash
npm install
npm run dev         # 预览页 http://localhost:5180
npm test            # 视觉禁令检查 + 全部单测
npm run build       # 产出 dist/paper-ui.js 与 dist/paper-ui.css
```

## 使用

本地路径接入，不发布到 npm：

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

只想要令牌、自己写样式时引 `paper-ui/tokens.css` 与 `paper-ui/base.css`。

## 分层

```
src/styles/tokens.css       色、字号、间距、线宽、动效时长。改视觉只改这里
src/styles/base.css         重置、字体栈、正文排版、焦点轮廓
src/styles/components/*     组件私有样式，一个组件配一份
src/components/*.vue        组件实现，样式通过 <style src> 外链
src/lib/*.ts                无 DOM 依赖的纯逻辑（时间轴解析、提示队列、焦点计算）
```

组件 CSS 只读 CSS 变量，不出现字面色值。`border-radius` 只能是 0，正圆用 `var(--radius-round)`。

## 视觉禁令由脚本守

`scripts/check-style.mjs` 扫描 `src/`，命中即失败：

- `border-radius` 取值不是 0 或不是正圆令牌
- `box-shadow`
- `scale(`
- `transition` 出现颜色与透明度以外的属性（`transform` 仅轻提示入场使用）

规则出处是 `bookchain/web/DESIGN.md` 5.1 与 6.4 节。这套禁令靠人眼守不住，因此纳入 `npm test`。

## 与业务的分界

库不含业务概念。`PaperTag` 只接受 `tone`，不知道什么是「书况」；书况到色调的映射写在消费方。
一旦为某个业务场景造组件（例如 `PaperBookCondition`），这套库就不能复用到下一个项目了。

## 组件

布局 `PaperContainer` `PaperGrid` `PaperCell` `PaperStack`

表单 `PaperButton` `PaperField` `PaperInput` `PaperSelect` `PaperCheckbox` `PaperRadio`

展示 `PaperCard` `PaperTag` `PaperRule` `PaperStat` `PaperStatGroup` `PaperFigure` `PaperBadge` `PaperTimeline` `PaperTable` `PaperTabs`

反馈 `PaperDialog` `PaperToast` `PaperEmpty` `PaperSkeleton`

接口细节见 `DESIGN.md`。
