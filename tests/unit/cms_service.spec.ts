import { test, expect } from '@playwright/test';
import type { HttpContext } from '@adonisjs/core/http';

import { CmsService } from '../../src/backend/services/cms_service';

function mockContext(query: Record<string, string | undefined>): HttpContext {
  return {
    request: {
      qs: () => query,
    },
  } as HttpContext;
}

test.describe('CmsService query locale', () => {
  const cms = CmsService.default();

  test('localeFromQuery returns sourceLocale when param is absent', () => {
    expect(cms.localeFromQuery(mockContext({}))).toBe('en');
    expect(cms.localeFromQuery(mockContext({ locale: undefined }))).toBe('en');
  });

  test('localeFromQuery returns valid tags as-is', () => {
    expect(cms.localeFromQuery(mockContext({ locale: 'en' }))).toBe('en');
    expect(cms.localeFromQuery(mockContext({ locale: 'zh' }))).toBe('zh');
    expect(cms.localeFromQuery(mockContext({ locale: 'zh-Hans' }))).toBe('zh-Hans');
    expect(cms.localeFromQuery(mockContext({ locale: 'en-US' }))).toBe('en-US');
  });

  test('localeFromQuery throws E_ROUTE_NOT_FOUND for invalid tags', () => {
    for (const locale of ['zh_Hans', 'zh_CN']) {
      expect(() => cms.localeFromQuery(mockContext({ locale }))).toThrow();
      try {
        cms.localeFromQuery(mockContext({ locale }));
      } catch (error) {
        expect((error as { code: string; status: number }).code).toBe('E_ROUTE_NOT_FOUND');
        expect((error as { code: string; status: number }).status).toBe(404);
      }
    }
  });

  test('versionFromQuery mirrors localeFromQuery behavior', () => {
    expect(cms.versionFromQuery(mockContext({}))).toEqual({
      apiVersion: 1,
      locale: 'en',
    });

    expect(cms.versionFromQuery(mockContext({ locale: 'zh' }))).toEqual({
      apiVersion: 1,
      locale: 'zh',
    });

    expect(() => cms.versionFromQuery(mockContext({ locale: 'zh_Hans' }))).toThrow();
  });
});
