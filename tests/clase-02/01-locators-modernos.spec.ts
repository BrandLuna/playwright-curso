// Clase 2 — B2: Locators modernos de Playwright
// App: https://demoqa.com
// Ejecutar: npx playwright test tests/clase-02/01-locators-modernos.spec.ts --headed

import { test, expect } from '@playwright/test';

// ─── getByRole ────────────────────────────────────────────────────────────────
// El locator más importante — busca por rol semántico (button, link, heading...)
test.describe('getByRole', () => {
  test('botón por rol y nombre', async ({ page }) => {
    await page.goto('https://demoqa.com/buttons');
    // exact: true exige que el texto sea exactamente ese
    await expect(page.getByRole('button', { name: 'Click Me', exact: true })).toBeVisible();
  });
  //h1
  test('heading por rol', async ({ page }) => {
    await page.goto('https://demoqa.com/text-box');
    await expect(page.getByRole('heading', { name: 'Text Box' })).toBeVisible();
  });
});

// ─── getByLabel ───────────────────────────────────────────────────────────────
// Para inputs que tienen un <label> con atributo for correctamente asociado
// demoqa usa labels pero sus IDs no siguen la convención estándar — usamos placeholder
test.describe('getByLabel', () => {
  test('input por su label visible', async ({ page }) => {
    await page.goto('https://demoqa.com/text-box');
    // cuando getByLabel no encuentra el input (label sin for correcto), usa getByPlaceholder
    await expect(page.getByPlaceholder('Full Name')).toBeVisible();
    await expect(page.getByPlaceholder('name@example.com')).toBeVisible();
  });
});

// ─── getByPlaceholder ─────────────────────────────────────────────────────────
// Para inputs donde el placeholder es más descriptivo que el label
test.describe('getByPlaceholder', () => {
  test('input por su placeholder', async ({ page }) => {
    await page.goto('https://demoqa.com/text-box');
    await expect(page.getByPlaceholder('Full Name')).toBeVisible();
    await expect(page.getByPlaceholder('name@example.com')).toBeVisible();
  });
});

// ─── getByText ────────────────────────────────────────────────────────────────
// Para cualquier elemento que contenga un texto visible en la pantalla
test.describe('getByText', () => {
  test('elemento por texto exacto', async ({ page }) => {
    await page.goto('https://demoqa.com/elements');
    await expect(page.getByText('Text Box')).toBeVisible();
  });

  test('elemento por texto parcial', async ({ page }) => {
    await page.goto('https://demoqa.com/elements');
    // exact: false busca que el texto CONTENGA la cadena
    await expect(page.getByText('Check', { exact: false })).toBeVisible();
  });
});

// ─── getByTestId ──────────────────────────────────────────────────────────────
// El más estable — busca por data-testid, atributo que el equipo pone para tests
// demoqa no usa data-testid, pero así lo usarías cuando tu app sí lo tenga:
// await page.getByTestId('submit-button').click();

// ─── Encadenamiento ───────────────────────────────────────────────────────────
// Puedes combinar locators para ser más preciso dentro de un contenedor
test('locator encadenado — buscar dentro de un contenedor', async ({ page }) => {
  await page.goto('https://demoqa.com/text-box');
  // busca el botón Submit solo dentro del formulario, no en toda la página
  const form = page.locator('#userForm');
  await expect(form.getByRole('button', { name: 'Submit' })).toBeVisible();
});

// EJERCICIO: ve a demoqa.com/radio-button y encuentra los radio buttons
// ¿Cuál locator usarías para cada uno?
