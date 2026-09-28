<template>
  <Story title="Tokens Index" group="settings">
    <Variant title="Default" :setup-app="setupTokens">
      <TokensIndex
        :config="sharedProps.config"
        :user="sharedProps.user"
        :language="sharedProps.language"
        :errors="sharedProps.errors"
        :bookmarks="sharedProps.bookmarks"
        :pool-total="mockTokenPoolTotal"
        :pots="mockTokenPots"
        :daily-usage="mockDailyTokenUsage"
        :transactions="mockTokenTransactions"
      />
    </Variant>
    <Variant title="Many transactions" :setup-app="setupTokens">
      <TokensIndex
        :config="sharedProps.config"
        :user="sharedProps.user"
        :language="sharedProps.language"
        :errors="sharedProps.errors"
        :bookmarks="sharedProps.bookmarks"
        :pool-total="mockTokenPoolTotal"
        :pots="mockTokenPots"
        :daily-usage="mockDailyTokenUsage"
        :transactions="mockTokenTransactionsLarge"
      />
    </Variant>
    <Variant title="Empty" :setup-app="setupTokens">
      <TokensIndex
        :config="sharedProps.config"
        :user="sharedProps.user"
        :language="sharedProps.language"
        :errors="sharedProps.errors"
        :bookmarks="sharedProps.bookmarks"
        :pool-total="0"
        :pots="[]"
        :daily-usage="[]"
        :transactions="[]"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import TokensIndex from './tokens-index.vue';
import {
  sharedProps,
  miniSidebar,
  mockDailyTokenUsage,
  mockTokenPoolTotal,
  mockTokenPots,
  mockTokenTransactions,
  mockTokenTransactionsLarge,
} from '../../test/mocks';
import type { StoryHandler } from '../../shared/helpers';

const setupTokens: StoryHandler = ({ app, story, variant }) => {
  miniSidebar({ app, story, variant });
};
</script>
