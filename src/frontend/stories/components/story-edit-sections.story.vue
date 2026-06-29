<template>
  <Story title="Story Edit Sections" group="stories">
    <Variant title="Default" :setup-app="loadDefault">
      <StoryEditSections section-type="Part" tab-icon="list-bullet" />
      <ModelControl :model="sectionsModel" :is-inspect-only="true" />
    </Variant>

    <Variant title="Translation" :setup-app="loadTranslation">
      <StoryEditSections section-type="Part" tab-icon="list-bullet" />
      <ModelControl :model="translationSectionsModel" :is-inspect-only="true" />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import StoryEditSections from './story-edit-sections.vue';
import ModelControl from '../../test/model-control.vue';
import { useModelStore, useSharedStore } from '../../store';
import { sharedProps } from '../../test/mocks';
import type { StoryHandler } from '../../shared/helpers';

const sectionsModel = {
  sections: [
    {
      id: 'section-1',
      title: 'Introduction',
      description: 'Opening section of the gospel.',
    },
    {
      id: 'section-2',
      title: 'The Word',
      description: 'In the beginning was the Word.',
    },
  ],
};

const translationSectionsModel = {
  sections: [
    {
      id: 'section-1',
      title: 'Introducción',
      description: 'Sección de apertura del evangelio.',
    },
    {
      id: 'section-2',
      title: '',
      description: '',
    },
  ],
};

const loadDefault: StoryHandler = (): void => {
  const store = useModelStore();
  const shared = useSharedStore();

  shared.setFromProps(sharedProps);
  shared.setLanguage(sharedProps.language);
  store.setModel({ ...sectionsModel });
  store.setSource({});
  shared.clearErrors();
};

const loadTranslation: StoryHandler = (): void => {
  const store = useModelStore();
  const shared = useSharedStore();

  shared.setFromProps(sharedProps);
  shared.setLanguage({
    locale: 'es',
    language: 'Spanish',
    languageDirection: 'ltr',
  });
  store.setModel({ ...translationSectionsModel });
  store.setSource({ ...sectionsModel });
  shared.clearErrors();
};
</script>

<docs lang="md">
# Story Edit Sections

Sections tab wrapper for the story editor. Delegates to `PanelList` for draggable section
panels with title and description fields.

## Variants

- **Default** — source locale with reorder, add, and delete controls
- **Translation** — side-by-side editable and read-only section fields; reorder disabled

## Props

- `sectionType` — label used for section headings and the add button
- `tabIcon` — icon name shown in each section header
</docs>
