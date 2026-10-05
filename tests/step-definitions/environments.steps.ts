// Clase 6 — equivalente BDD de tests/clase-05/04-environments.spec.ts
// El Given "el usuario navega a la pagina de SauceDemo" de este feature vive en
// flujo-de-compra.steps.ts — prueba de que un .feature puede combinar steps de
// cualquier archivo .steps.ts, no solo el que comparte su nombre.
import { When, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';

// process.env lee las variables de .env cargado en tests/support/world.ts
// NOTA: no uses USERNAME — es variable reservada de Windows
const USERNAME = process.env.SAUCEDEMO_USERNAME ?? 'standard_user';
const PASSWORD = process.env.SAUCEDEMO_PASSWORD ?? 'secret_sauce';

When('inicia sesion con las credenciales del entorno', async function (this: CustomWorld) {
  await this.loginPage.login(USERNAME, PASSWORD);
});

Then('deberia ver el inventario con {int} productos', async function (this: CustomWorld, cantidad: number) {
  await this.inventoryPage.expectItemCount(cantidad);
});
