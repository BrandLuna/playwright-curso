# Playwright MCP — Extra opcional (no forma parte de la evaluación)

Esta carpeta es **material complementario**, aparte del framework principal del curso. No se
ejecuta en el pipeline, no es un criterio de [`PROYECTO-FINAL.md`](../PROYECTO-FINAL.md), y no
requiere que instales nada en `package.json`. La idea es simplemente que conozcas que Playwright
tiene un MCP oficial y para qué se usa en la práctica.

## ¿Qué es Playwright MCP?

[`@playwright/mcp`](https://github.com/microsoft/playwright-mcp) es un servidor MCP (Model
Context Protocol) oficial de Microsoft. Expone las capacidades de Playwright (navegar, hacer
click, llenar formularios, tomar snapshots de accesibilidad) como **herramientas** que un agente
de IA (Copilot Chat, Claude, etc.) puede invocar directamente sobre un navegador real.

## ¿Para qué sirve en este curso?

En la práctica, lo más útil de Playwright MCP para un QA es pedirle al agente que:

- **Genere casos de test automáticamente**: le describís un flujo en lenguaje natural
  ("agrega un producto al carrito y haz checkout") y el agente lo ejecuta en un navegador real
  paso a paso, y a partir de eso te genera el `.spec.ts` o el `.feature` correspondiente.
- **Cree la estructura inicial de un proyecto**: en vez de escribir a mano el primer Page Object
  o el primer test, le pedís al agente que explore la app y te arme el esqueleto inicial
  (locators, Page Object, primer test) basándose en lo que realmente ve en la página.

Es una forma de **acelerar el arranque** de un proyecto de automatización, no de reemplazar los
tests deterministas que ya tenés en `tests/`.

## Habilitarlo en este repo

Este workspace ya incluye [`.vscode/mcp.json`](../.vscode/mcp.json) con la configuración del
servidor. Para activarlo:

1. Abre la Command Palette → `MCP: List Servers` → selecciona `playwright` → `Start Server`
2. Verifica que el servidor quedó disponible para Copilot Chat (icono de herramientas del chat)

## Ejemplo de prompt

```
Usando Playwright MCP, navega a https://www.saucedemo.com, inicia sesión con
standard_user / secret_sauce, agrega el "Sauce Labs Backpack" al carrito y completa
el checkout con datos de ejemplo. Cuando termines, genera un archivo .spec.ts en
tests/clase-08/ que reproduzca ese mismo flujo usando los Page Objects de pages/.
```

El agente navega el flujo real (no un script fijo) y, al final, te entrega código de test
determinista que sí se integra al framework — ahí es donde se conecta con todo lo demás del curso.

## Diferencia clave

| | Tests de este repo (`tests/`) | Playwright MCP |
|---|---|---|
| Quién decide las acciones | El código que ya escribiste | El agente de IA, en tiempo real |
| Repetible / determinista | ✅ Siempre el mismo flujo | ❌ Puede variar según lo que "ve" |
| Se ejecuta en CI/CD | ✅ Sí (GitHub Actions / Jenkins) | ❌ No, es una herramienta de autoría |
| Uso típico | Regresión, smoke, pipelines | Generar/prototipar tests o estructura inicial |

## Ejercicio sugerido (práctica, no evaluada)

Con el servidor Playwright MCP habilitado, pídele al agente que navegue un flujo de
saucedemo.com que **todavía no tengas automatizado** (ej. ordenar productos por precio, o
"Continue Shopping" desde el carrito). Que lo ejecute paso a paso y, al final, te genere un
`.spec.ts` usando los Page Objects de `pages/`.

Después, revisá ese código generado contra [`.github/copilot-instructions.md`](../.github/copilot-instructions.md):
¿usa locators `data-test`? ¿extiende `BasePage`? ¿hace falta ajustarlo a mano?

El objetivo de este ejercicio es justamente ese último paso: el código generado por IA **siempre
se revisa y ajusta** al estándar del proyecto, nunca se pega tal cual.
