import { Page } from '@playwright/test';

export class CheckoutLocators {
  constructor(protected page: Page) {}

  get firstNameInput()  { return this.page.getByPlaceholder('First Name'); }
  get lastNameInput()   { return this.page.getByPlaceholder('Last Name'); }
  get postalCodeInput() { return this.page.getByPlaceholder('Zip/Postal Code'); }
  get continueButton()  { return this.page.getByRole('button', { name: 'Continue' }); }
  get finishButton()    { return this.page.getByRole('button', { name: 'Finish' }); }
  get confirmationMsg() { return this.page.getByText('Thank you for your order!'); }
}
