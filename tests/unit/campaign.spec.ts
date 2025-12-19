import { test, expect } from '@playwright/test';
import { CampaignValidator } from '../../src/backend/validators/campaign.js';
import type { HttpContext } from '@adonisjs/core/http';

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
  });
});
