<script>
	import Logo from "$lib/components/Logo.svelte";
	import RobotCheckbox from "$lib/components/RobotCheckbox.svelte";
	import PosterBackdrop from "$lib/components/PosterBackdrop.svelte";
	import { getTodayString, formatDate, getPuzzleNumber } from "$lib/utils/game.js";

	const today = getTodayString();
	const puzzleNum = getPuzzleNumber(today);
	const dateLabel = formatDate(new Date(today + "T12:00:00"));
</script>

<main class="page">
	<PosterBackdrop />

	<div class="content">
		<div class="logo-wrap">
			<Logo size="lg" />
		</div>

		<div class="title">
			<p class="date">{dateLabel}</p>
			<p class="byline">
				No. {String(puzzleNum).padStart(3, "0")} · Edited by
				<span>Paul Pursifull</span>
			</p>
		</div>

		<p class="tagline">
			A daily movie trivia game disguised as a reCAPTCHA.
			<br />
			<span>Five rounds. Five lives. One shot per day.</span>
		</p>

		<RobotCheckbox />

		<nav class="nav">
			<a href="/play">Gallery</a>
			<a href="/create">Create</a>
		</nav>
	</div>
</main>

<style>
	.page {
		position: relative;
		min-height: 100vh;
		background: #1a1a2e;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 40px 16px 48px;
		overflow: hidden;
	}

	.content {
		position: relative;
		z-index: 10;
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
	}

	.logo-wrap {
		margin-bottom: 24px;
	}

	.title {
		text-align: center;
		margin-bottom: 32px;
	}
	.date {
		font-size: 22px;
		font-weight: 700;
		color: #fff;
		letter-spacing: -0.02em;
		margin: 0;
	}
	@media (min-width: 640px) {
		.date {
			font-size: 26px;
		}
	}
	.byline {
		font-size: 13px;
		color: #888;
		margin: 8px 0 0;
	}
	.byline span {
		color: #bbb;
		font-weight: 500;
	}

	.tagline {
		font-size: 13px;
		color: #bbb;
		max-width: 340px;
		text-align: center;
		line-height: 1.6;
		margin: 0 0 24px;
	}
	.tagline span {
		color: #888;
	}

	.nav {
		margin-top: 40px;
		display: flex;
		align-items: center;
		gap: 24px;
		font-size: 12px;
		color: #888;
	}
	.nav a {
		transition: color 0.15s;
	}
	.nav a:hover {
		color: #fff;
	}
</style>
