# Guía de IA con Copilot en este proyecto

Hoy el proyecto usa dos piezas de personalización de Copilot: **instrucciones** (contexto siempre activo) y **prompts** (tareas repetibles). Las dos viven en `.github/`.

## 1. Instrucciones: `copilot-instructions.md`

Es el contexto general del repositorio. Copilot lo agrega solo a cada conversación del chat en este workspace; no se invoca ni se escribe nada para activarlo.

Contiene el alcance real del proyecto, las convenciones de Page Objects, specs y Cucumber, las reglas para cambios de CI/CD y lo que Copilot no debe hacer.

- Se edita cuando cambia una convención del proyecto, no por cada tarea.
- Debe describir solo lo que existe en el repo; lo que no aplica, mejor no incluirlo.
- Para comprobar que se está usando, revisa las referencias que aparecen en la respuesta del chat: debe listar este archivo.

Archivo: [`copilot-instructions.md`](copilot-instructions.md)

## 2. Prompts: tareas repetibles

Cada archivo `*.prompt.md` de [`prompts/`](prompts) es una tarea con pasos y reglas ya escritos. Se ejecuta bajo demanda desde el chat.

| Prompt | Para qué sirve | Qué le das |
|---|---|---|
| `/generar-page-object` | Crear un Page Object (y su spec) a partir de locators | Página, locators `data-test` y acciones |
| `/generar-casos-cucumber` | Crear un feature y sus steps, reutilizando los que ya existen | Feature, módulo, lista de casos y tags |
| `/revisar-bdd` | Revisar features, steps y pages antes de hacer commit | Nada obligatorio: revisa el repositorio |

Cómo usarlos:

1. Abre el chat de Copilot en VS Code.
2. Escribe `/` y elige el prompt de la lista.
3. Completa los datos de entrada que pide.
4. Revisa los cambios propuestos antes de aceptarlos.

En el encabezado de cada prompt, `description` es lo que aparece en la lista y `agent` define cómo trabaja:

- `agent: 'agent'` puede leer y modificar archivos del repo (lo usan los tres prompts).
- `agent: 'ask'` solo responde en el chat, sin tocar archivos. Sirve para consultas.

## 3. Qué más se puede sumar

Ninguna de estas piezas está implementada todavía. Se agregan cuando hay una necesidad concreta, no por defecto.

| Pieza | Ubicación | Para qué |
|---|---|---|
| Instrucciones por archivo | `.github/instructions/*.instructions.md` con `applyTo` | Reglas que solo aplican a ciertos archivos, por ejemplo `tests/features/**` y `tests/step-definitions/**` para Cucumber |
| `AGENTS.md` | Raíz del repo | Instrucciones para agentes en un formato compartido con otras herramientas; innecesario si ya existe `copilot-instructions.md` |
| Agentes personalizados | `.github/agents/*.agent.md` | Perfiles con herramientas restringidas, por ejemplo un revisor BDD de solo lectura |
| Skills | `.github/skills/<nombre>/SKILL.md` | Flujos de varios pasos con plantillas o scripts incluidos |
| Hooks | `.github/hooks/*.json` | Comandos que se ejecutan siempre en ciertos momentos, a diferencia de las instrucciones que solo guían |
| MCP | `.vscode/mcp.json` | Conectar Copilot con herramientas y sistemas externos |

Regla práctica para decidir dónde poner algo:

- Aplica a casi todo el trabajo: instrucciones generales.
- Es una tarea repetible con datos de entrada: prompt.
- Aplica solo a un tipo de archivo: instrucciones por archivo.
