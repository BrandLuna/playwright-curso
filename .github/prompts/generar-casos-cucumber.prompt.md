---
agent: 'agent'
description: 'Crea escenarios Cucumber nuevos reutilizando los steps y Page Objects que ya existen en el proyecto.'
---

Crea casos nuevos de Cucumber para este proyecto, siguiendo las reglas de
[cucumber.instructions.md](../instructions/cucumber.instructions.md).

Antes de escribir nada:

1. Lee `tests/step-definitions/` y haz una lista de los steps que ya existen.
2. Escribe los escenarios usando esa misma redaccion cuando el paso ya exista.
3. Solo crea un step nuevo si no hay uno equivalente.

Si falta contexto, pregunta primero. No inventes reglas de negocio ni selectores.

## Datos que te voy a dar

```text
Feature: <objetivo funcional>
Pagina o modulo: <nombre>
Casos: <lista de casos de prueba>
Tags: <@smoke / @regression>
```

## Que debes generar

1. El `.feature` en `tests/features/`.
2. Los steps nuevos que hagan falta en `tests/step-definitions/`, agrupados por dominio.
3. Un Page Object o metodo nuevo en `pages/` solo si un step lo necesita.

## Al terminar

Resume en pocas lineas:

- Archivos creados o modificados.
- Steps reutilizados y steps nuevos.
- Supuestos que tuviste que tomar.