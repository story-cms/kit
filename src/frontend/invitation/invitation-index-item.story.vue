<template>
  <Story title="Invitation index item" group="invitation">
    <Variant title="With model">
      <InvitationIndexItem :invitation="invitation" />
    </Variant>
    <Variant title="Without title">
      <InvitationIndexItem :invitation="invitationWithoutTitle" />
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
