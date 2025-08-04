<template>
  <Story title="Audiences Page" group="team">
    <Variant title="Index">
      <AudiencesIndex
        :audiences="audiences"
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
      <AudiencesIndex
        :audiences="audiences"
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
import AudiencesIndex from './audiences-index.vue';
import { sharedProps } from '../test/mocks';
import type { Audience } from '../../types';
import { ResponseStatus } from '../../types';
import { useSharedStore } from '../store';

const audiences: Audience[] = [
  {
    id: 1,
    name: 'Lindsay Walton',
    initials: 'LW',
    email: 'lindsay.walton@example.com',
    lastLogin: '2025-06-18T12:10:38.405+00:00',
    createdAt: '2025-05-18T12:10:38.405+00:00',
  },
  // TODO: Add more users with different roles and names
  {
    id: 2,
    name: 'John Doe',
    initials: 'JD',
    email: 'john.doe@example.com',
    lastLogin: '2025-08-18T12:10:38.405+00:00',
    createdAt: '2024-05-11T12:10:38.405+00:00',
  },
  {
    id: 3,
    name: 'Jane Smith',
    initials: 'JS',
    email: 'jane.smith@example.com',
    lastLogin: '2025-05-18T12:10:38.405+00:00',
    createdAt: '2025-05-18T12:10:38.405+00:00',
  },
  {
    id: 4,
    name: 'Alice Johnson',
    initials: 'AJ',
    email: 'alice.johnson@example.com',
    lastLogin: '2025-05-10T12:10:38.405+00:00',
    createdAt: '2025-05-18T12:10:38.405+00:00',
  },
  {
    id: 5,
    name: 'Bob Brown',
    initials: 'BB',
    email: 'bob.brown@example.com',
    lastLogin: '2025-07-18T12:10:38.405+00:00',
    createdAt: '2025-05-18T12:10:38.405+00:00',
  },
  {
    id: 6,
    name: 'Charlie Davis',
    initials: 'CD',
    email: 'charlie.davis@example.com',
    lastLogin: '2025-01-18T12:10:38.405+00:00',
    createdAt: '2025-05-18T12:10:38.405+00:00',
  },
  {
    id: 7,
    name: 'Diana Evans',
    initials: 'DE',
    email: 'diana.evans@example.com',
    lastLogin: '2025-02-18T12:10:38.405+00:00',
    createdAt: '2025-05-18T12:10:38.405+00:00',
  },
];

const loadData = () => {
  const shared = useSharedStore();

  shared.addMessage(ResponseStatus.Accomplishment, 'User updated successfully');
};
</script>
