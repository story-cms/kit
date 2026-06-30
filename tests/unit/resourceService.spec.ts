import { test, expect } from '@playwright/test';
import { DateTime } from 'luxon';
import {
  extractResourceUrl,
  toResourceItem,
  toResourceIndexItem,
} from '../../src/backend/services/resource_mapper.js';
import { compareResourcesByRecentlyEdited } from '../../src/frontend/stories/components/resource-utils';
import type { LinkBundle, TextBundle, VideoBundle } from '../../src/types.js';

test.describe('Resource mapper', () => {
  test('extractResourceUrl returns video url from bundle', () => {
    const bundle: VideoBundle = { video: { url: 'https://example.com/v.mp4' } };
    expect(extractResourceUrl('video', bundle)).toBe('https://example.com/v.mp4');
  });

  test('extractResourceUrl returns url from bundle', () => {
    const bundle: LinkBundle = { url: 'https://example.com/info' };
    expect(extractResourceUrl('url', bundle)).toBe('https://example.com/info');
  });

  test('extractResourceUrl returns undefined for text type', () => {
    const bundle: TextBundle = { content: 'Hello world' };
    expect(extractResourceUrl('text', bundle)).toBeUndefined();
  });

  test('toResourceDto maps model fields to Resource DTO', () => {
    const dto = toResourceItem({
      id: 'abc-123',
      title: 'Test Resource',
      type: 'url',
      imageUrl: 'https://example.com/img.jpg',
      label: 'Reading',
      visibility: 'guests',
      description: 'A description',
      bundle: { url: 'https://example.com/link' },
      updatedAt: DateTime.fromISO('2024-03-01T12:00:00.000Z'),
    });

    expect(dto).toEqual({
      id: 'abc-123',
      title: 'Test Resource',
      type: 'url',
      imageUrl: 'https://example.com/img.jpg',
      url: 'https://example.com/link',
      label: 'Reading',
      visibility: 'guests',
      description: 'A description',
      updatedAt: '2024-03-01T12:00:00.000Z',
    });
  });

  test('toResourceDto handles nullable label and description', () => {
    const dto = toResourceItem({
      id: 'abc-456',
      title: 'Text Resource',
      type: 'text',
      imageUrl: null,
      label: null,
      visibility: 'public',
      description: null,
      bundle: { content: 'Body text' },
      updatedAt: '2024-02-12T08:00:00.000Z',
    });

    expect(dto.label).toBeNull();
    expect(dto.description).toBeNull();
    expect(dto.url).toBeUndefined();
    expect(dto.type).toBe('text');
    expect(dto.updatedAt).toBe('2024-02-12T08:00:00.000Z');
  });

  test('toResourceIndexItem includes formatted timestamps', () => {
    const item = toResourceIndexItem({
      id: 'abc-789',
      title: 'Video Resource',
      type: 'video',
      imageUrl: null,
      label: 'Videos',
      visibility: 'public',
      description: null,
      bundle: { video: { url: 'https://example.com/v.mp4' } },
      createdAt: DateTime.fromISO('2024-01-15T10:00:00.000Z'),
      updatedAt: DateTime.fromISO('2024-03-01T12:00:00.000Z'),
    });

    expect(item.createdAt).toBe('2024-01-15');
    expect(item.updatedAt).toBe('2024-03-01T12:00:00.000Z');
    expect(item.url).toBe('https://example.com/v.mp4');
  });

  test('toResourceIndexItem handles string timestamps', () => {
    const item = toResourceIndexItem({
      id: 'abc-999',
      title: 'Link Resource',
      type: 'url',
      imageUrl: null,
      label: 'Links',
      visibility: 'guests',
      description: 'A link',
      bundle: { url: 'https://example.com' },
      createdAt: '2024-02-10T08:00:00.000Z',
      updatedAt: '2024-02-12T08:00:00.000Z',
    });

    expect(item.createdAt).toBe('2024-02-10');
    expect(item.updatedAt).toBe('2024-02-12T08:00:00.000Z');
  });

  test('compareResourcesByRecentlyEdited orders same-date resources by time', () => {
    const ordered = [
      { title: 'Older Time', updatedAt: '2024-02-12T08:00:00.000Z' },
      { title: 'Newest Time', updatedAt: '2024-02-12T12:00:00.000Z' },
      { title: 'Oldest Day', updatedAt: '2024-02-11T23:59:59.000Z' },
    ].sort(compareResourcesByRecentlyEdited);

    expect(ordered.map((item) => item.title)).toEqual([
      'Newest Time',
      'Older Time',
      'Oldest Day',
    ]);
  });
});
