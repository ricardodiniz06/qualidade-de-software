import { test, expect } from '@playwright/test';
import { v4 as uuidv4 } from 'uuid';

const BASE = 'http://localhost:8080';

/**
 * TESTES DE API (Caixa-Preta) — Autenticação
 */

test.describe('API - POST /auth/signup', () => {

  test('[API] signup com dados válidos retorna 200/201 e id do usuário', async ({ request }) => {
    const email = `api.${uuidv4().substring(0, 8)}@test.com`;

    const response = await request.post(`${BASE}/auth/signup`, {
      data: { email, password: 'Forte@123' },
    });

    expect(response.status()).toBeGreaterThanOrEqual(200);
    expect(response.status()).toBeLessThan(300);

    const body = await response.json();
    expect(body).toHaveProperty('id');
    expect(body.id).toBeGreaterThan(0);
  });

  test('[API-BUG B2] signup com e-mail duplicado retorna 409 e "E-mail já está em uso"', async ({ request }) => {
    const email = `dup.api.${uuidv4().substring(0, 8)}@test.com`;

    await request.post(`${BASE}/auth/signup`, {
      data: { email, password: 'Forte@123' },
    });

    const response = await request.post(`${BASE}/auth/signup`, {
      data: { email, password: 'Forte@123' },
    });

    expect(response.status()).toBe(409);
    const body = await response.json();
    // Requisito seria "E-mail já cadastrado", mas o atual é "E-mail já está em uso"
    expect(body.message).toContain('E-mail já está em uso');
  });

  test('[API] signup com senha fraca retorna 422 com mensagem de erro', async ({ request }) => {
    const response = await request.post(`${BASE}/auth/signup`, {
      data: { email: `fraca.${uuidv4().substring(0, 6)}@test.com`, password: 'fraca' },
    });

    expect(response.status()).toBe(422);
    const body = await response.json();
    expect(body.message).toContain('Senha inválida');
  });
});

test.describe('API - POST /auth/signin', () => {

  test('[API] signin com credenciais corretas retorna 200', async ({ request }) => {
    const email = `signin.${uuidv4().substring(0, 8)}@test.com`;

    await request.post(`${BASE}/auth/signup`, {
      data: { email, password: 'Forte@123' },
    });

    const response = await request.post(`${BASE}/auth/signin`, {
      data: { email, password: 'Forte@123' },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.email).toBe(email);
  });

  test('[API] signin com credenciais erradas retorna 401', async ({ request }) => {
    const response = await request.post(`${BASE}/auth/signin`, {
      data: { email: 'naoexiste@test.com', password: 'Errada@123' },
    });

    expect(response.status()).toBe(401);
  });
});
