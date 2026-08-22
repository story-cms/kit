# Contributing to Journeys Studio Kit

The project is not containerised. Many of the backend changes can not be fully tested or
validated without installing the kit into an AdonisJs instance.

## Setup

Setup git hooks for commit message linting.

```
make setup-hooks
```

## Develop

```bash
# Development
npm run dev              # Start Histoire development server
npm run build            # Build both frontend and backend
npm run ui:build         # Build frontend only
npm run backend:build    # Build backend only

# Testing
npm run test             # Run unit tests
npm run test:e2e         # Run end-to-end tests

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues

# Documentation
npm run story:build      # Build Storybook documentation
npm run story:preview    # Preview built documentation
```

## Code conventions

## Function Naming

- camelCase for all functions/methods
- Class/module name supplies the noun; methods use verbs
- Prefix signals intent

| Prefix                                              | Use                                                                                                         |
| --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `getX` / `fetchX` / `loadX` / `findX`               | Retrieval; omit `get`/`fetch` when bare domain name is clear (`blockKind`, `previousChapterBlocks`) |
| `parseX` / `normalizeX` / `normalizedX` / `formatX` | Parse; `normalizedX` = pure return transform; `normalizeX` = in-place/async processing                      |
| `isX` / `hasX` / `canX`                             | Boolean predicates                                                                                          |
| `toX`                                               | Pure converters                                                                                             |
| `compareX` / `sortX`                                | Sort helpers                                                                                                |

## Commits and pull requests

Use [Conventional Commits](https://www.conventionalcommits.org/) with **project-specific
types**:

| Type        | Use for                               |
| ----------- | ------------------------------------- |
| `feat`      | New feature                           |
| `fix`       | Bug fix                               |
| `increment` | Functional improvement (not feat/fix) |
| `ops`       | Build, CI, tooling (not `chore`)      |
| `qa`        | Tests, docs (not `test`/`docs`)       |
| `refactor`  | Maintainability, no behavior change   |
| `revert`    | Revert a prior commit                 |
| `steer`     | Context engineering steer for agents  |
