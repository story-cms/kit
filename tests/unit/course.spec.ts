import { test, expect } from '@playwright/test';
import vine from '@vinejs/vine';
import { CourseValidator } from '../../src/backend/validators/course.js';

const validBundle = () => ({
  bundle: {
    title: 'Introduction to Alongsiding',
    screens: [
      {
        screenName: 'Welcome',
      },
    ],
  },
});

test.describe('CourseValidator', () => {
  test.beforeEach(() => {
    vine.convertEmptyStringsToNull = false;
  });

  test('accepts bundle without imageUrl', async () => {
    const validator = new CourseValidator();
    const result = await validator.validate(validBundle());

    expect(result.bundle.title).toBe('Introduction to Alongsiding');
    expect(result.bundle.imageUrl).toBeUndefined();
  });

  test('accepts bundle with imageUrl', async () => {
    const validator = new CourseValidator();
    const result = await validator.validate({
      bundle: {
        ...validBundle().bundle,
        imageUrl: 'https://example.com/cover.png',
      },
    });

    expect(result.bundle.imageUrl).toBe('https://example.com/cover.png');
  });
});
