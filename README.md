# QA Automation con Playwright + TypeScript

Curso completo de automatización de pruebas — **8 clases · 3 horas cada una**

## Requisitos previos

- [Node.js LTS](https://nodejs.org) (v20 o superior)
- [Git](https://git-scm.com)
- [VS Code](https://code.visualstudio.com) + extensión **Playwright Test for VSCode**

## Configuración para esta clase

Continúas el proyecto de la Clase 4. Instala la nueva dependencia:

```bash
# Leer variables de entorno desde archivos .env
npm install --save-dev dotenv
```

**Crea tu archivo `.env`** en la raíz del proyecto (nunca se sube al repo):

```bash
BASE_URL=https://www.saucedemo.com
SAUCEDEMO_USERNAME=standard_user
SAUCEDEMO_PASSWORD=secret_sauce
```

> ⚠️ No uses `USERNAME` ni `PASSWORD` — son variables reservadas del sistema operativo en Windows.

**Agrega a `.gitignore`:**

```
.env
.env.local
.env.staging
.env.production
```

**Actualiza `playwright.config.ts`** — agrega dotenv y el `baseURL`:

```typescript
import dotenv from 'dotenv';
dotenv.config();

// en la sección use: {}
baseURL: process.env.BASE_URL ?? 'https://www.saucedemo.com',
```

**Crea la carpeta `pages/`** con las clases POM del bloque B1.

## Ejecutar los tests

```bash
npm test                               # todos los tests
npm run test:smoke                     # solo @smoke
npm run test:regression                # solo @regression
npx playwright test tests/clase-05/   # solo esta clase
```

## Estructura del proyecto

```
playwright-curso/
├── pages/
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   ├── CartPage.ts
│   └── CheckoutPage.ts
├── tests/
│   ├── clase-01/ … clase-04/
│   ├── clase-05/
│   │   ├── 01-pom-basico.spec.ts
│   │   ├── 02-pom-beforeeach.spec.ts
│   │   ├── 03-pom-fixtures.spec.ts
│   │   ├── 04-environments.spec.ts
│   │   └── 05-api-testing.spec.ts
│   ├── fixtures/
│   └── data/
├── .env                ← no se sube al repo
├── .env.example        ← plantilla segura para compartir
├── playwright.config.ts
└── package.json
```

---

# Clase 5 — POM Avanzado & Environments

> **Duración:** 3 horas &nbsp;|&nbsp; **App:** [saucedemo.com](https://www.saucedemo.com)

## 🎯 Objetivos

- Implementar Page Object Model con clases por pantalla
- Separar locators de la lógica de tests
- Configurar y ejecutar tests en múltiples ambientes
- Gestionar credenciales con `.env` sin subirlas al repo
- Usar API Testing para setup/teardown de datos de prueba

---

## B1 — POM Avanzado `60 min`

### Estructura de carpetas profesional

```
pages/
├── LoginPage.ts
├── InventoryPage.ts
├── CartPage.ts
└── CheckoutPage.ts
```

> No usamos una clase `BasePage`: en este proyecto solo `goto()` se reutilizaba y es un wrapper directo de `page.goto()`. Sin lógica propia que compartir, la herencia solo añadía una capa extra. Cada page object recibe su `page: Page` en el constructor.

### Page Object con getters

Los locators se definen como **getters** — se re-evalúan cada vez, más robustos que propiedades estáticas:

```typescript
export class LoginPage {
  constructor(private page: Page) {}

  async goto(path: string) { await this.page.goto(path); }

  // locators
  get usernameInput() { return this.page.getByPlaceholder('Username'); }
  get loginButton()   { return this.page.getByRole('button', { name: 'Login' }); }

  // acciones
  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.loginButton.click();
  }
}
```

### Otras formas de guardar locators

| Estrategia | Cómo se ve | Cuándo usarla |
|---|---|---|
| **Getters** (la que usamos) | `get loginButton() { return this.page...; }` | Por defecto — se re-evalúan en cada acceso, no quedan "stale" si el DOM cambia |
| **Propiedades `readonly` en el constructor** | `readonly loginButton: Locator;` asignado en `constructor(page) { this.loginButton = page.locator(...); }` | Cuando quieres que el locator se resuelva una sola vez y el linter te obligue a declarar el tipo `Locator` explícito |
| **Métodos en vez de getters** | `private loginButton() { return this.page...; }` | Si necesitas parámetros dinámicos, ej. `row(name: string)` para una fila de tabla |
| **Objeto de locators aparte** | `export const loginLocators = { username: '[data-test="username"]', ... }` | Proyectos grandes donde quieres separar selectores (strings) de la lógica, o compartirlos entre Page Objects y fixtures |
| **Componentes reutilizables** | Una clase `NavBar` o `Modal` inyectada dentro de varias pages | Cuando un fragmento de UI (header, modal, tabla) se repite en múltiples pantallas |

Para este proyecto, los **getters** son suficientes: son simples, no añaden estado y cada page es independiente.

### Separación de responsabilidades

| Tests `.spec.ts` | Pages `.ts` |
|---|---|
| Describe el escenario | Encapsula los locators |
| Llama métodos de página | Expone acciones de negocio |
| Hace las assertions | Esconde detalles técnicos de UI |

**Antes (sin POM):**
```typescript
await page.fill('#user-name', 'standard_user');
await page.fill('#password', 'secret_sauce');
await page.click('#login-button');
```

**Después (con POM):**
```typescript
await loginPage.login('standard_user', 'secret_sauce');
```

### Archivo de práctica → `tests/clase-05/01-pom-basico.spec.ts`

---

## B2 — POM con `beforeEach` `20 min`

### Primera solución: mover la instanciación a un hook

`test.beforeEach` ya lo vimos en la Clase 3 (hooks). Podemos usarlo para crear las pages una sola vez por test, en vez de repetirlo dentro de cada `test(...)`:

```typescript
test.describe('Flujo de compra', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  // corre antes de CADA test de este describe, las use o no
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
  });

  test('login exitoso', async ({ page }) => {
    await loginPage.goto('/');
    await loginPage.login('standard_user', 'secret_sauce');
  });
});
```

### La trampa: `beforeEach` corre siempre, las use el test o no

Si tienes 4 pages en el `beforeEach` pero un test solo necesita 1, las 4 se instancian igual — no hay forma de que `beforeEach` sea selectivo. Es simple de leer, pero no es lo más eficiente cuando el número de pages crece.

### Archivo de práctica → `tests/clase-05/02-pom-beforeeach.spec.ts`

---

## B3 — POM con fixtures `30 min`

### El problema: repetir `new XPage(page)` en cada test

En `01-pom-basico.spec.ts`, cada test que necesita varias pages repite su instanciación:

```typescript
test('flujo completo', async ({ page }) => {
  const loginPage     = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  const cartPage      = new CartPage(page);
  const checkoutPage  = new CheckoutPage(page);
  // ...
});
```

### La solución: fixtures de Playwright

Una fixture extiende el objeto `test` para que las pages lleguen ya creadas como parámetro, igual que `page`:

```typescript
// tests/utils/fixtures/pages.fixture.ts
import { test as base } from '@playwright/test';
import { LoginPage } from '../../../pages/LoginPage';

type PageFixtures = { loginPage: LoginPage };

export const test = base.extend<PageFixtures>({
  loginPage: async ({ page }, use) => { await use(new LoginPage(page)); },
});

export { expect } from '@playwright/test';
```

```typescript
// en el spec: se importa el test extendido, no el de @playwright/test
import { test, expect } from '../utils/fixtures/pages.fixture';

test('login exitoso', async ({ page, loginPage }) => {
  await loginPage.goto('/');
  await loginPage.login('standard_user', 'secret_sauce');
});
```

### Las fixtures son *lazy*

Playwright solo ejecuta el setup de una fixture si el test la **declara como parámetro**. Un test que solo pide `page` nunca instancia `loginPage`, `inventoryPage`, etc. — no hay costo ni efectos secundarios de más:

```typescript
// no declara loginPage → nunca se crea, sin importar que esté disponible
test('algo que no toca pages', async ({ page }) => {
  await page.goto('/');
});
```

### ¿Fixture o `beforeEach`?

| | Fixture (`base.extend`) | `test.beforeEach` |
|---|---|---|
| Se ejecuta | Solo si el test la declara como parámetro | Siempre, para todos los tests del `describe` |
| Se comparte entre archivos | Sí, se importa donde haga falta | No, vive solo en ese archivo |
| Dónde vive | Archivo aparte (`*.fixture.ts`) | Dentro del propio `.spec.ts` |

Para un proyecto con muchos specs que reutilizan las mismas pages, la fixture evita duplicar la configuración en cada archivo.

### Archivo de práctica → `tests/clase-05/03-pom-fixtures.spec.ts`

---

## B4 — Environments y Variables de Entorno `60 min`

### ¿Qué es un environment?

En proyectos reales, la misma app corre en distintos ambientes:

| Ambiente | URL | Para qué |
|---|---|---|
| development | `https://dev.tuapp.com` | Desarrollo local |
| staging | `https://staging.tuapp.com` | QA y validación |
| production | `https://tuapp.com` | Usuarios reales |

### Archivos `.env`

```bash
# .env (desarrollo — NO subir al repo)
BASE_URL=https://www.saucedemo.com
USERNAME=standard_user
PASSWORD=secret_sauce
```

```bash
# .env.example (plantilla — SÍ subir al repo)
BASE_URL=https://tuapp.com
USERNAME=
PASSWORD=
```

### Usar las variables en los tests

```typescript
const USERNAME = process.env.USERNAME ?? 'standard_user';
const PASSWORD = process.env.PASSWORD ?? 'secret_sauce';

await loginPage.login(USERNAME, PASSWORD);
```

### Reglas de seguridad

- `.env` siempre en `.gitignore` — nunca subir credenciales reales
- `.env.example` sí se sube — es la plantilla sin valores reales
- En CI/CD, las variables se inyectan como **secrets** del pipeline

### Archivo de práctica → `tests/clase-05/04-environments.spec.ts`

---

## B5 — API Testing Básico `60 min`

Playwright puede hacer peticiones HTTP sin abrir el navegador. Útil para preparar datos de prueba antes de un test de UI.

```typescript
import { request } from '@playwright/test';

const apiContext = await request.newContext({ baseURL: 'https://api.tuapp.com' });

// GET
const response = await apiContext.get('/users/1');
expect(response.status()).toBe(200);

// POST — crear datos antes del test
await apiContext.post('/users', {
  data: { name: 'Juan QA', email: 'juan@test.com' }
});

await apiContext.dispose();
```

### Caso de uso real

```
1. POST /users → crear usuario por API (rápido, sin UI)
2. Test de UI → probar flujo con ese usuario
3. DELETE /users/:id → limpiar después del test
```

Esto hace los tests más rápidos y menos dependientes del estado previo de la app.

### Archivo de práctica → `tests/clase-05/05-api-testing.spec.ts`

---

## B6 — POM en capas: Locators + Actions (variante opcional)

Otra forma de organizar un Page Object es dividirlo en dos clases:

```
pages/
├── locators/   ← solo getters, sin lógica (LoginLocators, InventoryLocators, ...)
└── actions/    ← extiende los locators y agrega las interacciones de negocio
```

```typescript
// pages/locators/LoginLocators.ts — solo locators
export class LoginLocators {
  constructor(protected page: Page) {}
  get usernameInput() { return this.page.locator('[data-test="username"]'); }
  get loginButton()   { return this.page.locator('[data-test="login-button"]'); }
}

// pages/actions/LoginActions.ts — hereda los locators, agrega el comportamiento
export class LoginActions extends LoginLocators {
  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.loginButton.click();
  }
}
```

El test solo importa la clase `Actions` — nunca toca un locator directamente. Se llama **Actions** (y no "Steps") para no chocar con los step definitions de Cucumber que vienen en la Clase 6.

> Es opcional: para este proyecto, con pocas pantallas, una sola clase por página (como en B1) es más simple. Esta separación se justifica cuando los locators cambian con frecuencia y se editan por personas distintas a quienes escriben la lógica de negocio.

### Archivo de práctica → `tests/clase-05/06-pom-locators-actions.spec.ts`

---

## Resumen de la Clase 5

### ✅ Lo que vimos hoy

- POM sin herencia innecesaria — cada page object es independiente
- Locators como getters — lazy y reutilizables
- `beforeEach` para instanciar pages una vez por test (corre siempre, las use o no)
- Fixtures para inyectar Page Objects ya instanciados, sin repetir `new XPage(page)` (lazy)
- Separación: tests describen escenarios, pages encapsulan la UI
- Variables de entorno con `.env` y dotenv
- `baseURL` desde `process.env` en `playwright.config.ts`
- Seguridad: `.env` en `.gitignore`, `.env.example` en el repo
- API Testing con `request.newContext()` para setup/teardown

### 🔜 Clase 6 — BDD con Cucumber & Gherkin

- Feature files en español
- Step definitions con TypeScript
- World object para compartir estado
- Hooks de Cucumber
- Tags y ejecución filtrada
- Reportes Gherkin + Allure

---

## Referencia rápida — Clase 5

| Código | ¿Qué hace? |
|---|---|
| `class LoginPage { constructor(private page: Page) {} }` | Page object independiente, sin herencia |
| `get loginButton() { return ... }` | Locator como getter |
| `base.extend<Fixtures>({...})` | Crea un `test` extendido con fixtures propias |
| `process.env.BASE_URL` | Leer variable de entorno |
| `dotenv.config()` | Cargar `.env` en el proceso |
| `request.newContext()` | Cliente HTTP sin navegador |
| `response.status()` | Código de respuesta HTTP |

---

## 🎯 Tarea para la próxima clase

1. Refactoriza uno de tus tests de clases anteriores usando las Page Objects de esta clase
2. Verifica que el pipeline de GitHub Actions sigue pasando con el POM
3. Explora la documentación de Cucumber: [cucumber.io/docs](https://cucumber.io/docs)
