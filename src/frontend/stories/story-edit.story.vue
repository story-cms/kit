<template>
  <Story title="Story Edit" group="stories">
    <Variant title="Save changes" :setup-app="loadNormalData">
      <StoryEdit
        :config="sharedProps.config"
        :user="sharedProps.user"
        :language="sharedProps.language"
        :errors="{}"
        :bookmarks="sharedProps.bookmarks"
        :model="storyModel"
        :available-resources="availableResources"
        :has-no-content="false"
        :providers="{}"
        :templates="storyTemplates"
      />
    </Variant>

    <Variant title="Save draft" :setup-app="loadNormalData">
      <StoryEdit
        :config="sharedProps.config"
        :user="sharedProps.user"
        :language="sharedProps.language"
        :errors="{}"
        :bookmarks="sharedProps.bookmarks"
        :model="unpublishedModel"
        :available-resources="availableResources"
        :has-no-content="false"
        :providers="{}"
        :templates="storyTemplates"
      />
    </Variant>

    <Variant title="Delete and save" :setup-app="loadNormalData">
      <StoryEdit
        :config="sharedProps.config"
        :user="sharedProps.user"
        :language="sharedProps.language"
        :errors="{}"
        :bookmarks="sharedProps.bookmarks"
        :model="deletableModel"
        :available-resources="availableResources"
        :has-no-content="true"
        :providers="{}"
        :templates="storyTemplates"
      />
    </Variant>

    <Variant title="Delete and save draft" :setup-app="loadNormalData">
      <StoryEdit
        :config="sharedProps.config"
        :user="sharedProps.user"
        :language="sharedProps.language"
        :errors="{}"
        :bookmarks="sharedProps.bookmarks"
        :model="deletableUnpublishedModel"
        :available-resources="availableResources"
        :has-no-content="true"
        :providers="{}"
        :templates="storyTemplates"
      />
    </Variant>

    <Variant title="Empty resources" :setup-app="loadNormalData">
      <StoryEdit
        :config="sharedProps.config"
        :user="sharedProps.user"
        :language="sharedProps.language"
        :errors="{}"
        :bookmarks="sharedProps.bookmarks"
        :model="emptyResourcesModel"
        :available-resources="availableResources"
        :has-no-content="false"
        :providers="{}"
        :templates="storyTemplates"
      />
    </Variant>

    <Variant title="Without sections" :setup-app="loadSectionsTab">
      <StoryEdit
        :config="sharedProps.config"
        :user="sharedProps.user"
        :language="sharedProps.language"
        :errors="{}"
        :bookmarks="sharedProps.bookmarks"
        :model="noSectionsModel"
        :available-resources="availableResources"
        :has-no-content="false"
        :providers="{}"
        :templates="storyTemplates"
      />
    </Variant>

    <Variant title="Resources tab" :setup-app="loadResourcesTab">
      <StoryEdit
        :config="sharedProps.config"
        :user="sharedProps.user"
        :language="sharedProps.language"
        :errors="{}"
        :bookmarks="sharedProps.bookmarks"
        :model="storyModel"
        :available-resources="availableResources"
        :has-no-content="false"
        :providers="{}"
        :templates="storyTemplates"
      />
    </Variant>

    <Variant title="Validation errors on tabs" :setup-app="loadNormalData">
      <StoryEdit
        :config="sharedProps.config"
        :user="sharedProps.user"
        :language="sharedProps.language"
        :errors="validationErrors"
        :bookmarks="sharedProps.bookmarks"
        :model="validationErrorModel"
        :available-resources="availableResources"
        :has-no-content="false"
        :providers="{}"
        :templates="storyTemplates"
      />
    </Variant>

    <Variant title="Translation locale" :setup-app="loadTranslationLocale">
      <StoryEdit
        :config="sharedProps.config"
        :user="sharedProps.user"
        :language="spanishLanguage"
        :errors="{}"
        :bookmarks="sharedProps.bookmarks"
        :model="translationModel"
        :source="translationSource"
        :available-resources="availableResources"
        :has-no-content="false"
        :providers="{}"
        :templates="storyTemplates"
      />
    </Variant>

    <Variant title="Arabic translation locale" :setup-app="loadTranslationLocale">
      <StoryEdit
        :config="sharedProps.config"
        :user="sharedProps.user"
        :language="arabicLanguage"
        :errors="{}"
        :bookmarks="sharedProps.bookmarks"
        :model="arabicTranslationModel"
        :source="translationSource"
        :available-resources="availableResources"
        :has-no-content="false"
        :providers="{}"
        :templates="storyTemplates"
      />
    </Variant>

    <Variant title="Translation without sections" :setup-app="loadTranslationLocale">
      <StoryEdit
        :config="sharedProps.config"
        :user="sharedProps.user"
        :language="spanishLanguage"
        :errors="{}"
        :bookmarks="sharedProps.bookmarks"
        :model="translationWithoutSectionsModel"
        :source="translationSourceWithoutSections"
        :available-resources="availableResources"
        :has-no-content="false"
        :providers="{}"
        :templates="storyTemplates"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import StoryEdit from './story-edit.vue';
import {
  availableResources,
  sampleAttachedResources,
  sharedProps,
  miniSidebar,
} from '../test/mocks';
import { useSharedStore } from '../store';
import type { StoryHandler } from '../shared/helpers';
import type { BundleTemplate, StoryEditProps, StorySection, LanguageSpecification } from '../../types';

const storyTemplates: BundleTemplate[] = [
  {
    id: 'devotion',
    name: 'Devotion',
    fields: [],
  },
  {
    id: 'course',
    name: 'Course',
    fields: [],
  },
  {
    id: 'plan',
    name: 'Plan',
    fields: [],
  },
];

