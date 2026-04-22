<script>
	import Logo from "$lib/components/Logo.svelte";
	import { categoryLabel } from "$lib/utils/category.js";

	const CATEGORIES = ["director", "actor", "genre", "award", "character"];

	function emptySlot() {
		return { url: "", label: "", is_correct: false };
	}

	let promptText = $state("");
	let category = $state("director");
	let difficulty = $state(2);
	let slots = $state(Array.from({ length: 9 }, emptySlot));
	let copied = $state(false);
	let error = $state("");

	function updateSlot(i, key, value) {
		slots[i] = { ...slots[i], [key]: value };
	}

	function slugify(s) {
		return s
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/(^-|-$)/g, "")
			.slice(0, 40) || "puzzle";
	}

	const derivedId = $derived(slugify(promptText));

	const puzzleJson = $derived({
		[derivedId]: {
			id: derivedId,
			prompt_text: promptText.trim(),
			category,
			difficulty,
			images: slots.map((s) => ({
				url: s.url.trim(),
				label: s.label.trim(),
				is_correct: s.is_correct
			}))
		}
	});

	function validate() {
		const images = puzzleJson[derivedId].images;
		const filledCount = images.filter((img) => img.url).length;
		if (!promptText.trim()) return "Please enter a prompt.";
		if (filledCount !== 9) return "All 9 image slots must have a URL.";
		if (images.filter((img) => img.is_correct).length < 1)
			return "At least 1 image must be marked as correct.";
		return "";
	}

	async function handleCopy() {
		const err = validate();
		if (err) {
			error = err;
			return;
		}
		error = "";
		const text = JSON.stringify(puzzleJson, null, 2);
		await navigator.clipboard.writeText(text);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}

	function handleReset() {
		promptText = "";
		category = "director";
		difficulty = 2;
		slots = Array.from({ length: 9 }, emptySlot);
		error = "";
	}
</script>

