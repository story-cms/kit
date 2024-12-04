import { test, expect } from '@playwright/test';
import {
  listModel,
  listSpec,
  listInListModel,
  listInListSpec,
} from '../../src/frontend/test/mocks';

test.beforeEach(async ({ page }) => {
  await page.goto('/src-draft-listfield-story-vue');
  await page.getByRole('link', { name: 'ListField 10' }).click();
});
test.afterEach(async ({ page }) => {
  await page.close();
});

test.describe('List Field', () => {
  test('should list fields', async ({ page }) => {
    await page.getByRole('link', { name: 'Default' }).click();
    const frame = page.frameLocator('[data-test-id="preview-iframe"]');
    await expect(frame.getByRole('listitem')).toHaveCount(listModel.sections.length);
    await frame.getByRole('button', { name: 'Section' }).click();
    await expect(frame.getByRole('listitem')).toHaveCount(listModel.sections.length + 1);
    await frame.locator('svg').first().click();
    await expect(frame.getByRole('listitem')).toHaveCount(listModel.sections.length);
  });

  test('should list fields and match model', async ({ page }) => {
    await page.getByRole('link', { name: 'Default' }).click();

    const listItemFrame = page
      .frameLocator('[data-test-id="preview-iframe"]')
      .getByRole('listitem');

    await expect(listItemFrame).toHaveCount(listModel.sections.length);

    await expect(
      listItemFrame.first().getByPlaceholder('John 1 or John 1:3-4'),
    ).toHaveValue(listModel.sections[0].scripture.reference);

    await expect(listItemFrame.first().getByPlaceholder('verse')).toHaveValue(
      listModel.sections[0].scripture.verse,
    );

    await expect(listItemFrame.first().locator('.CodeMirror').first()).toContainText(
      listModel.sections[0].commentary,
    );

    await expect(
      listItemFrame.nth(1).getByPlaceholder('John 1 or John 1:3-4'),
    ).toHaveValue(listModel.sections[1].scripture.reference);

    await expect(listItemFrame.nth(1).getByPlaceholder('verse')).toHaveValue(
      listModel.sections[1].scripture.verse,
    );

    await expect(listItemFrame.nth(1).locator('.CodeMirror').first()).toContainText(
      listModel.sections[1].commentary,
    );
  });

  test('should show foldable list', async ({ page }) => {
    await page.getByRole('link', { name: 'Foldable', exact: true }).click();

    const listItemFrame = page.frameLocator('[data-test-id="preview-iframe"]');

    await listItemFrame
      .getByRole('button', {
        name: `${listSpec.label} : ${listModel.sections[0].scripture.reference}`,
      })
      .click();
    await listItemFrame
      .getByRole('button', {
        name: `${listSpec.label} : ${listModel.sections[0].scripture.reference}`,
      })
      .click();

    await expect(
      page
        .frameLocator('[data-test-id="preview-iframe"]')
        .locator('[id="sections\\.0\\.scripture"]'),
    ).toHaveValue(listModel.sections[0].scripture.reference);

    await expect(
      page
        .frameLocator('[data-test-id="preview-iframe"]')
        .locator('[id="sections\\.1\\.scripture"]'),
    ).toHaveValue(listModel.sections[1].scripture.reference);

    await expect(listItemFrame.getByPlaceholder('verse').first()).toHaveValue(
      listModel.sections[0].scripture.verse,
    );

    await expect(listItemFrame.first().locator('.CodeMirror').first()).toContainText(
      listModel.sections[0].commentary,
    );

    await listItemFrame
      .getByRole('button', {
        name: `${listSpec.label} : ${listModel.sections[1].scripture.reference}`,
      })
      .click();

    await expect(listItemFrame.locator('.CodeMirror').first()).toContainText(
      listModel.sections[0].commentary,
    );
  });

  test('should set data from model', async ({ page }) => {
    await page.getByRole('link', { name: 'Load data' }).click();

    const frame = page.frameLocator('[data-test-id="preview-iframe"]');
    await frame.getByRole('button', { name: 'Set Data' }).click();

    await frame
      .getByRole('button', {
        name: `${listSpec.label} : ${listModel.sections[0].scripture.reference}`,
      })
      .click();
    await frame
      .getByRole('button', {
        name: `${listSpec.label} : ${listModel.sections[0].scripture.reference}`,
      })
      .click();

    await expect(
      page
        .frameLocator('[data-test-id="preview-iframe"]')
        .locator('[id="sections\\.0\\.scripture"]'),
    ).toHaveValue(listModel.sections[0].scripture.reference);

    await expect(frame.getByPlaceholder('Verse').first()).toHaveValue(
      listModel.sections[0].scripture.verse,
    );

    await expect(frame.locator('.CodeMirror-scroll').first()).toContainText(
      listModel.sections[0].commentary,
    );

    await expect(frame.locator('[id="sections\\.1\\.scripture"]')).toHaveValue(
      listModel.sections[1].scripture.reference,
    );

    await expect(frame.getByPlaceholder('verse').nth(1)).toHaveValue(
      listModel.sections[1].scripture.verse,
    );

    await expect(frame.locator('.CodeMirror').nth(1).first()).toContainText(
      listModel.sections[1].commentary,
    );
  });
  test('should show list in list', async ({ page }) => {
    await page.getByRole('link', { name: 'List in List', exact: true }).click();

    const frame = page.frameLocator('[data-test-id="preview-iframe"]');
    await frame
      .getByRole('button', {
        name: `${listInListSpec.label} : ${listInListModel.spreads[0].title}`,
      })
      .click();
    await frame
      .getByRole('button', {
        name: `${listInListSpec.label} : ${listInListModel.spreads[0].title}`,
      })
      .click();
    await expect(frame.locator('input[name="Title"]').first()).toHaveValue(
      listInListModel.spreads[0].title,
    );
  });

  // TODO: List in List Empty, List in List Error
});
