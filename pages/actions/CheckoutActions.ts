import { expect } from '@playwright/test';
import { CheckoutLocators } from '../locators/CheckoutLocators';

export class CheckoutActions extends CheckoutLocators {
  async fillCustomerData(firstName: string, lastName: string, postalCode: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
    await this.continueButton.click();
  }

  async finishPurchase() {
    await this.finishButton.click();
  }

  async expectOrderComplete() {
    await expect(this.confirmationMsg).toBeVisible();
  }
}
