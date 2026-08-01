import { describe, it, expect } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcrypt';
import { app } from './src/serve.js';
import { prisma } from './src/prisma.js';

describe('Rotas de Autenticação - Testes de Integração', () => {
  const userData = {
    name: 'Integration Test User',
    // Usar um e-mail diferente para cada suíte para evitar colisões se os testes rodarem em paralelo no futuro
    email: `integration-${Date.now()}@test.com`,
    password: 'password123',
  };

  // O hook beforeEach garante que o banco de dados está limpo antes de cada `it`

  it('POST /api/auth/register - deve registrar um novo usuário com sucesso', async () => {
    // 1. Faz a requisição HTTP para a API
    const response = await request(app)
      .post('/api/auth/register')
      .send(userData);

    // 2. Verifica a resposta da API
    expect(response.status).toBe(201);
    expect(response.body.user).toBeDefined();
    expect(response.body.user.email).toBe(userData.email);
    expect(response.body.user.password).toBeUndefined(); // Garante que a senha não foi retornada

    // 3. Verifica diretamente no banco de dados de teste
    const userInDb = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    expect(userInDb).not.toBeNull();
    expect(userInDb?.name).toBe(userData.name);
  });

  it('POST /api/auth/register - deve retornar erro 409 se o e-mail já existir', async () => {
    // 1. Cria um usuário no banco de dados para simular a condição de e-mail existente.
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
      },
    });

    // 2. Tenta registrar o mesmo usuário novamente.
    const response = await request(app)
      .post('/api/auth/register')
      .send(userData);

    expect(response.status).toBe(409);
    expect(response.body.error).toBe('E-mail já cadastrado.');
  });

  // Você pode adicionar aqui o teste de login, que também se beneficiará do setup isolado.
  it('POST /api/auth/login - deve autenticar um usuário com sucesso', async () => {
    // 1. Cria o usuário necessário para o teste de login.
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
      },
    });

    // 2. Tenta fazer o login.
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: userData.email,
        password: userData.password,
      });

    // 3. Verifica a resposta.
    expect(response.status).toBe(200);
    expect(response.body.user).toBeDefined();
    expect(response.body.token).toBeDefined();
    expect(response.body.user.email).toBe(userData.email);
  });
});