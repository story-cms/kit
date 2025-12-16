import { test, expect } from '@playwright/test';
import { BundleService } from '../../src/backend/services/bundle_service.js';
import { complexFields, nestedFields, simpleFields } from '../mocks.js';
import vine from '@vinejs/vine';

test.describe('Bundle builder', () => {
  test('Identify junk', () => {
    // arrange
    const service = new BundleService(simpleFields);

    // act
    const defaultBundle = service.defaultBundle;

    // assert
    const parsed = JSON.parse(defaultBundle);
    expect(parsed.title).toBeDefined();
    expect(parsed.description).toBeDefined();
    expect(parsed.isActive).toBeDefined();
    expect(parsed.score).toBeDefined();
    expect(parsed.title).toBe('');
    expect(parsed.description).toBe('');
    expect(parsed.isActive).toBe('');
    expect(parsed.score).toBe('');
  });

  test('generates default bundle for complex fields', async () => {
    // arrange
    const service = new BundleService(complexFields);

    // act
    const defaultBundle = service.defaultBundle;

    // assert
    const parsed = JSON.parse(defaultBundle);
    expect(parsed.title).toBeDefined();
    expect(parsed.scripture).toBeDefined();
    expect(parsed.audio).toBeDefined();
    expect(parsed.image).toBeDefined();
    expect(parsed.animation).toBeDefined();
    expect(parsed.title).toBe('');
    expect(parsed.image).toBe('');
    expect(parsed.animation).toBe('');
    expect(parsed.passage).toStrictEqual([]);
  });

  test('generates default bundle for nested fields', async () => {
    // arrange
    const service = new BundleService(nestedFields);

    // act
    const defaultBundle = service.defaultBundle;

    // assert
    const parsed = JSON.parse(defaultBundle);
    expect(parsed.title).toBeDefined();
    expect(parsed.metadata).toBeDefined();
    expect(parsed.metadata.passage).toBeDefined();
    // panel fields are not nested
    expect(parsed.body).toBeDefined();
    expect(parsed.summary).toBeDefined();
    expect(parsed.title).toBe('');
    expect(parsed.metadata).toEqual({ author: '', window: '', tags: [], passage: [] });
  });
});

