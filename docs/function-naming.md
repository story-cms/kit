# Function Naming Conventions

This project follows a consistent set of naming patterns for functions and
methods across the backend (`src/backend`), frontend (`src/frontend`), and
shared code (`src/shared`).

## Principles

- **camelCase** for all functions and methods. File names may be kebab-case or
  snake_case.
- **Context supplies the noun.** Class or module name carries the domain;
  methods use verbs (`ResourceService.delete`, not `deleteResource`).
- **Prefix signals intent.** Use prefixes for booleans, conversions, retrieval,
  derivation, and mutations so callers can read intent from the name.
- **Prefer consistency over perfection.** Document legacy exceptions; do not
  mass-rename existing code.

---

## Quick reference

| Prefix / pattern | Meaning | Example |
|---|---|---|
| `isX` | Boolean state or type check | `isValidLanguageTag`, `isPopulated` |
| `hasX` | Boolean presence or ownership | `hasNoContent`, `hasFeedback` |
| `canX` | Boolean capability or permission | `canPublishStory` |
| `toX` | Pure type converter | `toResourceItem`, `toRelativeTime` |
| `getX` | General accessor (sync or async) | `getField`, `getDraftBundle` |
| `fetchX` | Async external I/O | `fetchMetricsForAllTime`, `fetchVideoTitle` |
| `loadX` | Async fetch that mutates UI/store state | `loadBibleTranslations` |
| `findX` | Lookup returning optional result | `findRegionCode` |
| `listX` / `listForY` | Collection retrieval | `listForLocale`, `listIndexItems` |
| `parseX` | Parse string/unknown into typed value | `parseReference`, `parseIsoDateForDisplay` |
| `normalizedX` | Pure sync function returning canonical form | `normalizedDevotionDraftBundle`, `normalizedBlocks` |
| `normalizeX` | In-place or async processing | `normalizeDateForStorage` (legacy pure returns prefer `normalizedX`) |
| `formatX` | Display-oriented string | `formatDate` |
| `buildX` | Assemble complex object from parts | `buildIndex`, `buildAppUpdatePayload` |
| `XFromY` | Derive X from source Y | `specFrom`, `paramsFromPath` |
| `XForY` | Result scoped to context Y | `usageCountForLocale`, `templatesForEditDisplay` |
| `*BlockedMessages` | Validation reasons blocking an action | `storyMetadataBlockedMessages` |
| `blockingX` | Service method returning blockers | `blockingPublishMessages` |
| `compareX` / `sortX` | Sort comparator or sort helper | `compareLanguagesByDisplayName` |
| `setX` / `clearX` | Pinia store replace / reset | `setField`, `clearErrors` |
| `addX` / `removeX` | Pinia collection mutate | `addListItem`, `removeListItem` |
| `toggleX` | Pinia or domain toggle | `toggleRemovedIndex`, `toggleBookmark` |
| `useX` | Vue composable or Pinia store | `useSidebarNav`, `useDraftsStore` |
| `onX` | Template-bound event handler | `onFilter`, `onDragStart`, `onRemove` |
| bare verb | Page command or service CRUD | `saveStory`, `create`, `destroy` |

---

## Shared patterns

These apply in `src/shared`, `src/backend`, and `src/frontend`.

### `isX` / `hasX` / `canX` — boolean predicates

Used for functions that return a boolean.

- **`isX`** — state, type, or condition (`isValidLanguageTag`, `isLucideIcon`)
- **`hasX`** — presence or ownership (`hasNoContent`, `hasTranslationContent`)
- **`canX`** — capability or permission (`canPublishStory`, `canPublishStoryMetadata`)

```ts
isValidLanguageTag(tag: string): boolean
hasNoContent(id: number): Promise<boolean>
canPublishStory(publishedCount: number, chapterLimit: number): boolean
```

### `toX` — pure converters

Map one type to another with no side effects.

