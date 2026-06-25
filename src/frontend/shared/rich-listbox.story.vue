<template>
  <Story title="Rich Listbox" group="shared" :layout="{ type: 'grid', width: 480 }">
    <Variant title="Default">
      <RichListbox
        v-model="selected"
        label="Resource Type"
        :options="resourceTypes"
      />
    </Variant>

    <Variant title="Pre-selected">
      <RichListbox
        v-model="visibility"
        label="Visibility"
        :options="visibilityOptions"
      />
    </Variant>

    <Variant title="Read only">
      <RichListbox
        v-model="selected"
        label="Resource Type"
        :options="resourceTypes"
        :is-read-only="true"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Crown, ExternalLink, FileText, Globe, User, Video } from '@lucide/vue';
import RichListbox from './rich-listbox.vue';

const selected = ref('url_link');
const visibility = ref('public');

const resourceTypes = [
  {
    value: 'url_link',
    label: 'URL Link',
    description: 'Link to an external website or resource',
    icon: ExternalLink,
  },
  {
    value: 'video',
    label: 'Video',
    description: 'Upload a video file',
    icon: Video,
  },
  {
    value: 'text',
    label: 'Article',
    description: 'Write a rich-text article',
    icon: FileText,
  },
];

const visibilityOptions = [
  {
    value: 'public',
    label: 'Public',
    description: 'Visible to all users',
    icon: Globe,
  },
  {
    value: 'guests',
    label: 'Guest',
    description: 'Visible to logged-in guests',
    icon: User,
  },
  {
    value: 'leaders',
    label: 'Leader',
    description: 'Restricted to group leaders only',
    icon: Crown,
  },
];
</script>
