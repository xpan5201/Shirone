<script lang="ts">
/**
 * M3E 柔调果冻站点线路切换器（方案 B · Tonal Expressive 分子组件）。
 * - 数据驱动、零副作用、纯 SSR 可用（TopAppBar 无须水合，SiteNavigationDrawer 同源复用）；
 * - 顶栏模式：>= bp-xl 显示双瓣柔调胶囊，< bp-xl 自动折叠为 40×40 徽标图标按钮；
 * - 抽屉模式：展示站点线路头、全宽双瓣胶囊与说明文案；
 * - 边角形变严格使用精确半边长（14↔20px / 7↔14px / 8↔18px）与 M3E standard 无过冲曲线，
 *   消除圆/方过渡中出现尖角的问题。
 */
import Icon from "@iconify/svelte";

export interface RegionSwitchViewItem {
	key: string;
	label: string;
	shortLabel: string;
	href: string;
	host: string;
	icon: string;
	active: boolean;
}

interface Props {
	items: readonly RegionSwitchViewItem[];
	currentItem: RegionSwitchViewItem;
	targetItem: RegionSwitchViewItem;
	variant?: "topbar" | "drawer";
	groupLabel: string;
	switchTitle: string;
	hint?: string;
	class?: string;
}

let {
	items,
	currentItem,
	targetItem,
	variant = "topbar",
	groupLabel,
	switchTitle,
	hint = "",
	class: className = "",
}: Props = $props();

const rootClass = $derived(
	`region-switch region-switch--${variant}${className ? ` ${className}` : ""}`,
);
const dualClass = $derived(
	`region-switch__dual${variant === "drawer" ? " region-switch__dual--drawer" : ""}`,
);
</script>

