# MD-View UI Style Guide

本文档是 MD-View 的 UI 风格规范，作为产品迭代时的**单一事实来源**，用于保持视觉与交互一致，避免 UI 撕裂。新增或修改界面时请优先参考本文档与 `lib/ui-classes.ts`。

---

## 1. 概述与原则

- **用途**：防止 UI 撕裂、统一视觉与交互；供开发与设计在迭代时对齐。
- **原则**：
  - 优先使用 `lib/ui-classes.ts` 中的 `ui` 映射。
  - 新样式优先使用 Tailwind 工具类 + 本文档中的设计令牌。
  - 避免随意新增硬编码颜色、阴影、圆角；若必须使用任意值，请在本文档中补充说明。

---

## 2. 设计令牌（Design Tokens）

来源：`app/globals.css` 的 `:root`。

### 颜色

| 变量 | 值 | 用途 |
|------|-----|------|
| `--background` | `#f6f7f3` | 页面背景基色 |
| `--foreground` | `#12263a` | 主文字色 |
| `--muted` | `#edf2f6` | 弱化背景/区块 |
| `--muted-foreground` | `#5f7082` | 次要文字 |
| `--border` | `#d7e1e8` | 边框 |
| `--accent` | `#eaf0f4` | 强调背景 |
| `--accent-foreground` | `#12263a` | 强调区文字 |
| `--brand-50` | `#f0fdfa` | 品牌最浅 |
| `--brand-100` | `#ccfbf1` | |
| `--brand-200` | `#99f6e4` | |
| `--brand-300` | `#5eead4` | |
| `--brand-400` | `#2dd4bf` | |
| `--brand-500` | `#14b8a6` | |
| `--brand-600` | `#0d9488` | |
| `--brand-700` | `#0f766e` | 品牌主色（按钮、链接等） |

### 渐变

| 变量 | 用途 |
|------|------|
| `--gradient-brand` | 品牌强调（teal → cyan → amber） |
| `--gradient-subtle` | 淡色背景渐变 |
| `--gradient-surface` | 表面渐变（白 → 浅灰） |
| `--gradient-glow` | 顶部光晕（径向） |

### 阴影

| 变量 | 用途 |
|------|------|
| `--shadow-xs` ~ `--shadow-xl` | 通用深度层级（xs 最轻，xl 最深） |
| `--shadow-glow` | 品牌色光晕 |
| `--shadow-glow-strong` | 更强品牌光晕 |
| `--shadow-inner` | 内凹 |
| `--shadow-ring` | 焦点环（3px 青色） |

### 动效

| 变量 | 值 | 用途 |
|------|-----|------|
| `--ease-out-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` | 出场、缩放 |
| `--ease-in-out-expo` | `cubic-bezier(0.87, 0, 0.13, 1)` | 循环、背景动效 |
| `--ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | 弹性 |
| `--duration-fast` | `150ms` | 按钮、hover |
| `--duration-normal` | `250ms` | 一般过渡 |
| `--duration-slow` | `400ms` | 较慢过渡 |

### 圆角

| 变量 | 值 | Tailwind 近似 |
|------|-----|----------------|
| `--radius-sm` | `6px` | 小控件 |
| `--radius-md` | `10px` | `rounded-lg` 等 |
| `--radius-lg` | `14px` | |
| `--radius-xl` | `20px` | `rounded-xl` |
| `--radius-2xl` | `28px` | `rounded-2xl`（面板） |
| `--radius-full` | `9999px` | `rounded-full`（徽章、药丸） |

### 字体

| 变量 | 字体栈 | 用途 |
|------|--------|------|
| `--font-geist-sans` | Space Grotesk, system-ui, … | 界面与正文 |
| `--font-geist-mono` | IBM Plex Mono, SF Mono, … | 编辑器、代码块 |

---

## 3. 色彩规范

### 主色 / 品牌

- **主按钮、链接、强调**：cyan/teal 系。
  - 主按钮：`bg-cyan-700`，hover `bg-cyan-600`。
  - 焦点环：`ring-cyan-500/35` 或主按钮 `ring-cyan-500/50`。
  - 链接：`#0f766e`（对应 `--brand-700`）。
- Tailwind 与 CSS 变量对应：`cyan-700` ≈ `--brand-700`；`cyan-500` 用于焦点与高亮。

### 中性色（Slate）

