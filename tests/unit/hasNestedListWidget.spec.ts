import { test, expect } from '@playwright/test';

import type { FieldSpec } from '../../src/types.js';
import { hasNestedListWidget } from '../../src/frontend/shared/helpers';

test.describe('hasNestedListWidget', () => {
  test('returns true for a panel containing a nested list', () => {
    const notesPanel: FieldSpec = {
      label: '',
      name: 'notes',
      widget: 'panel',
      fields: [
        {
          label: 'Segments',
          name: 'segments',
          widget: 'list',
          canFold: true,
          fields: [
            { label: 'Segment Title', name: 'title', widget: 'string' },
            { label: 'Video URL', name: 'videoUrl', widget: 'string' },
            {
              label: 'Sections',
              name: 'sections',
              widget: 'list',
              fields: [{ label: 'Title', name: 'title', widget: 'string' }],
            },
          ],
        },
      ],
    };

    expect(hasNestedListWidget(notesPanel)).toBe(true);
  });

  test('returns false for a panel with only string/markdown fields', () => {
    const titlePanel: FieldSpec = {
      name: 'title',
      label: 'Devotion Title',
      widget: 'panel',
      fields: [
        { label: 'Devotion Title', name: 'title', widget: 'string' },
        { label: 'Introduction', name: 'introduction', widget: 'markdown' },
      ],
    };

    expect(hasNestedListWidget(titlePanel)).toBe(false);
  });

  test('returns true for a bare list-widget field', () => {
    const listField: FieldSpec = {
      label: 'Resources',
      name: 'resources',
      widget: 'list',
      fields: [{ label: 'Title', name: 'title', widget: 'string' }],
    };

    expect(hasNestedListWidget(listField)).toBe(true);
  });

  test('returns false for a field with no nested fields', () => {
    const stringField: FieldSpec = { label: 'Title', name: 'title', widget: 'string' };

    expect(hasNestedListWidget(stringField)).toBe(false);
  });

  test('returns true for a list nested two levels deep', () => {
    const outerList: FieldSpec = {
      label: 'Segments',
      name: 'segments',
      widget: 'list',
      fields: [
        {
          label: 'Sections',
          name: 'sections',
          widget: 'list',
          fields: [{ label: 'Title', name: 'title', widget: 'string' }],
        },
      ],
    };

    expect(hasNestedListWidget(outerList)).toBe(true);
  });

  test('returns false for an object field with a FieldMap containing no list', () => {
    const wisdom: FieldSpec = {
      widget: 'object',
      label: '',
      name: 'wisdom',
      fields: {
        passage: { label: 'Wisdom Scripture', name: 'passage', widget: 'scripture' },
        comment: { label: 'Wisdom Commentary', name: 'comment', widget: 'markdown' },
      },
    };

    expect(hasNestedListWidget(wisdom)).toBe(false);
  });
});
