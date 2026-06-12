<template>
  <tr class="relative">
    <td class="max-w-0 px-3 py-4 align-top text-sm text-gray-800">
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
    <td class="whitespace-nowrap px-3 py-4 align-top text-sm">
      <RingBlock :progress="rowProgress" />
    </td>
    <td class="max-w-0 px-3 py-4 align-top text-sm text-gray-800">
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
          Press the three dots to <br />
          assign team members.
        </p>
      </div>
    </td>
    <td class="max-w-0 px-3 py-4 align-top text-sm font-normal leading-5 text-gray-500">
      <p class="truncate" :title="item.bibleLabel ?? undefined">
        {{ item.bibleLabel ?? '—' }}
      </p>
    </td>
    <td class="py-4 pl-3 pr-4 text-right sm:pr-6">
      <Menu as="div" class="inline-block text-left">
        <MenuButton
          type="button"
          class="cursor-pointer text-gray-400 hover:text-gray-600"
        >
          <Icon name="dots-vertical" class="size-5" />
          <span class="sr-only">Actions for {{ item.language }}</span>
        </MenuButton>
        <transition
          enter-active-class="transition duration-100 ease-out"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition duration-75 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <MenuItems
            class="absolute right-10 top-3 z-10 flex max-w-[250px] flex-col items-start overflow-hidden rounded-md bg-white shadow focus:outline-none"
          >
            <MenuItem v-slot="{ active }">
              <a
                :href="`/${item.locale}/user`"
                :class="menuItemClass(active, 'first')"
              >
                Assign team members
              </a>
            </MenuItem>
            <MenuItem v-slot="{ active }">
              <button
                type="button"
                :class="menuItemClass(active, isSource ? 'last' : 'middle')"
                @click="emit('openBibleTranslations', item)"
              >
                Change Bible translation
              </button>
            </MenuItem>
            <MenuItem v-if="!isSource && deletionMode" v-slot="{ active }">
              <button
                type="button"
                :class="menuItemClass(active, 'last')"
                @click="emit('removeOrRequestDeletion', item)"
              >
                {{
                  deletionMode === 'request'
                    ? 'Request language deletion'
                    : 'Remove language'
                }}
              </button>
            </MenuItem>
          </MenuItems>
        </transition>
      </Menu>
    </td>
  </tr>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import Icon from '../../../shared/icon.vue';
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

const menuItemTextClass = 'text-sm leading-5 font-normal text-gray-800';

const menuItemClass = (active: boolean, position: 'first' | 'middle' | 'last') => [
  menuItemTextClass,
  active ? 'bg-gray-100' : 'bg-white',
  'block w-full whitespace-nowrap px-6 py-2 text-left no-underline',
  position === 'first' ? 'pt-3' : '',
  position === 'last' ? 'pb-3' : '',
];

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
