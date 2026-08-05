# QA Automation con Playwright + TypeScript

Curso completo de automatización de pruebas — **8 clases · 3 horas cada una**

## Requisitos previos

- [Node.js LTS](https://nodejs.org) (v20 o superior)
- [Git](https://git-scm.com)
- [VS Code](https://code.visualstudio.com) + extensión **Playwright Test for VSCode**

## Instalación desde cero

```bash
mkdir playwright-curso
cd playwright-curso
npm init playwright@latest

# Durante el asistente selecciona:
#   · TypeScript
#   · tests  (carpeta de tests)
#   · false  (no agregar GitHub Actions por ahora — lo haremos en Clase 4)
#   · true   (instalar navegadores)
```

> **¿Los navegadores no se instalaron?** Ejecútalos manualmente: `npx playwright install`

## Ejecutar los tests

```bash
npx playwright test                        # todos los tests
npx playwright test tests/clase-02/        # solo los tests de esta clase
npx playwright test --headed               # con navegador visible
npx playwright test --ui                   # UI Mode interactivo
npx playwright show-report                 # ver el último reporte HTML
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
│   ├── clase-02/
│   │   ├── 01-locators-modernos.spec.ts
│   │   ├── 02-xpath-css.spec.ts
│   │   ├── 03-interacciones.spec.ts
│   │   └── 04-mini-flujo-completo.spec.ts
├── playwright.config.ts
├── package.json
└── tsconfig.json
```

---

# Clase 2 — Fundamentos de Playwright: Locators e Interacciones

> **Duración:** 3 horas &nbsp;|&nbsp; **App:** [demoqa.com](https://demoqa.com) + [saucedemo.com](https://www.saucedemo.com)

## 🎯 Objetivos

- Entender qué es el DOM y cómo inspeccionarlo con DevTools
- Dominar los locators modernos de Playwright y cuándo usar cada uno
- Conocer XPath y CSS como alternativa cuando los modernos no alcanzan
- Escribir interacciones básicas: click, fill, hover, select, keyboard
- Construir un mini flujo completo combinando todo lo aprendido

---

## B1 — HTML, DOM y DevTools `50 min`

### ¿Qué es el DOM?

El **DOM** (Document Object Model) es la representación en árbol de todos los elementos de una página web. Playwright interactúa con el DOM para encontrar y manipular elementos.

```
<html>
  └── <body>
        └── <form>
              ├── <input id="username" />
              └── <button class="btn-login">Login</button>
```

### Atributos clave para automation

| Atributo | Ejemplo | Prioridad |
|---|---|---|
| `data-testid` | `data-testid="submit-btn"` | ⭐ Ideal — creado para tests |
| `id` | `id="username"` | ✅ Bueno — único en la página |
| `role` + `name` | `role="button" name="Login"` | ✅ Semántico |
| `class` | `class="btn-primary"` | ⚠️ Frágil — cambia con el diseño |
| `xpath` | `//input[@type='text']` | ⚠️ Último recurso |

### Inspeccionar elementos en DevTools

1. Abre [demoqa.com/text-box](https://demoqa.com/text-box) en Chrome
2. Click derecho sobre cualquier input → **Inspect**
3. En el panel Elements, busca `id`, `class`, `placeholder`, `data-testid`
4. Usa **Ctrl+Shift+C** para seleccionar elementos directamente en la página

### Estructura del proyecto — repaso

| Archivo | Para qué sirve |
|---|---|
| `tests/` | Todos los tests — extensión `.spec.ts` |
| `playwright.config.ts` | Navegadores, timeout, baseURL, reportes |
| `tsconfig.json` | Configuración de TypeScript |
| `package.json` | Dependencias y scripts |

---

## B2 — Locators Modernos de Playwright `70 min`

Los locators son la forma de decirle a Playwright **dónde está el elemento** que quieres interactuar.

### Jerarquía de preferencia

```
1. getByRole        → semántico, resistente a cambios de CSS
2. getByLabel       → para inputs con label visible
3. getByPlaceholder → para inputs con placeholder
4. getByText        → para textos visibles
5. getByTestId      → cuando el equipo agrega data-testid
6. getByAltText     → para imágenes
7. locator('css')   → CSS como alternativa
8. locator('xpath') → XPath como último recurso
```

### getByRole — el más importante

Busca por el **rol semántico** del elemento (lo que ES, no cómo se ve).

```typescript
page.getByRole('button', { name: 'Submit' })  // botón con texto Submit
page.getByRole('link', { name: 'Get started' }) // enlace
page.getByRole('heading', { name: 'Dashboard' }) // h1, h2, h3...
page.getByRole('textbox', { name: 'Full Name' }) // input de texto
page.getByRole('checkbox', { name: 'Agree' })    // checkbox
page.getByRole('combobox')                        // select/dropdown
```

### getByLabel

Busca un input por el texto de su `<label>` asociado.

```typescript
page.getByLabel('Full Name')    // input asociado al label "Full Name"
page.getByLabel('Email')        // input de email
```

### getByPlaceholder

Busca por el atributo `placeholder` del input.

```typescript
page.getByPlaceholder('Enter your name')
page.getByPlaceholder('name@example.com')
```

### getByText

Busca elementos que contengan un texto visible.

```typescript
page.getByText('Submit')              // coincidencia exacta
page.getByText('Submit', { exact: false }) // texto parcial
```

### getByTestId

Busca por el atributo `data-testid` — el más estable cuando el equipo lo implementa.

```typescript
page.getByTestId('submit-button')
page.getByTestId('user-menu')
```

### Encadenamiento de locators

Puedes filtrar dentro de un contenedor para ser más preciso:

```typescript
// dentro de un formulario específico, busca el botón Submit
page.locator('#registration-form').getByRole('button', { name: 'Submit' })
```

### Archivo de práctica → `tests/clase-02/01-locators-modernos.spec.ts`

---

## B3 — XPath y CSS Selectors `40 min`

Úsalos cuando los locators modernos no son suficientes. No son la primera opción.

### CSS Selectors

```typescript
page.locator('#id-del-elemento')          // por ID
page.locator('.nombre-clase')             // por clase
page.locator('input[type="text"]')        // por atributo
page.locator('div > p')                   // hijo directo
page.locator('li:nth-child(2)')           // segundo elemento de la lista
```

### XPath

```typescript
page.locator('//button[text()="Submit"]')          // texto exacto
page.locator('//input[@placeholder="Full Name"]')  // por atributo
page.locator('//div[contains(@class, "error")]')   // clase parcial
page.locator('(//li)[2]')                          // segundo elemento
```

### Regla de oro

> Usa locators semánticos (`getByRole`, `getByLabel`) siempre que puedas.  
> CSS cuando necesites filtrar por estructura o atributos específicos.  
> XPath solo cuando CSS tampoco alcance.

### Playwright Inspector — probar locators en vivo

```bash
npx playwright test --debug   # abre el inspector con el test pausado
```

También puedes usar la extensión de VS Code: haz click en el ícono de lupa junto a cualquier test.

### Archivo de práctica → `tests/clase-02/02-xpath-css.spec.ts`

---

## B4 — Interacciones Básicas `40 min`

Una vez que encuentras el elemento, estas son las acciones que puedes ejecutar sobre él.

### Navegación

```typescript
await page.goto('https://demoqa.com/text-box') // navegar a URL
await page.goBack()                             // botón atrás
await page.reload()                             // recargar página
```

### Clicks

```typescript
await page.getByRole('button').click()          // click normal
await page.getByRole('button').dblclick()       // doble click
await page.getByRole('button').click({ button: 'right' }) // click derecho
```

### Texto e inputs

```typescript
await page.getByLabel('Name').fill('Juan Pérez')   // limpiar y escribir
await page.getByLabel('Name').clear()              // limpiar el campo
await page.getByLabel('Name').type('Juan')         // escribir carácter a carácter
```

### Selects / Dropdowns

```typescript
await page.getByRole('combobox').selectOption('volvo')         // por valor
await page.getByRole('combobox').selectOption({ label: 'Volvo' }) // por texto visible
```

### Hover y teclado

```typescript
await page.getByText('Hover me').hover()               // pasar el mouse por encima
await page.getByLabel('Name').press('Enter')           // presionar tecla
await page.getByLabel('Name').press('Control+A')       // atajo de teclado
```

### Checkbox y radio

```typescript
await page.getByLabel('Agree to terms').check()        // marcar
await page.getByLabel('Agree to terms').uncheck()      // desmarcar
await page.getByLabel('Male').check()                  // radio button
```

### Archivo de práctica → `tests/clase-02/03-interacciones.spec.ts`

---

## B5 — Mini Flujo Completo `20 min`

Combinamos locators e interacciones en un flujo real sobre [demoqa.com/automation-practice-form](https://demoqa.com/automation-practice-form).

El formulario tiene: nombre, apellido, email, género, teléfono, fecha de nacimiento, materias, hobbies y una foto — cubre casi todos los tipos de input en una sola página.

### Flujo a grabar con Codegen

```bash
npx playwright codegen https://demoqa.com/automation-practice-form
```

Completa el formulario con datos de prueba y observa el código generado. Luego mejora los locators usando lo aprendido en B2.

### 🤖 Uso de IA

Pega el código generado por Codegen en Copilot y pregunta:
*"¿Cuál es el locator más adecuado para cada campo según las buenas prácticas de Playwright?"*

### Archivo de práctica → `tests/clase-02/04-mini-flujo-completo.spec.ts`

---

## Resumen de la Clase 2

### ✅ Lo que vimos hoy

- DOM e inspección con DevTools
- Jerarquía de locators: `getByRole` → `getByLabel` → CSS → XPath
- Interacciones: click, fill, hover, select, keyboard, checkbox
- Playwright Inspector para probar locators en vivo
- Mini flujo completo con el formulario de demoqa

### 🔜 Clase 3 — Flujos, Organización & Ejecución

- Assertions: `toBeVisible`, `toHaveText`, `toHaveURL`...
- `describe`, `test.only`, `test.skip`, hooks
- Tags: `@smoke`, `@regression`
- CLI: `--headed`, `--grep`, `--project`
- UI Mode y Trace Viewer

---

## Referencia rápida — Locators

| Locator | Cuándo usarlo |
|---|---|
| `getByRole('button', { name })` | Siempre que el elemento tenga un rol semántico |
| `getByLabel('texto')` | Inputs con label visible |
| `getByPlaceholder('texto')` | Inputs con placeholder |
| `getByText('texto')` | Cualquier elemento por su texto visible |
| `getByTestId('id')` | Cuando el equipo usa `data-testid` |
| `locator('#id')` | ID único en la página |
| `locator('.clase')` | Clase CSS — solo si no hay mejor opción |
| `locator('xpath=...')` | Último recurso |

---

## 🎯 Tarea para la próxima clase

1. Abre [demoqa.com/elements](https://demoqa.com/elements) y explora cada sección
2. Para cada elemento que encuentres, decide qué locator usarías y por qué
3. Intenta automatizar el formulario completo de [demoqa.com/automation-practice-form](https://demoqa.com/automation-practice-form) con lo aprendido hoy
