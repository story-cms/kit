<template>
  <Story title="Invitation index item" group="invitation">
    <Variant title="Grid">
      <InvitationIndexItem :invitation="invitation" view-mode="grid" />
    </Variant>
    <Variant title="Grid without title">
      <InvitationIndexItem :invitation="invitationWithoutTitle" view-mode="grid" />
    </Variant>
    <Variant title="List row">
      <div class="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table class="w-full min-w-[720px] table-auto">
          <thead class="border-b border-gray-200 bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Invitation
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Regions
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Start
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                End
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Status
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <InvitationIndexItem :invitation="invitation" view-mode="list" />
          </tbody>
        </table>
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import type { InvitationItem } from '../../types';
import InvitationIndexItem from './invitation-index-item.vue';

const invitation = {
  id: 1,
  name: 'Giving Tuesday',
  regions: 'CX, KE, UG, ZM',
  window: '2026-01-08T02:58:00.000Z|2026-01-24T02:58:00.000Z',
  isPublished: true,
} as InvitationItem;

const invitationWithoutTitle = {
  id: 2,
  regions: 'CX, KE, UG, ZM',
  isPublished: false,
} as InvitationItem;
</script>
