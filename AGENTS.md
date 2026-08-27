# Agent instructions

**Journeys Studio Kit** (`@story-cms/kit`) is a publishable npm package that provides:

- **Frontend**: Vue 3 + Inertia.js UI components, field widgets, and Pinia stores
- **Backend**: AdonisJS 7 services, models, middleware, and scaffolding stubs
- **Documentation**: [Histoire](https://histoire.dev/) component stories (not Storybook)

This repo is the **kit library**, not a full CMS app. Client apps (e.g. `@bnap/cms`)
consume the built package. Local development uses Histoire (`npm run dev`) to preview and
document components.

## Repository map

| Path             | Purpose                                              |
| ---------------- | ---------------------------------------------------- |
| `src/frontend/`  | Vue components, stores, styles                       |
| `src/backend/`   | Adonis services, models, middleware, stubs           |
| `src/types.ts`   | Shared TypeScript types                              |
| `tests/unit/`    | Playwright unit tests                                |
| `tests/e2e/`     | Playwright end-to-end tests                          |
| `.cursor/rules/` | Detailed, file-scoped Cursor rules (see index below) |

Full directory tree: `.cursor/rules/project-structure.mdc`

## Commands

```bash
npm run dev              # Histoire dev server (component docs)
npm run build            # types + frontend (Vite) + backend (tsc)
npm run ui:build         # Frontend only
npm run backend:build    # Backend only
npm run lint             # ESLint
npm run lint:fix         # ESLint with auto-fix
npm run test             # Playwright unit tests
npm run test:e2e         # Playwright e2e tests
```

Before generating code, read [docs/agents/conventions.md](docs/agents/conventions.md) for
project conventions and agent workflow.

In Cursor, detailed file-scoped rules live in `.cursor/rules/` — read the relevant `.mdc`
files when editing matching paths.
