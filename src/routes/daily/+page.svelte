<script>
	import Logo from "$lib/components/Logo.svelte";
	import DailyGame from "$lib/components/DailyGame.svelte";
	import { getTodaysPuzzles } from "$lib/data/puzzlePool.js";
	import { getTodayString, formatDate } from "$lib/utils/game.js";

	const today = getTodayString();
	const puzzles = getTodaysPuzzles(today);
	const dateLabel = formatDate(new Date(today + "T12:00:00"));
</script>

<main class="page">
	<div class="logo-wrap">
		<Logo size="lg" subtitle={dateLabel} />
	</div>

	{#if puzzles.length === 5}
		<DailyGame {puzzles} date={today} />
	{:else}
		<div class="empty">
			<p class="head">No puzzle scheduled for today.</p>
			<p class="sub">Check back tomorrow, or browse the gallery.</p>
			<a class="cta" href="/play">Browse Puzzles</a>
		</div>
	{/if}

	<nav class="nav">
		<a href="/">← Home</a>
		<a href="/play">Gallery</a>
		<a href="/create">Create</a>
	</nav>
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
	.logo-wrap {
		margin-bottom: 32px;
	}
	.empty {
		width: 100%;
		max-width: 400px;
		background: #fff;
		border-radius: 2px;
		box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
		padding: 24px;
		text-align: center;
	}
	.head {
		color: #555;
		font-size: 14px;
		font-weight: 500;
		margin: 0 0 8px;
	}
	.sub {
		font-size: 12px;
		color: #888;
		margin: 0;
	}
	.cta {
		display: inline-block;
		margin-top: 16px;
		background: #4a90e2;
		color: #fff;
		padding: 8px 20px;
		font-size: 13px;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		border-radius: 2px;
		transition: background 0.15s;
	}
	.cta:hover {
		background: #2c6ab5;
	}
	.nav {
		margin-top: 32px;
		display: flex;
		gap: 24px;
		font-size: 12px;
		color: #888;
	}
	.nav a:hover {
		color: #fff;
	}
</style>
