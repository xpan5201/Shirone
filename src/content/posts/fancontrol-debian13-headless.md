---
title: "在 Debian 13 无头服务器上用 fancontrol 做温度曲线调速"
published: 2026-11-22
publishedAt: 2026-11-22T10:20:00+08:00
description: "主板的默认风扇策略常常不是太吵就是太迟钝，Linux 下可以用 lm-sensors 套件里的 fancontrol 按温度曲线自动调速。本文给出通用流程：确认芯片与通道、手动接管验证、曲线配置、压测验收，以及服务异常时自动交还主板控制的兜底做法。"
tags: ["fancontrol", "lm-sensors", "风扇调速", "Debian", "无头服务器"]
category: Linux
series: home-server
seriesOrder: 2
draft: false
---

## 写在前面

上一篇里，我们把机箱灯光交给了 OpenRGB。这一篇处理另一半——风扇转速。

主板的默认策略常常不太合心意：要么待机就高转、整天嗡嗡作响；要么自动曲线反应迟钝，负载上来了风扇还慢悠悠。Linux 下有一套成熟方案：**lm-sensors 套件中的 `fancontrol`**，按你设定的温度曲线自动调节 PWM 风扇。

:::note[前置阅读]
同系列第一篇：[《在 Debian 13 无头服务器上部署 OpenRGB：让机箱灯光安静下来》](/posts/openrgb-debian13-headless/)
:::

本文按通用情况写：芯片型号、hwmon 编号、通道数量、温度来源都因机器而异，正文会说明**如何确认你自己的情况**；文中出现的具体型号与数值均为示例。参数语义以 Debian 13 自带的 `fancontrol 3.6.x` 为例，其他版本请对照 `man fancontrol`。

:::info[适用前提]
Debian 13（trixie）或相近版本；风扇为 4-pin PWM 并接在主板风扇口上；具备 `sudo` 或 `root` 权限；主板温控芯片能被内核驱动识别（第一步会验证）。
:::

## 一、先确认：芯片是否可控

```bash
# 安装传感器工具（fancontrol 需要单独安装，稍后再说）
sudo apt install -y lm-sensors

# 交互式探测并加载温控芯片驱动；探测问题回车即可，
# 最后询问是否写入 /etc/modules 时请选 No（第三节用更规范的方式持久化）
sudo sensors-detect

# 查看结果：温度、风扇转速、PWM 通道
sensors
```

你需要从输出里确认三件事：

| 要找的东西 | 判断方法 | 说明 |
| --- | --- | --- |
| 风扇 / PWM 通道 | 是否出现 `fanX`、`pwmX` | **有 `pwmX` 才有软件调速的可能**；只有 `fanX` 没有 `pwmX` 的芯片控制不了转速 |
| CPU 温度源 | `coretemp`（Intel）或 `k10temp`（AMD） | 曲线优先跟 CPU 温度走；主板传感器（如 `SYSTIN`）可作参考 |
| 可用通道数 | 数一数有哪几路 `pwmX` | 决定后面配置写几路；不用的通道可不纳管 |

:::tip[读数判别提示]
- **要绕开的读数**：未接传感器的通道常给出离谱数值（例如 `CPUTIN: -125.0°C`），拿它当温度源会让风扇永远按最低档跑。
- **转速为 0 的通道不代表空口**：分线器常常只回传主风扇的测速线，甚至完全不回传。这类通道是否能纳管，见文末踩坑栏第 3 条。
:::

**如果 `sensors-detect` 报告没有可用驱动**，按下面的顺序找出路：

1. 较新的 ITE 芯片（部分 AMD 主板上的 IT8688／IT8689 等）内核驱动可能不支持，需要社区 DKMS 驱动（`frankcrawford/it87`）；
2. 部分主板需要内核参数 `acpi_enforce_resources=lax` 才能让 Super I/O 驱动加载——这个参数会放松 ACPI 资源检查，**有风险，请自行评估后再动**；
3. 都不行：说明这块板的风扇不走内核可控通路，继续用 BIOS 自带的风扇曲线即可，本文其余步骤可跳过；
4. 笔记本或 OEM 机型的风扇通常由 EC 控制，属于 nbfc 一类工具的领域，不在本文范围。

