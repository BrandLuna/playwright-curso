// Clase 3 — B3: Modos de ejecución y CLI
// Este archivo es demostrativo — los comandos CLI se practican en la terminal

import { test, expect } from '@playwright/test';

// ─── Headless vs Headed ───────────────────────────────────────────────────────
// Headless (por defecto): npx playwright test
// Headed (con navegador):  npx playwright test --headed
// UI Mode (interactivo):   npx playwright test --ui
// Debug paso a paso:       npx playwright test --debug

// ─── Test para practicar modos de ejecución ───────────────────────────────────
// Corre este archivo con distintos flags y observa la diferencia:
//
//   npx playwright test tests/clase-03/03-cli-modos.spec.ts
//   npx playwright test tests/clase-03/03-cli-modos.spec.ts --headed
//   npx playwright test tests/clase-03/03-cli-modos.spec.ts --ui
//   npx playwright test tests/clase-03/03-cli-modos.spec.ts --debug
//   npx playwright test tests/clase-03/03-cli-modos.spec.ts --project=firefox

test('verificar que el modo headless y headed producen el mismo resultado', { tag: '@smoke' }, async ({ page }) => {
  await page.goto('https://www.saucedemo.com');
  // este test funciona igual en headless y headed — el resultado no cambia
  await expect(page).toHaveTitle('Swag Labs');
  await expect(page.getByPlaceholder('Username')).toBeVisible();
});

// ─── test.slow() — marcar un test como lento ─────────────────────────────────
// Triplica el timeout del test cuando se sabe que una operación es lenta
test('test marcado como slow', { tag: '@regression' }, async ({ page }) => {
  test.slow(); // el timeout pasa de 30s a 90s automáticamente
  await page.goto('https://www.saucedemo.com');
  await expect(page).toHaveTitle('Swag Labs');
});

// ─── Scripts disponibles en package.json ─────────────────────────────────────
// npm test                  → todos los tests
// npm run test:smoke        → npx playwright test --grep @smoke
// npm run test:regression   → npx playwright test --grep @regression
// npm run test:headed       → npx playwright test --headed
// npm run test:report       → npx playwright show-report
