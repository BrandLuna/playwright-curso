// Clase 3 — B1: Assertions y esperas
// App: https://www.saucedemo.com
// Ejecutar: npx playwright test tests/clase-03/01-assertions.spec.ts --headed

import { test, expect } from '@playwright/test';

// helper reutilizable para hacer login — evita repetir el código en cada test
async function login(page: any) {
  await page.goto('https://www.saucedemo.com');
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();
}

// ─── toHaveURL / toHaveTitle ──────────────────────────────────────────────────
test('toHaveURL y toHaveTitle después del login', async ({ page }) => {
  await login(page);

  // verifica que la URL contiene /inventory
  await expect(page).toHaveURL(/inventory/);

  // verifica el título de la pestaña del navegador
  await expect(page).toHaveTitle('Swag Labs');
});

// ─── toBeVisible / toBeHidden ─────────────────────────────────────────────────
test('toBeVisible y toBeHidden', async ({ page }) => {
  await login(page);

  // el título de la página de productos debe estar visible
  await expect(page.locator('.title')).toBeVisible();

  // el mensaje de error NO debe estar visible en un login exitoso
  await expect(page.locator('[data-test="error"]')).toBeHidden();
});

// ─── toHaveText / toContainText ───────────────────────────────────────────────
test('toHaveText y toContainText', async ({ page }) => {
  await login(page);

  // texto exacto del título
  await expect(page.locator('.title')).toHaveText('Products');

  // texto parcial — el nombre del primer producto contiene "Sauce Labs"
  await expect(page.locator('.inventory_item_name').first()).toContainText('Sauce Labs');
});

// ─── toHaveCount ──────────────────────────────────────────────────────────────
test('toHaveCount — número de productos en el inventario', async ({ page }) => {
  await login(page);

  // saucedemo siempre muestra 6 productos en el inventario
  await expect(page.locator('.inventory_item')).toHaveCount(6);
});

// ─── toHaveValue ──────────────────────────────────────────────────────────────
test('toHaveValue — valor de un input', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');

  await page.getByPlaceholder('Username').fill('standard_user');

  // verifica que el campo tiene el valor que escribimos
  await expect(page.getByPlaceholder('Username')).toHaveValue('standard_user');
});

// ─── toBeEnabled / toBeDisabled ───────────────────────────────────────────────
test('toBeEnabled y toBeDisabled', async ({ page }) => {
  await login(page);

  // el botón de carrito está habilitado
  await expect(page.locator('.shopping_cart_link')).toBeEnabled();
});

// ─── Assertions negativas con .not ────────────────────────────────────────────
test('assertions negativas con .not', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');

  // el mensaje de error NO debe ser visible antes de intentar el login
  await expect(page.locator('[data-test="error"]')).not.toBeVisible();

  // login fallido — ahora sí debe aparecer el error
  await page.getByPlaceholder('Username').fill('usuario_invalido');
  await page.getByPlaceholder('Password').fill('pass_incorrecta');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.locator('[data-test="error"]')).toBeVisible();
  await expect(page.locator('[data-test="error"]')).toContainText('Username and password do not match');
});

// ─── Esperas explícitas (cuando el auto-waiting no alcanza) ───────────────────
test('waitForURL y waitForLoadState', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  // waitForURL espera a que la URL cambie — útil tras acciones que redirigen
  await page.waitForURL('**/inventory.html');
  await expect(page).toHaveURL(/inventory/);
});

// EJERCICIO: agrega un test que verifique que el carrito muestra '1'
// después de agregar un producto
