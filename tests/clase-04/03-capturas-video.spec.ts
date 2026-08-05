// Clase 4 — B2: Capturas de pantalla y video
// Ejecutar: npx playwright test tests/clase-04/03-capturas-video.spec.ts --headed

import { test, expect } from '@playwright/test';

// Las capturas automáticas y el video están configurados en playwright.config.ts:
//   screenshot: 'only-on-failure'
//   video: 'retain-on-failure'
// No necesitas código extra para eso — ocurre automáticamente.

test('captura manual en un punto específico del flujo', { tag: '@regression' }, async ({ page }) => {
  await page.goto('https://www.saucedemo.com');

  // captura manual antes del login
  await page.screenshot({ path: 'evidencias/antes-del-login.png' });

  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  // captura manual después del login
  await page.screenshot({ path: 'evidencias/inventario.png' });
  await expect(page).toHaveURL(/inventory/);
});

test('captura fullPage del inventario completo', { tag: '@regression' }, async ({ page }) => {
  await page.goto('https://www.saucedemo.com');
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  // fullPage: true captura toda la página incluyendo el scroll
  await page.screenshot({ path: 'evidencias/inventario-completo.png', fullPage: true });
  await expect(page.locator('.inventory_item')).toHaveCount(6);
});

test('captura de un elemento específico', { tag: '@regression' }, async ({ page }) => {
  await page.goto('https://www.saucedemo.com');
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  // captura solo del listado de productos, no de toda la página
  await page.locator('.inventory_list').screenshot({ path: 'evidencias/lista-productos.png' });
  await expect(page.locator('.inventory_list')).toBeVisible();
});

// Este test falla intencionalmente para demostrar la captura automática al fallar
// Descomenta para ver cómo se guarda la evidencia automáticamente:
//
// test('test que falla — demuestra captura automática', async ({ page }) => {
//   await page.goto('https://www.saucedemo.com');
//   await expect(page.getByText('Este texto no existe')).toBeVisible();
// });
