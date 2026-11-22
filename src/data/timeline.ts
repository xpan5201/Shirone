/**
 * 时间线页数据源（纯内容）。
 * 页面展示与筛选规则由 src/config/timelineConfig.ts 控制。
 */
import type { TimelineItem } from "@/types/timelineConfig";

export const timelineData: TimelineItem[] = [
	{
		title: "Shirone 主题 M3E 架构大改版",
		date: "2026.08",
		category: "milestone",
		subtitle: "开源项目",
		description:
			"把整套博客主题重构为 Material 3 Expressive 原子组件体系：样式由设计令牌驱动，键盘导航完整，并满足无障碍规范。",
		highlights: [
			"实现动态 HCT 调色计算与状态层令牌",
			"新增多页面能力：时间线、技能、项目与加密相册",
			"严格类型检查零错误，并加上自动化视觉回归锁定",
		],
		tags: ["Astro", "Svelte 5", "M3E", "Tailwind 4"],
		links: [
			{
				label: "GitHub 仓库",
				url: "https://github.com/LyraVoid/Shirone",
				icon: "fa7-brands:github",
			},
		],
		icon: "material-symbols:rocket-launch-rounded",
		featured: true,
	},
	{
		title: "高级前端工程师",
		date: "2025.03 – 至今",
		category: "career",
		subtitle: "技术实验室",
		location: "日本东京",
		description:
			"主导现代 Web 平台的前端架构、Web 性能优化与交互式设计系统开发。",
		highlights: [
			"推动各 Web 产品线的设计系统统一",
			"借助现代 SSR 与资源管线把核心包加载时间降低 40%",
		],
		tags: ["TypeScript", "架构", "性能", "设计系统"],
		icon: "material-symbols:work-rounded",
		featured: true,
	},
	{
		title: "全栈 Web 应用上线",
		date: "2024.11",
		category: "project",
		subtitle: "独立创作",
		description:
			"设计并构建了一套端到端创意工作流应用，支持实时协作与云端同步。",
		highlights: [
			"设计低延迟的流式画布交互界面",
			"构建带边缘缓存与关系型持久化的无服务器后端 API",
		],
		tags: ["Svelte", "Node.js", "PostgreSQL", "Cloudflare"],
		icon: "material-symbols:deployed-code-outline-rounded",
	},
	{
		title: "计算机科学与工程学位",
		date: "2020.09 – 2024.06",
		category: "education",
		subtitle: "理工大学",
		location: "中国杭州",
		description: "专注计算机系统、软件工程、人机交互与分布式架构。",
		highlights: [
			"以优异成绩毕业，获优秀毕业论文奖",
			"主导高校开源学生社区与黑客松活动",
		],
		tags: ["计算机科学", "算法", "软件工程"],
		icon: "material-symbols:school-rounded",
	},
	{
		title: "开始写个人博客与技术笔记",
		date: "2022.04",
		category: "life",
		subtitle: "踏入技术写作的第一步",
		description: "在网上发布第一篇文章，开始记录前端探索、创意编程与个人随想。",
		tags: ["博客写作", "写作", "开放 Web"],
		icon: "material-symbols:edit-note-rounded",
	},
];

/** 获取所有时间线数据列表 */
export function getTimelineList(): TimelineItem[] {
	return timelineData;
}
