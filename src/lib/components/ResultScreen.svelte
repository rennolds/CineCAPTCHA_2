<script>
	import {
		TOTAL_LIVES,
		buildShareString,
		formatDate,
		getCountdownToMidnight
	} from "$lib/utils/game.js";
	import { onMount, onDestroy } from "svelte";

	let { roundResults, livesRemaining, date } = $props();

	let copied = $state(false);
	let countdown = $state(getCountdownToMidnight());
	let timer;

	onMount(() => {
		timer = setInterval(() => (countdown = getCountdownToMidnight()), 1000);
	});
	onDestroy(() => clearInterval(timer));

	const shareString = $derived(buildShareString(roundResults, livesRemaining));
	const passed = $derived(livesRemaining > 0);

	function shortDate(d) {
		return new Date(d).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric"
		});
	}

	function emoji(r) {
		if (!r.passed) return "💀";
		if (r.lives_lost === 0) return "🟩";
		return "🟧";
	}

	async function handleCopy() {
		const text = [
			`CineCAPTCHA — ${shortDate(date)}`,
			shareString,
			`❤️ ${livesRemaining}/${TOTAL_LIVES} lives`,
			"cinecaptcha.com"
		].join("\n");
		await navigator.clipboard.writeText(text);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}
</script>

<div class="card">
	<div class="head">
		<p class="eyebrow">CineCAPTCHA</p>
		<h2>{passed ? "🎬 You passed!" : "🎬 Game Over"}</h2>
		<p class="date">{formatDate(new Date(date + "T12:00:00"))}</p>
	</div>

	<div class="body">
		<div class="rounds">
			{#each roundResults as r, i}
				<div class="round">
					<span class="emoji">{emoji(r)}</span>
					<span class="num">{i + 1}</span>
				</div>
			{/each}
		</div>

		<div class="lives">
			Lives remaining:
			<strong>{livesRemaining}/{TOTAL_LIVES}</strong>
		</div>
		{#if passed}
			<div class="praise">
				{livesRemaining === TOTAL_LIVES ? "Perfect score — no lives lost!" : "Well played!"}
			</div>
		{/if}

		<div class="share">
			<div class="share-head">
				CineCAPTCHA · {shortDate(date)}
			</div>
			<div class="share-emojis">{shareString}</div>
			<div class="share-lives">❤️ {livesRemaining}/{TOTAL_LIVES} lives</div>
		</div>

		<button class="btn" onclick={handleCopy}>
			{copied ? "✓ Copied!" : "Copy Result"}
		</button>
	</div>

	<div class="foot">
		<div>
			<p class="eyebrow muted">Next puzzle in</p>
			<p class="countdown">{countdown}</p>
		</div>
		<a class="link" href="/play">Play more →</a>
	</div>
</div>

<style>
	.card {
		width: 100%;
		max-width: 400px;
		margin: 0 auto;
		background: #fff;
		border-radius: 2px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
		overflow: hidden;
		animation: scaleIn 0.25s ease-out;
	}
	.head {
		padding: 16px 20px 12px;
		border-bottom: 1px solid #d3d3d3;
		text-align: center;
	}
	.eyebrow {
		font-size: 11px;
		font-weight: 600;
		color: #4a90e2;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		margin: 0 0 4px;
	}
	.eyebrow.muted {
		color: #6b6b6b;
		letter-spacing: 0.08em;
	}
	.head h2 {
		font-size: 18px;
		font-weight: 700;
		color: #222;
		margin: 0;
	}
	.date {
		font-size: 12px;
		color: #6b6b6b;
		margin: 2px 0 0;
	}
	.body {
		padding: 16px 20px;
	}
	.rounds {
		display: flex;
		justify-content: center;
		gap: 8px;
		margin-bottom: 16px;
	}
	.round {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
	}
	.emoji {
		font-size: 30px;
		line-height: 1;
	}
	.num {
		font-size: 10px;
		color: #6b6b6b;
	}
	.lives {
		text-align: center;
		font-size: 13px;
		color: #555;
	}
	.lives strong {
		color: #222;
	}
	.praise {
		text-align: center;
		font-size: 13px;
		color: #16a34a;
		font-weight: 500;
		margin-top: 4px;
	}
	.share {
		background: #f5f5f5;
		border: 1px solid #e0e0e0;
		border-radius: 2px;
		padding: 12px;
		text-align: center;
		color: #333;
		margin: 16px 0 12px;
	}
	.share-head {
		font-size: 11px;
		font-weight: 600;
		color: #6b6b6b;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin-bottom: 4px;
	}
	.share-emojis {
		font-size: 24px;
		letter-spacing: 0.1em;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		margin: 8px 0;
	}
	.share-lives {
		font-size: 12px;
		color: #555;
	}
	.btn {
		width: 100%;
		background: #4a90e2;
		color: #fff;
		border: 0;
		padding: 10px 0;
		font-size: 13px;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		border-radius: 2px;
		cursor: pointer;
		transition: background 0.15s;
	}
	.btn:hover {
		background: #2c6ab5;
	}
	.foot {
		padding: 12px 20px;
		border-top: 1px solid #d3d3d3;
		background: #f9f9f9;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.countdown {
		font-size: 18px;
		font-weight: 700;
		color: #222;
		font-variant-numeric: tabular-nums;
		margin: 0;
	}
	.link {
		font-size: 12px;
		color: #4a90e2;
	}
	.link:hover {
		text-decoration: underline;
	}
	@keyframes scaleIn {
		from {
			transform: scale(0.95);
			opacity: 0;
		}
		to {
			transform: scale(1);
			opacity: 1;
		}
	}
</style>