```ts
toResourceItem(model: Resource): ResourceItem
toResourceIndexItem(model: Resource): ResourceIndexItem
toRelativeTime(date: string): string
```

### `getX` / `fetchX` / `loadX` / `findX` — retrieval

- **`getX`** — general accessor; sync or async, local or cheap (`getField`, `getDraftBundle`, `getBibleVersions`)
- **`fetchX`** — async external I/O such as network or third-party APIs (`fetchMetricsForAllTime`, `fetchVideoTitle`)
- **`loadX`** — async fetch that also updates component or store state (`loadBibleTranslations` in `bible-translations-modal.vue`)
- **`findX`** — lookup that may return `undefined` (`findRegionCode`)

**When to omit `get` / `fetch`:** use a bare domain name when the function name already reads as a derivation and context is clear — e.g. `blockKind(block)` not `getBlockKind(block)`, `previousDevotionChapterBlocks(specifier, loadBundle)` not `fetchPreviousDevotionChapterBlocks`. Keep `getX` / `fetchX` for generic accessors (`getField`, `fetchMetricsForAllTime`) or when the prefix adds disambiguation.

```ts
blockKind(block) // sync field extraction
previousDevotionChapterBlocks(specifier, loadBundle) // async, name describes result
getBookmarks(storyId: number): Bookmark[]
fetchMetricsForAllTime(): Promise<Metrics>
loadBibleTranslations(): Promise<void>
findRegionCode(searchTerm: string): string | null
```

### `XFromY` — derive X from a source Y

Build a result from a specific input source.

```ts
storyFromPath(ctx: HttpContext): Promise<StorySpec | undefined>
specFrom(story: Story): StorySpec
fieldsFromTemplate(id: string): FieldSpec[]
getFreshBundleFrom(model: Resource): ResourceBundle
paramsFromPath(path: string): StoryParams
```

### `XForY` — compute X scoped to context Y

Result only makes sense relative to some context.

```ts
usageCountForLocale(locale: string): Promise<Map<string, number>>
storyUsageFor(resourceId: string, locale: string): Promise<ResourceUsage[]>
templatesForEditDisplay(): BundleTemplate[]
updatePayloadFor(storyId: number, locale: string): Promise<StoryUpdatePayload | undefined>
parentPathForBack(path: string): string
```

### `parseX` / `normalizeX` / `normalizedX` / `formatX` — parsing and display

- **`parseX`** — string or unknown input to typed value (`parseReference`, `parseIsoDateForDisplay`, `parseLanguageSpecification`)
- **`normalizedX`** — pure sync function **returning** a canonical copy (`normalizedDevotionDraftBundle`, `normalizedBlocks`)
- **`normalizeX`** — processing action; especially in-place mutation or async work where `await normalizeX(...)` reads naturally (`normalizeDateForStorage` is legacy — prefer `normalizedX` for new pure transforms)
- **`formatX`** — human-readable display string (`formatDate`, `formatResourceDate`)

```ts
const bundle = normalizedDevotionDraftBundle(draft.bundle, draft.number);
const blocks = normalizedBlocks(rawBlocks);
await normalizeRecordsInPlace(records); // mutating processor — verb form
```

### `buildX` — assembly

Compose a complex object from parts.

```ts
buildIndex(items: IndexItem[]): Index
buildAppUpdatePayload(reasons: string[]): AppUpdatePayload
getPayload(): StoryUpdatePayload  // standard name in form components
```

### `*BlockedMessages` / `blockingX` — validation blockers

- **`*BlockedMessages`** — returns `string[]` of reasons an action is blocked (`storyMetadataBlockedMessages`, `storyTypeBlockedMessages`)
- **`blockingX`** — async service methods returning blockers before a mutation (`blockingPublishMessages`, `blockingDeleteMessages`)

### `compareX` / `sortX` — sorting

- **`compareX`** — comparator for `.sort()` (`compareLanguagesByDisplayName`)
- **`sortX`** — sort helper wrapping a comparator (`sortLanguagesByDisplayName`)