## 二、关键一步：手动接管验证

驱动认得芯片，不代表写进去的数值真能改变转速——部分主板会把 PWM 通道锁在自动模式，这时无论怎么写都无动于衷。动手写配置之前，先花两分钟做一次**可逆**的手动验证。

```bash title="手动验证 PWM 通道可控性"
# 找到承载风扇的 hwmon 路径（编号以实际为准）
for h in /sys/class/hwmon/hwmon*; do echo "$h -> $(cat $h/name)"; done

# 记下当前模式（fancontrol 挂掉时要把这个值写回去，见第六节）
cat /sys/class/hwmon/hwmonX/pwm1_enable

# 切换到手动模式，写一档中等转速，看转速是否跟随
echo 1 | sudo tee /sys/class/hwmon/hwmonX/pwm1_enable
echo 150 | sudo tee /sys/class/hwmon/hwmonX/pwm1
sleep 5 && cat /sys/class/hwmon/hwmonX/fan1_input

# 再提高一档确认跟随（转速应明显上升）
echo 200 | sudo tee /sys/class/hwmon/hwmonX/pwm1
sleep 5 && cat /sys/class/hwmon/hwmonX/fan1_input

# 验证完成后先交还主板：把下面的 2 换成你刚才记录的值（多数驱动的自动模式为 2）
echo 2 | sudo tee /sys/class/hwmon/hwmonX/pwm1_enable
```

:::warning[判读与下限安全原则]
- 写入后转速跟着变化（哪怕只是几十转的差异），说明该通道可以交给软件控制；若某通道毫无反应，换一个通道再试，全部无反应则回到 BIOS 调整风扇口模式（PWM／DC）。
- **不要写到会让风扇停转的档位**。人在机器旁可以逐步下调找出停转点并记下来；**远程运维时，请把下限留在明显高于停转点的位置**——风扇一直转着，永远比安静重要。
:::

## 三、让驱动开机自动加载

```bash title="/etc/modules-load.d/sensors.conf"
# 写入模块加载清单（比写 /etc/modules 更规范直观）
# 模块名以 sensors-detect 的输出为准：Nuvoton 系为 nct6775，ITE 系为 it87
printf 'coretemp\nnct6775\n' | sudo tee /etc/modules-load.d/sensors.conf
```

Intel 平台写 `coretemp`，AMD 平台写 `k10temp`；风扇芯片模块按 `sensors-detect` 给出的名字填写。开机时这些模块会先于普通服务加载，因此 `fancontrol` 启动时芯片一定已就绪。

## 四、生成配置

```bash
# fancontrol 在 Debian 中是独立包（lm-sensors 会把它列为推荐）
sudo apt install -y fancontrol
```

先确定四个变量（编号以 `ls /sys/class/hwmon/*/name` 的实际结果为准）：

```bash
# 温度芯片（coretemp / k10temp …）与风扇芯片（nct6779 / it8688 …）所在的 hwmon
TEMP_HW=hwmon1     # 承载 CPU 温度的 hwmon
FAN_HW=hwmon2      # 承载风扇与 PWM 的 hwmon

# 取芯片名与设备路径（fancontrol 的 DEVPATH 要「设备目录 + 去掉 /sys/ 前缀」）
TEMPCHIP=$(cat /sys/class/hwmon/$TEMP_HW/name)
FANCHIP=$(cat /sys/class/hwmon/$FAN_HW/name)
CP=$(readlink -f /sys/class/hwmon/$TEMP_HW/device | sed 's|^/sys/||')
NP=$(readlink -f /sys/class/hwmon/$FAN_HW/device | sed 's|^/sys/||')
```

