<script>
	import { game } from "$lib/stores/game.svelte.js";
	import puzzles from "$lib/data/puzzles.json";
	import schedule from "$lib/data/daily_schedule.json";

	const today = new Date().toISOString().slice(0, 10);
	const todayIds = schedule[today] ?? [];
	const todayPuzzles = todayIds.map((id) => puzzles[id]).filter(Boolean);
	const current = todayPuzzles[game.round - 1];
</script>

<main class="shell">
	<h1>CineCAPTCHA</h1>
	<p class="status">
		Round {game.round} · Lives {game.lives}
	</p>

	{#if current}
		<p class="prompt">{current.prompt}</p>
		<div class="grid">
			{#each current.images as img, i}
				<button
					class="tile"
					class:selected={game.selections.has(i)}
					onclick={() => game.toggleSelection(i)}
				>
					<img src={img.url} alt={img.title} />
				</button>
			{/each}
		</div>
	{:else}
		<p>No puzzles scheduled for {today}.</p>
	{/if}
</main>

<style>
	.shell {
		max-width: 480px;
		margin: 2rem auto;
		padding: 1rem;
		text-align: center;
	}

	h1 {
		font-size: 2rem;
		margin-bottom: 0.25rem;
	}

	.status {
		color: #555;
		font-variant-numeric: tabular-nums;
	}

	.prompt {
		margin: 1.5rem 0 1rem;
		font-weight: 600;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 4px;
		background: #ddd;
		padding: 4px;
		border-radius: 6px;
	}

	.tile {
		padding: 0;
		border: 0;
		background: #fff;
		aspect-ratio: 2 / 3;
		overflow: hidden;
		position: relative;
	}

	.tile img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.tile.selected {
		outline: 3px solid #1a73e8;
		outline-offset: -3px;
	}
</style>
