import { expect } from '@playwright/test';
import { CartLocators } from '../locators/CartLocators';

export class CartActions extends CartLocators {
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
