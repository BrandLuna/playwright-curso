// Clase 4 — B1: Fixtures de Playwright
// Ejecutar: npx playwright test tests/clase-04/01-fixtures.spec.ts --headed

// importamos test y expect desde el fixture en vez de @playwright/test
import { test, expect } from '../fixtures/auth.fixture';

// el fixture 'loggedInPage' provee una página ya autenticada
// no necesitamos beforeEach ni llamar a login manualmente

test('agregar producto al carrito usando fixture', { tag: '@smoke' }, async ({ loggedInPage }) => {
  await loggedInPage.locator('.btn_inventory').first().click();
  await expect(loggedInPage.locator('.shopping_cart_badge')).toHaveText('1');
});

test('verificar inventario con fixture', { tag: '@smoke' }, async ({ loggedInPage }) => {
  await expect(loggedInPage.locator('.inventory_item')).toHaveCount(6);
  await expect(loggedInPage).toHaveURL(/inventory/);
});

test('ir al carrito usando fixture', { tag: '@regression' }, async ({ loggedInPage }) => {
  // agregar producto
  await loggedInPage.locator('.btn_inventory').first().click();

  // navegar al carrito
  await loggedInPage.locator('.shopping_cart_link').click();
  await expect(loggedInPage).toHaveURL(/cart/);
  await expect(loggedInPage.locator('.cart_item')).toHaveCount(1);
});

// COMPARACIÓN: el mismo test sin fixture necesitaría esto antes de cada test:
//
// test.beforeEach(async ({ page }) => {
//   await page.goto('https://www.saucedemo.com');
//   await page.getByPlaceholder('Username').fill('standard_user');
//   await page.getByPlaceholder('Password').fill('secret_sauce');
//   await page.getByRole('button', { name: 'Login' }).click();
// });
