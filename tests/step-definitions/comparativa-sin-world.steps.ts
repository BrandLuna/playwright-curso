// ============================================================
// ENFOQUE SIN WORLD - Solo para comparar con checkout.steps.ts
// ============================================================
// Aquí se usan variables "let" a nivel de módulo en lugar del CustomWorld.
// PROBLEMA: si Cucumber corriera escenarios en paralelo, estas variables
// serían COMPARTIDAS y los escenarios se pisarían entre sí.
// SOLUCIÓN correcta: usar CustomWorld (ver checkout.steps.ts)
// ============================================================

import { Given, When, Then, Before, After } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, chromium } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';

// Variables globales del módulo — estado compartido entre todos los escenarios @Simple
let browser: Browser;
let context: BrowserContext;
let page: Page;
let loginPage: LoginPage;
let inventoryPage: InventoryPage;
let cartPage: CartPage;

// Solo aplica a escenarios con tag @Simple
Before({ tags: '@Simple' }, async () => {
  browser = await chromium.launch();
  context = await browser.newContext();
  page = await context.newPage();
  loginPage = new LoginPage(page);
  inventoryPage = new InventoryPage(page);
  cartPage = new CartPage(page);
});

After({ tags: '@Simple' }, async () => {
  await browser.close();
});

Given('visito la pagina de SauceDemo', async () => {
  await page.goto('https://www.saucedemo.com/');
});

When('me logeo con {string} y contrasena {string}', async (username: string, password: string) => {
  await loginPage.login(username, password);
});

When('anado el backpack y voy al carrito', async () => {
  await inventoryPage.addBackpackAndGoToCart();
});

Then('hago el checkout', async () => {
  await cartPage.checkout();
});