- **标题/重要文字**：`text-slate-900`。
- **正文**：`text-slate-700`、`text-slate-800`。
- **次要/说明**：`text-slate-500`、`text-slate-600`。
- **占位/辅助**：`text-slate-400`。
- **边框**：`border-slate-200`、`border-slate-300`、`border-slate-300/55` 等；半透明时用 `/65`、`/70`。
- **背景**：`bg-white`、`bg-slate-50`、`bg-slate-100`；毛玻璃用 `bg-white/95`、`backdrop-blur`。

### 语义色

- **成功 / 信息 / 主操作**：cyan-teal（见上）。
- **警告 / 统计**：amber，如 `text-amber-700`（统计数字）、`text-amber-600`（图标）。
- **错误 / 提示**：rose，如 `border-rose-200/70`、`bg-rose-50/90`、`text-rose-700`（URL 导入错误等）。

### 预览区（.markdown-preview）

- 使用 `--mdv-*` 变量，由主题与 `app/globals.css` 中的 `.markdown-preview` 和 `.markdown-preview[data-theme='dark']` 定义。
- 变量名：`--mdv-background`、`--mdv-foreground`、`--mdv-muted`、`--mdv-muted-foreground`、`--mdv-border`、`--mdv-accent`、`--mdv-accent-foreground`、`--mdv-link`、`--mdv-link-hover`、`--mdv-marker`。
- 具体色值以 `globals.css` 为准。

---

## 4. 字体与排版

- **无衬线**：Space Grotesk（`--font-geist-sans`），用于界面与正文。
- **等宽**：IBM Plex Mono（`--font-geist-mono`），用于编辑区与代码块。

### 字号

- `text-[11px]`：统计药丸、部分移动端标签、语言徽章。
- `text-xs`：按钮、标签、Footer 徽章。
- `text-sm`：正文、输入框、菜单项、选择器。
- `text-lg`：品牌标题（如 “MD-View”）。
- `text-base`：未特别强调时可用。

### 字重

- `font-medium`：次要按钮、说明文字。
- `font-semibold`：主按钮、统计、重要标签。
- `font-bold`：品牌标题、面板标题。

### 字间距

- 统计药丸：`tracking-[0.14em]`、`uppercase`。
- 代码块语言徽章：`tracking-[0.08em]`、`uppercase`。

---

## 5. 间距与布局

### 断点（与 Tailwind 一致）

- `sm`：640px。
- `md`：768px — 导航行改为横排、分栏显示、部分控件显示。
- `lg`：1024px — 紧凑导航判断（1000px 在代码中用于 `isNavCompact`）、大屏 padding。
- `xl`：1280px — 统计药丸（字数/行数/KB）显示。

### 间距尺度

- 常用：`gap-1`、`gap-2`、`gap-2.5`、`gap-3`、`gap-4`；`px-2`、`px-3`、`px-4`、`px-5`；`py-1.5`、`py-2`、`py-3`。
- Header：`headerInner` 使用 `gap-2.5 px-3 pb-3 pt-3`，`sm:gap-3 sm:px-4 sm:py-3`，`lg:px-5`。
- 主内容区（`ui.home.container`）：`gap-3 px-3 pb-3 pt-2`，`sm:px-4 sm:pb-4`，`lg:gap-4 lg:px-5 lg:pb-5`。
- 面板内（如 Editor/Preview 标题栏下）：`p-6 sm:p-10`（由主题 container 控制）。

### 面板与两栏

- 两栏布局：`gap-2 lg:gap-3`（`md:flex-row` 时）。
- 面板：使用 `ui.home.panel`，内部用 `flex flex-col flex-1 min-h-0` 保证滚动与占满高度。

---

## 6. 圆角与阴影

### 圆角

- 小控件、按钮组：`rounded-lg`。
- 卡片、主面板：`rounded-2xl`。
- 下拉、菜单、输入容器：`rounded-xl`。
- 药丸、徽章：`rounded-full`。
- 代码块、Mermaid：`rounded-[0.75rem]`（约 12px）。

### 阴影

- **主面板**：`shadow-[0_18px_45px_-30px_rgba(15,23,42,0.65)]`，配合 `ring-1 ring-white/60`、`backdrop-blur-md`。
- **下拉 / 右键菜单**：`shadow-[0_16px_36px_-22px_rgba(15,23,42,0.8)]` 或类似，`ring-1 ring-black/5` 或 `ring-white/70`。
- **浮动按钮（如回到顶部）**：`shadow-[0_12px_28px_-16px_...]`，hover 可加强为带青色的阴影。
- 轻量：`shadow-sm`、`shadow-md` 用于输入框、选择器。

