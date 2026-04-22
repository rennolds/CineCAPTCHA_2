export function categoryLabel(cat) {
	const map = {
		director: "Director",
		actor: "Actor",
		genre: "Genre",
		award: "Award",
		character: "Character"
	};
	return map[cat] ?? cat;
}

export function categoryColor(cat) {
	const map = {
		director: "#9333ea",
		actor: "#2563eb",
		genre: "#16a34a",
		award: "#ca8a04",
		character: "#dc2626"
	};
	return map[cat] ?? "#4b5563";
}
