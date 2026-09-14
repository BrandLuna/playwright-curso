@Simple
Feature: Comparativa — Checkout sin World (variables let vs CustomWorld)
  # Este feature demuestra el enfoque SIN World para comparar con flujo-de-compra.feature.
  # PROBLEMA: browser/page/loginPage son variables "let" a nivel de modulo,
  # compartidas por TODOS los escenarios @Simple (no una instancia por escenario).
  # Con solo 1 escenario no se nota, pero no escala: al agregar un segundo
  # escenario (abajo) ambos dependen de las MISMAS variables globales, asi que
  # si alguna vez corrieran al mismo tiempo, uno pisaria el "page" del otro.
  # SOLUCIÓN correcta: usar CustomWorld (ver flujo-de-compra.feature), que le
  # da a cada escenario su propia instancia aislada de "page".
  #
  # Para intentar correr SOLO estos escenarios en paralelo:
  #   node --import tsx ./node_modules/@cucumber/cucumber/bin/cucumber.js --tags @Simple --parallel 2

  Scenario: Checkout directo con variables let (sin CustomWorld)
    Given visito la pagina de SauceDemo
    When me logeo con "standard_user" y contrasena "secret_sauce"
    And anado el backpack y voy al carrito
    Then hago el checkout

  Scenario: Segundo checkout reutilizando las mismas variables compartidas
    Given visito la pagina de SauceDemo
    When me logeo con "problem_user" y contrasena "secret_sauce"
    And anado el backpack y voy al carrito
    Then hago el checkout
