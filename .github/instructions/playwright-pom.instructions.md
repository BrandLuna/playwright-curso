---
description: "Reglas de Page Objects, specs de Playwright y utilidades de tests en este proyecto. Usar al crear o editar paginas en pages/, specs, fixtures o helpers."
applyTo: "pages/**/*.ts,tests/**/*.spec.ts,tests/utils/**/*.ts"
---

# Playwright + Page Object Model

## Page Objects (`pages/`)

- Extienden `BasePage`; reutiliza sus metodos (`goto`, `expectURL`, `expectErrorMessage`, `takeScreenshot`) en vez de repetirlos.
- Antes de crear una pagina o un metodo, revisa las existentes: `LoginPage`, `InventoryPage`, `CartPage`, `CheckoutPage`.
- Locators como getters, con selectores `data-test` cuando existan.
- Metodos de negocio en espanol; las validaciones se nombran `expectX`.

## Specs

- Agrupa con `test.describe()` y etiqueta con `{ tag: '@smoke' }` o `{ tag: '@regression' }`.
- El spec solo llama metodos del Page Object, sin locators ni logica de UI.
- Nada de `page.click(selector)` / `page.fill(selector, value)` ni `waitForTimeout()`.
- URL y credenciales salen de `process.env`; con un fallback (`|| 'valor'`) para que un valor vacio en CI no rompa la ejecucion.

## Utilidades (`tests/utils/`)

- Antes de crear un fixture, helper o dato de prueba, revisa lo que ya existe: `fixtures/auth.fixture.ts`, `helpers.ts` y `data/` (`usuarios.json`, `productos.csv`).
- Los datos de prueba van en `data/`, no escritos dentro del spec.
- Los helpers son funciones genericas que no dependen de una pagina; si dependen de una pagina, van en su Page Object.
