import { expect } from '@playwright/test';
import { InventoryLocators } from '../locators/InventoryLocators';

export class InventoryActions extends InventoryLocators {
  async addFirstItemToCart() {
    await this.addButtons.first().click();
  }

  async addItemByIndex(index: number) {
    await this.addButtons.nth(index).click();
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
    await this.sortDropdown.selectOption(option);
  }

  async expectItemCount(count: number) {
    await expect(this.items).toHaveCount(count);
  }

  async expectCartBadge(count: string) {
    await expect(this.cartBadge).toHaveText(count);
  }
}
