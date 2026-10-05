// Clase 6 — steps de checkout: entrar al checkout, llenar datos, finalizar compra.
import { When, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';

Then('el usuario procede al checkout', async function (this: CustomWorld) {
  await this.cartPage.checkout();
});

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
