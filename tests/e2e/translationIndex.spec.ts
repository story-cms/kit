import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/src-draft-translationindex-story-vue');
  await page.getByRole('link', { name: 'Translation Page 6' }).click();
  await page.getByRole('link', { name: 'Index', exact: true }).click();
});

test.afterEach(async ({ page }) => {
  await page.close();
});

test('shows source markdown immediately after reopening the source column', async ({
  page,
}) => {
  const preview = page.frameLocator('[data-test-id="preview-iframe"]');
  const sourceToggle = preview.getByRole('button', { name: 'English' });
  const sourceMarkdown = preview.getByText('## The Word Became Flesh', {
    exact: false,
  });

  await expect(sourceMarkdown).toBeVisible();

  await sourceToggle.click();
  await expect(sourceMarkdown).toBeHidden();

  await sourceToggle.click();
  await expect(sourceMarkdown).toBeVisible();
});
