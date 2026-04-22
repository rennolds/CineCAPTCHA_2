<script>
	import { onMount } from "svelte";
	import CaptchaWidget from "./CaptchaWidget.svelte";
	import ResultScreen from "./ResultScreen.svelte";
	import { getCompletedDate, markDateCompleted } from "$lib/utils/session.js";
	import { TOTAL_LIVES } from "$lib/utils/game.js";

	let { puzzles, date } = $props();

	let mounted = $state(false);
	let alreadyCompleted = $state(null);

	onMount(() => {
		mounted = true;
		const existing = getCompletedDate(date);
		if (existing) alreadyCompleted = existing;
	});

	function handleComplete(shareString, _livesRemaining) {
		markDateCompleted(date, shareString);
		alreadyCompleted = shareString;
	}

	function parseShareToResults(share) {
		return Array.from(share)
			.filter((e) => ["🟩", "🟧", "💀"].includes(e))
			.map((e) => ({
				puzzle_id: "",
				passed: e !== "💀",
				lives_lost: e === "🟧" ? 1 : 0,
				time_ms: 0
			}));
	}
</script>

{#if !mounted}
	<div class="skeleton" aria-hidden="true"></div>
{:else if alreadyCompleted}
	{@const results = parseShareToResults(alreadyCompleted)}
	{@const livesLost = results.reduce((sum, r) => sum + r.lives_lost + (r.passed ? 0 : 1), 0)}
	<ResultScreen
		roundResults={results}
		livesRemaining={Math.max(0, TOTAL_LIVES - livesLost)}
		{date}
	/>
{:else}
	<CaptchaWidget {puzzles} {date} onComplete={handleComplete} />
{/if}

<style>
	.skeleton {
		width: 100%;
		max-width: 400px;
		margin: 0 auto;
		background: #fff;
		border-radius: 2px;
		box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
		height: 480px;
		animation: pulse 2s infinite;
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
</style>
