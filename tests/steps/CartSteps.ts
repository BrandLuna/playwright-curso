import { Page } from '@playwright/test';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';

export class CartSteps {
  private inventoryPage: InventoryPage;
  private cartPage: CartPage;

  constructor(page: Page) {
    this.inventoryPage = new InventoryPage(page);
    this.cartPage = new CartPage(page);
  }

  async addBackpackAndGoToCart() {
    await this.inventoryPage.addBackpackButton.click();
    await this.inventoryPage.shoppingCartLink.click();
  }

  async checkout() {
    await this.cartPage.checkoutButton.click();
  }
}
