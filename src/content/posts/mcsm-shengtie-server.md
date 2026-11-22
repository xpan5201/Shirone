---
title: "在 Debian 13 服务器上用 MCSManager 部署一个普通生电服"
published: 2026-11-22
publishedAt: 2026-11-22T10:30:00+08:00
description: "用 MCSManager 面板把一台 Debian 13 机器变成生电服主机：装面板、准备 Java、创建实例、放 Fabric 服务端、写启动命令、处理 EULA 与白名单，以及假人、安全备份和常见踩坑速查。"
tags: ["MCSManager", "Minecraft", "生电服", "Debian", "开服"]
category: 技术分享
series: minecraft-server
seriesOrder: 1
draft: false
---

## 写在前面

家里的那台小主机被我改成 Minecraft 服务器之后，很长一段时间都是纯手工维护：SSH 进去改配置，用 `screen` 把服务端挂在后台，重启一次得翻半天历史命令。后来换成了 MCSManager（下称面板），开服、停服、看日志、传文件都在浏览器里点几下就好，省心不少。

这篇写的是**普通生电服**的部署路线：一台 Debian 13 → 装好面板 → 在面板里准备 Java → 创建实例 → 放入 Fabric 服务端与几个规则类模组 → 配好白名单和备份。整篇按「照着做」的顺序展开，版本号、路径、实例 ID 都写成占位符，请以你自己的环境为准。

## 一、开工前的准备

| 项目 | 建议 |
| --- | --- |
| 系统 | Debian 13 或相近版本，具备 sudo / root |
| 内存 | 生电服 4~8 GB 比较舒服；面板本身占用很小 |
| Java | 1.21.x 需要 Java 21（面板里可以直接下载，不用自己装） |
| 端口 | `25565`（游戏）、`23333`（面板）、`24444`（守护进程） |
| 网络 | 家庭宽带建议搭配内网穿透或反向代理；云服务器记得在安全组里放行同样的端口 |

:::warning[安全提醒]
`23333` 与 `24444` 分别是面板和守护进程的入口，**不要**让它们裸奔在公网上。最省事的做法是防火墙只放行你自己的 IP，或者用 Nginx 反代加 HTTPS，再配一个强密码。
:::

## 二、安装并初始化面板

MCSManager 由**面板端（web）**和**守护进程（daemon）**两部分组成：面板负责界面、账号与实例列表，守护进程真正在跑服务器实例。

```bash title="安装并拉起 MCSManager 服务"
# 官方一键脚本，默认装到 /opt/mcsmanager
wget -qO- https://script.mcsmanager.com/setup_cn.sh | sudo bash

# 看一眼两个服务的状态
sudo systemctl status mcsm-web mcsm-daemon --no-pager

# 没起来就手动拉一下，并设为开机自启
sudo systemctl start mcsm-web mcsm-daemon
sudo systemctl enable mcsm-web mcsm-daemon
```

装好后浏览器打开 `http://服务器IP:23333`，第一次进入会让你创建管理员账号。**请务必用强密码**——这个面板差不多等于你服务器的半把钥匙。

顺手把端口收一下（以 `ufw` 为例，没装也可以用 `nftables` 或云安全组，思路一样）：

```bash
sudo ufw allow 25565/tcp
sudo ufw allow from 你的管理IP to any port 23333 proto tcp
```

## 三、准备 Java 与创建实例

面板自带「Java 管理」，可以直接下载各个版本的 Java，文件会放在守护进程目录下的 `JavaData` 里。生电服按 MC 版本选：

| MC 版本 | 需要的 Java |
| --- | --- |
| 1.20.x | 17 |
| 1.21.x | 21 |
| 更早的版本 | 8 或 11 |

:::tip[用面板内置 Java 即可]
用面板下载的 Java 就够了，不必再额外 `apt` 装一份。创建实例时选中它，启动命令里也就不需要写 Java 的绝对路径。
:::

接着在面板里「新建实例」，起一个能认出来的名字（比如 `shengdian`），Java 版本选刚下载的 21。面板会给每个实例分配独立目录，之后所有服务端文件都放在这个目录里——**一个实例 = 一个目录 + 一条启动命令**。

:::note[关于实例目录权限]
面板以系统服务身份运行（通常是 `root`），实例目录的属主也来自它。用 SSH 直接改文件可能提示没权限——这不是坏了，只是权限不在你手上，日常改文件走面板的「文件管理」最省心。
:::

## 四、放入服务端文件（Fabric 生电端）

生电服一般是 Fabric 加规则类模组。服务端有两种拿法：直接用别人整合好的服务端包，或者自己生成。

```bash
# 用 Fabric 官方安装器生成服务端
#（先用面板把安装器 jar 传进实例目录，再执行）
java -jar fabric-installer-<版本>.jar server -mcversion 1.21.1 -downloadMinecraft
# 生成 fabric-server-launch.jar（有的包叫 server.jar）
```

服务端 jar、`mods/`、`server.properties` 都在实例目录里。生电服常见的几个模组：

| 模组 | 作用 |
| --- | --- |
| Carpet | 假人、tick 控制等生电刚需 |
| Lithium / FerriteCore | tick 与内存优化 |
| Krypton | 网络栈优化 |
| Chunky | 区块预生成 |
| Fabric API | 很多模组的前置 |

