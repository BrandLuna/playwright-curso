import { test } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { InventoryPage } from './pages/InventoryPage';
import { CartPage } from './pages/CartPage';

test('checkout flow sin fixture', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);

  await loginPage.login('standard_user', 'secret_sauce');
  await inventoryPage.addBackpackAndGoToCart();
  await cartPage.checkout();
});