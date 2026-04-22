import puzzles from "./puzzles.json";
import schedule from "./daily_schedule.json";

export function getTodaysPuzzles(date) {
	const ids = schedule[date] ?? [];
	return ids.map((id) => puzzles[id]).filter(Boolean);
}

export function getPuzzle(id) {
	return puzzles[id] ?? null;
}

export function getAllPuzzles() {
	return Object.values(puzzles);
}

export function getPosterPool(limit = 40) {
	const seen = new Set();
	const urls = [];
	for (const p of Object.values(puzzles)) {
		for (const img of p.images ?? []) {
			if (img.url && !seen.has(img.url)) {
				seen.add(img.url);
				urls.push(img.url);
				if (urls.length >= limit) return urls;
			}
		}
	}
	return urls;
}
