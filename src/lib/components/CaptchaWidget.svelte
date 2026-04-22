<script>
	import ImageGrid from "./ImageGrid.svelte";
	import LifeIndicators from "./LifeIndicators.svelte";
	import ResultScreen from "./ResultScreen.svelte";
	import HowToPlayModal from "./HowToPlayModal.svelte";
	import { TOTAL_LIVES, checkAnswer, buildShareString } from "$lib/utils/game.js";

	let { puzzles: initialPuzzles, date, onComplete } = $props();

	let puzzles = $state(initialPuzzles);
	let currentRoundIndex = $state(0);
	let livesRemaining = $state(TOTAL_LIVES);
	let selectedIndices = $state(new Set());
	let wrongIndices = $state(new Set());
	let phase = $state("playing"); // playing | wrong | round_passed | game_over | completed
	let roundResults = $state([]);
	let roundStartTime = $state(Date.now());
	let showHelp = $state(false);

	const totalRounds = $derived(puzzles.length);
	const puzzle = $derived(puzzles[currentRoundIndex]);
	const isDisabled = $derived(phase !== "playing");

	function splitPrompt(text) {
		const m = text.match(
			/^(Select all|Select the|Pick all|Pick the|Choose all|Choose the|Find all|Find the)\s+(.+)$/i
		);
		if (m) return { lead: m[1], main: m[2] };
		return { lead: "", main: text };
	}

	const prompt = $derived(splitPrompt(puzzle.prompt_text));

	function toggleImage(i) {
		if (phase !== "playing") return;
		const next = new Set(selectedIndices);
		if (next.has(i)) next.delete(i);
		else next.add(i);
		selectedIndices = next;
	}

	function handleVerify() {
		if (phase !== "playing") return;
		const { correct, wrongIndices: wrong } = checkAnswer(puzzle, selectedIndices);
		const timeMs = Date.now() - roundStartTime;

		if (correct) {
			roundResults = [
				...roundResults,
				{ puzzle_id: puzzle.id, passed: true, lives_lost: 0, time_ms: timeMs }
			];
			wrongIndices = new Set();
			phase = "round_passed";
		} else {
			const newLives = livesRemaining - 1;
			livesRemaining = newLives;
			wrongIndices = new Set(wrong);
			phase = newLives <= 0 ? "game_over" : "wrong";
		}
	}

	$effect(() => {
		if (phase === "wrong") {
			const t = setTimeout(() => {
				const next = new Set(selectedIndices);
				for (const i of wrongIndices) next.delete(i);
				selectedIndices = next;
				wrongIndices = new Set();
				phase = livesRemaining <= 0 ? "game_over" : "playing";
			}, 900);
			return () => clearTimeout(t);
		}
	});

	$effect(() => {
		if (phase === "game_over") {
			const timeMs = Date.now() - roundStartTime;
			const failResult = {
				puzzle_id: puzzle.id,
				passed: false,
				lives_lost: livesRemaining + 1,
				time_ms: timeMs
			};
			const allResults = [...roundResults, failResult];
			roundResults = allResults;
			const shareString = buildShareString(allResults, 0);
			onComplete?.(shareString, 0);
		}
	});

	function handleShuffle() {
		if (phase !== "playing") return;
		const current = puzzles[currentRoundIndex];
		const shuffled = [...current.images];
		for (let i = shuffled.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
		}
		puzzles = puzzles.map((p, i) =>
			i === currentRoundIndex ? { ...p, images: shuffled } : p
		);
		selectedIndices = new Set();
		wrongIndices = new Set();
	}

	function handleNextRound() {
		const isLast = currentRoundIndex >= totalRounds - 1;
		if (isLast) {
			const shareString = buildShareString(roundResults, livesRemaining);
			onComplete?.(shareString, livesRemaining);
			phase = "completed";
		} else {
			currentRoundIndex += 1;
			selectedIndices = new Set();
			wrongIndices = new Set();
			phase = "playing";
			roundStartTime = Date.now();
		}
	}
</script>

