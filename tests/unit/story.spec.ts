import { test, expect } from '@playwright/test';
import type { HttpContext } from '@adonisjs/core/http';
import {
  StoryCreateValidator,
  StoryUpdateValidator,
} from '../../src/backend/validators/story.js';

function createMockHttpContext(inputs: Record<string, unknown>): HttpContext {
  return {
    request: {
      input: (key: string) => inputs[key],
    },
  } as HttpContext;
}

const validCreateData = {
  title: 'Gospel of John',
  description: 'A study through John',
  chapterLimit: 12,
  storyType: 'Course',
  chapterType: 'Session',
  visibility: 'public',
  template: 'course',
};

const validDraftUpdateData = {
  title: 'Gospel of John',
  description: 'A study through John',
  chapterLimit: 12,
  storyType: 'Course',
  chapterType: 'Session',
  visibility: 'public',
  isPublished: false,
  sections: [],
  resources: ['00000000-0000-0000-0000-000000000001'],
};

const validPublishUpdateData = {
  title: 'Gospel of John',
  coverImage: 'https://example.com/cover.jpg',
  description: 'A study through John',
  chapterLimit: 12,
  storyType: 'Course',
  chapterType: 'Session',
  visibility: 'public',
  isPublished: true,
  sections: [{ title: 'Introduction' }],
  resources: ['00000000-0000-0000-0000-000000000001'],
};

test.describe('Story Validator', () => {
  test.describe('StoryCreateValidator', () => {
    test('requires title', async () => {
      const validator = new StoryCreateValidator();

      await expect(
        validator.validate({
          ...validCreateData,
          title: '',
        }),
      ).rejects.toThrow();
    });

    test('requires template', async () => {
      const validator = new StoryCreateValidator();

      await expect(
        validator.validate({
          ...validCreateData,
          template: '',
        }),
      ).rejects.toThrow();
    });

    test('accepts valid create payload', async () => {
      const validator = new StoryCreateValidator();
      const result = await validator.validate(validCreateData);

      expect(result.bundle.title).toBe('Gospel of John');
      expect(result.bundle.template).toBe('course');
    });
  });

  test.describe('StoryUpdateValidator', () => {
    test.describe('Draft schema', () => {
      test('requires title', async () => {
        const data = { ...validDraftUpdateData, title: '' };
        const ctx = createMockHttpContext(data);
        const validator = new StoryUpdateValidator(ctx);

        await expect(validator.validate(data)).rejects.toThrow();
      });

      test('accepts optional resources', async () => {
        const ctx = createMockHttpContext(validDraftUpdateData);
        const validator = new StoryUpdateValidator(ctx);
        const result = await validator.validate(validDraftUpdateData);

        expect(result.bundle.resources).toEqual([
          '00000000-0000-0000-0000-000000000001',
        ]);
      });

      test('accepts draft without resources', async () => {
        const data = {
          ...validDraftUpdateData,
          resources: undefined,
        };
        const ctx = createMockHttpContext(data);
        const validator = new StoryUpdateValidator(ctx);
        const result = await validator.validate(data);

        expect(result.bundle.title).toBe('Gospel of John');
        expect(result.bundle.resources).toBeUndefined();
      });
    });

    test.describe('Publish schema', () => {
      test('requires cover image', async () => {
        const data = {
          ...validPublishUpdateData,
          coverImage: '',
        };
        const ctx = createMockHttpContext(data);
        const validator = new StoryUpdateValidator(ctx);

        await expect(validator.validate(data)).rejects.toThrow();
      });

      test('requires sections', async () => {
        const data = {
          ...validPublishUpdateData,
          sections: [{ title: '' }],
        };
        const ctx = createMockHttpContext(data);
        const validator = new StoryUpdateValidator(ctx);

        await expect(validator.validate(data)).rejects.toThrow();
      });

      test('accepts resources array when publishing', async () => {
        const ctx = createMockHttpContext(validPublishUpdateData);
        const validator = new StoryUpdateValidator(ctx);
        const result = await validator.validate(validPublishUpdateData);

        expect(result.bundle.resources).toEqual([
          '00000000-0000-0000-0000-000000000001',
        ]);
        expect(result.bundle.sections).toHaveLength(1);
      });
    });
  });
});
