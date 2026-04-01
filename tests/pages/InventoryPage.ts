import { Page } from '@playwright/test';

export class InventoryPage {
  constructor(private page: Page) {}

  // Locators
  get addBackpackButton() {
    return this.page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
  }

  get shoppingCartLink() {
    return this.page.locator('[data-test="shopping-cart-link"]');
  }

  // Actions
  async addBackpackAndGoToCart() {
    await this.addBackpackButton.click();
    await this.shoppingCartLink.click();
  }
}
