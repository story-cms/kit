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

    <Variant title="Secondary">
      <div class="flex flex-col gap-2">
        <StudioButton label="Save Changes" variant="secondary" @click="handleClick" />
        <StudioButton label="Save Changes" variant="secondary" disabled />
      </div>
    </Variant>

    <Variant title="Tertiary">
      <StudioButton label="Cancel" variant="tertiary" @click="handleClick" />
    </Variant>

    <Variant title="Destructive">
      <StudioButton label="Remove" variant="destructive" @click="handleClick" />
    </Variant>

    <Variant title="Icon only">
      <StudioButton aria-label="Save" variant="primary" @click="handleClick">
        <Check class="size-4" aria-hidden="true" />
      </StudioButton>
    </Variant>

    <Variant title="CTA shape">
      <StudioButton label="Get started" shape="cta" @click="handleClick" />
    </Variant>

    <Variant title="CTA shape with icon">
      <StudioButton label="Get started" shape="cta" @click="handleClick">
        <Plus class="size-4" />
      </StudioButton>
    </Variant>

    <Variant title="CTA shape tertiary">
      <StudioButton
        label="Learn more"
        variant="tertiary"
        shape="cta"
        @click="handleClick"
      />
    </Variant>

    <Variant title="Disabled">
      <div class="flex flex-col gap-2">
        <StudioButton label="Request content update" disabled />
        <StudioButton label="Save Changes" variant="secondary" disabled />
        <StudioButton label="Cancel" variant="tertiary" disabled />
        <StudioButton label="Remove" variant="destructive" disabled />
      </div>
    </Variant>

    <Variant title="With tooltip">
      <StudioButton
        label="Publish"
        variant="primary"
        tooltip="You need to make ready 2 more Days to your Edition."
        @click="handleClick"
      />
    </Variant>

    <Variant title="Disabled with tooltip">
      <StudioButton
        label="Publish"
        variant="primary"
        disabled
        tooltip="You need to make ready 2 more Days to your Edition."
      />
    </Variant>

    <Variant title="With tooltip (header-right)">
      <div class="flex justify-end">
        <StudioButton
          label="Publish"
          variant="primary"
          disabled
          tooltip="You need to make ready 2 more Days to your Edition."
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

- **primary** — main call-to-action (forest/lime)
- **secondary** — secondary actions (gray fill)
- **tertiary** — low-emphasis actions (outlined)
- **destructive** — dangerous actions (red)

## Tooltip

- **With tooltip** — optional `tooltip` prop shows a hover label on enabled buttons
- **Disabled with tooltip** — disabled buttons still show the tooltip on hover (used for blocked Publish actions)

## Shape

- **default** — pill shape (`rounded-full`)
- **cta** — call-to-action shape (`rounded-[15px]`, `px-2 py-3` padding); works with any color `variant`
</docs>
