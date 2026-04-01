import { Page } from '@playwright/test';

export class CartPage {
  constructor(private page: Page) {}

  // Locators
  get checkoutButton() {
    return this.page.locator('[data-test="checkout"]');
  }

  // Actions
  async checkout() {
    await this.checkoutButton.click();
  }
}
