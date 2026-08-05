// World es la clase base de Cucumber que representa el contexto de un escenario.
// Cucumber crea una instancia nueva de esta clase por cada escenario que corre,
// por eso el estado (browser, page, etc.) nunca se mezcla entre escenarios.
import { World, setWorldConstructor } from '@cucumber/cucumber';

// Importamos solo lo que necesitamos de Playwright para lanzar el browser manualmente.
// Con Cucumber no hay playwright.config.ts, nosotros controlamos todo.
import { Browser, BrowserContext, Page, chromium, firefox, webkit } from '@playwright/test';

// Importamos nuestras páginas POM para usarlas en los steps
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';

// Extendemos World para agregar nuestras propias propiedades.
// El "!" le dice a TypeScript "confía en mí, esto se va a inicializar antes de usarse"
// (en el método init del Before hook).
export class CustomWorld extends World {
  browser!: Browser;         // instancia del browser (Chromium, Firefox, etc.)
  context!: BrowserContext;  // contexto del browser (como una sesión aislada)
  page!: Page;               // pestaña/tab donde se ejecutan las acciones

  loginPage!: LoginPage;
  inventoryPage!: InventoryPage;
  cartPage!: CartPage;

  // Se llama en el Before hook antes de cada escenario.
  // Aquí arrancamos el browser y creamos las páginas POM.
  async init() {
    this.browser = await chromium.launch();
    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();
    // Le pasamos "page" a cada POM para que puedan interactuar con el browser
    this.loginPage = new LoginPage(this.page);
    this.inventoryPage = new InventoryPage(this.page);
    this.cartPage = new CartPage(this.page);
  }

  // Se llama en el After hook después de cada escenario.
  // Cerramos el browser para liberar memoria.
  async destroy() {
    await this.browser.close();
  }
}

// Le decimos a Cucumber: "cuando necesites crear un World, usa esta clase".
// Sin esto, Cucumber usaría su World base y no tendría nuestras propiedades.
setWorldConstructor(CustomWorld);
