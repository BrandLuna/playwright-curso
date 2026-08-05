import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // locators como getters — se re-evalúan en cada llamada
  get usernameInput() { return this.page.getByPlaceholder('Username'); }
  get passwordInput() { return this.page.getByPlaceholder('Password'); }
  get loginButton()   { return this.page.getByRole('button', { name: 'Login' }); }
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
