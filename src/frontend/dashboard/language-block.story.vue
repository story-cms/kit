<template>
  <Story title="Language block" group="dashboard">
    <Variant title="Uncompleted">
      <LanguageBlock
        :progress="{
          progress: [
            {
              name: 'Interface',
              done: 10,
              draft: 10,
              total: 100,
              lastUpdated: '2025-05-19T15:05:30.732+00:00',
            },
            {
              name: 'Content',
              done: 200,
              draft: 50,
              total: 300,
              lastUpdated: '2025-05-19T15:05:30.732+00:00',
            },
          ],
          language: 'German',
          locale: 'de',
          isReadOnly: false,
        }"
      />
    </Variant>
    <Variant title="Read only">
      <LanguageBlock
        :progress="{
          progress: [
            {
              name: 'Interface',
              done: 10,
              draft: 10,
              total: 100,
              lastUpdated: '2025-05-19T15:05:30.732+00:00',
            },
            {
              name: 'Content',
              done: 200,
              draft: 50,
              total: 300,
              lastUpdated: '2025-05-19T15:05:30.732+00:00',
            },
          ],
          language: 'German',
          locale: 'de',
          isReadOnly: true,
        }"
      />
    </Variant>
    <Variant title="Completed">
      <LanguageBlock
        :progress="{
          progress: [
            {
              name: 'Interface',
              done: 100,
              draft: 0,
              total: 100,
              lastUpdated: '2025-05-19T15:05:30.732+00:00',
            },
            {
              name: 'Content',
              done: 300,
              draft: 0,
              total: 300,
              lastUpdated: '2025-05-19T15:05:30.732+00:00',
            },
          ],
          language: 'German',
          locale: 'de',
          isReadOnly: false,
        }"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import LanguageBlock from './language-block.vue';
</script>
