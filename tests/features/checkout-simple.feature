@Simple
Feature: Checkout flow en SauceDemo (version simple sin World)

  Scenario: Usuario realiza checkout - enfoque directo con variables let
    Given visito la pagina de SauceDemo
    When me logeo con "standard_user" y contrasena "secret_sauce"
    And anado el backpack y voy al carrito
    Then hago el checkout
