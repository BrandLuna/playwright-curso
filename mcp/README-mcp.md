# 🎁 Playwright MCP — Regalo extra (no es la práctica de la Clase 8, no se evalúa)

Esta carpeta **no es la práctica de la Clase 8** — la práctica real de esa clase es el repaso
integral del curso descrito en [`PROYECTO-FINAL.md`](../PROYECTO-FINAL.md). Esto es un regalo
aparte: no se ejecuta en el pipeline, no es un criterio de evaluación, y no requiere instalar
nada en `package.json`. La idea es solo que conozcas que Playwright tiene un MCP oficial, cómo
funciona y para qué sirve en la práctica.

## ¿Qué es, cómo funciona y cómo interactúa con el navegador?

| Pregunta | Respuesta |
|---|---|
| **¿Qué es?** | [`@playwright/mcp`](https://github.com/microsoft/playwright-mcp): un servidor MCP (Model Context Protocol) oficial de Microsoft que expone Playwright como herramientas para un agente de IA. |
| **¿Qué es un MCP?** | Un protocolo estándar que permite que un agente de IA (Copilot Chat, Claude, etc.) descubra y llame "herramientas" externas (funciones) de forma uniforme, sin que cada integración sea distinta. |
| **¿Cómo se conecta?** | El cliente de IA (VS Code, Claude Desktop) lanza el servidor como un proceso aparte (`npx @playwright/mcp@latest`) y se comunica con él por el protocolo MCP (stdio), no por HTTP normal ni por `import` en tu código. |
| **¿Qué herramientas expone?** | `browser_navigate`, `browser_click`, `browser_type`, `browser_snapshot`, entre otras — cada una controla un navegador real (Chromium) por debajo, usando el mismo motor de Playwright. |
| **¿Cómo "ve" la página?** | No usa capturas de pantalla. Pide un **snapshot de accesibilidad**: un árbol de texto con roles, nombres y referencias de cada elemento interactivo (botones, inputs, links). Es más liviano y preciso que analizar una imagen. |
| **¿Cómo decide qué hacer?** | El agente de IA recibe ese snapshot, razona en lenguaje natural cuál es el siguiente paso, y llama a la herramienta correspondiente (ej. `browser_click` sobre el botón "Login"). Repite el ciclo hasta cumplir el objetivo. |
| **¿Quién controla el navegador?** | El servidor MCP, usando Playwright real por debajo — el mismo navegador y las mismas APIs que ya usás en `tests/`, solo que las acciones las decide el agente y no un script fijo. |

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
