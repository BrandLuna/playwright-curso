# Playwright MCP — Demo de IA avanzada (Clase 8)

Esta carpeta es **material de aprendizaje**: no se ejecuta en el pipeline ni forma parte del
framework de tests. Su objetivo es mostrar cómo un agente de IA (como GitHub Copilot) puede
controlar un navegador real usando el **Model Context Protocol (MCP)** en lugar de que un humano
escriba cada `page.click()` a mano.

## ¿Qué es Playwright MCP?

[`@playwright/mcp`](https://github.com/microsoft/playwright-mcp) es un servidor MCP oficial de
Microsoft que expone las capacidades de Playwright (navegar, hacer click, llenar formularios,
tomar snapshots de accesibilidad, etc.) como **herramientas** que un agente de IA puede invocar.

En vez de generar código de test primero y ejecutarlo después, el agente:
1. Pide un "snapshot" de accesibilidad de la página actual (no una captura de pantalla — una
   representación estructurada del DOM: roles, textos, elementos interactivos).
2. Decide qué acción tomar (`click`, `type`, `navigate`, etc.) en base a ese snapshot.
3. Ejecuta la acción a través del servidor MCP y recibe el nuevo estado de la página.
4. Repite el ciclo hasta cumplir el objetivo (ej. completar un checkout).

Esto es lo que hace posible que Copilot (u otro agente) "navegue" saucedemo.com de forma
autónoma: no corre un script fijo, sino que decide el próximo paso según lo que ve en cada
snapshot.

## Instalación

Playwright MCP se ejecuta como un servidor aparte, no como una dependencia del proyecto. Se
configura una sola vez en el cliente MCP (VS Code, Claude Desktop, etc.), **no** en
`package.json`.

### Opción A — VS Code (GitHub Copilot)

1. Abre la paleta de comandos → `MCP: Add Server...`
2. Elige `npx` como tipo de servidor
3. Comando: `npx @playwright/mcp@latest`
4. Guarda y habilita el servidor desde el panel de MCP Servers

### Opción B — configuración manual (`mcp.json`)

```jsonc
{
  "servers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

## Ejemplo básico de uso

Una vez conectado el servidor, le puedes pedir al agente algo como:

```
Navega a https://www.saucedemo.com, inicia sesión con standard_user / secret_sauce,
agrega el "Sauce Labs Backpack" al carrito y completa el checkout con datos de ejemplo.
Cuéntame en qué paso quedó y qué viste en la confirmación final.
```

El agente usará las herramientas de Playwright MCP (`browser_navigate`, `browser_snapshot`,
`browser_click`, `browser_type`, etc.) para cumplir la tarea paso a paso, sin que nadie haya
escrito un `.spec.ts` para ese flujo.

## Relación con el framework de este curso

| | Tests de este repo (`tests/`) | Playwright MCP |
|---|---|---|
| Quién decide las acciones | El código que escribiste (POM + specs/steps) | El agente de IA, en tiempo real |
| Repetible / determinista | ✅ Sí, siempre el mismo flujo | ❌ Puede variar según el snapshot |
| Uso típico | Regresión, CI/CD, pipelines | Exploración, prototipado, generación asistida de tests |
| Vive en | `pages/`, `tests/` | `mcp/` (solo demo, no se ejecuta en CI) |

Ver [`mcp-demo.ts`](./mcp-demo.ts) para un ejemplo comentado de cómo se vería, a alto nivel, el
razonamiento de un agente usando estas herramientas.
