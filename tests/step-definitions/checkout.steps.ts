import { Given, When, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../utils/world';

Given('el usuario navega a la pagina de SauceDemo', async function (this: CustomWorld) {
  await this.page.goto('https://www.saucedemo.com/');
});

When('inicia sesion con usuario {string} y contrasena {string}', async function (this: CustomWorld, username: string, password: string) {
  await this.loginPage.login(username, password);
});

When('agrega el backpack al carrito y va al carrito', async function (this: CustomWorld) {
  await this.inventoryPage.addBackpackAndGoToCart();
});

Then('el usuario procede al checkout', async function (this: CustomWorld) {
  await this.cartPage.checkout();
});
