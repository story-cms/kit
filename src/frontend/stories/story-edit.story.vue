<template>
  <Story title="Story Edit" group="stories">
    <Variant title="Default" :setup-app="loadNormalData">
      <StoryEdit
        :config="sharedProps.config"
        :user="sharedProps.user"
        :language="sharedProps.language"
        :errors="{}"
        :bookmarks="sharedProps.bookmarks"
        :story="storyData"
        :is-new="false"
        :providers="{}"
      />
    </Variant>

    <Variant title="New story" :setup-app="loadNormalData">
      <StoryEdit
        :config="sharedProps.config"
        :user="sharedProps.user"
        :language="sharedProps.language"
        :errors="{}"
        :bookmarks="sharedProps.bookmarks"
        :story="newStoryData"
        :is-new="true"
        :providers="{}"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import StoryEdit from './story-edit.vue';
import { listModel, sharedProps, miniSidebar } from '../test/mocks';
import { useSharedStore } from '../store';
import type { StoryHandler } from '../shared/helpers';

const storyData = {
  id: 1,
  name: 'The Gospel of John',
  storyType: 'gospel',
  chapterType: 'chapter',
  coverImage:
    'https://res.cloudinary.com/journeys/image/upload/v1756121793/mountain-placeholder_yuflkz.jpg',
  chapterLimit: 21,
  tags: 'gospel,john,new-testament',
  description:
    '# The Gospel of John\n\nThis is the fourth gospel in the New Testament...',
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-20T14:45:00Z',
  sections: listModel.sections,
  resources: [
    {
      title: 'Study companion PDF',
      url: 'https://example.com/guides/john-study.pdf',
      summary:
        '# About this resource\n\nA printable **study guide** with discussion questions for small groups.',
    },
    {
      title: 'Sermon series',
      url: 'https://example.com/series/gospel-of-john',
      summary: 'Weekly audio and outlines covering *John* chapters 1–12.',
    },
  ],
};

const newStoryData = {
  id: 0,
  name: '',
  storyType: 'story',
  chapterType: 'chapter',
  coverImage: '',
  chapterLimit: 0,
  tags: '',
  description: '',
  createdAt: '2024-01-25T09:00:00Z',
  updatedAt: '2024-01-25T09:00:00Z',
  sections: [],
  resources: [],
};

const loadNormalData: StoryHandler = ({ app, story, variant }): void => {
  const shared = useSharedStore();
  shared.setLanguage({
    locale: 'en',
    language: 'English',
    languageDirection: 'ltr',
  });

  // Also call miniSidebar to close sidebar
  miniSidebar({ app, story, variant });
};
</script>

<docs lang="md">
# Story Edit

Full-page story editor shell: header with navigation, tabbed main form, and a sidebar meta
panel. It wires `SharedPageProps` into the shared store, loads the Pinia model from
`story`, and registers media `providers` for upload widgets.

## Usage

```vue
<StoryEdit
  :config="config"
  :user="user"
  :language="language"
  :errors="errors"
  :bookmarks="bookmarks"
  :story="story"
  :is-new="false"
  :providers="providers"
/>
```

## Props

`StoryEdit` expects `StoryEditProps` merged with `SharedPageProps`:

| Prop | Description |
| --- | --- |
| `config` | CMS UI config (`UiConfig`). |
| `user` | Signed-in user (`AppUserInterface`). |
| `language` | Active locale and direction (`LanguageSpecification`). |
| `errors` | Optional server/validation errors map for the shared store. |
| `bookmarks` | Optional bookmarks list for layout chrome. |
| `story` | Story record and **bundle** fields consumed by the model store (see below). |
| `isNew` | When `true`, shows the delete-story control in the header; still use a real or stub `story.id` for routes in demos. |
| `providers` | Widget providers (e.g. image upload); passed to `useWidgetsStore().setProviders()`. |

## Story bundle (model)

On mount, `model.setModel(props.story)` runs. The **Details** tab edits the usual meta
fields (`name`, `coverImage`, `chapterLimit`, `tags`, `description`). The **Sections** and
**Resources** tabs render nested `sectionPanel` UIs
backed by `sections` and `resources` arrays on the same object when those keys are present.

Example shape (Histoire mocks in this file):

- `sections` — list of `{ scripture, commentary }` rows (scripture widget + markdown).
- `resources` — list of `{ title, url, summary }` rows (strings + markdown).

Saving in this kit story only posts the **Details** payload (`name`, `coverImage`,
`chapterLimit`, `tags`, `description`); extend `getPayload()` in `story-edit.vue` when
your app persists nested lists too.

## UI behavior

- **Tabs** — Details, Sections, Resources (`NavigationPane`). The tab icon is passed into
  the Sections/Resources subtrees as `tab-icon` and shown on each section panel row
  (`headerIcon` on `SectionPanelField`).
- **Title** — Header title tracks `name` from the model (falls back to “New Story”).
- **Sidebar** — `MetaMetaBox` shows story type, chapter type, name, created/updated times;
  `savedAt` refreshes after a successful save.
- **Layout** — Two columns with sidebar when not single-column; otherwise a single centered
  column (from `useSharedStore().isSingleColumn`).

## Histoire variants

| Variant | Purpose |
| --- | --- |
| **Default** | Existing story (`is-new: false`) with populated details, `sections` from `listModel`, and sample `resources`. |
| **New story** | Create flow (`is-new: true`), `id: 0`, empty details and empty `sections` / `resources` arrays. |

Each variant uses `setup-app="loadNormalData"` to set English LTR language and apply the
shared `miniSidebar` story handler.
</docs>
