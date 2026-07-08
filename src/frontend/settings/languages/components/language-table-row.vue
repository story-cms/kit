<template>
  <tr class="transition-colors hover:bg-gray-50">
    <td class="max-w-[400px] px-6 py-4 align-top text-sm text-gray-800">
      <div class="flex min-w-0 flex-col" :class="{ 'gap-2': !isSource }">
        <div class="min-w-0 [&_p]:truncate">
          <LangStrip :spec="item" />
        </div>
        <p
          v-if="isSource"
          class="truncate text-xs font-normal uppercase leading-5 tracking-[0em] text-gray-500"
        >
          Source language
        </p>
      </div>
    </td>
    <td class="whitespace-nowrap px-6 py-4 align-top text-sm">
      <RingBlock :progress="rowProgress" />
    </td>
    <td class="max-w-[400px] px-6 py-4 align-top text-sm text-gray-800">
      <div v-if="item.teamMembers?.length" class="flex min-w-0 flex-col gap-1">
        <MemberRow
          v-for="member in item.teamMembers"
          :key="member.id"
          class="min-w-0 [&_p]:truncate"
          :name="member.name"
          :email="member.email"
        />
      </div>
      <div v-else class="flex flex-col text-xs font-medium leading-4">
        <p class="text-black">No team members yet</p>
        <p class="text-gray-500">
          Use the team icon to <br />
          assign team members.
        </p>
      </div>
    </td>
    <td class="whitespace-nowrap px-6 py-4 align-top text-sm font-normal leading-5 text-gray-500">
      <p class="truncate" :title="item.bibleLabel ?? undefined">
        {{ item.bibleLabel ?? '—' }}
      </p>
    </td>
    <td class="whitespace-nowrap px-6 py-4 text-right">
      <div class="flex items-center justify-end gap-2">
        <a
          :href="`/${item.locale}/user`"
          class="rounded-xl p-1.5 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
          aria-label="Assign team members"
        >
          <Users class="size-4" aria-hidden="true" />
        </a>
        <button
          type="button"
          class="rounded-xl p-1.5 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
          aria-label="Change Bible translation"
          @click="emit('openBibleTranslations', item)"
        >
          <BookOpen class="size-4" aria-hidden="true" />
        </button>
        <button
          v-if="!isSource && deletionMode"
          type="button"
          class="rounded-xl p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
          :aria-label="
            deletionMode === 'request' ? 'Request language deletion' : 'Remove language'
          "
          @click="emit('removeOrRequestDeletion', item)"
        >
          <Trash2 class="size-4" aria-hidden="true" />
        </button>
      </div>
    </td>
  </tr>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { BookOpen, Trash2, Users } from '@lucide/vue';
import MemberRow from './member-row.vue';
import RingBlock from '../../../dashboard/ring-block.vue';
import LangStrip from './language-strip.vue';
import type { LanguageTableItem } from '../../../../types';

const props = withDefaults(
  defineProps<{
    item: LanguageTableItem;
    isSource?: boolean;
    deletionMode?: 'remove' | 'request';
  }>(),
  { isSource: false, deletionMode: undefined },
);

const emit = defineEmits<{
  openBibleTranslations: [item: LanguageTableItem];
  removeOrRequestDeletion: [item: LanguageTableItem];
}>();

const rowProgress = computed(() => {
  if (props.isSource) {
    const content = props.item.translationProgress?.find(
      (progress) => progress.name === 'Content',
    );
    return [content ?? { name: 'Content', done: 0, draft: 0, total: 0 }];
  }
  return props.item.translationProgress ?? [];
});
</script>
