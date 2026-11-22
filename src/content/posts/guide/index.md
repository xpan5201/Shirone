---
title: "Shirone 写作与使用指南"
published: 2026-08-26
updated: 2026-08-26
pinned: true
description: "Shirone 中文章写作、frontmatter 结构、Markdown 扩展、加密与媒体资源的完整指南。"
image: "./cover.jpeg"
tags: ["Shirone", "指南", "Markdown", "M3E", "博客写作"]
category: 指南
draft: false
---

欢迎来到 **Shirone**（白音）——一款围绕 **Astro 7**、**Svelte 5** 与 **Material 3 Expressive（M3E）** 设计系统打造、富有表现力的动漫风格博客主题。

本指南将带你了解文章创建、frontmatter 规范、目录结构，以及内置的整套 Markdown 与 MDX 扩展。

:::tip
Shirone 优先在服务端渲染内容（SSR-first）。站内导航时，Swup 会无缝替换主容器，同时保留外层应用外壳与持续播放的音乐。
:::

---

## 1. 创建新文章

使用内置 CLI 命令即可快速生成带有标准 frontmatter 的新文章：

```bash
# Create a single-file post
pnpm new-post my-first-post

# Or create a post in a sub-directory
pnpm new-post guides/getting-started
```

新建的文件将放入 `src/content/posts/`。

---

## 2. Frontmatter 规范

每篇 Markdown（`.md`）或 MDX（`.mdx`）文章都以一个定义其元数据的 YAML frontmatter 块开头。

### 示例

```yaml
---
title: "Exploring Material 3 Expressive Design"
published: 2026-08-26
updated: 2026-08-27
publishedAt: 2026-08-26T10:00:00+08:00
updatedAt: 2026-08-27T09:30:00+08:00
pinned: true
description: "A deep dive into dynamic HCT color science and fluid transitions in Shirone."
image: "./cover.webp"
tags: [M3E, Design, Frontend]
category: Guides
draft: false
comment: true
---
```

### 支持的 frontmatter 字段

| 字段 | 类型 | 必填 | 描述 |
| :--- | :--- | :---: | :--- |
| `title` | `string` | **是** | 文章的主标题。 |
| `published` | `Date` | **是** | 发布日期，格式为 `YYYY-MM-DD`。 |
| `publishedAt` | `Date` | 否 | 用于对同日发布的文章排序的精确发布时刻。它必须落在站点配置时区下的 `published` 当天。 |
| `updated` | `Date` | 否 | 最后更新日期。提供后会显示更新提示徽标。 |
| `updatedAt` | `Date` | 否 | 供订阅源与机器可读元数据使用的精确更新时刻。它必须与 `updated` 配对。 |
| `pinned` | `boolean` | 否 | 将文章置顶到文章列表顶部（默认：`false`）。 |
| `description` | `string` | 否 | 显示在文章卡片、搜索结果与 OpenGraph 元数据中的文章摘要。 |
| `image` | `string` | 否 | 封面图路径。支持相对路径（`./cover.webp`）、公共路径（`/images/cover.jpg`）或远程 URL。 |
| `tags` | `string[]` | 否 | 用于分类筛选与标签云的标签名称数组。 |
| `category` | `string` | 否 | 用于分类索引的主分类名称。 |
| `draft` | `boolean` | 否 | 标记为草稿。草稿文章在生产构建（`pnpm build`）时被隐藏。 |
| `comment` | `boolean` | 否 | 为这篇特定文章开关评论区（默认：`true`）。 |
| `lang` | `string` | 否 | 与站点默认语言不同时使用的语言代码（例如 `en`、`zh_CN`、`ja`）。 |

---

## 3. 文章加密

Shirone 提供客户端文章加密。它是一道静态密码门禁，而非服务端访问控制：加密载荷与资源 URL 仍可被公开下载，因此不要用它保护真正机密的文件或受监管的秘密。若用于私密日志或受限文章，请在 frontmatter 中指定密码：

```yaml
---
title: "Private Research Notes"
published: 2026-08-26
encrypted: true
password: "your-secret-passphrase"
passwordHint: "Favorite anime character"
hideHomeContent: true
---
```

- `encrypted`：设为 `true` 以启用加密；
- `password`：解锁文章所需的字符串或数字密码；
- `passwordHint`：显示在密码输入表单上方的可选提示；
- `hideHomeContent`：在首页隐藏字数与内容预览，以防数据泄漏。

---

## 4. 组织文章文件

Shirone 同时支持文件夹共置与单文件两种布局：

### 文件夹结构（推荐用于本地资源）

将文章与其媒体文件放在一起，资源管理会变得直观：

```text
src/content/posts/
├── my-great-post/
│   ├── index.md           <-- Post content
│   ├── cover.webp         <-- Cover image (image: "./cover.webp")
│   └── diagram.png        <-- Inline illustration referenced in markdown
```

### 单文件结构（轻量随笔）

```text
src/content/posts/
├── hello-world.md
└── quick-thoughts.md
```

---

## 5. 丰富的 Markdown 与 MDX 扩展

Shirone 开箱即带现代 Markdown 扩展：

### 5.1 提示块

使用容器指令编写备注、提示、警告与提醒：

```markdown
:::tip
Use admonition containers to highlight key takeaways or best practices.
:::

:::warning
Use warning containers to signal potential pitfalls or breaking changes.
:::
```

### 5.2 GitHub 仓库卡片

使用指令语法嵌入实时渲染、样式精美的 GitHub 仓库卡片：

```markdown
::github{repo="LyraVoid/Shirone"}
```

::github{repo="LyraVoid/Shirone"}

### 5.3 Expressive Code 代码块

增强型代码块具备语法高亮、文件名徽标、行号与选择性行高亮：

```typescript title="src/utils/theme.ts" {2,4-5}
// Dynamic HCT color token derivation
import { argbFromHex, themeFromSourceColor } from "@material/material-color-utilities";

const theme = themeFromSourceColor(argbFromHex("#f472b6"));
console.log("Primary color token:", theme.schemes.light.primary);
```

### 5.4 数学排版（KaTeX）

直接在 Markdown 中渲染优雅的 LaTeX 数学符号：

- **行内公式**：$E = mc^2$ 或欧拉公式 $e^{i\pi} + 1 = 0$。
- **块级公式**：

$$
\int_{-\infty}^{\infty} e^{-x^2} \, dx = \sqrt{\pi}
$$

### 5.5 Mermaid 图表

用纯文本创建流程图、时序图与架构图：

```mermaid
sequenceDiagram
    autonumber
    actor Visitor as Visitor
    participant Page as Shirone Page
    participant Swup as Swup Container
    participant Audio as Persistent Shell

    Visitor->>Page: Click Navigation Link
    Page->>Swup: Trigger Seamless Transition
    Swup->>Page: Replace #swup-container
    Note over Audio: Background music plays continuously
    Page-->>Visitor: New Page Rendered
```

### 5.6 图片画廊与 Fancybox 灯箱

图片会自动接入 Fancybox，支持无损缩放、拖拽平移与全屏预览：

```markdown
![Cover preview](./cover.jpeg)
```

---

## 6. 后续步骤与自定义

- **站点配置**：在 `src/config/siteConfig.ts` 与 [`src/config/README.md`](https://github.com/LyraVoid/Shirone/blob/main/src/config/README.md) 中了解全局设置。
- **设计令牌**：在 `DESIGN.md` 与 `docs/m3e-standard.md` 中探索令牌与配色方案。
- **反馈与社区**：在 [GitHub Issues](https://github.com/LyraVoid/Shirone/issues) 分享你的想法与疑问。
