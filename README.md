# CineCAPTCHA

A daily movie trivia game disguised as a reCAPTCHA.

Scaffolded on the crosstune architecture: SvelteKit (Svelte 5) + `@sveltejs/adapter-cloudflare`. No Tailwind. No Supabase. No database — puzzles live in JSON files in `src/lib/data/`, the same pattern crosstune uses for its crosswords.

## Setup

```bash
npm install
npm run dev
```

## Data

- `src/lib/data/puzzles.json` — pool of puzzles keyed by id. Each puzzle has a `prompt` and 9 `images` (each with `url`, `title`, `correct`).
- `src/lib/data/daily_schedule.json` — keyed by `YYYY-MM-DD` → array of 5 puzzle ids (one per round).

To add a puzzle, append an entry to `puzzles.json` and reference its id in `daily_schedule.json`.

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview the production build |
