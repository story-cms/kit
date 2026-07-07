<template>
  <Story title="Invitations index page" group="invitation">
    <Variant title="With invitations" :setup-app="miniSidebar">
      <InvitationsIndex
        :config="sharedProps.config"
        :user="sharedProps.user"
        :language="sharedProps.language"
        :errors="sharedProps.errors"
        :bookmarks="sharedProps.bookmarks"
        :invitations="invitations"
      />
    </Variant>

    <Variant title="Empty" :setup-app="miniSidebar">
      <InvitationsIndex
        :config="sharedProps.config"
        :user="sharedProps.user"
        :language="sharedProps.language"
        :errors="sharedProps.errors"
        :bookmarks="sharedProps.bookmarks"
        :invitations="emptyInvitations"
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

const now = DateTime.now();
const windowStart = now.minus({ days: 3 }).startOf('day').toISO();
const windowEnd = now.plus({ days: 3 }).endOf('day').toISO();
invitations[0].window = `${windowStart}|${windowEnd}`;

const emptyInvitations: InvitationItem[] = [];
</script>

<docs lang="md">
# Invitations index page

Invitations index with search, publication filters, grid/list views, and create action in the header.

## Variants

- **With invitations** — populated list from `mockInvitations`
- **Empty** — no invitations; shows the empty state with heading and helper text
</docs>
