# QA Automation con Playwright + TypeScript + Cucumber

Curso completo de automatización de pruebas — **8 clases · 3 horas cada una**

## Requisitos previos

- [Node.js LTS](https://nodejs.org) (v20 o superior)
- [Git](https://git-scm.com)
- [VS Code](https://code.visualstudio.com) + extensión **Playwright Test for VSCode**
- Cuenta de GitHub con Actions habilitado (viene por defecto en repos públicos/privados)
- (Opcional) Un workspace de Slack y/o Microsoft Teams si quieres probar las notificaciones

## Configuración para esta clase

Continúas el proyecto de la Clase 6. Esta clase no agrega dependencias npm nuevas — el trabajo es
de configuración de CI/CD (GitHub Actions + Jenkins) y notificaciones.

**Configura los secrets del repositorio** (Settings → Secrets and variables → Actions):

```
BASE_URL=https://www.saucedemo.com
SAUCEDEMO_USERNAME=standard_user
SAUCEDEMO_PASSWORD=secret_sauce
SLACK_WEBHOOK_URL=<tu Incoming Webhook de Slack>       # opcional
TEAMS_WEBHOOK_URL=<tu Incoming Webhook de Teams>       # opcional
```

> Si no configuras `SLACK_WEBHOOK_URL` o `TEAMS_WEBHOOK_URL`, esos pasos del pipeline se omiten
> automáticamente — no hace falta tener ambos para que el resto del pipeline funcione.

**Revisa el pipeline ya armado** en `.github/workflows/playwright.yml` y la carpeta `jenkins/`
(material de aprendizaje, no se ejecuta automáticamente).

**Agrega `allure-playwright` como reporter** en `playwright.config.ts` (junto al reporter `html`)
para que cada corrida genere `allure-results/`.

## Ejecutar los tests

```bash
# Tests Playwright (.spec.ts)
npm test
npm run test:smoke

# Tests BDD con Cucumber (.feature)
npm run cucumber
npm run cucumber:smoke
npm run cucumber:regression

# Reporte Allure (a partir de allure-results/)
npm run allure:generate
npm run allure:open
```

## Estructura del proyecto

```
playwright-curso/
├── pages/                          ← Page Objects (reutilizados por spec y steps)
├── tests/
│   ├── clase-01/ … clase-05/        ← specs Playwright acumulativos
│   ├── features/                    ← archivos Gherkin (.feature)
│   ├── step-definitions/            ← implementación de steps Cucumber
│   ├── support/                     ← world.ts (CustomWorld) + hooks.ts
│   └── utils/
│       ├── data/                    ← JSON/CSV para data-driven testing
│       ├── fixtures/                ← Playwright fixtures
│       └── helpers.ts
├── jenkins/                         ← Jenkinsfile + guía (demo del instructor)
│   ├── Jenkinsfile
│   └── README.md
├── .github/
│   ├── workflows/playwright.yml     ← pipeline principal de CI/CD (GitHub Actions)
│   └── copilot-instructions.md      ← estándares de código y prompts para IA/Copilot
├── cucumber.json
├── playwright.config.ts             ← reporters: html + allure-playwright
└── package.json
```

---

# Clase 7 — CI/CD completo, Jenkins y estandarización de IA

> **Duración:** 3 horas &nbsp;|&nbsp; **App:** [saucedemo.com](https://www.saucedemo.com)

## 🎯 Objetivos

- Consolidar el pipeline de GitHub Actions como flujo principal de CI/CD
- Conocer Jenkins como alternativa (material de aprendizaje, carpeta separada)
- Configurar notificaciones a Slack y Microsoft Teams al finalizar el pipeline
- Generar reportes Allure además de los reportes HTML de Playwright/Cucumber
- Adoptar un uso estandarizado de GitHub Copilot en el proyecto

---

## B1 — Pipeline de GitHub Actions `60 min`

Definido en [`.github/workflows/playwright.yml`](.github/workflows/playwright.yml). Se dispara con
`push`/`pull_request` hacia `main`/`clase-06-bdd`/`clase-07-cicd`, o manualmente (`workflow_dispatch`).

```
push / pull_request → GitHub Actions
         ├── Job "playwright"  → npx playwright test tests/clase-05 (flujo clásico, sin BDD)
         │                       sube playwright-report/ y allure-results/
         │                       notifica Slack y Teams con el resultado de ESTE job
         └── Job "cucumber"    → npm run cucumber (flujo BDD)
                                  sube cucumber-report.html
                                  notifica Slack y Teams con el resultado de ESTE job
```

Los dos jobs corren en paralelo y son independientes **a propósito**: sirven para comparar, lado a
lado, cómo se ve el pipeline con el enfoque clásico de Playwright y cómo se ve con BDD. Cada uno
notifica su propio resultado — no hay un job de notificación consolidado.

### Secrets necesarios

| Secret | Uso |
|---|---|
| `BASE_URL` | URL base de la app |
| `SAUCEDEMO_USERNAME` / `SAUCEDEMO_PASSWORD` | Credenciales usadas en los tests |
| `SLACK_WEBHOOK_URL` | Incoming Webhook de Slack (opcional) |
| `TEAMS_WEBHOOK_URL` | Incoming Webhook de Microsoft Teams (opcional) |

### Archivo de práctica → [`.github/workflows/playwright.yml`](.github/workflows/playwright.yml)

---

## B2 — Notificaciones Slack & Teams + Reportes Allure `50 min`

### Slack (por job)

Usa la Action oficial `slackapi/slack-github-action@v2.1.0` con un Incoming Webhook, mandando un
payload en formato Block Kit con el resultado del job, la rama, el commit y el link al run.

### Microsoft Teams (por job)

Se envía con `curl` directo a un Incoming Webhook (formato `MessageCard`), sin depender de una
Action de terceros — mismo patrón que Slack, mismo `if: !cancelled()`.

```bash
curl -sS -H "Content-Type: application/json" -d '{ "@type": "MessageCard", ... }' "$TEAMS_WEBHOOK_URL"
```

### Reportes Allure

`playwright.config.ts` usa dos reporters (`html` + `allure-playwright`), por lo que cada corrida
genera `allure-results/`:

```bash
npm run allure:generate   # combina allure-results/ en allure-report/
npm run allure:open       # abre el reporte en el navegador
```

### Archivo de práctica → `.github/workflows/playwright.yml` (pasos `Notify Slack` / `Notify Teams`)

---

## B3 — Jenkins (alternativa) + Estandarización de IA `40 min`

### Jenkins como material de aprendizaje

Ver [`jenkins/README.md`](jenkins/README.md) y [`jenkins/Jenkinsfile`](jenkins/Jenkinsfile). Esta
carpeta **no** forma parte del flujo automático del repositorio: es una guía para practicar cómo se
configuraría el mismo pipeline (mismos comandos `npm ci` / `playwright test` / `cucumber`) en un
servidor Jenkins propio, con notificaciones a Slack y Teams equivalentes, una por stage.

| | GitHub Actions | Jenkins |
|---|---|---|
| Infraestructura | Nube de GitHub | Servidor propio (self-hosted) |
| Configuración | `.yml` en el repo | `Jenkinsfile` + panel de Jenkins |
| Rol en este curso | Flujo principal | Material de aprendizaje |

### Estandarización de IA / Copilot

Las convenciones de código, nombrado y prompts reutilizables del proyecto están documentadas en
[`.github/copilot-instructions.md`](.github/copilot-instructions.md). Úsalo como referencia antes
de pedirle a Copilot que genere Page Objects, tests, features o cambios al pipeline.

### Archivos de práctica

- `jenkins/Jenkinsfile`
- `.github/copilot-instructions.md`

---

## Resumen de la Clase 7

### ✅ Lo que vimos hoy

- Pipeline de GitHub Actions con dos jobs paralelos (Playwright y Cucumber)
- Notificaciones a Slack y Microsoft Teams por job
- Reportes Allure generados en cada corrida
- Jenkins como alternativa documentada, con los mismos comandos que GitHub Actions
- Estandarización del uso de IA/Copilot con `.github/copilot-instructions.md`

### 🔜 Clase 8 — Proyecto Final, MCP & Cierre

- Repaso integral del framework completo (POM + BDD + CI/CD)
- README profesional listo para portfolio
- Criterios de evaluación del proyecto final
- Extra: introducción a Playwright MCP

---

## Referencia rápida — Clase 7

| Comando / Archivo | ¿Qué hace? |
|---|---|
| `npm run allure:generate` | Genera `allure-report/` desde `allure-results/` |
| `npm run allure:open` | Abre el reporte Allure en el navegador |
| `.github/workflows/playwright.yml` | Pipeline principal (GitHub Actions) |
| `jenkins/Jenkinsfile` | Pipeline equivalente para Jenkins (demo) |
| `.github/copilot-instructions.md` | Estándares de código y prompts para Copilot |

---

## 🎯 Tarea para la próxima clase

1. Configura al menos un webhook (Slack o Teams) y confirma que te llega la notificación
2. Revisa `jenkins/README.md` y entiende las diferencias frente a GitHub Actions
3. Verifica que el pipeline sigue en verde con ambos jobs (Playwright y Cucumber)
