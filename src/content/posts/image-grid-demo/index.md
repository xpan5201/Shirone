---
title: "图片画廊网格：语法与完整示例"
published: 2026-07-13
description: "图片画廊网格的语法、参数、裁剪、响应式行为、说明文字与灯箱导航完整指南。"
tags: [Markdown, 画廊, 图片网格, 演示]
category: "示例"
draft: false
---

`:::grid` 是博客的图片画廊容器指令。它把普通的 Markdown 图片排列成比例一致、响应式的网格，并自动启用灯箱浏览。适用于文章配图、截图、作品集或小型相册。

同一画廊中的图片使用相同的卡片比例。默认由居中裁剪填满每张卡片，并保持每行整齐；点击任意图片可在灯箱中打开完整原图。每个画廊拥有独立的灯箱分组，不会与文章中的其他图片混在一起。

> 本文既是功能文档，也是可视化测试页。请在桌面、平板与手机宽度下查看示例，然后点击任意图片验证灯箱分组。

## 最小语法

把 Markdown 图片直接写在 `:::grid` 与结尾的 `:::` 之间：

````markdown
:::grid
![Image description](./image-1.webp)

![Image description](./image-2.webp)
:::
````

每张图片单独占一个段落，图片之间保留一个空行。画廊容器内只放图片；段落、列表与代码块请写在容器之外。

下面是该最小语法的渲染结果。不传参数时，网格默认使用三列、`16/10` 比例与 `cover`。

:::grid
![最小语法结果：第一张图](./landscape-1.webp)

![最小语法结果：第二张图](./landscape-2.webp)
:::

## 参数一览

所有参数写在开头指令后的花括号内：`:::grid{parameter="value"}`。

| 参数 | 允许值 | 默认值 | 作用 |
| --- | --- | --- | --- |
| `columns` | `1` 到 `6` 的整数 | `3` | 桌面端每行的列数。无效值回退为 `3`。 |
| `aspect` | 正数比例，例如 `16/9`、`3/4` 或 `1/1` | `16/10` | 卡片显示比例，而非图片原始比例。 |
| `fit` | `cover`、`contain` | `cover` | 图片适配模式。`cover` 裁剪填满；`contain` 保留完整图片，可能留下空白。 |

完整示例：

````markdown
:::grid{columns="3" aspect="16/9" fit="cover"}
![First image](./image-1.webp "Optional caption")

![Second image](./image-2.webp "Optional caption")

![Third image](./image-3.webp "Optional caption")
:::
````

下面的结果使用上面的三列横图语法。对比卡片比例、列数，以及标题优先于 alt 文案作为说明文字的效果：

:::grid{columns="3" aspect="16/9" fit="cover"}
![参数示例：第一张横图](./landscape-1.webp "横图说明 1")

![参数示例：第二张横图](./landscape-2.webp "横图说明 2")

![参数示例：第三张横图](./landscape-3.webp "横图说明 3")
:::

## 说明文字与 alt 文案

图片的 alt 文案既作为无障碍替代文本，也作为默认说明文字。当图片带有可选的 title 时，则改用 title 作为说明文字：

```markdown
![Text used for accessibility](./image.webp "Caption shown below the image")
```

同一行内，说明文字对齐到每张卡片的底部。某条说明文字换行时，不会让其他卡片的高度错位。诸如 `3:4`、`16:9` 的比例文本可以直接写在正文、标题与 alt 文案中，无需转义。

本示例展示默认的 alt 说明文字、显式的 title 说明文字，以及较长说明文字的底部对齐：

:::grid{columns="3" aspect="1/1"}
![这张图片没有 title，所以用 alt 文案作为说明](./square-1.webp)

![第二张带无障碍 alt 文案的方图](./square-2.webp "这段 title 会作为说明文字显示")

![3:4 海报的无障碍描述](./square-3.webp "这是一段较长的说明文字，用于检查换行时每张卡片的说明是否仍然对齐到底部")
:::

## 布局与裁剪

