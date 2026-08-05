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
│   ├── BasePage.ts
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   ├── CartPage.ts
│   └── CheckoutPage.ts
├── tests/
│   ├── clase-01/ … clase-04/
│   ├── clase-05/
│   │   ├── 01-pom-basico.spec.ts
│   │   ├── 02-environments.spec.ts
│   │   └── 03-api-testing.spec.ts
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

- Implementar Page Object Model con clases reutilizables y `BasePage`
- Separar locators de la lógica de tests
- Configurar y ejecutar tests en múltiples ambientes
- Gestionar credenciales con `.env` sin subirlas al repo
- Usar API Testing para setup/teardown de datos de prueba

---

## B1 — POM Avanzado `60 min`

### Estructura de carpetas profesional

```
pages/
├── BasePage.ts        ← métodos comunes heredados por todas las páginas
├── LoginPage.ts
├── InventoryPage.ts
├── CartPage.ts
└── CheckoutPage.ts
```

### BasePage — la capa común

```typescript
export class BasePage {
  constructor(protected page: Page) {}

  async goto(path: string)              { await this.page.goto(path); }
  async waitForURL(p: string | RegExp)  { await this.page.waitForURL(p); }
  async getTitle()                      { return this.page.title(); }
}
```

### Page Object con getters

Los locators se definen como **getters** — se re-evalúan cada vez, más robustos que propiedades estáticas:

```typescript
export class LoginPage extends BasePage {
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

## B2 — Environments y Variables de Entorno `60 min`

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

### Archivo de práctica → `tests/clase-05/02-environments.spec.ts`

---

## B3 — API Testing Básico `60 min`

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

### Archivo de práctica → `tests/clase-05/03-api-testing.spec.ts`

---

## Resumen de la Clase 5

### ✅ Lo que vimos hoy

- POM con `BasePage` y herencia de clases
- Locators como getters — lazy y reutilizables
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
| `class LoginPage extends BasePage` | Herencia de la clase base |
| `get loginButton() { return ... }` | Locator como getter |
| `process.env.BASE_URL` | Leer variable de entorno |
| `dotenv.config()` | Cargar `.env` en el proceso |
| `request.newContext()` | Cliente HTTP sin navegador |
| `response.status()` | Código de respuesta HTTP |

---

## 🎯 Tarea para la próxima clase

1. Refactoriza uno de tus tests de clases anteriores usando las Page Objects de esta clase
2. Verifica que el pipeline de GitHub Actions sigue pasando con el POM
3. Explora la documentación de Cucumber: [cucumber.io/docs](https://cucumber.io/docs)