:::tip[检查 `device` 符号链接]
`DEVPATH` 依赖 hwmon 目录下的 `device` 符号链接。个别 hwmon（虚拟或 ACPI 类传感器较常见）没有这个链接，此时 `readlink -f` 会原样返回传入路径，生成的 `DEVPATH` 就是错的——先用 `ls -l /sys/class/hwmon/hwmonX/` 看一眼，按实际路径填。
:::

然后写配置。下面是**两路 PWM**（CPU 风扇 + 机箱风扇组）的完整示例，通道更多时按同样格式续写即可。

```bash title="/etc/fancontrol（两路 PWM 示例）"
sudo tee /etc/fancontrol > /dev/null <<EOF
# 50°C 以下保持最低转速；50→82°C 线性爬升；82°C 以上满速
INTERVAL=10
DEVPATH=hwmon1=$CP
DEVPATH=hwmon2=$NP
DEVNAME=hwmon1=$TEMPCHIP
DEVNAME=hwmon2=$FANCHIP
FCTEMPS=hwmon2/pwm1=hwmon1/temp1_input
FCTEMPS=hwmon2/pwm2=hwmon1/temp1_input
FCFANS=hwmon2/pwm1=hwmon2/fan1_input
FCFANS=hwmon2/pwm2=hwmon2/fan2_input
MINTEMP=hwmon2/pwm1=50
MINTEMP=hwmon2/pwm2=50
MAXTEMP=hwmon2/pwm1=82
MAXTEMP=hwmon2/pwm2=82
MINSTART=hwmon2/pwm1=100
MINSTART=hwmon2/pwm2=100
MINSTOP=hwmon2/pwm1=100
MINSTOP=hwmon2/pwm2=100
MINPWM=hwmon2/pwm1=100
MINPWM=hwmon2/pwm2=100
MAXPWM=hwmon2/pwm1=255
MAXPWM=hwmon2/pwm2=255
AVERAGE=hwmon2/pwm1=2
AVERAGE=hwmon2/pwm2=2
EOF
```

通道较多时，用循环批量生成更省事：

```bash title="多通道批量生成 /etc/fancontrol"
# 把 PWMS 换成你要纳管的通道（用 ls /sys/class/hwmon/hwmon2/pwm* 查看）
PWMS="pwm1 pwm2 pwm3 pwm4 pwm5"
{
  echo "INTERVAL=10"
  echo "DEVPATH=hwmon1=$CP"; echo "DEVPATH=hwmon2=$NP"
  echo "DEVNAME=hwmon1=$TEMPCHIP"; echo "DEVNAME=hwmon2=$FANCHIP"
  for p in $PWMS; do echo "FCTEMPS=hwmon2/$p=hwmon1/temp1_input"; done
  for p in $PWMS; do echo "FCFANS=hwmon2/$p=hwmon2/fan${p#pwm}_input"; done
  for p in $PWMS; do echo "MINTEMP=hwmon2/$p=50"; done
  for p in $PWMS; do echo "MAXTEMP=hwmon2/$p=82"; done
  for p in $PWMS; do echo "MINSTART=hwmon2/$p=100"; done
  for p in $PWMS; do echo "MINSTOP=hwmon2/$p=100"; done
  for p in $PWMS; do echo "MINPWM=hwmon2/$p=100"; done
  for p in $PWMS; do echo "MAXPWM=hwmon2/$p=255"; done
  for p in $PWMS; do echo "AVERAGE=hwmon2/$p=2"; done
} | sudo tee /etc/fancontrol > /dev/null
```

| 参数 | 含义 |
| --- | --- |
| `INTERVAL` | 轮询间隔（秒） |
| `DEVPATH` / `DEVNAME` | 设备路径与芯片名，供开机时重新定位 hwmon 编号 |
| `FCTEMPS` | 每路 PWM 对应的温度源 |
| `FCFANS` | 每路 PWM 对应的转速反馈 |
| `MINTEMP` | 低于此温度使用最低档 `MINPWM` |
| `MAXTEMP` | 高于此温度使用最高档 `MAXPWM` |
| `MINPWM` | 最低占空比 |
| `MINSTOP` / `MINSTART` | 中间区间的插值下限端点 / 风扇启动值 |
| `MAXPWM` | 最高占空比 |
| `AVERAGE` | 温度取平均的样本数，用于抗抖动 |

