@Simple
Feature: Comparativa — Checkout sin World (variables let vs CustomWorld)
  # Este feature demuestra el enfoque SIN World para comparar con flujo-de-compra.feature.
  # PROBLEMA: estado compartido entre escenarios si se ejecutan en paralelo.
  # SOLUCIÓN correcta: usar CustomWorld (ver flujo-de-compra.feature)
  #
  # Cómo ejecutar SOLO este feature (filtrando por su tag @Simple):
  #   node --import tsx ./node_modules/@cucumber/cucumber/bin/cucumber.js --tags @Simple
  #
  # Por qué NO funcionaría en paralelo:
  # browser/page/loginPage, etc. son variables "let" a nivel de módulo en
  # comparativa-sin-world.steps.ts — se crean UNA sola vez y las comparten
  # TODOS los escenarios @Simple. Si Cucumber corriera 2+ escenarios @Simple
  # en paralelo (--parallel 2), ambos escenarios usarían el mismo "page" al
  # mismo tiempo: un escenario podría navegar a otra URL mientras el otro
  # todavía está leyendo el carrito, y los resultados se pisarían entre sí.
  # Con CustomWorld (flujo-de-compra.feature) cada escenario recibe su propia
  # instancia de "page", por eso ese sí es seguro para correr en paralelo.

  Scenario: Checkout directo con variables let (sin CustomWorld)
    Given visito la pagina de SauceDemo
    When me logeo con "standard_user" y contrasena "secret_sauce"
    And anado el backpack y voy al carrito
    Then hago el checkout
