<template>
  <Story title="Audiences Page" group="team">
    <Variant title="Index" :setup-app="miniSidebar">
      <AudiencesIndex
        :audiences="audiences"
        :errors="sharedProps.errors"
        :meta="sharedProps.meta"
        :user="sharedProps.user"
        :language="sharedProps.language"
        :languages="sharedProps.languages"
        :bookmarks="sharedProps.bookmarks"
        :exclude="[]"
      />
    </Variant>
    <Variant title="Empty" :setup-app="miniSidebar">
      <AudiencesIndex
        :audiences="[]"
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
      <AudiencesIndex
        :meta="sharedProps.meta"
        :user="sharedProps.user"
        :languages="sharedProps.languages"
        :language="sharedProps.language"
        :errors="sharedProps.errors"
        :audiences="audiences"
        :bookmarks="sharedProps.bookmarks"
        :exclude="[]"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import AudiencesIndex from './audiences-index.vue';
import { sharedProps, miniSidebar } from '../test/mocks';
import type { AudienceMeta } from '../../types';
import { ResponseStatus } from '../../types';
import { useSharedStore } from '../store';

const audiences: AudienceMeta[] = [
  {
    uid: '1',
    name: 'Lindsay Walton',
    email: 'lindsay.walton@example.com',
    photoURL: 'https://picsum.photos/seed/1754389318473/800/400',
    signUpDate: '2025-06-18T12:10:38.405+00:00',
    lastSignInTime: '2025-06-18T12:10:38.405+00:00',
  },
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
  {
    uid: '8',
    name: 'Ethan Harris',
    email: 'ethan.harris@example.com',
    photoURL: 'https://picsum.photos/seed/1754389512345/800/400',
    signUpDate: '2025-03-18T12:10:38.405+00:00',
    lastSignInTime: '2025-03-18T12:10:38.405+00:00',
  },
  {
    uid: '9',
    name: 'Fiona Martinez',
    email: 'fiona.martinez@example.com',
    photoURL: 'https://picsum.photos/seed/1754389532167/800/400',
    signUpDate: '2025-04-18T12:10:38.405+00:00',
    lastSignInTime: '2025-04-18T12:10:38.405+00:00',
  },
  {
    uid: '10',
    name: 'George Wilson',
    email: 'george.wilson@example.com',
    photoURL: 'https://picsum.photos/seed/1754389552987/800/400',
    signUpDate: '2025-05-18T12:10:38.405+00:00',
    lastSignInTime: '2025-05-18T12:10:38.405+00:00',
  },
  {
    uid: '11',
    name: 'Hannah Lee',
    email: 'hannah.lee@example.com',
    photoURL: 'https://picsum.photos/seed/1754389572701/800/400',
    signUpDate: '2025-06-18T12:10:38.405+00:00',
    lastSignInTime: '2025-06-18T12:10:38.405+00:00',
  },
  {
    uid: '12',
    name: 'Ivy Kim',
    email: 'ivy.kim@example.com',
    photoURL: 'https://picsum.photos/seed/1754389592523/800/400',
    signUpDate: '2025-07-18T12:10:38.405+00:00',
    lastSignInTime: '2025-07-18T12:10:38.405+00:00',
  },
  {
    uid: '13',
    name: 'Jack Davis',
    email: 'jack.davis@example.com',
    photoURL: 'https://picsum.photos/seed/1754389612345/800/400',
    signUpDate: '2025-08-18T12:10:38.405+00:00',
    lastSignInTime: '2025-08-18T12:10:38.405+00:00',
  },
  {
    uid: '14',
    name: 'Kyle Nguyen',
    email: 'kyle.nguyen@example.com',
    photoURL: 'https://picsum.photos/seed/1754389632167/800/400',
    signUpDate: '2025-09-18T12:10:38.405+00:00',
    lastSignInTime: '2025-09-18T12:10:38.405+00:00',
  },
  {
    uid: '15',
    name: 'Liam Brown',
    email: 'liam.brown@example.com',
    photoURL: 'https://picsum.photos/seed/1754389652987/800/400',
    signUpDate: '2025-10-18T12:10:38.405+00:00',
    lastSignInTime: '2025-10-18T12:10:38.405+00:00',
  },
  {
    uid: '16',
    name: 'Mia Davis',
    email: 'mia.davis@example.com',
    photoURL: 'https://picsum.photos/seed/1754389672701/800/400',
    signUpDate: '2025-11-18T12:10:38.405+00:00',
    lastSignInTime: '2025-11-18T12:10:38.405+00:00',
  },
  {
    uid: '17',
    name: 'Noah Johnson',
    email: 'noah.johnson@example.com',
    photoURL: 'https://picsum.photos/seed/1754389692523/800/400',
    signUpDate: '2025-12-18T12:10:38.405+00:00',
    lastSignInTime: '2025-12-18T12:10:38.405+00:00',
  },
  {
    uid: '18',
    name: 'Olivia Wilson',
    email: 'olivia.wilson@example.com',
    photoURL: 'https://picsum.photos/seed/1754389712345/800/400',
    signUpDate: '2025-12-18T12:10:38.405+00:00',
    lastSignInTime: '2025-12-18T12:10:38.405+00:00',
  },
  {
    uid: '19',
    name: 'Oliver Johnson',
    email: 'oliver.johnson@example.com',
    photoURL: 'https://picsum.photos/seed/1754389732167/800/400',
    signUpDate: '2025-12-18T12:10:38.405+00:00',
    lastSignInTime: '2025-12-18T12:10:38.405+00:00',
  },
  {
    uid: '20',
    name: 'Paisley Johnson',
    email: 'paisley.johnson@example.com',
    photoURL: 'https://picsum.photos/seed/1754389752987/800/400',
    signUpDate: '2025-12-18T12:10:38.405+00:00',
    lastSignInTime: '2025-12-18T12:10:38.405+00:00',
  },
  {
    uid: '21',
    name: 'Quinn Johnson',
    email: 'quinn.johnson@example.com',
    photoURL: 'https://picsum.photos/seed/1754389772701/800/400',
    signUpDate: '2025-12-18T12:10:38.405+00:00',
    lastSignInTime: '2025-12-18T12:10:38.405+00:00',
  },
  {
    uid: '22',
    name: 'Riley Johnson',
    email: 'riley.johnson@example.com',
    photoURL: 'https://picsum.photos/seed/1754389792523/800/400',
    signUpDate: '2025-12-18T12:10:38.405+00:00',
    lastSignInTime: '2025-12-18T12:10:38.405+00:00',
  },
  {
    uid: '23',
    name: 'Sofia Johnson',
    email: 'sofia.johnson@example.com',
    photoURL: 'https://picsum.photos/seed/1754389812345/800/400',
    signUpDate: '2025-12-18T12:10:38.405+00:00',
    lastSignInTime: '2025-12-18T12:10:38.405+00:00',
  },
  {
    uid: '24',
    name: 'Thomas Johnson',
    email: 'thomas.johnson@example.com',
    photoURL: 'https://picsum.photos/seed/1754389832167/800/400',
    signUpDate: '2025-12-18T12:10:38.405+00:00',
    lastSignInTime: '2025-12-18T12:10:38.405+00:00',
  },
];

const loadData = () => {
  const shared = useSharedStore();
  shared.setSidebarOpen(false);

  shared.addMessage(ResponseStatus.Accomplishment, 'User updated successfully');
};
</script>