<main class="page">
	<div class="inner">
		<div class="head">
			<Logo />
			<h2>Create a Puzzle</h2>
			<p class="sub">
				Build a 3×3 movie image puzzle. When you're ready, copy the JSON and paste it into
				<code>src/lib/data/puzzles.json</code>.
				<a href="/play">← Gallery</a>
			</p>
		</div>

		<div class="card">
			<label class="label">Prompt Text *</label>
			<input
				class="input"
				type="text"
				bind:value={promptText}
				placeholder='e.g. "Select all movies directed by Christopher Nolan"'
				maxlength="200"
			/>

			<div class="row">
				<div class="col">
					<label class="label">Category *</label>
					<select class="input" bind:value={category}>
						{#each CATEGORIES as c}
							<option value={c}>{categoryLabel(c)}</option>
						{/each}
					</select>
				</div>
				<div class="col">
					<label class="label">Difficulty *</label>
					<div class="stars">
						{#each [1, 2, 3] as d}
							<button
								type="button"
								class="star"
								class:active={difficulty === d}
								onclick={() => (difficulty = d)}
							>
								{"★".repeat(d)}
							</button>
						{/each}
					</div>
				</div>
			</div>
		</div>

		<div class="card">
			<label class="label">Images (3×3 grid) *</label>
			<p class="hint">
				Paste image URLs and toggle each slot as Correct/Incorrect. Correct images are the ones
				that match your prompt.
			</p>

			<div class="slots">
				{#each slots as slot, i}
					<div class="slot" class:correct={slot.is_correct}>
						<div class="preview">
							{#if slot.url}
								<img src={slot.url} alt={slot.label || `Image ${i + 1}`} />
							{:else}
								<div class="placeholder">{i + 1}</div>
							{/if}
							{#if slot.is_correct}
								<div class="badge">
									<svg width="10" height="8" viewBox="0 0 10 8" fill="none">
										<path
											d="M1 4L3.5 6.5L9 1"
											stroke="white"
											stroke-width="1.8"
											stroke-linecap="round"
											stroke-linejoin="round"
										/>
									</svg>
								</div>
							{/if}
						</div>
						<div class="inputs">
							<input
								type="url"
								value={slot.url}
								oninput={(e) => updateSlot(i, "url", e.target.value)}
								placeholder="Image URL"
							/>
							<input
								type="text"
								value={slot.label}
								oninput={(e) => updateSlot(i, "label", e.target.value)}
								placeholder="Label (e.g. movie title)"
							/>
							<button
								type="button"
								class="toggle"
								class:on={slot.is_correct}
								onclick={() => updateSlot(i, "is_correct", !slot.is_correct)}
							>
								{slot.is_correct ? "✓ Correct" : "Incorrect"}
							</button>
						</div>
					</div>
				{/each}
			</div>

			<div class="live">
				<p class="label">Live Preview</p>
				<div class="live-wrap">
					<div class="live-prompt">
						{promptText || "Your prompt will appear here…"}
					</div>
					<div class="live-grid">
						{#each slots as slot, i}
							<div class="live-cell" class:correct={slot.is_correct}>
								{#if slot.url}
									<img src={slot.url} alt={slot.label} />
								{:else}
									<div class="live-placeholder">{i + 1}</div>
								{/if}
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>

		{#if error}
			<p class="error">{error}</p>
		{/if}

		<div class="actions">
			<a class="cancel" href="/play">Cancel</a>
			<button class="reset" type="button" onclick={handleReset}>Reset</button>
			<button class="submit" type="button" onclick={handleCopy}>
				{copied ? "✓ Copied JSON" : "Copy JSON"}
			</button>
		</div>
	</div>
</main>

<style>
	.page {
		min-height: 100vh;
		background: #1a1a2e;
		padding: 40px 16px;
	}
	.inner {
		max-width: 768px;
		margin: 0 auto;
	}
	.head {
		margin-bottom: 24px;
	}
	.head h2 {
		font-size: 15px;
		font-weight: 600;
		color: #bbb;
		margin: 8px 0 0;
	}
	.head .sub {
		font-size: 13px;
		color: #888;
		margin: 4px 0 0;
	}
	.head code {
		background: rgba(255, 255, 255, 0.08);
		padding: 1px 6px;
		border-radius: 2px;
		font-size: 12px;
	}
	.head a {
		color: #4a90e2;
		margin-left: 8px;
	}
	.head a:hover {
		text-decoration: underline;
	}

	.card {
		background: #fff;
		border-radius: 2px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
		padding: 16px;
		margin-bottom: 24px;
	}
	.label {
		display: block;
		font-size: 12px;
		font-weight: 600;
		color: #555;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin-bottom: 4px;
	}
	.hint {
		font-size: 12px;
		color: #888;
		margin: 0 0 16px;
	}
	.input {
		width: 100%;
		border: 1px solid #d3d3d3;
		border-radius: 2px;
		padding: 8px 12px;
		font-size: 14px;
		font-family: inherit;
		background: #fff;
	}
	.input:focus {
		outline: none;
		border-color: #4a90e2;
	}
	.row {
		display: flex;
		gap: 16px;
		margin-top: 16px;
	}
	.col {
		flex: 1;
	}
	.stars {
		display: flex;
		gap: 8px;
		padding-top: 4px;
	}
	.star {
		padding: 6px 12px;
		font-size: 13px;
		font-weight: 600;
		background: #fff;
		color: #555;
		border: 1px solid #d3d3d3;
		border-radius: 2px;
		cursor: pointer;
		transition: all 0.15s;
	}
	.star:hover {
		border-color: #4a90e2;
	}
	.star.active {
		background: #4a90e2;
		color: #fff;
		border-color: #4a90e2;
	}

	.slots {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 12px;
	}
	.slot {
		border: 2px solid #d3d3d3;
		border-radius: 2px;
		overflow: hidden;
		transition: border-color 0.15s;
	}
	.slot.correct {
		border-color: #4a90e2;
	}
	.preview {
		position: relative;
		aspect-ratio: 1;
		background: #f5f5f5;
	}
	.preview img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.placeholder {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #bbb;
		font-size: 11px;
	}
	.badge {
		position: absolute;
		top: 4px;
		right: 4px;
		width: 20px;
		height: 20px;
		border-radius: 999px;
		background: #4a90e2;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.inputs {
		padding: 8px;
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.inputs input {
		width: 100%;
		font-size: 11px;
		border: 1px solid #d3d3d3;
		border-radius: 2px;
		padding: 4px 8px;
		font-family: inherit;
	}
	.inputs input:focus {
		outline: none;
		border-color: #4a90e2;
	}
	.toggle {
		width: 100%;
		font-size: 11px;
		font-weight: 600;
		padding: 4px 0;
		border: 0;
		background: #f5f5f5;
		color: #555;
		border-radius: 2px;
		cursor: pointer;
		transition: background 0.15s;
	}
	.toggle:hover {
		background: #e0e0e0;
	}
	.toggle.on {
		background: #4a90e2;
		color: #fff;
	}

	.live {
		margin-top: 24px;
	}
	.live-wrap {
		max-width: 280px;
	}
	.live-prompt {
		background: #fff;
		border: 1px solid #d3d3d3;
		border-radius: 2px;
		font-size: 11px;
		padding: 8px;
		margin-bottom: 4px;
		color: #222;
	}
	.live-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 2px;
		background: #d3d3d3;
		padding: 2px;
	}
	.live-cell {
		position: relative;
		aspect-ratio: 1;
	}
	.live-cell.correct {
		box-shadow: inset 0 0 0 2px #4a90e2;
	}
	.live-cell img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.live-placeholder {
		position: absolute;
		inset: 0;
		background: #eee;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #bbb;
		font-size: 10px;
	}

	.error {
		color: #f87171;
		font-size: 13px;
		background: rgba(239, 68, 68, 0.1);
		border: 1px solid rgba(239, 68, 68, 0.2);
		border-radius: 2px;
		padding: 8px 12px;
		margin: 0 0 16px;
	}

	.actions {
		display: flex;
		gap: 12px;
	}
	.cancel,
	.reset {
		padding: 10px 20px;
		border: 1px solid rgba(255, 255, 255, 0.2);
		background: transparent;
		color: #bbb;
		font-size: 13px;
		border-radius: 2px;
		transition: background 0.15s;
		cursor: pointer;
		font-family: inherit;
	}
	.cancel:hover,
	.reset:hover {
		background: rgba(255, 255, 255, 0.05);
	}
	.submit {
		flex: 1;
		background: #4a90e2;
		color: #fff;
		font-size: 13px;
		font-weight: 600;
		padding: 10px 0;
		border: 0;
		border-radius: 2px;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		cursor: pointer;
		transition: background 0.15s;
		font-family: inherit;
	}
	.submit:hover {
		background: #2c6ab5;
	}
</style>
