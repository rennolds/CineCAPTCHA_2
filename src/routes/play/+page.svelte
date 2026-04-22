<script>
	import Logo from "$lib/components/Logo.svelte";
	import PuzzleCard from "$lib/components/PuzzleCard.svelte";
	import { getAllPuzzles } from "$lib/data/puzzlePool.js";

	const CATEGORIES = [
		{ value: "all", label: "All" },
		{ value: "director", label: "Director" },
		{ value: "actor", label: "Actor" },
		{ value: "genre", label: "Genre" },
		{ value: "award", label: "Award" },
		{ value: "character", label: "Character" }
	];

	const SORTS = [
		{ value: "play_count", label: "Most Played" },
		{ value: "rating", label: "Highest Rated" },
		{ value: "newest", label: "Newest" }
	];

	let category = $state("all");
	let sort = $state("play_count");

	const all = getAllPuzzles();

	const filtered = $derived(
		category === "all" ? all : all.filter((p) => p.category === category)
	);
</script>

<main class="page">
	<div class="inner">
		<div class="head">
			<div class="head-left">
				<Logo />
				<h2>Puzzle Gallery</h2>
			</div>
			<a class="cta" href="/create">+ Create Puzzle</a>
		</div>

		<div class="filters">
			<div class="chips">
				{#each CATEGORIES as cat}
					<button
						class="chip"
						class:active={category === cat.value}
						onclick={() => (category = cat.value)}
					>
						{cat.label}
					</button>
				{/each}
			</div>
			<select class="sort" bind:value={sort}>
				{#each SORTS as s}
					<option value={s.value}>{s.label}</option>
				{/each}
			</select>
		</div>

		{#if filtered.length === 0}
			<div class="empty">
				<p>No puzzles found.</p>
				<a href="/create">Be the first to create one →</a>
			</div>
		{:else}
			<div class="grid">
				{#each filtered as puzzle (puzzle.id)}
					<PuzzleCard {puzzle} />
				{/each}
			</div>
		{/if}

		<nav class="nav">
			<a href="/">← Home</a>
			<a href="/daily">Daily</a>
		</nav>
	</div>
</main>

<style>
	.page {
		min-height: 100vh;
		background: #1a1a2e;
		padding: 40px 16px;
	}
	.inner {
		max-width: 1024px;
		margin: 0 auto;
	}
	.head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 24px;
	}
	.head-left h2 {
		font-size: 15px;
		font-weight: 600;
		color: #bbb;
		margin: 8px 0 0;
	}
	.cta {
		background: #4a90e2;
		color: #fff;
		font-size: 13px;
		font-weight: 600;
		padding: 8px 16px;
		border-radius: 2px;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		transition: background 0.15s;
	}
	.cta:hover {
		background: #2c6ab5;
	}
	.filters {
		background: rgba(255, 255, 255, 0.05);
		border-radius: 2px;
		padding: 12px;
		margin-bottom: 24px;
		display: flex;
		flex-wrap: wrap;
		gap: 16px;
		align-items: center;
	}
	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}
	.chip {
		font-size: 12px;
		font-weight: 600;
		padding: 4px 12px;
		border-radius: 999px;
		border: 0;
		background: rgba(255, 255, 255, 0.1);
		color: #bbb;
		cursor: pointer;
		transition: all 0.15s;
	}
	.chip:hover {
		background: rgba(255, 255, 255, 0.2);
		color: #fff;
	}
	.chip.active {
		background: #4a90e2;
		color: #fff;
	}
	.sort {
		margin-left: auto;
		background: rgba(255, 255, 255, 0.1);
		color: #bbb;
		font-size: 12px;
		padding: 6px 12px;
		border-radius: 2px;
		border: 1px solid rgba(255, 255, 255, 0.1);
	}
	.sort:focus {
		outline: none;
		border-color: #4a90e2;
	}
	.grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 16px;
	}
	@media (min-width: 640px) {
		.grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}
	@media (min-width: 768px) {
		.grid {
			grid-template-columns: repeat(4, 1fr);
		}
	}
	.empty {
		text-align: center;
		padding: 80px 0;
		color: #888;
	}
	.empty p {
		font-size: 16px;
		font-weight: 500;
		margin: 0 0 8px;
	}
	.empty a {
		color: #4a90e2;
		font-size: 13px;
	}
	.empty a:hover {
		text-decoration: underline;
	}
	.nav {
		margin-top: 32px;
		display: flex;
		gap: 24px;
		font-size: 12px;
		color: #888;
		justify-content: center;
	}
	.nav a:hover {
		color: #fff;
	}
</style>
