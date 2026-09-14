import { Page, expect } from '@playwright/test';

// Clase base con métodos de utilidad comunes — todas las pages la heredan
export class BasePage {
  constructor(protected page: Page) {}

  async goto(path: string) {
    await this.page.goto(path);
  }

  async waitForURL(pattern: string | RegExp) {
    await this.page.waitForURL(pattern);
  }

  async getTitle() {
    return this.page.title();
  }

  async expectURL(pattern: string | RegExp) {
    await expect(this.page).toHaveURL(pattern);
  }

  async takeScreenshot(name: string) {
    await this.page.screenshot({ path: `evidencias/${name}.png` });
  }

  // banner de error data-test="error" — presente tanto en Login como en Checkout step-one
  get errorMessage() {
    return this.page.locator('[data-test="error"]');
  }

  async expectErrorMessage(text: string) {
    await expect(this.errorMessage).toContainText(text);
  }
}
