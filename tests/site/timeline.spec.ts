import { expect, test } from "@playwright/test";
import { registerPersistentShellSync } from "./feature-page";

const TOTAL_COUNT = 1;

test.describe("时间线页", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/timeline/");
		await expect(page.locator(".timeline-card")).toHaveCount(TOTAL_COUNT);
	});

	test("渲染建站里程碑节点与元数据", async ({ page }) => {
		await expect(page.locator("#swup-container")).toHaveAttribute(
			"data-current-page",
			"timeline",
		);
		await expect(page.locator(".page-header__title")).toHaveText("时间线");
		await expect(page.locator(".timeline-section__count")).toHaveText(
			`${TOTAL_COUNT} 个节点`,
		);

		const featuredItem = page.locator(".timeline-card--featured").first();
		await expect(featuredItem).toBeVisible();
		await expect(
			featuredItem.locator(".timeline-card__featured-pill"),
		).toBeVisible();
		await expect(featuredItem.locator(".timeline-card__date")).toHaveText(
			"2026.11.20",
		);
		await expect(featuredItem.locator(".timeline-card__title")).toContainText(
			"「优纪互联」正式建站上线",
		);
	});

	test("单分类时隐藏多余筛选 chips，避免无效交互", async ({ page }) => {
		await expect(page.locator(".timeline-section__chips")).toHaveCount(0);
	});

	test("侧栏页面过滤与直接加载导航高亮正确", async ({ page }) => {
		await expect(
			page.locator('widget-layout[data-id="categories"]'),
		).toBeVisible();
		await expect(page.locator('widget-layout[data-id="tags"]')).toBeVisible();
		await expect(
			page.locator('[data-nav-key="timeline"]').first(),
		).toHaveAttribute("aria-current", "page");
	});
});

test.describe("时间线页 Swup 导航", () => {
	test.use({ viewport: { width: 1280, height: 900 } });

	registerPersistentShellSync("从持久顶栏进入后同步页面、导航与侧栏状态", {
		key: "timeline",
		fromPath: "/skills/",
		toPath: /\/timeline\/$/,
		cardSelector: "timeline-card",
		cardCount: TOTAL_COUNT,
	});
});
