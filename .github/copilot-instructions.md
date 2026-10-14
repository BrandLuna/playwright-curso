# Instrucciones para GitHub Copilot - QA Automation con Playwright + TypeScript

Estas instrucciones aplican a todo el repositorio.
Objetivo: que las sugerencias de IA mantengan consistencia tecnica y realista con el estado actual
del proyecto, sin inventar estructuras ni herramientas que no existen aqui.

---

## Alcance real del proyecto

- Stack principal: Playwright + TypeScript + Cucumber (BDD).
- Patron de UI automation: POM con `BasePage`.
- CI/CD principal: GitHub Actions en `.github/workflows/playwright.yml`.
- Jenkins: material de apoyo en `jenkins/`, no flujo principal del repo.
- Reportes actuales: HTML nativo de Playwright y HTML de Cucumber.
- Notificaciones: Slack (no asumir Teams ni otros canales si no estan en el YAML).

---

## Convenciones de codigo

El detalle de Page Objects, specs y Cucumber vive en `.github/instructions/` y solo se carga
cuando se trabaja con esos archivos:

- `playwright-pom.instructions.md`: `pages/` y specs con POM.
- `cucumber.instructions.md`: features, steps y soporte de Cucumber.

### Nombres y estilo

- Archivos: kebab-case.
- Clases: PascalCase.
- Funciones y metodos: camelCase.
- Variables de entorno: SCREAMING_SNAKE_CASE.
- Reutilizar lo que ya existe en el proyecto antes de crear algo nuevo.

---

## Reglas para cambios de CI/CD

- No duplicar logica entre GitHub Actions y Jenkins sin necesidad.
- Nunca hardcodear credenciales, webhooks o tokens.
- En GitHub Actions, usar `vars.*` y/o `secrets.*` segun lo que ya exista en el workflow.
- Mantener comentarios de YAML en espanol y orientados a mantenimiento.
- Cualquier notificacion debe ser condicional para no romper el pipeline si falta configuracion.

---

## Lo que no debe hacer Copilot

- No usar API obsoleta de Playwright (`page.click(selector)`, `page.fill(selector, value)`).
- No usar `waitForTimeout()` como espera normal.
- No crear estructura nueva (carpetas, frameworks, reportes) sin que se pida.
- No mezclar configuraciones de ramas distintas como si fueran una sola fuente de verdad.

---

## Prompts del repo

- Nuevos escenarios Cucumber reutilizando steps y pages: `.github/prompts/generar-casos-cucumber.prompt.md`
- Page Object nuevo a partir de locators: `.github/prompts/generar-page-object.prompt.md`
