import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get cartItems()      { return this.page.locator('.cart_item'); }
  get checkoutButton() { return this.page.locator('[data-test="checkout"]'); }
  get continueButton() { return this.page.getByRole('button', { name: 'Continue Shopping' }); }
  // botones "Remove" tienen data-test="remove-<slug-del-producto>"
  get removeButtons()  { return this.page.locator('[data-test^="remove"]'); }

  async removeFirstItem() {
    await this.removeButtons.first().click();
  }

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
