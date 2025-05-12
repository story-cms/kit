<template>
  <Story title="Users Page" group="users">
    <Variant title="Index">
      <UsersIndex
        :users="users"
        :errors="sharedProps.errors"
        :meta="sharedProps.meta"
        :user="sharedProps.user"
        :language="sharedProps.language"
        :languages="sharedProps.languages"
        :stories="['John', 'Acts']"
        :ui-todo-count="sharedProps.uiTodoCount"
        :story-name="'John'"
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
        :stories="['John', 'Acts']"
        :ui-todo-count="sharedProps.uiTodoCount"
        :story-name="'John'"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import UsersIndex from './users-index.vue';
import { sharedProps } from '../test/mocks';
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
    lastActivity: '2021-01-01',
  },
  // TODO: Add more users with different roles and names
  {
    id: 2,
    name: 'John Doe',
    initials: 'JD',
    email: 'john.doe@example.com',
    role: 'Admin',

    language: 'en',
    lastActivity: 'Yesterday',
  },
  {
    id: 3,
    name: 'Jane Smith',
    initials: 'JS',
    email: 'jane.smith@example.com',
    role: 'Editor',

    language: 'es',
    lastActivity: 'Tuesday',
  },
  {
    id: 4,
    name: 'Alice Johnson',
    initials: 'AJ',
    email: 'alice.johnson@example.com',
    role: 'Member',

    language: 'es',
    lastActivity: 'Yesterday',
  },
  {
    id: 5,
    name: 'Bob Brown',
    initials: 'BB',
    email: 'bob.brown@example.com',
    role: 'Member',

    language: 'en',
    lastActivity: '7th April',
  },
  {
    id: 6,
    name: 'Charlie Davis',
    initials: 'CD',
    email: 'charlie.davis@example.com',
    role: 'Member',

    language: 'es',
    lastActivity: 'Monday',
  },
  {
    id: 7,
    name: 'Diana Evans',
    initials: 'DE',
    email: 'diana.evans@example.com',
    role: 'Member',

    language: '*',
    lastActivity: 'Friday',
  },
];

const loadData = () => {
  const shared = useSharedStore();

  shared.addMessage(ResponseStatus.Accomplishment, 'User updated successfully');
};
</script>
