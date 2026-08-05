import { defineConfig, devices } from '@playwright/test';

/**
 * ============================================================
 * CLASE 1 — playwright.config.ts
 * Configuración principal del proyecto Playwright
 * ============================================================
 *
 * Este archivo controla cómo se ejecutan todos los tests.
 * No necesitas tocarlo por ahora — en la Clase 4 lo personalizaremos.
 *
 * Documentación oficial: https://playwright.dev/docs/test-configuration
 */

export default defineConfig({
  // Carpeta donde Playwright busca los archivos de tests (*.spec.ts)
  testDir: './tests',

  // Ejecuta los tests dentro de cada archivo en paralelo
  // → más rápido, pero requiere que los tests sean independientes entre sí
  fullyParallel: true,

  // En CI: falla si alguien olvidó un test.only() — evita subir código con tests filtrados
  forbidOnly: !!process.env.CI,

  // Reintentos automáticos: 2 en CI (para evitar falsos negativos), 0 en local
  // → En la Clase 4 veremos por qué esto importa en GitHub Actions
  retries: process.env.CI ? 2 : 0,

  // En CI usa 1 worker (ejecución secuencial) para mayor estabilidad
  workers: process.env.CI ? 1 : undefined,

  // Formato del reporte de resultados
  // 'html' genera un reporte visual que se abre con: npx playwright show-report
  reporter: 'html',

  // Configuración compartida para todos los navegadores/proyectos
  use: {
    // URL base de la aplicación — en la Clase 5 (Environments) lo usaremos
    // Cuando esté configurado, puedes usar page.goto('/') en vez de la URL completa
    // baseURL: 'https://www.saucedemo.com',

    // Trace: graba una grabación detallada del test para depuración
    // 'on-first-retry' → solo graba cuando un test falla y se reintenta
    // Para ver el trace: npx playwright show-trace trace.zip
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
