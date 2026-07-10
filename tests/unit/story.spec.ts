import { test, expect } from '@playwright/test';
import type { HttpContext } from '@adonisjs/core/http';
import vine from '@vinejs/vine';
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

function withoutKey<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  key: K,
): Omit<T, K> {
  const rest = { ...obj };
  delete rest[key];
  return rest;
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

const minimalCreateData = {
  title: 'Gospel of John',
  chapterLimit: 12,
  storyType: 'Story',
  chapterType: 'Chapter',
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
  test.beforeEach(() => {
    vine.convertEmptyStringsToNull = false;
  });

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

    test('requires chapterLimit', async () => {
      const validator = new StoryCreateValidator();

      await expect(
        validator.validate({
          ...validCreateData,
          chapterLimit: 0,
        }),
      ).rejects.toThrow();
    });

    test('requires storyType', async () => {
      const validator = new StoryCreateValidator();

      await expect(
        validator.validate({
          ...validCreateData,
          storyType: '',
        }),
      ).rejects.toThrow();
    });

    test('requires chapterType', async () => {
      const validator = new StoryCreateValidator();

      await expect(
        validator.validate({
          ...validCreateData,
          chapterType: '',
        }),
      ).rejects.toThrow();
    });

    test('accepts valid create payload', async () => {
      const validator = new StoryCreateValidator();
      const result = await validator.validate(validCreateData);

      expect(result.bundle.title).toBe('Gospel of John');
      expect(result.bundle.template).toBe('course');
    });

    test('accepts create without description', async () => {
      const validator = new StoryCreateValidator();
      const data = withoutKey(validCreateData, 'description');
      const result = await validator.validate(data);

      expect(result.bundle.title).toBe('Gospel of John');
      expect(result.bundle.description).toBeUndefined();
    });

    test('accepts minimal create payload', async () => {
      const validator = new StoryCreateValidator();
      const result = await validator.validate(minimalCreateData);

      expect(result.bundle.title).toBe('Gospel of John');
      expect(result.bundle.chapterLimit).toBe(12);
      expect(result.bundle.storyType).toBe('Story');
      expect(result.bundle.chapterType).toBe('Chapter');
      expect(result.bundle.template).toBe('course');
    });

    test('accepts blank visibility', async () => {
      const validator = new StoryCreateValidator();
      const result = await validator.validate({
        ...minimalCreateData,
        visibility: '',
      });

      expect(result.bundle.visibility).toBe('');
    });

    test('rejects null storyType and chapterType', async () => {
      const validator = new StoryCreateValidator();

      await expect(
        validator.validate({
          ...minimalCreateData,
          storyType: null,
          chapterType: null,
        }),
      ).rejects.toThrow();
    });

    test('rejects omitted storyType and chapterType', async () => {
      const validator = new StoryCreateValidator();

      await expect(
        validator.validate({
          title: 'Gospel of John',
          chapterLimit: 12,
          template: 'course',
        }),
      ).rejects.toThrow();
    });

    test('accepts create without sections or resources', async () => {
      const validator = new StoryCreateValidator();
      const result = await validator.validate(minimalCreateData);

      expect(result.bundle.sections).toBeUndefined();
      expect(result.bundle.resources).toBeUndefined();
    });

    test('accepts create with sections and resources', async () => {
      const validator = new StoryCreateValidator();
      const result = await validator.validate({
        ...minimalCreateData,
        sections: [{ title: 'Introduction', description: 'Opening section' }],
        resources: ['00000000-0000-0000-0000-000000000001'],
      });

      expect(result.bundle.sections).toHaveLength(1);
      expect(result.bundle.sections[0].title).toBe('Introduction');
      expect(result.bundle.resources).toEqual([
        '00000000-0000-0000-0000-000000000001',
      ]);
    });

    test('rejects create with blank section title', async () => {
      const validator = new StoryCreateValidator();

      await expect(
        validator.validate({
          ...minimalCreateData,
          sections: [{ title: '' }],
        }),
      ).rejects.toThrow();
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

      test('accepts draft without description', async () => {
        const data = withoutKey(validDraftUpdateData, 'description');
        const ctx = createMockHttpContext(data);
        const validator = new StoryUpdateValidator(ctx);
        const result = await validator.validate(data);

        expect(result.bundle.title).toBe('Gospel of John');
        expect(result.bundle.description).toBeUndefined();
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

      test('requires story type', async () => {
        const data = {
          ...validPublishUpdateData,
          storyType: '',
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

      test('accepts publish without description', async () => {
        const data = withoutKey(validPublishUpdateData, 'description');
        const ctx = createMockHttpContext(data);
        const validator = new StoryUpdateValidator(ctx);
        const result = await validator.validate(data);

        expect(result.bundle.title).toBe('Gospel of John');
        expect(result.bundle.description).toBeUndefined();
      });
    });
  });

  test.describe('with convertEmptyStringsToNull', () => {
    test.beforeEach(() => {
      vine.convertEmptyStringsToNull = true;
    });

    test.afterEach(() => {
      vine.convertEmptyStringsToNull = false;
    });

    test('create returns friendly title message for empty title', async () => {
      const validator = new StoryCreateValidator();

      await expectValidationMessages(
        () =>
          validator.validate({
            ...validCreateData,
            title: '',
          }),
        [{ field: 'bundle.title', message: 'Please add a title.' }],
      );
    });

    test('create returns friendly storyType message for empty storyType', async () => {
      const validator = new StoryCreateValidator();

      await expectValidationMessages(
        () =>
          validator.validate({
            ...validCreateData,
            storyType: '',
          }),
        [
          {
            field: 'bundle.storyType',
            message: 'Please choose a story type.',
          },
        ],
      );
    });

    test('create returns friendly storyType message for null storyType', async () => {
      const validator = new StoryCreateValidator();

      await expectValidationMessages(
        () =>
          validator.validate({
            ...validCreateData,
            storyType: null,
          }),
        [
          {
            field: 'bundle.storyType',
            message: 'Please choose a story type.',
          },
        ],
      );
    });

    test('update returns friendly storyType message for empty storyType', async () => {
      const data = {
        ...validDraftUpdateData,
        storyType: '',
      };
      const ctx = createMockHttpContext(data);
      const validator = new StoryUpdateValidator(ctx);

      await expectValidationMessages(
        () => validator.validate(data),
        [
          {
            field: 'bundle.storyType',
            message: 'Please choose a story type.',
          },
        ],
      );
    });

    test('update returns friendly storyType message for null storyType', async () => {
      const data = {
        ...validDraftUpdateData,
        storyType: null,
      };
      const ctx = createMockHttpContext(data);
      const validator = new StoryUpdateValidator(ctx);

      await expectValidationMessages(
        () => validator.validate(data),
        [
          {
            field: 'bundle.storyType',
            message: 'Please choose a story type.',
          },
        ],
      );
    });

    test('create returns friendly chapterType message for empty chapterType', async () => {
      const validator = new StoryCreateValidator();

      await expectValidationMessages(
        () =>
          validator.validate({
            ...validCreateData,
            chapterType: '',
          }),
        [
          {
            field: 'bundle.chapterType',
            message: 'Please choose a chapter type.',
          },
        ],
      );
    });

    test('create returns friendly chapterType message for null chapterType', async () => {
      const validator = new StoryCreateValidator();

      await expectValidationMessages(
        () =>
          validator.validate({
            ...validCreateData,
            chapterType: null,
          }),
        [
          {
            field: 'bundle.chapterType',
            message: 'Please choose a chapter type.',
          },
        ],
      );
    });

    test('update returns friendly chapterType message for empty chapterType', async () => {
      const data = {
        ...validDraftUpdateData,
        chapterType: '',
      };
      const ctx = createMockHttpContext(data);
      const validator = new StoryUpdateValidator(ctx);

      await expectValidationMessages(
        () => validator.validate(data),
        [
          {
            field: 'bundle.chapterType',
            message: 'Please choose a chapter type.',
          },
        ],
      );
    });

    test('update returns friendly chapterType message for null chapterType', async () => {
      const data = {
        ...validDraftUpdateData,
        chapterType: null,
      };
      const ctx = createMockHttpContext(data);
      const validator = new StoryUpdateValidator(ctx);

      await expectValidationMessages(
        () => validator.validate(data),
        [
          {
            field: 'bundle.chapterType',
            message: 'Please choose a chapter type.',
          },
        ],
      );
    });
  });
});
