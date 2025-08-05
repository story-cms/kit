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
    uid: '1',
    name: 'Lindsay Walton',
    email: 'lindsay.walton@example.com',
    photoURL: 'https://picsum.photos/seed/1754389318473/800/400',
    signUpDate: '2025-06-18T12:10:38.405+00:00',
    lastSignInTime: '2025-06-18T12:10:38.405+00:00',
  },
  // TODO: Add more users with different roles and names
  {
    uid: '2',
    name: 'John Doe',
    email: 'john.doe@example.com',
    photoURL: 'https://picsum.photos/seed/1754389388689/800/400',
    signUpDate: '2025-08-18T12:10:38.405+00:00',
    lastSignInTime: '2025-08-18T12:10:38.405+00:00',
  },
  {
    uid: '3',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    photoURL: 'https://picsum.photos/seed/1754389412151/800/400',
    signUpDate: '2025-05-18T12:10:38.405+00:00',
    lastSignInTime: '2025-05-18T12:10:38.405+00:00',
  },
  {
    uid: '4',
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    photoURL: 'https://picsum.photos/seed/1754389434557/800/400',
    signUpDate: '2025-05-10T12:10:38.405+00:00',
    lastSignInTime: '2025-05-18T12:10:38.405+00:00',
  },
  {
    uid: '5',
    name: 'Bob Brown',
    email: 'bob.brown@example.com',
    photoURL: 'https://picsum.photos/seed/1754389459304/800/400',
    signUpDate: '2025-07-18T12:10:38.405+00:00',
    lastSignInTime: '2025-07-18T12:10:38.405+00:00',
  },
  {
    uid: '6',
    name: 'Charlie Davis',
    email: 'charlie.davis@example.com',
    photoURL: 'https://picsum.photos/seed/1754389479163/800/400',
    signUpDate: '2025-01-18T12:10:38.405+00:00',
    lastSignInTime: '2025-01-18T12:10:38.405+00:00',
  },
  {
    uid: '7',
    name: 'Diana Evans',
    email: 'diana.evans@example.com',
    photoURL: 'https://picsum.photos/seed/1754389492423/800/400',
    signUpDate: '2025-02-18T12:10:38.405+00:00',
    lastSignInTime: '2025-02-18T12:10:38.405+00:00',
  },
];

const loadData = () => {
  const shared = useSharedStore();

  shared.addMessage(ResponseStatus.Accomplishment, 'User updated successfully');
};
</script>
