<script>
	let { images, selected, wrong, onToggle, disabled = false } = $props();
</script>

<div class="grid">
	{#each images as img, i}
		{@const isSelected = selected.has(i)}
		{@const isWrong = wrong.has(i)}
		<button
			class="tile"
			class:selected={isSelected}
			class:wrong={isWrong}
			{disabled}
			onclick={() => !disabled && onToggle(i)}
			aria-label={`${img.label}${isSelected ? " (selected)" : ""}`}
		>
			<img src={img.url} alt={img.label} loading="lazy" />
			{#if isSelected}
				<div class="overlay"></div>
				<div class="check">
					<svg width="12" height="10" viewBox="0 0 10 8" fill="none">
						<path
							d="M1 4L3.5 6.5L9 1"
							stroke="white"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</div>
			{/if}
			{#if isWrong}
				<div class="wrong-overlay"></div>
			{/if}
		</button>
	{/each}
</div>

<style>
	.grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 4px;
		background: #fff;
		padding: 4px;
	}
	.tile {
		position: relative;
		overflow: hidden;
		border: 0;
		padding: 0;
		background: #000;
		aspect-ratio: 1;
		cursor: pointer;
		transition: all 0.15s;
	}
	.tile:disabled {
		cursor: default;
	}
	.tile:focus {
		outline: none;
	}
	.tile img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.15s;
	}
	.tile:not(:disabled):not(.selected):hover img {
		transform: scale(1.04);
	}
	.tile.selected {
		box-shadow: inset 0 0 0 4px #4a90e2;
	}
	.overlay {
		position: absolute;
		inset: 0;
		background: rgba(74, 144, 226, 0.45);
		pointer-events: none;
	}
	.check {
		position: absolute;
		bottom: 6px;
		right: 6px;
		width: 24px;
		height: 24px;
		border-radius: 999px;
		background: #4a90e2;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
		outline: 2px solid #fff;
		z-index: 10;
	}
	.wrong-overlay {
		position: absolute;
		inset: 0;
		background: rgba(239, 68, 68, 0.5);
		pointer-events: none;
		z-index: 20;
		animation: flashRed 0.6s ease-in-out;
	}
	.tile.wrong {
		animation: flashRed 0.6s ease-in-out;
	}
	@keyframes flashRed {
		0%,
		100% {
			box-shadow: inset 0 0 0 0 rgba(239, 68, 68, 0);
		}
		30% {
			box-shadow: inset 0 0 0 200px rgba(239, 68, 68, 0.55);
		}
		60% {
			box-shadow: inset 0 0 0 200px rgba(239, 68, 68, 0.3);
		}
	}
</style>