:::tip[客户端无需安装]
这些模组**只需要装在服务端**，朋友进服不用装。生电服通常也不加玩法模组，保持原版手感。
:::

## 五、把启动命令写对

面板「实例设置」里的启动命令，填成这样：

```bash title="MCSManager 启动命令"
{java} -Xms4G -Xmx6G -jar fabric-server-launch.jar nogui
```

- `{java}`：引用你在实例里选择的 Java，以后换 Java 版本不用改命令；
- `nogui`：告诉服务端不开图形界面，少了它服务端会直接报错退出；
- 内存：小机器先给 4G，人多或者后期机器多了再加。

之后启动、停止、重启、敲指令、看日志，都在面板的实例控制台里完成。

## 六、第一次启动：EULA 与基础配置

第一次启动大概率会失败并提示 EULA，这是正常的：用面板「文件管理」打开 `eula.txt`，把 `eula=false` 改成 `eula=true`，再启动一次。

然后按需调整 `server.properties`（改完重启生效）：

| 配置项 | 说明 |
| --- | --- |
| `online-mode` | 正版验证。生电服建议保持 `true` |
| `white-list` | 白名单开关。开了以后只有名单里的 ID 能进 |
| `view-distance` | 视距，10 左右够用，调高更吃带宽与性能 |
| `simulation-distance` | 模拟距离，影响刷怪与红石；生电常调大，但要量力而行 |
| `max-players` | 最大人数 |
| `motd` | 服务器列表里显示的那句话 |

在面板控制台执行下面的命令，把朋友加进来（开了白名单才需要）：

```text title="面板控制台命令"
whitelist add 玩家ID
whitelist on
```

:::warning[关闭正版验证时的安全底线]
如果因为某些原因要关掉正版验证（`online-mode=false`），请一定同时开启白名单，否则任何人都能顶着任意名字进来。
:::

## 七、装好之后：假人与 tick 加速

装了 Carpet 之后，控制台里可以直接用这些命令：

| 命令 | 作用 |
| --- | --- |
| `/player 名字 spawn` | 生成假人 |
| `/player 名字 attack continuous` | 让假人持续攻击 |
| `/player 名字 kill` | 移除假人 |
| `/tick warp 1000` | 加速 tick（Carpet） |
| `/tick freeze` | 冻结 tick（原版 1.20.3 以上也有） |

假人有两点要注意：它会占用在线人数；名字也要加进白名单（如果你开了白名单）。

## 八、备份与定时重启

生电服的价值都在世界里，备份是最不该省的一步。**服务端在跑的时候直接打包，有可能拷到写了一半的区块文件**，所以要么停机备份，要么按下面这样让世界先「停笔」：

```bash title="运行中安全备份流程"
# ① 面板控制台先执行：
save-off
save-all flush

# ② 再打包（此刻世界文件是静止的）
tar -czf /备份目录/world-$(date +\%F).tar.gz -C /实例目录 world

# ③ 打包完成后回到控制台：
save-on
```

停机备份更简单，直接用 `tar`；想省事就挂个定时任务：

```bash title="crontab 定时备份示例"
# 每天凌晨 4 点做一次（写进 crontab -e）
0 4 * * * tar -czf /备份目录/world-$(date +\%F).tar.gz -C /实例目录 world
```

- 面板的「计划任务」可以定时执行重启和发送指令，配合起来更顺；
- 保留策略：最近 7 天，外加每周留一份就够；
- 备份目录最好放在**另一块盘**或另一台机器上。

## 九、常见问题与我踩过的坑

| 现象 | 原因与处理 |
| --- | --- |
| 面板打不开 | 端口没放行，或 `mcsm-web` 服务没起来（`systemctl status` 看一眼） |
| 服务端一启动就退出 | Java 版本不对，或者漏了 `nogui` |
| 第一次启动就报错退出 | 还没同意 EULA，改 `eula.txt` 再启动 |
| 换个 Java / 升级后起不来 | 启动命令里写死了路径或版本号 |
| 朋友连不上 | `25565` 没放行、端口被占用，或者对方版本与你不同 |
| 后期变卡 | 内存没显式设置，一直在用默认值；也可能是视距或模拟距离给太大 |
| SSH 改不动实例文件 | 面板以 `root` 运行，目录属主不一致；走面板文件管理 |
| 被陌生人进来 | 关了正版验证却没开白名单，或者名单没真正打开（`whitelist on`） |

## 小结

面板解决的是「管起来顺手」的问题：装一次、配一次，之后开服停服都在浏览器里完成。真正影响体验的，还是那几件朴素的事——Java 版本对上、内存给够、白名单管好、备份别偷懒。

**延伸阅读**：如果你后面要开整合包服，或者要给整合包做双端升级，步骤和生电服差别不小，可以接着看同系列进阶篇：[《重度机械症》整合包 1.1.12.0 双端部署与更新（进阶篇）](/posts/mechanomania-1120-dual-update/)。

**参考文档**：[MCSManager 官方文档](https://docs.mcsmanager.com/zh_cn/)

*本文基于自己的部署经历与官方文档整理；文中版本号、路径、实例 ID 均为示例，请以自己的环境为准。*
