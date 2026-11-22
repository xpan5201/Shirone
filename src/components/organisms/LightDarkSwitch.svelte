<script lang="ts">
/**
 * 顶栏明暗一键切换按钮（全端统一单击直切亮 ↔ 暗 + 太阳/月亮平滑旋转动效）。
 * 「亮色 / 暗色 / 跟随系统」三态选择器收纳至 DisplaySettings 面板，保持顶栏轻盈高效；
 * 仅在当前仍为 AUTO_MODE 时响应系统 prefers-color-scheme 变化。
 */
import {
	AUTO_MODE,
	DARK_MODE,
	LIGHT_MODE,
	THEME_CHANGE_EVENT,
} from "@constants/constants.ts";
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import Icon from "@iconify/svelte";
import {
	applyThemeToDocument,
	getStoredTheme,
	resolveIsDark,
	resolveTransitionOrigin,
	setThemeWithTransition,
} from "@utils/setting-utils.ts";
import { onMount } from "svelte";
import type { LIGHT_DARK_MODE } from "@/types/config.ts";

let isDark = $state(false);
let buttonEl: HTMLButtonElement | undefined = $state();

const nextModeLabel = $derived(
	isDark ? i18n(I18nKey.lightMode) : i18n(I18nKey.darkMode),
);
const ariaLabel = $derived(`${i18n(I18nKey.lightDarkMode)} (${nextModeLabel})`);

function syncState(nextMode: LIGHT_DARK_MODE = getStoredTheme()): void {
	isDark =
		typeof document !== "undefined"
			? document.documentElement.classList.contains("dark")
			: resolveIsDark(nextMode);
}

onMount(() => {
	syncState();

	const darkModePreference = window.matchMedia("(prefers-color-scheme: dark)");
	const onSchemeChange = (): void => {
		const stored = getStoredTheme();
		if (stored !== AUTO_MODE) return;
		// 系统自动切换时冻结零散过渡，确保卡片与背景同帧同步
		const root = document.documentElement;
		root.classList.add("theme-switching");
		applyThemeToDocument(AUTO_MODE);
		void root.offsetWidth;
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				root.classList.remove("theme-switching");
			});
		});
	};

	const onThemeChange = (event: Event): void => {
		const detail = (
			event as CustomEvent<{ isDark?: boolean; mode?: LIGHT_DARK_MODE }>
		).detail;
		if (typeof detail?.isDark === "boolean") isDark = detail.isDark;
		else isDark = document.documentElement.classList.contains("dark");
	};

	darkModePreference.addEventListener("change", onSchemeChange);
	window.addEventListener(THEME_CHANGE_EVENT, onThemeChange);
	return () => {
		darkModePreference.removeEventListener("change", onSchemeChange);
		window.removeEventListener(THEME_CHANGE_EVENT, onThemeChange);
	};
});

function handleToggle(event: MouseEvent): void {
	const nextMode: LIGHT_DARK_MODE = isDark ? LIGHT_MODE : DARK_MODE;
	setThemeWithTransition(nextMode, resolveTransitionOrigin(event, buttonEl));
}
</script>

<div class="theme-toggle">
	<button
		bind:this={buttonEl}
		id="scheme-switch"
		type="button"
		aria-label={ariaLabel}
		aria-pressed={isDark}
		title={nextModeLabel}
		class="theme-toggle__btn m3-state-layer"
		onclick={handleToggle}
	>
		<span
			class={`theme-toggle__icon theme-toggle__icon--sun${!isDark ? " theme-toggle__icon--active" : ""}`}
			aria-hidden="true"
		>
			<Icon icon="material-symbols:wb-sunny-outline-rounded" />
		</span>
		<span
			class={`theme-toggle__icon theme-toggle__icon--moon${isDark ? " theme-toggle__icon--active" : ""}`}
			aria-hidden="true"
		>
			<Icon icon="material-symbols:dark-mode-outline-rounded" />
		</span>
	</button>
</div>

<style lang="stylus">
.theme-toggle
	position: relative
	display: flex
	align-items: center
	justify-content: center
	width: 2.5rem
	height: 2.5rem
	flex-shrink: 0

	&__btn
		position: relative
		display: inline-flex
		align-items: center
		justify-content: center
		width: 2.5rem
		height: 2.5rem
		border: none
		border-radius: var(--shape-corner-full)
		background: transparent
		color: var(--on-surface)
		cursor: pointer
		user-select: none
		--m3e-state-color: var(--on-surface)
		--m3e-focus-outline: var(--on-surface)

		&:hover .theme-toggle__icon--active
			transform: rotate(16deg) scale(1.06)

		&:active .theme-toggle__icon--active
			transform: scale(0.9)

	&__icon
		position: absolute
		display: inline-flex
		align-items: center
		justify-content: center
		opacity: 0
		pointer-events: none
		transition:
			opacity var(--m3e-duration-medium) var(--m3e-easing-standard),
			transform var(--m3e-duration-medium) var(--m3e-easing-emphasized-decelerate)

		> :global(svg)
			width: 1.25rem
			height: 1.25rem

		&--sun
			transform: rotate(-75deg) scale(0.55)

		&--moon
			transform: rotate(75deg) scale(0.55)

		&--active
			opacity: 1
			transform: rotate(0deg) scale(1)

@media (prefers-reduced-motion: reduce)
	.theme-toggle__icon
		transition: none

	.theme-toggle__btn:hover .theme-toggle__icon--active,
	.theme-toggle__btn:active .theme-toggle__icon--active
		transform: none
</style>
