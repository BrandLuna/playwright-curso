// tests/utils/helpers.ts
// Funciones genéricas reutilizables — no dependen de ningún framework específico

/**
 * Genera una cadena aleatoria útil para datos de prueba únicos
 * Ejemplo: generateId('user') → 'user-a3f2b1'
 */
export function generateId(prefix = 'test'): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Formatea una fecha como string legible para nombres de archivos o reportes
 * Ejemplo: formatDate() → '2026-08-05_14-30-00'
 */
export function formatDate(date = new Date()): string {
  return date.toISOString().replace('T', '_').replace(/:/g, '-').split('.')[0];
}

/**
 * Pausa la ejecución — solo para depuración manual, nunca en CI
 * Reemplaza al waitForTimeout de Playwright en contextos no-Playwright
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
