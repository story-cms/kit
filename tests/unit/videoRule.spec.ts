import { test, expect } from '@playwright/test';
import vine from '@vinejs/vine';
import videoRule from '../../src/backend/validators/video_rule.js';
import { Video } from '../../src/types';

test.describe('Video Rule Validator', () => {
  test('should validate valid video objects with .mp4 extension', async () => {
    const validVideos: Video[] = [
      { url: 'https://example.com/video.mp4' },
      { url: 'video.mp4' },
      { url: '/path/to/video.mp4' },
      { url: '/path/to/video.m3u8' },
      { url: 'file:///local/video.mp4' },
      {
        url: 'https://vz-2ef0214d-b18.b-cdn.net/6516b3bf-5d45-4cac-b7df-3341808daaba/playlist.m3u8',
      },
    ];

    for (const video of validVideos) {
      const schema = vine.object({
        video: vine
          .object({
            url: vine.string(),
          })
          .use(videoRule(null)),
      });

      const data = { video };
      const result = await vine.validate({ schema, data });
      expect(result.video).toEqual(video);
    }
  });

  test('should reject non-object values', async () => {
    const invalidValues = ['string', 123, true, null, undefined, []];

    for (const value of invalidValues) {
      const schema = vine.object({
        video: vine
          .object({
            url: vine.string(),
          })
          .use(videoRule(null)),
      });

      const data = { video: value };

      await expect(vine.validate({ schema, data })).rejects.toThrow();
    }
  });

  test('should reject objects without url property', async () => {
    const invalidObjects = [
      {},
      { title: 'Video Title' },
      { url: null },
      { url: undefined },
    ];

    for (const obj of invalidObjects) {
      const schema = vine.object({
        video: vine
          .object({
            url: vine.string(),
          })
          .use(videoRule(null)),
      });

      const data = { video: obj };

      await expect(vine.validate({ schema, data })).rejects.toThrow();
    }
  });

  test('should reject objects with non-string url', async () => {
    const invalidObjects = [{ url: 123 }, { url: true }, { url: [] }, { url: {} }];

    for (const obj of invalidObjects) {
      const schema = vine.object({
        video: vine
          .object({
            url: vine.string(),
          })
          .use(videoRule(null)),
      });

      const data = { video: obj };

      await expect(vine.validate({ schema, data })).rejects.toThrow();
    }
  });

  test('should reject videos without .mp4 extension', async () => {
    const invalidVideos = [
      { url: 'video.avi' },
      { url: 'video.mov' },
      { url: 'video.webm' },
      { url: 'video.mkv' },
      { url: 'video' },
      { url: 'video.' },
      { url: 'video.mp4.backup' },
    ];

    for (const video of invalidVideos) {
      const schema = vine.object({
        video: vine
          .object({
            url: vine.string(),
          })
          .use(videoRule(null)),
      });

      const data = { video };

      await expect(vine.validate({ schema, data })).rejects.toThrow();
    }
  });

  test('should handle edge cases with empty and whitespace strings', async () => {
    const edgeCases = [
      { url: '' },
      { url: '   ' },
      //   { url: '.mp4' },
      //   { url: ' .mp4' },
      //   { url: '.mp4 ' },
    ];

    for (const video of edgeCases) {
      const schema = vine.object({
        video: vine
          .object({
            url: vine.string(),
          })
          .use(videoRule(null)),
      });

      const data = { video };

      await expect(vine.validate({ schema, data })).rejects.toThrow();
    }
  });

  test('should validate case-sensitive .mp4 extension', async () => {
    const caseSensitiveTests = [
      { video: { url: 'video.MP4' }, shouldPass: false },
      { video: { url: 'video.Mp4' }, shouldPass: false },
      { video: { url: 'video.mP4' }, shouldPass: false },
      { video: { url: 'video.mp4' }, shouldPass: true },
    ];

    for (const { video, shouldPass } of caseSensitiveTests) {
      const schema = vine.object({
        video: vine
          .object({
            url: vine.string(),
          })
          .use(videoRule(null)),
      });

      const data = { video };

      if (shouldPass) {
        const result = await vine.validate({ schema, data });
        expect(result.video).toEqual(video);
      } else {
        await expect(vine.validate({ schema, data })).rejects.toThrow();
      }
    }
  });
});
