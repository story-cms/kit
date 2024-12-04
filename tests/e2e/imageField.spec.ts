import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/src-draft-imagefield-story-vue');
  await page.getByRole('link', { name: 'Image Field 6' }).click();
});
test.afterEach(async ({ page }) => {
  await page.close();
});

test.describe('Image Field', () => {
  test('should show image from model', async ({ page }) => {
    await page.getByRole('link', { name: 'Model with Image' }).click();
    await expect(
      page.frameLocator('[data-test-id="preview-iframe"]').getByText('Profile Image'),
    ).toBeVisible();
    await expect(
      page.frameLocator('[data-test-id="preview-iframe"]').locator('img'),
    ).toBeVisible();
  });

  test('should delete image from model', async ({ page }) => {
    await page.getByRole('link', { name: 'Model with Image' }).click();
    await expect(
      page.frameLocator('[data-test-id="preview-iframe"]').getByText('Profile Image'),
    ).toBeVisible();
    await expect(
      page.frameLocator('[data-test-id="preview-iframe"]').locator('img'),
    ).toBeVisible();
    await expect(
      page.frameLocator('[data-test-id="preview-iframe"]').getByRole('button'),
    ).toBeVisible();
    await page
      .frameLocator('[data-test-id="preview-iframe"]')
      .getByRole('button')
      .click();
    await expect(
      page
        .frameLocator('[data-test-id="preview-iframe"]')
        .getByText('Upload a fileor drag and dropSVG, PNG, JPG, GIF up to 5MB'),
    ).toBeVisible();
  });

  test('should show image upload field', async ({ page }) => {
    await page.getByRole('link', { name: 'Model without Image' }).click();
    await expect(
      page.frameLocator('[data-test-id="preview-iframe"]').getByText('Profile Image'),
    ).toBeVisible();
    await expect(
      page.frameLocator('[data-test-id="preview-iframe"]').locator('img'),
    ).not.toBeVisible();
    await expect(
      page.frameLocator('[data-test-id="preview-iframe"]').getByRole('button'),
    ).not.toBeVisible();
    await expect(
      page
        .frameLocator('[data-test-id="preview-iframe"]')
        .getByText('Upload a fileor drag and dropSVG, PNG, JPG, GIF up to 5MB'),
    ).toBeVisible();
  });

  test('should upload image', async ({ page }) => {
    await page.getByRole('link', { name: 'Model without Image' }).click();
    await expect(
      page.frameLocator('[data-test-id="preview-iframe"]').getByText('Profile Image'),
    ).toBeVisible();
    await expect(
      page.frameLocator('[data-test-id="preview-iframe"]').locator('img'),
    ).not.toBeVisible();
    await expect(
      page.frameLocator('[data-test-id="preview-iframe"]').getByRole('button'),
    ).not.toBeVisible();
    await expect(
      page.frameLocator('[data-test-id="preview-iframe"]').getByRole('button'),
    ).not.toBeVisible();
    await expect(
      page
        .frameLocator('[data-test-id="preview-iframe"]')
        .getByText('Upload a fileor drag and dropSVG, PNG, JPG, GIF up to 5MB'),
    ).toBeVisible();

    await page
      .frameLocator('[data-test-id="preview-iframe"]')
      .getByLabel('Upload a file')
      .setInputFiles('./tests/assets/pic.jpg');
    await expect(
      page.frameLocator('[data-test-id="preview-iframe"]').locator('img'),
    ).toBeVisible();
  });

  test('should upload RIV image only', async ({ page }) => {
    await page.getByRole('link', { name: 'Non Image Upload' }).click();
    await expect(
      page.frameLocator('[data-test-id="preview-iframe"]').getByText('Profile Image'),
    ).toBeVisible();
    await expect(
      page.frameLocator('[data-test-id="preview-iframe"]').locator('img'),
    ).not.toBeVisible();
    await expect(
      page.frameLocator('[data-test-id="preview-iframe"]').getByRole('button'),
    ).not.toBeVisible();
    await expect(
      page.frameLocator('[data-test-id="preview-iframe"]').getByRole('button'),
    ).not.toBeVisible();
    await expect(
      page
        .frameLocator('[data-test-id="preview-iframe"]')
        .getByText('Upload a fileor drag and dropSVG, PNG, JPG, GIF up to 5MB'),
    ).not.toBeVisible();
    await expect(
      page
        .frameLocator('[data-test-id="preview-iframe"]')
        .getByText('Upload a fileor drag and dropRIV only'),
    ).toBeVisible();
    await page
      .frameLocator('[data-test-id="preview-iframe"]')
      .getByLabel('Upload a file')
      .setInputFiles('./tests/assets/pic.jpg');
    await expect(
      page.frameLocator('[data-test-id="preview-iframe"]').locator('img'),
    ).not.toBeVisible();
  });

  test('should show image field with file attributes', async ({ page }) => {
    await page.getByRole('link', { name: 'Model with file attributes' }).click();
    await expect(
      page.frameLocator('[data-test-id="preview-iframe"]').getByText('Profile Image'),
    ).toBeVisible();
    await expect(
      page.frameLocator('[data-test-id="preview-iframe"]').locator('img'),
    ).not.toBeVisible();
    await expect(
      page.frameLocator('[data-test-id="preview-iframe"]').getByRole('button'),
    ).not.toBeVisible();
    await expect(
      page.frameLocator('[data-test-id="preview-iframe"]').getByRole('button'),
    ).not.toBeVisible();
    await expect(
      page
        .frameLocator('[data-test-id="preview-iframe"]')
        .getByText('Upload a fileor drag and dropSVG, PNG up to 20KB'),
    ).toBeVisible();

    await page
      .frameLocator('[data-test-id="preview-iframe"]')
      .getByLabel('Upload a file')
      .setInputFiles('./tests/assets/pic-medium.jpg');
    await expect(
      page.frameLocator('[data-test-id="preview-iframe"]').locator('img'),
    ).not.toBeVisible();
  });

  test('should error message if image is missing', async ({ page }) => {
    await page.getByRole('link', { name: 'Error' }).click();
    await expect(
      page
        .frameLocator('[data-test-id="preview-iframe"]')
        .getByText('Profile Image', { exact: true }),
    ).toBeVisible();
    await expect(
      page.frameLocator('[data-test-id="preview-iframe"]').locator('img'),
    ).not.toBeVisible();
    await expect(
      page.frameLocator('[data-test-id="preview-iframe"]').getByRole('button'),
    ).not.toBeVisible();
    await expect(
      page.frameLocator('[data-test-id="preview-iframe"]').getByRole('button'),
    ).not.toBeVisible();
    await expect(
      page
        .frameLocator('[data-test-id="preview-iframe"]')
        .getByText('Upload a fileor drag and dropSVG, PNG, JPG, GIF up to 5MB'),
    ).toBeVisible();
    await expect(
      page
        .frameLocator('[data-test-id="preview-iframe"]')
        .getByText('required validation failed'),
    ).toBeVisible();
  });

  test('should not allow image upload', async ({ page }) => {
    await page.getByRole('link', { name: 'Read Only' }).click();
    await expect(
      page.frameLocator('[data-test-id="preview-iframe"]').getByText('Profile Image'),
    ).toBeVisible();
    await expect(
      page.frameLocator('[data-test-id="preview-iframe"]').getByRole('img'),
    ).toBeVisible();
    await expect(
      page.frameLocator('[data-test-id="preview-iframe"]').getByRole('button'),
    ).not.toBeVisible();
    await expect(
      page.frameLocator('[data-test-id="preview-iframe"]').getByRole('button'),
    ).not.toBeVisible();
    await expect(
      page
        .frameLocator('[data-test-id="preview-iframe"]')
        .getByText('Upload a fileor drag and dropSVG, PNG, JPG, GIF up to 5MB'),
    ).not.toBeVisible();
  });
});
