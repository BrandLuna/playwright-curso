# QA Automation Framework — Playwright + TypeScript + Cucumber (BDD) + CI/CD

[![Cucumber BDD Tests](https://github.com/BrandLuna/playwright-curso/actions/workflows/playwright.yml/badge.svg)](https://github.com/BrandLuna/playwright-curso/actions/workflows/playwright.yml)

Framework de QA Automation para **saucedemo.com**, construido a lo largo de un curso de
**8 clases progresivas**. Esta rama (`main`) contiene el **estado final y completo** del
proyecto: Page Object Model, tests E2E, BDD con Gherkin, CI/CD con GitHub Actions (+ Jenkins
de referencia), reportes HTML/Allure, notificaciones a Slack/Teams, y estandarización de IA/Copilot.

## Stack tecnológico

| Categoría | Herramienta |
|---|---|
| Test runner E2E | [Playwright](https://playwright.dev) + TypeScript |
| BDD / Gherkin | [Cucumber.js](https://cucumber.io) + `tsx` |
| Patrón de diseño | Page Object Model (`BasePage` + páginas específicas) |
| Reportes | HTML nativo de Playwright/Cucumber + [Allure](https://allurereport.org) |
| CI/CD principal | GitHub Actions |
| CI/CD alternativo (demo) | Jenkins (`jenkins/`) |
| Notificaciones | Slack + Microsoft Teams (Incoming Webhooks) |
| IA / Copilot | `.github/copilot-instructions.md` + Playwright MCP como extra opcional (`mcp/`) |

## Instalación rápida

```bash
git clone https://github.com/BrandLuna/playwright-curso.git
cd playwright-curso
npm install
npx playwright install
cp .env.example .env   # opcional, para correr contra saucedemo.com
```

## Comandos principales

```bash
npm test                    # todos los tests Playwright (.spec.ts)
npm run test:smoke          # solo @smoke
npm run cucumber            # todos los escenarios BDD (.feature)
npm run test:all            # Playwright + Cucumber en secuencia
npm run allure:generate && npm run allure:open   # reporte Allure
```

## Estructura del proyecto

```
playwright-curso/
├── pages/                    ← Page Objects (BasePage + paginas de saucedemo.com)
├── tests/                    ← specs Playwright (clase-01..05) + features/step-definitions/support BDD
├── jenkins/                  ← Jenkinsfile + guia (CI/CD alternativo, solo demo)
├── mcp/                      ← Playwright MCP: extra opcional, no evaluado
├── .github/
│   ├── workflows/playwright.yml   ← pipeline de CI/CD (ver seccion de abajo)
│   └── copilot-instructions.md    ← estandares de codigo y prompts para IA/Copilot
├── PROYECTO-FINAL.md          ← criterios de evaluacion del proyecto final del curso
└── package.json
```

## CI/CD — pipeline configurable (Cucumber)

El workflow de `main` ([`.github/workflows/playwright.yml`](.github/workflows/playwright.yml))
corre **solo el flujo BDD con Cucumber** (los tests `.spec.ts` no se ejecutan en este pipeline).
Se dispara automático en cada `push`/`pull_request`, corriendo todos los `.feature`. También se
puede disparar **manualmente** desde la pestaña *Actions* → *Run workflow*, con 2 inputs opcionales:

| Input | Qué hace |
|---|---|
| `feature_path` | Ruta/carpeta de `.feature` a correr (default: todos) |
| `tag` | Filtra escenarios por tag de Cucumber, ej. `@smoke` (opcional) |

Así podés re-ejecutar el pipeline apuntado a un feature o tag puntual sin tocar el `.yml` a mano.
Los tests `.spec.ts` (`npm test`) siguen corriendo localmente igual que siempre, solo que ya no
forman parte de este pipeline de CI en `main`.

## Sobre este proyecto — material de un curso

Este repositorio es tanto un **framework funcional** como el **material de un curso de
automatización QA**. Cada clase del curso vive en su propia rama, con su propio README
explicando qué se agregó y por qué (instalación, configuración, ejercicios):

| Rama | Contenido |
|---|---|
| `clase-01-introduccion` | Entorno, Git, primer test |
| `clase-02-locators` | Locators modernos, CSS, XPath |
| `clase-03-flujos` | Assertions, hooks, tags, flujos E2E |
| `clase-04-datos-reportes` | Fixtures, data-driven, Allure, primer CI |
| `clase-05-pom` | Page Object Model, environments, API testing |
| `clase-06-bdd` | BDD con Cucumber/Gherkin, World, hooks |
| `clase-07-cicd` | CI/CD completo, Jenkins, notificaciones, estandarización de IA |
| `clase-08` | Proyecto final integrado, README de portfolio, extra Playwright MCP |

`main` es el punto de llegada: el framework completo, listo para clonar y usar. Ver
[`PROYECTO-FINAL.md`](PROYECTO-FINAL.md) para los criterios de evaluación del proyecto final.
