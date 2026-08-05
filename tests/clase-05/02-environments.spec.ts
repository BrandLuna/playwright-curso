// Clase 5 — B2: Environments y variables de entorno
// Las credenciales y la URL vienen de .env, no hardcodeadas en el test.
// Ejecutar: npx playwright test tests/clase-05/02-environments.spec.ts --headed

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';

// process.env lee las variables del archivo .env cargado en playwright.config.ts
// NOTA: no uses USERNAME — es variable reservada de Windows
const USERNAME = process.env.SAUCEDEMO_USERNAME ?? 'standard_user';
const PASSWORD = process.env.SAUCEDEMO_PASSWORD ?? 'secret_sauce';

test.describe('Tests con variables de entorno', () => {
  test('login con credenciales desde .env', { tag: '@smoke' }, async ({ page }) => {
    const loginPage = new LoginPage(page);

    // baseURL viene de .env — page.goto('/') usa process.env.BASE_URL
    await loginPage.goto('/');
    await loginPage.login(USERNAME, PASSWORD);
    await expect(page).toHaveURL(/inventory/);
  });

  test('verificar inventario con variables de entorno', { tag: '@regression' }, async ({ page }) => {
    const loginPage     = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.goto('/');
    await loginPage.login(USERNAME, PASSWORD);
    await inventoryPage.expectItemCount(6);
  });
});

// Para cambiar de ambiente sin tocar el código:
//   Edita .env con la URL y credenciales del nuevo ambiente
//   Ejecuta: npx playwright test
//
// En CI, las variables se inyectan como secrets del pipeline — el .env no se sube al repo
