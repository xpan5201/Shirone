---
title: Mermaid 图表画廊
published: 2024-05-02
description: 覆盖流程、交互、数据模型、进度计划与项目历程的 Mermaid 图表画廊。
tags: [演示, 示例, Markdown, Mermaid]
category: 示例
lang: en
draft: false
---

Mermaid 能把 Markdown 中的文字描述转成图表。下面的示例沿用 Shirone 的内容工作流，演示技术文章与项目笔记中常用的各类图表。

## 流程图

流程图描述一个过程，包括判断分支以及返回到先前步骤的路径。

```mermaid
flowchart TD
    accTitle: Article publishing workflow
    accDescr: An article moves through writing, validation, preview, and build before publication. Failed validation returns it for revision.
    Draft[Write Markdown] --> Check{Validation passed?}
    Check -->|No| Revise[Revise article]
    Revise --> Check
    Check -->|Yes| Preview[Preview locally]
    Preview --> Build[Build static page]
    Build --> Publish[Publish]
```

## 时序图

时序图按时间顺序呈现参与者之间的协作。本例跟随一次 Swup 导航，从发起请求一直到 Mermaid 完成渲染。

```mermaid
sequenceDiagram
    accTitle: Diagram rendering after in-site navigation
    accDescr: A reader starts navigation, Swup replaces the article content, and the Mermaid renderer enhances diagrams on the new page.
    actor Reader
    participant Browser
    participant Swup
    participant Content as Article region
    participant Renderer as Mermaid renderer
    Reader->>Browser: Open another article
    Browser->>Swup: Start in-site navigation
    Swup->>Content: Replace page content
    Swup-->>Renderer: Emit content:replace
    Renderer->>Content: Find Mermaid containers
    Renderer-->>Browser: Insert themed SVGs
```

## 实体关系图

实体关系图为结构化数据建模，并刻画作者、文章、标签与评论之间的关联。

```mermaid
erDiagram
    accTitle: Blog content relationships
    accDescr: Authors write posts, posts receive comments, and join records connect posts to multiple tags.
    AUTHOR ||--o{ POST : writes
    POST ||--o{ COMMENT : receives
    POST ||--o{ POST_TAG : classified_by
    TAG ||--o{ POST_TAG : groups
    AUTHOR {
        string id PK
        string display_name
    }
    POST {
        string slug PK
        string title
        datetime published_at
        string author_id FK
    }
    COMMENT {
        string id PK
        string post_slug FK
        string body
    }
    TAG {
        string id PK
        string label
    }
    POST_TAG {
        string post_slug FK
        string tag_id FK
    }
```

## 类图

类图表达软件设计中的职责、公开方法与依赖方向。

```mermaid
classDiagram
    accTitle: Markdown rendering modules
    accDescr: The content pipeline uses a Mermaid plugin to create fallback markup, which the client renderer later enhances into an SVG.
    class ContentPipeline {
        +render(markdown)
        +collectMetadata()
    }
    class MermaidPlugin {
        +transform(codeFence)
        +createFallback()
    }
    class DiagramRenderer {
        +initialize()
        +renderAll()
        +refreshTheme()
    }
    class ThemeTokens {
        +primary
        +surface
        +outline
    }
    ContentPipeline --> MermaidPlugin : uses
    DiagramRenderer --> MermaidPlugin : enhances output
    DiagramRenderer --> ThemeTokens : reads
```

## 状态图

状态图展示对象的生命周期，以及让它在各状态之间迁移的事件。

```mermaid
stateDiagram-v2
    accTitle: Article lifecycle
    accDescr: An article moves from draft to review and publication. It may return for revision or eventually be archived.
    [*] --> Draft
    Draft --> InReview : submit
    InReview --> Draft : request changes
    InReview --> Published : approve
    Published --> Draft : retract
    Published --> Archived : archive
    Archived --> [*]
```

## XY 图

XY 图把柱状与折线组合在共用坐标轴上，用来比较数值与趋势。

