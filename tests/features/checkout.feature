Feature: Checkout flow en SauceDemo
@Login @HappyPath
  Scenario: Usuario realiza checkout con producto en el carrito
    Given el usuario navega a la pagina de SauceDemo
    When inicia sesion con usuario "standard_user" y contrasena "secret_sauce"
    And agrega el backpack al carrito y va al carrito
    Then el usuario procede al checkout


@Login2 @HappyPath2
  Scenario: Usuario realiza checkout con producto en el carrito
    Given el usuario navega a la pagina de SauceDemo
    When inicia sesion con usuario "standard_user" y contrasena "secret_sauce"
    And agrega el backpack al carrito y va al carrito
    Then el usuario procede al checkout
