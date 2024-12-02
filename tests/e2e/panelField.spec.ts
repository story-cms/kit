import { test, expect } from '@playwright/test';
const panelModel = {
  title: 'John',
  description: '# Read about John',
};

test.beforeEach(async ({ page }) => {
  await page.goto('/src-draft-objectfield-story-vue');
  await page.getByRole('link', { name: 'PanelField 5' }).click();
});
test.afterEach(async ({ page }) => {
  await page.close();
});

test.describe('Panel Field', () => {
  test('should show default fields', async ({ page }) => {
    const frameLocator = page.frameLocator('[data-test-id="preview-iframe"]');
    await page.getByRole('link', { name: 'Default' }).click();

    await expect(frameLocator.getByRole('button', { name: 'Note' })).toBeVisible();
    await expect(frameLocator.locator('input[name="Title"]')).toHaveValue(
      panelModel.title,
    );
    await expect(
      frameLocator.getByText('Read about John', { exact: true }),
    ).toBeVisible();
  });
  test('should show rows', async ({ page }) => {
    await page.getByRole('link', { name: 'Rows' }).click();

    const frameLocator = page.frameLocator('[data-test-id="preview-iframe"]');

    await expect(
      frameLocator.locator('div').filter({ hasText: /^Profile Image$/ }),
    ).toBeVisible();
    await expect(
      frameLocator.locator('div').filter({ hasText: /^Avatar Image$/ }),
    ).toBeVisible();
    await expect(
      frameLocator
        .getByText('Upload a fileor drag and dropSVG, PNG, JPG, GIF up to 5MB')
        .first(),
    ).toBeVisible();
    await expect(
      frameLocator
        .getByText('Upload a fileor drag and dropSVG, PNG, JPG, GIF up to 5MB')
        .nth(1),
    ).toBeVisible();
  });
  test('should show error message', async ({ page }) => {
    await page.getByRole('link', { name: 'Error', exact: true }).click();

    const frameLocator = page.frameLocator('[data-test-id="preview-iframe"]');

    await expect(frameLocator.getByRole('button', { name: 'Note' })).toBeVisible();
    await expect(frameLocator.locator('input[name="Title"]')).toHaveValue(
      panelModel.title,
    );
    await expect(
      frameLocator.getByText('Read about John', { exact: true }),
    ).toBeVisible();
    await expect(frameLocator.getByText('required validation failed')).toBeVisible();
  });

  test('should make fields readonly', async ({ page }) => {
    await page.getByRole('link', { name: 'Readonly', exact: true }).click();

    const frameLocator = page.frameLocator('[data-test-id="preview-iframe"]');

    await expect(frameLocator.getByRole('button', { name: 'Note' })).toBeVisible();
    await expect(frameLocator.locator('input[name="Title"]')).toHaveValue(
      'English Title',
    );
    // await expect(
    //   frameLocator.getByText('Read about John', { exact: true }),
    // ).toBeVisible();

    await expect(frameLocator.locator('input[name="Title"]')).toHaveAttribute(
      'readonly',
      '',
    );
  });

  test('should panel with no label', async ({ page }) => {
    await page.getByRole('link', { name: 'No Label', exact: true }).click();

    const frameLocator = page.frameLocator('[data-test-id="preview-iframe"]');
    await expect(frameLocator.locator('input[name="Title"]')).toHaveValue(
      panelModel.title,
    );
    await expect(
      frameLocator.getByText('Read about John', { exact: true }),
    ).toBeVisible();
    await expect(frameLocator.getByRole('button', { name: 'Note' })).not.toBeVisible();
  });
});
