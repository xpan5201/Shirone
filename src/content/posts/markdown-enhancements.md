---
title: Shirone Markdown 扩展功能
published: 2026-08-19
pinned: true
description: 探索 Shirone 独有的 Markdown 扩展、富有表现力的组件与写作语法。
tags: [演示, Markdown, 扩展, 主题, Shirone]
series: markdown-syntax-guide
seriesOrder: 3
category: 指南
lang: en
draft: false
---

Shirone 提供了一组主题专属的 Markdown 扩展与自定义语法容器。它们构建在原生统一的 AST 处理管线之上，所有扩展都在站点构建阶段渲染为无障碍、语义化的 HTML，**客户端 JavaScript 水合开销为零**，并 **100% 对齐 M3E 设计令牌**。

## 文件树

文件树把多层项目结构、源码层级与终端目录输出转换为紧凑、可交互的树视图，并带来自动扩展名图标、差异高亮与可折叠分支。

### 1. 嵌套列表语法（`:::file-tree`）

当你直接用 Markdown 嵌套列表书写文件层级时，使用 `:::file-tree` 块指令。

```markdown
:::file-tree{title="Shirone source tree"}
- src
  - components/
    - ++ Navigation.svelte # added component
    - -- Button.astro # removed component
  - content
    - posts/
      - markdown-enhancements.md
  - layouts/
    - PostLayout.astro
  - plugins
    - markdown/
      - rehype-file-tree.mjs
  - styles
    - markdown/
      - trees.css
  - **content.config.ts** # important file
- public/
  - favicon.svg
- package.json
:::
```

:::file-tree{title="Shirone source tree"}
- src
  - components/
    - ++ Navigation.svelte # added component
    - -- Button.astro # removed component
  - content
    - posts/
      - markdown-enhancements.md
  - layouts/
    - PostLayout.astro
  - plugins
    - markdown/
      - rehype-file-tree.mjs
  - styles
    - markdown/
      - trees.css
  - **content.config.ts** # important file
- public/
  - favicon.svg
- package.json
:::

#### 编写规则与标记

- **差异状态**：在条目开头加 `++`（绿色背景与徽标）或 `--`（红色背景与删除线），即可高亮改动。
- **注释**：`#` 之后的任何文字都会渲染为弱化的右对齐行内注释。
- **强调**：用 `**bold**` 包裹名称，让关键文件获得更突出的视觉权重。
- **可折叠目录**：由嵌套列表项推断出的目录默认处于展开状态。在名称后加一个斜杠（例如 `components/`）即可创建折叠目录，读者可点击或用键盘导航展开。

---

### 2. 终端输出语法（```` ```file-tree ````）

当你已经有了 `tree` 这类命令行工具生成的目录树文本，可以直接粘贴进 `file-tree` 围栏代码块。Unicode 分支字符（`├──`、`└──`、`│`）与 ASCII 分支都会被自动解析。

````markdown
```file-tree title="Build output" icon="simple"
dist
├── _astro/
│   ├── index.css
│   └── page.js
└── favicon.ico
```
````

```file-tree title="Build output" icon="simple"
dist
├── _astro/
│   ├── index.css
│   └── page.js
└── favicon.ico
```

#### 配置选项

- `title="string"`：为树设置自定义标题栏标题与无障碍标签。
- `icon="colored" | "simple"`：在多色扩展名图标（`colored`，默认）与极简单色图标（`simple`）之间选择。

---

## 代码树

交互式代码树把左侧的多层文件层级导航与右侧即时的代码面板切换结合在一起，为多文件示例、模块或整目录走查提供类似 IDE 的阅读体验。

### 1. 容器语法（`:::code-tree`）

在 `:::code-tree` 块指令中组合多个围栏代码块，每个代码块通过 `title="path/to/file"` 指定自身路径。

````markdown
:::code-tree{title="Shirone Component Demo" height="380px" entry="src/Button.svelte"}
```svelte title="src/Button.svelte"
<script lang="ts">
  let { label = "Click me" } = $props();
</script>

<button class="m3-btn">{label}</button>
```

```stylus title="src/styles/button.styl"
.m3-btn
  background: var(--primary)
  color: var(--on-primary)
  border-radius: var(--shape-corner-m)
```

```json title="package.json"
{
  "name": "button-demo",
  "version": "1.0.0"
}
```
:::
````

:::code-tree{title="Shirone Component Demo" height="380px" entry="src/Button.svelte"}
```svelte title="src/Button.svelte"
<script lang="ts">
  let { label = "Click me" } = $props();
</script>

<button class="m3-btn">{label}</button>
```

```stylus title="src/styles/button.styl"
.m3-btn
  background: var(--primary)
  color: var(--on-primary)
  border-radius: var(--shape-corner-m)
```

```json title="package.json"
{
  "name": "button-demo",
  "version": "1.0.0"
}
```
:::

#### 配置与标记

- `title="string"`：为代码树设置标题栏标题与无障碍标签。
- `height="string"`：设置桌面端视图的高度（默认 `420px`，例如 `380px`、`26rem`）。
- `entry="filepath"`：指定首次加载时处于激活状态的文件。
- `icon="colored" | "simple"`：在彩色图标与极简单色文件图标之间切换。
- `:active`：在任意围栏代码块上标注 `:active`，即可将其设为默认激活的标签页。

---

### 2. 本地目录自动导入（`@[code-tree]`）

直接指向工作区中的任意本地目录路径，构建时便会自动扫描并生成交互式代码树，无需手动复制文件内容。

```markdown
@[code-tree title="Anime Utilities" entry="status.ts"](/src/utils/anime)
```

@[code-tree title="Site Configuration" entry="siteConfig.ts"](/src/config)

