import { test, expect } from '@playwright/test';
import { CampaignValidator } from '../../src/backend/validators/campaign.js';
import type { HttpContext } from '@adonisjs/core/http';
import { getCampaignStatus } from '../../src/frontend/shared/helpers.js';
import { DateTime } from 'luxon';

// Helper to create a mock HttpContext
function createMockHttpContext(inputs: Record<string, any>): HttpContext {
  return {
    request: {
      input: (key: string) => inputs[key],
    },
  } as HttpContext;
}

test.describe('Campaign Validator', () => {
  test.describe('Draft Schema', () => {
    test('allows all fields to be optional', async () => {
      const ctx = createMockHttpContext({ isPublished: false });
      const validator = new CampaignValidator(ctx);
      const schema = validator.schema;

      const data = {
        isPublished: false,
      };
      const result = await schema.validate(data);
      expect(result).toEqual({ isPublished: false });
    });

    test('accepts partial data', async () => {
      const ctx = createMockHttpContext({ isPublished: false });
      const validator = new CampaignValidator(ctx);
      const schema = validator.schema;

      const data = {
        name: 'Test Campaign',
        title: 'Test Title',
        isPublished: false,
      };
      const result = await schema.validate(data);
      expect(result.name).toBe('Test Campaign');
      expect(result.title).toBe('Test Title');
    });

    test('accepts all fields', async () => {
      const ctx = createMockHttpContext({ isPublished: false });
      const validator = new CampaignValidator(ctx);
      const schema = validator.schema;

      const data = {
        name: 'Test Campaign',
        window: '2025-01-01T00:00:00.000Z|2025-01-31T23:59:59.999Z',
        promoImage: 'https://example.com/image.jpg',
        title: 'Test Title',
        message: 'Test Message',
        actionLabel: 'Click Here',
        actionType: 'externalUrl' as const,
        actionUrl: 'https://example.com',
        regions: 'US,CA',
        isPublished: false,
      };
      const result = await schema.validate(data);
      expect(result).toEqual(data);
    });
  });

  test.describe('Live Schema', () => {
    test('requires name', async () => {
      const ctx = createMockHttpContext({ isPublished: true, actionType: 'close' });
      const validator = new CampaignValidator(ctx);
      const schema = validator.schema;

      const data = {
        window: '2025-01-01T00:00:00.000Z|2025-01-31T23:59:59.999Z',
        title: 'Test Title',
        message: 'Test Message',
        actionLabel: 'Click Here',
        actionType: 'close' as const,
        isPublished: true,
      };

      await expect(schema.validate(data)).rejects.toThrow();
    });

    test('requires window', async () => {
      const ctx = createMockHttpContext({ isPublished: true, actionType: 'close' });
      const validator = new CampaignValidator(ctx);
      const schema = validator.schema;

      const data = {
        name: 'Test Campaign',
        title: 'Test Title',
        message: 'Test Message',
        actionLabel: 'Click Here',
        actionType: 'close' as const,
        isPublished: true,
      };

      await expect(schema.validate(data)).rejects.toThrow();
    });

    test('requires title', async () => {
      const ctx = createMockHttpContext({ isPublished: true, actionType: 'close' });
      const validator = new CampaignValidator(ctx);
      const schema = validator.schema;

      const data = {
        name: 'Test Campaign',
        window: '2025-01-01T00:00:00.000Z|2025-01-31T23:59:59.999Z',
        message: 'Test Message',
        actionLabel: 'Click Here',
        actionType: 'close' as const,
        isPublished: true,
      };

      await expect(schema.validate(data)).rejects.toThrow();
    });

    test('requires message', async () => {
      const ctx = createMockHttpContext({ isPublished: true, actionType: 'close' });
      const validator = new CampaignValidator(ctx);
      const schema = validator.schema;

      const data = {
        name: 'Test Campaign',
        window: '2025-01-01T00:00:00.000Z|2025-01-31T23:59:59.999Z',
        title: 'Test Title',
        actionLabel: 'Click Here',
        actionType: 'close' as const,
        isPublished: true,
      };

      await expect(schema.validate(data)).rejects.toThrow();
    });

    test('requires actionLabel', async () => {
      const ctx = createMockHttpContext({ isPublished: true, actionType: 'close' });
      const validator = new CampaignValidator(ctx);
      const schema = validator.schema;

      const data = {
        name: 'Test Campaign',
        window: '2025-01-01T00:00:00.000Z|2025-01-31T23:59:59.999Z',
        title: 'Test Title',
        message: 'Test Message',
        actionType: 'close' as const,
        isPublished: true,
      };

      await expect(schema.validate(data)).rejects.toThrow();
    });

    test('requires actionType', async () => {
      const ctx = createMockHttpContext({ isPublished: true, actionType: 'close' });
      const validator = new CampaignValidator(ctx);
      const schema = validator.schema;

      const data = {
        name: 'Test Campaign',
        window: '2025-01-01T00:00:00.000Z|2025-01-31T23:59:59.999Z',
        title: 'Test Title',
        message: 'Test Message',
        actionLabel: 'Click Here',
        isPublished: true,
      };

      await expect(schema.validate(data)).rejects.toThrow();
    });

    test('validates actionType enum', async () => {
      const ctx = createMockHttpContext({ isPublished: true, actionType: 'invalid' });
      const validator = new CampaignValidator(ctx);
      const schema = validator.schema;

      const data = {
        name: 'Test Campaign',
        window: '2025-01-01T00:00:00.000Z|2025-01-31T23:59:59.999Z',
        title: 'Test Title',
        message: 'Test Message',
        actionLabel: 'Click Here',
        actionType: 'invalid' as any,
        isPublished: true,
      };

      await expect(schema.validate(data)).rejects.toThrow();
    });

    test('accepts valid actionType values', async () => {
      const validActionTypes = ['close', 'donate', 'externalUrl'] as const;

      for (const actionType of validActionTypes) {
        const ctx = createMockHttpContext({ isPublished: true, actionType });
        const validator = new CampaignValidator(ctx);
        const schema = validator.schema;

        const data = {
          name: 'Test Campaign',
          window: '2025-01-01T00:00:00.000Z|2025-01-31T23:59:59.999Z',
          title: 'Test Title',
          message: 'Test Message',
          actionLabel: 'Click Here',
          actionType,
          actionUrl: 'https://example.com',
          isPublished: true,
        };

        const result = await schema.validate(data);
        expect(result.actionType).toBe(actionType);
      }
    });

    test('requires actionUrl when actionType is externalUrl', async () => {
      const ctx = createMockHttpContext({ isPublished: true, actionType: 'externalUrl' });
      const validator = new CampaignValidator(ctx);
      const schema = validator.schema;

      const data = {
        name: 'Test Campaign',
        window: '2025-01-01T00:00:00.000Z|2025-01-31T23:59:59.999Z',
        title: 'Test Title',
        message: 'Test Message',
        actionLabel: 'Click Here',
        actionType: 'externalUrl' as const,
        isPublished: true,
      };

      await expect(schema.validate(data)).rejects.toThrow();
    });

    test('accepts valid actionUrl when actionType is externalUrl', async () => {
      const ctx = createMockHttpContext({ isPublished: true, actionType: 'externalUrl' });
      const validator = new CampaignValidator(ctx);
      const schema = validator.schema;

      const data = {
        name: 'Test Campaign',
        window: '2025-01-01T00:00:00.000Z|2025-01-31T23:59:59.999Z',
        title: 'Test Title',
        message: 'Test Message',
        actionLabel: 'Click Here',
        actionType: 'externalUrl' as const,
        actionUrl: 'https://example.com',
        isPublished: true,
      };

      const result = await schema.validate(data);
      expect(result.actionUrl).toBe('https://example.com');
    });

    test('validates actionUrl format', async () => {
      const ctx = createMockHttpContext({ isPublished: true, actionType: 'externalUrl' });
      const validator = new CampaignValidator(ctx);
      const schema = validator.schema;

      const data = {
        name: 'Test Campaign',
        window: '2025-01-01T00:00:00.000Z|2025-01-31T23:59:59.999Z',
        title: 'Test Title',
        message: 'Test Message',
        actionLabel: 'Click Here',
        actionType: 'externalUrl' as const,
        actionUrl: 'not-a-valid-url',
        isPublished: true,
      };

      await expect(schema.validate(data)).rejects.toThrow();
    });

    test('requires protocol in actionUrl', async () => {
      const ctx = createMockHttpContext({ isPublished: true, actionType: 'externalUrl' });
      const validator = new CampaignValidator(ctx);
      const schema = validator.schema;

      const data = {
        name: 'Test Campaign',
        window: '2025-01-01T00:00:00.000Z|2025-01-31T23:59:59.999Z',
        title: 'Test Title',
        message: 'Test Message',
        actionLabel: 'Click Here',
        actionType: 'externalUrl' as const,
        actionUrl: 'example.com',
        isPublished: true,
      };

      await expect(schema.validate(data)).rejects.toThrow();
    });

    test('accepts http and https protocols', async () => {
      const protocols = ['http', 'https'] as const;

      for (const protocol of protocols) {
        const ctx = createMockHttpContext({
          isPublished: true,
          actionType: 'externalUrl',
        });
        const validator = new CampaignValidator(ctx);
        const schema = validator.schema;

        const data = {
          name: 'Test Campaign',
          window: '2025-01-01T00:00:00.000Z|2025-01-31T23:59:59.999Z',
          title: 'Test Title',
          message: 'Test Message',
          actionLabel: 'Click Here',
          actionType: 'externalUrl' as const,
          actionUrl: `${protocol}://example.com`,
          isPublished: true,
        };

        const result = await schema.validate(data);
        expect(result.actionUrl).toBe(`${protocol}://example.com`);
      }
    });

    test('allows empty actionUrl when actionType is not externalUrl', async () => {
      const ctx = createMockHttpContext({ isPublished: true, actionType: 'close' });
      const validator = new CampaignValidator(ctx);
      const schema = validator.schema;

      const data = {
        name: 'Test Campaign',
        window: '2025-01-01T00:00:00.000Z|2025-01-31T23:59:59.999Z',
        title: 'Test Title',
        message: 'Test Message',
        actionLabel: 'Click Here',
        actionType: 'close' as const,
        actionUrl: '',
        isPublished: true,
      };

      const result = await schema.validate(data);
      expect(result.actionUrl).toBe('');
    });

    test('allows missing actionUrl when actionType is not externalUrl', async () => {
      const ctx = createMockHttpContext({ isPublished: true, actionType: 'donate' });
      const validator = new CampaignValidator(ctx);
      const schema = validator.schema;

      const data = {
        name: 'Test Campaign',
        window: '2025-01-01T00:00:00.000Z|2025-01-31T23:59:59.999Z',
        title: 'Test Title',
        message: 'Test Message',
        actionLabel: 'Click Here',
        actionType: 'donate' as const,
        isPublished: true,
      };

      const result = await schema.validate(data);
      expect(result.actionUrl).toBeUndefined();
    });

    test('makes promoImage optional', async () => {
      const ctx = createMockHttpContext({ isPublished: true, actionType: 'close' });
      const validator = new CampaignValidator(ctx);
      const schema = validator.schema;

      const data = {
        name: 'Test Campaign',
        window: '2025-01-01T00:00:00.000Z|2025-01-31T23:59:59.999Z',
        title: 'Test Title',
        message: 'Test Message',
        actionLabel: 'Click Here',
        actionType: 'close' as const,
        isPublished: true,
      };

      const result = await schema.validate(data);
      expect(result.promoImage).toBeUndefined();
    });

    test('makes regions optional', async () => {
      const ctx = createMockHttpContext({ isPublished: true, actionType: 'close' });
      const validator = new CampaignValidator(ctx);
      const schema = validator.schema;

      const data = {
        name: 'Test Campaign',
        window: '2025-01-01T00:00:00.000Z|2025-01-31T23:59:59.999Z',
        title: 'Test Title',
        message: 'Test Message',
        actionLabel: 'Click Here',
        actionType: 'close' as const,
        isPublished: true,
      };

      const result = await schema.validate(data);
      expect(result.regions).toBeUndefined();
    });

    test('accepts valid complete data', async () => {
      const ctx = createMockHttpContext({ isPublished: true, actionType: 'externalUrl' });
      const validator = new CampaignValidator(ctx);
      const schema = validator.schema;

      const data = {
        name: 'Test Campaign',
        window: '2025-01-01T00:00:00.000Z|2025-01-31T23:59:59.999Z',
        promoImage: 'https://example.com/image.jpg',
        title: 'Test Title',
        message: 'Test Message',
        actionLabel: 'Click Here',
        actionType: 'externalUrl' as const,
        actionUrl: 'https://example.com',
        regions: 'US,CA',
        isPublished: true,
      };

      const result = await schema.validate(data);
      expect(result).toEqual(data);
    });

    test.describe('maxLength validation', () => {
      test('rejects title longer than 58 characters', async () => {
        const ctx = createMockHttpContext({ isPublished: true, actionType: 'close' });
        const validator = new CampaignValidator(ctx);
        const schema = validator.schema;

        const data = {
          name: 'Test Campaign',
          window: '2025-01-01T00:00:00.000Z|2025-01-31T23:59:59.999Z',
          title: 'a'.repeat(59),
          message: 'Test Message',
          actionLabel: 'Click Here',
          actionType: 'close' as const,
          isPublished: true,
        };

        await expect(schema.validate(data)).rejects.toThrow();
      });

      test('accepts title exactly 58 characters', async () => {
        const ctx = createMockHttpContext({ isPublished: true, actionType: 'close' });
        const validator = new CampaignValidator(ctx);
        const schema = validator.schema;

        const data = {
          name: 'Test Campaign',
          window: '2025-01-01T00:00:00.000Z|2025-01-31T23:59:59.999Z',
          title: 'a'.repeat(58),
          message: 'Test Message',
          actionLabel: 'Click Here',
          actionType: 'close' as const,
          isPublished: true,
        };

        const result = await schema.validate(data);
        expect(result.title).toBe('a'.repeat(58));
      });

      test('accepts title shorter than 58 characters', async () => {
        const ctx = createMockHttpContext({ isPublished: true, actionType: 'close' });
        const validator = new CampaignValidator(ctx);
        const schema = validator.schema;

        const data = {
          name: 'Test Campaign',
          window: '2025-01-01T00:00:00.000Z|2025-01-31T23:59:59.999Z',
          title: 'Short Title',
          message: 'Test Message',
          actionLabel: 'Click Here',
          actionType: 'close' as const,
          isPublished: true,
        };

        const result = await schema.validate(data);
        expect(result.title).toBe('Short Title');
      });

      test('rejects message longer than 560 characters', async () => {
        const ctx = createMockHttpContext({ isPublished: true, actionType: 'close' });
        const validator = new CampaignValidator(ctx);
        const schema = validator.schema;

        const data = {
          name: 'Test Campaign',
          window: '2025-01-01T00:00:00.000Z|2025-01-31T23:59:59.999Z',
          title: 'Test Title',
          message: 'a'.repeat(561),
          actionLabel: 'Click Here',
          actionType: 'close' as const,
          isPublished: true,
        };

        await expect(schema.validate(data)).rejects.toThrow();
      });

      test('accepts message exactly 560 characters', async () => {
        const ctx = createMockHttpContext({ isPublished: true, actionType: 'close' });
        const validator = new CampaignValidator(ctx);
        const schema = validator.schema;

        const data = {
          name: 'Test Campaign',
          window: '2025-01-01T00:00:00.000Z|2025-01-31T23:59:59.999Z',
          title: 'Test Title',
          message: 'a'.repeat(560),
          actionLabel: 'Click Here',
          actionType: 'close' as const,
          isPublished: true,
        };

        const result = await schema.validate(data);
        expect(result.message).toBe('a'.repeat(560));
      });

      test('accepts message shorter than 560 characters', async () => {
        const ctx = createMockHttpContext({ isPublished: true, actionType: 'close' });
        const validator = new CampaignValidator(ctx);
        const schema = validator.schema;

        const data = {
          name: 'Test Campaign',
          window: '2025-01-01T00:00:00.000Z|2025-01-31T23:59:59.999Z',
          title: 'Test Title',
          message: 'Short message',
          actionLabel: 'Click Here',
          actionType: 'close' as const,
          isPublished: true,
        };

        const result = await schema.validate(data);
        expect(result.message).toBe('Short message');
      });

      test('rejects actionLabel longer than 66 characters', async () => {
        const ctx = createMockHttpContext({ isPublished: true, actionType: 'close' });
        const validator = new CampaignValidator(ctx);
        const schema = validator.schema;

        const data = {
          name: 'Test Campaign',
          window: '2025-01-01T00:00:00.000Z|2025-01-31T23:59:59.999Z',
          title: 'Test Title',
          message: 'Test Message',
          actionLabel: 'a'.repeat(67),
          actionType: 'close' as const,
          isPublished: true,
        };

        await expect(schema.validate(data)).rejects.toThrow();
      });

      test('accepts actionLabel exactly 66 characters', async () => {
        const ctx = createMockHttpContext({ isPublished: true, actionType: 'close' });
        const validator = new CampaignValidator(ctx);
        const schema = validator.schema;

        const data = {
          name: 'Test Campaign',
          window: '2025-01-01T00:00:00.000Z|2025-01-31T23:59:59.999Z',
          title: 'Test Title',
          message: 'Test Message',
          actionLabel: 'a'.repeat(66),
          actionType: 'close' as const,
          isPublished: true,
        };

        const result = await schema.validate(data);
        expect(result.actionLabel).toBe('a'.repeat(66));
      });

      test('accepts actionLabel shorter than 66 characters', async () => {
        const ctx = createMockHttpContext({ isPublished: true, actionType: 'close' });
        const validator = new CampaignValidator(ctx);
        const schema = validator.schema;

        const data = {
          name: 'Test Campaign',
          window: '2025-01-01T00:00:00.000Z|2025-01-31T23:59:59.999Z',
          title: 'Test Title',
          message: 'Test Message',
          actionLabel: 'Click Here',
          actionType: 'close' as const,
          isPublished: true,
        };

        const result = await schema.validate(data);
        expect(result.actionLabel).toBe('Click Here');
      });
    });
  });
});
test.describe('Campaign Status', () => {
  test('returns Draft when isPublished is false', () => {
    const status = getCampaignStatus(false, '');
    expect(status).toBe('Draft');
  });

  test('returns Draft when isPublished is false even with window', () => {
    const window = '2025-01-01T00:00:00.000Z|2025-01-31T23:59:59.999Z';
    const status = getCampaignStatus(false, window);
    expect(status).toBe('Draft');
  });

  test('returns Scheduled when published and current time is before window start', () => {
    const windowStart = DateTime.now().plus({ days: 1 });
    const windowEnd = DateTime.now().plus({ days: 2 });
    const window = `${windowStart.toISO()}|${windowEnd.toISO()}`;
    const now = DateTime.now();

    const status = getCampaignStatus(true, window, now);
    expect(status).toBe('Scheduled');
  });

  test('returns Completed when published and current time is after window end', () => {
    const windowStart = DateTime.now().minus({ days: 2 });
    const windowEnd = DateTime.now().minus({ days: 1 });
    const window = `${windowStart.toISO()}|${windowEnd.toISO()}`;
    const now = DateTime.now();

    const status = getCampaignStatus(true, window, now);
    expect(status).toBe('Completed');
  });

  test('returns Live when published and current time is within window', () => {
    const windowStart = DateTime.now().minus({ hours: 1 });
    const windowEnd = DateTime.now().plus({ hours: 1 });
    const window = `${windowStart.toISO()}|${windowEnd.toISO()}`;
    const now = DateTime.now();

    const status = getCampaignStatus(true, window, now);
    expect(status).toBe('Live');
  });

  test('returns Live when published and current time equals window start', () => {
    const now = DateTime.now();
    const windowEnd = now.plus({ hours: 1 });
    const window = `${now.toISO()}|${windowEnd.toISO()}`;

    const status = getCampaignStatus(true, window, now);
    expect(status).toBe('Live');
  });

  test('returns Live when published and current time equals window end', () => {
    const windowStart = DateTime.now().minus({ hours: 1 });
    const now = DateTime.now();
    const window = `${windowStart.toISO()}|${now.toISO()}`;

    const status = getCampaignStatus(true, window, now);
    expect(status).toBe('Live');
  });

  test('returns Draft when published with empty window value', () => {
    const status = getCampaignStatus(true, '');
    expect(status).toBe('Draft');
  });

  test('returns Draft when published with invalid window start', () => {
    const windowEnd = DateTime.now().plus({ days: 1 });
    const window = `invalid-date|${windowEnd.toISO()}`;

    const status = getCampaignStatus(true, window);
    expect(status).toBe('Draft');
  });

  test('returns Draft when published with invalid window end', () => {
    const windowStart = DateTime.now().minus({ days: 1 });
    const window = `${windowStart.toISO()}|invalid-date`;

    const status = getCampaignStatus(true, window);
    expect(status).toBe('Draft');
  });

  test('returns Draft when published with both invalid window dates', () => {
    const window = 'invalid-start|invalid-end';

    const status = getCampaignStatus(true, window);
    expect(status).toBe('Draft');
  });

  test('returns Draft when published with malformed window format', () => {
    const window = '2025-01-01T00:00:00.000Z'; // missing separator

    const status = getCampaignStatus(true, window);
    expect(status).toBe('Draft');
  });

  test('handles window with extra whitespace', () => {
    const windowStart = DateTime.now().minus({ hours: 1 });
    const windowEnd = DateTime.now().plus({ hours: 1 });
    const window = `  ${windowStart.toISO()}  |  ${windowEnd.toISO()}  `;
    const now = DateTime.now();

    const status = getCampaignStatus(true, window, now);
    expect(status).toBe('Live');
  });
});