桌面端布局使用 `columns` 指定的列数。低于 `768px` 时，网格最多两列；低于 `480px` 时切换为单列。卡片容器固定 `aspect` 比例并裁去圆角，图片填满卡片，不保留主题默认的图片外边距。

- 选择 `cover`：推荐的默认值。图片从中心裁剪以填满卡片，让画廊看起来整齐一致。
- 选择 `contain`：完整显示原始图片，不做裁剪。当比例与卡片不一致时会露出主题背景；适用于无法裁剪的图片。
- 若要在不留空白的前提下保留完整图片，把 `aspect` 设为接近原图比例，或让该图片单独占一个网格。

下列示例把同样的竖图放进 `16/9` 的卡片，分别使用 `cover` 与 `contain`。前者做裁剪；后者保留完整图片并留下背景空白。

````markdown
:::grid{columns="3" aspect="16/9" fit="cover"}
![Image description](./image-1.webp "Optional caption")

![Image description](./image-2.webp "Optional caption")
:::

:::grid{columns="3" aspect="16/9" fit="contain"}
![Image description](./image-1.webp "Optional caption")

![Image description](./image-2.webp "Optional caption")
:::
````

:::grid{columns="3" aspect="16/9" fit="cover"}
![第一张 cover 结果](./default-portrait-1.webp "cover：居中裁剪")

![第二张 cover 结果](./default-portrait-2.webp "cover：填满卡片")

![第三张 cover 结果](./default-portrait-3.webp "cover：更整齐的布局")
:::

:::grid{columns="3" aspect="16/9" fit="contain"}
![第一张 contain 结果](./default-portrait-1.webp "contain：保留完整原图")

![第二张 contain 结果](./default-portrait-2.webp "contain：可能出现空白")

![第三张 contain 结果](./default-portrait-3.webp "contain：适合边缘细节")
:::

## 默认配置

不写任何属性时，默认是三列、`16/10` 比例与 `cover` 裁剪。以下三张竖图用于验证默认裁剪与说明文字。

````markdown
:::grid
![Image description](./image-1.webp)

![Image description](./image-2.webp)

![Image description](./image-3.webp)
:::
````

:::grid
![默认配置：竖图一](./default-portrait-1.webp)

![默认配置：竖图二](./default-portrait-2.webp)

![默认配置：竖图三](./default-portrait-3.webp)
:::

## 三列竖图：3:4

使用 `aspect="3/4"` 时，三张竖图填满比例一致的竖向卡片。若原图比例不同，`cover` 会从中心裁剪边缘。

````markdown
:::grid{columns="3" aspect="3/4"}
![Portrait image description](./portrait-1.webp)

![Portrait image description](./portrait-2.webp)

![Portrait image description](./portrait-3.webp)
:::
````

:::grid{columns="3" aspect="3/4"}
![3:4 测试图一](./default-portrait-1.webp "竖图 1")

![3:4 测试图二](./default-portrait-2.webp "竖图 2")

![3:4 测试图三](./default-portrait-3.webp "竖图 3")
:::

## 三列横图：16:9

这组图演示三列布局下常见的视频封面比例。当横图比例接近卡片比例时，裁剪幅度很小。

````markdown
:::grid{columns="3" aspect="16/9"}
![Landscape image description](./landscape-1.webp)

![Landscape image description](./landscape-2.webp)

![Landscape image description](./landscape-3.webp)
:::
````

:::grid{columns="3" aspect="16/9"}
![16:9 测试图一](./feature-landscape-1.webp)

![16:9 测试图二](./feature-landscape-2.webp)

![16:9 测试图三](./feature-landscape-3.webp)
:::

## 两列方图：1:1

需要更大预览卡片时，两列效果更好。第三张图片移到下一行。末行保持自身的网格轨道宽度，不会把图片拉伸填满整行。

````markdown
:::grid{columns="2" aspect="1/1"}
![Square image description](./square-1.webp)

![Square image description](./square-2.webp)

![Square image description](./square-3.webp)
:::
````

