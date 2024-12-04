import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/audio-field');
  await page.getByRole('link', { name: 'Audio Field 6' }).click();
});
test.afterEach(async ({ page }) => {
  await page.close();
});

test.describe('Audio Field', () => {
  test('should have model value', async ({ page }) => {
    await page.getByRole('link', { name: 'Model with audio' }).click();
    const locator = page
      .frameLocator('[data-test-id="preview-iframe"]')
      .locator('div')
      .filter({ hasText: /^Upload a fileor drag and dropWAV, MP3, OGG, AAC, WMA$/ })
      .nth(1);
    await expect(locator).not.toBeVisible();
    await expect(
      page.frameLocator('[data-test-id="preview-iframe"]').getByRole('button'),
    ).toBeVisible();
  });
  test('should delete model value', async ({ page }) => {
    await page.getByRole('link', { name: 'Model with audio' }).click();
    const locator = page
      .frameLocator('[data-test-id="preview-iframe"]')
      .locator('div')
      .filter({ hasText: /^Upload a fileor drag and dropWAV, MP3, OGG, AAC, WMA$/ })
      .nth(1);
    await expect(locator).not.toBeVisible();

    await page
      .frameLocator('[data-test-id="preview-iframe"]')
      .getByRole('button')
      .click();
    await expect(locator).toBeVisible();
    await expect(
      page.frameLocator('[data-test-id="preview-iframe"]').getByRole('button'),
    ).not.toBeVisible();
  });
  // we don't yet have a s3 bucket for testing provisioned
  test.skip('should upload audio file', async ({ page }) => {
    await page.getByRole('link', { name: 'Model without audio' }).click();
    const locator = page
      .frameLocator('[data-test-id="preview-iframe"]')
      .locator('div')
      .filter({ hasText: /^Upload a fileor drag and dropWAV, MP3, OGG, AAC, WMA$/ })
      .nth(1);
    await page
      .frameLocator('[data-test-id="preview-iframe"]')
      .getByLabel('Upload a file')
      .setInputFiles('./tests/assets/story-cms.mp3');
    await expect(locator).not.toBeVisible();
    await expect(
      page.frameLocator('[data-test-id="preview-iframe"]').getByRole('button'),
    ).toBeVisible();
  });
});
