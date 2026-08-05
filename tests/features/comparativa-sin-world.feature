@Simple
Feature: Comparativa — Checkout sin World (variables let vs CustomWorld)
  # Este feature demuestra el enfoque SIN World para comparar con flujo-de-compra.feature.
  # PROBLEMA: estado compartido entre escenarios si se ejecutan en paralelo.
  # SOLUCIÓN correcta: usar CustomWorld (ver flujo-de-compra.feature)

  Scenario: Checkout directo con variables let (sin CustomWorld)
    Given visito la pagina de SauceDemo
    When me logeo con "standard_user" y contrasena "secret_sauce"
    And anado el backpack y voy al carrito
    Then hago el checkout
