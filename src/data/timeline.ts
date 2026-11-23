/**
 * 时间线页数据源（纯内容）。
 * 页面展示与筛选规则由 src/config/timelineConfig.ts 控制。
 */
import type { TimelineItem } from "@/types/timelineConfig";

export const timelineData: TimelineItem[] = [
	{
		title: "「优纪互联」正式建站上线",
		date: "2026.11.20",
		category: "milestone",
		subtitle: "优纪互联",
		description:
			"把之前零散放在别处的笔记收拢起来，基于 Shirone 搭好了这座静态博客——先让站点稳稳跑起来，再把内容和细节一点点补齐。",
		highlights: [
			"选定 Astro 7 + Svelte 5 + Material 3 Expressive 静态架构，页面轻快、维护省心",
			"拆出国内站与国际站双分支部署：分别接入阿里云 ESA 与 Cloudflare 边缘节点",
			"用来安放家庭服务器折腾记录、生电服踩坑笔记，以及往后的日常随笔",
		],
		tags: ["建站", "Shirone", "Astro", "双站部署"],
		icon: "material-symbols:rocket-launch-rounded",
		featured: true,
	},
];

/** 获取所有时间线数据列表 */
export function getTimelineList(): TimelineItem[] {
	return timelineData;
}