test.describe('Bundle updater', () => {
  test('updates bundle with new changes', async () => {
    // arrange
    const service = new BundleService(simpleFields);
    const oldBundle = {
      title: 'Old Title',
      description: 'Old Description',
      isActive: 'true',
      score: '10',
    };
    const changes = {
      title: 'New Title',
      score: '20',
    };

    // act
    const updatedBundle = service.updatedBundle(oldBundle, changes);

    // assert
    const parsed = JSON.parse(updatedBundle);
    expect(parsed.title).toBe('New Title');
    expect(parsed.description).toBe('Old Description');
    expect(parsed.isActive).toBe('true');
    expect(parsed.score).toBe('20');
  });

  test('updates bundle with missing old values', async () => {
    // arrange
    const service = new BundleService(simpleFields);
    const oldBundle = {
      title: 'Old Title',
      // description missing
      isActive: 'true',
      // score missing
    };
    const changes = {
      title: 'New Title',
      description: 'New Description',
    };

    // act
    const updatedBundle = service.updatedBundle(oldBundle, changes);

    // assert
    const parsed = JSON.parse(updatedBundle);
    expect(parsed.title).toBe('New Title');
    expect(parsed.description).toBe('New Description');
    expect(parsed.isActive).toBe('true');
    expect(parsed.score).toBe(''); // fallback value
  });

  test('updates bundle with empty old bundle', async () => {
    // arrange
    const service = new BundleService(simpleFields);
    const oldBundle = {};
    const changes = {
      title: 'New Title',
      score: '15',
    };

    // act
    const updatedBundle = service.updatedBundle(oldBundle, changes);

    // assert
    const parsed = JSON.parse(updatedBundle);
    expect(parsed.title).toBe('New Title');
    expect(parsed.description).toBe(''); // fallback value
    expect(parsed.isActive).toBe(''); // fallback value
    expect(parsed.score).toBe('15');
  });

  test('updates bundle with no changes', async () => {
    // arrange
    const service = new BundleService(simpleFields);
    const oldBundle = {
      title: 'Old Title',
      description: 'Old Description',
      isActive: 'true',
      score: '10',
    };
    const changes = {};

    // act
    const updatedBundle = service.updatedBundle(oldBundle, changes);

    // assert
    const parsed = JSON.parse(updatedBundle);
    expect(parsed.title).toBe('Old Title');
    expect(parsed.description).toBe('Old Description');
    expect(parsed.isActive).toBe('true');
    expect(parsed.score).toBe('10');
  });

  test('updates bundle with nested fields', async () => {
    // arrange
    const service = new BundleService(nestedFields);
    const oldBundle = {
      title: 'Old Title',
      metadata: {
        author: 'Old Author',
        window: '2025-01-01T00:00:00.000Z|2025-01-02T00:00:00.000Z',
        tags: [
          {
            icon: 'old',
            color: 0,
          },
        ],
        passage: ['JHN.1.14'],
      },
      body: 'Old Body',
      summary: 'Old Summary',
    };
    const changes = {
      title: 'New Title',
      metadata: {
        author: 'New Author',
        window: '2025-01-03T00:00:00.000Z|2025-01-04T00:00:00.000Z',
        tags: [
          {
            icon: 'new',
            color: 1,
          },
        ],
        passage: ['JHN.10.10'],
      },
    };

    // act
    const updatedBundle = service.updatedBundle(oldBundle, changes);

    // assert
    const parsed = JSON.parse(updatedBundle);
    expect(parsed.title).toBe('New Title');
    expect(parsed.metadata).toEqual({
      author: 'New Author',
      window: '2025-01-03T00:00:00.000Z|2025-01-04T00:00:00.000Z',
      tags: [
        {
          icon: 'new',
          color: 1,
        },
      ],
      passage: ['JHN.10.10'],
    });
    expect(parsed.body).toBe('Old Body');
    expect(parsed.summary).toBe('Old Summary');
  });

  test('handles empty field spec array', async () => {
    // arrange
    const service = new BundleService([]);

    // act
    const validationBuilder = service.getValidationBuilder(false);
    const defaultBundle = service.defaultBundle;

    // assert
    expect(validationBuilder).toEqual({});
    expect(defaultBundle).toBe('{  }');
  });
});

