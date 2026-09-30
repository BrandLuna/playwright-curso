import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// carga .env antes de leer process.env — necesario para environments (Clase 5)
dotenv.config();

// timestamp para que cada ejecución conserve su propio reporte HTML (Clase 4)
const reportTimestamp = new Date().toISOString().replace(/[:.]/g, '-');

/**
 * CLASE 3 + CLASE 4 + CLASE 5 — timeouts, evidencias, reportes y variables de entorno.
 * Documentación oficial: https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // Carpeta donde Playwright busca los archivos .spec.ts
  testDir: './tests',

  // Ejecuta los tests del archivo en paralelo
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

  // En CI usa un solo worker para mayor estabilidad
  workers: process.env.CI ? 1 : undefined,

  // Cada ejecución conserva su reporte HTML en una carpeta fechada + Allure
  reporter: [
    ['html', { outputFolder: `playwright-report/${reportTimestamp}`, open: 'never' }],
    ['allure-playwright'],
  ],

  // Configuración compartida para todos los navegadores
  use: {
    // Ejecuta sin mostrar la ventana del navegador por defecto
    headless: true,

    // baseURL desde .env — permite usar page.goto('/') en los tests
    baseURL: process.env.BASE_URL ?? 'https://www.saucedemo.com',

    // Guarda trace cuando un test falla y se reintenta
    trace: 'on-first-retry',

    // Captura automática solo cuando el test falla
    screenshot: 'only-on-failure',

    // Video: graba siempre pero solo guarda si el test falla
    video: 'retain-on-failure',
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
