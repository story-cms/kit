<template>
  <section
    :class="[
      'flex w-full items-center gap-y-7 px-3',
      shared.isMainUnderHeader
        ? 'flex-row items-center justify-between py-5'
        : 'flex-col justify-center bg-white pb-[51px] pt-10 shadow',
    ]"
  >
    <div
      :class="[
        'flex items-center text-gray-800',
        shared.isMainUnderHeader ? 'flex-row gap-x-3' : 'flex-col justify-center',
      ]"
    >
      <Link href="/">
        <img
          :src="shared.meta.logo"
          alt="Logo"
          :class="['w-auto', shared.isMainUnderHeader ? 'h-12' : 'h-[100px]']"
        />
      </Link>
      <h1
        :class="[
          'font-semibold',
          shared.isMainUnderHeader ? 'text-2xl leading-8' : 'mt-12 text-4xl leading-10',
        ]"
      >
        Hello
        {{ shared.isMainUnderHeader ? shared.user.name.split(' ')[0] : shared.user.name }}
      </h1>
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <p
          v-show="!shared.isMainUnderHeader"
          class="mt-[14px] text-2xl font-semibold leading-8"
        >
          Welcome to {{ shared.meta.name }}
        </p>
      </Transition>
    </div>
    <div :class="['flex flex-wrap gap-4']">
      <Link
        href="/dashboard/new-page"
        class="flex items-center gap-x-2 rounded-full bg-blue-50 px-3 py-[9px] text-sm font-bold leading-4 text-blue-700 shadow-[0px_1px_2px_0px_#0000000D] hover:bg-blue-100"
      >
        <Icon name="document-add" />
        New Page
      </Link>
      <Link
        href="/dashboard/new-page"
        class="flex items-center gap-x-2 rounded-full bg-blue-50 px-3 py-[9px] text-sm font-bold leading-4 text-blue-700 shadow-[0px_1px_2px_0px_#0000000D] hover:bg-blue-100"
      >
        <Icon name="user-add" />
        New User
      </Link>
      <Link
        href="/dashboard/new-page"
        class="flex items-center gap-x-2 rounded-full bg-blue-50 px-3 py-[9px] text-sm font-bold leading-4 text-blue-700 shadow-[0px_1px_2px_0px_#0000000D] hover:bg-blue-100"
      >
        <Icon name="question-mark-circle" />
        Get Support
      </Link>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { useSharedStore } from '../store';
import Icon from '../shared/icon.vue';

const shared = useSharedStore();
</script>
