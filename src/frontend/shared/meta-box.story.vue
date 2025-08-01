<template>
  <Story title="Meta Box" group="shared">
    <Variant title="Default">
      <MetaBox
        :primary="[
          { label: 'Story', value: 'Adam & Eve' },
          { label: 'Chapter', value: '01 of 42' },
          { label: 'Published', value: '2021-10-10T14:48:00.000000Z' },
        ]"
        :secondary="[
          { label: 'Created', value: '2023-10-04 15:50:45.587+03' },
          { label: 'Auto-Saved', value: '2023-10-18 11:24:49.216+03' },
          { label: 'Last Published', value: '2021-10-10T14:48:00.000000Z' },
        ]"
      />
    </Variant>
    <Variant title="Wrapping story title">
      <MetaBox
        :primary="[
          { label: 'Story', value: 'The long wrapping title' },
          { label: 'Chapter', value: '01 of 42' },
          { label: 'Published', value: '2021-10-10T14:48:00.000000Z' },
        ]"
        :secondary="[
          { label: 'Created', value: '2023-10-04 15:50:45.587+03' },
          { label: 'Auto-Saved', value: '2023-10-18 11:24:49.216+03' },
          { label: 'Last Published', value: '2021-10-10T14:48:00.000000Z' },
        ]"
      />

      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import MetaBox from './meta-box.vue';
</script>
