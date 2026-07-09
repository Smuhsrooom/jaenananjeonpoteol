---
name: api-server dev workflow requires restart after backend changes
description: The api-server dev script bundles once at startup; adding new routes, DB schema, or Zod contracts won't take effect until the workflow is restarted.
---

The `@workspace/api-server` dev script runs `build` once then `start` — it does not watch/rebuild on file changes.

**Why:** New route files, DB schema updates, or generated Zod/OpenAPI types are only picked up at the next build. Leaving the old process running silently serves stale routes (e.g. new endpoints 404 even though the code compiles and the route file exists).

**How to apply:** After adding/editing backend routes, DB schema, or regenerating the OpenAPI/Zod codegen, restart the `api-server` workflow before testing endpoints — don't rely on it being "already running."
