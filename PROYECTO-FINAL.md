# Proyecto Final — Clase 8

Este documento define los criterios de evaluación del **proyecto final del curso**. El objetivo
es que apliques, sobre saucedemo.com (u otra app que definas con el instructor), todo lo visto
en las 8 clases: Page Object Model, tests Playwright, BDD con Cucumber, CI/CD, reportes y buenas
prácticas de uso de IA.

---

## Criterios de evaluación

| Criterio | Peso | Qué se evalúa |
|---|---|---|
| **Estructura del proyecto** | 20% | Organización de carpetas (`pages/`, `tests/`, `.github/`), nombrado consistente, sin código muerto ni archivos de prueba sueltos |
| **Tests Playwright (.spec.ts)** | 30% | Cobertura de los flujos mínimos, uso correcto de Page Object Model, asserts significativos, tags (`@smoke`/`@regression`) |
| **BDD con Cucumber** | 20% | Features en Gherkin bien escritos (Background, Scenario Outline donde aplique), step definitions con `CustomWorld`, sin lógica de UI en los steps |
| **Pipeline CI/CD** | 20% | GitHub Actions en verde, artefactos (reportes) publicados, notificación (Slack o Teams) configurada o documentada |
| **Buenas prácticas** | 10% | `.env` para credenciales, `.gitignore` correcto, commits descriptivos, sin `waitForTimeout()` ni selectores frágiles |

**Total: 100%**

---

## Flujos mínimos requeridos (saucedemo.com)

Tu proyecto debe cubrir, como mínimo, estos flujos (en Playwright **y** en Cucumber):

1. **Login** — caso exitoso y al menos un caso fallido (credenciales inválidas o usuario bloqueado)
2. **Inventario** — agregar uno o más productos al carrito
3. **Carrito** — verificar productos agregados, quitar un producto
4. **Checkout completo** — desde login hasta la pantalla de confirmación del pedido
5. **Al menos un caso data-driven** — mismo flujo repetido con distintos datos de entrada (JSON o CSV)

---

## Entregables esperados

- [ ] Rama `proyecto-final-TUNOMBRE` pusheada al repositorio
- [ ] `pages/` con Page Objects que extienden `BasePage`
- [ ] Al menos 1 archivo `.spec.ts` y 1 archivo `.feature` + steps cubriendo los flujos mínimos
- [ ] Pipeline de GitHub Actions corriendo en verde en tu rama
- [ ] Reporte HTML (Playwright y/o Cucumber) generado por el pipeline como artefacto
- [ ] README propio o sección explicando cómo correr tu proyecto
- [ ] Breve demo (5-10 min) mostrando el flujo completo y el pipeline en verde

---

## Cómo crear tu rama de proyecto final

```bash
# parado sobre clase-08 (o la rama que te indique el instructor)
git checkout clase-08
git pull origin clase-08

# crea tu rama personal de entrega
git checkout -b proyecto-final-TUNOMBRE

# trabaja, commitea y sube tu rama
git push -u origin proyecto-final-TUNOMBRE
```

Reemplaza `TUNOMBRE` por tu nombre o usuario (ej. `proyecto-final-brandluna`).

---

## Fecha de entrega y formato de presentación

- **Fecha de entrega:** _a definir por el instructor_
- **Formato de presentación:** demo en vivo (5-10 min) mostrando:
  1. Los flujos automatizados corriendo localmente (`npm test` / `npm run cucumber`)
  2. El pipeline de GitHub Actions en verde sobre tu rama `proyecto-final-TUNOMBRE`
  3. El reporte HTML/Allure generado por el pipeline
  4. Un breve resumen de las decisiones de diseño (por qué esa estructura de Page Objects, qué
     tags usaste, cómo configuraste las notificaciones)
