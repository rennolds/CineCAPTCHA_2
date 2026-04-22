<script>
	let { size = "sm", subtitle = "" } = $props();
</script>

<a href="/" class="logo {size}">
	<h1>Cine<span class="accent">CAPTCHA</span></h1>
	{#if subtitle}
		<p class="subtitle">{subtitle}</p>
	{/if}
</a>

<style>
	.logo {
		display: inline-block;
		text-align: center;
		transition: opacity 0.15s;
	}
	.logo:hover {
		opacity: 0.8;
	}
	h1 {
		font-weight: 700;
		color: #fff;
		letter-spacing: -0.02em;
		margin: 0;
	}
	.sm h1 {
		font-size: 22px;
	}
	.lg h1 {
		font-size: 32px;
	}
	.accent {
		color: #4a90e2;
	}
	.subtitle {
		font-size: 12px;
		color: #888;
		margin: 2px 0 0;
	}
</style>
