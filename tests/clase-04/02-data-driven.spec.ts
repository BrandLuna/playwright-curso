// Clase 4 — B1: Data-driven testing con JSON y CSV
// Ejecutar: npx playwright test tests/clase-04/02-data-driven.spec.ts --headed

import { test, expect } from '@playwright/test';
import { parse } from 'csv-parse/sync';
import * as fs from 'fs';
import * as path from 'path';

// ─── Data-driven con JSON ─────────────────────────────────────────────────────
// Importamos los datos directamente — TypeScript los tipea automáticamente
import usuarios from '../data/usuarios.json';

// for...of genera un test por cada fila del JSON
for (const { usuario, password, esperado } of usuarios) {
  test(`login ${esperado} — usuario: ${usuario}`, { tag: '@regression' }, async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
    await page.getByPlaceholder('Username').fill(usuario);
    await page.getByPlaceholder('Password').fill(password);
    await page.getByRole('button', { name: 'Login' }).click();

    if (esperado === 'exitoso') {
      await expect(page).toHaveURL(/inventory/);
    } else {
      // bloqueado e inválido muestran el mismo mensaje de error
      await expect(page.locator('[data-test="error"]')).toBeVisible();
    }
  });
}

// ─── Data-driven con CSV ──────────────────────────────────────────────────────
// csv-parse lee el archivo y lo convierte en un array de objetos
const csvPath = path.join(__dirname, '../data/productos.csv');
const csvData = fs.readFileSync(csvPath, 'utf-8');
const productos = parse(csvData, { columns: true, skip_empty_lines: true }) as Array<{
  nombre: string;
  precio_esperado: string;
}>;

for (const { nombre, precio_esperado } of productos) {
  test(`precio de "${nombre}" es $${precio_esperado}`, { tag: '@regression' }, async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();

    // buscar el precio del producto por su nombre en el inventario
    const item = page.locator('.inventory_item').filter({ hasText: nombre });
    await expect(item.locator('.inventory_item_price')).toHaveText(`$${precio_esperado}`);
  });
}
