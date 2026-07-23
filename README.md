# CapstoneForge AI

A guest-first capstone planning platform for Filipino BSIT, BSCS, BSIS, and Software Engineering students. Gemini generates project directions; the remaining analysis features use a local Ollama model. It also provides an editable project workspace, feasibility-oriented scoring, local project storage, printing, and defense practice.

## Stack

Next.js App Router, TypeScript, Tailwind CSS, React Hook Form, Zod, Lucide React, Gemini, and Ollama running Qwen3. The browser only talks to Next.js API routes; the Gemini API key stays server-side.

## Quick start

1. Install Node.js 20+ and install dependencies with `npm install`.
2. Create a Gemini API key in Google AI Studio.
3. Install [Ollama](https://ollama.com), then run `ollama pull qwen3` (needed for analysis and defense features).
4. Copy `.env.example` to `.env.local`, then set `GEMINI_API_KEY` to your real key.
5. Start Ollama (`ollama serve` when it is not already running).
6. Run `npm run dev`, then visit `http://localhost:3000`.

Environment settings:

```env
GEMINI_API_KEY=your_google_ai_studio_key
GEMINI_MODEL=gemini-3.5-flash
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=qwen3
```

## Architecture

`Browser → Next.js client → /api/generate-title → Gemini API → Zod-validated JSON → UI`

Gemini and Ollama settings are only read in server-only code. Gemini title-generation responses are requested as JSON, checked with Zod, and retried once if their first response cannot be parsed. The app reports a friendly error when a provider is not reachable.

## Project structure

- `src/app` — pages and server API routes
- `src/components` — navigation, generator, and results UI
- `src/lib/ai` — provider abstraction, Ollama client, prompts, safe parser
- `src/lib/storage` — defensive localStorage persistence
- `src/lib/validations` — Zod request and response schemas
- `src/types` — shared project models

## Local projects and export

Saved projects are kept under a namespaced localStorage key in the current browser. Open a project to edit its generated content, duplicate or delete it from My Projects, and use **Print / Save PDF** to export a browser-generated PDF. The app labels all AI content as a draft. AI similarity/originality figures are estimates only and never a guarantee of uniqueness; conduct a literature review, plagiarism checking, and adviser validation.

## Philippine location lists

The generator includes searchable, cascading Region → Province → City/Municipality → Barangay fields. It proxies current PSGC reference data server-side and keeps a manual-entry fallback if the reference service is unavailable. A separate optional field lets a student name a school, university, hospital, clinic, or other organization. A complete nationwide school/hospital directory is not bundled because those institution registries change independently and require their respective official sources and update policy.

## Troubleshooting

- **Gemini is not configured:** Add `GEMINI_API_KEY` to `.env.local`, then restart the development server.
- **Couldn’t reach Ollama:** Run `ollama serve`, verify the base URL, and ensure no firewall blocks port 11434.
- **Model not found:** Use `ollama pull qwen3` and confirm `OLLAMA_MODEL` matches `ollama list`.
- **Malformed model output:** The route cleans JSON fences/thinking blocks and retries once. Try again or use a newer Qwen3 model if it persists.
- **Saved projects missing:** localStorage is scoped to browser/device; private browsing or cleared site data removes it.

## Deployment

This app can be deployed to a Next.js host such as Vercel. Configure `GEMINI_API_KEY` and `GEMINI_MODEL=gemini-3.5-flash` as server-side environment variables in the host dashboard; never use a `NEXT_PUBLIC_` prefix for the key. The title generator will then work without Ollama. Analysis and defense features still need a reachable Ollama service on the server/private network, plus appropriate rate limits, request limits, monitoring, and a persistent database (for example PostgreSQL + Prisma) for multi-device use. Never expose an Ollama endpoint to the public client.
