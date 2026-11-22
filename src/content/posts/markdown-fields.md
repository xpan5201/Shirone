---
title: Markdown 字段卡片
description: API 与组件参数的文档卡片。
published: 2026-08-30
category: 指南
draft: true
---

当多个相关选项属于同一个 API 或组件时，使用 `field-group`。把字段名写在起始行，然后在描述之前添加元数据标签。

:::: field-group

::: field tex
@type object
@optional

TeX 解析器选项。
:::

::: field output
@type `'svg' | 'chtml'`
@default `'svg'`
@optional

输出格式，SVG 或通用 HTML。
:::

::::

## 基本字段

必填、可选与已弃用状态可以在同一个分组中混用。默认值与类型分开显示，便于快速扫读。

:::: field-group

::: field title
@type string
@required

组件的可见标题。该值会显示在页面标题中，应尽量简短以便快速扫读。
:::

::: field disabled
@type boolean
@default `false`
@optional

控件初始是否处于禁用状态。
:::

::: field locale
@type `'en' | 'zh-CN' | 'ja-JP'`
@default `'en'`
@optional

用于格式化日期、数字与无障碍标签的区域设置。
:::

::::

## 富文本描述

描述就是普通的 Markdown。在元数据行之后，链接、强调、列表与行内代码依然可用。

:::: field-group

::: field render
@type `(value: unknown) => string`
@required

把值渲染为最终输出。回调应返回 **安全字符串**，并可使用 `formatValue` 辅助函数。

- 保持渲染的确定性。
- 避免在回调中发起网络请求。
:::

::: field retries
@type number
@default `3`
@optional

请求被判定为失败之前的最大尝试次数。
:::

::: field legacyMode
@type boolean
@deprecated

为向后兼容而保留。新的集成应改用 `compatibility`。
:::

::::

## 独立字段

在示例或代码块旁记录单个选项时，可以不放在分组中而直接使用单个字段。

::: field format
@type `'short' | 'long'`
@default `'short'`
@optional

控制结果的格式化方式。
:::

## 编写说明

- `@type` 与 `@default` 的值会渲染为代码标记。
- `@required`、`@optional` 与 `@deprecated` 会添加状态徽标。
- 元数据之后的任何普通 Markdown 都会成为字段描述。
- 未知的 `@tags` 会作为描述文字保留显示，而不是被丢弃。
