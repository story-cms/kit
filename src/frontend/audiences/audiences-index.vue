<template>
  <AppLayout>
    <template #header>
      <ContentHeader title="Audience"> </ContentHeader>
    </template>
    <div>
      <section class="mt-8 flow-root">
        <div class="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
          <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div class="border-2 border-black/5 sm:rounded-lg">
              <table class="min-w-full divide-y divide-gray-300">
                <thead class="bg-gray-50 uppercase">
                  <tr>
                    <th
                      scope="col"
                      class="py-3 pl-4 pr-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 sm:pl-6"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      class="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
                    >
                      Last Login
                    </th>
                    <th
                      scope="col"
                      class="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
                    >
                      Created At
                    </th>

                    <th
                      scope="col"
                      class="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
                      v-for="title in extraColumnTitles"
                      :key="title"
                    >
                      {{ title }}
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white">
                  <tr v-for="audience in audiences" :key="audience.uid">
                    <AudienceRow :audience="audience" :extra-columns="extraColumns" />
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import AppLayout from '../shared/app-layout.vue';
import ContentHeader from '../shared/content-header.vue';

import AudienceRow from './components/audience-row.vue';
import type { SharedPageProps, AudiencesProps, AudienceMeta } from '../../types';
import { useSharedStore } from '../store';

const props = defineProps<AudiencesProps & SharedPageProps>();

/** Fixed audience table fields; any other keys on row objects are treated as extra columns. */
const AUDIENCE_META_KEYS = [
  'uid',
  'name',
  'email',
  'photoURL',
  'signUpDate',
  'lastSignInTime',
] as const satisfies readonly (keyof AudienceMeta)[];

type _AssertAudienceMetaKeysExhaustive =
  Exclude<keyof AudienceMeta, (typeof AUDIENCE_META_KEYS)[number]> extends never
    ? true
    : never;
const _audienceMetaKeysExhaustive: _AssertAudienceMetaKeysExhaustive = true;
void _audienceMetaKeysExhaustive;

const standardAudienceKeys = new Set<string>(AUDIENCE_META_KEYS);

const extraColumns = computed(() => {
  if (props.audiences.length === 0) return [];
  const user = props.audiences[0];
  return Object.keys(user).filter((key) => !standardAudienceKeys.has(key));
});

const extraColumnTitles = computed(() => {
  return extraColumns.value.map((column): string => {
    // localChurch => "Local church"
    return column.replace(/([A-Z])/g, ' $1').trim();
  });
});

const shared = useSharedStore();
shared.setFromProps(props);
shared.setCurrentStoryName('');
</script>
