<template>
  <Story title="Translation App Layout" group="shared">
    <Variant title="Role Admin">
      <TranslationAppLayout
        :meta="meta"
        :language="language"
        story-name="Acts"
        :stories="['John', 'Acts']"
        :user="user"
        :chapter-title="'John . 01 . God Came to Earth'"
        :has-edit-review="true"
        :draft-status="'submitted'"
        :show-side-bar="false"
      />
    </Variant>
    <Variant title="Role Editor">
      <TranslationAppLayout
        :meta="meta"
        story-name="Acts"
        :stories="['John', 'Acts']"
        :user="{
          name: 'John Doe',
          initials: 'JD',
          email: 'john@example.com',
          isManager: true,
          isAdmin: true,
          role: 'editor',
        }"
        :language="language"
        :chapter-title="'John . 01 . God Came to Earth'"
        :has-edit-review="true"
        :draft-status="'submitted'"
        :show-side-bar="false"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import TranslationAppLayout from './translation-app-layout.vue';
import type { LanguageSpecification } from '../../interfaces';
import { meta, user } from '../../frontend/test/mocks';

const language: LanguageSpecification = {
  locale: 'es',
  language: 'Espanol',
  languageDirection: 'ltr',
};
</script>
