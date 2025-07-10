<template>
  <AppLayout>
    <template #header>
      <ContentHeader title="Sticky Header" @delete="onAccomplish" @info="onNeutral">
        <template #actions>
          <button type="button" @click.prevent="onConfirm">Confirm</button>
          <button type="button" @click.prevent="onFail">Fail</button>
        </template>
      </ContentHeader>
    </template>
    <div class="container mx-auto grid w-64 space-y-16 p-3">
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
        incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
        exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      </p>
      <p>
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
        fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
        culpa qui officia deserunt mollit anim id est laborum.
      </p>
      <p>
        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
        doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore
        veritatis et quasi architecto beatae vitae dicta sunt explicabo.
      </p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
        incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
        exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      </p>
      <p>
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
        fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
        culpa qui officia deserunt mollit anim id est laborum.
      </p>
      <p>
        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
        doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore
        veritatis et quasi architecto beatae vitae dicta sunt explicabo.
      </p>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from '../shared/app-layout.vue';
import ContentHeader from '../shared/content-header.vue';
import type { SharedPageProps } from '../../types';
import { ResponseStatus } from '../../constants';
import { useSharedStore } from '../store';

const props = defineProps<SharedPageProps>();
const shared = useSharedStore();
shared.setFromProps(props);

// actions
const onConfirm = () =>
  shared.addMessage(ResponseStatus.Confirmation, 'Draft deleted successfully');

const onAccomplish = () =>
  shared.addMessage(ResponseStatus.Accomplishment, 'All episodes done!');

const onFail = () => shared.addMessage(ResponseStatus.Failure, 'You broke the interwebs');

const onNeutral = () =>
  shared.addMessage(ResponseStatus.Neutral, 'Remember to wash behind your ears');
</script>
