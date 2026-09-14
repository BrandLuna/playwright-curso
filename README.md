# Clase 0 — Preparación del entorno

Antes de arrancar la **Clase 1** necesitás tener el entorno listo. Esta rama **no tiene
proyecto armado** a propósito — el objetivo es que lo crees vos mismo desde cero, siguiendo
estos pasos, para entender qué hace cada herramienta antes de automatizarlo.

## Requisitos previos

- [Node.js LTS](https://nodejs.org) (v20 o superior)
- [Git](https://git-scm.com)
- [VS Code](https://code.visualstudio.com) + extensión **Playwright Test for VSCode**
- Cuenta de [GitHub](https://github.com) (para clonar/subir tu propio repositorio del curso)

## Verificá que tu entorno está listo

Corré cada comando y confirmá que te devuelve una versión (no un error):

```bash
node --version       # v20.x.x o superior
npm --version        # 10.x.x o superior
git --version        # git version 2.x.x
```

| Problema | Solución rápida |
|---|---|
| `node` no reconocido | Reinstalá Node.js LTS desde [nodejs.org](https://nodejs.org) y reiniciá la terminal |
| `git` no reconocido | Instalá Git desde [git-scm.com](https://git-scm.com) |
| Versión de Node muy vieja | Usá [nvm](https://github.com/nvm-sh/nvm) (Mac/Linux) o [nvm-windows](https://github.com/coreybutler/nvm-windows) para manejar versiones |

## Crear tu propio proyecto (no clones este repo)

Para la Clase 1 vas a crear tu propio proyecto Playwright desde cero:

```bash
mkdir playwright-curso
cd playwright-curso

npm init playwright@latest
```

Durante el asistente, elegí:
- **TypeScript**
- **tests** (carpeta de tests)
- **false** (no agregar GitHub Actions todavía — lo vemos en Clase 4)
- **true** (instalar navegadores)

Esto genera automáticamente `playwright.config.ts`, `tsconfig.json`, `package.json` y un test
de ejemplo — no hace falta crear nada de eso a mano.

## Verificar que Playwright quedó instalado

```bash
npx playwright --version
npx playwright test
```

Si ves un test pasando (`1 passed`), tu entorno está listo.

> **¿Los navegadores no se instalaron durante el asistente?** Ejecutalos manualmente:
> ```bash
> npx playwright install
> ```

## Estructura del proyecto generado

```
playwright-curso/
├── tests/               # Tests del curso (.spec.ts)
├── node_modules/        # NO tocar, NO subir a GitHub
├── playwright.config.ts # Configuración principal
├── package.json         # Dependencias y scripts
└── .gitignore           # Excluye node_modules y reports
```

| Archivo/Carpeta | Para qué sirve |
|---|---|
| `tests/` | Acá escribirás todos tus tests — extensión `.spec.ts` |
| `playwright.config.ts` | Configuración principal: navegadores, timeout, reporte, baseURL |
| `package.json` | Lista de dependencias y scripts del proyecto |
| `node_modules/` | Dependencias instaladas — NO tocar, NO subir a GitHub |
| `.gitignore` | Archivos que Git ignora — ya excluye `node_modules` automáticamente |

## Comandos básicos para ejecutar tests

```bash
npx playwright test           # headless — sin abrir el navegador
npx playwright test --headed  # con navegador visible
npx playwright test --ui      # interfaz visual interactiva
npx playwright show-report    # abrir el último reporte generado
```

## Configurar tu propio repositorio en GitHub

1. Creá un repositorio vacío en GitHub (sin README, sin `.gitignore` — ya los tenés localmente)
2. Dentro de tu carpeta `playwright-curso`:
   ```bash
   git init
   git add .
   git commit -m "chore: proyecto inicial con npm init playwright"
   git branch -M main
   git remote add origin <URL-de-tu-repo>
   git push -u origin main
   ```

## 🎯 Siguiente paso

Con el entorno verificado y tu propio repositorio creado, segui a la rama `clase-01-introduccion`
de este curso para ver la Clase 1 completa (primer test, Codegen, y fundamentos de Playwright).
