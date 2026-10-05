@smoke
Feature: Variables de entorno en BDD
  Como QA automatizador
  Quiero que la URL y las credenciales vengan de .env
  Para no hardcodear datos sensibles en los features ni en el codigo

  # El Given de abajo esta definido en flujo-de-compra.steps.ts, no en environments.steps.ts
  # (demuestra que un .feature no esta atado a un .steps.ts del mismo nombre: Cucumber
  # junta TODOS los steps de tests/step-definitions/ sin importar en que archivo viven)
  Scenario: Login con las credenciales del archivo .env
    Given el usuario navega a la pagina de SauceDemo
    When inicia sesion con las credenciales del entorno
    Then deberia ver el inventario con 6 productos
