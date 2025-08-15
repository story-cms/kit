import { FieldSpec } from '../src/types.js';

// Test data for different field types
export const simpleFields: FieldSpec[] = [
  {
    name: 'title',
    label: 'Title',
    widget: 'string',
  },
  {
    name: 'description',
    label: 'Description',
    widget: 'markdown',
  },
  {
    name: 'isActive',
    label: 'Active',
    widget: 'boolean',
  },
  {
    name: 'score',
    label: 'Score',
    widget: 'number',
  },
];

export const complexFields: FieldSpec[] = [
  {
    name: 'title',
    label: 'Title',
    widget: 'string',
  },
  {
    name: 'scripture',
    label: 'Scripture',
    widget: 'scripture',
  },
  {
    name: 'audio',
    label: 'Audio',
    widget: 'audio',
  },
  {
    name: 'image',
    label: 'Image',
    widget: 'image',
  },
  {
    name: 'animation',
    label: 'Animation',
    widget: 'animation',
  },
];

export const nestedFields: FieldSpec[] = [
  {
    name: 'title',
    label: 'Title',
    widget: 'string',
  },
  {
    name: 'metadata',
    label: 'Metadata',
    widget: 'object',
    fields: [
      {
        name: 'author',
        label: 'Author',
        widget: 'string',
      },
      {
        name: 'tags',
        label: 'Tags',
        widget: 'list',
        fields: [
          {
            name: 'icon',
            label: 'Icon',
            widget: 'string',
          },
          {
            name: 'color',
            label: 'Color',
            widget: 'number',
          },
        ],
      },
    ],
  },
  {
    name: 'content',
    label: 'Content',
    widget: 'panel',
    fields: [
      {
        name: 'body',
        label: 'Body',
        widget: 'markdown',
      },
      {
        name: 'summary',
        label: 'Summary',
        widget: 'string',
      },
    ],
  },
];
