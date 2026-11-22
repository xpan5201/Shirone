---
title: "音频阅读器：日式动画中的神秘语音"
published: 2026-08-29
description: 一小段神秘的日式动画语音片段合集，用音频阅读器按需播放。
tags: [示例, 音频阅读器]
series: media-embeds
seriesOrder: 2
category: 示例
draft: false
---

这些短小的日语语音片段仿佛捡自动画场景的边缘：一声调侃的呼唤、一句明亮的问候、一声轻笑，还有几句说不清出处的话。它们是情绪样本而非对白文稿，让声音自己传达含义。

音频阅读器会保持安静，直到你选择聆听。每个扬声器按钮只有被按下后才会加载并播放对应片段。

```markdown
:audio-reader[Clip title]{src="/assets/audio/filename.wav"}
```

## 语音片段

- **Baka**: :audio-reader[バカ]{src="/assets/audio/Baka.wav"}
- **Ciallo**: :audio-reader[Ciallo！！]{src="/assets/audio/Ciallo.wav"}
- **Ehe**: :audio-reader[玩笑般的语气]{src="/assets/audio/Ehe.wav"}
- **Imoi**: :audio-reader[イモい]{src="/assets/audio/Imoi.wav"}
- **Zako**: :audio-reader[雑魚じゃん、雑魚雑魚]{src="/assets/audio/Zako.wav"}

`src` 必须使用站点根路径或 HTTPS URL，且指令标签不能为空。无效或不完整的指令会保持为普通 Markdown，不会加载音频阅读器资源。
