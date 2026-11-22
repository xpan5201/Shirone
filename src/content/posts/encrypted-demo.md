---
title: 密码保护与文章加密演示
published: 2026-08-20
pinned: true
description: 演示 Shirone 中客户端认证解密、内存会话持久化与 M3E 设计令牌。
tags: [演示, 安全, 加密, Markdown]
category: 示例
lang: en
encrypted: true
password: "shirone-secret"
passwordHint: "Hint: the demo unlock password is shirone-secret"
hideHomeContent: true
---

# 密码保护的文章

恭喜！你已成功解锁这篇加密文章。浏览器使用 **Web Crypto API（AES-256-GCM + PBKDF2）** 在本地解密了这份预编译内容。

---

## 1. 安全架构与核心特性

Shirone 的文章加密系统与受保护的相册共享统一的安全基础，为静态发布提供企业级安全性：

1. **静态 HTML 构建中零明文**  
   在 Astro SSG 构建流程中，文章 Markdown 先被编译为 HTML，并在产出页面之前立即以 AES-256-GCM 加密。发布的静态 HTML 中，受保护正文与目录**不含任何明文**。

2. **带 AAD 作用域绑定的认证加密**  
   - 密钥派生遵循 OWASP 建议，采用 **310,000 次 PBKDF2 迭代**（SHA-256）与密码学安全的 16 字节随机盐；
   - 每个加密载荷都会生成独立的 12 字节随机 IV；
   - **附加认证数据（AAD）** 绑定 `shirone-protected-content:1:post:${slug}`，确保密文无法在不同文章或相册之间重放。

3. **会话持久化与零磁盘密码存储**  
   - 解密后的内容缓存在临时的浏览器会话存储中，30 分钟后过期；
   - 明文密码从不写入磁盘或存储；
   - 解密状态在 Swup 客户端导航与同一会话内的页面刷新之间保持无缝延续。

4. **全站防泄漏**  
   - **搜索索引**：静态页面不含明文，防止搜索引擎与 Pagefind 收录私密内容；
   - **RSS 订阅源**：受保护文章在订阅源中输出本地化占位符，防止 RSS 聚合器抓取敏感文本；
   - **卡片摘要与字数**：配置 `hideHomeContent: true` 后，索引页与归档卡片上的描述和字数会被遮蔽；
   - **目录（TOC）**：标题层级在解锁前保持隐藏，解密后按 M3E 样式动态重建并同步。

> 💡 **演示说明**：本演示文章的默认解锁密码是 `shirone-secret`。

---

## 2. 交互式富内容演示

文章解密后会与运行时辅助模块协作，动态挂载语法高亮、代码折叠、可交互 Mermaid 图表、LaTeX 公式与图片灯箱。

### 2.1 代码块与语法高亮

下面的代码块用于测试 Expressive Code 的语法高亮、复制操作与行装饰：

```typescript
import { decryptProtectedContent, type ProtectedPayload } from "@/utils/password-protection";

/**
 * Client-side post decryption example
 */
async function unlockArticle(payload: ProtectedPayload, password: string): Promise<string> {
    const scope = payload.scope;
    console.log(`[Shirone] Decrypting scope: ${scope}`);
    
    // Execute AES-256-GCM decryption with AAD verification
    const decryptedHtml = await decryptProtectedContent(payload, password, scope);
    console.log("[Shirone] Decryption successful, length:", decryptedHtml.length);
    return decryptedHtml;
}
```

```bash
# Verify build and type checking
npx.cmd astro check
pnpm.cmd type-check
pnpm.cmd test
```

### 2.2 Mermaid 架构图

下面的流程图由 Mermaid 渲染，并在解密时动态绑定：

```mermaid
flowchart TD
    subgraph build["Build Pipeline"]
        A[Markdown Source] --> B[Astro Pipeline]
        B --> C[Render HTML]
        C --> D[encryptProtectedContent]
        D --> E[ProtectedPayload]
        E --> F[Static HTML with ProtectedPost]
    end

    subgraph runtime["Client Runtime"]
        G[Reader Visits Page] --> H{Valid Session?}
        H -->|Yes| K[Render Decrypted HTML]
        H -->|No| I[Display PasswordGate]
        I --> J[User Submits Password]
        J --> L[Web Crypto AES-GCM Decrypt]
        L -->|Incorrect| M[Show Error Feedback]
        L -->|Success| N[Store Session Record]
        N --> K
        K --> O[Trigger post-decryption Coordinator]
        O --> P[Initialize Copy, Mermaid, KaTeX, and TOC]
    end
```

### 2.3 LaTeX 数学公式

行内公式：欧拉恒等式 $e^{i\pi} + 1 = 0$ 与高斯积分 $\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}$。

使用水平滚动容器展示显示式数学公式：

$$
f(x) = \frac{1}{\sigma \sqrt{2\pi}} \exp\left( -\frac{(x - \mu)^2}{2\sigma^2} \right)
$$

$$
\mathcal{L}_{\text{AES-GCM}} = \text{GHASH}_H(A \parallel C \parallel L) \oplus \text{AES}_K(J_0)
$$

### 2.4 提示块

:::note 架构说明
该加密系统遵循原子化设计原则与最小补丁约定，同时不牺牲 SSR 稳定性。
:::

:::tip 主题集成
解锁后，试试在浅色与深色模式之间切换，或更改主色调；解密后的组件会动态适配当前生效的设计令牌。
:::

:::important 安全范围
静态客户端加密旨在防止未经授权的浏览与自动化索引。对于关键任务的商业机密，建议使用服务端认证。
:::

:::warning 密码找回
静态加密没有集中式的服务器数据库。一旦忘记密码，加密内容无法恢复。
:::

### 2.5 GitHub 仓库卡片

::github{repo="withastro/astro"}

---

## 3. 配置参考

| 参数 | 类型 | 必填 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- | :--- |
| `encrypted` | `boolean` | 否 | `false` | 显式标记文章为加密状态。若设置了 `password`，则隐式为 `true`。 |
| `password` | `string` | 是 | 无 | 构建时用于加密、运行时用于解锁的明文密码。 |
| `passwordHint` | `string` | 否 | `""` | 显示在密码输入框下方的可选提示。 |
| `hideHomeContent` | `boolean` | 否 | `true` | 在索引卡片、归档与 RSS 订阅源中隐藏文章描述与字数指标。 |

---

## 4. 总结

本演示验证了 Shirone 中完整的加密生命周期：静态产物零明文、稳健的密码学校验、跨导航与页面刷新的会话持久化，以及运行时的动态重水合。
