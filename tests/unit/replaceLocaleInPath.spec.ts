import { test, expect } from '@playwright/test';

import {
  normalizePathForLanguageSwitch,
  parentPathForBack,
  replaceLocaleInPath,
} from '../../src/frontend/shared/helpers';

const locales = ['en', 'fr', 'ar'];

test.describe('replaceLocaleInPath', () => {
  test('preserves story draft edit path', () => {
    expect(replaceLocaleInPath('/en/story/1/draft/2/edit', 'fr', locales)).toBe(
      '/fr/story/1/draft/2/edit',
    );
  });

  test('preserves story chapter preview path', () => {
    expect(replaceLocaleInPath('/en/story/1/chapter/3', 'fr', locales)).toBe(
      '/fr/story/1/chapter/3',
    );
  });

  test('preserves story list', () => {
    expect(replaceLocaleInPath('/en/story', 'fr', locales)).toBe('/fr/story');
  });

  test('preserves story create and meta edit', () => {
    expect(replaceLocaleInPath('/en/story/create', 'fr', locales)).toBe('/fr/story/create');
    expect(replaceLocaleInPath('/en/story/5/edit', 'fr', locales)).toBe('/fr/story/5/edit');
  });

  test('preserves page edit and index', () => {
    expect(replaceLocaleInPath('/en/page/5/edit', 'fr', locales)).toBe('/fr/page/5/edit');
    expect(replaceLocaleInPath('/en/page', 'fr', locales)).toBe('/fr/page');
    expect(replaceLocaleInPath('/en/page/create', 'fr', locales)).toBe('/fr/page/create');
  });

  test('preserves stream and drop routes', () => {
    expect(replaceLocaleInPath('/en/stream', 'fr', locales)).toBe('/fr/stream');
    expect(replaceLocaleInPath('/en/stream/3', 'fr', locales)).toBe('/fr/stream/3');
    expect(replaceLocaleInPath('/en/stream/3/drop/create', 'fr', locales)).toBe(
      '/fr/stream/3/drop/create',
    );
    expect(replaceLocaleInPath('/en/drop/9/edit', 'fr', locales)).toBe('/fr/drop/9/edit');
  });

  test('preserves invitation routes', () => {
    expect(replaceLocaleInPath('/en/invitation', 'fr', locales)).toBe('/fr/invitation');
    expect(replaceLocaleInPath('/en/invitation/2/edit', 'fr', locales)).toBe(
      '/fr/invitation/2/edit',
    );
    expect(replaceLocaleInPath('/en/invitation/2/stats', 'fr', locales)).toBe(
      '/fr/invitation/2/stats',
    );
  });

  test('preserves audience routes', () => {
    expect(replaceLocaleInPath('/en/audience', 'fr', locales)).toBe('/fr/audience');
    expect(replaceLocaleInPath('/en/audience/users', 'fr', locales)).toBe(
      '/fr/audience/users',
    );
  });

  test('preserves settings and team routes', () => {
    expect(replaceLocaleInPath('/en/settings', 'fr', locales)).toBe('/fr/settings');
    expect(replaceLocaleInPath('/en/settings/languages/edit', 'fr', locales)).toBe(
      '/fr/settings/languages/edit',
    );
    expect(replaceLocaleInPath('/en/user', 'fr', locales)).toBe('/fr/user');
  });

  test('preserves ui and dashboard', () => {
    expect(replaceLocaleInPath('/en/ui', 'fr', locales)).toBe('/fr/ui');
    expect(replaceLocaleInPath('/en/dashboard', 'fr', locales)).toBe('/fr/dashboard');
  });

  test('returns null for non-localized paths', () => {
    expect(replaceLocaleInPath('/login', 'fr', locales)).toBeNull();
    expect(replaceLocaleInPath('/analytics', 'fr', locales)).toBeNull();
    expect(replaceLocaleInPath('/', 'fr', locales)).toBeNull();
  });

  test('returns null when first segment is not a known locale', () => {
    expect(replaceLocaleInPath('/xx/story', 'fr', locales)).toBeNull();
  });
});

test.describe('normalizePathForLanguageSwitch', () => {
  test('redirects chapter preview to story index', () => {
    expect(normalizePathForLanguageSwitch('/en/story/1/chapter/3')).toBe('/en/story/1');
  });

  test('leaves draft edit paths unchanged', () => {
    expect(normalizePathForLanguageSwitch('/en/story/1/draft/2/edit')).toBe(
      '/en/story/1/draft/2/edit',
    );
  });

  test('leaves story index unchanged', () => {
    expect(normalizePathForLanguageSwitch('/en/story/1')).toBe('/en/story/1');
  });

  test('leaves non-story paths unchanged', () => {
    expect(normalizePathForLanguageSwitch('/en/dashboard')).toBe('/en/dashboard');
  });

  test('combined with replaceLocaleInPath redirects chapter to translated story index', () => {
    const pathname = '/en/story/1/chapter/3';
    const normalized = normalizePathForLanguageSwitch(pathname);
    expect(replaceLocaleInPath(normalized, 'fr', locales)).toBe('/fr/story/1');
  });
});

test.describe('parentPathForBack', () => {
  test('navigates from draft edit to story index', () => {
    expect(parentPathForBack('/it/story/5/draft/1/edit')).toBe('/it/story/5');
  });

  test('navigates from chapter preview to story index', () => {
    expect(parentPathForBack('/it/story/5/chapter/1')).toBe('/it/story/5');
  });

  test('navigates from draft create to story index', () => {
    expect(parentPathForBack('/it/story/5/draft/create')).toBe('/it/story/5');
  });

  test('navigates from story meta edit to story index', () => {
    expect(parentPathForBack('/it/story/5/edit')).toBe('/it/story/5');
  });

  test('navigates from story index to story gallery', () => {
    expect(parentPathForBack('/it/story/5')).toBe('/it/story');
  });

  test('navigates from story gallery to dashboard', () => {
    expect(parentPathForBack('/it/story')).toBe('/it/dashboard');
  });

  test('navigates from story create to story gallery', () => {
    expect(parentPathForBack('/it/story/create')).toBe('/it/story');
  });

  test('returns null on dashboard', () => {
    expect(parentPathForBack('/it/dashboard')).toBeNull();
  });

  test('returns null for unrecognized paths', () => {
    expect(parentPathForBack('/it/drop/9/edit')).toBeNull();
    expect(parentPathForBack('/login')).toBeNull();
  });

  test('navigates from page and resource edit to index', () => {
    expect(parentPathForBack('/en/page/5/edit')).toBe('/en/page');
    expect(parentPathForBack('/en/resource/3/edit')).toBe('/en/resource');
  });

  test('navigates from stream drop create to stream index', () => {
    expect(parentPathForBack('/en/stream/3/drop/create')).toBe('/en/stream/3');
  });
});
