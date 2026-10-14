# QA Automation con Playwright + TypeScript + Cucumber

Curso completo de automatización de pruebas — **8 clases · 3 horas cada una**

## Requisitos previos

- [Node.js LTS](https://nodejs.org) (v20 o superior)
- [Git](https://git-scm.com)
- [VS Code](https://code.visualstudio.com) + extensión **Playwright Test for VSCode**
- Cuenta de GitHub con Actions habilitado (viene por defecto en repos públicos/privados)
- (Opcional) Un workspace de Slack si quieres probar las notificaciones

## Configuración para esta clase

Continúas el proyecto de la Clase 6. Esta clase no agrega dependencias npm nuevas — el trabajo es
de configuración de CI/CD (GitHub Actions) y notificaciones.

**Configura en el environment `development`** (Settings → Environments → `development`):

- **Environment variables**: `BASE_URL`, `SAUCEDEMO_USERNAME`, `SAUCEDEMO_PASSWORD`
- **Environment secret**: `SLACK_WEBHOOK_URL`

Ejemplo de valores:

```
BASE_URL=https://www.saucedemo.com
SAUCEDEMO_USERNAME=standard_user
SAUCEDEMO_PASSWORD=secret_sauce
SLACK_WEBHOOK_URL=<tu Incoming Webhook de Slack>       # opcional
```

> Si no configuras `SLACK_WEBHOOK_URL`, ese paso del pipeline se omite automáticamente — no hace
> falta tenerlo configurado para que el resto del pipeline funcione.

**Revisa el pipeline ya armado** en `.github/workflows/playwright.yml`. La carpeta `jenkins/` queda
solo como referencia: contiene el pipeline equivalente para Jenkins y no se ejecuta.

**Usa reportes nativos** para mantener la clase simple:
- Playwright: reporte HTML nativo (`playwright-report/`)
- Cucumber: formatter HTML nativo (`cucumber-report.html`)

## Ejecutar los tests

```bash
# Tests Playwright (.spec.ts)
npm test
npm run test:smoke

# Tests BDD con Cucumber (.feature)
npm run cucumber
npm run cucumber:smoke
npm run cucumber:regression

# Abrir reporte nativo de Playwright
npm run test:report
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
├── jenkins/                         ← Jenkinsfile + guía (solo referencia, no se ejecuta)
│   ├── Jenkinsfile
│   └── README.md
├── .github/
│   ├── workflows/playwright.yml     ← pipeline principal de CI/CD (GitHub Actions)
│   ├── copilot-instructions.md      ← reglas generales para IA/Copilot
│   ├── instructions/                ← reglas por zona: Cucumber y POM/Playwright
│   ├── prompts/                     ← /generar-casos-cucumber y /generar-page-object
│   └── GUIA-IA.md                   ← cómo funcionan instrucciones y prompts
├── cucumber.json
├── playwright.config.ts             ← reporter nativo html
└── package.json
```

---

# Clase 7 — CI/CD con GitHub Actions y estandarización de IA

> **Duración:** 3 horas &nbsp;|&nbsp; **App:** [saucedemo.com](https://www.saucedemo.com)

## 🎯 Objetivos

- Entender los conceptos de CI/CD y mapear los términos entre GitHub Actions y Jenkins
- Consolidar el pipeline de GitHub Actions como flujo principal de CI/CD
- Conocer el `Jenkinsfile` como referencia: es el equivalente del workflow de Actions, sin ejecutarlo
- Configurar notificaciones a Slack al finalizar el pipeline
- Trabajar con reportes nativos de Playwright y Cucumber en CI/CD
- Adoptar un uso estandarizado de GitHub Copilot en el proyecto

---

## B1 — Conceptos de CI/CD: Jenkins vs GitHub Actions `30 min`

Como esta clase no usa diapositivas, estos cuadros reemplazan al "ppt": sirven para fijar los
términos antes de ver cada herramienta en la práctica.

### ¿Qué hace un pipeline de CI/CD?

En cada `push` o Pull Request, el pipeline repite siempre la misma secuencia, sin intervención
manual:

```mermaid
flowchart LR
    A["git push / Pull Request"] --> B["Pipeline se dispara"]
    B --> C["Instalar dependencias<br/>(npm ci)"]
    C --> D["Correr tests<br/>(Playwright / Cucumber)"]
   D --> E["Generar reportes<br/>(HTML nativo)"]
    E --> F["Subir artefactos"]
    F --> G["Notificar<br/>(Slack)"]
```

### Mismo concepto, distinto nombre según la herramienta

| Concepto | GitHub Actions | Jenkins |
|---|---|---|
| Archivo de definición | `.yml` en `.github/workflows/` | `Jenkinsfile` (Groovy) |
| Unidad de trabajo que corre en paralelo | `job` | `stage` |
| Paso individual dentro de la unidad | `step` | paso dentro de un `stage` |
| Máquina que ejecuta el pipeline | `runner` (hospedado por GitHub) | `agent` (servidor propio) |
| Valor secreto (webhook, password) | `secret` (Settings → Secrets/Environments) | `credential` (Manage Jenkins → Credentials) |
| Archivo generado para descargar | `artifact` (`actions/upload-artifact`) | `archiveArtifacts` / `publishHTML` |
| Qué dispara la ejecución | `on: push / pull_request / workflow_dispatch` | Webhook de SCM o *Build Now* manual |

### Comparativa general

| | GitHub Actions | Jenkins |
|---|---|---|
| Infraestructura | Nube de GitHub (sin instalar nada) | Servidor propio (self-hosted) |
| Configuración | `.yml` versionado en el repo | `Jenkinsfile` + configuración en el panel |
| Costo | Gratis en repos públicos / minutos incluidos en privados | Servidor propio (EC2, VPS, on-premise...) |
| Curva de aprendizaje | Baja | Media-alta |
| Uso en la industria | Muy común en startups y proyectos cloud-native | Muy común en empresas grandes / legacy |
| Rol en este curso | **Flujo principal** | Solo referencia (no se demuestra) |

> Esta misma tabla vive también en [`jenkins/README.md`](jenkins/README.md) por si quieres
> profundizar en Jenkins por tu cuenta, con los mismos datos para no tener dos versiones distintas.

### Archivos

- `.github/workflows/playwright.yml` (práctica de la clase)
- `jenkins/Jenkinsfile` (solo referencia)

---

## B2 — Pipeline de GitHub Actions `55 min`

Definido en [`.github/workflows/playwright.yml`](.github/workflows/playwright.yml). Se dispara con
`push`/`pull_request` hacia `main`/`clase-07-cicd`, o manualmente (`workflow_dispatch`).

```
push / pull_request → GitHub Actions
         ├── Job "playwright"  → npx playwright test tests/clase-05/01-pom-basico.spec.ts --project=chromium
         │                       sube playwright-report/
         │                       notifica Slack con el resultado de ESTE job
         └── Job "cucumber"    → cucumber sobre tests/features/flujo-de-compra.feature
                                  sube cucumber-report.html
                                  notifica Slack con el resultado de ESTE job
```

Los dos jobs corren en paralelo y son independientes **a propósito**: sirven para comparar, lado a
lado, cómo se ve el pipeline con el enfoque clásico de Playwright y cómo se ve con BDD. Cada uno
notifica su propio resultado — no hay un job de notificación consolidado.

### Scope fijo en Clase 7 (rápido para demo)

- Playwright corre `tests/clase-05/01-pom-basico.spec.ts` con `--project=chromium`.
- Cucumber corre `tests/features/flujo-de-compra.feature`.
- Mantener este alcance acotado reduce tiempos y hace más predecible la demo en vivo.

Ejemplos rápidos:

- Solo Playwright smoke en carpeta puntual:
   `test_suite=playwright`, `playwright_paths=tests/clase-05`, `playwright_grep=@smoke`
- Solo Cucumber regression en dos features:
   `test_suite=cucumber`, `cucumber_paths=tests/features/flujo-de-compra.feature,tests/features/environments.feature`, `cucumber_tag=@regression`

### Variables y secrets necesarios

| Tipo | Nombre | Uso |
|---|---|
| Variable | `BASE_URL` | URL base de la app |
| Variable | `SAUCEDEMO_USERNAME` / `SAUCEDEMO_PASSWORD` | Credenciales usadas en los tests |
| Secret | `SLACK_WEBHOOK_URL` | Incoming Webhook de Slack (opcional) |

### Archivo de práctica → [`.github/workflows/playwright.yml`](.github/workflows/playwright.yml)

---

## B3 — Jenkins como referencia `10 min`

Jenkins **no se demuestra en clase**. El archivo [`jenkins/Jenkinsfile`](jenkins/Jenkinsfile) queda en
el repositorio como el equivalente del workflow de GitHub Actions: describe el mismo pipeline con
la sintaxis de Jenkins, para que lo tengas de referencia si algún día lo encuentras en una empresa.

### El mismo pipeline, escrito en las dos herramientas

| Qué hace | `.github/workflows/playwright.yml` | `jenkins/Jenkinsfile` |
|---|---|---|
| Descargar el código | `actions/checkout@v4` | stage `Checkout` (`checkout scm`) |
| Instalar dependencias y navegadores | `npm ci` + `npx playwright install` | stage `Install` |
| Correr Playwright | job `playwright` | stage `Playwright Tests` |
| Correr Cucumber | job `cucumber` | stage `Cucumber BDD Tests` |
| Publicar el reporte | `actions/upload-artifact` | `publishHTML` |
| Notificar a Slack | `slackapi/slack-github-action` | `slackSend` en `post { always }` |
| Variables y secretos | `vars.*` / `secrets.*` del environment | `credentials('ID')` |

La estructura es la misma; cambia la sintaxis y dónde corre (nube de GitHub o servidor propio). Si
quieres montarlo por tu cuenta, los pasos están en [`jenkins/README.md`](jenkins/README.md).

### Archivos de referencia

- `jenkins/Jenkinsfile`
- `jenkins/README.md`

---

## B4 — Notificaciones a Slack + Reportes nativos `40 min`

### Slack (por job)

Usa la Action oficial `slackapi/slack-github-action@v2.1.0` con un Incoming Webhook, mandando un
payload en formato Block Kit con el resultado del job, la rama, el commit y el link al run.

#### Paso a paso — Crear el Incoming Webhook y conectarlo al pipeline

1. **Crear la app de Slack.** Entra a [api.slack.com/apps](https://api.slack.com/apps) → **Your Apps**
   → **Create New App**.

   ![Crear nueva app en Slack API](evidencias/capturas/slack-01-create-new-app.png)

2. **Elegir "From scratch".** En el modal **Create an app**, selecciona **From scratch** (en vez de
   usar un manifest).

   ![Elegir From scratch](evidencias/capturas/slack-02-from-scratch.png)

3. **Nombrar la app y elegir el workspace.** Ponle un **App Name** (ej. `prueba-ci`) y selecciona el
   workspace donde quieres recibir las notificaciones (ej. `QA MOON`) → **Create App**.

   ![Nombrar app y elegir workspace](evidencias/capturas/slack-03-name-app-workspace.png)

4. **Activar Incoming Webhooks.** En el menú lateral entra a **Incoming Webhooks**, activa el
   toggle **Activate Incoming Webhooks** y baja hasta **Add New Webhook**.

   ![Activar Incoming Webhooks](evidencias/capturas/slack-04-activate-webhooks.png)

5. **Copiar la Webhook URL.** Slack genera una URL única (`https://hooks.slack.com/services/...`)
   asociada a un canal (ej. `playwright-ci`). Cópiala con el botón **Copy** — nunca debe quedar
   escrita en el código.

   ![Copiar Webhook URL](evidencias/capturas/slack-05-copy-webhook-url.png)

6. **Autorizar la app en el workspace y canal.** Confirma el **Workspace** y el **Canal para
   webhook**, y pulsa **Permitir** para que la app quede autorizada a publicar ahí.

   ![Permitir que la app publique en el canal](evidencias/capturas/slack-06-permitir-canal.png)

7. **Crear/usar el Environment en GitHub.** El workflow declara `environment: development` en cada
   job, así que el secret se agrega ahí (no en los secrets generales del repo): **Settings →
   Environments → New environment** (o entra al que ya exista, `development`).

   ![Crear Environment en GitHub](evidencias/capturas/slack-07-github-environment.png)

8. **Agregar el secret al Environment.** Dentro del environment `development`, ve a **Environment
   secrets → Add environment secret**.

   ![Add environment secret](evidencias/capturas/slack-08-add-environment-secret.png)

9. **Guardar `SLACK_WEBHOOK_URL`.** Nombre `SLACK_WEBHOOK_URL`, valor la Webhook URL copiada en el
   paso 5 → **Add secret**.

   ![Secret SLACK_WEBHOOK_URL guardado](evidencias/capturas/slack-09-secret-guardado.png)

El paso `Notify Slack` de [`.github/workflows/playwright.yml`](.github/workflows/playwright.yml) ya
lee `secrets.SLACK_WEBHOOK_URL` dentro del `environment: development` — no hace falta tocar el YAML,
solo configurar el secret como arriba. Al correr el pipeline (push o `workflow_dispatch`), el
mensaje debe llegar al canal elegido.

> Si el secret `SLACK_WEBHOOK_URL` no está configurado, la Action de Slack falla ese paso puntual,
> pero no afecta el resto del job — los tests y la subida de reportes siguen corriendo igual.

### Reportes nativos

- Playwright genera `playwright-report/` automáticamente en cada corrida.
- Cucumber genera `cucumber-report.html` automáticamente en cada corrida.
- En GitHub Actions ambos se suben como artefactos (`playwright-report` y `cucumber-report`).

### Archivo de práctica → `.github/workflows/playwright.yml` (paso `Notify Slack`)

---

## B5 — Uso de IA en el proyecto (Copilot) `25 min`

El proyecto estandariza cómo se usa Copilot para que cualquier persona del curso obtenga los mismos
patrones sin importar quién haga la pregunta. Se logra con tres piezas dentro de `.github/`:

| Pieza | Archivo | Cuándo se carga | Para qué |
|---|---|---|---|
| Instrucciones generales | `copilot-instructions.md` | Siempre | Reglas que valen para todo el repo |
| Instrucciones por archivo | `instructions/*.instructions.md` | Al trabajar con ciertos archivos | Reglas de una zona concreta (Cucumber, POM) |
| Prompts | `prompts/*.prompt.md` | Cuando los invocas con `/` | Tareas repetibles con datos de entrada |

```mermaid
flowchart LR
    A["Pides algo en el chat"] --> B["copilot-instructions.md<br/>(siempre)"]
    A --> C["instructions/<br/>(según el archivo)"]
    A --> D["/prompt<br/>(si lo invocas)"]
    B --> E["Código con los patrones del proyecto"]
    C --> E
    D --> E
```

Separar las reglas por zona mantiene corto el contexto fijo: las reglas de Cucumber no viajan cuando
editas un Page Object, y al revés. Cada mensaje lleva menos texto irrelevante y la regla aparece
justo donde se necesita.

### Los dos prompts del proyecto

| Prompt | Para qué sirve | Qué le das |
|---|---|---|
| `/generar-casos-cucumber` | Crear un feature y sus steps, reutilizando los que ya existen | Feature, página o módulo, casos y tags |
| `/generar-page-object` | Crear un Page Object (y su spec) para una página nueva | Página, locators `data-test` y acciones |

#### Paso a paso — probarlo

1. Abre el Chat de Copilot en VS Code.
2. Escribe `/generar-casos-cucumber` y entrega un caso nuevo (por ejemplo, un flujo del carrito).
3. Revisa las referencias de la respuesta: debe aparecer `cucumber.instructions.md`.
4. Comprueba que el feature reutiliza la redacción de los steps existentes y que solo crea los que faltan.
5. Revisa el código antes de aceptarlo — la IA propone, tú apruebas.

> Esto no reemplaza el criterio del QA: la IA acelera el andamiaje repetitivo (getters, imports,
> estructura), pero validar que el flujo de negocio es correcto sigue siendo tuyo.

El detalle de cada pieza, cuándo se carga y qué otras existen (agentes, skills, hooks, MCP) está
en [`.github/GUIA-IA.md`](.github/GUIA-IA.md).

### Archivos de práctica

- `.github/copilot-instructions.md`
- `.github/instructions/`
- `.github/prompts/`
- `.github/GUIA-IA.md`

---

## Resumen de la Clase 7

### ✅ Lo que vimos hoy

- Conceptos de CI/CD y tabla de equivalencias entre GitHub Actions y Jenkins
- Pipeline de GitHub Actions con dos jobs paralelos (Playwright y Cucumber)
- Jenkinsfile como referencia paralela al workflow de Actions
- Notificaciones a Slack por job/stage
- Reportes nativos (Playwright + Cucumber) generados en cada corrida
- Estandarización del uso de IA/Copilot con instrucciones generales, instrucciones por archivo y prompts

### 🔜 Clase 8 — Proyecto Final, MCP & Cierre

- Repaso integral del framework completo (POM + BDD + CI/CD)
- README profesional listo para portfolio
- Criterios de evaluación del proyecto final
- Extra: introducción a Playwright MCP

---

## Referencia rápida — Clase 7

| Comando / Archivo | ¿Qué hace? |
|---|---|
| `npm run test:report` | Abre el reporte HTML nativo de Playwright |
| `.github/workflows/playwright.yml` | Pipeline principal (GitHub Actions) |
| `jenkins/Jenkinsfile` | Pipeline equivalente para Jenkins (solo referencia) |
| `.github/copilot-instructions.md` | Reglas generales para Copilot (siempre activas) |
| `.github/instructions/` | Reglas por zona de código (se cargan al trabajar con esos archivos) |
| `.github/prompts/` | Tareas repetibles: `/generar-casos-cucumber`, `/generar-page-object` |

---

## 🎯 Tarea para la próxima clase

1. Configura el webhook de Slack y confirma que te llega la notificación
2. Compara `jenkins/Jenkinsfile` con el workflow de Actions y ubica qué stage corresponde a cada job
3. Verifica que el pipeline sigue en verde con ambos jobs (Playwright y Cucumber)

Prueba-cicd