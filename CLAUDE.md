# CineCAPTCHA

A daily movie trivia game disguised as a reCAPTCHA. Each puzzle shows a 3×3 grid of movie images. Players select the ones matching the prompt and hit **Verify**. Five rounds, five lives shared across all rounds.

## Tech Stack

- **Framework:** SvelteKit (Svelte 5) with `@sveltejs/adapter-cloudflare`
- **Styling:** Plain CSS (no Tailwind, no PostCSS framework)
- **Data:** Static JSON files in `src/lib/data/` (no database)
- **Hosting:** Cloudflare Pages
- **State:** Svelte 5 runes (`$state`, `$derived`, etc.) in `src/lib/stores/`

## Commands

- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run preview` — Preview production build

## Project Structure

- `src/routes/` — SvelteKit pages and API routes
  - `api/` — Server endpoints
- `src/lib/components/` — Svelte components
- `src/lib/stores/` — Svelte stores (files using runes have `.svelte.js` extension)
- `src/lib/utils/` — Utility modules
- `src/lib/data/` — Static data JSON files (`puzzles.json`, `daily_schedule.json`)
- `static/` — Static assets

## Key Conventions

- Svelte 5 syntax: use runes (`$state`, `$derived`, `$effect`) not legacy `$:` reactivity
- Stores that use runes have the `.svelte.js` extension
- Component-scoped styles via `<style>` blocks; global resets live in `src/app.css`
- Puzzle data: `import puzzles from "$lib/data/puzzles.json"` — keyed by puzzle id, matching crosstune's `crosswords.json` pattern
- Daily schedule: `src/lib/data/daily_schedule.json` — keyed by `YYYY-MM-DD` → array of 5 puzzle ids
- No database, no Supabase, no auth layer. Add `hooks.server.js` handlers if needed later.
