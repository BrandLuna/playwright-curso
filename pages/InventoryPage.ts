import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get items()             { return this.page.locator('.inventory_item'); }
  get cartBadge()         { return this.page.locator('.shopping_cart_badge'); }
  get cartLink()          { return this.page.locator('[data-test="shopping-cart-link"]'); }
  get sortDropdown()      { return this.page.locator('[data-test="product-sort-container"]'); }
  // [data-test^="add-to-cart"] selecciona todos los botones de agregar al carrito
  get addButtons()        { return this.page.locator('[data-test^="add-to-cart"]'); }
  get addBackpackButton() { return this.page.locator('[data-test="add-to-cart-sauce-labs-backpack"]'); }
  get itemPrices()        { return this.page.locator('.inventory_item_price'); }

  async addFirstItemToCart() {
    await this.addButtons.first().click();
  }

  async addItemByIndex(index: number) {
    await this.addButtons.nth(index).click();
  }

  async addItemsToCart(count: number) {
    for (let i = 0; i < count; i++) {
      await this.addButtons.nth(i).click();
    }
  }

  async openCart() {
    await this.cartLink.click();
  }

  // método compuesto usado en step-definitions de BDD
  async addBackpackAndGoToCart() {
    await this.addBackpackButton.click();
    await this.cartLink.click();
  }

  async sortBy(option: string) {
    // option acepta el texto visible (ej. "Price (low to high)") en vez del value tecnico
    await this.sortDropdown.selectOption({ label: option });
  }

  async expectFirstItemPriceIsLowest() {
    const prices = (await this.itemPrices.allTextContents())
      .map((p) => parseFloat(p.replace('$', '')));
    const lowest = Math.min(...prices);
    expect(prices[0]).toBe(lowest);
  }

  async expectItemCount(count: number) {
    await expect(this.items).toHaveCount(count);
  }

  async expectCartBadge(count: string) {
    await expect(this.cartBadge).toHaveText(count);
  }
}
