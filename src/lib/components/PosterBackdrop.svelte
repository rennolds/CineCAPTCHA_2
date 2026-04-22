<script>
	import { getPosterPool } from "$lib/data/puzzlePool.js";

	const posters = getPosterPool(40);
	const TILES = 48;
	const tiles = Array.from({ length: TILES }, (_, i) =>
		posters.length ? posters[i % posters.length] : null
	);
</script>

{#if posters.length}
	<div class="wrap" aria-hidden="true">
		<div class="mosaic">
			{#each tiles as url, i}
				<div class="cell">
					<img src={url} alt="" />
				</div>
			{/each}
		</div>
		<div class="vignette"></div>
	</div>
{/if}

<style>
	.wrap {
		position: absolute;
		inset: 0;
		overflow: hidden;
		pointer-events: none;
		z-index: 0;
	}
	.mosaic {
		position: absolute;
		inset: 0;
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 4px;
		opacity: 0.18;
		filter: blur(1px);
	}
	@media (min-width: 640px) {
		.mosaic {
			grid-template-columns: repeat(6, 1fr);
		}
	}
	@media (min-width: 768px) {
		.mosaic {
			grid-template-columns: repeat(8, 1fr);
		}
	}
	.cell {
		position: relative;
		aspect-ratio: 2 / 3;
	}
	.cell img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.vignette {
		position: absolute;
		inset: 0;
		background: radial-gradient(
			ellipse at center,
			rgba(26, 26, 46, 0.55) 0%,
			rgba(26, 26, 46, 0.85) 55%,
			rgba(26, 26, 46, 1) 100%
		);
	}
</style>
