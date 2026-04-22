// Game state using Svelte 5 runes.
// Tracks the active round, lives shared across rounds, and results per round.

function createGameStore() {
	let round = $state(1);
	let lives = $state(5);
	let results = $state([]); // e.g. 'clean' | 'lives-lost' | 'failed'
	let selections = $state(new Set());

	return {
		get round() {
			return round;
		},
		get lives() {
			return lives;
		},
		get results() {
			return results;
		},
		get selections() {
			return selections;
		},
		toggleSelection(id) {
			const next = new Set(selections);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			selections = next;
		},
		loseLife() {
			lives = Math.max(0, lives - 1);
		},
		completeRound(outcome) {
			results = [...results, outcome];
			round += 1;
			selections = new Set();
		},
		reset() {
			round = 1;
			lives = 5;
			results = [];
			selections = new Set();
		}
	};
}

export const game = createGameStore();
