// Generates src/lib/data/puzzles.json and daily_schedule.json
// by resolving TMDB poster URLs for each movie reference.
//
// Usage:
//   TMDB_API_KEY=... node scripts/seed.mjs

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

// Load .env.local if it exists.
const envPath = resolve(ROOT, ".env.local");
if (existsSync(envPath)) {
	for (const line of readFileSync(envPath, "utf8").split("\n")) {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith("#")) continue;
		const idx = trimmed.indexOf("=");
		if (idx === -1) continue;
		const key = trimmed.slice(0, idx).trim();
		const value = trimmed.slice(idx + 1).trim();
		if (!process.env[key]) process.env[key] = value;
	}
}

const tmdbKey = process.env.TMDB_API_KEY;
if (!tmdbKey) {
	console.error("Set TMDB_API_KEY in .env.local or the environment.");
	process.exit(1);
}

const T_IMG = "https://image.tmdb.org/t/p/w342";

async function resolvePoster(movie) {
	const params = new URLSearchParams({ api_key: tmdbKey, query: movie.title });
	if (movie.year) params.set("year", String(movie.year));
	const res = await fetch(`https://api.themoviedb.org/3/search/movie?${params}`);
	if (!res.ok) {
		console.warn(`  WARN TMDB ${res.status} for "${movie.title}"`);
		return { url: "", label: movie.title };
	}
	const json = await res.json();
	const hit = json.results.find((r) => r.poster_path) ?? json.results[0];
	if (!hit?.poster_path) {
		console.warn(`  WARN no poster for "${movie.title}"`);
		return { url: "", label: movie.title };
	}
	return { url: `${T_IMG}${hit.poster_path}`, label: movie.title };
}

