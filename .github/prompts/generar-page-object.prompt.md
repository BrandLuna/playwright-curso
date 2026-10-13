---
mode: 'agent'
description: 'Genera un Page Object + spec + feature a partir de locators que tú proporcionas, siguiendo el estándar de este proyecto.'
---

Vas a generar los artefactos de automatización para una página nueva del sitio bajo prueba,
siguiendo **al pie de la letra** los estándares definidos en
[`copilot-instructions.md`](../copilot-instructions.md).

Si falta información (nombre de la página, locators o acciones), pregúntame antes de generar
código. No inventes locators que no te di.

## Datos de entrada que te voy a dar

```
Página: <nombre de la página, ej: "Carrito de compras">
Locators:
  - <descripción> -> <selector data-test>
  - <descripción> -> <selector data-test>
Acciones: <lista de métodos de negocio que necesito, ej: addToCart(), removeItem(nombre)>
```

## Qué debes generar

1. **Page Object** en `pages/<Nombre>Page.ts`
   - Extiende `BasePage` (importa desde `./BasePage`)
   - Un getter por cada locator que te di, usando el selector exacto proporcionado
   - Un método async por cada acción de negocio solicitada
   - Métodos de aserción (`expectX`) cuando la acción implica validar un resultado
   - Comentarios en español solo donde aporten contexto que el código no explique solo

2. **Test `.spec.ts`** en la carpeta `tests/clase-XX/` que corresponda al tema (pregunta si no
   es obvio), usando:
   - `test.describe()` para agrupar
   - Tags con `{ tag: '@smoke' }` o `{ tag: '@regression' }`
   - Solo llamadas a métodos del Page Object, nunca locators ni `page.click/fill` directo

3. **Feature Gherkin** (solo si te lo pido explícitamente) en `tests/features/`
   - Nombre de archivo en kebab-case español
   - `Background` si hay un paso compartido
   - Tags en la línea anterior al `Scenario`

## Reglas no negociables

- ❌ Nunca `page.click(selector)` / `page.fill(selector, value)` sueltos en el spec
- ❌ Nunca una Page Object que no extienda `BasePage`
- ❌ Nunca `waitForTimeout()` como espera
- ❌ Nunca URLs, usuarios o contraseñas hardcodeadas — usa `process.env.*` o los que ya
  existen en `tests/utils/data/`
- ✅ Si un locator o acción se parece a algo que ya existe en `pages/`, reutilízalo en vez de
  duplicarlo

## Al terminar

Muéstrame un resumen breve de los archivos creados/modificados y cualquier supuesto que hayas
tenido que tomar (ej: en qué carpeta `clase-XX/` guardaste el spec).
