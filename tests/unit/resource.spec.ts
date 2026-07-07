import { test, expect } from '@playwright/test';
import vine from '@vinejs/vine';
import { ResourceValidator } from '../../src/backend/validators/resource.js';
import type { HttpContext } from '@adonisjs/core/http';

function createMockHttpContext(inputs: Record<string, any>): HttpContext {
  return {
    request: {
      input: (key: string) => inputs[key],
    },
  } as HttpContext;
}

type ValidationError = {
  messages?: Array<{ message: string; rule: string; field: string }>;
};

async function expectValidationMessages(
  validate: () => Promise<unknown>,
  expected: Array<{ field: string; message: string }>,
) {
  let error: ValidationError | undefined;
  try {
    await validate();
  } catch (e) {
    error = e as ValidationError;
  }

  expect(error).toBeDefined();
  for (const item of expected) {
    expect(error!.messages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: item.field,
          message: item.message,
        }),
      ]),
    );
  }
}

const baseResource = {
  title: 'Test Resource',
  label: 'Reading',
  visibility: 'public' as const,
};

test.describe('Resource Validator', () => {
  test.beforeEach(() => {
    vine.convertEmptyStringsToNull = false;
  });

  test.describe('Published resources', () => {
    test('requires title', async () => {
      const data = {
        ...baseResource,
        title: '',
        type: 'url' as const,
        url: 'https://example.com',
      };
      const ctx = createMockHttpContext(data);
      const validator = new ResourceValidator(ctx);

      await expect(validator.validate(data)).rejects.toThrow();
    });

    test('accepts resource without label', async () => {
      const data = {
        ...baseResource,
        label: '',
        type: 'url' as const,
        url: 'https://example.com',
      };
      const ctx = createMockHttpContext(data);
      const validator = new ResourceValidator(ctx);

      const result = (await validator.validate(data)).bundle;
      expect(result.label).toBe('');
    });

    test('accepts resource with whitespace-only label', async () => {
      const data = {
        ...baseResource,
        label: '   ',
        type: 'url' as const,
        url: 'https://example.com',
      };
      const ctx = createMockHttpContext(data);
      const validator = new ResourceValidator(ctx);

      const result = (await validator.validate(data)).bundle;
      expect(result.label).toBe('');
    });

    test.describe('Text type', () => {
      test('requires content', async () => {
        const data = {
          ...baseResource,
          type: 'text' as const,
          content: '',
        };
        const ctx = createMockHttpContext(data);
        const validator = new ResourceValidator(ctx);

        await expect(validator.validate(data)).rejects.toThrow();
      });

      test('accepts valid text resource', async () => {
        const data = {
          ...baseResource,
          type: 'text' as const,
          content: 'Resource body content',
        };
        const ctx = createMockHttpContext(data);
        const validator = new ResourceValidator(ctx);

        const result = (await validator.validate(data)).bundle;
        expect(result.content).toBe('Resource body content');
      });
    });

    test.describe('URL type', () => {
      test('rejects invalid URL', async () => {
        const data = {
          ...baseResource,
          type: 'url' as const,
          url: 'not-a-url',
        };
        const ctx = createMockHttpContext(data);
        const validator = new ResourceValidator(ctx);

        await expect(validator.validate(data)).rejects.toThrow();
      });

      test('rejects URL without protocol', async () => {
        const data = {
          ...baseResource,
          type: 'url' as const,
          url: 'example.com/page',
        };
        const ctx = createMockHttpContext(data);
        const validator = new ResourceValidator(ctx);

        await expect(validator.validate(data)).rejects.toThrow();
      });

      test('accepts valid URL resource', async () => {
        const data = {
          ...baseResource,
          type: 'url' as const,
          url: 'https://example.com/page',
        };
        const ctx = createMockHttpContext(data);
        const validator = new ResourceValidator(ctx);

        const result = (await validator.validate(data)).bundle;
        expect(result.url).toBe('https://example.com/page');
      });
    });

    test.describe('Video type', () => {
      test('rejects missing video', async () => {
        const data = {
          ...baseResource,
          type: 'video' as const,
        };
        const ctx = createMockHttpContext(data);
        const validator = new ResourceValidator(ctx);

        await expect(validator.validate(data)).rejects.toThrow();
      });

      test('rejects video with null url', async () => {
        const data = {
          ...baseResource,
          type: 'video' as const,
          video: { url: null },
        };
        const ctx = createMockHttpContext(data);
        const validator = new ResourceValidator(ctx);

        await expect(validator.validate(data)).rejects.toThrow();
      });

      test('rejects video with invalid extension', async () => {
        const data = {
          ...baseResource,
          type: 'video' as const,
          video: { url: 'https://example.com/video.avi' },
        };
        const ctx = createMockHttpContext(data);
        const validator = new ResourceValidator(ctx);

        await expect(validator.validate(data)).rejects.toThrow();
      });

      test('accepts valid mp4 video', async () => {
        const data = {
          ...baseResource,
          type: 'video' as const,
          video: { url: 'https://example.com/video.mp4' },
        };
        const ctx = createMockHttpContext(data);
        const validator = new ResourceValidator(ctx);

        const result = (await validator.validate(data)).bundle;
        expect(result.video).toEqual({ url: 'https://example.com/video.mp4' });
      });

      test('accepts valid m3u8 video', async () => {
        const data = {
          ...baseResource,
          type: 'video' as const,
          video: { url: 'https://example.com/playlist.m3u8' },
        };
        const ctx = createMockHttpContext(data);
        const validator = new ResourceValidator(ctx);

        const result = (await validator.validate(data)).bundle;
        expect(result.video).toEqual({ url: 'https://example.com/playlist.m3u8' });
      });
    });

    test('uses type from request context for schema selection', async () => {
      const data = {
        ...baseResource,
        type: 'text' as const,
        content: '',
        url: 'https://example.com',
        video: { url: 'https://example.com/video.mp4' },
      };
      const ctx = createMockHttpContext(data);
      const validator = new ResourceValidator(ctx);

      await expect(validator.validate(data)).rejects.toThrow();
    });
  });

  test.describe('with convertEmptyStringsToNull', () => {
    test.beforeEach(() => {
      vine.convertEmptyStringsToNull = true;
    });

    test.afterEach(() => {
      vine.convertEmptyStringsToNull = false;
    });

    test('text returns friendly content message for empty content', async () => {
      const data = {
        ...baseResource,
        type: 'text' as const,
        content: '',
      };
      const ctx = createMockHttpContext(data);
      const validator = new ResourceValidator(ctx);

      await expectValidationMessages(
        () => validator.validate(data),
        [{ field: 'bundle.content', message: 'Please add some content' }],
      );
    });

    test('url returns friendly url message for empty url', async () => {
      const data = {
        ...baseResource,
        type: 'url' as const,
        url: '',
      };
      const ctx = createMockHttpContext(data);
      const validator = new ResourceValidator(ctx);

      await expectValidationMessages(
        () => validator.validate(data),
        [{ field: 'bundle.url', message: 'Please enter a URL' }],
      );
    });

    test('video returns friendly message when video is missing', async () => {
      const data = {
        ...baseResource,
        type: 'video' as const,
      };
      const ctx = createMockHttpContext(data);
      const validator = new ResourceValidator(ctx);

      await expectValidationMessages(
        () => validator.validate(data),
        [{ field: 'bundle.video', message: 'Please upload a video' }],
      );
    });
  });
});