三条直接影响配置能否生效的语义细节：

1. 中间温度区间是**线性插值**，其下限端点是 `MINSTOP` 而不是 `MINPWM`，因此把两者设为同一个值，曲线最连续；
2. 配置校验要求 `MINSTOP ≥ MINPWM` 且 `MINSTOP < MAXPWM`，不满足会直接拒绝启动；
3. 下限不要设到会让风扇停转的档位——这也是示例把最低档留在中等偏下的原因。

## 五、启动与压测验收

```bash
# 先启动，暂不设开机自启（安装后服务可能已被 enable，可用 systemctl is-enabled fancontrol 查看）
sudo systemctl start fancontrol
sleep 15
systemctl status fancontrol --no-pager | head -8
journalctl -u fancontrol -n 10 --no-pager
sensors | grep -E 'fan[0-9]|pwm[0-9]|Package|Tctl'
```

看到 `Enabling PWM on fans...` 与 `Starting automatic fan control...`，并且 `sensors` 中 PWM 通道带上了 `MANUAL CONTROL` 标记，就说明接管成功。

接着做一次压测，确认曲线真的随温度爬升——这一步在远程运维时尤其重要，它用「温度是否收敛」代替了「亲耳听风扇」：

```bash title="stress-ng 满载温控曲线验收"
sudo apt install -y stress-ng

# 按 CPU 线程数满载 3 分钟（nproc 会给出线程数），每 30 秒采样一次
stress-ng --cpu "$(nproc)" --timeout 180 &
for i in 1 2 3 4 5 6; do sleep 30; sensors | grep -E 'Package|Tctl|fan1|pwm1'; echo ---; done

# 负载结束后确认能回落，而不是卡在高转速
sleep 30; sensors | grep -E 'Package|Tctl|fan1|pwm1'
```

验收标准：温度随负载上升 → PWM 与转速同步上升 → **温度收敛不再上涨** → 负载结束后 30 秒内回落。全部满足后，再设开机自启：

```bash
sudo systemctl enable fancontrol
```

## 六、崩溃自动回退主板控制

软件调速有一个天然短板：服务一旦挂掉，风扇会停在最后一次写入的档位。用 `systemd` 的停止钩子，把控制权自动交还主板——下面这份脚本会**从 `/etc/fancontrol` 里读出你实际纳管的通道**，因此不挑芯片、不挑通道数：

```bash title="/usr/local/sbin/fan-fallback.sh"
# 回退脚本：把 fancontrol 管理过的 PWM 通道写回自动模式
sudo tee /usr/local/sbin/fan-fallback.sh > /dev/null <<'EOF'
#!/bin/bash
# 若你的驱动自动模式不是 2，把上一节记录的原始值填到这里
ENABLE_FALLBACK=2
CFG=/etc/fancontrol
[ -r "$CFG" ] || exit 0

# 解析 DEVNAME 映射：hwmonX=芯片名
declare -A NAME
for kv in $(grep -o 'DEVNAME=[^ ]*' "$CFG" | sed 's/DEVNAME=//'); do
  NAME[${kv%%=*}]=${kv##*=}
done

# 从 FCTEMPS 中取出被管理的通道：hwmonX/pwmN
for ch in $(grep -o 'FCTEMPS=[^ ]*' "$CFG" | sed 's/FCTEMPS=//' | cut -d= -f1); do
  h=${ch%%/*}; p=${ch##*/}
  for d in /sys/class/hwmon/hwmon*; do
    [ "$(cat "$d/name" 2>/dev/null)" = "${NAME[$h]}" ] || continue
    echo "$ENABLE_FALLBACK" > "$d/${p}_enable" 2>/dev/null \
      && logger -t fan-fallback "returned ${p} to automatic mode"
    break
  done
done
exit 0
EOF
sudo chmod 700 /usr/local/sbin/fan-fallback.sh
```

