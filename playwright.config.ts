import { defineConfig, devices } from '@playwright/test';

/**
 * CLASE 1 — Configuración principal del proyecto Playwright.
 * Documentación oficial: https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // Carpeta donde Playwright busca los archivos .spec.ts
  testDir: './tests',

  // Ejecuta los tests del archivo en paralelo
  fullyParallel: true,

  // En CI falla si alguien dejó un test.only()
  forbidOnly: !!process.env.CI,

  // Reintentos automáticos: 2 en CI, 0 en local
  retries: process.env.CI ? 2 : 0,

  // En CI usa un solo worker para mayor estabilidad
  workers: process.env.CI ? 1 : undefined,

  // Reporte HTML: se abre con npx playwright show-report
  reporter: 'html',

  // Configuración compartida para todos los navegadores
  use: {
    // baseURL permite usar page.goto('/') en vez de la URL completa
    // baseURL: 'https://www.saucedemo.com',

    // Guarda trace cuando un test falla y se reintenta
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
