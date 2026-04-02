import { Before, After, AfterStep } from '@cucumber/cucumber';
import { CustomWorld } from './world';

// "not @Simple" excluye los escenarios etiquetados con @Simple,
// que tienen su propio Before/After con variables "let" (sin World).
Before({ tags: 'not @Simple' }, async function (this: CustomWorld) {
  await this.init();
});

// Se ejecuta después de CADA PASO (Given, When, Then).
// Toma un screenshot y lo adjunta al reporte HTML de Cucumber.
AfterStep({ tags: 'not @Simple' }, async function (this: CustomWorld) {
  const screenshot = await this.page.screenshot();
  await this.attach(screenshot, 'image/png');
});

// Se ejecuta UNA VEZ después de cada escenario.
// Cerramos el browser para liberar recursos.
After({ tags: 'not @Simple' }, async function (this: CustomWorld) {
  await this.destroy();
});
