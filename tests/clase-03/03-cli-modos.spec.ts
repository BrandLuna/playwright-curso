// Clase 3 — B3: Ejecución por suite y scripts
// --headed, --ui, --debug y --project los viste en clase-01 y clase-02.
// Aquí practicamos lo nuevo de esta clase: filtrar por tag y scripts en package.json.
//
// Comandos nuevos:
//   npx playwright test --grep @smoke          → solo tests @smoke
//   npx playwright test --grep @regression     → solo tests @regression
//   npx playwright test --grep-invert @slow    → excluir tests con ese tag
//   npx playwright test --workers=1            → en serie (útil en CI)
//   npm run test:smoke                         → atajo de package.json
//   npm run test:regression

import { test, expect } from '@playwright/test';

test('headless produce el mismo resultado que headed', { tag: '@smoke' }, async ({ page }) => {
  await page.goto('https://www.saucedemo.com');
  await expect(page).toHaveTitle('Swag Labs');
  await expect(page.getByPlaceholder('Username')).toBeVisible();
});

// test.slow() — triplica el timeout cuando se espera que una operación sea lenta
test('test marcado como slow', { tag: '@regression' }, async ({ page }) => {
  test.slow();
  await page.goto('https://www.saucedemo.com');
  await expect(page).toHaveTitle('Swag Labs');
});

// EJERCICIO: ejecuta y observa la diferencia:
//   npx playwright test tests/clase-03/ --grep @smoke
//   npm run test:smoke
//   npx playwright test tests/clase-03/ --workers=1
