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

  # --- Login ---------------------------------------------------------------

  @smoke
  Scenario: Login fallido con credenciales incorrectas
    When inicia sesion con usuario "standard_user" y contrasena "clave_invalida"
    Then deberia ver el mensaje de error "Username and password do not match"

  @smoke @regression
  Scenario: Login fallido con usuario bloqueado
    When inicia sesion con usuario "locked_out_user" y contrasena "secret_sauce"
    Then deberia ver el mensaje de error "Sauce Labs backpack has been locked out"

  @regression
  Scenario: Login fallido con usuario inexistente
    When inicia sesion con usuario "usuario_inventado" y contrasena "secret_sauce"
    Then deberia ver el mensaje de error "Username and password do not match"

  # --- Inventario y carrito --------------------------------------------------

  @regression
  Scenario: Agregar multiples productos y verificar el contador del carrito
    When inicia sesion con usuario "standard_user" y contrasena "secret_sauce"
    And agrega 3 productos al carrito
    Then el contador del carrito debe mostrar "3"

  @regression
  Scenario: Quitar un producto del carrito antes de pagar
    When inicia sesion con usuario "standard_user" y contrasena "secret_sauce"
    And agrega el backpack al carrito y va al carrito
    And quita el primer producto del carrito
    Then el carrito debe tener 0 productos

  @regression
  Scenario: Ordenar productos de menor a mayor precio
    When inicia sesion con usuario "standard_user" y contrasena "secret_sauce"
    And ordena los productos por "Price (low to high)"
    Then el primer producto listado debe ser el mas barato

  # --- Checkout completo -----------------------------------------------------

  @smoke @regression
  Scenario: Checkout completo hasta la confirmacion del pedido
    When inicia sesion con usuario "standard_user" y contrasena "secret_sauce"
    And agrega el backpack al carrito y va al carrito
    And el usuario procede al checkout
    And completa sus datos con nombre "Juan", apellido "Perez" y codigo postal "12345"
    And finaliza la compra
    Then deberia ver el mensaje de confirmacion del pedido

  @regression
  Scenario: Checkout falla si faltan datos obligatorios
    When inicia sesion con usuario "standard_user" y contrasena "secret_sauce"
    And agrega el backpack al carrito y va al carrito
    And el usuario procede al checkout
    And intenta continuar sin completar sus datos
    Then deberia ver el mensaje de error "Error: First Name is required"