---

## 7. 组件风格约定

以 `lib/ui-classes.ts` 为基准；新组件应与之保持一致。

### 按钮

- **primary**（`ui.home.buttons.primary`）：实心 `bg-cyan-700`，白字，hover `bg-cyan-600`，`active:scale-[0.97]`，焦点 `ring-2 ring-cyan-500/50 ring-offset-2`。
- **secondary**（`ui.home.buttons.secondary`）：白底 `border border-slate-300`，`hover:bg-slate-50`，`active:scale-[0.97]`，焦点 `ring-cyan-500/35`。
- **quietNav**（`ui.home.buttons.quietNav`）：透明边框、`text-slate-500`，hover 出现边框和 `bg-slate-50`、`text-slate-700`，`active:scale-[0.95]`。

### 面板

- **ui.home.panel**：白底半透明、圆角 2xl、细边框、背模糊、阴影与 ring 见上。内部标题栏常用：`border-b border-slate-200/65`、`bg-gradient-to-r from-white to-slate-100/60`、`px-5 py-3`。

### 头部

- **ui.home.header**：`sticky top-0 z-30`，`border-b border-slate-200`，`bg-white/95 backdrop-blur`。
- **headerInner**：见“间距与布局”。
- **navRow**：`flex-col gap-2`，`md:flex-row md:items-center md:justify-between md:gap-4`。
- **brandLink**：`rounded-lg border border-slate-200 bg-white`，hover 边框与背景略深。
- **statPill**：`rounded-full border border-slate-200 bg-white`，`text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600`。

### 输入与下拉

- URL 输入区：`rounded-xl border border-slate-200 bg-white`，内边距 `px-2.5 py-1.5` 或 `px-2 py-1`（移动端）；输入框 `text-sm text-slate-700 placeholder:text-slate-400`。
- ThemeSelector / CompactThemeSelector：`rounded-xl` 或 `rounded-lg`，`border border-slate-300/65` 或 `border-slate-300/70`，`bg-white/90`，hover `border-cyan-300/55`，焦点 `ring-2 ring-cyan-500/35`。
- ViewModeSelector：容器 `rounded-lg border border-slate-200 bg-white p-1`；当前项 `bg-slate-900 text-white`，非当前 `text-slate-600 hover:bg-slate-100 hover:text-slate-800`。

### 菜单 / 下拉

- 导出菜单、ContextMenu 等浮层：
  - 容器：`rounded-xl border border-slate-300/70 bg-white/95 p-1.5 shadow-lg ring-1 ring-black/5 backdrop-blur-md`。
  - 菜单项：`rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100`，焦点 `focus-visible:ring-2 focus-visible:ring-cyan-500/35`。
- 图标：常用 `h-4 w-4` 或 `h-3.5 w-3.5`（紧凑处），颜色 `text-slate-500`、`text-cyan-700` 等。

### 编辑器与预览

- **编辑器 textarea**：`bg-gradient-to-b from-white to-slate-50/40`，焦点 `focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyan-500/30`，字体 `var(--font-geist-mono)`。
- **预览区**：由 `lib/themes.ts` 与 `.markdown-preview` 的 CSS 变量控制；应用壳不改变预览主题色系，仅提供布局与 wrapper。

---

## 8. 焦点、悬停与动效

### 焦点

- 统一：`focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/35`（或主按钮 `/50`），`ring-offset-1` 或 `ring-offset-2`。
- 不要仅用 `outline`，保持 ring 风格一致。

### 悬停

- 主按钮：`hover:bg-cyan-600`。
- 次要/链接：`hover:bg-slate-50`、`hover:text-slate-800`、`hover:border-slate-300` 或 `hover:border-cyan-300`。
- 品牌链接：`hover:border-cyan-300 hover:bg-slate-50`。

### 按压

- 按钮：`active:scale-[0.97]` 或 `active:scale-[0.95]`（quietNav 等更轻的按钮）。

### 过渡

- 常用：`transition-colors duration-150` 或 `transition-all duration-200`。
- 复杂动效使用 CSS 变量：`var(--ease-out-expo)`、`var(--duration-fast)` 等。

