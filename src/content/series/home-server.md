---
title: 家庭服务器折腾笔记
status: ongoing
defaultCategory: Linux
---

记录把一台「退役再就业」的台式机改造成安静、省心的 Debian 13 无头家庭服务器的全过程：

- **灯效控制**：无图形界面下部署 OpenRGB，接管机箱与散热器 ARGB 灯光，夜间自动息灯。
- **风扇调速**：结合 `lm-sensors` 与 `fancontrol` 编写温度曲线，并配置服务崩溃时自动交还主板控制的兜底机制。
