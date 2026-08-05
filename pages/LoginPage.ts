import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // data-test es el locator más estable en saucedemo
  get usernameInput() { return this.page.locator('[data-test="username"]'); }
  get passwordInput() { return this.page.locator('[data-test="password"]'); }
  get loginButton()   { return this.page.locator('[data-test="login-button"]'); }
  get errorMessage()  { return this.page.locator('[data-test="error"]'); }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async expectLoginError(text: string) {
    await expect(this.errorMessage).toContainText(text);
  }
}