const PUZZLES = [
	{
		id: "kubrick-directed",
		prompt_text: "Select all movies directed by Stanley Kubrick",
		category: "director",
		difficulty: 2,
		movies: [
			{ title: "The Shining", year: 1980, is_correct: true },
			{ title: "2001: A Space Odyssey", year: 1968, is_correct: true },
			{ title: "A Clockwork Orange", year: 1971, is_correct: true },
			{ title: "The Godfather", year: 1972, is_correct: false },
			{ title: "Full Metal Jacket", year: 1987, is_correct: true },
			{ title: "Pulp Fiction", year: 1994, is_correct: false },
			{ title: "Dr. Strangelove", year: 1964, is_correct: true },
			{ title: "Schindler's List", year: 1993, is_correct: false },
			{ title: "Barry Lyndon", year: 1975, is_correct: true }
		]
	},
	{
		id: "best-picture-winners",
		prompt_text: "Select all films that won the Oscar for Best Picture",
		category: "award",
		difficulty: 2,
		movies: [
			{ title: "The Godfather", year: 1972, is_correct: true },
			{ title: "Parasite", year: 2019, is_correct: true },
			{ title: "Pulp Fiction", year: 1994, is_correct: false },
			{ title: "No Country for Old Men", year: 2007, is_correct: true },
			{ title: "The Shining", year: 1980, is_correct: false },
			{ title: "CODA", year: 2021, is_correct: true },
			{ title: "Full Metal Jacket", year: 1987, is_correct: false },
			{ title: "Moonlight", year: 2016, is_correct: true },
			{ title: "2001: A Space Odyssey", year: 1968, is_correct: false }
		]
	},
	{
		id: "nolan-directed",
		prompt_text: "Select all movies directed by Christopher Nolan",
		category: "director",
		difficulty: 1,
		movies: [
			{ title: "Inception", year: 2010, is_correct: true },
			{ title: "The Dark Knight", year: 2008, is_correct: true },
			{ title: "Interstellar", year: 2014, is_correct: true },
			{ title: "Pulp Fiction", year: 1994, is_correct: false },
			{ title: "Oppenheimer", year: 2023, is_correct: true },
			{ title: "The Godfather", year: 1972, is_correct: false },
			{ title: "Memento", year: 2000, is_correct: true },
			{ title: "The Shining", year: 1980, is_correct: false },
			{ title: "Dunkirk", year: 2017, is_correct: true }
		]
	},
	{
		id: "sci-fi",
		prompt_text: "Select all Science Fiction films",
		category: "genre",
		difficulty: 1,
		movies: [
			{ title: "2001: A Space Odyssey", year: 1968, is_correct: true },
			{ title: "Inception", year: 2010, is_correct: true },
			{ title: "Blade Runner 2049", year: 2017, is_correct: true },
			{ title: "The Godfather", year: 1972, is_correct: false },
			{ title: "The Matrix", year: 1999, is_correct: true },
			{ title: "A Clockwork Orange", year: 1971, is_correct: false },
			{ title: "Arrival", year: 2016, is_correct: true },
			{ title: "Parasite", year: 2019, is_correct: false },
			{ title: "Interstellar", year: 2014, is_correct: true }
		]
	},
	{
		id: "streep-starring",
		prompt_text: "Select all movies starring Meryl Streep",
		category: "actor",
		difficulty: 2,
		movies: [
			{ title: "Kramer vs. Kramer", year: 1979, is_correct: true },
			{ title: "The Devil Wears Prada", year: 2006, is_correct: true },
			{ title: "A Clockwork Orange", year: 1971, is_correct: false },
			{ title: "No Country for Old Men", year: 2007, is_correct: false },
			{ title: "Sophie's Choice", year: 1982, is_correct: true },
			{ title: "The Matrix", year: 1999, is_correct: false },
			{ title: "The Iron Lady", year: 2011, is_correct: true },
			{ title: "Interstellar", year: 2014, is_correct: false },
			{ title: "Mamma Mia!", year: 2008, is_correct: true }
		]
	},
	{
		id: "horror",
		prompt_text: "Select all Horror films",
		category: "genre",
		difficulty: 1,
		movies: [
			{ title: "The Shining", year: 1980, is_correct: true },
			{ title: "Hereditary", year: 2018, is_correct: true },
			{ title: "Inception", year: 2010, is_correct: false },
			{ title: "The Godfather", year: 1972, is_correct: false },
			{ title: "Get Out", year: 2017, is_correct: true },
			{ title: "2001: A Space Odyssey", year: 1968, is_correct: false },
			{ title: "Midsommar", year: 2019, is_correct: true },
			{ title: "The Dark Knight", year: 2008, is_correct: false },
			{ title: "A Quiet Place", year: 2018, is_correct: true }
		]
	},
	{
		id: "coens-directed",
		prompt_text: "Select all films directed by the Coen Brothers",
		category: "director",
		difficulty: 2,
		movies: [
			{ title: "No Country for Old Men", year: 2007, is_correct: true },
			{ title: "Fargo", year: 1996, is_correct: true },
			{ title: "Inception", year: 2010, is_correct: false },
			{ title: "The Big Lebowski", year: 1998, is_correct: true },
			{ title: "The Dark Knight", year: 2008, is_correct: false },
			{ title: "True Grit", year: 2010, is_correct: true },
			{ title: "The Godfather", year: 1972, is_correct: false },
			{ title: "Burn After Reading", year: 2008, is_correct: true },
			{ title: "Interstellar", year: 2014, is_correct: false }
		]
	},
	{
		id: "hanks-starring",
		prompt_text: "Select all movies starring Tom Hanks",
		category: "actor",
		difficulty: 1,
		movies: [
			{ title: "Forrest Gump", year: 1994, is_correct: true },
			{ title: "Blade Runner 2049", year: 2017, is_correct: false },
			{ title: "Cast Away", year: 2000, is_correct: true },
			{ title: "Parasite", year: 2019, is_correct: false },
			{ title: "Philadelphia", year: 1993, is_correct: true },
			{ title: "Hereditary", year: 2018, is_correct: false },
			{ title: "Saving Private Ryan", year: 1998, is_correct: true },
			{ title: "Midsommar", year: 2019, is_correct: false },
			{ title: "The Terminal", year: 2004, is_correct: true }
		]
	},
	{
		id: "iconic-villains",
		prompt_text: "Select all films featuring an iconic movie villain",
		category: "character",
		difficulty: 3,
		movies: [
			{ title: "A Clockwork Orange", year: 1971, is_correct: true },
			{ title: "The Dark Knight", year: 2008, is_correct: true },
			{ title: "Forrest Gump", year: 1994, is_correct: false },
			{ title: "The Shining", year: 1980, is_correct: true },
			{ title: "Cast Away", year: 2000, is_correct: false },
			{ title: "No Country for Old Men", year: 2007, is_correct: true },
			{ title: "Interstellar", year: 2014, is_correct: false },
			{ title: "The Godfather", year: 1972, is_correct: true },
			{ title: "Silence of the Lambs", year: 1991, is_correct: true }
		]
	},
	{
		id: "animated",
		prompt_text: "Select all animated feature films",
		category: "genre",
		difficulty: 1,
		movies: [
			{ title: "Spirited Away", year: 2001, is_correct: true },
			{ title: "Spider-Man: Into the Spider-Verse", year: 2018, is_correct: true },
			{ title: "The Godfather", year: 1972, is_correct: false },
			{ title: "Inception", year: 2010, is_correct: false },
			{ title: "Toy Story", year: 1995, is_correct: true },
			{ title: "Parasite", year: 2019, is_correct: false },
			{ title: "WALL-E", year: 2008, is_correct: true },
			{ title: "The Dark Knight", year: 2008, is_correct: false },
			{ title: "Princess Mononoke", year: 1997, is_correct: true }
		]
	}
];

async function resolvePuzzle(def) {
	const images = [];
	for (const m of def.movies) {
		const { url, label } = await resolvePoster(m);
		images.push({ url, label, is_correct: m.is_correct });
	}
	return {
		id: def.id,
		prompt_text: def.prompt_text,
		category: def.category,
		difficulty: def.difficulty,
		images
	};
}

async function main() {
	console.log("Resolving TMDB posters...");
	const byId = {};
	for (let i = 0; i < PUZZLES.length; i++) {
		const def = PUZZLES[i];
		console.log(`  [${i + 1}/${PUZZLES.length}] ${def.prompt_text}`);
		byId[def.id] = await resolvePuzzle(def);
	}

	const missing = Object.values(byId).flatMap((p) =>
		p.images.filter((img) => !img.url).map((img) => `${p.id}: ${img.label}`)
	);
	if (missing.length) {
		console.warn(`\n${missing.length} missing posters:\n  ${missing.join("\n  ")}`);
	}

	const puzzlesPath = resolve(ROOT, "src/lib/data/puzzles.json");
	writeFileSync(puzzlesPath, JSON.stringify(byId, null, 2) + "\n");
	console.log(`\nWrote ${puzzlesPath}`);

	const today = new Date().toISOString().slice(0, 10);
	const schedule = {
		[today]: PUZZLES.slice(0, 5).map((p) => p.id)
	};
	const schedulePath = resolve(ROOT, "src/lib/data/daily_schedule.json");
	writeFileSync(schedulePath, JSON.stringify(schedule, null, 2) + "\n");
	console.log(`Wrote ${schedulePath}`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