Prefer one canonical helper in `src/frontend/shared/helpers.ts` rather than duplicating sort logic in composables.

### `useX` — Vue composables and Pinia stores

Standard Vue convention. One exported `useX()` per composable file, matching
the `use-*.ts` filename.

```ts
useDraftsStore()
useSidebarNav()
```

Private helpers inside composables stay unexported (`isEnglishLanguage`, `compareLanguages`).

---

## Frontend conventions

### Pinia stores (`src/frontend/store/`)

Stores use the setup style: actions and state are returned from the store
function.

| Action type | Pattern | Examples |
|---|---|---|
| Replace state | `setX` | `setField`, `setModel`, `setFromProps`, `setLanguage` |
| Reset | `clearX` | `clearErrors`, `clearListState` |
| Collection mutate | `addX` / `removeX` | `addListItem`, `removeListItem`, `addDivider` |
| Toggle | `toggleX` | `toggleRemovedIndex` |
| Read accessor | `getX` or bare `computed` ref | `getField`, `getListToggles`, `locale`, `isRtl` |
| Boolean state | `isX` / `hasX` as `computed` | `isPopulated`, `hasFeedback`, `isBookmarked` |

Avoid doubling the `is` prefix: prefer `setDirty(value)` or `markDirty()` over
`setIsDirty(value)`.

```ts
// useModelStore — src/frontend/store/model.ts
setField(path: string, value: unknown): void
getField(path: string, defaultValue?: unknown): unknown
addListItem(path: string): void
removeListItem(path: string, index: number): void
isPopulated: ComputedRef<boolean>
```

### Event handlers

Use **`onX` for handlers bound in the template** — clicks, keyboard events, drag
and drop, file uploads, and child emit callbacks.

```vue
<button @click="onSave">Save</button>
<input @keydown="onEnterKey" />
<DropItem @remove="onRemove" />
<FileUpload @drop="onDrop" @select="onSelect" />
```

```ts
const onFilter = (query: string) => { /* ... */ };   // stream-index.vue
const onDragStart = () => { /* ... */ };              // pages-index.vue
const onAttached = async (data: AttachmentModel) => { /* ... */ };
```

Use **bare domain verbs** for page-level commands not tied to a single DOM
event — navigation, saves, publishes, and CRUD orchestration.

```ts
const saveStory = () => router.post(/* ... */);       // story-edit.vue
const deleteStory = () => router.delete(/* ... */);
const addPage = () => { /* ... */ };                  // pages-index.vue
const publishDraft = () => { /* ... */ };
```

**`handleX` is legacy — do not use in new code.** Existing uses (settings
modals, `pill-field.vue` keyboard handlers) remain; rename to `onX` when
touching a file.

```ts
// legacy — rename to onClose / onEnterKey when editing
const handleClose = () => { /* ... */ };
const handleEnterKey = (event: KeyboardEvent) => { /* ... */ };
```

### Payload builders

- **`getPayload()`** — standard name for form submit payloads (`story-edit.vue`, `resources-edit.vue`, `pages-index.vue`)
- **`buildXPayload()`** — when multiple payload shapes exist (`buildAppUpdatePayload` in `settings-index.vue`)

### Callback parameters

Match library or child-component convention for callback props and constructor
options: `onProgress`, `onError`, `onSuccess` (attachment services).

### Attachment service classes

Class methods follow the same bare-verb pattern as backend services, since the
class name supplies the noun.

```ts
S3Service.upload(file, options): Promise<AttachmentModel>
BunnyService.fetchVideoTitle(url): Promise<string>
```

---

## Backend conventions

### Service classes (`src/backend/services/`)

Service classes use bare verbs for primary CRUD operations because the class
name already supplies the noun. Class names end in `Service` (except `Analytics`,
which is a legacy exception).

