---
title: Markdown 提示块
published: 2026-08-27
description: 用 Shirone 的 M3E Markdown 容器呈现注记、警告与可选细节。
tags: [演示, Markdown, 提示块, Shirone]
category: 指南
lang: en
draft: false
---

提示块让辅助信息在视觉上独立，同时保持文章的阅读流。所有形式都在服务端渲染，并使用同一个紧凑的 M3E 组件。

## 语义变体

::: note 部署上下文
空格分隔写法接受纯文本自定义标题，同时仍兼容方括号语法。
:::

:::info
信息块用于中性的上下文说明，帮助读者理解所在章节。
:::

:::tip[既有的 **标签** 语法]
原有的方括号标签仍然可用，且可包含行内 Markdown 强调。
:::

> [!IMPORTANT]
> GitHub Alert 语法会进入同一个渲染器，因此既有文章保持统一的视觉语言。

:::warning
在生产构建之前先检查环境变量。
:::

:::caution
不要在示例中发布凭证、本地配置或私钥。
:::

## 可选细节

::: details 查看完整命令
该展开项使用浏览器原生语义，无需客户端 JavaScript 即可用键盘访问。

```powershell
npx.cmd astro check
pnpm.cmd build
```

- 初始为收起状态。
- 较长的代码可在各自的代码块内滚动。
- 在窄屏上容器仍保持在文章宽度之内。
:::

## 作者语法

```markdown
:::note[Existing title syntax]
Content
:::

::: warning Plume-compatible title syntax
Content
:::

> [!TIP]
> GitHub Alert syntax

::: details Optional content
Hidden until the reader opens it.
:::
```
