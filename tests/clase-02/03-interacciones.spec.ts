// Clase 2 — B4: Interacciones básicas
// Ejecutar: npx playwright test tests/clase-02/03-interacciones.spec.ts --headed

import { test, expect } from '@playwright/test';

// ─── Fill, clear, type ────────────────────────────────────────────────────────
test('fill y clear en inputs de texto', async ({ page }) => {
  await page.goto('https://demoqa.com/text-box');

  // fill: limpia el campo y escribe de golpe — el más usado
  await page.locator('#userName').fill('Juan Pérez');
  await expect(page.locator('#userName')).toHaveValue('Juan Pérez');

  // clear: vacía el campo sin escribir nada
  await page.locator('#userName').clear();
  await expect(page.locator('#userName')).toHaveValue('');

  // pressSequentially: escribe carácter a carácter — útil para campos con autocomplete
  await page.locator('#userName').pressSequentially('Ana García');
});

// ─── Click: simple, doble, derecho ───────────────────────────────────────────
test('tipos de click', async ({ page }) => {
  await page.goto('https://demoqa.com/buttons');

  // doble click
  await page.getByRole('button', { name: 'Double Click Me' }).dblclick();
  await expect(page.locator('#doubleClickMessage')).toBeVisible();

  // click derecho
  await page.getByRole('button', { name: 'Right Click Me' }).click({ button: 'right' });
  await expect(page.locator('#rightClickMessage')).toBeVisible();

  // click normal
  await page.getByRole('button', { name: 'Click Me', exact: true }).click();
  await expect(page.locator('#dynamicClickMessage')).toBeVisible();
});

// ─── Checkbox ─────────────────────────────────────────────────────────────────
test('marcar y desmarcar checkbox', async ({ page }) => {
  await page.goto('https://demoqa.com/checkbox');

  // el checkbox de demoqa tiene role="checkbox" y aria-label — usamos getByRole
  await page.getByRole('checkbox', { name: 'Select Home' }).check();
  await expect(page.getByRole('checkbox', { name: 'Select Home' })).toBeChecked();

  await page.getByRole('checkbox', { name: 'Select Home' }).uncheck();
  await expect(page.getByRole('checkbox', { name: 'Select Home' })).not.toBeChecked();
});

// ─── Radio buttons ────────────────────────────────────────────────────────────
test('seleccionar radio button', async ({ page }) => {
  await page.goto('https://demoqa.com/radio-button');

  await page.getByRole('radio', { name: 'Yes' }).check();
  await expect(page.getByRole('radio', { name: 'Yes' })).toBeChecked();
});

// ─── Select / Dropdown ────────────────────────────────────────────────────────
test('seleccionar opción en un select', async ({ page }) => {
  await page.goto('https://demoqa.com/select-menu');

  // selectOption por valor del atributo value
  await page.locator('#oldSelectMenu').selectOption('2');

  // selectOption por texto visible
  await page.locator('#oldSelectMenu').selectOption({ label: 'Blue' });
});

// ─── Hover ────────────────────────────────────────────────────────────────────
test('hover sobre un elemento', async ({ page }) => {
  await page.goto('https://demoqa.com/tool-tips');

  // hover simula pasar el mouse — útil para tooltips y menús desplegables
  await page.locator('#toolTipButton').hover();
  // ejecuta con --headed para ver el tooltip aparecer visualmente
  // en headless el tooltip de demoqa no es detectable por selector
  await expect(page.locator('#toolTipButton')).toBeVisible();
});

// ─── Teclado ──────────────────────────────────────────────────────────────────
test('atajos de teclado', async ({ page }) => {
  await page.goto('https://demoqa.com/text-box');

  await page.locator('#userName').fill('texto de prueba');

  // press envía una tecla o combinación de teclas
  await page.locator('#userName').press('Control+A'); // seleccionar todo
  await page.locator('#userName').press('Delete');    // borrar selección
  await expect(page.locator('#userName')).toHaveValue('');
});

// EJERCICIO: ve a demoqa.com/text-box y completa todos los campos
// usando los métodos correctos para cada tipo de input
