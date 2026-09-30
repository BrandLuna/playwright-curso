import { Page } from '@playwright/test';

// solo locators — sin lógica de interacción ni assertions
export class LoginLocators {
  constructor(protected page: Page) {}

  get usernameInput() { return this.page.locator('[data-test="username"]'); }
  get passwordInput() { return this.page.locator('[data-test="password"]'); }
  get loginButton()   { return this.page.locator('[data-test="login-button"]'); }
  get errorMessage()  { return this.page.locator('[data-test="error"]'); }
}