const spanishLanguage: LanguageSpecification = {
  locale: 'es',
  language: 'Spanish',
  languageDirection: 'ltr',
};

const arabicLanguage: LanguageSpecification = {
  locale: 'ar',
  language: 'Arabic - عربى',
  languageDirection: 'rtl',
};

const sampleStorySections: StorySection[] = [
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
];

const storyModel: StoryEditProps['model'] = {
  id: 1,
  title: 'The Gospel of John',
  storyType: 'gospel',
  chapterType: 'chapter',
  coverImage:
    'https://res.cloudinary.com/journeys/image/upload/v1756121793/mountain-placeholder_yuflkz.jpg',
  chapterLimit: 21,
  isPublished: true,
  tags: 'gospel,john,new-testament',
  description:
    '# The Gospel of John\n\nThis is the fourth gospel in the New Testament...',
  sectionType: null,
  visibility: 'public',
  slug: 'gospel-of-john',
  template: 'devotion',
  sections: sampleStorySections,
  resources: sampleAttachedResources,
};

const emptyResourcesModel: StoryEditProps['model'] = {
  ...storyModel,
  title: 'Untitled Story',
  resources: [],
};

const noSectionsModel: StoryEditProps['model'] = {
  ...storyModel,
  sections: [],
};

const unpublishedModel: StoryEditProps['model'] = {
  ...storyModel,
  isPublished: false,
};

const deletableModel: StoryEditProps['model'] = {
  ...storyModel,
  title: 'Untitled Story',
  resources: [],
  isPublished: true,
};

const deletableUnpublishedModel: StoryEditProps['model'] = {
  ...deletableModel,
  isPublished: false,
};

const sectionsWithValidationErrors: StorySection[] = [
  {
    id: 'section-1',
    title: 'Introduction',
    description: 'Opening section of the gospel.',
  },
  {
    id: 'section-2',
    title: '',
    description: 'Section missing a title.',
  },
];

const validationErrorModel: StoryEditProps['model'] = {
  ...storyModel,
  isPublished: false,
  coverImage: '',
  sections: sectionsWithValidationErrors,
};

const validationErrors = {
  'bundle.coverImage': ['The cover image field must have at least 1 character'],
  'bundle.sections.1.title': ['The title field must have at least 1 character'],
};

const translationModel: StoryEditProps['model'] = {
  ...storyModel,
  title: '',
  coverImage: '',
  description: '',
  tags: 'gospel,john,new-testament',
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
  resources: [],
};

const arabicTranslationModel: StoryEditProps['model'] = {
  ...storyModel,
  title: '',
  coverImage: '',
  description: '',
  tags: 'gospel,john,new-testament',
  sections: [
    {
      id: 'section-1',
      title: 'المقدمة',
      description: 'القسم الافتتاحي للإنجيل.',
    },
    {
      id: 'section-2',
      title: '',
      description: '',
    },
  ],
  resources: [],
};

const translationSource = {
  title: storyModel.title,
  coverImage: storyModel.coverImage,
  description: storyModel.description,
  tags: storyModel.tags,
  sections: sampleStorySections,
  resources: sampleAttachedResources,
} as NonNullable<StoryEditProps['source']>;

const translationWithoutSectionsModel: StoryEditProps['model'] = {
  ...translationModel,
  sections: [],
};

const translationSourceWithoutSections = {
  ...translationSource,
  sections: [],
} as NonNullable<StoryEditProps['source']>;

const loadNormalData: StoryHandler = ({ app, story, variant }): void => {
  const shared = useSharedStore();
  shared.setLanguage({
    locale: 'en',
    language: 'English',
    languageDirection: 'ltr',
  });

  miniSidebar({ app, story, variant });
};

const loadResourcesTab: StoryHandler = (context): void => {
  const url = new URL(window.location.href);
  url.searchParams.set('tab', 'Resources');
  window.history.replaceState({}, '', url.toString());
  loadNormalData(context);
};

const loadSectionsTab: StoryHandler = (context): void => {
  const url = new URL(window.location.href);
  url.searchParams.set('tab', 'Sections');
  window.history.replaceState({}, '', url.toString());
  loadNormalData(context);
};

const loadTranslationLocale: StoryHandler = (context): void => {
  const url = new URL(window.location.href);
  url.searchParams.delete('tab');
  window.history.replaceState({}, '', url.toString());
  loadNormalData(context);
};
</script>

<docs lang="md">
# Story Edit

Full-page story editor with tabbed navigation for Details, Sections, and Resources.
Saving posts attached resource IDs to the story localisation.

## Variants

- **Save changes** — published story with content; shows Save Changes only (`secondary`)
- **Delete and save** — empty story, published; shows Delete (`red`) and Save Changes (`secondary`)
- **Delete and save draft** — empty story, unpublished; shows Delete (`red`) and Save Changes (`secondary`)
- **Without sections** — English source locale with no sections; Sections tab shows empty state message
- **Validation errors on tabs** — failed publish validation; Details and Sections tabs show error indicators and inline field messages
- **Translation locale** — Spanish edit with English source column; tags prefilled from source on Details tab
- **Arabic translation locale** — Arabic edit on the left, English source on the right; RTL text in the translation column; side-by-side fields on Details and Sections tabs
- **Translation without sections** — Spanish edit with English source column; source localisation has no sections, so the Sections tab is empty

## Usage

```vue
<StoryEdit
  :config="config"
  :user="user"
  :language="language"
  :errors="errors"
  :bookmarks="bookmarks"
  :model="model"
  :available-resources="availableResources"
  :has-no-content="hasNoContent"
  :templates="templates"
  :providers="providers"
/>
```
</docs>