{#if phase === "completed" || phase === "game_over"}
	<ResultScreen {roundResults} {livesRemaining} {date} />
{:else}
	<div class="widget">
		<div class="header">
			<div class="meta">
				<span class="round-count">{currentRoundIndex + 1}/{totalRounds}</span>
				<LifeIndicators lives={livesRemaining} total={TOTAL_LIVES} />
			</div>
			{#if prompt.lead}
				<p class="lead">{prompt.lead}</p>
			{/if}
			<p class="main" class:long={prompt.main.length > 32}>{prompt.main}</p>
			<p class="sub">Click verify once there are none left.</p>
		</div>

		<ImageGrid
			images={puzzle.images}
			selected={selectedIndices}
			wrong={wrongIndices}
			onToggle={toggleImage}
			disabled={isDisabled}
		/>

		<div class="footer">
			<div class="icons">
				<button
					class="icon-btn"
					disabled={isDisabled}
					onclick={handleShuffle}
					aria-label="Shuffle images"
					title="Shuffle images"
				>
					<svg
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="M23 4v6h-6M1 20v-6h6" />
						<path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
					</svg>
				</button>
				<button
					class="icon-btn"
					onclick={() => (showHelp = true)}
					aria-label="How to play"
					title="How to play"
				>
					<svg
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<circle cx="12" cy="12" r="10" />
						<line x1="12" y1="16" x2="12" y2="12" />
						<line x1="12" y1="8" x2="12.01" y2="8" />
					</svg>
				</button>
			</div>

			{#if phase === "round_passed"}
				<button class="primary" onclick={handleNextRound}>
					{currentRoundIndex >= totalRounds - 1 ? "Results" : "Next →"}
				</button>
			{:else}
				<button class="primary" disabled={isDisabled} onclick={handleVerify}>
					Verify
				</button>
			{/if}
		</div>

		{#if phase === "round_passed"}
			<div class="pass-bar">
				<span>✓</span>
				<span>
					{currentRoundIndex >= totalRounds - 1
						? "All rounds complete!"
						: `Round ${currentRoundIndex + 1} passed! ${totalRounds - currentRoundIndex - 1} left.`}
				</span>
			</div>
		{/if}
	</div>
{/if}

{#if showHelp}
	<HowToPlayModal onClose={() => (showHelp = false)} />
{/if}

<style>
	.widget {
		width: 100%;
		max-width: 400px;
		margin: 0 auto;
		background: #fff;
		border-radius: 2px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
		overflow: hidden;
		font-family: Roboto, Arial, sans-serif;
		animation: scaleIn 0.25s ease-out;
	}

	.header {
		background: #4a90e2;
		color: #fff;
		padding: 16px 20px;
		position: relative;
	}
	.meta {
		position: absolute;
		top: 12px;
		right: 16px;
		display: flex;
		align-items: center;
		gap: 12px;
	}
	.round-count {
		font-size: 10px;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.7);
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}
	.lead {
		font-size: 14px;
		color: rgba(255, 255, 255, 0.95);
		margin: 0 0 4px;
		line-height: 1.2;
	}
	.main {
		font-size: 32px;
		font-weight: 800;
		letter-spacing: -0.02em;
		color: #fff;
		line-height: 1.05;
		margin: 0;
	}
	.main.long {
		font-size: 26px;
	}
	.sub {
		font-size: 12px;
		color: rgba(255, 255, 255, 0.85);
		margin: 10px 0 0;
	}

	.footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 10px 12px;
		border-top: 1px solid #e5e5e5;
		background: #f9f9f9;
	}
	.icons {
		display: flex;
		align-items: center;
		gap: 4px;
		color: #6b6b6b;
	}
	.icon-btn {
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 999px;
		background: none;
		border: 0;
		cursor: pointer;
		color: inherit;
		transition: all 0.15s;
	}
	.icon-btn:hover {
		background: rgba(0, 0, 0, 0.05);
		color: #333;
	}
	.icon-btn:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}
	.primary {
		background: #4a90e2;
		color: #fff;
		border: 0;
		padding: 8px 20px;
		font-size: 13px;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		border-radius: 2px;
		cursor: pointer;
		transition: background 0.15s;
	}
	.primary:hover:not(:disabled) {
		background: #2c6ab5;
	}
	.primary:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.pass-bar {
		background: #f0fdf4;
		border-top: 1px solid #bbf7d0;
		padding: 8px 16px;
		font-size: 12px;
		color: #15803d;
		font-weight: 500;
		display: flex;
		align-items: center;
		gap: 8px;
		animation: fadeIn 0.3s ease-in-out;
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
	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
