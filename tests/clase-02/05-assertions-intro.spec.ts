// Clase 2 — B5: Introducción a las assertions
// Las assertions verifican que lo que encontraste con el locator es correcto.
// Sin assertion, el test no comprueba nada útil aunque el locator funcione.
// App: https://www.saucedemo.com
// Ejecutar: npx playwright test tests/clase-02/05-assertions-intro.spec.ts --headed

import { test, expect } from '@playwright/test';

async function login(page: any) {
  await page.goto('https://www.saucedemo.com');
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();
}

// toHaveURL — verifica la URL actual (la más usada tras acciones de navegación)
test('toHaveURL: la URL cambió tras el login', async ({ page }) => {
  await login(page);
  await expect(page).toHaveURL(/inventory/);
});

// toBeVisible — verifica que el elemento está visible en pantalla
test('toBeVisible: el título de productos es visible', async ({ page }) => {
  await login(page);
  await expect(page.locator('.title')).toBeVisible();
});

// toHaveText — verifica el texto exacto de un elemento
test('toHaveText: el título dice exactamente "Products"', async ({ page }) => {
  await login(page);
  await expect(page.locator('.title')).toHaveText('Products');
});

// toContainText — verifica que el texto contiene una cadena (no tiene que ser exacto)
test('toContainText: el nombre del primer producto contiene "Sauce Labs"', async ({ page }) => {
  await login(page);
  await expect(page.locator('.inventory_item_name').first()).toContainText('Sauce Labs');
});

// toHaveCount — verifica cuántos elementos coinciden con el locator
test('toHaveCount: hay exactamente 6 productos en el inventario', async ({ page }) => {
  await login(page);
  await expect(page.locator('.inventory_item')).toHaveCount(6);
});

// .not — invierte cualquier assertion
test('not.toBeVisible: el error NO es visible en un login exitoso', async ({ page }) => {
  await login(page);
  await expect(page.locator('[data-test="error"]')).not.toBeVisible();
});

// REGLA: cada test debe tener al menos una assertion
// Sin expect(), el test siempre pasa aunque la app esté rota
