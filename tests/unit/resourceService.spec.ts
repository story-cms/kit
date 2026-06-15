import { test, expect } from '@playwright/test';
import { extractResourceUrl, toResourceDto } from '../../src/backend/services/resource_mapper.js';
import type { LinkBundle, TextBundle, VideoBundle } from '../../src/types.js';

test.describe('Resource mapper', () => {
  test('extractResourceUrl returns video url from bundle', () => {
    const bundle: VideoBundle = { video: { url: 'https://example.com/v.mp4' } };
    expect(extractResourceUrl('video', bundle)).toBe('https://example.com/v.mp4');
  });

  test('extractResourceUrl returns info link url from bundle', () => {
    const bundle: LinkBundle = { infoUrl: 'https://example.com/info' };
    expect(extractResourceUrl('info_link', bundle)).toBe('https://example.com/info');
  });

  test('extractResourceUrl returns undefined for text type', () => {
    const bundle: TextBundle = { content: 'Hello world' };
    expect(extractResourceUrl('text', bundle)).toBeUndefined();
  });

  test('toResourceDto maps model fields to Resource DTO', () => {
    const dto = toResourceDto({
      id: 'abc-123',
      title: 'Test Resource',
      type: 'info_link',
      imageUrl: 'https://example.com/img.jpg',
      label: 'Reading',
      visibility: 'guests',
      description: 'A description',
      isPublished: true,
      bundle: { infoUrl: 'https://example.com/link' },
    });

    expect(dto).toEqual({
      id: 'abc-123',
      title: 'Test Resource',
      type: 'info_link',
      imageUrl: 'https://example.com/img.jpg',
      url: 'https://example.com/link',
      label: 'Reading',
      visibility: 'guests',
      description: 'A description',
      isPublished: true,
    });
  });

  test('toResourceDto handles nullable label and description', () => {
    const dto = toResourceDto({
      id: 'abc-456',
      title: 'Text Resource',
      type: 'text',
      imageUrl: null,
      label: null,
      visibility: 'public',
      description: null,
      isPublished: false,
      bundle: { content: 'Body text' },
    });

    expect(dto.label).toBeNull();
    expect(dto.description).toBeNull();
    expect(dto.url).toBeUndefined();
    expect(dto.type).toBe('text');
  });
});
