<template>
  <Story title="Navigation Bar" group="shared">
    <Variant title="SingleStory SingleLanguage Editor" :setup-app="loadData">
      <HeaderBar />
    </Variant>
    <Variant title="MultiStory SingleLanguage Editor" :setup-app="loadData">
      <HeaderBar />
    </Variant>
    <Variant title="MultiStory MultiLanguage Editor" :setup-app="loadData">
      <HeaderBar />
    </Variant>
    <Variant title="MultiStory MultiLanguage Admin" :setup-app="loadData">
      <HeaderBar />
    </Variant>
    <Variant title="SingleStory MultiLanguage Editor" :setup-app="loadData">
      <HeaderBar />
    </Variant>
    <Variant title="SingleStory MultiLanguage Admin" :setup-app="loadData">
      <HeaderBar />
    </Variant>
    <Variant title="SingleStory SingleLanguage Admin" :setup-app="loadData">
      <HeaderBar />
    </Variant>
    <Variant title="MultiStory SingleLanguage Admin" :setup-app="loadData">
      <HeaderBar />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import HeaderBar from './header-bar.vue';
import { useSharedStore } from '../store';
import { sharedProps, meta } from '../test/mocks';
import type { StoryHandler } from '../shared/helpers';

const loadData: StoryHandler = ({ variant }): void => {
  const shared = useSharedStore();

  shared.setFromProps(sharedProps);

  if (variant?.title === 'SingleStory SingleLanguage Editor') {
    shared.meta = meta;
    shared.languages = [
      {
        locale: 'en',
        language: 'English',
        languageDirection: 'ltr',
      },
    ];
    shared.stories = ['John'];
    shared.user.isAdmin = false;
    shared.user.isManager = false;
    shared.user.role = 'admin';
    shared.user.language = '*';
  }
  if (variant?.title === 'MultiStory SingleLanguage Editor') {
    shared.meta = meta;
    shared.languages = [
      {
        locale: 'en',
        language: 'English',
        languageDirection: 'ltr',
      },
    ];
    shared.user.isAdmin = false;
    shared.user.isManager = false;
    shared.user.role = 'admin';
    shared.user.language = '*';
  }
  if (variant?.title === 'MultiStory MultiLanguage Editor') {
    shared.meta = meta;
    shared.user.isAdmin = false;
    shared.user.isManager = false;
    shared.user.role = 'admin';
    shared.user.language = '*';
  }

  if (variant?.title === 'MultiStory MultiLanguage Admin') {
    shared.meta = meta;
    shared.user.isAdmin = true;
    shared.user.isManager = true;
    shared.user.role = 'admin';
    shared.user.language = '*';
  }
  if (variant?.title === 'SingleStory MultiLanguage Editor') {
    shared.meta = meta;
    shared.stories = ['John'];
    shared.user.isAdmin = false;
    shared.user.isManager = false;
    shared.user.role = 'editor';
    shared.user.language = '*';
  }

  if (variant?.title === 'SingleStory MultiLanguage Admin') {
    shared.meta = meta;
    shared.stories = ['John'];
    shared.user.isAdmin = true;
    shared.user.isManager = true;
    shared.user.role = 'admin';
    shared.user.language = '*';
  }
  if (variant?.title === 'SingleStory SingleLanguage Admin') {
    shared.meta = meta;
    shared.languages = [
      {
        locale: 'en',
        language: 'English',
        languageDirection: 'ltr',
      },
    ];
    shared.stories = ['John'];
    shared.user.isAdmin = true;
    shared.user.isManager = false;
    shared.user.role = 'admin';
    shared.user.language = '*';
  }

  if (variant?.title === 'MultiStory SingleLanguage Admin') {
    shared.meta = meta;
    shared.languages = [
      {
        locale: 'en',
        language: 'English',
        languageDirection: 'ltr',
      },
    ];
    shared.user.isAdmin = true;
    shared.user.isManager = true;
    shared.user.role = 'admin';
    shared.user.language = '*';
  }
  if (variant?.title === 'Admin All') {
    shared.meta = meta;
    shared.user.isAdmin = true;
    shared.user.isManager = true;
    shared.user.role = 'admin';
    shared.user.language = '*';
  }
};
</script>
