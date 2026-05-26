<template>
  <Story title="Invitations index page" group="invitation">
    <Variant title="Index" :setup-app="miniSidebar">
      <InvitationsIndex
        :config="sharedProps.config"
        :user="sharedProps.user"
        :language="sharedProps.language"
        :errors="sharedProps.errors"
        :bookmarks="sharedProps.bookmarks"
        :invitations="invitations"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import InvitationsIndex from './invitations-index.vue';
import { sharedProps, miniSidebar, mockInvitations } from '../test/mocks';
import type { InvitationItem } from '../../types';
import { DateTime } from 'luxon';

const invitations: InvitationItem[] = mockInvitations;

// Set the first invitation's window to include today
const now = DateTime.now();
const windowStart = now.minus({ days: 3 }).startOf('day').toISO();
const windowEnd = now.plus({ days: 3 }).endOf('day').toISO();
invitations[0].window = `${windowStart}|${windowEnd}`;
</script>
