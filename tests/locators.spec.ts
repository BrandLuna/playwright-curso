import { test, expect } from '@playwright/test';

test.describe('Ejemplos de locators en Playwright', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://playwright.dev/');
  });

  test('Locator por label', async ({ page }) => {
    // Busca un input por su label accesible
    await expect(page.getByLabel('Search')).toBeVisible();
  });

  test('Locator por placeholder', async ({ page }) => {
    // Busca por el atributo placeholder
    await expect(page.getByPlaceholder('Search')).toBeVisible();
  });

  test('Locator por alt text', async ({ page }) => {
    // Busca imágenes por su atributo alt (ajusta el texto según la página)
    // await expect(page.getByAltText('Logo')).toBeVisible();
  });

  test('Locator por title', async ({ page }) => {
    // Busca por el atributo title (ajusta el texto según la página)
    // await expect(page.getByTitle('Some title')).toBeVisible();
  });

  test('Locator por test id', async ({ page }) => {
    // Busca por el atributo data-testid (ajusta el id según la página)
    // await expect(page.getByTestId('test-id')).toBeVisible();
  });
  test('Locator por texto', async ({ page }) => {
    await expect(page.getByText('Get started')).toBeVisible();
  });

  test('Locator por rol', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Get started' })).toBeVisible();
  });

  test('Locator por id (CSS)', async ({ page }) => {
    await expect(page.locator('#__docusaurus')).toBeVisible();
  });

  test('Locator por clase (CSS)', async ({ page }) => {
    await expect(page.locator('.navbar__brand')).toBeVisible();
  });

  test('Locator por atributo (CSS)', async ({ page }) => {
    await expect(page.locator('a[href="/docs/intro"]')).toBeVisible();
  });

  test('Locator combinando selectores (CSS)', async ({ page }) => {
    await expect(page.locator('a.navbar__item[href="/docs/intro"]')).toBeVisible();
  });

  test('Locator por orden (nth)', async ({ page }) => {
    const items = page.locator('.navbar__item');
    await expect(items.nth(1)).toBeVisible();
  });

  test('Locator por XPath', async ({ page }) => {
    const logo = page.locator('//a[contains(@class, "navbar__brand")]');
    await expect(logo).toBeVisible();
  });

  test('Locator por texto con XPath', async ({ page }) => {
    const link = page.locator('//a[contains(text(), "Get started")]');
    await expect(link).toBeVisible();
  });

  test('Locator por atributo con XPath', async ({ page }) => {
    const link = page.locator('//a[@href="/docs/intro"]');
    await expect(link).toBeVisible();
  });
});
