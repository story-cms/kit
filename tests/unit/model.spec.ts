import { test, expect } from '@playwright/test';
import { setActivePinia, createPinia } from 'pinia';

import { useModelStore } from '../../src/frontend/store';

const fixture = {
  name: 'Jesse',
  address: {
    town: 'Bethlehem',
    zip: '12345',
    isFavourite: false,
    hasCredit: true,
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
});
