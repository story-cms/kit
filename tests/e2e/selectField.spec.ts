import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/src-draft-selectfield-story-vue');
  await page.getByRole('link', { name: 'Select Field 5' }).click();
});
test.afterEach(async ({ page }) => {
  await page.close();
});

test.describe('Select Field', () => {
  test('should have model value', async ({ page }) => {
    await page.getByRole('link', { name: 'With model' }).click();

    const locator = page
      .frameLocator('[data-test-id="preview-iframe"]')
      .getByRole('combobox', { name: 'City' });

    await locator.selectOption('Paris');
    await expect(locator).toHaveValue('PRS');
    await locator.selectOption('Chicago');
    await expect(locator).toHaveValue('CHG');
    await locator.selectOption('Tokyo');
    await expect(locator).toHaveValue('TKY');
  });
  test('should not be able to select option', async ({ page }) => {
    await page.getByRole('link', { name: 'Readonly' }).click();

    const locator = page
      .frameLocator('[data-test-id="preview-iframe"]')
      .getByRole('combobox', { name: 'City' });
    await expect(locator).toHaveAttribute('disabled', '');
  });
  test('should be able make label and text RTL', async ({ page }) => {
    await page.getByRole('link', { name: 'RTL' }).click();
    const locator = page
      .locator('[data-test-id="preview-iframe"]')
      .contentFrame()
      .getByText('CityChicagoParisTokyo');

    await expect(locator).not.toHaveClass(/rtl/);
    await page
      .frameLocator('[data-test-id="preview-iframe"]')
      .getByRole('button', { name: 'Set RTL' })
      .click();

    await expect(locator).toHaveAttribute('dir', 'rtl');
  });
  test('should show error message', async ({ page }) => {
    await page.getByRole('link', { name: 'Error' }).click();
    await expect(
      page
        .frameLocator('[data-test-id="preview-iframe"]')
        .getByText('required validation failed'),
    ).toBeVisible();
  });
});
