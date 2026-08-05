import { test as base, Page } from '@playwright/test';

// tipo del fixture: provee una página ya autenticada
type AuthFixtures = {
  loggedInPage: Page;
};

// extiende test base con el fixture de login reutilizable
export const test = base.extend<AuthFixtures>({
  loggedInPage: async ({ page }, use) => {
    // setup: login antes del test
    await page.goto('https://www.saucedemo.com');
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForURL(/inventory/);

    // provee la página al test
    await use(page);

    // teardown: aquí podrías cerrar sesión si fuera necesario
  },
});

export { expect } from '@playwright/test';
