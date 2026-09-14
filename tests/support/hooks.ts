import { Before, After, AfterStep, setDefaultTimeout } from '@cucumber/cucumber';
import { CustomWorld } from './world';

// "timeout" en cucumber.json NO existe como opcion real de Cucumber.js (se ignora en
// silencio) — el timeout por step se configura asi, con setDefaultTimeout(ms).
setDefaultTimeout(10000);

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
