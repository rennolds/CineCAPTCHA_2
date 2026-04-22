export const TOTAL_LIVES = 5;
export const TOTAL_ROUNDS = 5;

export function buildShareString(results, livesRemaining) {
	if (livesRemaining <= 0) {
		return (
			results.map((r) => (r.passed ? (r.lives_lost > 0 ? "🟧" : "🟩") : "💀")).join("") + "💀"
		);
	}
	return results
		.map((r) => {
			if (!r.passed) return "💀";
			return r.lives_lost === 0 ? "🟩" : "🟧";
		})
		.join("");
}

export function checkAnswer(puzzle, selectedIndices) {
	const correctIndices = new Set(
		puzzle.images.map((img, i) => (img.is_correct ? i : -1)).filter((i) => i >= 0)
	);

	const wrongIndices = [];
	let allCorrect = true;

	for (const idx of selectedIndices) {
		if (!correctIndices.has(idx)) {
			wrongIndices.push(idx);
			allCorrect = false;
		}
	}

	for (const idx of correctIndices) {
		if (!selectedIndices.has(idx)) allCorrect = false;
	}

	return { correct: allCorrect, wrongIndices };
}

export function formatDate(date) {
	return date.toLocaleDateString("en-US", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric"
	});
}

export function getTodayString() {
	return new Date().toISOString().split("T")[0];
}

const LAUNCH_DATE = "2026-04-21";

export function getPuzzleNumber(dateStr = getTodayString()) {
	const launch = new Date(LAUNCH_DATE + "T00:00:00Z");
	const today = new Date(dateStr + "T00:00:00Z");
	const days = Math.floor((today.getTime() - launch.getTime()) / 86400000);
	return Math.max(1, days + 1);
}

export function getCountdownToMidnight() {
	const now = new Date();
	const midnight = new Date(now);
	midnight.setHours(24, 0, 0, 0);
	const diff = midnight.getTime() - now.getTime();
	const h = Math.floor(diff / 3600000);
	const m = Math.floor((diff % 3600000) / 60000);
	const s = Math.floor((diff % 60000) / 1000);
	return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