```ts
class ResourceService {
  create(locale: string, payload: ResourcePayload, userId: number): Promise<Resource>
  update(id: string, payload: ResourcePayload, userId: number): Promise<Resource>
  delete(id: string): Promise<void>
  listForLocale(locale: string): Promise<ResourceItem[]>
  hydrate(model: Resource): Promise<ResourceBundle>
  toggleBookmark(userId: number, storyId: number): Promise<void>
}
```

Additional service patterns:

- **`listX` / `listForY`** — collections (`listIndexItems`, `galleryIndex`)
- **`getX`** — single-item or computed retrieval (`getPageItems`, `getUserBookmarks`)
- **`fetchX`** — external API calls (`fetchMetricsForBothPeriods`)
- **`fillX` / `toggleX` / `hydrate`** — domain-specific mutations (`fillMissing`, `toggleBookmark`)
- **`toX` / `XFromY` / `XForY`** — same shared patterns as above

Module-level mappers in files like `resource_mapper.ts` export pure functions:
`toResourceItem`, `toResourceIndexItem`, `extractResourceContent`.

### Controllers (`src/backend/stubs/controllers/`)

Controllers shipped as stubs follow AdonisJS REST naming plus domain actions.

**REST baseline:**

| Action | Purpose |
|---|---|
| `index` | List page |
| `create` | New form |
| `edit` | Edit form |
| `store` | POST create |
| `update` | PUT/PATCH update |
| `destroy` | DELETE |

**Domain actions** use verbs matching the user action: `publish`, `preview`,
`toggleBookmark`, `exportAudience`, `translateBulk`, `sort`.

**Private helpers** describe the work: `applyStoryUpdate`, `sanitizeReturnPath`,
`createFirstUser`, `isFreshInstall`.

**Legacy inconsistency:** stories and drafts controllers use `delete`; other
resources use `destroy`. Prefer **`destroy`** for new resources (Adonis
convention).

### Validators (`src/backend/validators/`)

Two export styles coexist:

- **Class validators** — `*Validator` class with a `validate()` method (`StoryUpdateValidator`, `ResourceValidator`)
- **Vine exports** — camelCase factory exports (`createUserValidator`, `updateUserValidator`)
- **Custom Vine rules** — domain noun (`audio`, `video`, `dateRange`)

Message exports: `*ValidationMessages`, `*ErrorMessages`.

### Middleware (`src/backend/middleware/`)

Always `async handle(ctx, next)` — Adonis standard. Inertia middleware also
exposes `share()` for shared page props.

### Models (`src/backend/models/`)

Logic stays in services; models are mostly data plus getters and small instance
methods. No Lucid hooks or query scopes in this project.

- **Getters** for derived or serialized shape: `isAdmin`, `initials`, `forApi`, `meta`, `isLink`
- **Instance methods** for mutations or checks: `updateBundle`, `sortItems`, `isAllowed`, `freshValue`

---

## Legacy and exceptions

Do not mass-rename; apply preferred patterns in new code and when editing
existing files.

| Issue | Existing example | Preferred going forward |
|---|---|---|
| `get` for computed status | `getInvitationStatus()` | `invitationStatus()` or keep if widely used |
| Boolean without prefix | `subscribed()` in `use-sidebar-nav.ts` | `isSubscribed()` |
| Duplicate sort helpers | `compareLanguages` vs `compareLanguagesByDisplayName` | One canonical helper in `helpers.ts` |
| `handle*` event handlers | `handleClose`, `handleEnterKey` | `onClose`, `onEnterKey` |
| Wrapper name mismatch | `toIndexItem` vs `toResourceIndexItem` | Align wrapper with underlying export when touched |
| `delete` vs `destroy` | Stories/Drafts vs Resources/Users | `destroy` for new resources |
| `Analytics` vs `*Service` | `Analytics` class | `*Service` for new service classes |
| `setIsX` setter | `setIsDirty` | `setDirty` or `markDirty` |

There is no ESLint naming enforcement today; this document is the source of
truth. See also [function-naming.mdc](../.cursor/rules/function-naming.mdc) for
Cursor agent guidance.