```mermaid
xychart-beta
    accTitle: Six weeks of content performance
    accDescr: Bars show normalized weekly publishing volume, while the line shows normalized reading completion.
    title "Six weeks of content performance"
    x-axis "Week" [1, 2, 3, 4, 5, 6]
    y-axis "Relative score" 0 --> 100
    bar [36, 52, 44, 68, 76, 84]
    line [48, 55, 62, 61, 73, 81]
```

## 饼图

饼图以紧凑的方式比较各类别对整体的贡献。

```mermaid
pie showData
    accTitle: Article topics by share
    accDescr: Engineering accounts for forty percent, design systems for twenty-five percent, and the remainder is split between guides and essays.
    title Article topics by share
    "Engineering" : 40
    "Design systems" : 25
    "Guides" : 20
    "Essays" : 15
```

## 甘特图

甘特图沿日历时间轴安排任务、依赖关系与里程碑。

```mermaid
gantt
    accTitle: Theme release plan
    accDescr: The release plan moves from requirements and interaction design through component development, testing, and release.
    title Theme release plan
    dateFormat YYYY-MM-DD
    axisFormat %m/%d
    section Design
    Confirm requirements :done, brief, 2024-05-06, 2d
    Refine interactions :done, interaction, after brief, 3d
    section Implementation
    Develop components :active, components, after interaction, 6d
    Write examples :examples, after interaction, 4d
    section Validation
    Automated tests :tests, after components, 3d
    Release :milestone, release, after tests, 0d
```

## 思维导图

思维导图把中心主题展开为相关领域与支撑概念。

```mermaid
mindmap
  root((Shirone))
    Content experience
      Markdown
      Search
      Diagrams
    Interface system
      M3E tokens
      Responsive layout
      Color schemes
    Engineering quality
      Astro Check
      Playwright
      Accessibility
```

## 时间线

时间线归纳重要事件或阶段，无需精确的日历工期。

```mermaid
timeline
    title Mermaid support evolution
    Pipeline design : Detect Mermaid fences
                    : Preserve source fallback
    Client enhancement : Load the runtime on demand
                       : Apply theme tokens
    Reliability : Support Swup navigation
                : Verify responsive and accessible output
```

## 用户旅程

用户旅程图把任务各阶段中的动作、参与者与体验评分组合起来。

```mermaid
journey
    accTitle: A reader understanding a technical article
    accDescr: The reader discovers an article, combines prose with diagrams to understand it, and then explores related topics.
    title A reader understanding a technical article
    section Discover
      Browse the article list: 4: Reader
      Choose a topic: 5: Reader
    section Understand
      Read the article: 4: Reader
      Inspect a relationship diagram: 5: Reader
    section Continue
      Open a related article: 4: Reader
      Bookmark the page: 3: Reader
```

## Git 图

Git 图展示特性分支上的工作如何推进，直至合并回主线。

```mermaid
gitGraph
    accTitle: Mermaid feature branch history
    accDescr: A feature branch adds the renderer and tests before merging into the main branch for release.
    commit id: "base"
    branch mermaid
    checkout mermaid
    commit id: "add-renderer"
    commit id: "add-tests"
    checkout main
    merge mermaid id: "merge-mermaid"
    commit id: "release"
```

## 看板

看板按工作流状态对任务分组，让当前进度一目了然。

```mermaid
kanban
  backlog[Backlog]
    docs[Write author documentation]
    examples[Expand example data]
  active[In progress]
    themes[Verify theme adaptation]
  complete[Complete]
    fallback[Source fallback]
    rendering[Client rendering]
```

## 桑基图

桑基图用连线宽度表示流量或其他数量在节点之间的流动。

```mermaid
sankey-beta
Landing,Reading,720
Discovery,Reading,430
Reading,Explore,360
Reading,Topics,210
Reading,Outbound,140
```

## 标签中的换行

HTML 标签支持换行，因此标签可以折行而不撑宽图表。

```mermaid
flowchart LR
  A[First line<br>Second line] --> B[Plain label]
```

每个示例都使用标准的 `mermaid` 代码围栏。服务端保留可读的源码标记，浏览器再把它增强为跟随当前主题的 SVG。主题切换或 Swup 导航到本文时，图表会重新渲染。