// Clase 3 — B5: Fixtures de Playwright
// Evolución natural del beforeEach: el fixture hace el login una vez
// y lo provee a cualquier test que lo importe, sin repetir código.
// Ejecutar: npx playwright test tests/clase-03/05-fixtures.spec.ts --headed

// importamos test y expect desde el fixture en vez de @playwright/test
import { test, expect } from '../fixtures/auth.fixture';

// el fixture 'loggedInPage' ya hizo el login — no necesitas beforeEach

test('inventario cargado con fixture', { tag: '@smoke' }, async ({ loggedInPage }) => {
  await expect(loggedInPage).toHaveURL(/inventory/);
  await expect(loggedInPage.locator('.inventory_item')).toHaveCount(6);
});

test('agregar producto con fixture', { tag: '@smoke' }, async ({ loggedInPage }) => {
  await loggedInPage.locator('.btn_inventory').first().click();
  await expect(loggedInPage.locator('.shopping_cart_badge')).toHaveText('1');
});

test('navegar al carrito con fixture', { tag: '@regression' }, async ({ loggedInPage }) => {
  await loggedInPage.locator('.btn_inventory').first().click();
  await loggedInPage.locator('.shopping_cart_link').click();
  await expect(loggedInPage).toHaveURL(/cart/);
});

// COMPARACIÓN — sin fixture necesitarías esto antes de cada test:
//
// test.beforeEach(async ({ page }) => {
//   await page.goto('https://www.saucedemo.com');
//   await page.getByPlaceholder('Username').fill('standard_user');
//   await page.getByPlaceholder('Password').fill('secret_sauce');
//   await page.getByRole('button', { name: 'Login' }).click();
// });
//
// Con el fixture: solo importas y ya está disponible en cada test del archivo
// Y además funciona entre archivos — no necesitas copiarlo en cada spec.
