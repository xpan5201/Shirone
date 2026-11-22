---
title: Markdown 折叠面板
published: 2026-08-28
description: 把可选的 Markdown 内容归入紧凑、无障碍的 M3E 折叠面板。
tags: [演示, Markdown, 折叠, Shirone]
category: 指南
lang: en
draft: false
---

折叠面板把相关的可选细节收进一个紧凑分组。标题与正文保留行内与块级 Markdown，同时借助原生展开语义，使每个面板无需客户端 JavaScript 即可使用。

## 独立面板

各项默认独立展开。在标题前加 `:+` 可让该项初始展开，加 `:-` 则在该组使用 `expand` 时保持收起。

::: collapse
- **包依赖要求**

  安装包之前请使用 Node.js 26.13.0 或更高版本，并启用 Corepack。

- :+ 安装依赖

  在仓库根目录运行工作区的包管理命令。

  ```powershell
  pnpm.cmd install
  ```

- 校验命令

  在构建生产输出之前检查内容流水线。

  - `pnpm.cmd check:manifest`
  - `npx.cmd astro check`
:::

## 手风琴模式

当同时只应展开一个答案时，添加 `accordion`。浏览器直接把这些原生展开项归为一组，因此打开另一项会关闭上一项，无需客户端水合。

::: collapse accordion expand
- 这里的 `expand` 有什么作用？

  当没有任何项带 `:+` 标记时，它会初始展开第一项。

- 标题可以包含 Markdown 吗？

  可以。标题支持行内 **强调** 与 `code`，面板正文支持完整的块级 Markdown。

- 在窄屏上会怎样？

  内容内边距收紧，长文本自动换行，内嵌代码保留各自的横向滚动区域。
:::

## 作者语法

````markdown
::: collapse accordion
- :+ First title

  First panel content.

- Second title with `code`

  Second panel content.
:::
````

容器内必须恰好包含一个顶层无序列表。每一项都需要标题段落、空行和正文内容。无效或混杂的输入仍会作为普通可读的 Markdown 列表呈现。
