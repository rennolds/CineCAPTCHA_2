<script>
	let { lives, total } = $props();
</script>

<div class="row">
	{#each Array(total) as _, i}
		<span class="dot" class:on={i < lives}></span>
	{/each}
</div>

<style>
	.row {
		display: flex;
		align-items: center;
		gap: 6px;
	}
	.dot {
		width: 12px;
		height: 12px;
		border-radius: 999px;
		background: #d1d5db;
		transition: all 0.3s;
	}
	.dot.on {
		background: #ef4444;
		box-shadow: 0 0 4px rgba(239, 68, 68, 0.6);
	}
</style>
