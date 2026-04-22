<script>
	let { onClose } = $props();

	function handleKey(e) {
		if (e.key === "Escape") onClose();
	}
</script>

<svelte:window onkeydown={handleKey} />

<div class="backdrop" onclick={onClose} role="presentation">
	<div class="modal" onclick={(e) => e.stopPropagation()} role="dialog">
		<div class="head">
			<h3>How to Play</h3>
			<button class="close" onclick={onClose} aria-label="Close">×</button>
		</div>
		<div class="body">
			<p>
				<strong>CineCAPTCHA</strong> is a daily movie trivia game disguised as a reCAPTCHA. Prove
				you're a film buff (not a robot) across 5 rounds.
			</p>
			<div class="block">
				<p class="lead">Each round:</p>
				<ul>
					<li>Read the prompt (e.g. "Select all Christopher Nolan films").</li>
					<li>Click every image in the 3×3 grid that matches. Ignore the rest.</li>
					<li>Hit <strong>Verify</strong> when ready.</li>
				</ul>
			</div>
			<div class="block">
				<p class="lead">Lives:</p>
				<p>
					You start with <strong>5 lives</strong> shared across all 5 rounds. Each wrong click
					costs 1 life. Run out and the game ends.
				</p>
			</div>
			<div class="block">
				<p class="lead">Scoring:</p>
				<div class="scoring">
					<p><span class="emoji">🟩</span> Round passed with no mistakes</p>
					<p><span class="emoji">🟧</span> Round passed but lost lives</p>
					<p><span class="emoji">💀</span> Round failed</p>
				</div>
			</div>
			<p class="footer">One puzzle per day · Come back tomorrow for a new one.</p>
		</div>
		<div class="foot">
			<button class="got-it" onclick={onClose}>Got it</button>
		</div>
	</div>
</div>

<style>
	.backdrop {
		position: fixed;
		inset: 0;
		z-index: 50;
		background: rgba(0, 0, 0, 0.6);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 16px;
		animation: fadeIn 0.2s ease-out;
	}
	.modal {
		width: 100%;
		max-width: 420px;
		background: #fff;
		border-radius: 2px;
		box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
		font-family: Roboto, Arial, sans-serif;
		animation: scaleIn 0.2s ease-out;
	}
	.head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 12px 20px;
		border-bottom: 1px solid #eee;
	}
	.head h3 {
		font-size: 15px;
		font-weight: 700;
		color: #222;
		margin: 0;
	}
	.close {
		background: none;
		border: 0;
		color: #888;
		font-size: 20px;
		line-height: 1;
		cursor: pointer;
	}
	.close:hover {
		color: #222;
	}
	.body {
		padding: 16px 20px;
		font-size: 13px;
		color: #444;
		line-height: 1.55;
	}
	.body p {
		margin: 0 0 12px;
	}
	.block {
		margin-bottom: 12px;
	}
	.lead {
		font-weight: 600;
		color: #222;
		margin-bottom: 4px !important;
	}
	.body ul {
		margin: 0;
		padding-left: 20px;
	}
	.body ul li {
		margin-bottom: 4px;
	}
	.scoring p {
		margin: 2px 0;
	}
	.emoji {
		display: inline-block;
		width: 16px;
	}
	.footer {
		font-size: 12px;
		color: #888;
		padding-top: 8px;
		margin-top: 8px;
		border-top: 1px solid #eee;
	}
	.foot {
		padding: 12px 20px;
		border-top: 1px solid #eee;
		background: #f9f9f9;
	}
	.got-it {
		width: 100%;
		background: #4a90e2;
		color: #fff;
		border: 0;
		padding: 8px 0;
		font-size: 13px;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		border-radius: 2px;
		cursor: pointer;
		transition: background 0.15s;
	}
	.got-it:hover {
		background: #2c6ab5;
	}
	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
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
</style>
