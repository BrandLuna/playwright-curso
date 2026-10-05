# playwright-curso
# QA Automation con Playwright + TypeScript + Cucumber

Curso completo de automatización de pruebas — **8 clases · 3 horas cada una**

## Requisitos previos

- [Node.js LTS](https://nodejs.org) (v20 o superior)
- [Git](https://git-scm.com)
- [VS Code](https://code.visualstudio.com) + extensión **Playwright Test for VSCode**

## Configuración para esta clase

Continúas el proyecto de la Clase 5 (ya debe tener `dotenv`, `baseURL`, timeouts y el reporter
`allure-playwright` configurados en `playwright.config.ts` — eso no cambia en esta clase).

> **De la Clase 5 se reutiliza:** los Page Objects (`pages/*.ts`), la config de `playwright.config.ts`
> y toda la carpeta `tests/clase-05/` (B1 a B5: POM básico, `beforeEach`, fixtures, environments y API
> testing) — incluida `tests/utils/fixtures/pages.fixture.ts`, que usa `03-pom-fixtures.spec.ts`.
> **De la Clase 5 NO se trae:** la separación opcional en `locators/` + `actions/` (B6,
> `06-pom-locators-actions.spec.ts`). Esos locators/actions resuelven el mismo problema (evitar
> `new XPage(page)` repetido) que en BDD ya resuelve el **World object** (`this.loginPage`,
> `this.cartPage`, ...), así que para los *step definitions* de esta clase solo se usan los Page
> Objects en `pages/*.ts` — la fixture de pages sigue viva, pero únicamente para los `.spec.ts` de
> `tests/clase-05/`, no para BDD. El archivo de locators/actions se queda únicamente en la rama
> `clase-05-pom` como referencia.

Instala las nuevas dependencias:

```bash
# Framework BDD + runner TypeScript
npm install --save-dev @cucumber/cucumber tsx

# Formatter con detalle de Feature/Scenario/Step en consola (progress solo muestra puntos)
npm install --save-dev @cucumber/pretty-formatter

# Reportes: Allure para Cucumber + alternativa HTML muy usada con Cucumber
npm install --save-dev allure-cucumberjs multiple-cucumber-html-reporter
```

Agrega a `.gitignore`:
```
reports/
cucumber-report-json/
multiple-cucumber-html-report/
```

**Agrega scripts** a tu `package.json`:
```json
"cucumber": "node --import tsx ./node_modules/@cucumber/cucumber/bin/cucumber.js",
"cucumber:smoke": "... --tags @smoke",
"cucumber:regression": "... --tags @regression",
"cucumber:html-report": "node --import tsx scripts/generate-cucumber-html-report.ts",
"allure:generate": "npx allure generate allure-results --clean -o allure-report",
"allure:open": "npx allure open allure-report",
"allure:report": "npm run test:allure && npm run cucumber && npm run allure:generate && npm run allure:open"
```

**Crea `cucumber.json`** en la raíz apuntando a `tests/features/`, `tests/step-definitions/` y
`tests/support/`, con el formatter de Allure además del HTML nativo.

**Crea la carpeta `tests/support/`** con `world.ts` (CustomWorld), `hooks.ts` (Before/AfterStep/After)
y **`scripts/generate-cucumber-html-report.ts`** en la raíz (genera el reporte alternativo a partir
del JSON de Cucumber — fuera de `tests/support/` a propósito, para que Cucumber no lo importe
como si fuera un step/support file).

## Ejecutar los tests

```bash
# Tests Playwright (.spec.ts)
npm test
npm run test:smoke

# Tests BDD con Cucumber (.feature)
npm run cucumber                    # todos los escenarios
npm run cucumber:smoke              # solo escenarios @smoke
npm run cucumber:regression         # solo escenarios @regression

# Reportes
npm run test:report                 # HTML nativo de Playwright
npm run cucumber:html-report        # HTML alternativo (multiple-cucumber-html-reporter)
npm run allure:report               # Playwright + Cucumber, un solo Allure Report combinado
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
│   ├── clase-01/ … clase-04/         ← tests Playwright acumulativos
│   ├── clase-05/                     ← B1 a B5 (sin B6 locators/actions, no aplica a BDD)
│   │   ├── 01-pom-basico.spec.ts
│   │   ├── 02-pom-beforeeach.spec.ts
│   │   ├── 03-pom-fixtures.spec.ts
│   │   ├── 04-environments.spec.ts
│   │   └── 05-api-testing.spec.ts
│   ├── features/
│   │   ├── comparativa-sin-world.feature
│   │   ├── environments.feature          ← credenciales/URL desde .env (reutiliza un step de flujo-de-compra)
│   │   └── flujo-de-compra.feature
│   ├── step-definitions/
│   │   ├── flujo-de-compra.steps.ts       ← usa CustomWorld
│   │   ├── environments.steps.ts          ← login con .env (su Given vive en flujo-de-compra.steps.ts)
│   │   └── comparativa-sin-world.steps.ts ← enfoque sin World (comparación)
│   ├── support/
│   │   ├── world.ts                ← CustomWorld: estado por escenario
│   │   └── hooks.ts                ← Before/AfterStep/After
│   └── utils/
│       ├── data/                   ← JSON/CSV para data-driven testing
│       ├── fixtures/
│       │   ├── auth.fixture.ts       ← API testing (Clase 5)
│       │   └── pages.fixture.ts      ← inyección de Page Objects (Clase 5, solo para tests/clase-05)
│       └── helpers.ts
├── cucumber.json                   ← configuración de Cucumber (formatters + Allure)
├── scripts/
│   └── generate-cucumber-html-report.ts ← genera el HTML alternativo de Cucumber (fuera de tests/support)
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
- Usar variables de entorno (`.env`) en BDD y entender que un `.feature` no está atado a un `.steps.ts`
- Comparar hooks, timeouts y ejecución en paralelo: Playwright Test vs Cucumber
- Filtrar escenarios por tags y generar reportes Cucumber + Allure

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
    "import": ["tests/step-definitions/**/*.ts", "tests/support/**/*.ts"],
    "paths": ["tests/features/**/*.feature"],
    "format": [
      "@cucumber/pretty-formatter",
      "html:reports/cucumber-report.html",
      "json:cucumber-report-json/cucumber-report.json",
      "allure-cucumberjs/reporter:allure-results/formatter.log"
    ],
    "formatOptions": { "resultsDir": "allure-results" }
  }
}
```

Cada formatter escribe un reporte distinto a partir de **la misma ejecución**: `@cucumber/pretty-formatter`
(consola, con Feature/Scenario/Step detallado y colores — reemplaza al `progress` básico que solo
muestra puntos), `html` (nativo de Cucumber), `json` (insumo para `multiple-cucumber-html-reporter`) y
`allure-cucumberjs/reporter` (insumo para Allure, en la misma carpeta `allure-results/` que usa
`allure-playwright` — por eso `npm run allure:report` combina ambas suites en un solo reporte).

> **¿Por qué `allure-cucumberjs/reporter:allure-results/formatter.log`?** Un formatter sin `:ruta`
> (como `@cucumber/pretty-formatter`) escribe en la consola. Si dos formatters se quedan sin ruta a
> la vez, el segundo se queda con la consola y el detalle del primero desaparece del log. Dándole
> una ruta de archivo explícita a Allure, el formatter de consola vuelve a imprimir con normalidad;
> el archivo `formatter.log` no se usa para nada (Allure ya escribe sus resultados reales en
> `allure-results/` vía `formatOptions.resultsDir`).

---

## B2 — Step Definitions + World Object `70 min`

### Step Definitions — el puente entre Gherkin y código

```typescript
// tests/step-definitions/flujo-de-compra.steps.ts
import { Given, When, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';

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
// tests/support/world.ts
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
// tests/support/hooks.ts
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

| | `flujo-de-compra.steps.ts` | `comparativa-sin-world.steps.ts` |
|---|---|---|
| Patrón | CustomWorld | Variables `let` de módulo |
| Aislamiento | ✅ Por escenario | ❌ Estado compartido |
| Paralelo | ✅ Seguro | ❌ Riesgoso |
| Recomendado | ✅ Siempre | Solo para demostración |

### Archivos de práctica

- `tests/features/flujo-de-compra.feature`
- `tests/step-definitions/flujo-de-compra.steps.ts`
- `tests/support/world.ts` + `tests/support/hooks.ts`

### Un `.feature` NO está atado a un `.steps.ts` del mismo nombre

Cucumber no empareja archivos por nombre: carga **todos** los archivos que matchean el glob
`"import"` de `cucumber.json`, junta todas las funciones `Given/When/Then` en un solo diccionario de
patrones de texto, y busca qué función matchea cada línea del Gherkin sin importar en qué archivo
viva. Por eso un mismo step se puede reutilizar entre features distintos, y un mismo feature puede
combinar steps definidos en varios archivos `.steps.ts`.

Ejemplo real en este proyecto: `tests/features/environments.feature` reutiliza el `Given('el usuario
navega a la pagina de SauceDemo', ...)` que vive en `flujo-de-compra.steps.ts`, y solo define sus
propios `When`/`Then` en `environments.steps.ts` (nombre de archivo distinto, cero problema).

### Variables de entorno en BDD (equivalente a Clase 5 B4)

Cucumber **no lee `playwright.config.ts`**, así que el `dotenv.config()` de Clase 5 no aplica aquí —
hay que cargarlo a mano en el primer support file que Cucumber importa:

```typescript
// tests/support/world.ts
import dotenv from 'dotenv';
dotenv.config();
```

Con eso, cualquier step definition puede leer `process.env.BASE_URL`, `process.env.SAUCEDEMO_USERNAME`
y `process.env.SAUCEDEMO_PASSWORD` igual que en los `.spec.ts` de `tests/clase-05/`:

```typescript
// tests/step-definitions/environments.steps.ts
const USERNAME = process.env.SAUCEDEMO_USERNAME ?? 'standard_user';
const PASSWORD = process.env.SAUCEDEMO_PASSWORD ?? 'secret_sauce';

When('inicia sesion con las credenciales del entorno', async function (this: CustomWorld) {
  await this.loginPage.login(USERNAME, PASSWORD);
});
```

> Los escenarios que prueban credenciales **específicas** (usuario bloqueado, contraseña incorrecta,
> etc.) siguen con el valor literal en el Gherkin a propósito — ahí el dato *es* el caso de prueba.
> El `.env` aplica a la URL base y al "usuario por defecto", no a los negativos.

### Archivo de práctica — environments

- `tests/features/environments.feature` + `tests/step-definitions/environments.steps.ts`

### Playwright Test vs Cucumber — hooks, timeouts y paralelo nativo

Ambos runners resuelven lo mismo con mecanismos distintos; esto es lo que cambia al migrar de
`.spec.ts` (clase-05) a `.feature` + step definitions (clase-06):

| | Playwright Test (`.spec.ts`) | Cucumber (`.feature`) |
|---|---|---|
| Hook "antes de cada caso" | `test.beforeEach(({ page }) => ...)` | `Before(async function(this: CustomWorld) { await this.init(); })` |
| Hook "después de cada caso" | `test.afterEach(...)` | `After(async function(this: CustomWorld) { await this.destroy(); })` |
| Hook por paso individual | No existe (no hay "pasos", solo el test completo) | `AfterStep(...)` — corre tras cada `Given/When/Then`, usado aquí para las capturas |
| Hook "una vez por archivo/suite" | `test.beforeAll` / `test.afterAll` | `BeforeAll` / `AfterAll` (fuera de cualquier `World`, no instancia) |
| Quién crea el browser | Playwright lo crea por ti (fixture `page`) | Lo creamos a mano en `world.ts` (`chromium.launch()`) — Cucumber no sabe de browsers |
| Timeout por test/step | `timeout: 30_000` en `playwright.config.ts` | `setDefaultTimeout(10000)` en `hooks.ts` — `cucumber.json` **no** tiene una clave `timeout` real, se ignora en silencio |
| Timeout de assertions | `expect: { timeout: 5_000 }` | No existe un equivalente global; cada `expect` de Playwright usado dentro de un step sigue su propio timeout por defecto (5s) |

### Ejecución en paralelo

| | Playwright Test | Cucumber |
|---|---|---|
| Config | `fullyParallel: true` + `workers` en `playwright.config.ts` | Flag `--parallel <n>` en el CLI (o `parallel` en `cucumber.json`) |
| Unidad de paralelismo | Archivos de test, repartidos entre workers | Escenarios (`Scenario`), repartidos entre procesos hijos |
| Requisito para que sea seguro | N/A — cada test ya corre aislado | Un `World` por escenario (como `CustomWorld`) — con variables `let` de módulo (`comparativa-sin-world.steps.ts`) el estado se mezcla y paralelizar rompe los tests |

```bash
# Cucumber en paralelo con 4 procesos (equivalente a los workers de Playwright)
node --import tsx ./node_modules/@cucumber/cucumber/bin/cucumber.js --parallel 4
```

---

## B3 — Tags, Reportes (Allure + Cucumber) y CI/CD `50 min`

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

### Más formas de filtrar — por feature, por tag o combinados

El binario oficial de Cucumber.js es `cucumber-js` (`npx cucumber-js`); como los steps están en
TypeScript, siempre necesita el loader `tsx` (`--import tsx` de **Node**, no confundir con el
`--import` propio del CLI de Cucumber, que sirve para importar support files):

```bash
# un solo archivo .feature
node --import tsx ./node_modules/@cucumber/cucumber/bin/cucumber.js tests/features/flujo-de-compra.feature

# por tag, con operadores lógicos
node --import tsx ./node_modules/@cucumber/cucumber/bin/cucumber.js --tags "@smoke and not @wip"
node --import tsx ./node_modules/@cucumber/cucumber/bin/cucumber.js --tags "@smoke or @regression"

# feature + tag combinados
node --import tsx ./node_modules/@cucumber/cucumber/bin/cucumber.js tests/features/flujo-de-compra.feature --tags @smoke

# por nombre de escenario, sin usar tags
node --import tsx ./node_modules/@cucumber/cucumber/bin/cucumber.js --name "Usuario realiza checkout exitoso"

# en paralelo (equivalente a los workers de Playwright)
node --import tsx ./node_modules/@cucumber/cucumber/bin/cucumber.js --parallel 4
```

Sin importar cuál de estos uses, **los 3 reportes se generan igual** — están declarados globalmente
en `cucumber.json`, no dependen del filtro que apliques en el CLI.

### Reportes disponibles para Cucumber

Una sola ejecución (`npm run cucumber`) ya genera **los tres** reportes en paralelo, porque los tres
formatters están declarados en `cucumber.json`:

| Reporte | Comando para verlo | ¿Cuándo usarlo? |
|---|---|---|
| HTML nativo de Cucumber | abrir `reports/cucumber-report.html` en el navegador | Rápido, sin instalar nada más — ideal en local |
| **Allure Report** (`allure-cucumberjs`) | `npm run allure:generate && npm run allure:open` | El mismo look & feel que Allure de Playwright (clase-04) — gráficas, historial, tendencias |
| **multiple-cucumber-html-reporter** | `npm run cucumber:html-report` → abre `multiple-cucumber-html-report/index.html` | Alternativa muy popular en proyectos solo-Cucumber: resumen por feature, tags y metadata de entorno en un único dashboard |

```bash
npm run cucumber                # corre los escenarios y escribe los 3 reportes
npm run cucumber:html-report    # genera el dashboard de multiple-cucumber-html-reporter
npm run allure:generate         # genera allure-report/ a partir de allure-results/
npm run allure:open             # abre el reporte Allure en el navegador
```

> **¿Playwright Test tiene un "reporter de Cucumber"?** No — los reporters de `@playwright/test`
> (`html`, `allure-playwright`, `json`, etc.) solo entienden tests escritos con `test()`. Como los
> `.feature` corren con el runner de **Cucumber.js**, no con el de Playwright, el reporte tiene que
> venir de un formatter de Cucumber (`allure-cucumberjs`, `multiple-cucumber-html-reporter`, o el
> `html`/`json` nativos). Lo que sí comparten ambos mundos es la carpeta `allure-results/`: al correr
> `npm run allure:report`, Playwright y Cucumber escriben ahí sus resultados y Allure los combina en
> **un solo reporte**.

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
- Step definitions en TypeScript usando los Page Objects de clase-05 (sin la capa `locators/`+`actions/` ni fixtures de pages — el World las reemplaza)
- CustomWorld para aislar el estado por escenario
- Variables de entorno (`.env`) en BDD — y que un `.feature` puede combinar steps de cualquier `.steps.ts`
- Hooks: Before, AfterStep (screenshots), After — y su equivalente en Playwright Test (`beforeEach`/`afterEach`/`beforeAll`/`afterAll`)
- Timeouts: `setDefaultTimeout` de Cucumber vs `timeout`/`expect.timeout` de `playwright.config.ts`
- Paralelo: `--parallel <n>` de Cucumber vs `workers`/`fullyParallel` de Playwright
- Tags para filtrar escenarios
- Reportes: HTML nativo de Cucumber, Allure (`allure-cucumberjs`) y `multiple-cucumber-html-reporter`
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
| `--parallel 4` | Correr escenarios en paralelo (equivalente a `workers` en Playwright) |
| `cucumber.json` | Configuración de paths y formato |
| `CustomWorld` | Estado aislado por escenario |
| `setDefaultTimeout(ms)` | Timeout por step/escenario (equivalente a `timeout` en Playwright) |
| `this.attach(screenshot, ...)` | Adjuntar evidencia al reporte |
| `npm run cucumber:html-report` | Generar el dashboard de `multiple-cucumber-html-reporter` |
| `npm run allure:generate` / `allure:open` | Generar/abrir el Allure Report combinado (Playwright + Cucumber) |

---

## 🎯 Tarea para la próxima clase

1. Agrega un nuevo `Scenario` en `flujo-de-compra.feature` para el caso de login fallido
2. Implementa los steps correspondientes
3. Verifica que el pipeline de GitHub Actions ejecuta ambos jobs correctamente
