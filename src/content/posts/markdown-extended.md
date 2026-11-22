---
title: Markdown 扩展特性
published: 2024-05-01
updated: 2024-11-29
description: '进一步了解 Fuwari 中的 Markdown 功能'
image: ''
tags: [演示, 示例, Markdown, Fuwari]
series: markdown-syntax-guide
seriesOrder: 2
draft: false 
---

## GitHub 仓库卡片
你可以添加链接到 GitHub 仓库的动态卡片，页面加载时，仓库信息会从 GitHub API 拉取。 

::github{repo="Fabrizz/MMM-OnSpotify"}

用 `::github{repo="<owner>/<repo>"}` 这段代码创建一个 GitHub 仓库卡片。

```markdown
::github{repo="saicaca/fuwari"}
```

## Mermaid 图表

围栏 `mermaid` 代码块会渲染为图表，并跟随当前配色方案。

```mermaid
flowchart LR
    accTitle: Markdown rendering pipeline
    accDescr: Markdown source is transformed into semantic HTML and then enhanced as a themed SVG diagram.
    A[Markdown source] --> B[Astro content pipeline]
    B --> C[Semantic HTML]
    C --> D[Themed diagram]
```

## 提示块

支持以下提示块类型：`note` `tip` `important` `warning` `caution`

:::note
突出显示用户即使快速浏览也应当留意的信息。
:::

:::tip
可选信息，帮助用户更顺利地完成任务。
:::

:::important
用户完成任务所必需的关键信息。
:::

:::warning
因存在潜在风险而需要用户立即关注的重要内容。
:::

:::caution
某项操作可能带来的负面后果。
:::

### 基本语法

```markdown
:::note
Highlights information that users should take into account, even when skimming.
:::

:::tip
Optional information to help a user be more successful.
:::
```

### 自定义标题

提示块的标题可以自定义。

:::note[自定义标题]
这是一个带自定义标题的提示块。
:::

```markdown
:::note[MY CUSTOM TITLE]
This is a note with a custom title.
:::
```

### GitHub 语法

> [!TIP]
> [GitHub 语法](https://github.com/orgs/community/discussions/16925)同样受支持。

```
> [!NOTE]
> The GitHub syntax is also supported.

> [!TIP]
> The GitHub syntax is also supported.
```

### 剧透

你可以为文字添加剧透。剧透文字同样支持 **Markdown** 语法。

这段内容 :spoiler[被隐藏了 **ayyy**]！

```markdown
The content :spoiler[is hidden **ayyy**]!

```

## 图片宽度与题注

独立图片可以在 alt 文本中使用可选的 `w-N%` 宽度标记，并用 Markdown 标题渲染为图片下方的居中题注：

![专辑示例图片 w-50%](/images/albums/AcgExample/07.webp "带题注的半宽图片")

```markdown
![Image description w-50%](./image.webp "Visible caption")
```

有效宽度从 `w-1%` 到 `w-100%`；无效标记会留在 alt 文本中。宽度与题注彼此独立，只写标题同样会生成题注：

![专辑示例图片 w-75%](/images/albums/AcgExample/08.webp)

![专辑示例图片](/images/albums/AcgExample/09.webp "不带宽度标记的题注")