:::grid{columns="2" aspect="1/1"}
![1:1 测试图一](./mixed-square-1.webp)

![1:1 测试图二](./mixed-square-2.webp)

![1:1 测试图三](./mixed-square-3.webp)
:::

## 四列与 `contain`

`fit="contain"` 不会裁剪原图。当图片比例与卡片比例不同时，会露出主题背景。这是有意为之，不是布局问题。同时用于验证四列网格与各自独立的灯箱分组不会相互干扰。

````markdown
:::grid{columns="4" aspect="16/9" fit="contain"}
![Image description](./image-1.webp)

![Image description](./image-2.webp)

![Image description](./image-3.webp)
:::
````

:::grid{columns="4" aspect="16/9" fit="contain"}
![contain：竖图一](./default-portrait-1.webp)

![contain：竖图二](./default-portrait-2.webp)

![contain：竖图三](./default-portrait-3.webp)
:::

## 单列详情图

当图片需要更大的阅读尺寸时，单列更合适。它在桌面、平板与手机上都保持单列，并且仍可在灯箱中查看原图。

````markdown
:::grid{columns="1" aspect="16/9"}
![Image description](./detail.webp)
:::
````

:::grid{columns="1" aspect="16/9"}
![单列测试图](./feature-landscape-1.webp)
:::

## 稀疏的五列行

五列用于验证支持的更高列数。只有三张图片时，末行保持左对齐，不会把图片拉伸。

````markdown
:::grid{columns="5" aspect="1/1"}
![Thumbnail description](./thumb-1.webp)

![Thumbnail description](./thumb-2.webp)

![Thumbnail description](./thumb-3.webp)
:::
````

:::grid{columns="5" aspect="1/1"}
![五列测试图一](./mixed-square-1.webp)

![五列测试图二](./mixed-square-2.webp)

![五列测试图三](./mixed-square-3.webp)
:::

## 六列混排

六列是当前的最大值。混排横图与竖图可验证 `cover` 裁剪、窄卡片上的说明文字，以及高密度的桌面布局。就正文阅读而言，通常更推荐两到四列。

````markdown
:::grid{columns="6" aspect="1/1"}
![Image description](./image-1.webp)

![Image description](./image-2.webp)

![Image description](./image-3.webp)

![Image description](./image-4.webp)

![Image description](./image-5.webp)

![Image description](./image-6.webp)
:::
````

:::grid{columns="6" aspect="1/1"}
![六列测试图一](./default-portrait-1.webp)

![六列测试图二](./default-portrait-2.webp)

![六列测试图三](./default-portrait-3.webp)

![六列测试图四](./feature-landscape-1.webp)

![六列测试图五](./feature-landscape-2.webp)

![六列测试图六](./feature-landscape-3.webp)
:::

## 四列方图：1:1

四张同比例方图是典型的四列布局。桌面端一行显示全部四张；平板收为两列，手机收为一列。

````markdown
:::grid{columns="4" aspect="1/1"}
![Square image description](./square-1.webp)

![Square image description](./square-2.webp)

![Square image description](./square-3.webp)

![Square image description](./square-4.webp)
:::
````

:::grid{columns="4" aspect="1/1"}
![方图一](./square-1.webp)

![方图二](./square-2.webp)

![方图三](./square-3.webp)

![方图四](./square-4.webp)
:::

## 六列横图：16:9

六列横图适合缩略图预览、作品集与截图索引。即使原图比例略有差异，`cover` 也能把每张 `16/9` 卡片填满且保持一致。

````markdown
:::grid{columns="6" aspect="16/9"}
![Landscape image description](./landscape-1.webp)

![Landscape image description](./landscape-2.webp)

![Landscape image description](./landscape-3.webp)

![Landscape image description](./landscape-4.webp)

![Landscape image description](./landscape-5.webp)

![Landscape image description](./landscape-6.webp)
:::
````

:::grid{columns="6" aspect="16/9"}
![横图一](./landscape-1.webp)

![横图二](./landscape-2.webp)

![横图三](./landscape-3.webp)

