<template>
  <Story title="Studio Button" group="shared" :layout="{ type: 'grid', width: 400 }">
    <Variant title="Primary">
      <StudioButton label="Request content update" @click="handleClick" />
    </Variant>

    <Variant title="Primary with icon">
      <StudioButton label="Request content update" @click="handleClick">
        <Plus class="size-4" />
      </StudioButton>
    </Variant>

    <Variant title="Outline">
      <StudioButton label="Cancel" variant="outline" @click="handleClick" />
    </Variant>

    <Variant title="Secondary">
      <StudioButton label="Save Changes" variant="secondary" @click="handleClick" />
    </Variant>

    <Variant title="Green">
      <StudioButton label="Confirm" variant="green" @click="handleClick" />
    </Variant>

    <Variant title="Icon only">
      <StudioButton aria-label="Save" variant="green" @click="handleClick">
        <Check class="size-4" aria-hidden="true" />
      </StudioButton>
    </Variant>

    <Variant title="Blue">
      <StudioButton label="Close" variant="blue" @click="handleClick" />
    </Variant>

    <Variant title="Gray">
      <StudioButton label="Cancel" variant="gray" @click="handleClick" />
    </Variant>

    <Variant title="Red">
      <StudioButton label="Remove" variant="red" @click="handleClick" />
    </Variant>

    <Variant title="Disabled">
      <div class="flex flex-col gap-2">
        <StudioButton label="Request content update" disabled />
        <StudioButton label="Cancel" variant="outline" disabled />
        <StudioButton label="Cancel" variant="gray" disabled />
        <StudioButton label="Remove" variant="red" disabled />
      </div>
    </Variant>

    <Variant title="With tooltip">
      <StudioButton
        label="Publish"
        variant="green"
        tooltip="You need to add 2 more Days to your Edition."
        @click="handleClick"
      />
    </Variant>

    <Variant title="Disabled with tooltip">
      <StudioButton
        label="Publish"
        variant="green"
        disabled
        tooltip="You need to add 2 more Days to your Edition."
      />
    </Variant>

    <Variant title="With tooltip (header-right)">
      <div class="flex justify-end">
        <StudioButton
          label="Publish"
          variant="green"
          disabled
          tooltip="You need to add 2 more Days to your Edition."
        />
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { Check, Plus } from '@lucide/vue';
import StudioButton from './studio-button.vue';

const handleClick = () => {
  console.log('Studio button clicked');
};
</script>

<docs lang="md">
# Studio Button

Shared action button for app headers and forms.

## Variants

- **With tooltip** — optional `tooltip` prop shows a hover label on enabled buttons
- **Disabled with tooltip** — disabled buttons still show the tooltip on hover (used for blocked Publish actions)
</docs>
