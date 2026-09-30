// Clase 5 — B6: POM con capas separadas (Locators + Actions)
// Variante del flujo completo de 01-pom-basico.spec.ts, pero dividiendo responsabilidades:
//   pages/locators/  → solo getters de locators, sin lógica
//   pages/actions/    → extiende los locators y agrega las interacciones/acciones de negocio
//   este spec         → solo llama a las Actions, nunca toca un locator directamente
// Ejecutar: npx playwright test tests/clase-05/06-pom-locators-actions.spec.ts --headed

import { test, expect } from '@playwright/test';
import { LoginActions } from '../../pages/actions/LoginActions';
import { InventoryActions } from '../../pages/actions/InventoryActions';
import { CartActions } from '../../pages/actions/CartActions';
import { CheckoutActions } from '../../pages/actions/CheckoutActions';

test('flujo completo de compra con Locators + Actions', { tag: '@regression' }, async ({ page }) => {
  const loginPage     = new LoginActions(page);
  const inventoryPage = new InventoryActions(page);
  const cartPage      = new CartActions(page);
  const checkoutPage  = new CheckoutActions(page);

  // login
  await loginPage.goto('/');
  await loginPage.login('standard_user', 'secret_sauce');
  await expect(page).toHaveURL(/inventory/);

  // inventario
  await inventoryPage.addFirstItemToCart();
  await inventoryPage.expectCartBadge('1');

  // carrito
  await inventoryPage.openCart();
  await cartPage.proceedToCheckout();

  // checkout
  await checkoutPage.fillCustomerData('Juan', 'QA', '15001');
  await checkoutPage.finishPurchase();
  await checkoutPage.expectOrderComplete();
});
