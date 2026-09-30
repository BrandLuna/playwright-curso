import { Page } from '@playwright/test';

export class CartLocators {
  constructor(protected page: Page) {}

  get cartItems()      { return this.page.locator('.cart_item'); }
  get checkoutButton() { return this.page.locator('[data-test="checkout"]'); }
  get continueButton() { return this.page.getByRole('button', { name: 'Continue Shopping' }); }
}
