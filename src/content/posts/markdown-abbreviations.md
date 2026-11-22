---
title: Markdown 缩写
published: 2026-08-28
description: 一次性定义常见缩略语，并在正文中随时提供其完整含义。
tags: [演示, Markdown, 排版, Shirone]
category: 指南
lang: en
draft: false
---

缩写在让技术写作保持简洁的同时，为需要的读者保留完整术语。已定义的词会渲染为原生 `abbr` 元素，其含义在悬停时以及辅助技术中均可获取。

## 实际用法

以 SSR 优先的输出让初始文档在 JavaScript 运行之前即可见。衡量其阅读体验时，LCP 与 CLS 可揭示首屏内容是否快速且稳定。

缩写也可以出现在普通 Markdown 旁边，例如 **SSR** 指引，但 `SSR` 这样的字面量代码与 [LCP 文档](https://web.dev/articles/lcp) 这类链接仍保持原样。

## 定义术语

在同一 Markdown 文档的任意位置放置定义即可。它们不会渲染为可见段落，且只有该文章中匹配的词才会获得语义化缩写处理。

```markdown
*[SSR]: Server-Side Rendering
*[LCP]: Largest Contentful Paint
*[CLS]: Cumulative Layout Shift

SSR makes an HTML response available before client code runs.
```

*[SSR]: Server-Side Rendering
*[LCP]: Largest Contentful Paint
*[CLS]: Cumulative Layout Shift

## 写作边界

术语必须以字母或数字开头，且可包含字母、数字、句点、下划线、加号与连字符。每条定义仅作用于当前文章；无效或重复的定义会作为普通 Markdown 保留，而不会静默替换另一个术语。
