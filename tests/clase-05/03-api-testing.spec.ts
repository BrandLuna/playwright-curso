// Clase 5 — B3: API Testing básico con Playwright
// Playwright puede hacer peticiones HTTP sin abrir el navegador.
// Útil para: crear datos de prueba, verificar APIs, acelerar el setup de tests.
// Ejecutar: npx playwright test tests/clase-05/03-api-testing.spec.ts

import { test, expect, request } from '@playwright/test';

// saucedemo no tiene una API pública, así que usamos una API de prueba gratuita
// jsonplaceholder.typicode.com — simula una API REST real
const API_BASE = 'https://jsonplaceholder.typicode.com';

test.describe('API Testing con Playwright request context', () => {
  test('GET — obtener lista de usuarios', { tag: '@smoke' }, async () => {
    // request.newContext() crea un cliente HTTP independiente del navegador
    const apiContext = await request.newContext({ baseURL: API_BASE });

    const response = await apiContext.get('/users');

    // assertions de API: status code y estructura de respuesta
    expect(response.status()).toBe(200);
    const users = await response.json();
    expect(users).toHaveLength(10);
    expect(users[0]).toHaveProperty('name');
    expect(users[0]).toHaveProperty('email');

    await apiContext.dispose();
  });

  test('GET — obtener un usuario por ID', { tag: '@regression' }, async () => {
    const apiContext = await request.newContext({ baseURL: API_BASE });

    const response = await apiContext.get('/users/1');

    expect(response.status()).toBe(200);
    const user = await response.json();
    expect(user.id).toBe(1);
    expect(user).toHaveProperty('username');

    await apiContext.dispose();
  });

  test('POST — crear un recurso', { tag: '@regression' }, async () => {
    const apiContext = await request.newContext({ baseURL: API_BASE });

    const response = await apiContext.post('/posts', {
      data: { title: 'Test QA', body: 'Playwright API test', userId: 1 },
    });

    // jsonplaceholder devuelve 201 Created
    expect(response.status()).toBe(201);
    const post = await response.json();
    expect(post).toHaveProperty('id');
    expect(post.title).toBe('Test QA');

    await apiContext.dispose();
  });
});

// CASO DE USO REAL: en un proyecto con auth, usarías la API para:
//   1. Crear un usuario via POST /users antes del test de UI
//   2. Ejecutar el test de UI con ese usuario
//   3. Eliminar el usuario via DELETE /users/:id en afterEach
// Esto hace el test independiente y más rápido que hacer todo por UI
