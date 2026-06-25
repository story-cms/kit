import { test, expect } from '@playwright/test';
import { ResourceValidator } from '../../src/backend/validators/resource.js';
import type { HttpContext } from '@adonisjs/core/http';

function createMockHttpContext(inputs: Record<string, any>): HttpContext {
  return {
    request: {
      input: (key: string) => inputs[key],
    },
  } as HttpContext;
}

const baseResource = {
  title: 'Test Resource',
  label: 'Reading',
  visibility: 'public' as const,
};

test.describe('Resource Validator', () => {
  test.describe('Published resources', () => {
    test('requires title', async () => {
      const data = {
        ...baseResource,
        title: '',
        type: 'url_link' as const,
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
        type: 'url_link' as const,
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
        type: 'url_link' as const,
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

    test.describe('URL link type', () => {
      test('rejects invalid URL', async () => {
        const data = {
          ...baseResource,
          type: 'url_link' as const,
          url: 'not-a-url',
        };
        const ctx = createMockHttpContext(data);
        const validator = new ResourceValidator(ctx);

        await expect(validator.validate(data)).rejects.toThrow();
      });

      test('rejects URL without protocol', async () => {
        const data = {
          ...baseResource,
          type: 'url_link' as const,
          url: 'example.com/page',
        };
        const ctx = createMockHttpContext(data);
        const validator = new ResourceValidator(ctx);

        await expect(validator.validate(data)).rejects.toThrow();
      });

      test('accepts valid URL link resource', async () => {
        const data = {
          ...baseResource,
          type: 'url_link' as const,
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
});
