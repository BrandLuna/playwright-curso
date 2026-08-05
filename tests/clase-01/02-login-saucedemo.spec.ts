// Clase 1 — B4: Primer test en saucedemo.com
// Grabar con Codegen: npx playwright codegen https://www.saucedemo.com
// Ejecutar: npx playwright test tests/clase-01/02-login-saucedemo.spec.ts --headed

import { test, expect } from '@playwright/test';

// Código tal como lo genera Codegen — punto de partida
test('login saucedemo — output de Codegen', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

  // .fill() limpia el campo y escribe el texto
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();

  // verifica que la URL cambió a /inventory después del login
  await expect(page).toHaveURL(/inventory/);
});

// Happy path con dos assertions para mayor robustez
test('login exitoso llega al inventario', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();

  await expect(page).toHaveURL(/inventory/);
  // confirma que el contenido cargó, no solo que la URL cambió
  await expect(page.locator('.title')).toHaveText('Products');
});

// Negative test: credenciales incorrectas deben mostrar error
test('login con credenciales incorrectas muestra error', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await page.locator('#user-name').fill('usuario_invalido');
  await page.locator('#password').fill('contrasena_incorrecta');
  await page.locator('#login-button').click();

  // data-test es un atributo personalizado — útil cuando no hay id
  await expect(page.locator('[data-test="error"]')).toBeVisible();
});

// PRÁCTICA: agrega un test que haga login y luego haga click en el primer producto
// test('explorar un producto después del login', async ({ page }) => {
//   // tu código aquí
// });
