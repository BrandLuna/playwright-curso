// Clase 3 — B2: describe, hooks y tags
// App: https://www.saucedemo.com
// Ejecutar: npx playwright test tests/clase-03/02-describe-hooks-tags.spec.ts --headed

import { test, expect } from '@playwright/test';

// ─── describe() ───────────────────────────────────────────────────────────────
// Agrupa tests relacionados bajo un nombre común — mejora la lectura del reporte

// FORMA 1: tag al final del nombre — simple, funciona con --grep
// FORMA 2: { tag: '@smoke' } — nombre limpio, tags separados (recomendada desde v1.42)

test.describe('Login en saucedemo', () => {
  // Forma 1: tag en el nombre
  test('login exitoso con standard_user @smoke', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL(/inventory/);
  });

  // Forma 2: tag separado — el nombre queda limpio en el reporte
  test('login fallido con credenciales incorrectas', { tag: '@smoke' }, async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
    await page.getByPlaceholder('Username').fill('usuario_invalido');
    await page.getByPlaceholder('Password').fill('pass_incorrecta');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  // Forma 2 con múltiples tags
  test('login fallido con usuario bloqueado', { tag: ['@smoke', '@regression'] }, async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
    // locked_out_user es un usuario especial de saucedemo para probar bloqueos
    await page.getByPlaceholder('Username').fill('locked_out_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.locator('[data-test="error"]')).toContainText('Sorry, this user has been locked out');
  });
});

// ─── Hooks: beforeEach / afterEach ───────────────────────────────────────────
// beforeEach hace el login una sola vez antes de cada test
// así los tests del describe solo se enfocan en lo que están probando

test.describe('Carrito de compras', () => {
  test.beforeEach(async ({ page }) => {
    // login compartido — corre antes de CADA test de este describe
    await page.goto('https://www.saucedemo.com');
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL(/inventory/);
  });

  test('agregar primer producto al carrito', { tag: '@smoke' }, async ({ page }) => {
    // el beforeEach ya hizo login — aquí solo probamos el carrito
    await page.locator('.btn_inventory').first().click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  test('agregar y quitar producto del carrito', { tag: '@regression' }, async ({ page }) => {
    await page.locator('.btn_inventory').first().click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

    // quitar el producto
    await page.locator('.btn_inventory').first().click();
    // el badge desaparece cuando el carrito está vacío
    await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();
  });

  test('agregar múltiples productos al carrito', { tag: '@regression' }, async ({ page }) => {
    // agrega los primeros 3 productos
    const buttons = page.locator('.btn_inventory');
    await buttons.nth(0).click();
    await buttons.nth(1).click();
    await buttons.nth(2).click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('3');
  });
});

// ─── test.skip / test.fixme ───────────────────────────────────────────────────

test.describe('Funcionalidad en construcción', () => {
  // test.skip: salta el test pero lo muestra en el reporte como "skipped"
  test.skip('ordenar productos por precio', { tag: '@regression' }, async ({ page }) => {
    // TAREA: implementa este test en clase
  });

  // test.fixme: similar a skip pero indica que el test está roto y necesita arreglo
  test.fixme('validar cupón de descuento', { tag: '@regression' }, async ({ page }) => {
    // saucedemo no tiene cupones — marcamos como fixme para recordarlo
  });
});

// ─── Tags en acción ───────────────────────────────────────────────────────────
// Ejecutar solo smoke: npx playwright test --grep @smoke
// Ejecutar solo regression: npx playwright test --grep @regression
// Excluir regression: npx playwright test --grep-invert @regression
