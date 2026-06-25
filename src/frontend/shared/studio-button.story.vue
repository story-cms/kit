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
  </Story>
</template>

<script setup lang="ts">
import { Plus } from '@lucide/vue';
import StudioButton from './studio-button.vue';

const handleClick = () => {
  console.log('Studio button clicked');
};
</script>
