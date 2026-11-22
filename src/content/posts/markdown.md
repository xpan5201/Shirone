---
title: Markdown 示例
published: 2023-10-01
description: 一个简单的 Markdown 博客文章示例。
tags: [Markdown, 博客写作, 演示]
series: markdown-syntax-guide
seriesOrder: 1
category: 示例
draft: false
---

# 一级标题

段落之间用空行分隔。

第 2 段。_斜体_、**粗体**与 `等宽字体`。无序列表
长这样：

- 这一个
- 那一个
- 另一个

请注意 --- 不考虑星号的情况下 --- 实际文本
内容从第 4 列开始。

> 块引用是这样
> 书写的。
>
> 如果你愿意，它还可以
> 跨越多个段落。

用 3 个短横表示破折号。用 2 个短横表示范围（例如 “内容都在第 12--14 章”）。
三个点 ... 会被转换为省略号。
支持 Unicode。☺

## 二级标题

下面是一个有序列表：

1. 第一项
2. 第二项
3. 第三项

再次注意，实际文本从第 4 列开始（距左侧 4 个字符）。下面是一段代码示例：

    # Let me re-iterate ...
    for i in 1 .. 10 { do-something(i) }

你可能已经猜到，这里用了 4 个空格缩进。顺便说一句，如果不喜欢
缩进整个代码块，也可以改用分隔块：

```
define foobar() {
    print "Welcome to flavor country!";
}
```

（这样复制粘贴更方便。）你还可以为分隔块标注语言，
让 Pandoc 做语法高亮：

```python
import time
# Quick, count to ten!
for i in range(10):
    # (but not *too* quick)
    time.sleep(0.5)
    print i
```

### 三级标题

下面是一个嵌套列表：

1. 首先，准备这些食材：

    - 胡萝卜
    - 芹菜
    - 扁豆

2. 烧一些水。

3. 把所有东西倒进锅里，然后按照
    下面的算法操作：

        find wooden spoon
        uncover pot
        stir
        cover pot
        balance wooden spoon precariously on pot handle
        wait 10 minutes
        goto first step (or shut off burner when done)

    别碰木勺，否则它会掉下来。

再次注意，文本始终以 4 空格缩进对齐（包括
上面延续第 3 项的那最后一行）。

这里有指向[某个网站](http://foo.bar)的链接、指向[本地
文档](local-doc.html)的链接，以及指向[本文中某个
小节标题](#an-h2-header)的链接。这里还有一个脚注 [^1]。

[^1]: 脚注文字写在这里。

表格可以长这样：

尺码 材质 颜色

---

9 皮革 棕色
10 麻布 本色
11 玻璃 透明

表格：鞋子、尺码与材质

（上面这行就是表格的题注。）Pandoc 也支持
多行表格：

---

关键词 说明

---

red 日落、苹果以及
其他红色或偏红的
东西。

green 树叶、草地、青蛙
以及其他“身为绿色
并不容易”的东西。

---

下面是一条水平分隔线。

---

下面是一个定义列表：

苹果
: 适合做苹果酱。
橙子
: 柑橘类！
西红柿
: “tomatoe” 里可没有 “e”。

再次提醒，文本以 4 个空格缩进。（在每对术语与定义之间留一个空行，
可以让排版更舒展。）

下面是一个“行块”：

| 第一行
| 第二行
| 第三行

图片则可以这样写：

[//]: # (![示例图片]&#40;./demo-banner.png "一张示例图片"&#41;)

行内公式这样写：$\omega = d\phi / dt$。独立
公式应独占一行，并用双美元符号包裹：

$$I = \int \rho R^{2} dV$$

$$
\begin{equation*}
\pi
=3.1415926535
 \;8979323846\;2643383279\;5028841971\;6939937510\;5820974944
 \;5923078164\;0628620899\;8628034825\;3421170679\;\ldots
\end{equation*}
$$

另外注意，任何你希望按字面显示的标点字符，都可以用反斜杠转义，
例如：\`foo\`、\*bar\* 等。
