import { test, expect } from '@playwright/test';
import vine from '@vinejs/vine';
import { CourseValidator } from '../../src/backend/validators/course.js';

const visibility = {
  presenter: true,
  personal: false,
  inNavigation: true,
  hidden: false,
};

const contentBlock = () => ({
  id: 'content-1',
  kind: 'content',
  blockName: 'Introduction',
  visibility,
  displayName: 'Welcome',
  blockRole: 'introduction',
  style: 'primary',
  content: 'A short introduction.',
  items: [],
  leadersNotes: '',
  showLeadersNotes: false,
});

const titleBlock = () => ({
  id: 'title-1',
  kind: 'title',
  blockName: 'Title',
  visibility,
  title: 'Session one',
  subtitle: '',
  coverImage: '',
});

const validBundle = () => ({
  bundle: {
    number: '01',
    title: 'Introduction to Alongsiding',
    description: 'Opening session',
    coverImage: '',
    blocks: [contentBlock(), titleBlock()],
    resources: [],
  },
});

test.describe('CourseValidator', () => {
  test.beforeEach(() => {
    vine.convertEmptyStringsToNull = false;
  });

  test('accepts valid block-based bundle', async () => {
    const validator = new CourseValidator();
    const result = await validator.validate(validBundle());

    expect(result.bundle.title).toBe('Introduction to Alongsiding');
    expect(result.bundle.blocks).toHaveLength(2);
  });

  test('accepts bundle with cover image', async () => {
    const validator = new CourseValidator();
    const result = await validator.validate({
      bundle: {
        ...validBundle().bundle,
        coverImage: 'https://example.com/cover.png',
      },
    });

    expect(result.bundle.coverImage).toBe('https://example.com/cover.png');
  });

  test('rejects scripture block kind', async () => {
    const validator = new CourseValidator();

    await expect(
      validator.validate({
        bundle: {
          ...validBundle().bundle,
          blocks: [
            contentBlock(),
            {
              id: 'scripture-1',
              kind: 'scripture',
              blockName: 'Scripture',
              visibility,
              displayName: 'Passage',
              scripture: { reference: 'John 3:16', verse: 'For God so loved the world.' },
              leadersNotes: '',
              showLeadersNotes: false,
            },
          ],
        },
      }),
    ).rejects.toBeDefined();
  });

  test('requires at least one block', async () => {
    const validator = new CourseValidator();

    await expect(
      validator.validate({
        bundle: {
          ...validBundle().bundle,
          blocks: [],
        },
      }),
    ).rejects.toBeDefined();
  });
});
