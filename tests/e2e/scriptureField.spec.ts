import { test, expect } from '@playwright/test';
import { scriptureModel } from '../../src/frontend/test/mocks';

test.beforeEach(async ({ page }) => {
  await page.goto('/src-draft-scripturefield-story-vue');
  await page.getByRole('link', { name: 'Scripture Field 6' }).click();
});
test.afterEach(async ({ page }) => {
  await page.close();
});

test.describe('Scripture Field', () => {
  test('should show verse and reference field from model', async ({ page }) => {
    await page.getByRole('link', { name: 'With data' }).click();
    await expect(
      page
        .frameLocator('[data-test-id="preview-iframe"]')
        .getByPlaceholder('John 1 or John 1:3-4'),
    ).toHaveValue(scriptureModel.scripture.reference);
    await expect(
      page.frameLocator('[data-test-id="preview-iframe"]').getByPlaceholder('Verse'),
    ).toHaveValue(scriptureModel.scripture.verse);
  });
  test('should make field readonly', async ({ page }) => {
    await page.getByRole('link', { name: 'ReadOnly' }).click();
    await expect(
      page
        .frameLocator('[data-test-id="preview-iframe"]')
        .getByPlaceholder('John 1 or John 1:3-4'),
    ).toHaveAttribute('readonly', '');
    await expect(
      page.frameLocator('[data-test-id="preview-iframe"]').getByPlaceholder('Verse'),
    ).toHaveAttribute('readonly', '');
  });
  test('should have empty field', async ({ page }) => {
    await page.getByRole('link', { name: 'Empty' }).click();
    await expect(
      page
        .frameLocator('[data-test-id="preview-iframe"]')
        .getByPlaceholder('John 1 or John 1:3-4'),
    ).toBeEmpty();
    await expect(
      page.frameLocator('[data-test-id="preview-iframe"]').getByPlaceholder('Verse'),
    ).toHaveValue('');
  });
  test('should show error message', async ({ page }) => {
    await page.getByRole('link', { name: 'Error' }).click();
    await expect(
      page
        .frameLocator('[data-test-id="preview-iframe"]')
        .getByPlaceholder('John 1 or John 1:3-4'),
    ).toHaveValue(scriptureModel.scripture.reference);
    await expect(
      page.frameLocator('[data-test-id="preview-iframe"]').getByPlaceholder('Verse'),
    ).toHaveValue(scriptureModel.scripture.verse);
    await expect(
      page
        .frameLocator('[data-test-id="preview-iframe"]')
        .getByText('This field cannot be empty'),
    ).toBeVisible();
  });
});
