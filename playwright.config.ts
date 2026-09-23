import { defineConfig, devices } from '@playwright/test';

/**
 * CLASE 1 — Configuración principal del proyecto Playwright.
 * Documentación oficial: https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // Carpeta donde Playwright busca los archivos .spec.ts
  testDir: './tests',

  // true: archivos y tests pueden ejecutarse en paralelo
  // false: los tests de cada archivo se ejecutan en orden
  fullyParallel: true,

  // Tiempo máximo permitido para cada test
  timeout: 30_000,

  // Tiempo máximo de espera para las assertions de expect
  expect: {
    timeout: 5_000,
  },

  // En CI falla si alguien dejó un test.only()
  forbidOnly: !!process.env.CI,

  // Reintentos automáticos: 2 en CI, 0 en local
  retries: process.env.CI ? 2 : 0,

  // Procesos paralelos: 1 ejecuta en serie; también acepta '50%'
  // CLI puede sobrescribirlo: npx playwright test --workers=2
  workers: process.env.CI ? 1 : undefined,

  // Filtros opcionales equivalentes a --grep y --grep-invert
  // grep: /@smoke/,
  // grepInvert: /@slow/,

  // Detiene la ejecución después de cierta cantidad de fallos
  // maxFailures: process.env.CI ? 1 : undefined,

  // Reporte HTML: se abre con npx playwright show-report
  reporter: 'html',

  // Configuración compartida para todos los navegadores
  use: {
    // true: sin ventana; false: muestra el navegador (equivale a --headed)
    headless: true,

    // baseURL permite usar page.goto('/') en vez de la URL completa
    // baseURL: 'https://www.saucedemo.com',

    // Guarda trace cuando un test falla y se reintenta
    trace: 'on-first-retry',

    // Evidencias opcionales para investigar fallos
    // screenshot: 'only-on-failure',
    // video: 'retain-on-failure',
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
