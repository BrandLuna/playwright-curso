/**
 * mcp-demo.ts — Material de aprendizaje (Clase 8)
 *
 * Este archivo NO se ejecuta en el pipeline ni en `npx playwright test`.
 * Es un ejemplo comentado de cómo razonaría un agente de IA usando las
 * herramientas de Playwright MCP (@playwright/mcp) para navegar
 * saucedemo.com de forma autónoma, sin un script de test fijo.
 *
 * En un entorno real, estas funciones "mcp*" las expone el servidor MCP
 * (configurado en un cliente como VS Code o Claude Desktop) y el agente
 * las invoca una por una segun lo que necesite hacer. Aqui se simulan
 * con tipos y comentarios para que el archivo compile y sirva de guia,
 * sin depender de un servidor MCP real en este repositorio.
 */

// ── Tipos que representan las herramientas expuestas por Playwright MCP ──

/** Snapshot de accesibilidad: representacion estructurada del DOM (roles, textos, refs) */
interface AccessibilitySnapshot {
  url: string;
  elements: { role: string; name: string; ref: string }[];
}

/** Firma de las "tools" que un agente MCP invocaria contra el servidor Playwright MCP */
interface PlaywrightMcpTools {
  browser_navigate(params: { url: string }): Promise<AccessibilitySnapshot>;
  browser_snapshot(): Promise<AccessibilitySnapshot>;
  browser_click(params: { ref: string; element: string }): Promise<AccessibilitySnapshot>;
  browser_type(params: { ref: string; element: string; text: string }): Promise<AccessibilitySnapshot>;
}

/**
 * Simulacion minima de las tools de Playwright MCP, solo para que este
 * archivo compile como ejemplo. En la vida real esto lo provee el servidor
 * MCP, no codigo del proyecto.
 */
const mcp: PlaywrightMcpTools = {
  async browser_navigate({ url }) {
    return { url, elements: [] };
  },
  async browser_snapshot() {
    return { url: 'https://www.saucedemo.com', elements: [] };
  },
  async browser_click({ element }) {
    console.log(`[mcp demo] click en: ${element}`);
    return { url: 'https://www.saucedemo.com/inventory.html', elements: [] };
  },
  async browser_type({ element, text }) {
    console.log(`[mcp demo] escribiendo "${text}" en: ${element}`);
    return { url: 'https://www.saucedemo.com', elements: [] };
  },
};

/**
 * Ejemplo del razonamiento paso a paso de un agente de IA usando Playwright MCP
 * para hacer login y agregar un producto al carrito en saucedemo.com.
 *
 * A diferencia de un test .spec.ts (flujo fijo, siempre igual), el agente
 * decide cada accion en base al snapshot que recibe en ese momento.
 */
async function demoAgenteNavegandoSauceDemo(): Promise<void> {
  // 1. El agente navega a la app y pide un snapshot de accesibilidad
  await mcp.browser_navigate({ url: 'https://www.saucedemo.com' });
  const loginSnapshot = await mcp.browser_snapshot();

  // 2. En base al snapshot, el agente "ve" el campo usuario/clave y decide llenarlos
  //    (en un caso real, "ref" vendria del snapshot devuelto por el servidor MCP)
  await mcp.browser_type({ ref: 'ref-username', element: 'campo usuario', text: 'standard_user' });
  await mcp.browser_type({ ref: 'ref-password', element: 'campo contrasena', text: 'secret_sauce' });
  await mcp.browser_click({ ref: 'ref-login-button', element: 'boton Login' });

  // 3. El agente vuelve a pedir un snapshot para confirmar que entro al inventario
  const inventorySnapshot = await mcp.browser_snapshot();

  // 4. Decide agregar el primer producto al carrito y navegar al carrito
  await mcp.browser_click({ ref: 'ref-add-backpack', element: 'boton Add to cart (Backpack)' });
  await mcp.browser_click({ ref: 'ref-cart-icon', element: 'icono del carrito' });

  // 5. El agente reporta el resultado final (esto es lo que un modelo de IA
  //    devolveria como resumen al usuario, no una aserción de test)
  console.log('Login OK:', loginSnapshot.url);
  console.log('Inventario cargado:', inventorySnapshot.url);
  console.log('Flujo completado: producto agregado al carrito.');
}

// Descomenta la siguiente linea solo si quieres correr la simulacion localmente con ts-node/tsx:
// demoAgenteNavegandoSauceDemo();

export { demoAgenteNavegandoSauceDemo };
