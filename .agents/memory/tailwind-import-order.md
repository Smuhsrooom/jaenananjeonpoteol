---
name: Tailwind v4 CSS @import order
description: Vite/Tailwind v4 build fails if url()-based @import statements (fonts, third-party CSS like leaflet) appear after @import "tailwindcss".
---

Put all plain `@import` statements (Google Fonts `url(...)`, `leaflet/dist/leaflet.css`, etc.) at the very top of the CSS entry file, before `@import "tailwindcss"` and `@import "tw-animate-css"`.

**Why:** Tailwind v4's `@import "tailwindcss"` expands inline into thousands of lines during the Vite build. Per CSS spec, `@import` must precede all other statements — if a font/library import comes after the tailwindcss import in source order, the expansion pushes it past other rules and Vite throws `@import must precede all other statements`.

**How to apply:** When scaffolding or editing a Tailwind v4 `index.css`, order imports as: external url()/library imports first, then `@import "tailwindcss"`, then `@import "tw-animate-css"`, then `@plugin` directives.
