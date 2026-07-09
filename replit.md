# 재난안전 정보 (Disaster Safety Portal)

A Korean-language disaster safety information website providing real-time disaster alerts, action guides by disaster type, an interactive shelter map, emergency contacts, and public notices.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server
- `pnpm --filter @workspace/disaster-safety run dev` — run the web frontend
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)
- Frontend: React + Vite, Tailwind CSS v4, react-leaflet/Leaflet (OpenStreetMap, no API key needed)

## Where things live

- `lib/api-spec/openapi.yaml` — source-of-truth OpenAPI contract (alerts, shelters, guides, contacts, notices, summary)
- `lib/db/src/schema/` — Drizzle schema per entity (alerts, shelters, guides, contacts, notices)
- `artifacts/api-server/src/routes/` — Express routers, one per resource
- `artifacts/disaster-safety/src/pages/` — frontend pages: Home, Guides, GuideDetail, Shelters (map), Notices, Contacts

## Architecture decisions

- Disaster types are a fixed enum: 지진(earthquake), 화재(fire), 홍수(flood), 태풍(typhoon), 폭염(heatwave), 한파(coldwave).
- Shelter map uses react-leaflet + OpenStreetMap tiles — no external API key required.
- Guides store before/during/after action steps as JSONB arrays on a single `guides` row per disaster type (unique constraint on disasterType).
- No emojis anywhere in the UI; design uses a navy/white "government portal" identity for trustworthiness.

## Product

- Home: real-time active alerts, dashboard summary counts, quick links.
- 행동요령 (Guides): action guides per disaster type, with before/during/after steps.
- 대피소 안내 (Shelters): searchable/filterable list + interactive map of shelters.
- 공지사항 (Notices): pinned + chronological public notices.
- 비상연락처 (Contacts): categorized emergency phone numbers with call action.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- The api-server dev script builds once at startup (no watch mode) — restart the `artifacts/api-server: API Server` workflow after backend route/schema changes.
- In Tailwind v4, url()-based `@import`s (fonts, leaflet CSS) must be placed before `@import "tailwindcss"` in `index.css`, or the Vite build fails.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
