import { test } from './fixtures';

test('checkout flow con POM', async ({ page, loginPage, inventoryPage, cartPage }) => {
  await page.goto('https://www.saucedemo.com/');
  await loginPage.login('standard_user', 'secret_sauce');
  await inventoryPage.addBackpackAndGoToCart();
  await cartPage.checkout();
});