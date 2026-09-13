# Jenkins — Material de clase (demo del instructor)

Esta carpeta contiene el `Jenkinsfile` como **material de aprendizaje** de la Clase 7.
El flujo principal del proyecto usa **GitHub Actions** (ver [`.github/workflows/`](../.github/workflows)).
Nada de lo que hay aquí se ejecuta automáticamente en el repositorio: es una guía para que
practiques cómo se vería este mismo pipeline en un servidor Jenkins.

---

## Diferencias clave: GitHub Actions vs Jenkins

| | GitHub Actions | Jenkins |
|---|---|---|
| Infraestructura | Nube de GitHub (sin instalar nada) | Servidor propio (self-hosted) |
| Configuración | `.yml` versionado en `.github/workflows/` | `Jenkinsfile` + configuración en el panel de Jenkins |
| Costo | Gratis para repos públicos / minutos incluidos en privados | Servidor propio (EC2, VPS, on-premise, etc.) |
| Curva de aprendizaje | Baja | Media-alta |
| Uso en la industria | Muy común en startups y proyectos cloud-native | Muy común en empresas grandes / legacy |

---

## Configurar Jenkins localmente (para practicar)

### 1. Requisitos

- Docker instalado, o Java 17+ para instalación nativa

### 2. Levantar Jenkins con Docker

```bash
docker run -d \
  --name jenkins \
  -p 8080:8080 \
  -v jenkins_home:/var/jenkins_home \
  jenkins/jenkins:lts
```

Abre `http://localhost:8080` y sigue el asistente de instalación inicial.

### 3. Plugins necesarios

En **Jenkins > Manage Jenkins > Plugins**, instala:
- **NodeJS** — para configurar Node.js 20 como herramienta
- **Pipeline** — para interpretar el `Jenkinsfile` declarativo
- **HTML Publisher** — para publicar los reportes HTML dentro de Jenkins
- **Slack Notification** — para notificaciones a Slack
- **Office 365 Connector** — para notificaciones a Microsoft Teams

### 4. Configurar NodeJS

**Jenkins > Manage Jenkins > Global Tool Configuration > NodeJS**:
- Name: `NodeJS-20`
- Version: `20.x`

### 5. Crear el Pipeline job

1. **New Item → Pipeline**
2. Pipeline Definition: `Pipeline script from SCM`
3. SCM: `Git` → URL del repositorio
4. Script Path: `jenkins/Jenkinsfile`

### 6. Secrets / credenciales

**Jenkins > Manage Jenkins > Credentials**, agrega (tipo *Secret text*):

| ID de la credencial | Valor de ejemplo |
|---|---|
| `SAUCEDEMO_BASE_URL` | `https://www.saucedemo.com` |
| `SAUCEDEMO_USER` | `standard_user` |
| `SAUCEDEMO_PASS` | `secret_sauce` |
| `SLACK_WEBHOOK` | URL del Incoming Webhook de Slack |
| `TEAMS_WEBHOOK_URL` | URL del conector Incoming Webhook de Teams |

> Nunca escribas estos valores directamente en el `Jenkinsfile`: siempre referenciados
> con `credentials('ID')` como ya está hecho en este archivo.

---

## Estructura del Jenkinsfile

```
pipeline
├── agent any               ← cualquier agente disponible
├── tools: NodeJS-20         ← usa la herramienta configurada en Jenkins
├── environment              ← variables de entorno / secrets inyectados
├── stages
│   ├── Checkout             ← descarga el código (checkout scm)
│   ├── Install               ← npm ci + playwright install --with-deps chromium
│   ├── Playwright Tests      ← npx playwright test + publishHTML
│   └── Cucumber BDD Tests    ← npm run cucumber + publishHTML
└── post: always              ← archiva Allure results + notifica Slack y Teams
```

## Relación con GitHub Actions

Ambos pipelines ejecutan exactamente los mismos comandos (`npm ci`, `playwright install`,
`npx playwright test`, `npm run cucumber`) para que el comportamiento sea idéntico sin
importar la plataforma de CI. Solo cambia **cómo** se configuran (YAML vs Jenkinsfile) y
**dónde** corren (nube de GitHub vs servidor propio).
