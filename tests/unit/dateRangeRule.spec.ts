import { test, expect } from '@playwright/test';
import vine from '@vinejs/vine';
import dateRangeRule from '../../src/backend/validators/date_range_rule.js';

test.describe('Date Range Rule Validator', () => {
  test('should validate valid date ranges', async () => {
    const validDateRanges = [
      '2027-01-08T07:30:00.000Z|2027-01-15T07:30:00.000Z',
      '2024-12-01T00:00:00.000Z|2024-12-31T23:59:59.999Z',
      '2025-06-15T12:00:00Z|2025-06-20T12:00:00Z',
      '2023-01-01T00:00:00Z|2023-12-31T23:59:59Z',
    ];

    for (const dateRange of validDateRanges) {
      const schema = vine.object({
        dateRange: vine.string().use(dateRangeRule()),
      });

      const data = { dateRange };
      const result = await vine.validate({ schema, data });
      expect(result.dateRange).toEqual(dateRange);
    }
  });

  test('should reject non-string values', async () => {
    const invalidValues = [123, true, null, undefined, [], {}];

    for (const value of invalidValues) {
      const schema = vine.object({
        dateRange: vine.any().use(dateRangeRule()),
      });

      const data = { dateRange: value };

      await expect(vine.validate({ schema, data })).rejects.toThrow();
    }
  });

  test('should reject strings without pipe separator', async () => {
    const invalidDateRanges = [
      '2027-01-08T07:30:00.000Z',
      '2027-01-08T07:30:00.000Z|',
      '|2027-01-15T07:30:00.000Z',
      '2027-01-08T07:30:00.000Z2027-01-15T07:30:00.000Z',
      '2027-01-08T07:30:00.000Z,2027-01-15T07:30:00.000Z',
    ];

    for (const dateRange of invalidDateRanges) {
      const schema = vine.object({
        dateRange: vine.string().use(dateRangeRule()),
      });

      const data = { dateRange };

      await expect(vine.validate({ schema, data })).rejects.toThrow();
    }
  });

  test('should reject invalid ISO date strings', async () => {
    const invalidDateRanges = [
      'invalid-date|2027-01-15T07:30:00.000Z',
      '2027-01-08T07:30:00.000Z|invalid-date',
      '2027-13-45T25:70:99.999Z|2027-01-15T07:30:00.000Z',
      '2027-01-08|2027-01-15',
      '01/08/2027|01/15/2027',
    ];

    for (const dateRange of invalidDateRanges) {
      const schema = vine.object({
        dateRange: vine.string().use(dateRangeRule()),
      });

      const data = { dateRange };

      await expect(vine.validate({ schema, data })).rejects.toThrow();
    }
  });

  test('should reject date ranges where start date is after end date', async () => {
    const invalidDateRanges = [
      '2027-01-15T07:30:00.000Z|2027-01-08T07:30:00.000Z',
      '2027-12-31T23:59:59.999Z|2027-01-01T00:00:00.000Z',
      '2027-01-08T07:30:00.000Z|2027-01-08T07:30:00.000Z', // same date
    ];

    for (const dateRange of invalidDateRanges) {
      const schema = vine.object({
        dateRange: vine.string().use(dateRangeRule()),
      });

      const data = { dateRange };

      await expect(vine.validate({ schema, data })).rejects.toThrow();
    }
  });

  test('should reject empty strings when canBeEmpty is false (default)', async () => {
    const emptyValues = ['', '   ', '|', ' | ', '  |  '];

    for (const value of emptyValues) {
      const schema = vine.object({
        dateRange: vine.string().use(dateRangeRule()),
      });

      const data = { dateRange: value };

      await expect(vine.validate({ schema, data })).rejects.toThrow();
    }
  });

  test('should accept empty strings when canBeEmpty is true', async () => {
    const emptyValues = ['', '   '];

    for (const value of emptyValues) {
      const schema = vine.object({
        dateRange: vine.string().use(dateRangeRule({ canBeEmpty: true })),
      });

      const data = { dateRange: value };
      const result = await vine.validate({ schema, data });
      expect(result.dateRange).toEqual(value);
    }
  });

  test('should handle whitespace around dates by trimming', async () => {
    const dateRangeWithWhitespace =
      '  2027-01-08T07:30:00.000Z  |  2027-01-15T07:30:00.000Z  ';

    const schema = vine.object({
      dateRange: vine.string().use(dateRangeRule()),
    });

    const data = { dateRange: dateRangeWithWhitespace };
    const result = await vine.validate({ schema, data });
    expect(result.dateRange).toEqual(dateRangeWithWhitespace);
  });

  test('should reject strings with multiple pipe separators', async () => {
    const invalidDateRanges = [
      '2027-01-08T07:30:00.000Z|2027-01-15T07:30:00.000Z|2027-01-20T07:30:00.000Z',
      '|2027-01-08T07:30:00.000Z|2027-01-15T07:30:00.000Z',
    ];

    for (const dateRange of invalidDateRanges) {
      const schema = vine.object({
        dateRange: vine.string().use(dateRangeRule()),
      });

      const data = { dateRange };

      await expect(vine.validate({ schema, data })).rejects.toThrow();
    }
  });
});
