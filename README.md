# QA Automation con Playwright + TypeScript

Curso completo de automatización de pruebas — **8 clases · 3 horas cada una**

## Requisitos previos

- [Node.js LTS](https://nodejs.org) (v20 o superior)
- [Git](https://git-scm.com)
- [VS Code](https://code.visualstudio.com) + extensión **Playwright Test for VSCode**

## Instalación desde cero (Clase 1 — B3)

Cada alumno crea su propio proyecto. No se clona este repositorio.

```bash
# 1. Crear una carpeta para el proyecto y entrar en ella
mkdir playwright-curso
cd playwright-curso

# 2. Inicializar el proyecto — esto instala Playwright, TypeScript y genera
#    playwright.config.ts, tsconfig.json y tests de ejemplo automáticamente
npm init playwright@latest

# Durante el asistente selecciona:
#   · TypeScript
#   · tests  (carpeta de tests)
#   · false  (no agregar GitHub Actions por ahora — lo haremos en Clase 4)
#   · true   (instalar navegadores)
```

> Al terminar tendrás el proyecto listo con todos los archivos necesarios. No necesitas instalar TypeScript ni crear `tsconfig.json` manualmente — `npm init playwright@latest` lo hace todo.

> **¿Los navegadores no se instalaron durante el asistente?** Ejecútalos manualmente:
> ```bash
> npx playwright install
> ```

## Ejecutar los tests

```bash
# Todos los tests (modo headless)
npx playwright test

# Con navegador visible
npx playwright test --headed

# Interfaz visual interactiva (UI Mode)
npx playwright test --ui

# Ver el último reporte HTML
npx playwright show-report
```

## Verificar que el entorno está listo

```bash
node --version       # v20.x.x o superior
npm --version        # 10.x.x o superior
git --version        # git version 2.x.x
npx playwright --version  # Version 1.x.x
```

## Estructura del proyecto

```
playwright-curso/
├── tests/              # Tests del curso (.spec.ts)
├── playwright.config.ts  # Configuración principal
├── package.json          # Dependencias y scripts
└── .gitignore            # Excluye node_modules y reports
```

---

# Clase 1 — Entorno, Git & Bienvenida

> **Duración:** 3 horas &nbsp;|&nbsp; **App:** [saucedemo.com](https://www.saucedemo.com)

## 🎯 Objetivos

- Entender qué es QA Automation y cómo cambia tu rol
- Tener Git y GitHub funcionando con el repo del curso
- Verificar el entorno de Playwright listo
- Ejecutar el primer test y ver el reporte HTML
- Grabar el primer flujo con Codegen en saucedemo.com

---

## B0 — Verificación del Entorno `30 min`

Antes de iniciar, ejecuta cada comando y confirma que obtienes una versión:

```bash
node --version          # debe mostrar v20.x.x o superior
npm --version           # debe mostrar 10.x.x o superior
git --version           # debe mostrar git version 2.x.x
npx playwright --version  # debe mostrar Version 1.x.x
```

| Problema | Solución rápida |
|---|---|
| `node / npm` no reconocido | Cierra y vuelve a abrir la terminal. Si persiste, reinstala Node.js |
| `git` no reconocido | Reinicia el equipo después de instalar Git |
| `playwright` no reconocido | Ejecuta `npm install` dentro de la carpeta del proyecto |
| Extensión no aparece | Busca *Playwright Test for VSCode* en el panel de extensiones |

> ✅ **Resultado esperado:** todos los comandos devuelven una versión → podemos avanzar.

---

## B1 — QA Manual vs QA Automation `40 min`

### ¿Qué hace un QA Automation Engineer?

- Escribe código que prueba otro código — automatiza lo que antes se hacía manualmente
- No reemplaza al QA manual — amplifica su capacidad: corre cientos de casos en minutos
- Trabaja junto al equipo de desarrollo durante todo el ciclo
- Mantiene y evoluciona el framework de tests a medida que el producto crece

### Comparativa directa

| QA Manual | QA Automation |
|---|---|
| Ejecuta casos uno a uno | Ejecuta cientos de casos en paralelo |
| Depende del tiempo y disponibilidad | Corre en cualquier momento, incluso a las 3am |
| Reportes manuales o en Excel | Reportes HTML automáticos con capturas y videos |
| Detecta bugs tarde en el ciclo | Detecta bugs en minutos tras cada cambio de código |
| Difícil de escalar con el equipo | El mismo test corre en Chrome, Firefox y Safari a la vez |

### ¿Por qué Playwright?

| Característica | Descripción |
|---|---|
| **Multi-navegador** | Chrome, Firefox y Safari con el mismo código |
| **Auto-waiting** | Espera automáticamente a que los elementos carguen — menos errores |
| **TypeScript nativo** | Detecta errores antes de ejecutar los tests |
| **Codegen** | Graba acciones y genera código TypeScript automáticamente |
| **Reportes integrados** | HTML Report y Trace Viewer sin configuración extra |
| **Industria** | Creado por Microsoft — adoptado en empresas globales |

> ℹ️ **Dato útil:** [saucedemo.com](https://www.saucedemo.com) es la aplicación principal de práctica del curso. Explórala manualmente antes de la Clase 2: login, productos, carrito y checkout.

---

## B2 — Git, GitHub y el Repositorio del Curso `50 min`

Git registra los cambios en tu código. GitHub los guarda en la nube. Los usaremos en cada clase para subir el avance.

### Conceptos clave

| Concepto | Qué es |
|---|---|
| **Repositorio** | La carpeta del proyecto con todo su historial de cambios |
| **Commit** | Un punto de guardado con descripción — snapshot del código |
| **Branch** | Versión paralela del código — cada alumno trabaja en la suya |
| **Push** | Subir commits locales a GitHub |
| **Pull** | Bajar los cambios de GitHub a tu máquina |
| **Clone** | Descargar un repositorio de GitHub por primera vez |

### Clonar el repo y crear tu rama

```bash
# 1. Clonar el repositorio base del curso
git clone git@github.com:INSTRUCTOR/playwright-curso.git

# 2. Entrar a la carpeta
cd playwright-curso

# 3. Crear tu propia rama de trabajo
git checkout -b clase-01-TU-NOMBRE

# 4. Verificar en qué rama estás
git branch
```

> ⚠️ **Importante:** cada alumno trabaja en **su propia rama**, nunca directamente en `main`. El nombre de la rama debe ser `clase-01-tunombre` (sin espacios ni tildes).

### Flujo de trabajo en cada clase

```bash
git status                                   # ver qué archivos cambiaron
git add .                                    # preparar todos los cambios
git commit -m "clase-01: primer test ejecutado"  # guardar con descripción
git push origin clase-01-TU-NOMBRE          # subir a GitHub
```

> 💡 **Consejo:** el mensaje del commit debe describir **qué hiciste**.  
> ✅ `clase-01: agrego test de login`  
> ❌ `cambios`

---

## B3 — Proyecto Playwright y Primer Test `50 min`

### Estructura del proyecto

```
playwright-curso/
├── tests/
│   └── example.spec.ts
├── node_modules/         # NO tocar, NO subir a GitHub
├── playwright.config.ts
├── package.json
└── .gitignore
```

| Archivo/Carpeta | Para qué sirve |
|---|---|
| `tests/` | Aquí escribirás todos tus tests — extensión `.spec.ts` |
| `playwright.config.ts` | Configuración principal: navegadores, timeout, reporte, baseURL |
| `package.json` | Lista de dependencias y scripts del proyecto |
| `node_modules/` | Dependencias instaladas — NO tocar, NO subir a GitHub |
| `.gitignore` | Archivos que Git ignora — ya excluye `node_modules` automáticamente |

### playwright.config.ts — opciones esenciales

| Opción | Descripción |
|---|---|
| `testDir` | Carpeta donde Playwright busca los tests — por defecto `./tests` |
| `baseURL` | URL base de la app — permite usar `'/'` en vez de la URL completa |
| `reporter` | Formato del reporte — `'html'` genera el reporte visual |
| `retries` | Reintentos si un test falla — en CI se recomienda `2`, en local `0` |
| `use.trace` | `'on-first-retry'` guarda grabación detallada cuando falla un test |

### Ejecutar los tests de ejemplo

```bash
npx playwright test           # headless — sin abrir el navegador
npx playwright test --headed  # con navegador visible
npx playwright test --ui      # interfaz visual interactiva
npx playwright show-report    # abrir el último reporte generado
```

> ✅ **Resultado esperado:** deberías ver `6 passed` al ejecutar `npx playwright test`. Luego `npx playwright show-report` abre el reporte HTML en el navegador.

### Anatomía de un test — entender el ejemplo

```typescript
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await expect(page).toHaveTitle(/Playwright/);
});
```

| Parte | Qué hace |
|---|---|
| `test('nombre', ...)` | Define un test con su nombre descriptivo |
| `async ({ page })` | `page` representa el navegador — es tu herramienta principal |
| `await page.goto(url)` | Navega a una URL — `await` espera a que cargue antes de continuar |
| `expect(...).toHaveTitle()` | Verifica que el título sea el esperado — si falla, el test falla |

---

## B4 — Codegen + IA `30 min`

Codegen abre un navegador, graba tus acciones y genera el código TypeScript automáticamente.

### Lanzar Codegen

```bash
npx playwright codegen https://www.saucedemo.com
```

Se abrirán dos ventanas: el navegador y el panel de código. Navega por saucedemo.com y el código se genera solo.

### Flujo a grabar en clase

| Acción | Código generado por Codegen |
|---|---|
| Ir a saucedemo.com | `page.goto('https://www.saucedemo.com')` |
| Usuario: `standard_user` | `page.fill('#user-name', 'standard_user')` |
| Password: `secret_sauce` | `page.fill('#password', 'secret_sauce')` |
| Click en Login | `page.click('#login-button')` |
| Verificar que llegó al inicio | `expect(page).toHaveURL(/inventory/)` |

> ⚠️ **Importante:** el código generado por Codegen es un punto de partida. En la Clase 2 aprenderemos a mejorar los locators que genera.

### 🤖 Uso de IA

Abre GitHub Copilot Chat (o ChatGPT / Claude) y pega el código generado por Codegen.

Pregunta: *"¿Qué hace este código línea a línea?"*

La IA explica cada línea en contexto — ideal para reforzar lo visto en clase.

### Guardar y subir el test

```bash
git add tests/login.spec.ts
git commit -m "clase-01: agrego test de login con codegen"
git push origin clase-01-TU-NOMBRE
```

---

## Resumen de la Clase 1

### ✅ Lo que vimos hoy

- QA Manual vs QA Automation
- Git: clone, branch, commit, push
- Estructura del proyecto Playwright
- `playwright.config.ts` — opciones clave
- Ejecutar tests y ver el reporte HTML
- Codegen en saucedemo.com
- IA para entender código generado

### 🔜 Clase 2 — Fundamentos de Playwright

- HTML y DOM — inspección con DevTools
- Locators modernos: `getByRole`, `getByText`, `getByLabel`...
- XPath y CSS como último recurso
- Interacciones: click, fill, navigate
- Mini flujo completo de login

---

## Referencia rápida de comandos

| Comando | ¿Qué hace? |
|---|---|
| `npx playwright test` | Ejecutar todos los tests |
| `npx playwright test --headed` | Ejecutar con navegador visible |
| `npx playwright test --ui` | Abrir UI Mode visual |
| `npx playwright show-report` | Ver el último reporte HTML |
| `npx playwright codegen URL` | Grabar un flujo y generar código |
| `git checkout -b nombre-rama` | Crear y cambiar a una nueva rama |
| `git commit -m "mensaje"` | Guardar cambios con descripción |
| `git push origin nombre-rama` | Subir cambios a GitHub |

---

## 🎯 Tarea para la próxima clase

Explora [saucedemo.com](https://www.saucedemo.com) manualmente: **login → productos → carrito → checkout**.

Anota qué elementos usarías para automatizar cada pantalla — lo necesitarás en la Clase 2.

