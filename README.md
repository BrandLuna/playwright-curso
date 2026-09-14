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

# Clase 8 — Proyecto Final, MCP & Cierre

> **Duración:** 3 horas &nbsp;|&nbsp; **Clase final del curso**

## 🎯 Objetivos

- Consolidar el framework completo: POM + BDD + CI/CD + reportes + IA, todo funcionando junto
- Dejar el README listo para mostrarse en una entrevista de trabajo
- Entender los criterios de evaluación del proyecto final del curso
- Practicar de forma general todo lo visto en las clases anteriores, de cara al proyecto final

> 🎁 Como regalo extra (fuera del temario oficial), esta clase incluye una introducción a
> **Playwright MCP** — no es la práctica de la clase, es solo un ejemplo de una herramienta de
> IA relacionada con Playwright que vale la pena que conozcas. Ver el bloque B3 más abajo.

---

## B1 — Integración final del framework `60 min`

Antes de entregar el proyecto final, verifica que todo lo construido en clases anteriores sigue
funcionando junto:

### Checklist de integración

- [x] `pages/`, `tests/features/`, `tests/step-definitions/`, `tests/support/` presentes y en uso
- [x] `.github/workflows/playwright.yml`, `.env.example`, `cucumber.json`, `playwright.config.ts` presentes
- [x] `npx playwright test` y `npm run cucumber` corren sin errores
- [x] Pipeline de GitHub Actions con Playwright + Cucumber + artefactos + notificaciones Slack/Teams
- [x] `jenkins/` como alternativa documentada, homologada a los mismos comandos
- [x] `.github/copilot-instructions.md` con estándares de código y prompts reutilizables

### Cómo verificarlo localmente

```bash
npx playwright test      # no deberia haber errores de compilacion ni tests rotos
npm run cucumber         # los escenarios .feature deben correr sin errores
```

### Archivo de práctica → todo el repositorio (es una revisión integral, no un archivo nuevo)

---

## B2 — README profesional para portfolio `60 min`

Un README listo para mostrarse en una entrevista debe responder, sin explicación adicional:

| Pregunta del reclutador | Dónde se responde en este README |
|---|---|
| ¿Qué hace este proyecto? | Descripción del proyecto |
| ¿Con qué tecnologías? | Stack tecnológico |
| ¿Cómo lo corro? | Instalación paso a paso + Comandos disponibles |
| ¿Cómo está organizado? | Estructura del proyecto |
| ¿Qué tan profesional es? | Buenas prácticas aplicadas + badge de CI en verde |
| ¿Qué debería preguntarle en la entrevista? | Sobre este proyecto (para reclutadores) |

El badge de GitHub Actions al inicio de este README (`Playwright Tests`) es el primer indicador
visual de que el pipeline funciona — es lo primero que ve un reclutador al abrir el repositorio.

### Archivo de práctica → este mismo `README.md` (parte superior del archivo)

---

## B3 — Proyecto final + extra: Playwright MCP `60 min`

### Proyecto final

Ver [`PROYECTO-FINAL.md`](PROYECTO-FINAL.md) para los criterios de evaluación, los flujos mínimos
requeridos sobre saucedemo.com, los entregables esperados y cómo crear tu rama
`proyecto-final-TUNOMBRE` a partir de este framework. Esta es la práctica real de la Clase 8:
un repaso integral de todo el curso (POM, BDD, CI/CD, reportes) aplicado de punta a punta.

### 🎁 Extra: Playwright MCP (no evaluado, no es la práctica de la clase)

Ver [`mcp/README-mcp.md`](mcp/README-mcp.md). Es contenido **aparte** del framework principal y
de los criterios de `PROYECTO-FINAL.md`: solo busca que conozcas que Playwright tiene un MCP
oficial (`@playwright/mcp`) y para qué sirve en la práctica — generar casos de test o el
esqueleto inicial de un proyecto a partir de un prompt, en vez de escribirlos a mano. El repo
incluye [`.vscode/mcp.json`](.vscode/mcp.json) para habilitarlo si querés probarlo, con una tabla
explicando qué es, cómo funciona y cómo interactúa con el navegador, más un ejercicio opcional.

### Archivos de práctica

- `PROYECTO-FINAL.md`
- `mcp/README-mcp.md`

---

## ✅ Resumen final del curso

- Clase 1-2: fundamentos de Playwright y locators
- Clase 3: flujos E2E, hooks y tags
- Clase 4: data-driven testing, fixtures y evidencias
- Clase 5: Page Object Model y variables de entorno
- Clase 6: BDD con Cucumber/Gherkin
- Clase 7: CI/CD con GitHub Actions + Jenkins, notificaciones y estandarización de IA
- Clase 8: proyecto final integrado, README de portfolio y cierre del curso

---

## Referencia rápida — Clase 8

| Comando / Archivo | ¿Qué hace? |
|---|---|
| `npm run test:all` | Corre Playwright y Cucumber en secuencia |
| `npm run allure:generate` / `allure:open` | Genera y abre el reporte Allure |
| `PROYECTO-FINAL.md` | Criterios de evaluación y entregables del proyecto final |
| `mcp/README-mcp.md` | Extra opcional: Playwright MCP |
| `.github/copilot-instructions.md` | Estándares de código y prompts para Copilot |

---

## 🎯 Próximos pasos

1. Corre el checklist de integración final (B1) y confirma que todo pasa en verde
2. Lee [`PROYECTO-FINAL.md`](PROYECTO-FINAL.md) completo antes de crear tu rama de entrega
3. Crea tu rama `proyecto-final-TUNOMBRE` y empieza a trabajar tu proyecto final
