<template>
  <tr class="relative">
    <td
      class="flex flex-col whitespace-nowrap px-3 py-4 text-sm text-gray-800"
      :class="{ 'gap-2': !isSource }"
    >
      <LangStrip :spec="item" />
      <p
        v-if="isSource"
        class="text-xs font-normal uppercase leading-5 tracking-[0em] text-gray-500"
      >
        Source language
      </p>
    </td>
    <td class="whitespace-nowrap px-3 py-4 align-top text-sm">
      <RingBlock :progress="rowProgress" />
    </td>
    <td class="px-3 py-4 align-top text-sm text-gray-800">
      <div v-if="item.teamMembers?.length" class="flex flex-col gap-1">
        <MemberRow
          v-for="member in item.teamMembers"
          :key="member.id"
          :name="member.name"
          :email="member.email"
        />
      </div>
      <div v-else class="flex flex-col text-xs font-medium leading-4">
        <p class="text-black">No team members yet</p>
        <p class="text-gray-500">
          Press the three dots to <br />
          assign team members.
        </p>
      </div>
    </td>
    <td class="whitespace-nowrap px-3 py-4 text-sm font-normal leading-5 text-gray-500">
      {{ truncate(item.bibleLabel, 30) }}
    </td>
    <td class="py-4 pl-3 pr-4 text-right sm:pr-6">
      <button
        type="button"
        class="cursor-pointer text-gray-400 hover:text-gray-600"
        @click="emit('toggleActions', item.locale)"
      >
        <Icon name="dots-vertical" class="size-5" />
      </button>
      <div
        v-show="openActionsLocale === item.locale"
        class="absolute right-10 top-3 z-10 flex max-w-[250px] flex-col items-start overflow-hidden rounded-md bg-white shadow"
      >
        <a
          :href="`/${item.locale}/user`"
          class="w-full px-6 py-2 pt-3 text-left text-sm font-normal leading-5 text-gray-800 hover:bg-gray-100"
        >
          Assign team members
        </a>
        <button
          class="w-full px-6 py-2 text-left text-sm font-normal leading-5 text-gray-800 hover:bg-gray-100"
          :class="{ 'pb-3': isSource }"
          @click="emit('openBibleTranslations', item)"
        >
          Change Bible translation
        </button>
        <button
          v-if="!isSource"
          class="w-full px-6 py-2 pb-3 text-left text-sm font-normal leading-5 text-gray-800 hover:bg-gray-100"
          @click="emit('removeOrRequestDeletion', item)"
        >
          {{ hasContent(item) ? 'Request language deletion' : 'Remove language' }}
        </button>
      </div>
    </td>
  </tr>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Icon from '../../../shared/icon.vue';
import MemberRow from './member-row.vue';
import RingBlock from '../../../dashboard/ring-block.vue';
import LangStrip from './language-strip.vue';
import type { LanguageTableItem } from '../../../../types';

const props = withDefaults(
  defineProps<{
    item: LanguageTableItem;
    isSource?: boolean;
    openActionsLocale: string | null;
  }>(),
  { isSource: false },
);

const emit = defineEmits<{
  toggleActions: [locale: string];
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

const truncate = (s: string | null | undefined, max: number) => {
  const text = s ?? '—';
  return text.length > max ? `${text.slice(0, max)}…` : text;
};

const hasContent = (item: LanguageTableItem) => {
  const content = item.translationProgress?.find((p) => p.name === 'Content');
  const ui = item.translationProgress?.find((p) => p.name === 'Interface');
  return (content?.done ?? 0) > 0 || (ui?.done ?? 0) > 0;
};
</script>
