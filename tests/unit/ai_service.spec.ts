import { expect, test } from '@playwright/test';
import {
  AiService,
  type TranslationSource,
} from '../../src/backend/services/ai_service.js';

test.describe('AiService.estimateOutputTokens', () => {
  test('returns zero for no sources', () => {
    expect(new AiService().estimateOutputTokens(['fr'], [])).toBe(0);
  });

  test('grows with the length of the source text', () => {
    const service = new AiService();
    const short = service.estimateOutputTokens(['fr'], [{ id: '1', text: 'Hi' }]);
    const long = service.estimateOutputTokens(
      ['fr'],
      [{ id: '1', text: 'Hi'.repeat(100) }],
    );

    expect(long).toBeGreaterThan(short);
  });

  test('scales roughly linearly with the number of output locales', () => {
    const service = new AiService();
    const oneLocale = service.estimateOutputTokens(
      ['fr'],
      [{ id: '1', text: 'Hello there' }],
    );
    const threeLocales = service.estimateOutputTokens(
      ['fr', 'de', 'es'],
      [{ id: '1', text: 'Hello there' }],
    );

    expect(threeLocales).toBeGreaterThanOrEqual(oneLocale * 3 - 2);
    expect(threeLocales).toBeLessThanOrEqual(oneLocale * 3 + 2);
  });

  test('roughly sums the estimate across multiple sources', () => {
    const service = new AiService();
    const combined = service.estimateOutputTokens(
      ['fr'],
      [
        { id: '1', text: 'Hello there' },
        { id: '2', text: 'Goodbye now' },
      ],
    );
    const first = service.estimateOutputTokens(
      ['fr'],
      [{ id: '1', text: 'Hello there' }],
    );
    const second = service.estimateOutputTokens(
      ['fr'],
      [{ id: '2', text: 'Goodbye now' }],
    );

    expect(combined).toBeGreaterThanOrEqual(first + second - 2);
    expect(combined).toBeLessThanOrEqual(first + second + 2);
  });
});

test.describe('AiService.estimateTokens', () => {
  test('returns zero for no sources', () => {
    const estimate = new AiService().estimateTokens({
      outputLocales: ['fr'],
      translationSources: [],
    });

    expect(estimate).toEqual({ inputTokens: 0, outputTokens: 0 });
  });

  test('grows with the length of the source text', () => {
    const service = new AiService();
    const short = service.estimateTokens({
      outputLocales: ['fr'],
      translationSources: [{ id: '1', text: 'Hi' }],
    });
    const long = service.estimateTokens({
      outputLocales: ['fr'],
      translationSources: [{ id: '1', text: 'Hi'.repeat(100) }],
    });

    expect(long.inputTokens).toBeGreaterThan(short.inputTokens);
    expect(long.outputTokens).toBeGreaterThan(short.outputTokens);
  });

  test('outputTokens matches estimateOutputTokens for the same input', () => {
    const service = new AiService();
    const outputLocales = ['fr', 'de'];
    const translationSources: TranslationSource[] = [
      { id: '1', text: 'Hello there' },
      { id: '2', text: 'Goodbye now' },
    ];

    const estimate = service.estimateTokens({ outputLocales, translationSources });
    const outputTokens = service.estimateOutputTokens(outputLocales, translationSources);

    expect(estimate.outputTokens).toBe(outputTokens);
  });

  test('inputTokens accounts for system-prompt overhead paid once per batch', () => {
    const service = new AiService();
    const chunk =
      'This is a moderately long sentence used to pad out the translation source text for batching tests. '.repeat(
        3,
      );

    const singleSource = service.estimateTokens({
      outputLocales: ['fr'],
      translationSources: [{ id: 'combined', text: chunk.repeat(60) }],
    });

    const manySources = service.estimateTokens({
      outputLocales: ['fr'],
      translationSources: Array.from({ length: 60 }, (_, i) => ({
        id: String(i),
        text: chunk,
      })),
    });

    expect(manySources.inputTokens).toBeGreaterThan(singleSource.inputTokens);
  });
});
