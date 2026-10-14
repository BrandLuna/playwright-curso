# Guía de IA con Copilot en este proyecto

El proyecto usa cuatro piezas de personalización de Copilot, todas dentro de `.github/`. Cada una resuelve una necesidad distinta y juntas le dan a la IA el contexto del proyecto sin repetirlo en cada pregunta.

| Pieza | Archivo | Cuándo se carga | Para qué |
|---|---|---|---|
| Instrucciones generales | `copilot-instructions.md` | Siempre | Reglas que valen para todo el repo |
| Instrucciones por archivo | `instructions/*.instructions.md` | Solo al trabajar con ciertos archivos | Reglas de una zona concreta del código |
| Prompts | `prompts/*.prompt.md` | Cuando los invocas con `/` | Tareas repetibles con datos de entrada |
| Agentes | `agents/*.agent.md` | Cuando lo eliges en el selector del chat | Un rol con herramientas y un flujo propios |

## 1. Instrucciones generales: `copilot-instructions.md`

Es el contexto base del repositorio. Copilot lo agrega solo a cada conversación del chat en este workspace; no se invoca.

Contiene el alcance real del proyecto (Playwright, Cucumber, POM, GitHub Actions, Slack), las reglas de nombres, las reglas de CI/CD y lo que Copilot no debe hacer. Es corto a propósito: todo lo que ponga aquí viaja en cada conversación.

Archivo: [`copilot-instructions.md`](copilot-instructions.md)

## 2. Instrucciones por archivo: `instructions/`

Son reglas que solo importan en una parte del proyecto. Cada archivo declara en `applyTo` a qué archivos aplica y Copilot lo carga solo cuando trabajas con ellos.

| Archivo | Aplica a | Contiene |
|---|---|---|
| [`cucumber.instructions.md`](instructions/cucumber.instructions.md) | `tests/features/`, `tests/step-definitions/`, `tests/support/` | Reutilizar steps existentes, redacción sin tildes, uso de `CustomWorld` |
| [`playwright-pom.instructions.md`](instructions/playwright-pom.instructions.md) | `pages/`, todos los `*.spec.ts` de `tests/` y `tests/utils/` | `BasePage`, locators como getters, specs sin lógica de UI, reutilizar fixtures y helpers |

Por qué conviene separarlas:

- **Menos contexto fijo.** Las reglas de Cucumber no viajan cuando editas un Page Object, y al revés. El archivo general se mantiene corto.
- **Más precisión.** La regla aparece justo donde se necesita, así que la IA la sigue mejor que si estuviera perdida en un documento largo.
- **Menos tokens.** Cada mensaje al modelo lleva menos texto de reglas irrelevantes. La reducción depende de cuánto contenido muevas aquí, no es una cifra fija.
- **Más fácil de mantener.** Cada archivo cubre un tema y se edita sin tocar el resto.

El contexto que más importa que tenga la IA es el de reutilización: antes de crear un step o un Page Object, buscar uno existente. Esa regla está en estos archivos, y los prompts la enlazan para que se cargue aunque el archivo nuevo todavía no exista.

## 3. Prompts: tareas repetibles

Cada archivo `*.prompt.md` de [`prompts/`](prompts) es una tarea con pasos y reglas ya escritos. Se ejecuta desde el chat y pide solo los datos de entrada.

| Prompt | Para qué sirve | Qué le das |
|---|---|---|
| `/generar-casos-cucumber` | Crear un feature y sus steps, reutilizando los que ya existen | Feature, página o módulo, casos y tags |
| `/generar-page-object` | Crear un Page Object (y su spec) para una página nueva | Página, locators `data-test` y acciones |

Son los dos más usados en un proyecto real con este stack: casi todo trabajo nuevo empieza con un caso nuevo, y a veces con una página nueva.

Cómo usarlos:

1. Abre el chat de Copilot en VS Code.
2. Escribe `/` y elige el prompt de la lista.
3. Completa los datos de entrada que pide.
4. Revisa los cambios propuestos antes de aceptarlos.

En el encabezado de cada prompt, `description` es lo que aparece en la lista y `agent` define cómo trabaja:

- `agent: 'agent'` puede leer y modificar archivos del repo (lo usan los dos prompts).
- `agent: 'ask'` solo responde en el chat, sin tocar archivos. Sirve para consultas.

## 4. Agentes: `agents/`

Un agente es un rol con herramientas limitadas y un flujo de trabajo definido. Se elige en el selector de agentes del chat y trabaja con ese rol durante toda la conversación.

| Agente | Para qué sirve | Herramientas |
|---|---|---|
| [`QA Cucumber`](agents/qa-cucumber.agent.md) | Crear o ampliar casos Cucumber reutilizando steps y Page Objects | `read`, `search`, `edit`, `execute` |

Cómo se relaciona con lo anterior:

- **No repite reglas.** Recibe `copilot-instructions.md` y las instrucciones por archivo, y las enlaza desde su archivo; si una regla cambia, se edita en un solo lugar.
- **Prompt frente a agente.** El prompt es una tarea con datos de entrada fijos y se ejecuta de una vez. El agente tiene un rol y un flujo (inventario, plan, implementación, revisión, ejecución), puede preguntar y continuar la conversación.
- **Herramientas mínimas.** Solo tiene las que su rol necesita. Usa la terminal únicamente para ejecutar el feature que creó, no para instalar paquetes ni usar git. Si una herramienta no está en `tools`, el agente no puede usarla.

Cómo usarlo:

1. Abre el chat de Copilot en VS Code.
2. En el selector de agentes elige **QA Cucumber**.
3. Describe el flujo que quieres automatizar.
4. Revisa el plan que propone antes de que genere los archivos.
5. Revisa el resultado de la ejecución y el código antes de aceptarlo.

## Cuál usar en cada caso

- Aplica a casi todo el trabajo: instrucciones generales.
- Aplica solo a un tipo de archivo: instrucciones por archivo.
- Es una tarea repetible con datos de entrada: prompt.
- Necesita un rol con un flujo y herramientas limitadas: agente.