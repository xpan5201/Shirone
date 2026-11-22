---
title: Markdown 剧透
published: 2026-08-28
description: 在 Shirone Markdown 中隐藏行内答案，同时保持剧透内容仍可访问。
tags: [演示, Markdown, 无障碍, Shirone]
category: 指南
lang: en
draft: false
---

剧透用于隐藏简短答案或情节细节，但不把它们从文档中移除。悬停、聚焦或激活原生控件即可显示内容。

## 行内细节

答案是 :spoiler[**42**]，这句话在其周围仍是普通 Markdown。

剧透可以包含 `inline code` 和 :spoiler[一段带**强调**的较长细节]。

## 作者语法

```markdown
The answer is :spoiler[42].
```

生成的 HTML 使用带 `aria-expanded` 状态的原生按钮。即使没有 JavaScript，悬停与聚焦也能显示文本；可选运行时额外提供点击与键盘切换。
