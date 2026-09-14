# playwright-curso
# QA Automation Framework — Playwright + TypeScript + Cucumber (BDD) + CI/CD

[![Playwright Tests](https://github.com/BrandLuna/playwright-curso/actions/workflows/playwright.yml/badge.svg)](https://github.com/BrandLuna/playwright-curso/actions/workflows/playwright.yml)

Curso completo de automatización de pruebas — **8 clases · 3 horas cada una**. Este repositorio
es, además, un **framework de QA Automation funcional de punta a punta**: Page Object Model,
tests E2E, BDD con Gherkin, pipeline de CI/CD con notificaciones y reportes, y una demo de
Playwright MCP.

## Descripción del proyecto

Framework de automatización para **saucedemo.com** que combina dos formas de escribir tests
(clásica con Playwright Test y BDD con Cucumber/Gherkin) sobre una misma capa de Page Objects,
ejecutado automáticamente en GitHub Actions con reportes HTML/Allure y notificaciones a Slack
y Microsoft Teams.

## Stack tecnológico

| Categoría | Herramienta |
|---|---|
| Test runner E2E | [Playwright](https://playwright.dev) + TypeScript |
| BDD / Gherkin | [Cucumber.js](https://cucumber.io) + `tsx` |
| Patrón de diseño | Page Object Model (`BasePage` + páginas específicas) |
| Reportes | HTML nativo de Playwright/Cucumber + [Allure](https://allurereport.org) |
| CI/CD principal | GitHub Actions |
| CI/CD alternativo (demo) | Jenkins (`jenkins/`) |
| Notificaciones | Slack (Incoming Webhook) + Microsoft Teams (Incoming Webhook) |
| IA / Copilot | `.github/copilot-instructions.md` + Playwright MCP como extra opcional (`mcp/`) |

## Instalación paso a paso

```bash
# 1. Clonar el repositorio y entrar a la carpeta
git clone https://github.com/BrandLuna/playwright-curso.git
cd playwright-curso

# 2. Instalar dependencias
npm install

# 3. Instalar los navegadores de Playwright
npx playwright install

# 4. Configurar variables de entorno (opcional para correr contra saucedemo.com)
cp .env.example .env
```

## Comandos disponibles

| Comando | Descripción |
|---|---|
| `npm test` | Ejecuta todos los tests Playwright (`.spec.ts`) |
| `npm run test:smoke` | Solo tests marcados `@smoke` |
| `npm run test:regression` | Solo tests marcados `@regression` |
| `npm run test:headed` | Corre los tests con navegador visible |
| `npm run test:ui` | Abre el modo UI interactivo de Playwright |
| `npm run test:report` | Abre el último reporte HTML de Playwright |
| `npm run cucumber` | Ejecuta todos los escenarios BDD (`.feature`) |
| `npm run cucumber:smoke` | Solo escenarios Gherkin `@smoke` |
| `npm run cucumber:regression` | Solo escenarios Gherkin `@regression` |
| `npm run test:all` | Corre Playwright y luego Cucumber en secuencia |
| `npm run allure:generate` | Genera `allure-report/` a partir de `allure-results/` |
| `npm run allure:open` | Abre el reporte Allure en el navegador |

## Estructura del proyecto

```
playwright-curso/
├── pages/                    ← Page Objects (BasePage + paginas especificas de saucedemo.com)
├── tests/
│   ├── clase-01 … clase-05/   ← specs Playwright acumulativos por clase
│   ├── features/              ← archivos Gherkin (.feature)
│   ├── step-definitions/      ← implementacion de steps Cucumber
│   ├── support/                ← world.ts (CustomWorld) + hooks.ts
│   └── utils/
│       ├── data/               ← JSON/CSV para data-driven testing
│       ├── fixtures/           ← Playwright fixtures
│       └── helpers.ts          ← funciones genericas reutilizables
├── jenkins/                   ← Jenkinsfile + guia (demo del instructor, no es el flujo principal)
├── mcp/                       ← Playwright MCP: extra opcional, no forma parte de la evaluacion
├── .github/
│   ├── workflows/playwright.yml ← pipeline principal de CI/CD (GitHub Actions)
│   └── copilot-instructions.md  ← estandares de codigo y prompts para IA/Copilot
├── cucumber.json               ← configuracion de Cucumber
├── playwright.config.ts        ← configuracion de Playwright (reporters: html + allure)
├── PROYECTO-FINAL.md           ← criterios de evaluacion del proyecto final (Clase 8)
└── package.json
```

## Buenas prácticas aplicadas

- **Page Object Model** con clase base (`BasePage`) y locators como getters (`data-test`)
- **BDD y automation clásico conviviendo** sobre la misma capa de Page Objects
- **Aislamiento de estado por escenario** con `CustomWorld` en Cucumber
- **Data-driven testing** (JSON/CSV) en lugar de casos hardcodeados
- **Variables de entorno** (`.env`) en vez de credenciales o URLs hardcodeadas
- **CI/CD real**: pipeline en verde con tests, artefactos (reportes) y notificaciones automáticas
- **Reportes trazables**: HTML de Playwright/Cucumber + Allure para evidencia de ejecución
- **Convenciones documentadas** para el uso de IA/Copilot, no improvisadas

## Sobre este proyecto (para reclutadores / entrevistas)

Este repositorio demuestra el ciclo completo de un framework de QA Automation en un contexto
real de equipo, no solo tests sueltos:

- **Diseño escalable**: Page Object Model que se reutiliza tanto en tests clásicos como en BDD,
  evitando duplicar locators o lógica de UI.
- **Dos enfoques de testing**: automation clásico (`.spec.ts`) y BDD con Gherkin (`.feature`),
  para trabajar tanto con equipos técnicos como con negocio/QA no técnico.
- **CI/CD end-to-end**: cada push ejecuta el pipeline completo (install → tests → reportes →
  notificación a Slack/Teams), igual que en un entorno profesional.
- **Doble plataforma de CI**: GitHub Actions como flujo principal y Jenkins documentado aparte,
  mostrando comprensión de ambas herramientas sin mezclarlas.
- **Uso estandarizado de IA**: convenciones y prompts documentados para Copilot, más una demo de
  Playwright MCP para automatización asistida por agentes de IA.

---

## Documentación del curso (por clase)

El resto de este README documenta el curso clase por clase (Clase 6 en adelante). Las Clases 1-5
sentaron las bases: fundamentos de Playwright, locators, flujos E2E, data-driven testing y
Page Object Model.

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

---

# Clase 7 — CI/CD completo, Jenkins y estandarización de IA

> **Duración:** 3 horas &nbsp;|&nbsp; **Clase final del curso**

## 🎯 Objetivos

- Consolidar el pipeline de GitHub Actions como flujo principal de CI/CD
- Conocer Jenkins como alternativa (material de aprendizaje, carpeta separada)
- Configurar notificaciones a Slack y Microsoft Teams al finalizar el pipeline
- Generar reportes Allure además de los reportes HTML de Playwright/Cucumber
- Adoptar un uso estandarizado de GitHub Copilot en el proyecto

## Pipeline de GitHub Actions (flujo principal)

Definido en [`.github/workflows/playwright.yml`](.github/workflows/playwright.yml). Se dispara con
`push` a `main`/`clase-06-bdd`/`clase-07-cicd`, con `pull_request` hacia esas mismas ramas, o
manualmente (`workflow_dispatch`).

```
push / pull_request → GitHub Actions
         ├── Job "playwright"  → npx playwright test tests/clase-05 (flujo clasico, sin BDD)
         │                       sube playwright-report/ y allure-results/
         │                       notifica Slack y Teams con el resultado de ESTE job
         └── Job "cucumber"    → npm run cucumber (flujo BDD)
                                  sube cucumber-report.html
                                  notifica Slack y Teams con el resultado de ESTE job
```

Los dos jobs corren en paralelo y son independientes a propósito: sirven para comparar,
lado a lado, cómo se ve el pipeline con el enfoque clásico de Playwright y cómo se ve con BDD.
Cada uno notifica su propio resultado — no hay un job de notificación consolidado.

### Secrets necesarios (Settings → Secrets and variables → Actions)

| Secret | Uso |
|---|---|
| `BASE_URL` | URL base de la app (ej. `https://www.saucedemo.com`) |
| `SAUCEDEMO_USERNAME` / `SAUCEDEMO_PASSWORD` | Credenciales usadas en los tests |
| `SLACK_WEBHOOK_URL` | Incoming Webhook de Slack (opcional) |
| `TEAMS_WEBHOOK_URL` | Incoming Webhook de Microsoft Teams (opcional) |

Si `SLACK_WEBHOOK_URL` o `TEAMS_WEBHOOK_URL` no están configurados, esos pasos se
omiten automáticamente — el pipeline nunca falla por falta de un secret de notificación.

### Reportes Allure

`playwright.config.ts` usa dos reporters (`html` + `allure-playwright`), por lo que cada
corrida genera `allure-results/`. Para verlo localmente:

```bash
npm run allure:generate   # combina allure-results/ en allure-report/
npm run allure:open       # abre el reporte en el navegador
```

## Jenkins (material de aprendizaje)

Ver [`jenkins/README.md`](jenkins/README.md) y [`jenkins/Jenkinsfile`](jenkins/Jenkinsfile).
Esta carpeta **no** forma parte del flujo automático del repositorio: es una guía para practicar
cómo se configuraría el mismo pipeline (mismos comandos `npm ci` / `playwright test` / `cucumber`)
en un servidor Jenkins propio, con notificaciones a Slack y Teams equivalentes.

## Estandarización de IA / Copilot

Las convenciones de código, nombrado y prompts reutilizables del proyecto están documentadas en
[`.github/copilot-instructions.md`](.github/copilot-instructions.md). Úsalo como referencia antes
de pedirle a Copilot que genere Page Objects, tests, features o cambios al pipeline, para mantener
el mismo estilo en cualquier sesión de trabajo.

## Referencia rápida — Clase 7

| Comando | ¿Qué hace? |
|---|---|
| `npm run allure:generate` | Genera `allure-report/` desde `allure-results/` |
| `npm run allure:open` | Abre el reporte Allure en el navegador |
| `.github/workflows/playwright.yml` | Pipeline principal (GitHub Actions) |
| `jenkins/Jenkinsfile` | Pipeline equivalente para Jenkins (demo) |
| `.github/copilot-instructions.md` | Estándares de código y prompts para Copilot |

---

# Clase 8 — Proyecto Final, MCP & Cierre

> **Duración:** 3 horas &nbsp;|&nbsp; **Clase final del curso**

## 🎯 Objetivos

- Consolidar el framework completo: POM + BDD + CI/CD + reportes + IA, todo funcionando junto
- Conocer Playwright MCP como extra opcional para generar tests o estructura inicial con IA
- Dejar el README listo para mostrarse en una entrevista de trabajo
- Entender los criterios de evaluación del proyecto final del curso

## Playwright MCP — extra opcional (no evaluado)

Ver [`mcp/README-mcp.md`](mcp/README-mcp.md). Es contenido **aparte** del framework principal y
de los criterios de [`PROYECTO-FINAL.md`](PROYECTO-FINAL.md): solo busca que conozcas que
Playwright tiene un MCP oficial (`@playwright/mcp`) y para qué sirve en la práctica — generar
casos de test o el esqueleto inicial de un proyecto a partir de un prompt, en vez de escribirlos
a mano. El repo incluye [`.vscode/mcp.json`](.vscode/mcp.json) para habilitarlo si querés probarlo.
Incluye un ejercicio práctico (no evaluado) para probarlo sobre un flujo nuevo de saucedemo.com.

## Proyecto final

Ver [`PROYECTO-FINAL.md`](PROYECTO-FINAL.md) para los criterios de evaluación, los flujos mínimos
requeridos sobre saucedemo.com, los entregables esperados y cómo crear tu rama
`proyecto-final-TUNOMBRE` a partir de este framework.

## Checklist de integración final

- [x] `pages/`, `tests/features/`, `tests/step-definitions/`, `tests/support/` presentes y en uso
- [x] `.github/workflows/playwright.yml`, `.env.example`, `cucumber.json`, `playwright.config.ts` presentes
- [x] `npx playwright test` y `npm run cucumber` corren sin errores
- [x] Pipeline de GitHub Actions con Playwright + Cucumber + artefactos + notificaciones Slack/Teams
- [x] `jenkins/` como alternativa documentada, homologada a los mismos comandos
- [x] `.github/copilot-instructions.md` con estándares de código y prompts reutilizables
- [x] `mcp/` documentado como extra opcional, aparte del framework evaluado

## ✅ Resumen final del curso

- Clase 1-2: fundamentos de Playwright y locators
- Clase 3: flujos E2E, hooks y tags
- Clase 4: data-driven testing, fixtures y evidencias
- Clase 5: Page Object Model y variables de entorno
- Clase 6: BDD con Cucumber/Gherkin
- Clase 7: CI/CD con GitHub Actions + Jenkins, notificaciones y estandarización de IA
- Clase 8: proyecto final integrado, Playwright MCP y cierre del curso