把回退脚本挂到 systemd drop-in 并验证：

```bash title="/etc/systemd/system/fancontrol.service.d/fallback.conf"
# 挂到服务上：无论崩溃还是手动停止都会触发
sudo mkdir -p /etc/systemd/system/fancontrol.service.d
sudo tee /etc/systemd/system/fancontrol.service.d/fallback.conf > /dev/null <<'EOF'
[Service]
ExecStopPost=/usr/local/sbin/fan-fallback.sh
EOF
sudo systemctl daemon-reload

# 验证：停一次，观察日志与 PWM 是否交还主板
sudo systemctl stop fancontrol
journalctl -t fan-fallback -n 2 --no-pager
sensors | grep pwm          # 交还后 MANUAL CONTROL 标记应消失
sudo systemctl start fancontrol
```

## 七、清理与回滚

```bash
# 停止并移除服务与配置，回到纯主板控制
sudo systemctl disable --now fancontrol
sudo rm -rf /etc/fancontrol /etc/modules-load.d/sensors.conf \
            /usr/local/sbin/fan-fallback.sh \
            /etc/systemd/system/fancontrol.service.d
sudo systemctl daemon-reload

# 如不再需要工具链，用 purge 一并清掉配置文件
sudo apt purge fancontrol lm-sensors
# 重启后芯片由 BIOS 重新初始化，恢复出厂的风扇策略
```

## 附：踩坑记录（含本文验证硬件）

1. **`DEVPATH` 格式错误会直接启动失败**：必须是「设备目录 + 去掉 `/sys/` 前缀」，例如 `devices/platform/nct6775.2592`。若写成 `/sys/devices/.../hwmon/hwmon2`，服务会报 `Device path of hwmonX has changed` 与 `Configuration appears to be outdated` 并拒绝启动——用第四节的 `readlink` 方式生成可以避免。
2. **百分比与 sysfs 原始值口径不同**：同一档位在 `sensors` 中显示的百分比，与 sysfs 里读到的原始值不一定对得上（本文验证的芯片上，sysfs 的 130 显示为 65%）。调曲线时以**实际转速与温度**为准，不必纠结百分比数字。
3. **测速为 0 的通道也可以安全地纳入曲线**：分线器常常只回传主风扇的测速线，甚至完全不回传，于是主板读到的转速恒为 0。`fancontrol` 的算法在温度低于 `MINTEMP` 时只写最低档、不读转速；在插值区间内即使读到 0 转速，也只是额外写一次启动值，不会报错、更不会让风扇停转。前提仍然是：下限不要设到会让风扇停转的档位。
4. **`fancontrol` 与 `lm-sensors` 是两个包**：Debian 中 `lm-sensors` 提供 `sensors` 与 `sensors-detect`，`fancontrol` 需要单独安装。
5. **多条回退日志属正常**：如果期间执行过 `systemctl restart`，日志里可能出现两条回退记录——restart 内部的 stop 也会触发钩子。
6. **参数语义的版本口径**：本文以 `fancontrol 3.6.x` 为例（`MINSTOP` 同时是插值下限端点，且校验要求 `MINSTOP ≥ MINPWM`）。不同版本可能微调，动手前用 `man fancontrol` 核对一遍最稳妥。
7. **本文验证环境**：Intel X99 平台，Nuvoton NCT6779D（驱动 `nct6775`），CPU 为 Xeon E5-2698B v3；系统 Debian 13（trixie）。该平台 16 核满载时 Package 温度稳定在 60°C 以内，双风扇组待机维持在中档偏低转速。

## 写在最后

灯归 OpenRGB，风归 fancontrol：一个管观感，一个管温度与安静，两套系统互不干扰。至此，这台「退役再就业」的服务器在夜里终于安静下来了。
