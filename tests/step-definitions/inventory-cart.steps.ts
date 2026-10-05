// Clase 6 — steps de inventario y carrito: agregar/quitar productos, contador, orden por precio.
import { When, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';

When('agrega el backpack al carrito y va al carrito', async function (this: CustomWorld) {
  await this.inventoryPage.addBackpackAndGoToCart();
});

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
