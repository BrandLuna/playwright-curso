---
description: "Reglas de Cucumber para este proyecto: features Gherkin, step definitions y World. Usar al crear o editar escenarios, steps o hooks."
applyTo: "tests/features/**/*.feature,tests/step-definitions/**/*.ts,tests/support/**/*.ts"
---

# Cucumber (BDD)

## Reutilizar antes de crear

- Antes de escribir un step nuevo, busca en `tests/step-definitions/` uno equivalente y usa su redaccion exacta en el feature.
- No crees un step por cada variacion de frase: parametriza con `{string}` o `{int}`.
- Un `.feature` puede usar steps de cualquier archivo `.steps.ts`; los steps se agrupan por dominio (`flujo-de-compra.steps.ts`), no por feature.

## Features

- Archivo en kebab-case y en espanol.
- El texto de los steps va sin tildes ni enie, igual que los existentes (`contrasena`, `pagina`, `deberia`).
- `Background` para el paso inicial compartido y `Scenario Outline` con `Examples` para datos repetidos.
- Tags en la linea anterior a cada `Scenario`: `@smoke` o `@regression`.
- URL y credenciales del entorno no se escriben en el feature: vienen de `.env` (ver el step `inicia sesion con las credenciales del entorno`).

## Steps

- Usa `function (this: CustomWorld)`, no funciones flecha, para poder usar `this`.
- Delega la interaccion en los Page Objects del World (`this.loginPage`, `this.inventoryPage`, `this.cartPage`, `this.checkoutPage`); evita locators dentro del step.
- Si agregas un Page Object nuevo, registralo en `CustomWorld.init()` de `tests/support/world.ts`.
- `comparativa-sin-world` es un ejemplo didactico sin World: no lo uses como modelo.