<div class={rootClass} data-region-switch={variant}>
	{#if variant === "drawer"}
		<div class="region-switch__header">
			<span class="region-switch__title">{groupLabel}</span>
			<span class="region-switch__host">{currentItem.host}</span>
		</div>
	{/if}

	<div class={dualClass} role="group" aria-label={groupLabel}>
		{#each items as item, index (item.key)}
			{@const edgeClass =
				index === 0
					? "region-switch__seg--start"
					: index === items.length - 1
						? "region-switch__seg--end"
						: "region-switch__seg--middle"}
			{@const segClass = `region-switch__seg ${edgeClass}${item.active ? " region-switch__seg--active" : " m3-state-layer"}`}
			{#if item.active}
				<span class={segClass} aria-current="true" data-region-key={item.key}>
					<span class="region-switch__icon" aria-hidden="true">
						<Icon icon={item.icon} />
					</span>
					<span class="region-switch__label">{item.label}</span>
				</span>
			{:else}
				<a
					class={segClass}
					href={item.href}
					data-no-swup
					data-region-key={item.key}
					title={switchTitle}
				>
					<span class="region-switch__icon" aria-hidden="true">
						<Icon icon={item.icon} />
					</span>
					<span class="region-switch__label">{item.label}</span>
				</a>
			{/if}
		{/each}
	</div>

	{#if variant === "topbar"}
		<a
			class="region-switch__compact m3-state-layer"
			href={targetItem.href}
			data-no-swup
			data-region-compact
			title={switchTitle}
			aria-label={switchTitle}
		>
			<span class="region-switch__compact-icon" aria-hidden="true">
				<Icon icon={currentItem.icon} />
			</span>
			<span class="region-switch__compact-badge" aria-hidden="true">
				{currentItem.shortLabel}
			</span>
		</a>
	{:else if hint}
		<p class="region-switch__hint">{hint}</p>
	{/if}
</div>

<style lang="stylus">
@import "../../styles/breakpoints.styl"

.region-switch
	display: inline-flex
	align-items: center
	flex-shrink: 0

	&--topbar
		margin-inline-end: var(--m3e-space-1)

	&--drawer
		display: flex
		flex-direction: column
		align-items: stretch
		gap: var(--m3e-space-2)
		margin: 0 var(--m3e-space-3) var(--m3e-space-2)
		padding: var(--m3e-space-3)
		border-radius: var(--shape-corner-l)
		background: var(--surface-container)
		border: 1px solid unquote("color-mix(in oklab, var(--outline-variant) 55%, transparent)")

	&__header
		display: flex
		align-items: center
		justify-content: space-between
		gap: var(--m3e-space-2)
		padding-inline: var(--m3e-space-1)

	&__title
		font: var(--m3e-type-label-medium)
		color: var(--on-surface-variant)

	&__host
		font-family: var(--font-mono)
		font-size: 0.75rem
		line-height: 1.25
		color: var(--primary)
		white-space: nowrap
		overflow: hidden
		text-overflow: ellipsis

	&__hint
		margin: 0
		padding-inline: var(--m3e-space-1)
		font-family: var(--font-sans)
		font-size: 0.75rem
		line-height: 1.33
		color: var(--on-surface-variant)

	/* 双瓣柔调果冻轨道：顶栏默认隐藏，>= bp-xl (1280px) 展开；抽屉全宽显示 */
	&__dual
		display: none
		align-items: center
		gap: 3px
		height: 34px
		padding: 2px
		box-sizing: border-box
		border-radius: var(--shape-corner-full)
		background: unquote("color-mix(in oklab, var(--surface-container) 78%, transparent)")
		border: 1px solid unquote("color-mix(in oklab, var(--outline-variant) 60%, transparent)")
		user-select: none
		transition:
			background-color var(--m3e-duration-medium) var(--m3e-easing-standard),
			border-color var(--m3e-duration-medium) var(--m3e-easing-standard)

		@media (min-width: bp-xl)
			display: inline-flex

		&--drawer
			display: grid
			grid-template-columns: repeat(2, minmax(0, 1fr))
			width: 100%
			height: 44px
			padding: 3px
			gap: 4px
			background: var(--surface-container-low)

	/* 双瓣分项：半高 14px（抽屉版 18px），精确半边长过渡保证圆润无尖角 */
	&__seg
		position: relative
		display: inline-flex
		align-items: center
		justify-content: center
		gap: var(--m3e-space-1)
		height: 100%
		padding: 0 11px
		box-sizing: border-box
		border: 1px solid transparent
		background: transparent
		color: var(--on-surface-variant)
		font: var(--m3e-type-label-medium)
		font-weight: 600
		text-decoration: none
		white-space: nowrap
		cursor: pointer
		--m3e-state-color: var(--on-surface)
		transition:
			border-radius var(--m3e-duration-medium) var(--m3e-easing-standard),
			background-color var(--m3e-duration-short) var(--m3e-easing-standard),
			color var(--m3e-duration-short) var(--m3e-easing-standard),
			border-color var(--m3e-duration-short) var(--m3e-easing-standard),
			transform var(--m3e-duration-short) var(--m3e-easing-standard)

		&--start
			border-radius: 14px 7px 7px 14px

		&--middle
			border-radius: 7px

		&--end
			border-radius: 7px 14px 14px 7px

		&:hover:not(.region-switch__seg--active)
			color: var(--on-surface)

		&:hover:not(.region-switch__seg--active) .region-switch__icon
			transform: scale(1.1) rotate(-8deg)

		&:active:not(.region-switch__seg--active)
			border-radius: 9px
			transform: scale(0.97)

		&--active
			border-radius: 14px
			background: var(--primary-container)
			color: var(--on-primary-container)
			border-color: unquote("color-mix(in oklab, var(--primary) 26%, transparent)")
			cursor: default

	&__dual--drawer .region-switch__seg
		font: var(--m3e-type-label-large)
		padding: 0 var(--m3e-space-3)

	&__dual--drawer .region-switch__seg--start
		border-radius: 18px 8px 8px 18px

	&__dual--drawer .region-switch__seg--end
		border-radius: 8px 18px 18px 8px

	&__dual--drawer .region-switch__seg--active
		border-radius: 18px

	&__dual--drawer .region-switch__seg:active:not(.region-switch__seg--active)
		border-radius: 11px

	&__icon
		display: inline-flex
		align-items: center
		justify-content: center
		flex: none
		transition: transform var(--m3e-duration-short) var(--m3e-easing-standard)

		> :global(svg)
			width: 0.95rem
			height: 0.95rem

	&__dual--drawer .region-switch__icon > :global(svg)
		width: 1.05rem
		height: 1.05rem

	&__label
		line-height: 1

	/* 窄屏紧凑单按钮（< bp-xl 显示）：40×40 与右侧图标钮严格齐平。
	   圆角在精确半边长 14px ↔ 20px 间按 M3E standard 单调平滑形变，绝无尖角或跳帧。 */
	&__compact
		position: relative
		display: inline-flex
		align-items: center
		justify-content: center
		width: 40px
		height: 40px
		box-sizing: border-box
		border-radius: 14px
		border: 1px solid unquote("color-mix(in oklab, var(--primary) 24%, transparent)")
		background: var(--primary-container)
		color: var(--on-primary-container)
		text-decoration: none
		cursor: pointer
		flex-shrink: 0
		--m3e-state-color: var(--on-primary-container)
		transition:
			border-radius var(--m3e-duration-medium) var(--m3e-easing-standard),
			background-color var(--m3e-duration-short) var(--m3e-easing-standard),
			border-color var(--m3e-duration-short) var(--m3e-easing-standard),
			color var(--m3e-duration-short) var(--m3e-easing-standard),
			transform var(--m3e-duration-short) var(--m3e-easing-standard)

		@media (min-width: bp-xl)
			display: none

		&:hover
			border-radius: 20px

		&:hover .region-switch__compact-icon
			transform: scale(1.08)

		&:active
			border-radius: 11px
			transform: scale(0.96)

	&__compact-icon
		display: inline-flex
		align-items: center
		justify-content: center
		transition: transform var(--m3e-duration-short) var(--m3e-easing-standard)

		> :global(svg)
			width: 1.15rem
			height: 1.15rem

	&__compact-badge
		position: absolute
		right: -2px
		bottom: -2px
		height: 15px
		padding: 0 4px
		border-radius: var(--shape-corner-full)
		background: var(--primary)
		color: var(--on-primary)
		font-family: var(--font-sans)
		font-size: 10px
		font-weight: 700
		line-height: 15px
		letter-spacing: 0.02em
		box-shadow: 0 0 0 2px var(--surface-container)
		pointer-events: none
		transition:
			background-color var(--m3e-duration-short) var(--m3e-easing-standard),
			color var(--m3e-duration-short) var(--m3e-easing-standard),
			box-shadow var(--m3e-duration-short) var(--m3e-easing-standard)

/* Banner 透明顶栏覆盖层例外：保证亮/暗壁纸上的高可读性（固定白/暗玻璃 + on-primary-fixed 深主题字） */
:global(.top-app-bar--transparent) .region-switch__dual
	background: rgba(18, 13, 28, 0.24)
	border-color: rgba(255, 255, 255, 0.32)
	backdrop-filter: blur(12px)
	-webkit-backdrop-filter: blur(12px)

:global(.top-app-bar--transparent) .region-switch__seg
	color: rgba(255, 255, 255, 0.92)
	text-shadow: 0 1px 2px rgba(0, 0, 0, 0.22)
	--m3e-state-color: #ffffff

:global(.top-app-bar--transparent) .region-switch__seg:hover:not(.region-switch__seg--active)
	color: #ffffff

:global(.top-app-bar--transparent) .region-switch__seg--active
	background: rgba(255, 255, 255, 0.94)
	color: var(--on-primary-fixed)
	border-color: rgba(255, 255, 255, 0.96)
	text-shadow: none

:global(.top-app-bar--transparent) .region-switch__compact
	background: rgba(18, 13, 28, 0.26)
	border-color: rgba(255, 255, 255, 0.42)
	backdrop-filter: blur(12px)
	-webkit-backdrop-filter: blur(12px)
	color: #ffffff
	--m3e-state-color: #ffffff

:global(.top-app-bar--transparent) .region-switch__compact-badge
	background: rgba(255, 255, 255, 0.96)
	color: var(--on-primary-fixed)
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.24)

@media (prefers-reduced-motion: reduce)
	.region-switch__seg,
	.region-switch__icon,
	.region-switch__compact,
	.region-switch__compact-icon,
	.region-switch__compact-badge
		transition: none

	.region-switch__seg:hover:not(.region-switch__seg--active) .region-switch__icon,
	.region-switch__seg:active:not(.region-switch__seg--active),
	.region-switch__compact:hover .region-switch__compact-icon,
	.region-switch__compact:active
		transform: none
</style>
