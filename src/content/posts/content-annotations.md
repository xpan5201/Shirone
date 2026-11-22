---
title: 正文批注
published: 2026-08-27
description: 为 Shirone 文章添加紧凑、无障碍的辅助注记，且不打断阅读流。
tags: [演示, Markdown, 批注, Shirone]
category: 指南
lang: en
draft: false
---

正文批注让辅助性上下文紧贴某一句，而不直接插入阅读流中。激活小注记标记即可展开其内容。

## 基本语法

在普通正文中加入 `[+label]` 引用，然后在同一篇文章的其他位置定义对应的注记。

```markdown
Astro renders most of a page ahead of time and hydrates **interactive islands** [+islands] only when they need to become interactive.

[+islands]:
  An island is an interactive UI component surrounded by static HTML. This keeps the default page lightweight while preserving focused interactivity.
```

Astro 会提前渲染页面的绝大部分内容，仅在需要交互时才对 **交互式岛屿** [+islands] 进行水合。

[+islands]:
  岛屿是由静态 HTML 包围的交互式 UI 组件。这样既保持了默认页面的轻量，又保留了聚焦的交互能力。

## 富内容

定义中可包含段落、强调、链接、列表与行内代码 [+rich-note]，而周围的句子照常继续。

[+rich-note]:
  **写作指引**

  - 首句应能独立成意。
  - 读者可能需要原始出处时，请附上链接。
  - 优先给出简洁示例，例如 `client:visible`。

  完整的模型说明见 [Astro 岛屿文档](https://docs.astro.build/en/concepts/islands/)。

## 多条定义

复用同一个标签 [+review]，即可在一个标记后呈现一组简短的相关注记。

[+review]: 先给出会改变读者下一步动作的结论。
[+review]: 把实现证据与背景信息分开。
[+review]: 删除属于正文而非批注的细节。

未定义的引用（例如 `[+missing]`）会保持为普通文本，因此未完成的定义绝不会生成空控件。
