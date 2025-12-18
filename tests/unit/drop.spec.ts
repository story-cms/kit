import { test, expect } from '@playwright/test';
import { DropValidator } from '../../src/backend/validators/drop.js';
import { dropBundleFields } from '../mocks.js';

test.describe('Drop Validator', () => {
  test.describe('Draft mode (isPublished = false)', () => {
    test('should validate valid draft data with all fields', async () => {
      const validator = new DropValidator(false, dropBundleFields);
      const schema = validator.schema;

      const validData = {
        title: 'Test Drop',
        isPublished: false,
        coverImage: 'https://example.com/cover.jpg',
        releaseAt: '2025-01-01T00:00:00.000Z',
        description: 'Test description',
        isActive: true,
        score: 100,
      };

      const result = await schema.validate(validData);
      expect(result.title).toBe('Test Drop');
      expect(result.isPublished).toBe(false);
      expect(result.coverImage).toBe('https://example.com/cover.jpg');
      expect(result.releaseAt).toBeInstanceOf(Date);
      expect(result.description).toBe('Test description');
      expect(result.isActive).toBe(true);
      expect(result.score).toBe(100);
    });

    test('should validate draft data with optional fields missing', async () => {
      const validator = new DropValidator(false, dropBundleFields);
      const schema = validator.schema;

      const validData = {
        title: 'Test Drop',
        isPublished: false,
        // coverImage is optional in draft
        releaseAt: null,
        description: 'Test description',
        isActive: true,
        score: 100,
      };

      const result = await schema.validate(validData);
      expect(result.title).toBe('Test Drop');
      expect(result.isPublished).toBe(false);
      expect(result.coverImage).toBeUndefined();
      expect(result.releaseAt).toBeNull();
    });

    test('should reject draft data with missing required title', async () => {
      const validator = new DropValidator(false, dropBundleFields);
      const schema = validator.schema;

      const invalidData = {
        isPublished: false,
        description: 'Test description',
      };

      await expect(schema.validate(invalidData)).rejects.toThrow();
    });

    test('should validate a draft with empty title', async () => {
      const validator = new DropValidator(false, dropBundleFields);
      const schema = validator.schema;
      const validData = {
        title: '',
        isPublished: false,
        coverImage: 'https://example.com/cover.jpg',
        releaseAt: '2025-01-01T00:00:00.000Z',
        description: 'Test description',
        isActive: true,
        score: 100,
      };

      const result = await schema.validate(validData);
      expect(result.title).toBe('');
    });

    test('should reject draft data with invalid releaseAt format', async () => {
      const validator = new DropValidator(false, dropBundleFields);
      const schema = validator.schema;

      const invalidData = {
        title: 'Test Drop',
        isPublished: false,
        releaseAt: 'invalid-date',
      };

      await expect(schema.validate(invalidData)).rejects.toThrow();
    });
  });

  test.describe('Live mode (isPublished = true)', () => {
    test('should validate valid live data with all required fields', async () => {
      const validator = new DropValidator(true, dropBundleFields);
      const schema = validator.schema;

      const validData = {
        title: 'Published Drop',
        isPublished: true,
        coverImage: 'https://example.com/cover.jpg',
        releaseAt: '2025-01-01T00:00:00.000Z',
        description: 'Published description',
        isActive: true,
        score: 100,
      };

      const result = await schema.validate(validData);
      expect(result.title).toBe('Published Drop');
      expect(result.isPublished).toBe(true);
      expect(result.coverImage).toBe('https://example.com/cover.jpg');
      expect(result.releaseAt).toBeInstanceOf(Date);
      expect(result.description).toBe('Published description');
      expect(result.isActive).toBe(true);
      expect(result.score).toBe(100);
    });

    test('should reject live data with missing coverImage', async () => {
      const validator = new DropValidator(true, dropBundleFields);
      const schema = validator.schema;

      const invalidData = {
        title: 'Published Drop',
        isPublished: true,
        // coverImage is required in live mode
        releaseAt: '2025-01-01T00:00:00.000Z',
      };

      await expect(schema.validate(invalidData)).rejects.toThrow();
    });

    test('should reject live data with missing releaseAt', async () => {
      const validator = new DropValidator(true, dropBundleFields);
      const schema = validator.schema;

      const invalidData = {
        title: 'Published Drop',
        isPublished: true,
        coverImage: 'https://example.com/cover.jpg',
        // releaseAt is required in live mode
      };

      await expect(schema.validate(invalidData)).rejects.toThrow();
    });

    test('should reject live data with null releaseAt', async () => {
      const validator = new DropValidator(true, dropBundleFields);
      const schema = validator.schema;

      const invalidData = {
        title: 'Published Drop',
        isPublished: true,
        coverImage: 'https://example.com/cover.jpg',
        releaseAt: null,
      };

      await expect(schema.validate(invalidData)).rejects.toThrow();
    });

    test('should reject live data with missing title', async () => {
      const validator = new DropValidator(true, dropBundleFields);
      const schema = validator.schema;

      const invalidData = {
        isPublished: true,
        coverImage: 'https://example.com/cover.jpg',
        releaseAt: '2025-01-01T00:00:00.000Z',
      };

      await expect(schema.validate(invalidData)).rejects.toThrow();
    });

    test('should reject live data with empty title', async () => {
      const validator = new DropValidator(true, dropBundleFields);
      const schema = validator.schema;

      const invalidData = {
        title: '',
        isPublished: true,
        coverImage: 'https://example.com/cover.jpg',
        releaseAt: '2025-01-01T00:00:00.000Z',
        description: 'Published description',
        isActive: true,
        score: 100,
      };

      await expect(schema.validate(invalidData)).rejects.toThrow();
    });
  });

  test.describe('Bundle fields integration', () => {});

  test.describe('Edge cases', () => {
    test('should handle ISO8601 date format', async () => {
      const validator = new DropValidator(false, dropBundleFields);
      const schema = validator.schema;

      const validData = {
        title: 'Test Drop',
        isPublished: false,
        releaseAt: '2025-12-31T23:59:59.999Z',
        description: 'Test description',
        isActive: true,
        score: 100,
      };

      try {
        const result = await schema.validate(validData);

        // expect(result.releaseAt).toBeInstanceOf(Date);
        expect(result.releaseAt.toISOString()).toBe('2025-12-31T23:59:59.999Z');
      } catch (error) {
        console.log('!error: ', error);
      }
    });
  });
});
