---
agent: 'agent'
description: 'Genera escenarios Cucumber y steps necesarios con enfoque de proyecto real, reutilizando al maximo los steps existentes.'
---

Genera casos nuevos en Cucumber para este proyecto con enfoque realista.
Antes de escribir codigo, revisa y reutiliza lo que ya existe en `tests/features/` y `tests/step-definitions/`.

Si falta contexto, pregunta primero.
No inventes reglas de negocio ni selectores.

## Entrada esperada

```text
Feature: <objetivo funcional>
Modulo/pagina: <nombre>
Casos: <lista de casos de prueba>
Tags esperados: <@smoke/@regression/...>
``` 

## Salida esperada

1. Feature en `tests/features/<nombre>.feature`
- En espanol, archivo kebab-case.
- `Background` si hay pasos comunes.
- `Scenario Outline` cuando haya variaciones de datos.
- Tags en la linea anterior a cada Scenario.

2. Steps en `tests/step-definitions/`
- Reusar steps existentes primero.
- Solo crear steps nuevos si no hay equivalentes.
- Steps tipados con `CustomWorld`.

3. Si aplica, Page Object o metodo faltante
- Solo si el paso realmente lo requiere.
- Extender `BasePage` y usar locators como getters.

## Reglas

- No meter logica de UI en features.
- No hardcodear secretos o credenciales.
- No usar esperas artificiales tipo `waitForTimeout()`.
- Mantener consistencia de nombres con el proyecto.

## Al final

Devuelve un resumen corto con:
- Archivos creados/modificados.
- Steps reutilizados.
- Steps nuevos agregados.
- Supuestos que tuviste que tomar.
