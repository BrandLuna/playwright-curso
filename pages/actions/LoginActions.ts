import { expect } from '@playwright/test';
import { LoginLocators } from '../locators/LoginLocators';

// extiende los locators y agrega las interacciones/acciones de negocio
export class LoginActions extends LoginLocators {
  async goto(path: string) {
    await this.page.goto(path);
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async expectLoginError(text: string) {
    await expect(this.errorMessage).toContainText(text);
  }
}
