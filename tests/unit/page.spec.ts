import { test, expect } from '@playwright/test';
import PageValidator from '../../src/backend/validators/page.js';
import type { HttpContext } from '@adonisjs/core/http';

// Helper to create a mock HttpContext
function createMockHttpContext(inputs: Record<string, any>): HttpContext {
  return {
    request: {
      input: (key: string) => inputs[key],
    },
  } as HttpContext;
}

test.describe('Page Validator', () => {
  test.describe('Draft Schema', () => {
    test('requires title', async () => {
      const data = {
        title: '',
        isPublished: false,
      };
      const ctx = createMockHttpContext(data);
      const validator = new PageValidator(ctx);

      await expect(validator.validate(data)).rejects.toThrow();
    });

    test('accepts minimal draft data with title and isPublished', async () => {
      const data = {
        title: 'Test Page',
        isPublished: false,
      };
      const ctx = createMockHttpContext(data);
      const validator = new PageValidator(ctx);

      const result = (await validator.validate(data)).bundle;
      expect(result.title).toBe('Test Page');
      expect(result.isPublished).toBe(false);
    });

    test('accepts partial data with optional fields', async () => {
      const data = {
        title: 'Test Page',
        description: 'Test Description',
        isPublished: false,
      };
      const ctx = createMockHttpContext(data);
      const validator = new PageValidator(ctx);

      const result = (await validator.validate(data)).bundle;
      expect(result.title).toBe('Test Page');
      expect(result.description).toBe('Test Description');
    });

    test('accepts all optional fields', async () => {
      const data = {
        title: 'Test Page',
        icon: 'icon-name',
        description: 'Test Description',
        body: 'Page body content',
        category: 'news',
        type: 'article',
        isPublished: false,
      };
      const ctx = createMockHttpContext(data);
      const validator = new PageValidator(ctx);

      const result = await validator.validate(data);
      expect(result.bundle).toEqual(data);
    });
  });

  test.describe('Live Schema', () => {
    test('requires title', async () => {
      const data = {
        title: '',
        icon: 'icon-name',
        description: 'Test Description',
        body: 'Page body content',
        type: 'article',
        isPublished: true,
      };

      const ctx = createMockHttpContext(data);
      const validator = new PageValidator(ctx);

      await expect(validator.validate(data)).rejects.toThrow();
    });

    test('requires icon', async () => {
      const data = {
        title: 'Test Page',
        description: 'Test Description',
        body: 'Page body content',
        type: 'article',
        isPublished: true,
      };

      const ctx = createMockHttpContext(data);
      const validator = new PageValidator(ctx);

      await expect(validator.validate(data)).rejects.toThrow();
    });

    test('requires description', async () => {
      const data = {
        title: 'Test Page',
        icon: 'icon-name',
        body: 'Page body content',
        type: 'article',
        isPublished: true,
      };

      const ctx = createMockHttpContext(data);
      const validator = new PageValidator(ctx);

      await expect(validator.validate(data)).rejects.toThrow();
    });

    test('requires body', async () => {
      const data = {
        title: 'Test Page',
        icon: 'icon-name',
        description: 'Test Description',
        body: '',
        type: 'article',
        isPublished: true,
      };

      const ctx = createMockHttpContext(data);
      const validator = new PageValidator(ctx);

      await expect(validator.validate(data)).rejects.toThrow();
    });

    test('requires type', async () => {
      const data = {
        title: 'Test Page',
        icon: 'icon-name',
        description: 'Test Description',
        body: 'Page body content',
        isPublished: true,
      };

      const ctx = createMockHttpContext(data);
      const validator = new PageValidator(ctx);

      await expect(validator.validate(data)).rejects.toThrow();
    });

    test('makes category optional', async () => {
      const data = {
        title: 'Test Page',
        icon: 'icon-name',
        description: 'Test Description',
        body: 'Page body content',
        type: 'article',
        isPublished: true,
      };

      const ctx = createMockHttpContext(data);
      const validator = new PageValidator(ctx);

      const result = (await validator.validate(data)).bundle;
      expect(result.category).toBeUndefined();
    });

    test('accepts empty category', async () => {
      const data = {
        title: 'Test Page',
        icon: 'icon-name',
        description: 'Test Description',
        body: 'Page body content',
        type: 'article',
        category: '',
        isPublished: true,
      };

      const ctx = createMockHttpContext(data);
      const validator = new PageValidator(ctx);

      const result = (await validator.validate(data)).bundle;
      expect(result.category).toBe('');
    });

    test('accepts valid complete data', async () => {
      const data = {
        title: 'Test Page',
        icon: 'icon-name',
        description: 'Test Description',
        body: 'Page body content',
        type: 'article',
        category: 'news',
        isPublished: true,
      };
      const ctx = createMockHttpContext(data);
      const validator = new PageValidator(ctx);

      const result = await validator.validate(data);
      expect(result.bundle).toEqual(data);
    });
  });

  test.describe('Live Link Schema', () => {
    test('requires body to be a valid URL when type is link', async () => {
      const data = {
        title: 'Test Page',
        icon: 'icon-name',
        description: 'Test Description',
        body: 'Page body content',
        type: 'link',
        isPublished: true,
      };

      const ctx = createMockHttpContext(data);
      const validator = new PageValidator(ctx);

      await expect(validator.validate(data)).rejects.toThrow();
    });

    test('rejects body without protocol when type is link', async () => {
      const data = {
        title: 'Test Page',
        icon: 'icon-name',
        description: 'Test Description',
        body: 'example.com/page',
        type: 'link',
        isPublished: true,
      };

      const ctx = createMockHttpContext(data);
      const validator = new PageValidator(ctx);

      await expect(validator.validate(data)).rejects.toThrow();
    });

    test('rejects invalid URL for body when type is link', async () => {
      const data = {
        title: 'Test Page',
        icon: 'icon-name',
        description: 'Test Description',
        body: 'not-a-valid-url',
        type: 'link',
        isPublished: true,
      };

      const ctx = createMockHttpContext(data);
      const validator = new PageValidator(ctx);

      await expect(validator.validate(data)).rejects.toThrow();
    });

    test('accepts https URL for body when type is link', async () => {
      const data = {
        title: 'Test Page',
        icon: 'icon-name',
        description: 'Test Description',
        body: 'https://example.com/page',
        type: 'link',
        isPublished: true,
      };

      const ctx = createMockHttpContext(data);
      const validator = new PageValidator(ctx);

      const result = (await validator.validate(data)).bundle;
      expect(result.body).toBe('https://example.com/page');
    });
  });
});
