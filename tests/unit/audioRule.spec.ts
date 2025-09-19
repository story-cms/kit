import { test, expect } from '@playwright/test';
import vine from '@vinejs/vine';
import audioRule from '../../src/backend/validators/audio_rule.js';
import { Audio } from '../../src/types';

test.describe('Audio Rule Validator', () => {
  test('should validate valid audio objects with .mp3 extension', async () => {
    const validAudios: Audio[] = [
      { url: 'https://example.com/audio.mp3', length: 120 },
      { url: 'audio.mp3', length: 60 },
      { url: 'audio.MP3', length: 60 },
      { url: '/path/to/audio.mp3', length: 180 },
      { url: 'file:///local/audio.mp3', length: 90 },
      { url: 'https://cdn.example.com/song.mp3', length: 240 },
    ];

    for (const audio of validAudios) {
      const schema = vine.object({
        audio: vine
          .object({
            url: vine.string(),
            length: vine.number(),
          })
          .use(audioRule()),
      });

      const data = { audio };
      const result = await vine.validate({ schema, data });
      expect(result.audio).toEqual(audio);
    }
  });

  test('should reject non-object values', async () => {
    const invalidValues = ['string', 123, true, null, undefined, []];

    for (const value of invalidValues) {
      const schema = vine.object({
        audio: vine
          .object({
            url: vine.string(),
            length: vine.number(),
          })
          .use(audioRule()),
      });

      const data = { audio: value };

      await expect(vine.validate({ schema, data })).rejects.toThrow();
    }
  });

  test('should reject objects without required properties', async () => {
    const invalidObjects = [
      {},
      { url: 'audio.mp3' }, // missing length
      { length: 120 }, // missing url
      { url: null, length: 120 },
      { url: 'audio.mp3', length: null },
      { url: undefined, length: 120 },
      { url: 'audio.mp3', length: undefined },
    ];

    for (const obj of invalidObjects) {
      const schema = vine.object({
        audio: vine
          .object({
            url: vine.string(),
            length: vine.number(),
          })
          .use(audioRule()),
      });

      const data = { audio: obj };

      await expect(vine.validate({ schema, data })).rejects.toThrow();
    }
  });

  test('should reject objects with non-string url or non-number length', async () => {
    const invalidObjects = [
      { url: 123, length: 120 },
      { url: [], length: 120 },
      { url: {}, length: 120 },
      { url: 'audio.mp3', length: [] },
      { url: 'audio.mp3', length: {} },
    ];

    for (const obj of invalidObjects) {
      const schema = vine.object({
        audio: vine
          .object({
            url: vine.string(),
            length: vine.number(),
          })
          .use(audioRule()),
      });

      const data = { audio: obj };

      await expect(vine.validate({ schema, data })).rejects.toThrow();
    }
  });

  test('should reject audios without .mp3 extension', async () => {
    const invalidAudios = [
      { url: 'audio.wav', length: 120 },
      { url: 'audio.mp4', length: 120 },
      { url: 'audio.ogg', length: 120 },
      { url: 'audio.m4a', length: 120 },
      { url: 'audio', length: 120 },
      { url: 'audio.', length: 120 },
      { url: 'audio.mp3.backup', length: 120 },
    ];

    for (const audio of invalidAudios) {
      const schema = vine.object({
        audio: vine
          .object({
            url: vine.string(),
            length: vine.number(),
          })
          .use(audioRule()),
      });

      const data = { audio };

      await expect(vine.validate({ schema, data })).rejects.toThrow();
    }
  });

  test('should reject audios with zero or negative length', async () => {
    const invalidAudios = [
      { url: 'audio.mp3', length: 0 },
      { url: 'audio.mp3', length: -1 },
      { url: 'audio.mp3', length: -120 },
    ];

    for (const audio of invalidAudios) {
      const schema = vine.object({
        audio: vine
          .object({
            url: vine.string(),
            length: vine.number(),
          })
          .use(audioRule()),
      });

      const data = { audio };

      await expect(vine.validate({ schema, data })).rejects.toThrow();
    }
  });

  test('should handle edge cases with empty and whitespace strings', async () => {
    const edgeCases = [
      { url: '', length: 120 },
      { url: '   ', length: 120 },
      { url: 'audio.mp3', length: 0 },
    ];

    for (const audio of edgeCases) {
      const schema = vine.object({
        audio: vine
          .object({
            url: vine.string(),
            length: vine.number(),
          })
          .use(audioRule()),
      });

      const data = { audio };

      await expect(vine.validate({ schema, data })).rejects.toThrow();
    }
  });

  test('should handle canBeEmpty option when both url and length are null', async () => {
    const emptyAudio = { url: null, length: null };

    const schema = vine.object({
      audio: vine
        .object({
          url: vine.string().nullable(),
          length: vine.number().nullable(),
        })
        .use(audioRule({ canBeEmpty: true })),
    });

    const data = { audio: emptyAudio };
    const result = await vine.validate({ schema, data });
    expect(result.audio).toEqual(emptyAudio);
  });

  test('should reject empty audio when canBeEmpty is false (default)', async () => {
    const emptyAudio = { url: null, length: null };

    const schema = vine.object({
      audio: vine
        .object({
          url: vine.string().nullable(),
          length: vine.number().nullable(),
        })
        .use(audioRule()),
    });

    const data = { audio: emptyAudio };

    await expect(vine.validate({ schema, data })).rejects.toThrow();
  });

  test('should reject partial empty audio even with canBeEmpty option', async () => {
    const partialEmptyAudios = [
      { url: null, length: 120 },
      { url: 'audio.mp3', length: null },
    ];

    for (const audio of partialEmptyAudios) {
      const schema = vine.object({
        audio: vine
          .object({
            url: vine.string().nullable(),
            length: vine.number().nullable(),
          })
          .use(audioRule({ canBeEmpty: true })),
      });

      const data = { audio };

      await expect(vine.validate({ schema, data })).rejects.toThrow();
    }
  });

  test('should handle string length conversion internally', async () => {
    // Test that the rule internally converts string length to number
    // This test uses a more flexible schema to allow the rule to process the data
    const audioWithStringLength = { url: 'audio.mp3', length: '120' };
    const audioWithInvalidStringLength = { url: 'audio.mp3', length: '0' };

    // Use a schema that allows any type for length, so the rule can process it
    const schema = vine.object({
      audio: vine
        .object({
          url: vine.string(),
          length: vine.any(), // Allow any type so rule can process it
        })
        .use(audioRule()),
    });

    // Valid string length should pass
    const validData = { audio: audioWithStringLength };
    const validResult = await vine.validate({ schema, data: validData });
    expect(validResult.audio.url).toBe('audio.mp3');
    expect(validResult.audio.length).toBe(120); // String converted to number

    // Invalid string length should fail
    const invalidData = { audio: audioWithInvalidStringLength };
    await expect(vine.validate({ schema, data: invalidData })).rejects.toThrow();
  });
});
