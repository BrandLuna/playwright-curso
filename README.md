# playwright-curso
# QA Automation con Playwright + TypeScript + Cucumber

Curso completo de automatización de pruebas — **8 clases · 3 horas cada una**

## Requisitos previos

- [Node.js LTS](https://nodejs.org) (v20 o superior)
- [Git](https://git-scm.com)
- [VS Code](https://code.visualstudio.com) + extensión **Playwright Test for VSCode**

## Configuración para esta clase

Continúas el proyecto de la Clase 5. Instala las nuevas dependencias:

```bash
# Framework BDD + runner TypeScript
npm install --save-dev @cucumber/cucumber tsx
```

Agrega a `.gitignore`:
```
cucumber-report.html
```

**Agrega scripts** a tu `package.json`:
```json
"cucumber": "node --import tsx ./node_modules/@cucumber/cucumber/bin/cucumber.js",
"cucumber:smoke": "... --tags @smoke",
"cucumber:regression": "... --tags @regression"
```

## Ejecutar los tests

```bash
# Tests Playwright (.spec.ts)
npm test
npm run test:smoke

# Tests BDD con Cucumber (.feature)
npm run cucumber                    # todos los escenarios
npm run cucumber:smoke              # solo escenarios @smoke
npm run cucumber:regression         # solo escenarios @regression
```

## Estructura del proyecto

```
playwright-curso/
├── pages/                          ← Page Objects (reutilizados por spec y steps)
│   ├── BasePage.ts
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   ├── CartPage.ts
│   └── CheckoutPage.ts
├── tests/
│   ├── clase-01/ … clase-05/       ← tests Playwright acumulativos
│   ├── features/
│   │   ├── checkout.feature
│   │   ├── checkout-simple.feature
│   │   └── checkout2.feature
│   ├── step-definitions/
│   │   ├── checkout.steps.ts       ← usa CustomWorld
│   │   └── checkout-simple.steps.ts ← enfoque sin World (comparación)
│   └── utils/
│       ├── world.ts                ← CustomWorld: estado por escenario
│       └── hooks.ts                ← Before/AfterStep/After
├── cucumber.json                   ← configuración de Cucumber
├── playwright.config.ts
└── package.json
```

---

# Clase 6 — BDD con Cucumber & Gherkin

> **Duración:** 3 horas &nbsp;|&nbsp; **App:** [saucedemo.com](https://www.saucedemo.com)

## 🎯 Objetivos

- Entender BDD y su diferencia con automation clásico
- Escribir feature files en Gherkin en español
- Implementar step definitions en TypeScript usando los Page Objects de clase-05
- Gestionar el estado entre pasos con el World object
- Filtrar escenarios por tags y generar reportes Cucumber

---

## B1 — ¿Qué es BDD y por qué lo piden las empresas? `60 min`

**BDD (Behavior Driven Development)** es una técnica donde los tests se escriben en lenguaje natural (Gherkin) antes de implementar el código. Permite que QA, desarrollo y negocio hablen el mismo idioma.

### Automation clásico vs BDD

| Automation clásico | BDD con Cucumber |
|---|---|
| Tests en TypeScript directamente | Tests en Gherkin (lenguaje natural) |
| Solo QA/dev los entiende | Business, QA y dev los entienden |
| `.spec.ts` | `.feature` + `step-definitions/` |
| Playwright runner | Cucumber runner + Playwright |

### Sintaxis Gherkin

```gherkin
Feature: Checkout flow en SauceDemo

  @smoke
  Scenario: Usuario realiza checkout exitoso
    Given el usuario navega a la pagina de SauceDemo
    When inicia sesion con usuario "standard_user" y contrasena "secret_sauce"
    And agrega el backpack al carrito y va al carrito
    Then el usuario procede al checkout
```

| Palabra clave | Para qué |
|---|---|
| `Feature` | Nombre de la funcionalidad |
| `Scenario` | Un caso de prueba |
| `Given` | Condición previa (estado inicial) |
| `When` | Acción del usuario |
| `Then` | Resultado esperado |
| `And` | Continuación de Given/When/Then |
| `Background` | Steps que se repiten en todos los escenarios |
| `Scenario Outline` | Escenario parametrizable con `Examples` |

### Configuración: `cucumber.json`

```json
{
  "default": {
    "import": ["tests/step-definitions/**/*.ts", "tests/utils/**/*.ts"],
    "paths": ["tests/features/**/*.feature"],
    "format": ["progress", "html:cucumber-report.html"]
  }
}
```

---

## B2 — Step Definitions + World Object `70 min`

### Step Definitions — el puente entre Gherkin y código

```typescript
// tests/step-definitions/checkout.steps.ts
import { Given, When, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../utils/world';

Given('el usuario navega a la pagina de SauceDemo', async function(this: CustomWorld) {
  await this.page.goto('https://www.saucedemo.com/');
});

When('inicia sesion con usuario {string} y contrasena {string}',
  async function(this: CustomWorld, username: string, password: string) {
    await this.loginPage.login(username, password); // usa el Page Object de clase-05
  }
);
```

Los step definitions **llaman a los mismos Page Objects** que usaste en clase-05 — no hay duplicación.

### World Object — estado compartido entre pasos

```typescript
// tests/utils/world.ts
export class CustomWorld extends World {
  browser!: Browser;
  page!: Page;
  loginPage!: LoginPage;       // mismo Page Object que clase-05
  inventoryPage!: InventoryPage;
  cartPage!: CartPage;

  async init() {
    this.browser = await chromium.launch();
    this.page = await this.browser.newContext().then(c => c.newPage());
    this.loginPage = new LoginPage(this.page);
    // ...
  }
}
```

**Clave:** Cucumber crea una instancia nueva de `CustomWorld` por cada escenario → el estado nunca se mezcla entre escenarios.

### Hooks de Cucumber

```typescript
// tests/utils/hooks.ts
Before(async function(this: CustomWorld) {
  await this.init();              // inicia browser antes de cada escenario
});

AfterStep(async function(this: CustomWorld) {
  const screenshot = await this.page.screenshot();
  await this.attach(screenshot, 'image/png'); // captura en cada paso
});

After(async function(this: CustomWorld) {
  await this.destroy();           // cierra browser después de cada escenario
});
```

### Comparación: con World vs sin World

Este proyecto incluye **dos enfoques** para enseñar la diferencia:

| | `checkout.steps.ts` | `checkout-simple.steps.ts` |
|---|---|---|
| Patrón | CustomWorld | Variables `let` de módulo |
| Aislamiento | ✅ Por escenario | ❌ Estado compartido |
| Paralelo | ✅ Seguro | ❌ Riesgoso |
| Recomendado | ✅ Siempre | Solo para demostración |

### Archivos de práctica

- `tests/features/checkout.feature`
- `tests/step-definitions/checkout.steps.ts`
- `tests/utils/world.ts` + `tests/utils/hooks.ts`

---

## B3 — Tags, Reportes y CI/CD `50 min`

### Tags para filtrar escenarios

```gherkin
@smoke @HappyPath
Scenario: Usuario realiza checkout exitoso
```

```bash
npm run cucumber:smoke       # solo @smoke
npm run cucumber:regression  # solo @regression
node --import tsx ... --tags "@smoke and not @wip"
```

### Reporte HTML de Cucumber

```bash
npm run cucumber
# genera cucumber-report.html — ábrelo en el navegador
```

### GitHub Actions con 2 jobs paralelos

El pipeline de esta clase ejecuta Playwright y Cucumber **en paralelo**:

```
push → GitHub Actions
         ├── Job 1: Playwright Tests (.spec.ts)  → sube playwright-report/
         └── Job 2: Cucumber Tests (.feature)    → sube cucumber-report/
              └── Notificación Slack al finalizar
```

---

## Resumen de la Clase 6

### ✅ Lo que vimos hoy

- BDD vs automation clásico
- Sintaxis Gherkin: Feature, Scenario, Given/When/Then, tags
- Step definitions en TypeScript usando los Page Objects de clase-05
- CustomWorld para aislar el estado por escenario
- Hooks: Before, AfterStep (screenshots), After
- Tags para filtrar escenarios
- Reporte HTML de Cucumber
- Pipeline CI/CD con Playwright + Cucumber en paralelo + Slack

### 🔜 Clase 7 — Consolidación & Jenkins

- Revisión del framework completo
- Demo Jenkins vs GitHub Actions
- Inicio del proyecto final evaluado

---

## Referencia rápida — Clase 6

| Comando | ¿Qué hace? |
|---|---|
| `npm run cucumber` | Ejecutar todos los escenarios BDD |
| `npm run cucumber:smoke` | Solo escenarios `@smoke` |
| `npm run cucumber:regression` | Solo escenarios `@regression` |
| `cucumber.json` | Configuración de paths y formato |
| `CustomWorld` | Estado aislado por escenario |
| `this.attach(screenshot, ...)` | Adjuntar evidencia al reporte |

---

## 🎯 Tarea para la próxima clase

1. Agrega un nuevo `Scenario` en `checkout.feature` para el caso de login fallido
2. Implementa los steps correspondientes
3. Verifica que el pipeline de GitHub Actions ejecuta ambos jobs correctamente
