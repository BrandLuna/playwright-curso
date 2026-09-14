// ============================================================
// ENFOQUE SIN WORLD - Solo para comparar con flujo-de-compra.steps.ts
// ============================================================
// Aquí se usan variables "let" a nivel de módulo en lugar del CustomWorld.
// PROBLEMA: no escala — con 2+ escenarios @Simple, TODOS comparten el mismo
// browser/page en vez de tener uno propio cada uno (ver los 2 escenarios del
// .feature). Si esos escenarios corrieran al mismo tiempo, se pisarían entre sí.
// SOLUCIÓN correcta: usar CustomWorld (ver flujo-de-compra.steps.ts)
// ============================================================

import { Given, When, Then, Before, After } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, chromium } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';

// Variables globales del módulo — estado compartido entre todos los escenarios @Simple
let browser: Browser;         // instancia del navegador
let context: BrowserContext;  // sesion aislada (cookies/storage) dentro del navegador
let page: Page;                // pestaña donde se ejecutan las acciones
let loginPage: LoginPage;      // Page Object de login, atado a "page"
let inventoryPage: InventoryPage; // Page Object de inventario, atado a "page"
let cartPage: CartPage;        // Page Object de carrito, atado a "page"

// Solo aplica a escenarios con tag @Simple
Before({ tags: '@Simple' }, async () => {
  browser = await chromium.launch();        // Playwright como libreria: nadie mas hace esto por vos (a diferencia de @playwright/test)
  context = await browser.newContext();     // crea el contexto/sesion manualmente
  page = await context.newPage();           // crea la pestaña manualmente
  loginPage = new LoginPage(page);          // instancia el Page Object con esa page
  inventoryPage = new InventoryPage(page);  // idem, reutiliza la misma page
  cartPage = new CartPage(page);            // idem, reutiliza la misma page
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
