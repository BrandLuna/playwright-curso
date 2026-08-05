// Clase 5 — B1: Page Object Model con saucedemo.com
// Mismo flujo de clase-03/04-flujo-e2e.spec.ts pero refactorizado con POM.
// Compara ambos archivos para ver la diferencia.
// Ejecutar: npx playwright test tests/clase-05/01-pom-basico.spec.ts --headed

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';

// el baseURL viene de .env — no hay URLs hardcodeadas en los tests
test.describe('Flujo de compra con POM', () => {
  test('login exitoso con POM', { tag: '@smoke' }, async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto('/');
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory/);
  });

  test('login fallido con POM', { tag: '@smoke' }, async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto('/');
    await loginPage.login('usuario_invalido', 'pass_incorrecta');
    await loginPage.expectLoginError('Username and password do not match');
  });

  test('flujo completo de compra con POM', { tag: '@regression' }, async ({ page }) => {
    const loginPage     = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage      = new CartPage(page);
    const checkoutPage  = new CheckoutPage(page);

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
});
