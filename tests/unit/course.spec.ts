import { test, expect } from '@playwright/test';
import { CourseValidator } from '../../src/backend/validators/course.js';
import { courseFields } from '../../src/backend/define_config.js';

const videoConfig = {
  collection: 'test-video',
  description: 'MP4 files',
  extensions: ['.mp4'],
  maxSize: 1000,
};

const imageConfig = {
  collection: 'test-image',
  description: 'PNG files',
  extensions: ['.png'],
  maxSize: 1000,
};

const validBundle = () => ({
  bundle: {
    title: 'Introduction to Alongsiding',
    imageUrl: 'https://example.com/cover.png',
    screens: [
      {
        screenName: 'Welcome',
      },
    ],
  },
});

const validBundleWithSection = () => ({
  bundle: {
    ...validBundle().bundle,
    section: 'Module 1',
  },
});

test.describe('CourseValidator', () => {
  test('accepts bundle without section by default', async () => {
    const validator = new CourseValidator();
    const result = await validator.validate(validBundle());

    expect(result.bundle.title).toBe('Introduction to Alongsiding');
    expect(result.bundle.section).toBeUndefined();
  });

  test('rejects missing section when hasSections is true', async () => {
    const validator = new CourseValidator({ hasSections: true });

    await expect(validator.validate(validBundle())).rejects.toThrow();
  });

  test('accepts valid bundle with section when hasSections is true', async () => {
    const validator = new CourseValidator({ hasSections: true });
    const result = await validator.validate(validBundleWithSection());

    expect(result.bundle.section).toBe('Module 1');
  });

  test('accepts bundle without imageUrl', async () => {
    const validator = new CourseValidator();
    const { title, screens } = validBundle().bundle;
    const result = await validator.validate({ bundle: { title, screens } });

    expect(result.bundle.title).toBe('Introduction to Alongsiding');
    expect(result.bundle.imageUrl).toBeUndefined();
  });
});

test.describe('courseFields', () => {
  test('omits section field when hasSections is false', () => {
    const fields = courseFields(videoConfig, imageConfig, { hasSections: false });

    expect(fields.some((field) => field.name === 'section')).toBe(false);
  });

  test('includes section field when hasSections is true', () => {
    const fields = courseFields(videoConfig, imageConfig, { hasSections: true });

    expect(fields.some((field) => field.name === 'section')).toBe(true);
  });
});
