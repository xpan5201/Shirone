// 循环依赖规避：navBarConfig 等配置消费 i18n，本模块只允许从具体文件导入 siteConfig 与 i18nConfig，
// 禁止走 @/config barrel（见 src/config/README.md）
import { i18nConfig } from "../config/i18nConfig.ts";
import { siteConfig } from "../config/siteConfig.ts";
import type I18nKey from "./i18nKey.ts";
import { en } from "./languages/en.ts";
import { es } from "./languages/es.ts";
import { id } from "./languages/id.ts";
import { ja } from "./languages/ja.ts";
import { ko } from "./languages/ko.ts";
import { th } from "./languages/th.ts";
import { tr } from "./languages/tr.ts";
import { vi } from "./languages/vi.ts";
import { zh_CN } from "./languages/zh_CN.ts";
import { zh_TW } from "./languages/zh_TW.ts";

export type Translation = {
	[K in I18nKey]: string;
};

const defaultTranslation = en;

const map: { [key: string]: Translation } = {
	es: es,
	en: en,
	en_us: en,
	en_gb: en,
	en_au: en,
	zh_cn: zh_CN,
	zh_tw: zh_TW,
	ja: ja,
	ja_jp: ja,
	ko: ko,
	ko_kr: ko,
	th: th,
	th_th: th,
	vi: vi,
	vi_vn: vi,
	id: id,
	tr: tr,
	tr_tr: tr,
};

export function getTranslation(lang: string): Translation {
	return map[lang.toLowerCase()] || defaultTranslation;
}

export type I18nParams = Readonly<Record<string, string | number>>;

/**
 * 统一占位符插值：把 `{name}` 换成 params.name。
 * 未提供 params 时原样返回，保证既有调用行为不变；
 * 占位符名在各语种保持一致（见 src/i18n/AGENTS.md）。
 */
function interpolate(text: string, params?: I18nParams): string {
	if (!params) return text;
	return text.replace(/\{(\w+)\}/g, (raw, name: string) => {
		const value = params[name];
		return value === undefined ? raw : String(value);
	});
}

export function i18n(key: I18nKey, params?: I18nParams): string {
	const lang = (siteConfig.lang || "en").toLowerCase();

	// 1. 查找用户自定义 i18n 覆盖域（支持原大小写及小写匹配，如 zh_CN / zh_cn）
	if (i18nConfig && typeof i18nConfig === "object") {
		const langOverrides =
			i18nConfig[lang] ??
			Object.entries(i18nConfig).find(([k]) => k.toLowerCase() === lang)?.[1];

		if (langOverrides && typeof langOverrides === "object") {
			const customVal = langOverrides[key];
			if (typeof customVal === "string") {
				return interpolate(customVal, params);
			}
		}
	}

	// 2. 回退到内置 10 语言词典
	return interpolate(getTranslation(lang)[key], params);
}
