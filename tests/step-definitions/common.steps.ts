// Clase 6 — steps compartidos: navegacion, login y validacion de errores.
// Agrupados por dominio (no por nombre de feature) para que cualquier .feature
// los pueda reutilizar — ya lo usan flujo-de-compra.feature Y environments.feature.
import { Given, When, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';

Given('el usuario navega a la pagina de SauceDemo', async function (this: CustomWorld) {
  await this.page.goto(process.env.BASE_URL ?? 'https://www.saucedemo.com/');
});

When('inicia sesion con usuario {string} y contrasena {string}', async function (this: CustomWorld, username: string, password: string) {
  await this.loginPage.login(username, password);
});

Then('deberia ver el mensaje de error {string}', async function (this: CustomWorld, mensaje: string) {
  // el banner de error usa el mismo data-test="error" en Login y en Checkout step-one
  await this.loginPage.expectErrorMessage(mensaje);
});
