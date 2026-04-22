<script>
	import { categoryLabel, categoryColor } from "$lib/utils/category.js";

	let { puzzle } = $props();
	const preview = puzzle.images.slice(0, 4);
</script>

<a class="card" href={`/play/${puzzle.id}`}>
	<div class="preview">
		{#each preview as img}
			<div class="cell">
				<img src={img.url} alt={img.label} loading="lazy" />
			</div>
		{/each}
	</div>
	<div class="meta">
		<div class="row">
			<p class="title">{puzzle.prompt_text}</p>
			<span class="tag" style="background:{categoryColor(puzzle.category)}">
				{categoryLabel(puzzle.category)}
			</span>
		</div>
		<div class="stats">
			<span>▶ 0</span>
			<span>👍 0</span>
			<span class="stars">
				{"★".repeat(puzzle.difficulty)}{"☆".repeat(3 - puzzle.difficulty)}
			</span>
		</div>
	</div>
</a>

<style>
	.card {
		background: #fff;
		border-radius: 2px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
		overflow: hidden;
		display: block;
		transition: box-shadow 0.15s;
	}
	.card:hover {
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
	}
	.preview {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 2px;
		background: #d3d3d3;
		padding: 2px;
	}
	.cell {
		aspect-ratio: 1;
		overflow: hidden;
	}
	.cell img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.15s;
	}
	.card:hover .cell img {
		transform: scale(1.02);
	}
	.meta {
		padding: 12px;
	}
	.row {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 8px;
		margin-bottom: 8px;
	}
	.title {
		font-size: 13px;
		font-weight: 600;
		color: #222;
		line-height: 1.25;
		margin: 0;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
	.tag {
		flex-shrink: 0;
		font-size: 10px;
		font-weight: 700;
		color: #fff;
		padding: 2px 8px;
		border-radius: 999px;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		white-space: nowrap;
	}
	.stats {
		display: flex;
		align-items: center;
		gap: 12px;
		font-size: 11px;
		color: #6b6b6b;
	}
	.stars {
		letter-spacing: 1px;
	}
</style>
