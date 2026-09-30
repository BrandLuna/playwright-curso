import { Page, expect } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async goto(path: string) {
    await this.page.goto(path);
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
