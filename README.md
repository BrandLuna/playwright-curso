# QA Automation con Playwright + TypeScript

Curso completo de automatización de pruebas — **8 clases · 3 horas cada una**

## Requisitos previos

- [Node.js LTS](https://nodejs.org) (v20 o superior)
- [Git](https://git-scm.com)
- [VS Code](https://code.visualstudio.com) + extensión **Playwright Test for VSCode**

## Configuración para esta clase

Viene de la Clase 3. Nuevas dependencias instaladas en esta clase:

```bash
npm install  # instala csv-parse, allure-playwright y allure-commandline
```

**Cambios en `playwright.config.ts`** respecto a la Clase 3:
- `screenshot: 'only-on-failure'` — captura automática al fallar
- `video: 'retain-on-failure'` — video solo si falla
- `reporter` — ahora incluye `allure-playwright` además del HTML nativo

**Comandos Allure nuevos:**

```bash
npx allure generate allure-results --clean -o allure-report
npx allure open allure-report
```

## Ejecutar los tests

```bash
npm test                        # todos los tests
npm run test:smoke              # solo tests @smoke
npm run test:regression         # solo tests @regression
npm run test:headed             # con navegador visible
npm run test:report             # abrir reporte HTML
npx allure generate allure-results --clean -o allure-report && npx allure open allure-report
```

## Estructura del proyecto

```
playwright-curso/
├── .github/
│   └── workflows/
│       └── ci.yml              ← Clase 4: primer pipeline CI/CD
├── tests/
│   ├── fixtures/
│   │   └── auth.fixture.ts     ← fixture de login reutilizable
│   ├── data/
│   │   ├── usuarios.json
│   │   └── productos.csv
│   ├── clase-01/ … clase-03/
│   ├── clase-04/
│   │   ├── 01-fixtures.spec.ts
│   │   ├── 02-data-driven.spec.ts
│   │   └── 03-capturas-video.spec.ts
├── playwright.config.ts
├── package.json
└── tsconfig.json
```

---

# Clase 4 — Datos, Reportes & CI/CD

> **Duración:** 3 horas &nbsp;|&nbsp; **App:** [saucedemo.com](https://www.saucedemo.com)

## 🎯 Objetivos

- Usar fixtures para organizar datos de prueba reutilizables
- Ejecutar tests data-driven con JSON y CSV
- Generar capturas y videos como evidencia
- Configurar reportes HTML nativos y Allure
- Crear el primer pipeline de GitHub Actions

---

## B1 — Fixtures y Datos Externos `60 min`

### ¿Qué son los Fixtures?

Los fixtures son datos o funciones reutilizables inyectados en los tests. Evitan repetir el código de configuración en cada archivo.

| Concepto | Descripción |
|---|---|
| **Fixture de Playwright** | Función que provee datos, páginas o contextos reutilizables |
| **Scope: test** | Se crea y destruye para cada test individual |
| **Scope: worker** | Se crea una vez y se comparte entre todos los tests del worker |
| **Uso típico** | Login reutilizable, datos de usuario, configuración de contexto |

### Fixture de login — `tests/fixtures/auth.fixture.ts`

```typescript
import { test as base, Page } from '@playwright/test';

type AuthFixtures = { loggedInPage: Page };

export const test = base.extend<AuthFixtures>({
  loggedInPage: async ({ page }, use) => {
    await page.goto('https://www.saucedemo.com');
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForURL(/inventory/);
    await use(page); // provee la página al test
  },
});
export { expect } from '@playwright/test';
```

Usar el fixture en un test:

```typescript
import { test, expect } from '../fixtures/auth.fixture';

test('agregar producto', { tag: '@smoke' }, async ({ loggedInPage }) => {
  // ya está logueado — el fixture hizo el login
  await loggedInPage.locator('.btn_inventory').first().click();
  await expect(loggedInPage.locator('.shopping_cart_badge')).toHaveText('1');
});
```

> Con el fixture de login ya no necesitas `beforeEach` en cada archivo.

### Data-driven con JSON — `tests/data/usuarios.json`

```typescript
import usuarios from '../data/usuarios.json';

for (const { usuario, password, esperado } of usuarios) {
  test(`login ${esperado} — ${usuario}`, { tag: '@regression' }, async ({ page }) => {
    // un test por cada fila del JSON
  });
}
```

### Data-driven con CSV — `tests/data/productos.csv`

```bash
npm install --save-dev csv-parse
```

```typescript
import { parse } from 'csv-parse/sync';
import * as fs from 'fs';

const productos = parse(fs.readFileSync('tests/data/productos.csv', 'utf-8'), {
  columns: true, skip_empty_lines: true
});

for (const { nombre, precio_esperado } of productos) {
  test(`precio de ${nombre}`, { tag: '@regression' }, async ({ page }) => { ... });
}
```

### Archivos de práctica

- `tests/clase-04/01-fixtures.spec.ts`
- `tests/clase-04/02-data-driven.spec.ts`

---

## B2 — Capturas, Video y Reporte HTML `50 min`

### Configuración en `playwright.config.ts`

```typescript
use: {
  screenshot: 'only-on-failure', // solo cuando falla
  video: 'retain-on-failure',    // graba siempre, guarda solo si falla
  trace: 'on-first-retry',
}
```

### Capturas manuales

```typescript
await page.screenshot({ path: 'evidencias/login.png' });
await page.screenshot({ path: 'evidencias/completa.png', fullPage: true });
await page.locator('.inventory_list').screenshot({ path: 'evidencias/lista.png' });
```

> `retain-on-failure` graba siempre pero solo guarda el video cuando el test falla.

### Reporte HTML — Trace Viewer

| Función | Descripción |
|---|---|
| `npx playwright show-report` | Abrir el reporte del último run |
| Trace Viewer | Grabación paso a paso con snapshot del DOM |
| Filtrar por estado | `passed`, `failed`, `skipped` |

### Archivo de práctica → `tests/clase-04/03-capturas-video.spec.ts`

---

## B3 — Allure Report `30 min`

```bash
npm install --save-dev allure-playwright allure-commandline
```

Configurar en `playwright.config.ts`:

```typescript
reporter: [
  ['html', { open: 'never' }],
  ['allure-playwright'],
],
```

Generar y abrir:

```bash
npx playwright test
npx allure generate allure-results --clean -o allure-report
npx allure open allure-report
```

| | Reporte HTML nativo | Allure Report |
|---|---|---|
| Instalación | Incluido | `npm install` |
| Visual | Básico | Gráficas, tendencias, historial |
| Cuándo usar | Desarrollo local | Reportes formales y CI/CD |

> Puedes tener ambos reporters activos al mismo tiempo.

---

## B4 — GitHub Actions — Primer Pipeline `40 min`

GitHub Actions ejecuta tus tests automáticamente en la nube cada vez que haces push.

> Este es el primer workflow del curso. Se irá mejorando en la Clase 6 con notificaciones.

### `.github/workflows/ci.yml`

```yaml
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
  workflow_dispatch:
```

### ¿Qué hace cada step?

| Step | Para qué sirve |
|---|---|
| `actions/checkout@v4` | Descarga el código al runner |
| `actions/setup-node@v4` | Instala Node.js 20 |
| `npm ci` | Instala dependencias (más rápido que `npm install`) |
| `npx playwright install --with-deps chromium` | Solo Chromium — más rápido |
| `npx playwright test` | Ejecuta todos los tests |
| `upload-artifact` | Guarda el reporte HTML para descargar desde GitHub |
| `if: always()` | Sube el reporte aunque los tests fallen |

### Ver el pipeline en GitHub

1. Haz push → ve a tu repo → pestaña **Actions**
2. Verás el workflow `Playwright CI` ejecutándose
3. Haz clic para ver los logs en tiempo real
4. Cuando termine, descarga el artefacto `playwright-report` desde **Artifacts**

> La primera ejecución puede tardar 3-5 minutos mientras descarga los navegadores.

---

## Resumen de la Clase 4

### ✅ Lo que vimos hoy

- Fixtures para login reutilizable
- Data-driven con JSON y CSV
- Capturas: `on-failure`, manual, `fullPage`
- Video: `retain-on-failure`
- Reporte HTML nativo y Trace Viewer
- Allure Report — instalación y generación
- GitHub Actions — primer workflow en `.yml`

### 🔜 Clase 5 — POM & Environments

- Page Object Model (POM)
- `BasePage` — clase padre con métodos comunes
- Herencia de clases en TypeScript
- Variables de entorno con `.env`
- Multi-ambiente: dev, staging
- Refactor de tests anteriores a POM

---

## Referencia rápida — Clase 4

| Código / Comando | ¿Qué hace? |
|---|---|
| `test.extend<T>({ fixture })` | Crear un fixture personalizado |
| `screenshot: 'only-on-failure'` | Capturas automáticas solo al fallar |
| `video: 'retain-on-failure'` | Video solo cuando el test falla |
| `reporter: ['allure-playwright']` | Activar Allure como reporter |
| `npx allure generate allure-results` | Generar el reporte Allure |
| `npx allure open allure-report` | Abrir el reporte Allure |
| `actions/upload-artifact@v4` | Subir reporte como artefacto en CI |
| `if: always()` | Ejecutar el step aunque fallen los tests |

---

## 🎯 Tarea para la próxima clase

1. Agrega el fixture de login a tus tests existentes y elimina los `beforeEach` duplicados
2. Verifica que el pipeline de GitHub Actions pasa en verde con todos los tests
