<template>
  <Story title="App Layout Header" group="shared">
    <Variant title="Glass header" :setup-app="resetMessages">
      <div class="bg-gray-50 p-6">
        <AppLayoutHeader title="Glass Header" subtitle="This is a subtitle">
          <template #actions>
            <StudioButton label="Cancel" variant="outline" />
            <StudioButton label="Request content update">
              <Plus class="size-6" />
            </StudioButton>
          </template>
          <template #controls>
            <p>Controls</p>
          </template>
        </AppLayoutHeader>
      </div>
    </Variant>

    <Variant title="Title only" :setup-app="resetMessages">
      <div class="bg-gray-50 p-6">
        <AppLayoutHeader title="Content Library" />
      </div>
    </Variant>

    <Variant title="Settings page" :setup-app="resetMessages">
      <div class="bg-gray-50 p-6">
        <AppLayoutHeader title="Settings" subtitle="Add new languages">
          <template #actions>
            <StudioButton label="Request content update">
              <Plus class="size-6" />
            </StudioButton>
          </template>
          <template #controls>
            <p>Controls</p>
          </template>
        </AppLayoutHeader>
      </div>
    </Variant>

    <Variant title="Draft page" :setup-app="resetMessages">
      <div class="bg-gray-50 p-6">
        <AppLayoutHeader
          title="Draft"
          subtitle="My Story <span>.</span> 01 <span>.</span> Chapter title"
        >
          <template #actions>
            <StudioButton label="Save" variant="secondary" />
          </template>
        </AppLayoutHeader>
      </div>
    </Variant>

    <Variant title="With description" :setup-app="resetMessages">
      <div class="bg-gray-50 p-6">
        <AppLayoutHeader title="Settings" subtitle="Add new languages">
          <template #description>
            <p class="text-sm font-normal leading-5 text-black">
              Select languages you would like to add.
            </p>
          </template>
          <template #actions>
            <StudioButton label="Add" />
          </template>
        </AppLayoutHeader>
      </div>
    </Variant>

    <Variant title="Interactive feedback" :setup-app="resetMessages">
      <div class="bg-gray-50 p-6">
        <AppLayoutHeader title="Sticky Header">
          <template #actions>
            <div class="flex gap-2">
              <StudioButton label="Confirm" variant="outline" @click.prevent="onConfirm" />
              <StudioButton
                label="Accomplish"
                variant="outline"
                @click.prevent="onAccomplish"
              />
              <StudioButton label="Fail" variant="outline" @click.prevent="onFail" />
              <StudioButton label="Neutral" variant="outline" @click.prevent="onNeutral" />
            </div>
          </template>
        </AppLayoutHeader>
      </div>
    </Variant>

    <Variant title="Failure" :setup-app="showFailure">
      <div class="bg-gray-50 p-6">
        <AppLayoutHeader />
      </div>
    </Variant>

    <Variant title="Confirmation" :setup-app="showConfirmation">
      <div class="bg-gray-50 p-6">
        <AppLayoutHeader />
      </div>
    </Variant>

    <Variant title="Accomplishment" :setup-app="showAccomplishment">
      <div class="bg-gray-50 p-6">
        <AppLayoutHeader />
      </div>
    </Variant>

    <Variant title="Neutral" :setup-app="showNeutral">
      <div class="bg-gray-50 p-6">
        <AppLayoutHeader />
      </div>
    </Variant>

    <Variant title="Feedback with description" :setup-app="showWithDescription">
      <div class="bg-gray-50 p-6">
        <AppLayoutHeader />
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { Plus } from '@lucide/vue';
import AppLayoutHeader from './app-layout-header.vue';
import StudioButton from './studio-button.vue';
import { useSharedStore } from '../store';
import { ResponseStatus } from '../../types';
import type { StoryHandler } from './helpers';

const shared = useSharedStore();

const resetMessages: StoryHandler = (): void => {
  shared.messageCentre.response = ResponseStatus.None;
  shared.messageCentre.message = '';
  shared.messageCentre.description = undefined;
  shared.setHeaderSize(0, 0);
};

const showFeedback = (
  response: ResponseStatus,
  message: string,
  description?: string,
): StoryHandler => {
  return (): void => {
    shared.messageCentre.response = response;
    shared.messageCentre.message = message;
    shared.messageCentre.description = description;
    shared.setHeaderSize(72, 800);
  };
};

const showFailure = showFeedback(
  ResponseStatus.Failure,
  'Oh no, you broke the internet',
);
const showConfirmation = showFeedback(ResponseStatus.Confirmation, 'Yes this was done');
const showAccomplishment = showFeedback(
  ResponseStatus.Accomplishment,
  'You achieved a thing!',
);
const showNeutral = showFeedback(ResponseStatus.Neutral, 'Neutral feedback point');
const showWithDescription = showFeedback(
  ResponseStatus.Accomplishment,
  'Language added',
  'Remember, once you’ve translated your content you’ll need to request an app update to make these live for your users.',
);

const onConfirm = () =>
  shared.addMessage(ResponseStatus.Confirmation, 'Draft deleted successfully');

const onAccomplish = () =>
  shared.addMessage(ResponseStatus.Accomplishment, 'All episodes done!');

const onFail = () => shared.addMessage(ResponseStatus.Failure, 'You broke the interwebs');

const onNeutral = () =>
  shared.addMessage(ResponseStatus.Neutral, 'Remember to wash behind your ears');
</script>

<docs lang="md">
# App Layout Header

Sticky layout header used inside `AppLayout`. Renders a glass-style title header by default and swaps to `MessageCentre` when feedback is active.

## Usage

```vue
<AppLayout title="Resource Library" subtitle="Manage Resources">
  <template #actions>
    <StudioButton label="Create Resource" />
  </template>
  <template #controls>
    <p>Controls</p>
  </template>
  <template #main>
    <section>...</section>
  </template>
</AppLayout>
```

## Props

- `title` - Uppercase label shown above the subtitle
- `subtitle` - Primary page heading

## Slots

- `main` - Page content rendered inside the layout `<main>` element
- `actions` - Header action buttons
- `controls` - Secondary controls below the title row
- `description` - Optional helper text below the subtitle
</docs>
