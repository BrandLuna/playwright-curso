Feature: Flujo de compra en SauceDemo
  Como usuario registrado
  Quiero completar una compra exitosamente
  Para recibir mis productos

  # Background se ejecuta antes de cada Scenario — evita repetir el Given inicial
  Background:
    Given el usuario navega a la pagina de SauceDemo

  @smoke @HappyPath
  Scenario: Checkout exitoso con producto en el carrito
    When inicia sesion con usuario "standard_user" y contrasena "secret_sauce"
    And agrega el backpack al carrito y va al carrito
    Then el usuario procede al checkout

  # Scenario Outline: ejecuta el mismo escenario con distintos conjuntos de datos
  @regression
  Scenario Outline: Checkout con diferentes usuarios validos
    When inicia sesion con usuario "<usuario>" y contrasena "<contrasena>"
    And agrega el backpack al carrito y va al carrito
    Then el usuario procede al checkout

    Examples:
      | usuario                 | contrasena   |
      | standard_user           | secret_sauce |
      | performance_glitch_user | secret_sauce |

