// Clase 2 — B3: XPath y CSS Selectors
// Úsalos cuando los locators modernos no son suficientes — NO son la primera opción
// Ejecutar: npx playwright test tests/clase-02/02-xpath-css.spec.ts --headed

import { test, expect } from '@playwright/test';

// ─── CSS Selectors ────────────────────────────────────────────────────────────

test.describe('CSS Selectors', () => {
  test('por ID (#)', async ({ page }) => {
    await page.goto('https://demoqa.com/text-box');
    // #id — el más directo cuando el elemento tiene ID único
    await expect(page.locator('#userName')).toBeVisible();
  });

  test('por clase (.)', async ({ page }) => {
    await page.goto('https://demoqa.com/text-box');
    // .clase — frágil, evitar si hay alternativa semántica
    await expect(page.locator('.text-center')).toBeVisible();
  });

  test('por atributo []', async ({ page }) => {
    await page.goto('https://demoqa.com/text-box');
    // [atributo="valor"] — útil cuando no hay ID ni clase estable
    await expect(page.locator('input[placeholder="Full Name"]')).toBeVisible();
  });

  test('por tipo de elemento', async ({ page }) => {
    await page.goto('https://demoqa.com/buttons');
    // filtramos visible:true porque el primer button del DOM es el navbar toggler (oculto)
    await expect(page.locator('button').filter({ visible: true }).first()).toBeVisible();
  });

  test('selector combinado', async ({ page }) => {
    await page.goto('https://demoqa.com/text-box');
    // div > input — hijo directo; div input — cualquier descendiente
    await expect(page.locator('form#userForm input#userName')).toBeVisible();
    // form > div — selecciona los div que son hijos directos del formulario
    await expect(page.locator('form#userForm > div > div > input').first()).toBeVisible();
    // #userName-wrapper > div:nth-child(2) — segundo div hijo directo
    await expect(page.locator('#userName-wrapper > div:nth-child(2)')).toBeVisible();
  });
});

// ─── XPath ────────────────────────────────────────────────────────────────────

test.describe('XPath', () => {
  test('por texto exacto', async ({ page }) => {
    await page.goto('https://demoqa.com/buttons');
    // text() busca el texto exacto del elemento
    await expect(page.locator('//button[text()="Click Me"]')).toBeVisible();
  });

  test('por texto parcial con contains()', async ({ page }) => {
    await page.goto('https://demoqa.com/elements');
    // contains() es más flexible — el texto solo necesita CONTENER la cadena
    await expect(page.locator('//span[contains(text(),"Text Box")]')).toBeVisible();
  });

  test('por atributo con @', async ({ page }) => {
    await page.goto('https://demoqa.com/text-box');
    // @atributo accede al valor de un atributo HTML
    await expect(page.locator('//input[@id="userName"]')).toBeVisible();
  });

  test('por posición con índice', async ({ page }) => {
    await page.goto('https://demoqa.com/buttons');
    // filtramos por botones visibles para evitar botones ocultos del navbar
    await expect(page.locator('(//button[@type="button" and not(@class="navbar-toggler")])[1]')).toBeVisible();
  });
});

// ─── Playwright Inspector ─────────────────────────────────────────────────────
// Para probar locators en vivo sin reejecutar el test:
//   npx playwright test tests/clase-02/02-xpath-css.spec.ts --debug
//
// En la extensión de VS Code: click en el ícono de lupa junto al test name.

// EJERCICIO: abre demoqa.com/web-tables e identifica:
// 1. El botón Add con getByRole
// 2. La primera celda de la tabla con CSS
// 3. El header "First Name" con XPath