![横图四](./landscape-4.webp)

![横图五](./landscape-5.webp)

![横图六](./landscape-6.webp)
:::

## 三列竖图：3:4

这组六张竖图演示人像、海报或手机截图的常见布局。图片排成两行三列，说明文字对齐到底部。

````markdown
:::grid{columns="3" aspect="3/4"}
![Portrait image description](./portrait-1.webp)

![Portrait image description](./portrait-2.webp)

![Portrait image description](./portrait-3.webp)

![Portrait image description](./portrait-4.webp)

![Portrait image description](./portrait-5.webp)

![Portrait image description](./portrait-6.webp)
:::
````

:::grid{columns="3" aspect="3/4"}
![竖图一](./portrait-1.webp)

![竖图二](./portrait-2.webp)

![竖图三](./portrait-3.webp)

![竖图四](./portrait-4.webp)

![竖图五](./portrait-5.webp)

![竖图六](./portrait-6.webp)
:::

## 边缘关键内容：`cover` 与灯箱

这些图片在边缘处包含重要的文字或细节。`cover` 让网格保持整齐，但可能裁掉这些边缘；点击图片可在灯箱中查看未裁剪的原图。对边缘敏感的图片请使用清晰的说明文字，或改用下面的 `contain`。

````markdown
:::grid{columns="3" aspect="16/9" fit="cover"}
![Edge-critical content](./critical-1.webp "Open the lightbox to view the complete edge content")

![Edge-critical content](./critical-2.webp "Open the lightbox to view the complete edge content")

![Edge-critical content](./critical-3.webp "Open the lightbox to view the complete edge content")
:::
````

:::grid{columns="3" aspect="16/9" fit="cover"}
![第一张边缘关键图](./critical-1.webp "打开灯箱查看完整的边缘内容")

![第二张边缘关键图](./critical-2.webp "打开灯箱查看完整的边缘内容")

![第三张边缘关键图](./critical-3.webp "打开灯箱查看完整的边缘内容")
:::

## 极端比例与 `contain`

对于横幅、长截图等极端比例的图片，`contain` 会显示完整原图。它与 `cover` 不同，可能留下主题背景空白，但绝不会裁剪内容。

````markdown
:::grid{columns="3" aspect="16/9" fit="contain"}
![Complete screenshot description](./wide-1.webp)

![Complete screenshot description](./wide-2.webp)

![Complete screenshot description](./wide-3.webp)
:::
````

:::grid{columns="3" aspect="16/9" fit="contain"}
![极端比例图片一](./extreme-1.webp)

![极端比例图片二](./extreme-2.webp)

![极端比例图片三](./extreme-3.webp)
:::

## 透明图片

透明图片会露出卡片的主题背景。这个单列 `contain` 示例便于检查透明区域、原图边缘与灯箱行为。

````markdown
:::grid{columns="1" aspect="16/9" fit="contain"}
![Transparent image description](./transparent.webp)
:::
````

:::grid{columns="1" aspect="16/9" fit="contain"}
![透明背景测试图](./transparent-1.webp)
:::

## 灯箱导航

点击网格中的任意图片即可打开 Fancybox 灯箱。在其中可以缩放、旋转、进入全屏、查看缩略图，并用方向键切换。导航范围仅限当前的 `:::grid` 容器：例如点击「16:9 测试图一」只会打开该小节中其余两张横图。

同一篇文章中的普通 Markdown 图片仍然单独处理；它们不会被加入任何网格画廊。

## 检查清单

1. 每个网格中的图片尺寸一致，说明文字位于卡片下方。
2. 图片在悬停时轻微缩放；点击后可以缩放、旋转并用键盘切换。
3. 点击「16:9 测试图一」时，灯箱只浏览该小节中其余两张横图。
4. 低于 `768px` 时网格最多两列；低于 `480px` 时为一列。
5. 「四列与 `contain`」中的竖图完整可见，留白且不裁剪。
6. 五列与六列网格在宽屏下保持指定列数，随后按响应式规则收为两列或一列。
