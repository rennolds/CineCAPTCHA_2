<script>
	import { onMount, onDestroy } from "svelte";
	import { goto } from "$app/navigation";
	import { getCompletedDate } from "$lib/utils/session.js";
	import { getTodayString, getCountdownToMidnight } from "$lib/utils/game.js";

	let mounted = $state(false);
	let shareString = $state(null);
	let checking = $state(false);
	let checked = $state(false);
	let countdown = $state("");
	const today = getTodayString();
	let timer;

	onMount(() => {
		mounted = true;
		const s = getCompletedDate(today);
		if (s) {
			shareString = s;
			checked = true;
		}
		countdown = getCountdownToMidnight();
		timer = setInterval(() => (countdown = getCountdownToMidnight()), 1000);
	});

	onDestroy(() => clearInterval(timer));

	function handleClick() {
		if (shareString) return;
		if (checked || checking) return;
		checking = true;
		setTimeout(() => {
			checking = false;
			checked = true;
			setTimeout(() => goto("/daily"), 350);
		}, 600);
	}
</script>

{#if !mounted}
	<div class="skeleton" aria-hidden="true"></div>
{:else}
	{@const alreadyPlayed = !!shareString}
	<div class="wrap">
		<div class="box">
			<button
				class="checkbox"
				class:checked={checked || alreadyPlayed}
				class:already={alreadyPlayed}
				disabled={alreadyPlayed || checking}
				onclick={handleClick}
				aria-label="I'm not a robot"
			>
				{#if checking}
					<span class="spinner"></span>
				{:else if checked || alreadyPlayed}
					<svg width="18" height="14" viewBox="0 0 18 14" fill="none" class="check-pop">
						<path
							d="M1 7L6 12L17 1"
							stroke="white"
							stroke-width="2.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				{/if}
			</button>

			<button
				class="label"
				disabled={alreadyPlayed || checking}
				onclick={handleClick}
			>
				<p class="title">{alreadyPlayed ? "You've verified today" : "I'm not a robot"}</p>
				{#if alreadyPlayed}
					<p class="share">{shareString}</p>
				{/if}
			</button>

			<div class="brand">
				<div class="brand-line">Cine</div>
				<div class="brand-line accent">CAPTCHA</div>
				<div class="brand-sub">Daily · Film</div>
			</div>
		</div>

		{#if alreadyPlayed}
			<div class="after">
				<p class="eyebrow">Next puzzle in</p>
				<p class="countdown">{countdown}</p>
				<button class="view-link" onclick={() => goto("/daily")}>View result card →</button>
			</div>
		{:else}
			<p class="hint">Click the checkbox to start today's puzzle.</p>
		{/if}
	</div>
{/if}

<style>
	.skeleton {
		width: 100%;
		max-width: 330px;
		margin: 0 auto;
		height: 76px;
		background: #f9f9f9;
		border: 1px solid #d3d3d3;
		border-radius: 2px;
		animation: pulse 2s infinite;
	}
	.wrap {
		width: 100%;
		max-width: 330px;
		margin: 0 auto;
	}
	.box {
		background: #f9f9f9;
		border: 1px solid #d3d3d3;
		border-radius: 2px;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
		padding: 12px;
		display: flex;
		align-items: center;
		gap: 12px;
	}
	.checkbox {
		position: relative;
		width: 28px;
		height: 28px;
		border-radius: 2px;
		border: 2px solid #c1c1c1;
		background: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		cursor: pointer;
		transition: all 0.2s;
	}
	.checkbox:hover:not(:disabled) {
		border-color: #4a90e2;
	}
	.checkbox.checked {
		background: #4a90e2;
		border-color: #4a90e2;
	}
	.checkbox.already {
		cursor: default;
	}
	.checkbox:focus {
		outline: none;
		box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.5);
	}
	.spinner {
		width: 20px;
		height: 20px;
		border: 2px solid #4a90e2;
		border-top-color: transparent;
		border-radius: 999px;
		animation: spin 0.7s linear infinite;
	}
	.check-pop {
		animation: checkPop 0.2s ease-out;
	}

	.label {
		flex: 1;
		background: none;
		border: 0;
		text-align: left;
		cursor: pointer;
		user-select: none;
	}
	.label:disabled {
		cursor: default;
	}
	.title {
		font-size: 15px;
		color: #222;
		margin: 0;
	}
	.share {
		font-size: 18px;
		letter-spacing: 0.15em;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		margin: 4px 0 0;
	}
	.brand {
		flex-shrink: 0;
		padding-left: 8px;
		margin-left: 4px;
		border-left: 1px solid #e0e0e0;
		width: 58px;
		text-align: center;
	}
	.brand-line {
		font-size: 10px;
		font-weight: 700;
		color: #6b6b6b;
		line-height: 1.2;
	}
	.brand-line.accent {
		color: #4a90e2;
	}
	.brand-sub {
		font-size: 8px;
		color: #999;
		margin-top: 2px;
	}

	.after {
		margin-top: 16px;
		text-align: center;
	}
	.eyebrow {
		font-size: 11px;
		color: #888;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		margin: 0;
	}
	.countdown {
		font-size: 22px;
		font-weight: 700;
		color: #fff;
		font-variant-numeric: tabular-nums;
		margin: 2px 0 0;
	}
	.view-link {
		margin-top: 12px;
		background: none;
		border: 0;
		color: #4a90e2;
		font-size: 12px;
		cursor: pointer;
	}
	.view-link:hover {
		text-decoration: underline;
	}
	.hint {
		margin: 12px 0 0;
		font-size: 12px;
		color: #888;
		text-align: center;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
	@keyframes checkPop {
		0% {
			transform: scale(0);
		}
		70% {
			transform: scale(1.2);
		}
		100% {
			transform: scale(1);
		}
	}
</style>
