import { Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

export class LoginSteps {
  private loginPage: LoginPage;

  constructor(page: Page) {
    this.loginPage = new LoginPage(page);
  }

  async login(username: string, password: string) {
    await this.loginPage.usernameInput.fill(username);
    await this.loginPage.passwordInput.fill(password);
    await this.loginPage.loginButton.click();
  }
}
