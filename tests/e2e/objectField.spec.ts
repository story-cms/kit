import { test, expect } from '@playwright/test';
import {
  objectSpec,
  objectModel,
  objectModelReadonly,
  listInObjectSpec,
  listInObjectModel,
  objectInListInObjectSpec,
  objectInListInObjectModel,
} from '../../src/frontend/test/mocks';

test.beforeEach(async ({ page }) => {
  await page.goto('/src-draft-objectfield-story-vue');
  await page.getByRole('link', { name: 'ObjectField 9' }).click();
});
test.afterEach(async ({ page }) => {
  await page.close();
});

test.describe('Object Field', () => {
  test('should show default fields', async ({ page }) => {
    await page.getByRole('link', { name: 'Default' }).click();

    for (const item of objectSpec.fields) {
      if (item.widget === 'string') {
        await expect(
          page
            .frameLocator('[data-test-id="preview-iframe"]')
            .locator(`input[name=${item.label}]`),
        ).toHaveValue(objectModel.address[item.name]);
      }
      if (item.widget === 'scripture') {
        await expect(
          page
            .frameLocator('[data-test-id="preview-iframe"]')
            .getByPlaceholder('John 1 or John 1:3-4'),
        ).toHaveValue(objectModel.address.favoriteScripture.reference);
        await expect(
          page.frameLocator('[data-test-id="preview-iframe"]').getByPlaceholder('Verse'),
        ).toHaveValue(objectModel.address.favoriteScripture.verse);
      }
    }
  });
  test('should make fields readonly', async ({ page }) => {
    await page.getByRole('link', { name: 'Readonly' }).click();

    for (const item of objectSpec.fields) {
      if (item.widget === 'string') {
        await expect(
          page
            .frameLocator('[data-test-id="preview-iframe"]')
            .locator(`input[name=${item.label}]`),
        ).toHaveValue(objectModelReadonly.address[item.name]);
        await expect(
          page
            .frameLocator('[data-test-id="preview-iframe"]')
            .locator(`input[name=${item.label}]`),
        ).toHaveAttribute('readonly', '');
      }
      if (item.widget === 'scripture') {
        await expect(
          page
            .frameLocator('[data-test-id="preview-iframe"]')
            .getByPlaceholder('John 1 or John 1:3-4'),
        ).toHaveValue(objectModelReadonly.address.favoriteScripture.reference);
        await expect(
          page.frameLocator('[data-test-id="preview-iframe"]').getByPlaceholder('Verse'),
        ).toHaveValue(objectModelReadonly.address.favoriteScripture.verse);
        await expect(
          page
            .frameLocator('[data-test-id="preview-iframe"]')
            .getByPlaceholder('John 1 or John 1:3-4'),
        ).toHaveAttribute('readonly', '');
        await expect(
          page.frameLocator('[data-test-id="preview-iframe"]').getByPlaceholder('Verse'),
        ).toHaveAttribute('readonly', '');
      }
    }
  });
  test('should show error message', async ({ page }) => {
    await page.getByRole('link', { name: 'Error', exact: true }).click();

    await expect(
      page
        .frameLocator('[data-test-id="preview-iframe"]')
        .getByText('required validation failed'),
    ).toBeVisible();
  });
  test('should list in object', async ({ page }) => {
    await page.getByRole('link', { name: 'List in Object', exact: true }).click();
    for (const item of listInObjectSpec.fields as any) {
      if (item.widget === 'string') {
        await expect(
          page
            .frameLocator('[data-test-id="preview-iframe"]')
            .locator(`input[name='${item.label}']`),
        ).toHaveValue(listInObjectModel.spread.scriptureReference);
      }

      if (item.widget === 'list') {
        const listLocator = page
          .frameLocator('[data-test-id="preview-iframe"]')
          .getByRole('listitem');

        const count = await listLocator.count();
        expect(count).toEqual(listInObjectModel.spread.notes.length);

        for (const field of listInObjectSpec.fields as any) {
          if (field.widget === 'list') {
            for (const item of field.fields) {
              if (item.widget === 'string') {
                await expect(
                  listLocator
                    .filter({
                      hasText: 'Frame typeFrame content|xxxxxxxxxx `grace` is a noun.',
                    })
                    .locator(`input[name='${item.label}']`),
                ).toHaveValue(listInObjectModel.spread.notes[0].type);
                await expect(
                  listLocator
                    .filter({
                      hasText:
                        'Frame typeFrame content|xxxxxxxxxx paragraph **1**paragraph **2**paragraph **3**',
                    })
                    .locator(`input[name='${item.label}']`),
                ).toHaveValue(listInObjectModel.spread.notes[1].type);
              }
              if (item.widget === 'markdown') {
                await expect(
                  listLocator.getByText('`grace` is a noun.', { exact: true }),
                ).toBeVisible();
                await expect(
                  listLocator.getByText('paragraph **1**', { exact: true }),
                ).toBeVisible();
                await expect(
                  listLocator.getByText('paragraph **2**', { exact: true }),
                ).toBeVisible();
                await expect(
                  listLocator.getByText('paragraph **3**', { exact: true }),
                ).toBeVisible();
              }
            }
          }
        }
      }
    }
  });

  test('should list object in list in object', async ({ page }) => {
    await page
      .getByRole('link', { name: 'Object in List in Object', exact: true })
      .click();

    const frameLocator = page.frameLocator('[data-test-id="preview-iframe"]');

    await expect(
      frameLocator.getByText(objectInListInObjectSpec.label, { exact: true }),
    ).toBeVisible();

    for (const item of objectInListInObjectSpec.fields as any) {
      if (item.widget === 'string') {
        await expect(frameLocator.locator(`input[name='${item.label}']`)).toHaveValue(
          objectInListInObjectModel.episode[item.name],
        );
      }
      if (item.widget === 'list') {
        const mock_length: number =
          objectInListInObjectModel[objectInListInObjectSpec.name][item.name].length;

        let listLocator = frameLocator.getByRole('listitem');
        let count = await listLocator.count();
        expect(count).toEqual(mock_length);

        await frameLocator.getByRole('button', { name: 'Spreads' }).click();
        listLocator = frameLocator.getByRole('listitem');
        count = await listLocator.count();
        expect(count).toEqual(mock_length + 1);

        await listLocator.nth(0).locator('path').click();
        listLocator = frameLocator.getByRole('listitem');
        count = await listLocator.count();
        expect(count).toEqual(mock_length);
      }
    }
  });
  test('should list object in list in object empty', async ({ page }) => {
    await page
      .getByRole('link', { name: 'Object in List in Object Empty', exact: true })
      .click();

    const frameLocator = page.frameLocator('[data-test-id="preview-iframe"]');

    await expect(frameLocator.getByRole('textbox')).toBeEmpty();
    await frameLocator.getByRole('button', { name: 'Spreads' }).click();
    const listLocator = frameLocator.getByRole('listitem');
    const count = await listLocator.count();
    expect(count).toEqual(1);
  });
});
