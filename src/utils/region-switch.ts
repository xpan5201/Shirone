import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import { resolveI18nText } from "@utils/i18n-utils";
import { resolveRegionSwitchOptions, siteConfig } from "@/config/siteConfig";
import type {
	RegionSwitchConfig,
	ResolvedRegionSwitchItem,
} from "@/types/config";

export interface RegionSwitchViewModel {
	enable: boolean;
	items: ResolvedRegionSwitchItem[];
	currentItem?: ResolvedRegionSwitchItem;
	targetItem?: ResolvedRegionSwitchItem;
	groupLabel: string;
	switchTitle: string;
	hint: string;
}

/**
 * 组装站点线路切换器的本地化展示数据；关闭时短路返回空模型。
 */
export function resolveRegionSwitchViewModel(
	config: RegionSwitchConfig | null = siteConfig.regionSwitch ?? null,
	currentSiteUrl: string = siteConfig.site,
): RegionSwitchViewModel {
	const resolved = resolveRegionSwitchOptions(config, currentSiteUrl);
	if (!resolved.enable || !resolved.currentItem || !resolved.targetItem) {
		return {
			enable: false,
			items: [],
			groupLabel: "",
			switchTitle: "",
			hint: "",
		};
	}

	const items: ResolvedRegionSwitchItem[] = resolved.items.map((item) => ({
		...item,
		label: resolveI18nText(item.label),
	}));
	const currentItem = items.find((item) => item.active) ?? items[0];
	const targetItem =
		items.find((item) => item.key === resolved.targetItem?.key) ?? items[1];

	return {
		enable: true,
		items,
		currentItem,
		targetItem,
		groupLabel: i18n(I18nKey.regionSwitch),
		switchTitle: i18n(I18nKey.regionSwitchTo, {
			current: currentItem.label,
			target: targetItem.label,
		}),
		hint: i18n(I18nKey.regionSwitchHint),
	};
}
