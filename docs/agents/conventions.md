# Project conventions

## Frontend conventions

- Vue 3 **Composition API** with `<script setup lang="ts">`
- Component files: **kebab-case** (e.g. `action-card.vue`)
- Co-locate Histoire stories: `component-name.story.vue` beside the component
- Histoire **`group`** must match the folder (`dashboard`, `shared`, `widgets`, `stories`,
  `pages`, etc.) — see `histoire.config.ts`
- State: Pinia stores in `src/frontend/store/`
- Icons: `@lucide/vue` for new UI; legacy `shared/icon.vue` for existing icon names
- Styling: Tailwind utilities; studio brand tokens in `tailwind.config.js`
  (`studio-yellow`, `studio-lime`, `studio-green`, `studio-forest`, `studio-dark`, etc.)
- Export public components from `src/frontend/index.ts` when adding package surface

Field widgets live under `src/frontend/fields/` and use `commonProps` from
`shared/helpers.ts`.

## Backend conventions

- AdonisJS 7 + Lucid ORM
- Services: `src/backend/services/`
- Models: `src/backend/models/`
- Stubs for consumer apps: `src/backend/stubs/`

See `.cursor/rules/adonis.mdc` for backend patterns.

## Agent workflow

1. **Minimize scope** — smallest correct diff; do not refactor unrelated code
2. **Match existing patterns** — read surrounding files before writing
3. **New UI components** — add or update a co-located `.story.vue`; pick the correct
   Histoire `group`
4. **Verify before done** — run lint, tests, or Histoire as appropriate; do not claim
   success without evidence
   - **Unit**: `tests/unit/*.ts` — run with `npm run test`
   - **E2e**: `tests/e2e/*.ts` — run with `npm run test:e2e`
   - Component behavior can also be checked in Histoire (`npm run dev`)
5. **Do not edit plan files** (`.cursor/plans/`) unless asked
6. **Read scoped rules** — when editing paths covered by `.cursor/rules/`, follow those
   rules
7. **Do not create git commits**

## Detailed rules index (Cursor)

| Rule file               | Topic                        | Applies when                  |
| ----------------------- | ---------------------------- | ----------------------------- |
| `application-stack.mdc` | Stack, dependencies, scripts | Always (alwaysApply)          |
| `commit-messages.mdc`   | Commit format and types      | Always                        |
| `project-structure.mdc` | Directory layout             | Exploring or adding files     |
| `vue-components.mdc`    | Vue 3 patterns               | `src/frontend/**/*.vue`       |
| `histoire-stories.mdc`  | Story conventions            | `src/frontend/**/*.story.vue` |
| `css-styling.mdc`       | CSS / Tailwind layers        | `src/frontend/**/*.css`       |
| `adonis.mdc`            | AdonisJS backend             | `src/backend/*`               |
| `cursor-rules.mdc`      | How to add/edit rules        | Maintaining rules             |
| `self-improvement.mdc`  | When to update rules         | Rule maintenance              |

Cursor loads `.cursor/rules/*.mdc` automatically; this file complements those rules for
tools that read this guide.
