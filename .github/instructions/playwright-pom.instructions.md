---
description: "Reglas de Page Objects y specs de Playwright en este proyecto. Usar al crear o editar paginas en pages/ o specs que usan POM."
applyTo: "pages/**/*.ts,tests/**/*.spec.ts"
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
