import { test, expect } from '@playwright/test';
import { setActivePinia, createPinia } from 'pinia';
import { useModelStore } from '../../src/frontend/store/model';
import { useListStateStore } from '../../src/frontend/store/list-state';
import type { DraftEditProps, SharedPageProps } from '../../src/types';

const fixture = {
  name: 'Jesse',
  address: {
    town: 'Bethlehem',
    zip: '12345',
    isFavourite: false,
    hasCredit: true,
  },
};

const draftEditProps: DraftEditProps & SharedPageProps = {
  draft: {
    id: 1,
    number: 1,
    status: 'started',
    updatedAt: '2021-08-10T14:48:00.000000Z',
    createdAt: '2021-08-09T10:00:00.000000Z',
  },
  bundle: { title: 'Chapter 1', questions: [{ question: 'One' }] },
  source: { questions: [{ question: 'Source' }] },
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
  user: {
    id: 1,
    name: 'Test User',
    isAdmin: true,
    isManager: true,
    role: 'admin',
  },
  config: {
    name: 'Test CMS',
    logo: '',
    helpUrl: '',
    supportEmail: 'support@example.com',
    hasAppPreview: false,
    videoCollectionId: '',
    languages: [],
    subscriptions: [],
  },
  language: {
    language: 'English',
    languageDirection: 'ltr',
    locale: 'en',
  },
};

test.describe('Model Store', () => {
  test.beforeEach(async () => {
    setActivePinia(createPinia());
  });

  test('getField', () => {
    const store = useModelStore();
    store.model = fixture;
    expect(store.getField('name')).toBe('Jesse');
    expect(store.getField('address.zip')).toBe('12345');
  });

  test.skip('get boolean values', () => {
    const store = useModelStore();
    store.model = fixture;
    expect(store.getField('address.isFavourite', true)).toBe(false);
    expect(store.getField('address.hasCredit', false)).toBe(true);
  });

  test('isPopulated', () => {
    const store = useModelStore();
    store.model = fixture;
    expect(store.isPopulated('name')).toBe(true);
    expect(store.isPopulated('address.zip')).toBe(true);
    expect(store.isPopulated('address.zap')).toBe(false);
    expect(store.isPopulated('address.hasCredit')).toBe(true);
    expect(store.isPopulated('address.isFavourite')).toBe(true);
  });

  test('setModel clears flexible list state', () => {
    const model = useModelStore();
    const listState = useListStateStore();

    listState.toggleRemovedIndex('questions', 1);
    listState.setListToggles('resources', [false, true]);

    model.setModel({ title: 'Fresh' });

    expect(listState.isInRemovedList('questions', 1)).toBe(false);
    expect(listState.getListToggles('resources')).toEqual([]);
    expect(model.getField('title')).toBe('Fresh');
  });

  test('setFromProps clears flexible list state', () => {
    const model = useModelStore();
    const listState = useListStateStore();

    listState.toggleRemovedIndex('questions', 2);

    model.setFromProps(draftEditProps);

    expect(listState.isInRemovedList('questions', 2)).toBe(false);
    expect(model.getField('title')).toBe('Chapter 1');
    expect(model.getSourceField('questions.0.question')).toBe('Source');
  });

  test('model resets only clear list state in the same Pinia instance', () => {
    const firstPinia = createPinia();
    const firstModel = useModelStore(firstPinia);
    const firstListState = useListStateStore(firstPinia);
    const secondPinia = createPinia();
    const secondListState = useListStateStore(secondPinia);

    firstListState.toggleRemovedIndex('questions', 1);
    secondListState.toggleRemovedIndex('questions', 2);

    firstModel.setModel({ title: 'Fresh' });

    expect(firstListState.isInRemovedList('questions', 1)).toBe(false);
    expect(secondListState.isInRemovedList('questions', 2)).toBe(true);
  });
});
