import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get cartItems()      { return this.page.locator('.cart_item'); }
  get checkoutButton() { return this.page.locator('[data-test="checkout"]'); }
  get continueButton() { return this.page.getByRole('button', { name: 'Continue Shopping' }); }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  // alias semántico usado en step-definitions de BDD
  async checkout() {
    await this.checkoutButton.click();
  }

  async expectItemCount(count: number) {
    await expect(this.cartItems).toHaveCount(count);
  }
}
