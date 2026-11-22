import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

/**
 * i18n 词典一致性守卫：
 * 1. 10 个语种文件的键集合必须与 src/i18n/i18nKey.ts 完全一致；
 * 2. 每条译文非空；
 * 3. 同一词条在各语种的 {placeholder} 集合必须相同（消费方只替换一次）。
 *
 * 纯文本解析，不依赖 TS 运行期，CI 的 `node --test tests/**\/*.test.mjs` 会执行。
 */

const ROOT = process.cwd();
const LANGUAGES = [
	"en",
	"zh_CN",
	"zh_TW",
	"ja",
	"ko",
	"es",
	"id",
	"th",
	"tr",
	"vi",
];

const keySource = readFileSync(join(ROOT, "src/i18n/i18nKey.ts"), "utf8");
const canonicalKeys = [...keySource.matchAll(/^\s*([a-zA-Z0-9_]+) = "/gm)].map(
	(m) => m[1],
);

const ENTRY = /\[Key\.([A-Za-z0-9_]+)\]:\s*"((?:[^"\\]|\\.)*)"/g;

function loadLocale(lang) {
	const source = readFileSync(
		join(ROOT, `src/i18n/languages/${lang}.ts`),
		"utf8",
	);
	const entries = new Map();
	for (const match of source.matchAll(ENTRY)) {
		const key = match[1];
		assert.equal(
			entries.has(key),
			false,
			`${lang}.ts 中词条 ${key} 重复定义`,
		);
		entries.set(key, match[2]);
	}
	return entries;
}

function placeholders(value) {
	return [...value.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
}

const locales = new Map(LANGUAGES.map((lang) => [lang, loadLocale(lang)]));

test("I18nKey 枚举非空且无重复", () => {
	assert.ok(canonicalKeys.length > 100, "枚举键数量异常");
	assert.equal(
		new Set(canonicalKeys).size,
		canonicalKeys.length,
		"I18nKey 存在重复键",
	);
});

for (const [lang, entries] of locales) {
	test(`${lang}: 键集合与 I18nKey 完全一致`, () => {
		const missing = canonicalKeys.filter((key) => !entries.has(key));
		const extra = [...entries.keys()].filter(
			(key) => !canonicalKeys.includes(key),
		);
		assert.deepEqual(missing, [], `${lang} 缺少词条: ${missing.join(", ")}`);
		assert.deepEqual(extra, [], `${lang} 多出词条: ${extra.join(", ")}`);
	});

	test(`${lang}: 不存在空译文`, () => {
		const empty = [...entries.entries()]
			.filter(([, value]) => value.trim() === "")
			.map(([key]) => key);
		assert.deepEqual(empty, [], `${lang} 存在空译文: ${empty.join(", ")}`);
	});
}

test("各语种占位符集合一致", () => {
	const reference = locales.get("en");
	for (const key of canonicalKeys) {
		const expected = placeholders(reference.get(key) ?? "");
		for (const [lang, entries] of locales) {
			if (lang === "en") continue;
			assert.deepEqual(
				placeholders(entries.get(key) ?? ""),
				expected,
				`${lang} 的词条 ${key} 占位符与 en 不一致`,
			);
		}
	}
});
