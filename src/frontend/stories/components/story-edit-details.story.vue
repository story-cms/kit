<template>
  <Story title="Story Edit Details" group="stories">
    <Variant title="Source locale" :setup-app="loadSourceLocale">
      <StoryEditDetails :is-editing="true" />
      <ModelControl :model="sourceLocaleModel" :is-inspect-only="true" />
    </Variant>

    <Variant title="Translation locale" :setup-app="loadTranslationLocale">
      <StoryEditDetails :is-translation="true" />
      <ModelControl :model="translationLocaleModel" :is-inspect-only="true" />
    </Variant>

    <Variant title="Translation without tags" :setup-app="loadTranslationWithoutTags">
      <StoryEditDetails :is-translation="true" />
      <ModelControl :model="translationWithoutTagsModel" :is-inspect-only="true" />
    </Variant>

    <Variant title="Single template" :setup-app="loadSourceLocale">
      <StoryEditDetails :is-editing="true" :templates="[storyTemplates[0]]" />
      <ModelControl :model="sourceLocaleModel" :is-inspect-only="true" />
    </Variant>

    <Variant title="Multiple templates on edit" :setup-app="loadSourceLocale">
      <StoryEditDetails :is-editing="true" :templates="storyTemplates" />
      <ModelControl :model="sourceLocaleModel" :is-inspect-only="true" />
    </Variant>

    <Variant title="Multiple templates on create" :setup-app="loadSourceLocale">
      <StoryEditDetails :templates="storyTemplates" />
      <ModelControl :model="sourceLocaleModel" :is-inspect-only="true" />
    </Variant>

    <Variant title="Bespoke template on edit" :setup-app="loadBespokeTemplateEdit">
      <StoryEditDetails :is-editing="true" :templates="bespokeEditTemplates" />
      <ModelControl :model="bespokeEditModel" :is-inspect-only="true" />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import StoryEditDetails from './story-edit-details.vue';
import ModelControl from '../../test/model-control.vue';
import { useModelStore, useSharedStore } from '../../store';
import { sharedProps } from '../../test/mocks';
import type { StoryHandler } from '../../shared/helpers';
import type { BundleTemplate } from '../../../types';

const sourceLocaleModel = {
  title: 'The Gospel of John',
  coverImage:
    'https://res.cloudinary.com/journeys/image/upload/v1756121793/mountain-placeholder_yuflkz.jpg',
  description: 'This is the fourth gospel in the New Testament.',
  tags: 'gospel,john',
  chapterLimit: 21,
  storyType: 'Gospel',
  chapterType: 'Chapter',
  sectionType: 'Part',
  visibility: 'public',
  template: 'devotion',
};

const translationLocaleModel = {
  title: '',
  coverImage: '',
  description: '',
  tags: '',
};

const translationWithoutTagsModel = {
  title: '',
  coverImage: '',
  description: '',
  tags: '',
};

const sourceFields = {
  title: 'The Gospel of John',
  coverImage:
    'https://res.cloudinary.com/journeys/image/upload/v1756121793/mountain-placeholder_yuflkz.jpg',
  description: 'This is the fourth gospel in the New Testament.',
  tags: 'gospel,john',
};

const sourceFieldsWithoutTags = {
  title: 'The Gospel of John',
  coverImage:
    'https://res.cloudinary.com/journeys/image/upload/v1756121793/mountain-placeholder_yuflkz.jpg',
  description: 'This is the fourth gospel in the New Testament.',
  tags: '',
};

const storyTemplates: BundleTemplate[] = [
  { id: 'devotion', name: 'Devotion', fields: [] },
  { id: 'course', name: 'Course', fields: [] },
  { id: 'plan', name: 'Plan', fields: [] },
];

const bespokeEditTemplates: BundleTemplate[] = [
  { id: 'course', name: 'Course (custom)', fields: [] },
  { id: 'devotion', name: 'Devotion', fields: [] },
];

const bespokeEditModel = {
  ...sourceLocaleModel,
  template: 'course',
};

const loadSourceLocale: StoryHandler = (): void => {
  const store = useModelStore();
  const shared = useSharedStore();

  shared.setFromProps(sharedProps);
  shared.setLanguage(sharedProps.language);
  store.setModel({ ...sourceLocaleModel });
  store.setSource({});
  shared.clearErrors();
};

const loadTranslationLocale: StoryHandler = (): void => {
  const store = useModelStore();
  const shared = useSharedStore();

  shared.setFromProps(sharedProps);
  shared.setLanguage({
    locale: 'es',
    language: 'Spanish',
    languageDirection: 'ltr',
  });
  store.setModel({ ...translationLocaleModel });
  store.setSource({ ...sourceFields });
  shared.clearErrors();
};

const loadTranslationWithoutTags: StoryHandler = (): void => {
  const store = useModelStore();
  const shared = useSharedStore();

  shared.setFromProps(sharedProps);
  shared.setLanguage({
    locale: 'es',
    language: 'Spanish',
    languageDirection: 'ltr',
  });
  store.setModel({ ...translationWithoutTagsModel });
  store.setSource({ ...sourceFieldsWithoutTags });
  shared.clearErrors();
};

const loadBespokeTemplateEdit: StoryHandler = (): void => {
  const store = useModelStore();
  const shared = useSharedStore();

  shared.setFromProps(sharedProps);
  shared.setLanguage(sharedProps.language);
  store.setModel({ ...bespokeEditModel });
  store.setSource({});
  shared.clearErrors();
};
</script>

<docs lang="md">
# Story Edit Details

Details tab for the story editor. Renders title, cover image, description, tags, and (on the
source locale only) classification fields, chapter template, and visibility.

## Variants

- **Source locale** — single-column editable fields including chapter count and visibility
- **Translation locale** — side-by-side editable and read-only columns; source tags shown in read-only column only
- **Translation without tags** — translation mode where the source locale has no tags; both editable and read-only tag fields are empty
- **Single template** — shows read-only Chapter Template when only one template is configured
- **Multiple templates on edit** — read-only Chapter Template even when multiple templates are configured
- **Multiple templates on create** — interactive Chapter Template listbox when more than one template is available
- **Bespoke template on edit** — read-only Chapter Template showing bespoke templates with a "(custom)" suffix

## Props

- `isTranslation` — enables two-column translation layout
- `isEditing` — locks Chapter Template after story creation; when false, template is editable only if multiple templates are available
- `templates` — bundle templates; Chapter Template appears when at least one template is configured
</docs>
