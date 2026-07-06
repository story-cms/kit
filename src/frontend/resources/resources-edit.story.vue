<template>
  <Story title="Resource edit" group="resources">
    <Variant title="New resource" :setup-app="miniSidebar">
      <ResourcesEdit
        :config="sharedProps.config"
        :user="sharedProps.user"
        :language="sharedProps.language"
        :errors="sharedProps.errors"
        :bookmarks="sharedProps.bookmarks"
        v-bind="mockNewResourceEdit"
      />
    </Variant>

    <Variant title="Edit text" :setup-app="miniSidebar">
      <ResourcesEdit
        :config="sharedProps.config"
        :user="sharedProps.user"
        :language="sharedProps.language"
        :errors="sharedProps.errors"
        :bookmarks="sharedProps.bookmarks"
        v-bind="mockEditTextResource"
      />
    </Variant>

    <Variant title="With story usages" :setup-app="miniSidebar">
      <ResourcesEdit
        :config="sharedProps.config"
        :user="sharedProps.user"
        :language="sharedProps.language"
        :errors="sharedProps.errors"
        :bookmarks="sharedProps.bookmarks"
        v-bind="mockEditTextResourceWithUsages"
      />
    </Variant>

    <Variant title="Empty usages" :setup-app="miniSidebar">
      <ResourcesEdit
        :config="sharedProps.config"
        :user="sharedProps.user"
        :language="sharedProps.language"
        :errors="sharedProps.errors"
        :bookmarks="sharedProps.bookmarks"
        v-bind="mockEditUrlLinkResourceEmptyUsages"
      />
    </Variant>

    <Variant title="Edit URL" :setup-app="miniSidebar">
      <ResourcesEdit
        :config="sharedProps.config"
        :user="sharedProps.user"
        :language="sharedProps.language"
        :errors="sharedProps.errors"
        :bookmarks="sharedProps.bookmarks"
        v-bind="mockEditUrlLinkResource"
      />
    </Variant>

    <Variant title="Edit video" :setup-app="miniSidebar">
      <ResourcesEdit
        :config="sharedProps.config"
        :user="sharedProps.user"
        :language="sharedProps.language"
        :errors="sharedProps.errors"
        :bookmarks="sharedProps.bookmarks"
        v-bind="mockEditVideoResource"
      />
    </Variant>

    <Variant title="With errors" :setup-app="miniSidebar">
      <ResourcesEdit
        :config="sharedProps.config"
        :user="sharedProps.user"
        :language="sharedProps.language"
        :errors="mockResourceEditErrors"
        :bookmarks="sharedProps.bookmarks"
        v-bind="mockNewResourceEdit"
      />
    </Variant>

    <Variant title="Arabic locale" :setup-app="miniSidebar">
      <ResourcesEdit
        :config="sharedProps.config"
        :user="sharedProps.user"
        :language="arabicLanguage"
        :errors="sharedProps.errors"
        :bookmarks="sharedProps.bookmarks"
        v-bind="mockArabicEditTextResource"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import ResourcesEdit from './resources-edit.vue';
import {
  sharedProps,
  miniSidebar,
  mockNewResourceEdit,
  mockEditVideoResource,
  mockEditTextResource,
  mockEditUrlLinkResource,
  mockEditTextResourceWithUsages,
  mockEditUrlLinkResourceEmptyUsages,
  mockResourceEditErrors,
} from '../test/mocks';
import type { LanguageSpecification, ResourceEditProps } from '../../types';

const arabicLanguage: LanguageSpecification = {
  locale: 'ar',
  language: 'Arabic - عربى',
  languageDirection: 'rtl',
};

const mockArabicEditTextResource: ResourceEditProps = {
  ...mockEditTextResourceWithUsages,
  bundle: {
    ...mockEditTextResourceWithUsages.bundle,
    title: 'المشكلة الإنجيلية التوافقية',
    description: 'مقدمة موجزة للمشكلة الإنجيلية التوافقية.',
    label: 'قراءة تكميلية',
    content:
      '## نظرة عامة\n\nتقدّم هذه المقالة المشكلة الإنجيلية التوافقية وتقارن بين الفرضيات العلمية الرئيسية.\n\n- فرضية المصدرين\n- فرضية فارر\n- فرضية أوغستانية',
  },
  usedInStories: [
    { storyId: 1, title: 'أسس الكتاب المقدس' },
    { storyId: 2, title: 'إنجيل يوحنا' },
  ],
};
</script>
