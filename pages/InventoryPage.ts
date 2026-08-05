import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get title()          { return this.page.locator('.title'); }
  get items()          { return this.page.locator('.inventory_item'); }
  get addButtons()     { return this.page.locator('.btn_inventory'); }
  get cartBadge()      { return this.page.locator('.shopping_cart_badge'); }
  get cartLink()       { return this.page.locator('.shopping_cart_link'); }
  get sortDropdown()   { return this.page.locator('.product_sort_container'); }

  async addFirstItemToCart() {
    await this.addButtons.first().click();
  }

  async addItemByIndex(index: number) {
    await this.addButtons.nth(index).click();
  }

  async openCart() {
    await this.cartLink.click();
  }

  async sortBy(option: string) {
    await this.sortDropdown.selectOption(option);
  }

  async expectItemCount(count: number) {
    await expect(this.items).toHaveCount(count);
  }

  async expectCartBadge(count: string) {
    await expect(this.cartBadge).toHaveText(count);
  }
}
