// Clase 5 — B3: POM con fixtures — evita "const x = new XPage(page)" en cada test
// Mismo flujo que 01-pom-basico.spec.ts, refactorizado para recibir las pages ya listas.
// Compara con 02-pom-beforeeach.spec.ts: aquí las pages solo se crean si el test las pide.
// Ejecutar: npx playwright test tests/clase-05/03-pom-fixtures.spec.ts --headed

import { test, expect } from '../utils/fixtures/pages.fixture';

test.describe('Flujo de compra con POM + fixtures', () => {
  // las fixtures son "lazy": solo se instancian si el test las pide como parámetro
  test('login exitoso con fixture', { tag: '@smoke' }, async ({ page, loginPage }) => {
    await loginPage.goto('/');
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory/);
  });

  test('login fallido con fixture', { tag: '@smoke' }, async ({ loginPage }) => {
    await loginPage.goto('/');
    await loginPage.login('usuario_invalido', 'pass_incorrecta');
    await loginPage.expectLoginError('Username and password do not match');
  });

  test('flujo completo de compra con fixtures', { tag: '@regression' }, async ({
    loginPage,
    inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
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

  // este test no declara ninguna page en sus parámetros — Playwright nunca
  // ejecuta loginPage/inventoryPage/etc., solo crea el "page" base que sí se usa
  test('verificar título sin usar ninguna page object', { tag: '@smoke' }, async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('Swag Labs');
  });
});
