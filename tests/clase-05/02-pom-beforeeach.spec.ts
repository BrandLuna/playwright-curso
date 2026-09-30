// Clase 5 — B2: POM con beforeEach — evita repetir "const x = new XPage(page)" en cada test
// A diferencia de una fixture, beforeEach corre SIEMPRE para todos los tests del describe,
// aunque un test en particular no use alguna de las pages.
// Ejecutar: npx playwright test tests/clase-05/02-pom-beforeeach.spec.ts --headed

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';

test.describe('Flujo de compra con POM + beforeEach', () => {
  // se declaran aquí, pero se instancian en beforeEach con el "page" de cada test
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  // corre antes de CADA test de este describe, las use o no
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
  });

  test('login exitoso con beforeEach', { tag: '@smoke' }, async ({ page }) => {
    await loginPage.goto('/');
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory/);
  });

  test('login fallido con beforeEach', { tag: '@smoke' }, async () => {
    await loginPage.goto('/');
    await loginPage.login('usuario_invalido', 'pass_incorrecta');
    await loginPage.expectLoginError('Username and password do not match');
  });

  test('flujo completo de compra con beforeEach', { tag: '@regression' }, async () => {
    // login
    await loginPage.goto('/');
    await loginPage.login('standard_user', 'secret_sauce');

    // inventario
    await inventoryPage.expectItemCount(6);
    await inventoryPage.addFirstItemToCart();
    await inventoryPage.expectCartBadge('1');

    // carrito
    await inventoryPage.openCart();
    await cartPage.expectItemCount(1);
    await cartPage.proceedToCheckout();

    // checkout
    await checkoutPage.fillCustomerData('Juan', 'QA', '15001');
    await checkoutPage.finishPurchase();
    await checkoutPage.expectOrderComplete();
  });

  // aunque este test no usa cartPage ni checkoutPage, beforeEach igual las instanció
  test('verificar título sin usar todas las pages', { tag: '@smoke' }, async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('Swag Labs');
  });
});
