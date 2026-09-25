<template>
  <Story title="Settings Tab Nav" group="shared">
    <Variant title="Both subscribed, Languages active" :setup-app="loadBoth">
      <SettingsTabNav active="languages" />
    </Variant>
    <Variant title="Both subscribed, AI tokens active" :setup-app="loadBoth">
      <SettingsTabNav active="tokens" />
    </Variant>
    <Variant title="Languages only" :setup-app="loadLanguagesOnly">
      <SettingsTabNav active="languages" />
    </Variant>
    <Variant title="AI tokens only" :setup-app="loadTokensOnly">
      <SettingsTabNav active="tokens" />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import SettingsTabNav from './settings-tab-nav.vue';
import { sharedProps, config } from '../test/mocks';
import { useSharedStore } from '../store';
import type { StoryHandler } from './helpers';
import type { Subscription } from '../../types';

const loadWithSubscriptions = (subscriptions: Subscription[]): StoryHandler => {
  return (): void => {
    const shared = useSharedStore();
    shared.setFromProps({
      ...sharedProps,
      config: { ...config, subscriptions },
    });
  };
};

const loadBoth = loadWithSubscriptions([...config.subscriptions, 'languages-settings', 'tokens']);
const loadLanguagesOnly = loadWithSubscriptions([...config.subscriptions, 'languages-settings']);
const loadTokensOnly = loadWithSubscriptions([...config.subscriptions, 'tokens']);
</script>

<docs lang="md">
# Settings Tab Nav

Each tab is gated by its own `config.subscriptions` entry: "Languages" requires
`'languages-settings'`, "AI tokens" requires `'tokens'`. The two are independent — an account can
have either, both, or neither.
</docs>
