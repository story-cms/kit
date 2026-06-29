<template>
  <Story title="Panel List" group="stories">
    <Variant title="With sections" :setup-app="loadWithSections">
      <PanelList :field="sectionsField" :is-nested="true" section-type="Part" />
      <ModelControl :model="sectionsModel" :is-inspect-only="true" />
    </Variant>

    <Variant title="Translation" :setup-app="loadTranslation">
      <PanelList :field="sectionsField" :is-nested="true" section-type="Part" />
      <ModelControl :model="translationSectionsModel" :is-inspect-only="true" />
    </Variant>

    <Variant title="With errors" :setup-app="loadWithErrors">
      <PanelList :field="sectionsField" :is-nested="true" section-type="Part" />
      <template #controls>
        <ErrorControl :errors="sectionErrors" />
      </template>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import PanelList from './panel-list.vue';
import ModelControl from '../../test/model-control.vue';
import ErrorControl from '../../test/error-control.vue';
import { useModelStore, useSharedStore } from '../../store';
import { sharedProps } from '../../test/mocks';
import type { StoryHandler } from '../../shared/helpers';

const sectionsField = {
  label: 'Section',
  name: 'sections',
  widget: 'sectionPanel',
  fields: [
    {
      label: 'Title',
      name: 'title',
      widget: 'string',
    },
    {
      label: 'Description',
      name: 'description',
      widget: 'markdown',
      noMarkup: true,
      minimal: true,
      toolbar: [],
    },
  ],
};

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

const sectionErrors = {
  'bundle.sections.1.title': ['The title field must have at least 1 character'],
};

const loadWithSections: StoryHandler = (): void => {
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

const loadWithErrors: StoryHandler = (): void => {
  const store = useModelStore();
  const shared = useSharedStore();

  shared.setFromProps(sharedProps);
  shared.setLanguage(sharedProps.language);
  store.setModel({ ...sectionsModel });
  store.setSource({});
  shared.errors = sectionErrors;
};
</script>

<docs lang="md">
# Panel List

Draggable expandable list of section panels used by the story editor Sections tab.

## Variants

- **With sections** — populated list with drag handles, delete, and add controls
- **Translation** — read-only source column; reorder and add disabled
- **With errors** — section title validation error with exclamation icon on the affected row

## Props

- `field` — section panel field spec (`widget: 'sectionPanel'`)
- `sectionType` — label for section headers and the add button
- `headerIcon` — optional icon in each section header
</docs>
