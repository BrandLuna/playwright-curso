// Clase 3 — B4: Flujo E2E completo en saucedemo.com
// Login → agregar producto → checkout → verificar confirmación
// Ejecutar: npx playwright test tests/clase-03/04-flujo-e2e.spec.ts --headed

import { test, expect } from '@playwright/test';

test.describe('Flujo de compra completo', () => {
  // beforeEach hace el login una vez antes de cada test del grupo
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL(/inventory/);
  });

  // ─── Smoke: verificación básica del flujo ──────────────────────────────────
  test('agregar producto al carrito', { tag: '@smoke' }, async ({ page }) => {
    await page.locator('.btn_inventory').first().click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  // ─── Regression: flujo completo de checkout ───────────────────────────────
  test('checkout completo desde login hasta confirmación', { tag: ['@smoke', '@regression'] }, async ({ page }) => {
    // — Agregar producto —
    await page.locator('.btn_inventory').first().click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

    // — Ir al carrito —
    await page.locator('.shopping_cart_link').click();
    await expect(page).toHaveURL(/cart/);
    await expect(page.locator('.cart_item')).toHaveCount(1);

    // — Iniciar checkout —
    await page.getByRole('button', { name: 'Checkout' }).click();
    await expect(page).toHaveURL(/checkout-step-one/);

    // — Completar formulario de envío —
    await page.getByPlaceholder('First Name').fill('Juan');
    await page.getByPlaceholder('Last Name').fill('QA');
    await page.getByPlaceholder('Zip/Postal Code').fill('15001');
    await page.getByRole('button', { name: 'Continue' }).click();

    // — Verificar resumen de la orden —
    await expect(page).toHaveURL(/checkout-step-two/);
    await expect(page.getByText('Checkout: Overview')).toBeVisible();

    // Espera fija de 5 segundos antes de continuar (solo como demostración)
    await page.waitForTimeout(5_000);

    // — Finalizar compra —
    await page.getByRole('button', { name: 'Finish' }).click();

    // — Verificar confirmación —
    await expect(page).toHaveURL(/checkout-complete/);
    // Este timeout local reemplaza los 5 segundos de expect definidos en playwright.config.ts
    await expect(page.getByText('Thank you for your order!')).toBeVisible({ timeout: 10_000 });
  });

  // ─── Regression: verificar que el carrito persiste entre páginas ──────────
  test('el carrito persiste al navegar entre páginas', { tag: '@regression' }, async ({ page }) => {
    await page.locator('.btn_inventory').first().click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

    // navegar a un producto y volver — el badge debe seguir mostrando 1
    await page.locator('.inventory_item_name').first().click();
    await expect(page).toHaveURL(/inventory-item/);
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  // ─── TAREA: test de ordenamiento (completar en clase) ─────────────────────
  // test('ordenar productos por precio ascendente @regression', async ({ page }) => {
  //   // 1. En el dropdown .product_sort_container, seleccionar la opción
  //   //    'Price (low to high)' usando selectOption('lohi').
  //   // 2. Leer todos los textos de .inventory_item_price, convertirlos a números
  //   //    y comprobar que el primer precio sea igual al menor de toda la lista.
  // });
});
