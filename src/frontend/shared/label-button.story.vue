<template>
  <Story title="Label Button" group="shared" :layout="{ type: 'grid', width: 200 }">
    <Variant title="Short Label">
      <div>
        <LabelButton label="Save" @tap="() => handleTap('short')" />
        <div v-if="tappedStates.short" class="mt-2 text-sm text-green-600">
          ✓ Button tapped!
        </div>
      </div>
    </Variant>

    <Variant title="Long Label">
      <div>
        <LabelButton label="Create New Document" @tap="() => handleTap('long')" />
        <div v-if="tappedStates.long" class="mt-2 text-sm text-green-600">
          ✓ Button tapped!
        </div>
      </div>
    </Variant>

    <Variant title="Medium Label">
      <div>
        <LabelButton label="Submit Form" @tap="() => handleTap('medium')" />
        <div v-if="tappedStates.medium" class="mt-2 text-sm text-green-600">
          ✓ Button tapped!
        </div>
      </div>
    </Variant>

    <Variant title="Single Character">
      <div>
        <LabelButton label="X" @tap="() => handleTap('single')" />
        <div v-if="tappedStates.single" class="mt-2 text-sm text-green-600">
          ✓ Button tapped!
        </div>
      </div>
    </Variant>

    <Variant title="Very Long Label">
      <div>
        <LabelButton
          label="This is a very long label that exceeds the short threshold"
          @tap="() => handleTap('veryLong')"
        />
        <div v-if="tappedStates.veryLong" class="mt-2 text-sm text-green-600">
          ✓ Button tapped!
        </div>
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import LabelButton from './label-button.vue';

const tappedStates = ref({
  short: false,
  long: false,
  medium: false,
  single: false,
  veryLong: false,
});

const handleTap = (variant: keyof typeof tappedStates.value) => {
  tappedStates.value[variant] = true;
  setTimeout(() => {
    tappedStates.value[variant] = false;
  }, 2000);
};
</script>

<docs lang="md">
# Label Button

A button component that automatically adjusts its padding based on the label length. Short labels (less than 10 characters) get more horizontal padding for better visual balance.

## Usage

```vue
<LabelButton label="Save" @tap="handleSave" />
```

## Props

- `label` (string, required) - The text to display on the button

## Events

- `tap` - Emitted when the button is clicked

## Behavior

- Labels with less than 10 characters get `px-12` padding
- Labels with 10 or more characters get `px-4` padding
- Button has a blue color scheme with hover effects
- Rounded corners and shadow for modern appearance
</docs>
