---
agent: 'agent'
description: 'Revisa calidad BDD antes de commit: detecta duplicados, pasos fragiles e inconsistencias entre feature, steps y pages.'
---

Haz una revision tecnica de BDD en este repositorio antes de merge/commit.

Enfocate en:
- Reutilizacion de steps.
- Calidad de escenarios.
- Coherencia entre feature, steps y Page Objects.
- Riesgos de mantenimiento.

## Checklist

1. Features (`tests/features/`)
- Tags consistentes (`@smoke`, `@regression`, etc.).
- Scenarios con lenguaje claro y verificable.
- `Background` solo cuando reduce repeticion real.
- `Scenario Outline` cuando hay data repetitiva.

2. Step Definitions (`tests/step-definitions/`)
- Evitar duplicados semanticos de steps.
- Validar uso de `CustomWorld`.
- Evitar logica de UI extensa dentro del step.

3. Pages (`pages/`)
- Si un step nuevo toca UI, validar que se delega a Page Object.
- Locators como getters.
- Sin selectores fragiles innecesarios.

4. Riesgos CI
- Nombres de tags/rutas alineados con comandos de ejecucion.
- Sin dependencias ocultas que rompan ejecucion en Actions.

## Formato de salida

- Hallazgos ordenados por severidad: alto, medio, bajo.
- Cada hallazgo debe incluir archivo y recomendacion concreta.
- Si no hay hallazgos, indicar explicitamente "sin hallazgos".
