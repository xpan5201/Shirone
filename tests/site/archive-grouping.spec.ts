import { expect, test } from "@playwright/test";

/**
 * 归档页分组切换（SegmentedButton 落地锁定）：
 * - 单选组语义（role=group + radio，方向键原生支持）；
 * - 三种分组维度（按年 / 按分类 / 按标签）的组头与计数；
 * - 带 URL 筛选（?category=）时是定向浏览视图：隐藏分组切换、保留面包屑。
 * 组头顺序约定：年份倒序（新→旧）、分类/标签按名称字母序。
 */
test.describe("archive grouping switch", () => {
	test.use({ viewport: { width: 1280, height: 900 } });

	async function openArchive(
		page: import("@playwright/test").Page,
		path = "/archive/",
	) {
		await page.goto(path, { waitUntil: "networkidle" });
		await page.waitForTimeout(600);
	}

	async function selectGroup(
		page: import("@playwright/test").Page,
		name: string,
	) {
		// SegmentedButton 的 input 是 sr-only 隐藏的，点击可见 label（原生转发到 input）
		await page
			.getByRole("group", { name: "归档分组" })
			.getByText(name, { exact: true })
			.click();
	}

	test("renders a labeled radio group with three options, year checked by default", async ({
		page,
	}) => {
		await openArchive(page);

		const group = page.getByRole("group", { name: "归档分组" });
		const radios = group.getByRole("radio");
		await expect(radios).toHaveCount(3);
		await expect(radios.nth(0)).toHaveAccessibleName("按年份");
		await expect(radios.nth(1)).toHaveAccessibleName("按分类");
		await expect(radios.nth(2)).toHaveAccessibleName("按标签");
		await expect(radios.nth(0)).toBeChecked();
		await expect(radios.nth(1)).not.toBeChecked();

		// 默认按年分组：年份倒序，首组为最新年份
		const titles = page.locator(".m3-blog-archive__group-title");
		await expect(titles.first()).toHaveText("2026");
		await expect(titles).toHaveText(["2026", "2024", "2023", "2022"]);
	});

	test("switches grouping to category with counts", async ({ page }) => {
		await openArchive(page);

		await selectGroup(page, "按分类");
		await expect(page.locator(".m3-blog-archive__group-title")).toHaveText([
			"示例",
			"指南",
		]);
		// Compare the rendered number against the rendered entries instead of
		// building an expected string: the label is produced by the component's
		// own `countLabel`, which is localised and pluralised, so any literal
		// here would be a guess that only holds for the current content.
		const firstGroup = page.locator(".m3-blog-archive__group").first();
		const rendered = await firstGroup
			.locator(".m3-blog-archive__count")
			.first()
			.evaluate((element) => {
				const match = element.textContent?.match(/\d+/);
				return {
					count: match ? Number.parseInt(match[0], 10) : null,
					entries:
						element
							.closest(".m3-blog-archive__group")
							?.querySelectorAll(".m3-blog-archive__item").length ?? -1,
				};
			});
		expect(rendered.count).toBe(rendered.entries);
	});

	test("switches grouping to tag, sorted by name with hash prefix", async ({
		page,
	}) => {
		await openArchive(page);

		await selectGroup(page, "按标签");
		const tagTitles = await page
			.locator(".m3-blog-archive__group-title")
			.allTextContents();
		expect(tagTitles.length).toBe(27);
		expect(tagTitles[0]).toBe("#Fuwari");
		expect(tagTitles).toContain("#博客写作");
		expect(tagTitles).toContain("#指南");
		expect(tagTitles).toContain("#Shirone");
	});

	test("arrow keys move selection within the radio group", async ({ page }) => {
		await openArchive(page);

		await page.getByRole("radio", { name: "按年份" }).focus();
		await page.keyboard.press("ArrowRight");
		await expect(
			page.getByRole("radio", { name: "按分类" }),
		).toBeChecked();
		await page.keyboard.press("ArrowRight");
		await expect(page.getByRole("radio", { name: "按标签" })).toBeChecked();
		await page.keyboard.press("ArrowLeft");
		await expect(
			page.getByRole("radio", { name: "按分类" }),
		).toBeChecked();
	});

	test("URL filter is a scoped browse view: switch hidden, breadcrumb shown", async ({
		page,
	}) => {
		await openArchive(page, "/archive/?category=%E7%A4%BA%E4%BE%8B");

		// 筛选头保留
		await expect(
			page.getByRole("navigation", { name: "面包屑导航" }),
		).toBeVisible();
		// 带筛选参数时不渲染分组切换（定向浏览视图，分组控制无意义）
		await expect(
			page.getByRole("group", { name: "归档分组" }),
		).toHaveCount(0);
		// 直接呈现筛选后的年份时间轴。Asserted by title rather than count: the
		// Examples category gains posts as features are documented, so a literal
		// number drifts without any filter behaviour changing.
		await expect(page.locator(".m3-blog-archive__title-text")).toHaveText([
			"密码保护与文章加密演示",
			"音频阅读器：日式动画中的神秘语音",
			"图片画廊网格：语法与完整示例",
			"Mermaid 图表画廊",
			"Expressive Code 示例",
			"Markdown 示例",
			"在文章中嵌入视频",
			"草稿示例",
		]);
		await expect(page.locator(".m3-blog-archive__group-title")).toHaveText([
			"2026",
			"2024",
			"2023",
			"2022",
		]);

		// 回到无参数归档页：分组切换恢复
		await openArchive(page);
		await expect(
			page.getByRole("group", { name: "归档分组" }),
		).toBeVisible();
	});
});
