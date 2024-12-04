import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/src-draft-markdownfield-story-vue');
  await page.getByRole('link', { name: 'Markdown Field 8' }).click();
});
test.afterEach(async ({ page }) => {
  await page.close();
});

test.describe('Markdown Field', () => {
  test('should show markdown field', async ({ page }) => {
    await page.getByRole('link', { name: 'With model' }).click();

    await expect(
      page
        .frameLocator('[data-test-id="preview-iframe"]')
        .getByText('Notes', { exact: true }),
    ).toBeVisible();

    await expect(
      page.frameLocator('[data-test-id="preview-iframe"]').locator('.CodeMirror'),
    ).toBeVisible();
    await expect(
      page.frameLocator('[data-test-id="preview-iframe"]').locator('.CodeMirror-lines'),
    ).toBeVisible();
  });

  test('should show markdown toolbar buttons', async ({ page }) => {
    await page.getByRole('link', { name: 'With custom toolbar buttons' }).click();

    await expect(
      page
        .frameLocator('[data-test-id="preview-iframe"]')
        .getByRole('button', { name: 'Bold' }),
    ).toBeVisible();
    await expect(
      page
        .frameLocator('[data-test-id="preview-iframe"]')
        .getByRole('button', { name: 'Italic' }),
    ).toBeVisible();
    await expect(
      page
        .frameLocator('[data-test-id="preview-iframe"]')
        .getByRole('button', { name: 'Heading' }),
    ).toBeVisible();
  });
  test('should show error', async ({ page }) => {
    await page.getByRole('link', { name: 'Error' }).click();
    await expect(
      page
        .frameLocator('[data-test-id="preview-iframe"]')
        .getByText('required validation failed'),
    ).toHaveCount(2);
  });

  test('should hide toolbar buttons', async ({ page }) => {
    await page.getByRole('link', { name: 'Without Toolbar buttons' }).click();
    await expect(
      page
        .frameLocator('[data-test-id="preview-iframe"]')
        .getByRole('button', { name: 'Bold' }),
    ).not.toBeVisible();
    await expect(
      page
        .frameLocator('[data-test-id="preview-iframe"]')
        .getByRole('button', { name: 'Italic' }),
    ).not.toBeVisible();
    await expect(
      page
        .frameLocator('[data-test-id="preview-iframe"]')
        .getByRole('button', { name: 'Heading' }),
    ).not.toBeVisible();
    await expect(
      page
        .frameLocator('[data-test-id="preview-iframe"]')
        .getByRole('button', { name: 'Footnote Button' }),
    ).not.toBeVisible();
  });

  test('should set RTL', async ({ page }) => {
    await page.getByRole('link', { name: 'RTL' }).click();

    const locator = page
      .frameLocator('[data-test-id="preview-iframe"]')
      .getByText('Notes|xxxxxxxxxx # The');

    await page
      .frameLocator('[data-test-id="preview-iframe"]')
      .getByRole('button', { name: 'Set RTL' })
      .click();

    await expect(locator).toHaveAttribute('dir', 'rtl');
    await page
      .frameLocator('[data-test-id="preview-iframe"]')
      .getByRole('button', { name: 'Set LTR' })
      .click();
    await expect(locator).toHaveAttribute('dir', 'ltr');
  });

  test('should be readonly @test', async ({ page }) => {
    await page.getByRole('link', { name: 'Readonly' }).click();

    const locator = page
      .frameLocator('[data-test-id="preview-iframe"]')
      .getByText('# This is a readonly note');
    await expect(locator).toBeVisible();
    // TODO: check for readonly attribute in element
    // await expect(
    //   page
    //     .frameLocator('[data-test-id="preview-iframe"]')
    //     .getByText(
    //       'Notesxxxxxxxxxx # The OutingWe went to the park at *09h00* on a **sunny** day.',
    //     ),
    // ).toHaveClass(/opacity-50/);
  });
});
