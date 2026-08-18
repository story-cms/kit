# Project structure — @story-cms/kit

Instructions for AI coding agents (Codex, Cursor, Claude Code, Copilot, etc.) working in this repository.

## Project overview

**Journeys Studio Kit** (`@story-cms/kit`) is a publishable npm package that provides:

- **Frontend**: Vue 3 + Inertia.js UI components, field widgets, and Pinia stores
- **Backend**: AdonisJS 7 services, models, middleware, and scaffolding stubs
- **Documentation**: [Histoire](https://histoire.dev/) component stories (not Storybook)

This repo is the **kit library**, not a full CMS app. Client apps (e.g. `@bnap/cms`) consume the built package. Local development uses Histoire (`npm run dev`) to preview and document components.

## Repository map

| Path | Purpose |
|------|---------|
| `src/frontend/` | Vue components, stores, styles |
| `src/backend/` | Adonis services, models, middleware, stubs |
| `src/types.ts` | Shared TypeScript types |
| `tests/unit/` | Playwright unit tests |
| `tests/e2e/` | Playwright end-to-end tests |
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
npm run story:build      # Build Histoire static site
npm run story:preview    # Preview built Histoire site
```

## Frontend conventions

- Vue 3 **Composition API** with `<script setup lang="ts">`
- Component files: **kebab-case** (e.g. `action-card.vue`)
- Co-locate Histoire stories: `component-name.story.vue` beside the component
- Histoire **`group`** must match the folder (`dashboard`, `shared`, `widgets`, `stories`, `pages`, etc.) — see `histoire.config.ts`
- State: Pinia stores in `src/frontend/store/`
- Icons: `@lucide/vue` for new UI; legacy `shared/icon.vue` for existing icon names
- Styling: Tailwind utilities; studio brand tokens in `tailwind.config.js` (`studio-yellow`, `studio-lime`, `studio-green`, `studio-forest`, `studio-dark`, etc.)
- Export public components from `src/frontend/index.ts` when adding package surface

Field widgets live under `src/frontend/fields/` and use `commonProps` from `shared/helpers.ts`.

## Backend conventions

- AdonisJS 7 + Lucid ORM
- Services: `src/backend/services/`
- Models: `src/backend/models/`
- Stubs for consumer apps: `src/backend/stubs/`

See `.cursor/rules/adonis.mdc` for backend patterns.

## Testing

- **Unit**: `tests/unit/*.ts` — run with `npm run test`
- **E2e**: `tests/e2e/*.ts` — run with `npm run test:e2e`
- After changing field components or shared UI, run relevant tests before claiming work is complete
- Component behavior can also be checked in Histoire (`npm run dev`)

## Commits and pull requests

Use [Conventional Commits](https://www.conventionalcommits.org/) with **project-specific types**:

| Type | Use for |
|------|---------|
| `feat` | New feature |
| `fix` | Bug fix |
| `increment` | Functional improvement (not feat/fix) |
| `ops` | Build, CI, tooling (not `chore`) |
| `qa` | Tests, docs (not `test`/`docs`) |
| `refactor` | Maintainability, no behavior change |
| `revert` | Revert a prior commit |

**Do not** use `chore`, `docs`, `test`, `ci`, or `build` — map them to the types above.

Format: `type: subject` — imperative, lowercase after colon, no trailing period.

**Only create git commits when explicitly asked.** Do not commit secrets (`.env`, credentials).

Full guide: `.cursor/rules/commit-messages.mdc`

## Agent workflow

1. **Minimize scope** — smallest correct diff; do not refactor unrelated code
2. **Match existing patterns** — read surrounding files before writing
3. **New UI components** — add or update a co-located `.story.vue`; pick the correct Histoire `group`
4. **Verify before done** — run lint, tests, or Histoire as appropriate; do not claim success without evidence
5. **Do not edit plan files** (`.cursor/plans/`) unless asked
6. **Read scoped rules** — when editing paths covered by `.cursor/rules/`, follow those rules

## Detailed rules index (Cursor)

| Rule file | Topic | Applies when |
|-----------|-------|--------------|
| `application-stack.mdc` | Stack, dependencies, scripts | Always (alwaysApply) |
| `commit-messages.mdc` | Commit format and types | Always |
| `project-structure.mdc` | Directory layout | Exploring or adding files |
| `vue-components.mdc` | Vue 3 patterns | `src/frontend/**/*.vue` |
| `histoire-stories.mdc` | Story conventions | `src/frontend/**/*.story.vue` |
| `css-styling.mdc` | CSS / Tailwind layers | `src/frontend/**/*.css` |
| `adonis.mdc` | AdonisJS backend | `src/backend/*` |
| `cursor-rules.mdc` | How to add/edit rules | Maintaining rules |
| `self-improvement.mdc` | When to update rules | Rule maintenance |

Cursor loads `.cursor/rules/*.mdc` automatically; this file complements those rules for tools that read this guide.
