<script>
	import { page } from "$app/state";
	import CaptchaWidget from "$lib/components/CaptchaWidget.svelte";
	import { getPuzzle } from "$lib/data/puzzlePool.js";
	import { getTodayString } from "$lib/utils/game.js";

	const id = $derived(page.params.id);
	const puzzle = $derived(getPuzzle(id));

	let completed = $state(false);
	let feedback = $state(null);

	function handleVote(v) {
		if (feedback) return;
		feedback = v;
	}
</script>

<main class="page">
	{#if !puzzle}
		<div class="not-found">
			Puzzle not found. <a href="/play">← Gallery</a>
		</div>
	{:else}
		<div class="back-wrap">
			<a class="back" href="/play">← Gallery</a>
		</div>

		<CaptchaWidget
			puzzles={[puzzle]}
			date={getTodayString()}
			onComplete={() => (completed = true)}
		/>

		{#if completed && !feedback}
			<div class="rate">
				<span>Rate this puzzle:</span>
				<button onclick={() => handleVote("up")} aria-label="Thumbs up">👍</button>
				<button onclick={() => handleVote("down")} aria-label="Thumbs down">👎</button>
			</div>
		{:else if feedback}
			<p class="thanks">Thanks for your feedback!</p>
		{/if}
	{/if}
</main>

<style>
	.page {
		min-height: 100vh;
		background: #1a1a2e;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 48px 16px;
	}
	.back-wrap {
		width: 100%;
		max-width: 400px;
		margin-bottom: 16px;
	}
	.back {
		color: #4a90e2;
		font-size: 12px;
	}
	.back:hover {
		text-decoration: underline;
	}
	.not-found {
		color: #fff;
		font-size: 14px;
	}
	.not-found a {
		color: #4a90e2;
		margin-left: 8px;
	}
	.rate {
		margin-top: 20px;
		display: flex;
		align-items: center;
		gap: 12px;
		font-size: 13px;
		color: #bbb;
	}
	.rate button {
		background: none;
		border: 0;
		font-size: 20px;
		cursor: pointer;
		transition: transform 0.15s;
	}
	.rate button:hover {
		transform: scale(1.1);
	}
	.thanks {
		margin-top: 16px;
		font-size: 13px;
		color: #888;
	}
</style>
