import assert from "node:assert/strict";
import test from "node:test";
import { resolveRegionSwitchOptions } from "../src/config/siteConfig.ts";

const SAMPLE_CONFIG = {
	enable: true,
	items: [
		{
			key: "cn",
			label: "$t:regionChina",
			shortLabel: "CN",
			url: "https://www.mintyuki.com/posts/demo?from=1",
			icon: "material-symbols:bolt-rounded",
		},
		{
			key: "intl",
			label: "$t:regionInternational",
			shortLabel: "INTL",
			url: "https://blog.yukinoo.com",
			icon: "material-symbols:public",
		},
	],
};

test("关闭或未配置时严格短路返回空列表", () => {
	assert.deepEqual(resolveRegionSwitchOptions(null, "https://www.mintyuki.com/"), {
		enable: false,
		items: [],
	});
	assert.deepEqual(
		resolveRegionSwitchOptions(
			{ ...SAMPLE_CONFIG, enable: false },
			"https://www.mintyuki.com/",
		),
		{ enable: false, items: [] },
	);
});

test("按 siteConfig.site 自动识别国内站并规范化首页地址", () => {
	const result = resolveRegionSwitchOptions(
		SAMPLE_CONFIG,
		"https://www.mintyuki.com/",
	);
	assert.equal(result.enable, true);
	assert.equal(result.items.length, 2);
	assert.equal(result.currentItem?.key, "cn");
	assert.equal(result.targetItem?.key, "intl");
	assert.equal(result.items[0].href, "https://www.mintyuki.com/");
	assert.equal(result.items[0].host, "www.mintyuki.com");
	assert.equal(result.items[0].active, true);
	assert.equal(result.items[1].href, "https://blog.yukinoo.com/");
	assert.equal(result.items[1].active, false);
});

test("按 siteConfig.site 自动识别国际站", () => {
	const result = resolveRegionSwitchOptions(
		SAMPLE_CONFIG,
		"https://blog.yukinoo.com/",
	);
	assert.equal(result.enable, true);
	assert.equal(result.currentItem?.key, "intl");
	assert.equal(result.targetItem?.key, "cn");
	assert.equal(result.items[0].active, false);
	assert.equal(result.items[1].active, true);
});

test("支持手动 current 覆盖，且过滤非法协议与重复 key", () => {
	const overridden = resolveRegionSwitchOptions(
		{ ...SAMPLE_CONFIG, current: "intl" },
		"https://www.mintyuki.com/",
	);
	assert.equal(overridden.currentItem?.key, "intl");
	assert.equal(overridden.targetItem?.key, "cn");

	const invalidOnly = resolveRegionSwitchOptions(
		{
			enable: true,
			items: [
				{
					key: "cn",
					label: "国内",
					shortLabel: "CN",
					url: "https://www.mintyuki.com/",
					icon: "material-symbols:bolt-rounded",
				},
				{
					key: "bad",
					label: "恶意",
					shortLabel: "XSS",
					url: "javascript:alert(1)",
					icon: "material-symbols:public",
				},
				{
					key: "cn",
					label: "重复",
					shortLabel: "DUP",
					url: "https://dup.example.com/",
					icon: "material-symbols:public",
				},
			],
		},
		"https://www.mintyuki.com/",
	);
	assert.deepEqual(invalidOnly, { enable: false, items: [] });
});
