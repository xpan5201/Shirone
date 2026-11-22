---
title: Markdown 标记高亮
published: 2026-08-28
description: 用 token 驱动的标记语法在 Shirone Markdown 中高亮关键短语。
tags: [演示, Markdown, 排版, Shirone]
category: 指南
lang: en
draft: false
---

标记高亮把注意力引向某个具体短语，而不会把所在段落变成独立组件。它们在构建时渲染为原生 `<mark>` 元素，并继承当前的 M3E 配色体系。

## 默认强调

当文章的主色应当承载强调时，使用 `==text==`。适合在一段普通文字中，为 ==读者应当记住的一个决定== 加亮。

当短语需要更强的层级时，标记内可以包含 ==嵌套的 **Markdown 强调**==。

## 语义颜色

当含义需要不同的色调角色时，追加后缀。可用的变体有 `primary`、`secondary`、`tertiary`、`error` 与 `tip`。

- ==主要色把短语与当前主题相连=={.primary}
- ==次要色保持辅助性区分的低调=={.secondary}
- ==第三色添加独立的编辑信号=={.tertiary}
- ==错误色标识需要修正的状况=={.error}
- ==提示色突出实用指引=={.tip}

## 作者语法

```markdown
==Primary marker==

==Secondary marker=={.secondary}
==Tertiary marker=={.tertiary}
==Error marker=={.error}
==Tip marker=={.tip}
```

像 `==literal marker syntax==` 这样的行内代码与围栏示例保持字面量，因此文档可以说明该语法而不触发它。
