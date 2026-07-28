import { test, expect } from '@playwright/test';
import { createPinia, setActivePinia } from 'pinia';
import { useListStateStore } from '../../src/frontend/store/list-state';

test.describe('List state', () => {
  test.beforeEach(async () => {
    setActivePinia(createPinia());
  });

  test('toggleRemovedIndex adds and removes indices', () => {
    const store = useListStateStore();

    store.toggleRemovedIndex('questions', 1);
    expect(store.isInRemovedList('questions', 1)).toBe(true);
    expect(store.isInRemovedList('questions', 0)).toBe(false);

    store.toggleRemovedIndex('questions', 1);
    expect(store.isInRemovedList('questions', 1)).toBe(false);
  });

  test('clearListState clears removedItems and listToggles', () => {
    const store = useListStateStore();

    store.toggleRemovedIndex('questions', 1);
    store.setListToggles('resources', [true, false]);

    store.clearListState();

    expect(store.isInRemovedList('questions', 1)).toBe(false);
    expect(store.getListToggles('resources')).toEqual([]);
  });

  test('list state is isolated between Pinia instances', () => {
    const first = useListStateStore(createPinia());
    const second = useListStateStore(createPinia());

    first.toggleRemovedIndex('questions', 1);
    first.setListToggles('resources', [true, false]);

    expect(second.isInRemovedList('questions', 1)).toBe(false);
    expect(second.getListToggles('resources')).toEqual([]);

    second.clearListState();

    expect(first.isInRemovedList('questions', 1)).toBe(true);
    expect(first.getListToggles('resources')).toEqual([true, false]);
  });
});