test.describe('Bundle validator', () => {
  test('it can validate a complex object', async () => {
    // arrange
    const objectSpec = [
      {
        name: 'name',
        label: 'Name',
        widget: 'string',
      },
      {
        name: 'age',
        label: 'Age',
        widget: 'number',
      },
      {
        name: 'notes',
        label: 'Notes',
        widget: 'markdown',
      },
      {
        name: 'passage',
        label: 'Passage',
        widget: 'scriptureReference',
      },
      {
        name: 'profile',
        label: 'Profile',
        widget: 'select',
      },
      {
        name: 'address',
        label: '',
        widget: 'object',
        fields: {
          street: {
            name: 'street',
            label: 'Street',
            widget: 'string',
          },
          city: {
            name: 'city',
            label: 'City',
            widget: 'string',
          },
          zip: {
            name: 'zip',
            label: 'Zip',
            widget: 'string',
          },
          favoriteScripture: {
            name: 'favoriteScripture',
            label: 'Favorite Scripture',
            widget: 'scripture',
          },
          window: {
            name: 'dates',
            label: 'Campaign dates',
            widget: 'dateRange',
          },
        },
      },
    ];

    const service = new BundleService(objectSpec);

    // act
    const schema = service.getValidationBuilder(false);

    const validData = {
      name: 'John',
      age: 30,
      notes: '# The Outing\nWe went to the park at *09h00* on a **sunny** day.',
      passage: ['JHN.1.14'],
      profile: '',
      address: {
        street: '123 Main St',
        city: 'New York',
        zip: '10001',
        favoriteScripture: {
          reference: 'John 3:16',
          verse:
            '`16` For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.',
        },
        dates: 'blah',
      },
    };

    // should pass
    const output = await vine.validate({
      schema: vine.object(schema),
      data: validData,
    });

    expect(output).toEqual(validData);

    const dataWithMissingVerse = {
      ...validData,
      address: {
        ...validData.address,
        favoriteScripture: {
          reference: 'John 3:16',
        },
      },
    };

    // Test that validation fails when required field is missing
    await expect(async () => {
      await vine.validate({
        schema: vine.object(schema),
        data: dataWithMissingVerse,
      });
    }).rejects.toThrow();

    const dataWithEmptyPassage = {
      ...validData,
      passage: [],
    };

    // Test that validation fails when required field is missing
    await expect(async () => {
      await vine.validate({
        schema: vine.object(schema),
        data: dataWithEmptyPassage,
      });
    }).rejects.toThrow();
  });

  test('it can validate nested fields', async () => {
    // arrange
    const objectSpec = [
      {
        name: 'hero',
        label: 'Hero',
        widget: 'panel',
        fields: [
          {
            name: 'title',
            label: 'Title',
            widget: 'string',
          },
          {
            name: 'cta',
            label: 'Call To Action',
            widget: 'string',
          },
        ],
      },
      {
        name: 'latest',
        label: 'Latest',
        widget: 'list',
        fields: [
          {
            name: 'team',
            label: 'Team',
            widget: 'string',
          },
          {
            name: 'score',
            label: 'Score',
            widget: 'number',
          },
        ],
      },
    ];

    const service = new BundleService(objectSpec);

    // act
    const schema = service.getValidationBuilder(false);
    // console.log(schema);

    const data = {
      title: 'URC Results',
      cta: 'View All Results',
      latest: [
        {
          team: 'Stormers',
          score: 100,
        },
        {
          team: 'Bulls',
          score: 10,
        },
        {
          team: 'Sharks',
          score: 20,
        },
      ],
    };

    // should pass
    const output = await vine.validate({
      schema: vine.object(schema),
      data,
    });
    expect(output).toEqual(data);

    const dataWithMissingScore = {
      ...data,
      latest: [
        {
          team: 'Lions',
        },
      ],
    };

    // Test that validation fails when required field is missing
    await expect(async () => {
      await vine.validate({
        schema: vine.object(schema),
        data: dataWithMissingScore,
      });
    }).rejects.toThrow();
  });

  test('scripture fields', async () => {
    // arrange
    const scriptureSpec = [
      {
        name: 'favoriteScripture',
        label: 'Favorite Scripture',
        widget: 'scripture',
      },
    ];

    const service = new BundleService(scriptureSpec);

    // act
    const draftSchema = service.getValidationBuilder(true);

    // should pass with complete data
    const completeData = {
      favoriteScripture: {
        reference: 'John 3:16',
        verse: 'For God so loved the world...',
      },
    };

    const completeOutput = await vine.validate({
      schema: vine.object(draftSchema),
      data: completeData,
    });
    expect(completeOutput).toEqual(completeData);

    // should pass with null verse
    const dataWithNullVerse = {
      favoriteScripture: {
        reference: 'John 3:16',
        verse: null,
      },
    };

    const nullVerseOutput = await vine.validate({
      schema: vine.object(draftSchema),
      data: dataWithNullVerse,
    });
    expect(nullVerseOutput).toEqual(dataWithNullVerse);

    // should pass with null reference
    const dataWithNullReference = {
      favoriteScripture: {
        reference: null,
        verse: 'For God so loved the world...',
      },
    };

    const nullReferenceOutput = await vine.validate({
      schema: vine.object(draftSchema),
      data: dataWithNullReference,
    });
    expect(nullReferenceOutput).toEqual(dataWithNullReference);

    // should pass with both fields null
    const dataWithBothNull = {
      favoriteScripture: {
        reference: null,
        verse: null,
      },
    };

    const bothNullOutput = await vine.validate({
      schema: vine.object(draftSchema),
      data: dataWithBothNull,
    });
    expect(bothNullOutput).toEqual(dataWithBothNull);
  });

  test('audio fields', async () => {
    // arrange
    const audioSpec = [
      {
        name: 'backgroundMusic',
        label: 'Background Music',
        widget: 'audio',
      },
    ];

    const service = new BundleService(audioSpec);

    // act
    const draftSchema = service.getValidationBuilder(true);

    // should pass with complete data
    const completeData = {
      backgroundMusic: {
        url: 'https://example.com/audio.mp3',
        length: 120,
      },
    };

    const completeOutput = await vine.validate({
      schema: vine.object(draftSchema),
      data: completeData,
    });
    expect(completeOutput).toEqual(completeData);

    // should pass with null length
    const dataWithNullLength = {
      backgroundMusic: {
        url: 'https://example.com/audio.mp3',
        length: null,
      },
    };

    const nullLengthOutput = await vine.validate({
      schema: vine.object(draftSchema),
      data: dataWithNullLength,
    });
    expect(nullLengthOutput).toEqual(dataWithNullLength);

    // should pass with null url
    const dataWithNullUrl = {
      backgroundMusic: {
        url: null,
        length: 120,
      },
    };

    const nullUrlOutput = await vine.validate({
      schema: vine.object(draftSchema),
      data: dataWithNullUrl,
    });
    expect(nullUrlOutput).toEqual(dataWithNullUrl);

    // should pass with both fields null
    const dataWithBothNull = {
      backgroundMusic: {
        url: null,
        length: null,
      },
    };

    const bothNullOutput = await vine.validate({
      schema: vine.object(draftSchema),
      data: dataWithBothNull,
    });
    expect(bothNullOutput).toEqual(dataWithBothNull);
  });

  test('object fields', async () => {
    // arrange
    const objectSpec = [
      {
        name: 'profile',
        label: 'Profile',
        widget: 'object',
        fields: {
          name: {
            name: 'name',
            label: 'Name',
            widget: 'string',
          },
          favoriteScripture: {
            name: 'favoriteScripture',
            label: 'Favorite Scripture',
            widget: 'scripture',
          },
          backgroundMusic: {
            name: 'backgroundMusic',
            label: 'Background Music',
            widget: 'audio',
          },
        },
      },
    ];

    const service = new BundleService(objectSpec);

    // act
    const draftSchema = service.getValidationBuilder(true);

    // should pass with complete data
    const completeData = {
      profile: {
        name: 'John Doe',
        favoriteScripture: {
          reference: 'John 3:16',
          verse: 'For God so loved the world...',
        },
        backgroundMusic: {
          url: 'https://example.com/audio.mp3',
          length: 120,
        },
      },
    };

    const completeOutput = await vine.validate({
      schema: vine.object(draftSchema),
      data: completeData,
    });
    expect(completeOutput).toEqual(completeData);

    // should pass with multiple missing fields
    const dataWithMultipleMissing = {
      profile: {
        name: 'John Doe',
        favoriteScripture: {
          reference: null,
          verse: null,
        },
        backgroundMusic: {
          url: null,
          length: null,
        },
      },
    };

    const multipleMissingOutput = await vine.validate({
      schema: vine.object(draftSchema),
      data: dataWithMultipleMissing,
    });
    expect(multipleMissingOutput).toEqual(dataWithMultipleMissing);
  });

  test('list fields', async () => {
    // arrange
    const listSpec = [
      {
        name: 'songs',
        label: 'Songs',
        widget: 'list',
        fields: [
          {
            name: 'title',
            label: 'Title',
            widget: 'string',
          },
          {
            name: 'audio',
            label: 'Audio',
            widget: 'audio',
          },
          {
            name: 'scripture',
            label: 'Scripture',
            widget: 'scripture',
          },
        ],
      },
    ];

    const service = new BundleService(listSpec);

    // act
    const draftSchema = service.getValidationBuilder(true);

    // should pass with complete data
    const completeData = {
      songs: [
        {
          title: 'Amazing Grace',
          audio: {
            url: 'https://example.com/amazing-grace.mp3',
            length: 180,
          },
          scripture: {
            reference: 'John 3:16',
            verse: 'For God so loved the world...',
          },
        },
      ],
    };

    const completeOutput = await vine.validate({
      schema: vine.object(draftSchema),
      data: completeData,
    });
    expect(completeOutput).toEqual(completeData);

    // should pass with multiple items with missing fields
    const dataWithMultipleItems = {
      songs: [
        {
          title: 'Amazing Grace',
          audio: {
            url: null,
            length: null,
          },
          scripture: {
            reference: null,
            verse: null,
          },
        },
        {
          title: 'How Great Thou Art',
          audio: {
            url: 'https://example.com/how-great.mp3',
            length: null,
          },
          scripture: {
            reference: 'Psalm 23',
            verse: null,
          },
        },
      ],
    };

    const multipleItemsOutput = await vine.validate({
      schema: vine.object(draftSchema),
      data: dataWithMultipleItems,
    });
    expect(multipleItemsOutput).toEqual(dataWithMultipleItems);
  });

  test('boolean fields', async () => {
    // arrange
    const booleanSpec = [
      {
        name: 'isActive',
        label: 'Is Active',
        widget: 'boolean',
      },
    ];

    const service = new BundleService(booleanSpec);

    // act
    const draftSchema = service.getValidationBuilder(true);

    // should pass with complete data
    const completeData = {
      isActive: true,
    };

    const completeOutput = await vine.validate({
      schema: vine.object(draftSchema),
      data: completeData,
    });
    expect(completeOutput).toEqual(completeData);

    // should pass with null value
    const dataWithNullValue = {
      isActive: null,
    };

    const nullValueOutput = await vine.validate({
      schema: vine.object(draftSchema),
      data: dataWithNullValue,
    });
    expect(nullValueOutput).toEqual(dataWithNullValue);
  });

  test('number fields', async () => {
    // arrange
    const numberSpec = [
      {
        name: 'age',
        label: 'Age',
        widget: 'number',
      },
    ];

    const service = new BundleService(numberSpec);

    // act
    const draftSchema = service.getValidationBuilder(true);

    // should pass with complete data
    const completeData = {
      age: 30,
    };

    const completeOutput = await vine.validate({
      schema: vine.object(draftSchema),
      data: completeData,
    });
    expect(completeOutput).toEqual(completeData);

    // should pass with null value
    const dataWithNullValue = {
      age: null,
    };

    const nullValueOutput = await vine.validate({
      schema: vine.object(draftSchema),
      data: dataWithNullValue,
    });
    expect(nullValueOutput).toEqual(dataWithNullValue);
  });

  test('video fields', async () => {
    // arrange
    const videoSpec = [
      {
        name: 'video',
        label: 'Video',
        widget: 'video',
        description: 'MP4 file up to 500MB',
        extensions: ['.mp4'],
        maxSize: 500000000,
        collectionId: '9cdfb958-613e-492a-8a88-f51daae3802b',
      },
    ];

    const service = new BundleService(videoSpec);

    // act
    const draftSchema = service.getValidationBuilder(true);

    // should pass with complete data
    const completeData = {
      video: {
        url: 'https://example.com/video.mp4',
      },
    };

    const completeOutput = await vine.validate({
      schema: vine.object(draftSchema),
      data: completeData,
    });
    expect(completeOutput).toEqual(completeData);

    // should pass with null value
    const dataWithNullValue = {
      video: {
        url: null,
      },
    };

    const nullValueOutput = await vine.validate({
      schema: vine.object(draftSchema),
      data: dataWithNullValue,
    });
    expect(nullValueOutput).toEqual(dataWithNullValue);
  });
});
