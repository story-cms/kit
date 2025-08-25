<template>
  <Story title="Icon Button" group="shared" :layout="{ type: 'grid', width: 500 }">
    <Variant title="Default">
      <div class="space-y-4">
        <IconButton icon="plus" @tap="() => handleTap('plus')" />
        <div v-if="lastTappedIcon === 'plus'" class="pt-4 text-sm text-green-600">
          ✅ Plus button tapped! (Total taps: {{ tapCount }})
        </div>
      </div>
    </Variant>

    <Variant title="Info Icon">
      <div class="space-y-4">
        <IconButton icon="info" @tap="() => handleTap('info')" />
        <div v-if="lastTappedIcon === 'info'" class="pt-4 text-sm text-green-600">
          ℹ️ Info button tapped! (Total taps: {{ tapCount }})
        </div>
      </div>
    </Variant>

    <Variant title="Delete Icon">
      <div class="space-y-4">
        <IconButton icon="trash" @tap="() => handleTap('trash')" />
        <div v-if="lastTappedIcon === 'trash'" class="pt-4 text-sm text-green-600">
          🗑️ Delete button tapped! (Total taps: {{ tapCount }})
        </div>
      </div>
    </Variant>

    <Variant title="Check Icon">
      <div class="space-y-4">
        <IconButton icon="check" @tap="() => handleTap('check')" />
        <div v-if="lastTappedIcon === 'check'" class="pt-4 text-sm text-green-600">
          ✅ Check button tapped! (Total taps: {{ tapCount }})
        </div>
      </div>
    </Variant>

    <Variant title="Multiple Buttons">
      <div class="space-y-4">
        <div class="flex gap-4">
          <IconButton icon="plus" @tap="() => handleTap('plus')" />
          <IconButton icon="info" @tap="() => handleTap('info')" />
          <IconButton icon="trash" @tap="() => handleTap('trash')" />
          <IconButton icon="check" @tap="() => handleTap('check')" />
        </div>
        <div v-if="lastTappedIcon" class="pt-4 text-sm text-green-600">
          Last tapped: <span class="font-semibold">{{ lastTappedIcon }}</span> (Total
          taps: {{ tapCount }})
        </div>
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import IconButton from './icon-button.vue';

const tapCount = ref(0);
const lastTappedIcon = ref('');

const handleTap = (iconName: string) => {
  tapCount.value++;
  lastTappedIcon.value = iconName;
};
</script>

<docs lang="md">
# Icon Button

A circular button component with an icon that emits a tap event when clicked.

## Usage

```vue
<IconButton icon="plus" @tap="handleTap" />
```

## Props

- `icon` (string, required) - The name of the icon to display

## Events

- `tap` - Emitted when the button is clicked

## Styling

The button has a blue color scheme with hover effects:

- Background: `bg-blue-100` with `hover:bg-blue-200`
- Icon color: `text-blue-800`
- Rounded shape with shadow and padding

## Examples

- **Plus icon** - For adding new items
- **Info icon** - For information/help
- **Delete icon** - For removing items
- **Check icon** - For confirmation/success
</docs>
