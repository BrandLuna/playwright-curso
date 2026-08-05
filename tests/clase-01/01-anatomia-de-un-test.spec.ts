// Clase 1 — B3: Anatomía de un test
// Ejecutar: npx playwright test tests/clase-01/01-anatomia-de-un-test.spec.ts --headed

// test y expect son las dos funciones esenciales de Playwright
import { test, expect } from '@playwright/test';

// { page } representa una pestaña del navegador
test('la página de Playwright tiene el título correcto', async ({ page }) => {
  // navega a la URL y espera a que cargue
  await page.goto('https://playwright.dev/');

  // verifica que el título contenga "Playwright" (expresión regular)
  await expect(page).toHaveTitle(/Playwright/);
});

test('el link Get Started lleva a la página de instalación', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // getByRole: locator semántico — busca por tipo de elemento y texto visible
  await page.getByRole('link', { name: 'Get started' }).click();

  // Playwright espera automáticamente a que cargue la nueva página (auto-waiting)
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});

// EJERCICIO: cambia /Playwright/ por /XYZ/, ejecuta y observa el error en el reporte
