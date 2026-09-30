import { Page } from '@playwright/test';

export class InventoryLocators {
  constructor(protected page: Page) {}

  get items()             { return this.page.locator('.inventory_item'); }
  get cartBadge()         { return this.page.locator('.shopping_cart_badge'); }
  get cartLink()          { return this.page.locator('[data-test="shopping-cart-link"]'); }
  get sortDropdown()      { return this.page.locator('[data-test="product-sort-container"]'); }
  get addButtons()        { return this.page.locator('[data-test^="add-to-cart"]'); }
  get addBackpackButton() { return this.page.locator('[data-test="add-to-cart-sauce-labs-backpack"]'); }
}
