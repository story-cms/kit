<template>
  <div>
    <div class="mb-4">
      <SelectField
        :rootPath="props.rootPath"
        :field="{
          label: 'Note Type',
          name: 'type',
          widget: 'select',
          options: [
            { label: 'Q&A / Explanation', value: 'comment' },
            { label: 'To Think About', value: 'reflection' },
            { label: 'Key Point', value: 'keyPoint' },
            { label: 'Cue', value: 'cue' },
            { label: 'Word Definition / Observation', value: 'definition' },
          ],
          default: 'comment',
        }"
        :is-nested="true"
        :is-read-only="isReadOnly"
      />
    </div>
    <MarkdownField
      :rootPath="props.rootPath"
      v-if="showToolbar"
      :field="{
        label: 'Note Frame',
        name: 'content',
        widget: 'markdown',
        toolbar: [
          'bold',
          'italic',
          'code',
          'unordered-list',
          'ordered-list',
          '|',
          'guide',
        ],
      }"
      :is-nested="true"
      :is-read-only="isReadOnly"
    />
    <MarkdownField
      v-else
      :rootPath="props.rootPath"
      :field="{
        label: 'Content',
        name: 'content',
        widget: 'markdown',
        toolbar: [],
        minimal: true,
      }"
      :is-nested="true"
      :is-read-only="isReadOnly"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  MarkdownField,
  SelectField,
  commonProps,
  useModelStore,
} from '@story-cms/kit/ui';

const props = defineProps({
  ...commonProps,
});

const model = useModelStore();
const selectPath = computed(() => {
  if (props.rootPath === undefined) return 'type';
  return `${props.rootPath}.type`;
});

const selection = props.isReadOnly
  ? ref(model.getSourceField(selectPath.value, 'comment'))
  : ref(model.getField(selectPath.value, 'comment'));

const showToolbar = computed(() => {
  if (selection.value === 'reflection') return false;
  if (selection.value === 'keyPoint') return false;
  if (selection.value === 'cue') return false;
  return true;
});

model.$subscribe(() => {
  if (props.isReadOnly) return;

  selection.value = model.getField(selectPath.value, 'comment');
});
</script>