### 动画

- **scale-in**：下拉/浮层出现，180ms，`var(--ease-out-expo)`；类名 `animate-scale-in`。
- **drift-glow**：背景光晕缓慢位移，18s，`var(--ease-in-out-expo)`，alternate；用于 `body::before`。

---

## 9. Z-Index 与层级

| 层级 | 值 | 用途 |
|------|-----|------|
| 背景 | 默认 / -1 | 背景光晕等 |
| 内容 | 默认 | 主内容、面板 |
| 顶栏 | `z-30` | Header（sticky） |
| 浮动按钮 | `z-40` | “回到顶部”等 |
| 下拉/菜单/右键菜单 | `z-50` | 导出菜单、ContextMenu、所有 popover |

新增浮层时优先使用 `z-50`，避免在 30–50 之间随意插入新值。

---

## 10. 预览与 Markdown 相关

### 预览容器

- 类名：`.markdown-preview`；暗色主题 `[data-theme='dark']`。
- 变量：见“色彩规范 — 预览区”；具体定义在 `app/globals.css`。

### 代码块

- 外层：`.mdv-code`（与 `ui.preview.code.wrapper` 的 `mdv-code` 一致）；`border-radius: 0.75rem`，`margin: 1.25rem 0`。
- 顶栏：`.mdv-code-header`，`ui.preview.code.header`；底部分隔线 `border-bottom: 1px solid rgba(148,163,184,0.2)`。
- 语言标签：`ui.preview.code.languageBadge`（`text-[11px] font-semibold uppercase tracking-[0.08em]`）。
- 复制按钮：`ui.preview.code.copyButton`，焦点 ring 与 `active:scale-[0.97]`。

### Mermaid

- 容器：`.mdv-mermaid`，`border: 1px solid var(--mdv-border)`，`border-radius: 0.75rem`，`background: var(--mdv-background)`，`margin: 1.25rem 0`。
- 图区域：`.mdv-mermaid-diagram`，`padding: 0.75rem`。
- 状态/错误：`.mdv-mermaid-status`（`color: var(--mdv-muted-foreground)`），`.mdv-mermaid-error`（`color: #b91c1c`）。

### 语法高亮

- 使用 highlight.js，样式全部在 `app/globals.css` 内定义，不引入 CDN。
- 类名约定：`.hljs`、`.hljs-comment`、`.hljs-keyword`、`.hljs-string` 等；各 token 颜色以 globals 为准，主题可在 `lib/themes.ts` 的 `customStyles` 中覆盖。

---

## 11. 主题系统（预览）简述

- 定义在 `lib/themes.ts`。
- **Theme 结构**：`name`、`displayName`、`description`、`classes.container`、`classes.prose`、可选 `customStyles`。
- **约定**：新增主题只扩展 `themes` 数组与 `customStyles`；全局应用壳（Header、按钮、面板边框等）保持 slate/cyan 色系，不随预览主题改变。

---

## 12. 使用约定与检查清单

### 新增 UI 时

- 优先使用 `ui.*` 中已有类；其次用本文档中的 Tailwind 颜色、圆角、阴影。
- 避免任意值（如 `rounded-[13px]`、随意 hex）除非在本文档中补充说明并注明原因。

### 修改现有组件时

- 保持与 `ui-classes.ts` 和本文档一致；若新增设计令牌，请在 `app/globals.css` 与本文档中同步更新。

### 侧边栏与文件树

- **Space 侧边栏**：使用 `ui.sidebar.*`（见 `lib/ui-classes.ts`）；宽度展开约 16rem、收起约 2.5rem；`md` 以下隐藏（`hidden md:flex`）。树节点行：极简风格，hover `bg-slate-100`，选中文件 `bg-cyan-50`；空状态居中灰色文案 "Empty"（`text-slate-400 text-sm`）。

### 检查清单（可选）

- [ ] 新按钮是否使用了 `ui.home.buttons.*` 或与之一致的类？
- [ ] 新浮层/下拉是否使用 `z-50`？
- [ ] 焦点是否统一为 `ring-2 ring-cyan-500/35`（或 /50）？
- [ ] 圆角是否使用 `rounded-lg` / `rounded-xl` / `rounded-2xl` / `rounded-full` 之一？
- [ ] 新颜色是否落在 slate / cyan / amber / rose 规范内？
