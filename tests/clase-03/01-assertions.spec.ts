// Clase 3 — B1: Assertions en profundidad
// En clase-02 viste las básicas (toBeVisible, toHaveURL, toHaveText, toHaveCount).
// Aquí ampliamos con las que no cubrimos: toHaveTitle, toBeHidden, toHaveValue,
// toBeEnabled/Disabled, y esperas explícitas.
// App: https://www.saucedemo.com
// Ejecutar: npx playwright test tests/clase-03/01-assertions.spec.ts --headed

import { test, expect } from '@playwright/test';

async function login(page: any) {
  await page.goto('https://www.saucedemo.com');
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();
}

// toHaveTitle — verifica el título de la pestaña del navegador
test('toHaveTitle: título de la página', async ({ page }) => {
  await login(page);
  await expect(page).toHaveTitle('Swag Labs');
});

// toBeHidden — el elemento existe en el DOM pero no es visible
test('toBeHidden: el mensaje de error está oculto en login exitoso', async ({ page }) => {
  await login(page);
  await expect(page.locator('[data-test="error"]')).toBeHidden();
});

// toHaveValue — verifica el valor actual de un input
test('toHaveValue: el campo tiene el valor que escribimos', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');
  await page.getByPlaceholder('Username').fill('standard_user');
  await expect(page.getByPlaceholder('Username')).toHaveValue('standard_user');
});

// toBeEnabled / toBeDisabled — verifica el estado del elemento
test('toBeEnabled y toBeDisabled', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');
  // el botón de login siempre está habilitado
  await expect(page.getByRole('button', { name: 'Login' })).toBeEnabled();

  await login(page);
  // el botón de ordenamiento está habilitado en el inventario
  await expect(page.locator('.product_sort_container')).toBeEnabled();
});

// Assertions negativas más usadas en pruebas reales
test('assertions negativas: .not en distintos contextos', async ({ page }) => {
  await login(page);

  // el carrito no muestra badge cuando está vacío
  await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();

  // el título no dice otra cosa
  await expect(page.locator('.title')).not.toHaveText('Checkout');

  // la URL no contiene cart
  await expect(page).not.toHaveURL(/cart/);
});

// waitForURL — espera explícita cuando auto-waiting no alcanza
test('waitForURL: espera a que la URL cambie tras login', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  // waitForURL espera hasta que la URL coincida — útil en redirects lentos
  await page.waitForURL('**/inventory.html');
  await expect(page).toHaveURL(/inventory/);
});

// EJERCICIO: agrega un test que verifique toHaveCount después de agregar 2 productos

