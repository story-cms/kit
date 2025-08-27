<template>
  <Story title="Users Page" group="team">
    <Variant title="Index" :setup-app="miniSidebar">
      <UsersIndex
        :users="users"
        :errors="sharedProps.errors"
        :meta="sharedProps.meta"
        :user="sharedProps.user"
        :language="sharedProps.language"
        :languages="sharedProps.languages"
        :bookmarks="sharedProps.bookmarks"
        :exclude="[]"
      />
    </Variant>
    <Variant title="With feedback" :setup-app="loadData">
      <UsersIndex
        :users="users"
        :errors="sharedProps.errors"
        :meta="sharedProps.meta"
        :user="sharedProps.user"
        :language="sharedProps.language"
        :languages="sharedProps.languages"
        :bookmarks="sharedProps.bookmarks"
        :exclude="[]"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import UsersIndex from './users-index.vue';
import { sharedProps, miniSidebar } from '../test/mocks';
import type { UserMeta } from '../../types';
import { ResponseStatus } from '../../types';
import { useSharedStore } from '../store';

const users: UserMeta[] = [
  {
    id: 1,
    name: 'Lindsay Walton',
    initials: 'LW',
    email: 'lindsay.walton@example.com',
    role: 'Member',
    language: 'en',
    hasPendingInvite: false,
    lastActivity: '2025-05-18T12:10:38.405+00:00',
  },
  // TODO: Add more users with different roles and names
  {
    id: 2,
    name: 'John Doe',
    initials: 'JD',
    email: 'john.doe@example.com',
    role: 'Admin',
    language: 'en',
    hasPendingInvite: false,
    lastActivity: null,
  },
  {
    id: 3,
    name: 'Jane Smith',
    initials: 'JS',
    email: 'jane.smith@example.com',
    role: 'Editor',
    language: 'es',
    hasPendingInvite: false,
    lastActivity: null,
  },
  {
    id: 4,
    name: 'Alice Johnson',
    initials: 'AJ',
    email: 'alice.johnson@example.com',
    role: 'Member',
    language: 'es',
    hasPendingInvite: true,
    lastActivity: '2025-05-17T12:10:38.405+00:00',
  },
  {
    id: 5,
    name: 'Bob Brown',
    initials: 'BB',
    email: 'bob.brown@example.com',
    role: 'Member',
    language: 'en',
    hasPendingInvite: false,
    lastActivity: '2025-03-01T12:10:38.405+00:00',
  },
  {
    id: 6,
    name: 'Charlie Davis',
    initials: 'CD',
    email: 'charlie.davis@example.com',
    role: 'Member',
    language: 'es',
    hasPendingInvite: false,
    lastActivity: '2025-05-19T12:10:38.405+00:00',
  },
  {
    id: 7,
    name: 'Diana Evans',
    initials: 'DE',
    email: 'diana.evans@example.com',
    role: 'Member',
    language: '*',
    hasPendingInvite: false,
    lastActivity: '2025-04-19T12:10:38.405+00:00',
  },
];

const loadData = () => {
  const shared = useSharedStore();
  shared.setSidebarOpen(false);

  shared.addMessage(ResponseStatus.Accomplishment, 'User updated successfully');
};
</script>
