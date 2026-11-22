---
title: Markdown 步骤
published: 2026-08-27
description: 在 Shirone 中以紧凑、无障碍的步骤流呈现顺序化说明。
tags: [演示, Markdown, 步骤, Shirone]
category: 指南
lang: en
draft: false
---

当流程的先后顺序重要时，请使用 Steps。该组件保持文章的阅读流完整：安静的编号导轨提供方位感，而标题、段落、链接、列表与代码仍保留各自的 Markdown 原生语义。

## 有序列表语法

把一个 Markdown 有序列表包进 `:::steps` 容器。每个顶层列表项变成一个步骤。

````markdown
:::steps[Production deployment]
1. **Clone and prepare the workspace**

   Clone the repository and enter the project directory.

   ```powershell
   git clone https://github.com/LyraVoid/Shirone.git
   Set-Location Shirone
   ```

2. **Install dependencies**

   Use the repository's pinned package manager.

   ```powershell
   pnpm.cmd install
   ```

3. **Run project checks**

   Confirm Astro diagnostics and TypeScript checks pass.

   ```powershell
   npx.cmd astro check
   pnpm.cmd type-check
   ```

4. **Build the production site**

   Generate the static site and search index.

   ```powershell
   pnpm.cmd build
   ```
:::
````

:::steps[生产部署]
1. **克隆并准备工作区**

   克隆仓库并进入项目目录。

   ```powershell
   git clone https://github.com/LyraVoid/Shirone.git
   Set-Location Shirone
   ```

2. **安装依赖**

   使用仓库固定的包管理器。

   ```powershell
   pnpm.cmd install
   ```

3. **运行项目检查**

   确认 Astro 诊断与 TypeScript 检查均通过。

   ```powershell
   npx.cmd astro check
   pnpm.cmd type-check
   ```

4. **构建生产站点**

   生成静态站点与搜索索引。

   ```powershell
   pnpm.cmd build
   ```
:::

## 选项

- `:::steps[Title]` 或 `title="Title"` 添加可见标签与无障碍名称。
- `start=4` 改变首个显示的步骤编号。
- 容器必须恰好包含一个有序列表。无效或混杂的输入仍会作为普通可读的 Markdown 呈现，而不会被启发式地解释。
- 渲染在站点构建时完成，不增加客户端 JavaScript 或网络请求。
