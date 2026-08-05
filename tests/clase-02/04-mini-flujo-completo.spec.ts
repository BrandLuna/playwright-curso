// Clase 2 — B5: Mini flujo completo — Formulario de práctica
// App: https://demoqa.com/text-box (formulario simple para cerrar la clase)
// Ejecutar: npx playwright test tests/clase-02/04-mini-flujo-completo.spec.ts --headed

import { test, expect } from '@playwright/test';

// ─── FLUJO COMPLETO: Text Box Form ───────────────────────────────────────────
// Este test combina todo lo visto en clase:
// locators modernos + interacciones + assertions

test('completar y enviar formulario de text-box', async ({ page }) => {
  await page.goto('https://demoqa.com/text-box');

  // — Completar campos —
  // demoqa no asocia labels con for correctamente, usamos #id
  await page.locator('#userName').fill('Juan Pérez');
  await page.locator('#userEmail').fill('juan@ejemplo.com');
  await page.locator('#currentAddress').fill('Av. Principal 123, Lima');
  await page.locator('#permanentAddress').fill('Calle Secundaria 456, Lima');

  // — Enviar el formulario —
  await page.getByRole('button', { name: 'Submit' }).click();

  // — Verificar que el output aparece con los datos enviados —
  // el formulario muestra los datos debajo del botón al enviarse
  await expect(page.locator('#output')).toBeVisible();
  await expect(page.locator('#name')).toContainText('Juan Pérez');
  await expect(page.locator('#email')).toContainText('juan@ejemplo.com');
});

// ─── PRÁCTICA: Automation Practice Form ──────────────────────────────────────
// Este es el ejercicio avanzado — el formulario completo de demoqa
// URL: https://demoqa.com/automation-practice-form
//
// Pasos para hacerlo con Codegen:
//   1. npx playwright codegen https://demoqa.com/automation-practice-form
//   2. Completa: nombre, apellido, email, género, teléfono
//   3. Copia el código generado aquí abajo
//   4. Mejora los locators usando getByLabel, getByRole, etc.
//
// test('formulario completo de práctica', async ({ page }) => {
//   await page.goto('https://demoqa.com/automation-practice-form');
//
//   await page.getByPlaceholder('First Name').fill('Juan');
//   await page.getByPlaceholder('Last Name').fill('Pérez');
//   await page.getByPlaceholder('name@example.com').fill('juan@ejemplo.com');
//   await page.getByLabel('Male').check();
//   await page.getByPlaceholder('Mobile Number').fill('987654321');
//
//   await page.getByRole('button', { name: 'Submit' }).click();
//
//   // el modal de confirmación debe aparecer
//   await expect(page.getByRole('dialog')).toBeVisible();
//   await expect(page.locator('#example-modal-sizes-title-lg')).toHaveText('Thanks for submitting the form');
// });
