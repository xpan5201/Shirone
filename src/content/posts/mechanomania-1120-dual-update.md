---
title: "《重度机械症》整合包 1.1.12.0 双端部署与更新（进阶篇）"
published: 2026-11-22
publishedAt: 2026-11-22T10:40:00+08:00
description: "重度机械症（Mechanomania）从 1.1.11.1 升到 1.1.12.0 的实操记录：看懂两种包、升级前备份、服务端换包与启动命令同步、客户端导入与地图数据迁移、模组冲突排查与回滚。"
tags: ["Minecraft", "整合包", "Mechanomania", "NeoForge", "MCSManager"]
category: 技术分享
series: minecraft-server
seriesOrder: 2
draft: false
---

## 写在前面

服务器上的重度机械症（Mechanomania）从 1.1.11.1 升到了 1.1.12.0。作者的更新说明里有几条挺关键：修了末地相关的崩溃和一些内存泄漏，优化了大后期工厂的帧率，改了墓碑的生成方式（更不容易吞墓碑），世界生成速度提升到约 2.5 倍，还修了几个物品复制问题。

作者也提醒了两件事：这个版本用了一些比较激进的优化，如果和你自己加的模组冲突，可以退回 1.1.11.1；另外想自己加「航空学」的话，注意它和铁魔法有一定的冲突风险。

这篇是进阶篇，只讲「怎么把双端安全升上去」，顺序是：看懂两种包 → 备份 → 服务端换包 → 启动命令 → 客户端导入与数据迁移 → 冲突排查 → 回滚。

:::note[前置阅读]
同系列基础篇：[《在 Debian 13 服务器上用 MCSManager 部署一个普通生电服》](/posts/mcsm-shengtie-server/)——面板、Java、实例这些概念那篇讲过了，这里不再重复。
:::

## 一、先看懂手里这两个包

| 包 | 形态 | 怎么用 |
| --- | --- | --- |
| 客户端包（几 MB） | CurseForge 格式：`manifest.json` 加 `overrides/` | **交给启动器导入**（PCL2、HMCL、CF 客户端），由它去下载上百个模组 |
| 服务端包（几百 MB） | 完整目录：`mods/`、`config/`、`kubejs/`、`libraries/`，加 `run.sh`、`unix_args.txt` | 解压后**替换**实例目录里的同名内容 |

:::tip[一句话记住区别]
客户端是「导入」，服务端是「换包」。客户端包如果手动解压，只会得到一堆配置文件，没有模组本体。
:::

## 二、升级总览：五步走

:::steps[双端升级五步流程]
1. **备份**

   停服后打包世界、配置与白名单，出了问题能整体退回去。
2. **换包**

   用新服务端包替换 `mods/`、`config/`、`libraries/` 等，保留 `world/` 与运行数据。
3. **改启动命令**

   NeoForge 版本号变了，面板里的启动命令要同步。
4. **客户端**

   导入新版本，再把存档、地图、按键这些个人数据搬过去。
5. **验证**

   看日志确认没有致命报错，进服跑一圈。
:::

后面几节就是这五步的展开。

## 三、第一步：先备份，再动手

先停服（面板点停止，并确认进程真的没了），然后打包：

```bash title="停服后备份核心数据"
D=/opt/mcsmanager/daemon/data/InstanceData/<实例ID>
mkdir -p /opt/mcsmanager/backups
tar -C "$D" -czf /opt/mcsmanager/backups/mech-旧版本-$(date +%F).tar.gz \
  --exclude=logs --exclude=crash-reports --exclude=simplebackups --exclude=cache \
  world config mods libraries kubejs configureddefaults defaultconfigs \
  server.properties eula.txt whitelist.json ops.json \
  banned-ips.json banned-players.json usercache.json usernamecache.json
```

| 备份项 | 为什么 |
| --- | --- |
| `world/` | 世界与进度，最重要的一项 |
| `whitelist.json` / `ops.json` | 白名单与管理员 |
| `server.properties` | 端口、正版验证、视距等 |
| `config/` | 你自己改过的模组配置 |

客户端不用额外备份：导入会新建一个版本文件夹，旧文件夹本身就是回滚点。

## 四、第二步：服务端换包，删什么留什么

把新服务端包解压到临时目录，然后按清单处理。

- **要替换的**：`config/`、`configureddefaults/`、`defaultconfigs/`、`kubejs/`、`libraries/`、`mods/`，以及 `run.sh`、`run.bat`、`unix_args.txt`、`win_args.txt`、`user_jvm_args.txt`。
- **要保留的**：`world/`、`server.properties`、`eula.txt`、`whitelist.json`、`ops.json`、`banned-*.json`、`logs/`、`simplebackups/` 这些运行数据。

```bash title="清理旧包目录并覆入新服务端包"
D=/opt/mcsmanager/daemon/data/InstanceData/<实例ID>
cd "$D"
for x in config configureddefaults defaultconfigs kubejs libraries mods \
         run.sh run.bat unix_args.txt win_args.txt user_jvm_args.txt; do
  rm -rf "$D/$x"
done
cp -a /tmp/新包/. "$D/"
```

:::warning[切勿把旧 `config/` 整包覆盖回去]
新版作者的调整（比如墓碑生成方式）就在配置里，整包覆盖回去等于把修复丢掉；正确做法是升级完成后，把你自己的自定义项重新改一遍。
:::

