import { test, expect } from '@playwright/test';
import { setActivePinia, createPinia } from 'pinia';
import { useDraftsStore } from '../../src/frontend/store/drafts';
import type { DraftEditProps } from '../../src/types';

const draftEditProps: DraftEditProps = {
  draft: {
    id: 1,
    number: 1,
    status: 'started',
    updatedAt: '2021-08-10T14:48:00.000000Z',
    createdAt: '2021-08-09T10:00:00.000000Z',
  },
  bundle: { title: 'Chapter 1' },
  lastPublished: '',
  providers: {},
  story: {
    id: 1,
    name: 'Test Story',
    coverImage: 'https://example.com/cover.jpg',
    storyType: 'Story',
    chapterType: 'Chapter',
    chapterLimit: 10,
    visibility: 'public',
    schemaVersion: 1,
    isPublished: true,
    fields: [],
    sections: [],
  },
  hasEditReview: false,
};

test.describe('Drafts Store', () => {
  test.beforeEach(async () => {
    setActivePinia(createPinia());
  });

  test('setFromProps initializes draft.updatedAt', () => {
    const store = useDraftsStore();
    store.setFromProps(draftEditProps);

    expect(store.draft.updatedAt).toBe('2021-08-10T14:48:00.000000Z');
    expect(store.draft.status).toBe('started');
  });

  test('setUpdatedAt updates only updatedAt', () => {
    const store = useDraftsStore();
    store.setFromProps(draftEditProps);

    store.setUpdatedAt('2024-06-15T09:30:00.000000Z');

    expect(store.draft.updatedAt).toBe('2024-06-15T09:30:00.000000Z');
    expect(store.draft.status).toBe('started');
    expect(store.draft.id).toBe(1);
    expect(store.draft.number).toBe(1);
    expect(store.draft.createdAt).toBe('2021-08-09T10:00:00.000000Z');
  });
});
