# Instrucciones para GitHub Copilot — QA Automation con Playwright + TypeScript

Este proyecto es un **framework de QA Automation** construido con:
- Playwright + TypeScript (tests E2E)
- Cucumber + Gherkin (BDD)
- Page Object Model (POM) con `BasePage`
- GitHub Actions como CI/CD principal + Jenkins como material de aprendizaje
- Reportes HTML (Playwright/Cucumber) y Allure
- Notificaciones a Slack / Microsoft Teams al finalizar el pipeline

El objetivo de este archivo es **estandarizar el uso de Copilot/IA** en el proyecto:
mismos patrones, mismos nombres, mismas convenciones en cualquier sesión de trabajo.

---

## Arquitectura del proyecto

```
pages/              ← Page Objects (locators como getters + acciones)
tests/
├── clase-01..05/    ← specs Playwright acumulativos por clase
├── features/        ← archivos Gherkin (.feature)
├── step-definitions/ ← implementación de steps Cucumber
├── support/          ← world.ts (CustomWorld) + hooks.ts
└── utils/
    ├── data/         ← JSON y CSV para data-driven testing
    ├── fixtures/     ← Playwright fixtures (auth.fixture.ts)
    └── helpers.ts    ← funciones genéricas reutilizables
jenkins/             ← Jenkinsfile y guía (solo demo del instructor, no es el flujo principal)
.github/workflows/   ← GitHub Actions (flujo principal de CI/CD)
```

---

## Estándares de código

### Page Objects
- **Siempre extender `BasePage`**
- **Locators como getters** (lazy, se re-evalúan en cada llamada)
- **Locators con `data-test`** cuando existan en la app
- **Acciones en español** cuando el método describe un flujo de negocio

```typescript
// ✅ Correcto
export class LoginPage extends BasePage {
  get loginButton() { return this.page.locator('[data-test="login-button"]'); }
  async login(user: string, pass: string) { ... }
}

// ❌ Incorrecto
class LoginPage {
  async clickLogin() { await this.page.click('#login-button'); } // no extiende BasePage, no usa getter
}
```

### Tests `.spec.ts`
- Usar `test.describe()` para agrupar por funcionalidad
- Tags con sintaxis `{ tag: '@smoke' }` (no en el nombre del test)
- `beforeEach` para setup compartido; `fixture` para reutilizar entre archivos
- Sin lógica de UI en los specs — solo llamadas a métodos de páginas

### Features Gherkin
- Nombres de archivo en kebab-case español: `flujo-de-compra.feature`
- `Background` para pasos compartidos en todos los escenarios
- `Scenario Outline` + `Examples` para datos parametrizados
- Tags en la línea anterior al `Scenario`: `@smoke`, `@regression`

### Nombrado general
- Archivos: `kebab-case.ts`
- Clases: `PascalCase`
- Funciones/métodos: `camelCase`
- Variables de entorno: `SCREAMING_SNAKE_CASE` con prefijo descriptivo (ej: `SAUCEDEMO_USERNAME`)

### CI/CD (GitHub Actions y Jenkins)
- El flujo principal vive en `.github/workflows/playwright.yml` — **no** duplicar lógica de
  negocio ahí, solo orquestación (checkout, install, test, reportes, notificación)
- Jenkins (`jenkins/Jenkinsfile`) es material de aprendizaje: debe reflejar los **mismos
  comandos** que el workflow de GitHub Actions (`npm ci`, `npx playwright install --with-deps`,
  `npx playwright test`, `npm run cucumber`) para no generar dos comportamientos distintos
- Nunca hardcodear webhooks, tokens o credenciales en los YAML/Jenkinsfile — siempre usar
  `secrets.*` (GitHub) o `credentials()` (Jenkins)
- Cualquier notificación nueva (Slack, Teams, email, etc.) debe ser condicional: si el secret
  no está configurado, el paso debe omitirse en vez de fallar el pipeline

---

## Prompts útiles para Copilot

### Generar un Page Object
```
Genera una Page Object class para [nombre de página] en saucedemo.com.
Extiende BasePage, usa locators data-test como getters, e incluye métodos para [acciones].
Sigue la estructura del archivo pages/LoginPage.ts de este proyecto.
```

### Generar un test data-driven
```
Genera un test data-driven en Playwright TypeScript que lea usuarios desde
tests/utils/data/usuarios.json y ejecute un caso por cada fila.
Usa el patrón for...of como en tests/clase-04/02-data-driven.spec.ts.
```

### Generar un feature Gherkin
```
Convierte estos casos de prueba al formato Gherkin en español:
[lista de casos]
Usa Background para el paso inicial, tags @smoke o @regression según corresponda,
y Scenario Outline si hay variantes de datos.
```

### Refactorizar con POM
```
Refactoriza este test para usar el Page Object Model del proyecto.
Crea la Page Object class si no existe, extiende BasePage, y mueve
los locators como getters con atributos data-test.
```

### Revisar errores
```
Este test de Playwright falla con el siguiente error: [error]
El locator usado es: [locator]
Sugiere un locator alternativo y explica por qué el actual puede estar fallando.
```

### Modificar el pipeline de CI/CD
```
Agrega un nuevo step al job [playwright|cucumber] de .github/workflows/playwright.yml
que [acción concreta, ej: suba el reporte X como artefacto].
Mantén el mismo estilo de comentarios en español que ya usa el archivo,
no dupliques la lógica de notificación existente en el job "notify".
```

---

## Lo que Copilot NO debe hacer en este proyecto

- ❌ Usar `page.click(selector)` o `page.fill(selector, value)` — API obsoleta
- ❌ Crear Page Objects sin extender `BasePage`
- ❌ Usar `waitForTimeout()` como espera estándar
- ❌ Hardcodear URLs, credenciales o webhooks — usar `process.env.*` / `secrets.*`
- ❌ Mezclar lógica de UI en los archivos `.spec.ts`
- ❌ Crear step-definitions que no usen `CustomWorld`
- ❌ Mezclar la configuración de Jenkins dentro de `.github/workflows/` (o viceversa)
- ❌ Squashear o reescribir historial de commits sin que el usuario lo pida explícitamente