顺手两件小事：`user_jvm_args.txt` 会被替换回默认值，内存（`-Xms` / `-Xmx`）要重新填；你在旧配置里改过的项目（例如我们改过的货物蛙港交互距离）也要重新应用一次。

## 五、第三步：NeoForge 版本号与启动命令

新包把 NeoForge 从 `21.1.233` 升到了 `21.1.248`，而启动参数里的路径跟着变了：

```bash title="MCSManager 启动命令变更" del={2} ins={4}
# 旧
{java} @user_jvm_args.txt @libraries/net/neoforged/neoforge/21.1.233/unix_args.txt nogui
# 新
{java} @user_jvm_args.txt @libraries/net/neoforged/neoforge/21.1.248/unix_args.txt nogui
```

- 面板「实例设置」里的启动命令**必须同步改版本号**，否则会报找不到文件的错；
- Linux 用 `unix_args.txt`（classpath 用冒号分隔），Windows 用 `win_args.txt`（分号），两者不能混用；
- 内存写在 `user_jvm_args.txt` 里，例如 `-Xms4G`、`-Xmx10G`。

:::tip[最容易漏的一步]
包换了、命令没换，服务端会直接停在「找不到 `unix_args.txt`」上，看起来像模组坏了，其实只是一个版本号没改。
:::

## 六、第四步：启动验证，看三样东西

1. 控制台出现 `Done (xxs)!`；
2. 日志里没有 `FATAL`，也没有 `MixinApplyError`；
3. 模组数量与包内一致，白名单、正版验证等设置还在。

:::note[如何区分日志噪音与致命报错]
日志里成片的 LootTable、Recipe `ERROR` 大多是整合包为「没有安装的兼容模组」准备的条目，属于噪音，不影响开服。只盯 `FATAL` 和 mixin 相关报错就好。
:::

## 七、第五步：客户端导入新版本，然后手工搬数据

把客户端包拖进 PCL2，装成新版本（比如 `Mechanomania-1.1.12.0`），等它把模组下载完。**先别急着进游戏**，下面这些东西不会自己跟过来：

| 要搬的东西 | 说明 |
| --- | --- |
| `options.txt` | 键位、画质、音量 |
| `servers.dat` | 服务器列表 |
| `xaero/` | 小地图、世界地图与**路径点**（最容易漏，漏了就「地图全空」） |
| `XaeroWaypoints_*` | 路径点备份目录，一起带上 |
| `schematics/` | 机械动力蓝图 |
| `shaderpacks/` | 光影包 |
| `resourcepacks/` | 资源包 |
| `PCL/` | 该版本的启动设置（内存、Java 路径） |

:::warning[踩坑提醒：别漏 `xaero/`]
我们这次就漏了 `xaero/`：新版本一进去，之前跑过的区块和路径点全没了，补拷贝回来才恢复。这一步值得在第一次启动前就做完。
:::

三个小提醒：

- 用脚本拷贝时，文件名里的方括号在 PowerShell 里会被当成通配符，用资源管理器拖拽或字面路径更省事；
- 旧版本的**同名模组**不要带过去，新版包里已经是新版本了；
- 自己额外加的模组，要么两端都加同一版本、要么都别加，单端装容易出各种同步和报错问题。

## 八、附录：一次真实的模组冲突（byepregen × Carpet）

我们遇到过一次很典型的模组冲突，现象值得记一下：

- 启动到「加载世界」这一步直接 `FATAL`；
- 日志关键词：`MixinApplyError`、`cannot inject into ... ServerChunkCache::tickChunks`，并同时点名 `byepregen` 与 `Carpet`。

原因很朴素：两个模组都要改同一个方法，先来的那个把注入点改掉了，后来的就找不到位置。

| 解法 | 说明 |
| --- | --- |
| 移除其中一个 | `byepregen` 是性能优化模组，删掉影响有限，保留 Carpet |
| 反过来移除 Carpet | 如果你要的只是性能优化 |
| 退回上一版整合包 | 作者也提示：激进优化版与自加模组更容易冲突 |

## 九、常见问题速查与回滚

| 现象 | 先检查这些 |
| --- | --- |
| 服务端启动即退出，报找不到文件 | 启动命令里的 NeoForge 版本号是不是还是旧的 |
| 客户端进不去、提示模组不一致 | 双端版本是否对齐；有没有单端装了额外的模组 |
| 世界地图一片空白、路径点没了 | 客户端 `xaero/` 和 `XaeroWaypoints_*` 有没有搬过来 |
| 进服后大量报错或卡顿 | 先看日志有没有 `FATAL` / `MixinApplyError`，再考虑移除自加模组 |
| 想整体退回去 | 见下面的回滚步骤 |

**回滚步骤**：停服，删掉替换过的新目录，解压之前那份备份 tar，再把启动命令里的版本号改回旧版，启动。

## 小结

整合包升级真正麻烦的从来不是「下载新包」，而是三件事：**备份、别丢世界、别忘同步启动命令里的版本号**。客户端那边再多做一步数据迁移，基本就稳了。

**系列内互链**：面板怎么装、Java 怎么准备、实例怎么建，都在[《在 Debian 13 服务器上用 MCSManager 部署一个普通生电服》](/posts/mcsm-shengtie-server/)里。

**参考文档**：[MCSManager 官方文档](https://docs.mcsmanager.com/zh_cn/)

*文中版本号、路径与实例 ID 均为示例，请以你实际使用的整合包与面板环境为准。*
