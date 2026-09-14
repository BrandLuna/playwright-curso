import { Given, When, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';

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

// --- Login -------------------------------------------------------------

Then('deberia ver el mensaje de error {string}', async function (this: CustomWorld, mensaje: string) {
  // el banner de error usa el mismo data-test="error" en Login y en Checkout step-one
  await this.loginPage.expectErrorMessage(mensaje);
});

// --- Inventario y carrito ------------------------------------------------

When('agrega {int} productos al carrito', async function (this: CustomWorld, cantidad: number) {
  await this.inventoryPage.addItemsToCart(cantidad);
});

Then('el contador del carrito debe mostrar {string}', async function (this: CustomWorld, cantidad: string) {
  await this.inventoryPage.expectCartBadge(cantidad);
});

When('quita el primer producto del carrito', async function (this: CustomWorld) {
  await this.cartPage.removeFirstItem();
});

Then('el carrito debe tener {int} productos', async function (this: CustomWorld, cantidad: number) {
  await this.cartPage.expectItemCount(cantidad);
});

When('ordena los productos por {string}', async function (this: CustomWorld, opcion: string) {
  await this.inventoryPage.sortBy(opcion);
});

Then('el primer producto listado debe ser el mas barato', async function (this: CustomWorld) {
  await this.inventoryPage.expectFirstItemPriceIsLowest();
});

// --- Checkout completo -----------------------------------------------------

When('completa sus datos con nombre {string}, apellido {string} y codigo postal {string}',
  async function (this: CustomWorld, nombre: string, apellido: string, codigoPostal: string) {
    await this.checkoutPage.fillCustomerData(nombre, apellido, codigoPostal);
  }
);

When('finaliza la compra', async function (this: CustomWorld) {
  await this.checkoutPage.finishPurchase();
});

Then('deberia ver el mensaje de confirmacion del pedido', async function (this: CustomWorld) {
  await this.checkoutPage.expectOrderComplete();
});

When('intenta continuar sin completar sus datos', async function (this: CustomWorld) {
  await this.checkoutPage.continueWithoutData();
});
