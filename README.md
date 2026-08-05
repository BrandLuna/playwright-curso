# QA Automation con Playwright + TypeScript

Curso completo de automatización de pruebas — **8 clases · 3 horas cada una**

## Requisitos previos

- [Node.js LTS](https://nodejs.org) (v20 o superior)
- [Git](https://git-scm.com)
- [VS Code](https://code.visualstudio.com) + extensión **Playwright Test for VSCode**

## Configuración para esta clase

Continúas el proyecto de la Clase 2 — no hay paquetes nuevos que instalar.

**Lo nuevo en esta clase son scripts de ejecución.** Agrégalos a tu `package.json` en la sección `"scripts"`:

```json
"scripts": {
  "test": "npx playwright test",
  "test:smoke": "npx playwright test --grep @smoke",
  "test:regression": "npx playwright test --grep @regression",
  "test:headed": "npx playwright test --headed",
  "test:report": "npx playwright show-report"
}
```

Una vez agregados, puedes usar los comandos cortos:

```bash
npm test                  # ejecutar todos los tests
npm run test:smoke        # solo tests etiquetados con @smoke
npm run test:regression   # solo tests etiquetados con @regression
npm run test:headed       # con navegador visible
npm run test:report       # abrir el último reporte HTML
```

## Ejecutar los tests

```bash
npm test                        # todos los tests
npm run test:smoke              # solo tests @smoke
npm run test:regression         # solo tests @regression
npm run test:headed             # con navegador visible
npm run test:report             # abrir el último reporte HTML
npx playwright test --ui        # UI Mode interactivo
npx playwright test --debug     # depuración paso a paso
```

## Verificar que el entorno está listo

```bash
node --version           # v20.x.x o superior
npm --version            # 10.x.x o superior
npx playwright --version # Version 1.x.x
```

## Estructura del proyecto

```
playwright-curso/
├── tests/
│   ├── clase-01/
│   ├── clase-02/
│   ├── clase-03/
│   │   ├── 01-assertions.spec.ts
│   │   ├── 02-describe-hooks-tags.spec.ts
│   │   ├── 03-cli-modos.spec.ts
│   │   └── 04-flujo-e2e.spec.ts
├── playwright.config.ts
├── package.json
└── tsconfig.json
```

---

# Clase 3 — Flujos, Organización & Ejecución

> **Duración:** 3 horas &nbsp;|&nbsp; **App:** [saucedemo.com](https://www.saucedemo.com)

## 🎯 Objetivos

- Escribir assertions correctas para validar resultados
- Organizar tests con `describe`, hooks y tags
- Estructurar carpetas de forma profesional
- Ejecutar suites específicas desde la terminal
- Construir un flujo E2E completo en saucedemo.com

---

## B1 — Assertions y Esperas `60 min`

Una assertion verifica que algo es verdadero en el test. Si la condición no se cumple, el test falla.

### Assertions más usadas

| Assertion | ¿Qué verifica? |
|---|---|
| `toBeVisible()` | El elemento está visible en pantalla |
| `toBeHidden()` | El elemento no está visible (existe pero oculto) |
| `toHaveText('X')` | El elemento contiene exactamente el texto X |
| `toContainText('X')` | El elemento contiene el texto X (parcial) |
| `toHaveValue('X')` | El campo de input tiene el valor X |
| `toHaveURL(/regex/)` | La URL actual coincide con la expresión regular |
| `toHaveTitle('X')` | El título de la página es X |
| `toBeEnabled()` | El elemento está habilitado |
| `toBeDisabled()` | El elemento está deshabilitado |
| `toBeChecked()` | El checkbox está marcado |
| `toHaveCount(n)` | El número de elementos encontrados es n |

### Assertions negativas — `.not`

```typescript
await expect(page.getByText('Error')).not.toBeVisible();
await expect(page.getByRole('button', { name: 'Login' })).not.toBeDisabled();
```

### Auto-waiting de Playwright

Playwright espera automáticamente a que los elementos estén listos. No necesitas `sleep()`.

| Método | Para qué sirve |
|---|---|
| Auto-waiting | Reintenta el locator hasta que el elemento esté listo (30s por defecto) |
| `waitForURL()` | Esperar a que la URL cambie a un valor específico |
| `waitForLoadState()` | Esperar a que la página cargue (`'load'`, `'networkidle'`) |
| `waitForSelector()` | Esperar a que un elemento aparezca en el DOM |
| `waitForTimeout(ms)` | Espera fija — **usar solo como último recurso** |

> ⚠️ Evita `waitForTimeout()` — hace los tests lentos y frágiles. El auto-waiting cubre el 90% de los casos.

### Archivo de práctica → `tests/clase-03/01-assertions.spec.ts`

---

## B2 — Organización: describe, Hooks y Tags `60 min`

### describe() — Agrupar tests relacionados

```typescript
test.describe('Login en saucedemo', () => {
  test('login exitoso con standard_user', async ({ page }) => { ... });
  test('login fallido con credenciales incorrectas', async ({ page }) => { ... });
});
```

### Control de ejecución

| Función | Para qué sirve |
|---|---|
| `test.only('nombre', ...)` | Ejecuta SOLO este test — útil para depurar |
| `test.skip('nombre', ...)` | Salta este test |
| `test.describe.only(...)` | Ejecuta SOLO los tests de este grupo |
| `test.fixme('nombre', ...)` | Marca el test como pendiente de arreglar |

> ⚠️ Nunca subas `test.only()` a la rama principal — haría que el pipeline ejecute solo ese test.

### Hooks — Código antes o después de los tests

```typescript
test.describe('Carrito de compras', () => {
  test.beforeEach(async ({ page }) => {
    // login antes de cada test
    await page.goto('https://www.saucedemo.com');
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
  });

  test.afterEach(async ({ page }) => {
    await page.screenshot({ path: 'evidencias/ultimo-estado.png' });
  });
});
```

> `beforeEach` es el hook más usado — ideal para hacer login antes de cada test.  
> `afterEach` es ideal para tomar capturas de evidencia al finalizar.

### Tags — Etiquetar y filtrar tests

```typescript
test('login exitoso @smoke', async ({ page }) => { ... });
test('agregar al carrito @smoke @regression', async ({ page }) => { ... });
test('validar precio con descuento @regression', async ({ page }) => { ... });
```

```bash
npx playwright test --grep @smoke       # solo smoke
npx playwright test --grep @regression  # solo regression
npx playwright test --grep-invert @regression  # excluir regression
```

### Estructura de carpetas profesional

```
tests/
├── smoke/
│   └── login.spec.ts
├── regression/
│   ├── carrito.spec.ts
│   └── checkout.spec.ts
└── e2e/
    └── flujo-compra.spec.ts
```

### Archivo de práctica → `tests/clase-03/02-describe-hooks-tags.spec.ts`

---

## B3 — Modos de Ejecución y CLI `30 min`

### Headless vs Headed

| Headless (sin navegador) | Headed (con navegador) |
|---|---|
| Modo por defecto | Abre el navegador visualmente |
| Más rápido — ideal para CI/CD | Ideal para depurar y desarrollar |
| `npx playwright test` | `npx playwright test --headed` |

### Comandos CLI esenciales

| Comando | ¿Qué hace? |
|---|---|
| `npx playwright test` | Todos los tests en headless |
| `npx playwright test --headed` | Con navegador visible |
| `npx playwright test --ui` | UI Mode interactivo |
| `npx playwright test --debug` | Depuración paso a paso con Inspector |
| `npx playwright test archivo.spec.ts` | Un archivo específico |
| `npx playwright test --grep @smoke` | Tests con tag @smoke |
| `npx playwright test --project=chromium` | Solo en Chrome |
| `npx playwright test --workers=1` | Tests en serie |
| `npx playwright show-report` | Abrir el último reporte HTML |

### UI Mode — depuración visual

`npx playwright test --ui` abre una interfaz donde puedes:
- Ejecutar tests individuales con un clic
- Ver el navegador ejecutando cada paso en tiempo real
- Retroceder y avanzar paso a paso (**time travel debugging**)
- Ver el snapshot del DOM en cada momento
- Filtrar por nombre, estado o tag

> Usa UI Mode mientras desarrollas — es mucho más rápido que ejecutar por terminal.

### Archivo de práctica → `tests/clase-03/03-cli-modos.spec.ts`

---

## B4 — Flujo E2E Completo `30 min`

Login → agregar producto al carrito → checkout completo en saucedemo.com.

### 🤖 Uso de IA

Pega el flujo en ChatGPT o Claude y pide:
*"Genera 3 casos de prueba adicionales para el carrito de saucedemo.com en formato Playwright TypeScript"*

Analiza el código generado, verifica que los locators sean correctos y mejóralos si es necesario.

### Archivo de práctica → `tests/clase-03/04-flujo-e2e.spec.ts`

---

## Resumen de la Clase 3

### ✅ Lo que vimos hoy

- Assertions: `toBeVisible`, `toHaveText`, `toHaveURL`...
- Assertions negativas con `.not`
- Auto-waiting y esperas explícitas
- `describe()` para agrupar tests
- `test.only()` y `test.skip()`
- Hooks: `beforeEach`, `afterEach`, `beforeAll`, `afterAll`
- Tags `@smoke` y `@regression`
- Scripts en `package.json`
- Headless vs Headed
- UI Mode para depuración visual
- Flujo E2E: login → carrito → checkout

### 🔜 Clase 4 — Datos y Reportes

- Fixtures de Playwright
- Data-driven testing con JSON y CSV
- Capturas de pantalla automáticas
- Grabación de video
- Reporte HTML nativo y Allure Report
- Primer workflow de GitHub Actions

---

## Referencia rápida — Clase 3

| Código / Comando | ¿Qué hace? |
|---|---|
| `expect(loc).toBeVisible()` | Verificar que el elemento es visible |
| `expect(loc).toHaveText('X')` | Verificar texto exacto |
| `expect(page).toHaveURL(/x/)` | Verificar la URL actual |
| `expect(loc).not.toBeVisible()` | Verificar que NO es visible |
| `test.beforeEach(async ({page})` | Código antes de cada test |
| `test.afterEach(async ({page})` | Código después de cada test |
| `test.only('nombre', ...)` | Ejecutar solo este test |
| `test.skip('nombre', ...)` | Saltar este test |
| `npx playwright test --grep @X` | Ejecutar solo tests con tag @X |
| `npx playwright test --ui` | Abrir UI Mode visual |

---

## 🎯 Tarea para la próxima clase

Agrega un test de ordenamiento de productos: cambia el orden a `'Price (low to high)'` y verifica que el primer producto tiene el precio más bajo. Etiquétalo con `@regression`.
