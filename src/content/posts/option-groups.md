---
title: Markdown 选项组
published: 2026-08-28
description: 以紧凑、可同步的 M3E 选项组呈现相关的 Markdown 备选写法。
tags: [演示, Markdown, 标签页, Shirone]
category: 指南
lang: en
draft: false
---

选项组把等价的说明集中在一起，无需重复周围的解释。每个选项都接受完整的块级 Markdown，而选中的值可与同一页面上的另一个组同步。

## 选择包管理器

用 `@tab:active` 指定初始选项。`#` 之后的后缀提供稳定取值，且不改变可见标题。

::: tabs#package-manager

@tab npm

使用 npm 安装包：

```powershell
npm install astro
```

@tab:active **pnpm**#pnpm

使用 pnpm 安装包：

```powershell
pnpm.cmd add astro
```

@tab Bun#bun

使用 Bun 安装包：

```powershell
bun add astro
```

:::

## 运行项目

本组共享 `package-manager` 标识。在上方选中某个选项会同步下方对应的命令，并为下次访问记住该选择。

::: tabs#package-manager

@tab npm

```powershell
npm run dev
```

@tab pnpm

```powershell
pnpm.cmd dev
```

@tab Bun#bun

```powershell
bun run dev
```

:::

## 多个备选

较长的选项行保持单行显示，在窄屏上于各自的导航区域内滚动。

::: tabs

@tab 本地工作站

开发功能时使用本地工具链。

@tab 托管预览环境

发布临时预览以供评审。

@tab 持续集成

为每次变更运行确定性校验。

@tab 生产部署

把已验证的产物提升到生产环境。

@tab 离线恢复流程

网络不可用时从本地产物恢复。

:::

## 作者语法

````markdown
::: tabs#package-manager

@tab npm

Use npm instructions here.

@tab:active **pnpm**#pnpm

Use pnpm instructions here.

:::
````

每个组至少需要两个 `@tab` 段落，且每段都需要正文内容，并与标记之间以空行分隔。无效或不完整的组仍会作为普通 Markdown 正常呈现。
