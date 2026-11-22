import { expect, test } from "@playwright/test";
import {
	resolveRegionSwitchOptions,
	siteConfig,
} from "../../src/config/siteConfig";

test.describe("Site custom controls (region switcher & theme toggle)", () => {
	test("CN/INTL region switcher adapts across desktop, medium, and mobile drawer", async ({
		page,
	}) => {
		const resolved = resolveRegionSwitchOptions(
			siteConfig.regionSwitch ?? null,
			siteConfig.site,
		);
		expect(resolved.enable).toBe(true);
		const currentKey = resolved.currentItem?.key ?? "";
		const targetKey = resolved.targetItem?.key ?? "";
		const targetHref = resolved.targetItem?.href ?? "";

		// Desktop (>=1280px): dual tonal pill visible, compact icon button hidden
		await page.setViewportSize({ width: 1280, height: 900 });
		await page.goto("/", { waitUntil: "domcontentloaded" });

		const topbar = page.locator('[data-region-switch="topbar"]');
		const topbarDual = topbar.locator(".region-switch__dual");
		const topbarCompact = topbar.locator("[data-region-compact]");

		await expect(topbarDual).toBeVisible();
		await expect(topbarCompact).toBeHidden();
		await expect(
			topbarDual.locator(`[data-region-key="${currentKey}"]`),
		).toHaveAttribute("aria-current", "true");
		const peerLink = topbarDual.locator(`a[data-region-key="${targetKey}"]`);
		await expect(peerLink).toHaveAttribute("href", targetHref);
		await expect(peerLink).toHaveAttribute("data-no-swup", "");

		// Medium (<1280px): collapses smoothly to 40x40 compact badge button
		await page.setViewportSize({ width: 1024, height: 900 });
		await expect(topbarDual).toBeHidden();
		await expect(topbarCompact).toBeVisible();
		await expect(topbarCompact).toHaveAttribute("href", targetHref);
		const compactBox = await topbarCompact.boundingBox();
		expect(compactBox).not.toBeNull();
		expect(Math.round(compactBox?.width ?? 0)).toBe(40);
		expect(Math.round(compactBox?.height ?? 0)).toBe(40);

		// Mobile drawer (<1024px): full-width dual pill inside navigation drawer
		await page.setViewportSize({ width: 390, height: 844 });
		await page.locator("#nav-drawer-switch").click();
		const drawerDual = page.locator(
			'[data-region-switch="drawer"] .region-switch__dual',
		);
		await expect(drawerDual).toBeVisible();
		await expect(
			drawerDual.locator(`[data-region-key="${currentKey}"]`),
		).toHaveAttribute("aria-current", "true");
		await expect(
			drawerDual.locator(`a[data-region-key="${targetKey}"]`),
		).toHaveAttribute("href", targetHref);
	});

	test("single-click theme toggle and DisplaySettings 3-state selector stay synchronized", async ({
		page,
	}) => {
		await page.addInitScript(() => {
			localStorage.setItem("theme", "light");
		});
		await page.setViewportSize({ width: 1280, height: 900 });
		await page.goto("/", { waitUntil: "load" });

		const root = page.locator("html");
		const toggleBtn = page.locator("#scheme-switch");

		await expect(root).not.toHaveClass(/\bdark\b/);
		await expect(toggleBtn).toHaveAttribute("aria-pressed", "false");

		// Single click toggles light -> dark directly without opening a submenu
		await toggleBtn.click();
		await expect(root).toHaveClass(/\bdark\b/);
		await expect(toggleBtn).toHaveAttribute("aria-pressed", "true");
		await expect
			.poll(() => page.evaluate(() => localStorage.getItem("theme")))
			.toBe("dark");
		await expect
			.poll(() =>
				page.evaluate(() =>
					document.documentElement.classList.contains("theme-switching"),
				),
			)
			.toBe(false);

		// Second click toggles dark -> light
		await toggleBtn.click();
		await expect(root).not.toHaveClass(/\bdark\b/);
		await expect(toggleBtn).toHaveAttribute("aria-pressed", "false");
		await expect
			.poll(() => page.evaluate(() => localStorage.getItem("theme")))
			.toBe("light");

		// DisplaySettings 3-state selector syncs back to topbar toggle and storage
		await page.locator("#display-settings-switch").click();
		const panel = page.locator("#display-setting");
		const darkOption = panel.getByText("暗色", { exact: true });
		await darkOption.waitFor({ state: "visible", timeout: 10_000 });
		await darkOption.click();
		await expect(root).toHaveClass(/\bdark\b/);
		await expect(toggleBtn).toHaveAttribute("aria-pressed", "true");
		await expect
			.poll(() => page.evaluate(() => localStorage.getItem("theme")))
			.toBe("dark");

		await panel.getByText("跟随系统", { exact: true }).click();
		await expect
			.poll(() => page.evaluate(() => localStorage.getItem("theme")))
			.toBe("auto");
	});
});
